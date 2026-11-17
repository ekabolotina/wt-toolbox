import { feCaptureAction } from '../actions/feCaptureAction.js';
import { FEHistoryWorker } from './FEHistoryWorker.js';

export class FECaptureSession {
  history = new FEHistoryWorker();
  recording = false;
  session;
  error;
  documentId;
  parts = [];
  length = 0;
  batchId;
  committed = 0;
  ack;
  pending = Promise.resolve();

  constructor(tabId, token) {
    this.tabId = tabId;
    this.token = token;
  }

  async page(method, extra = {}) {
    const reply = await feCaptureAction.execute({
      tabId: this.tabId,
      documentId: this.documentId,
      request: { token: this.token, method, ...extra },
    });

    if (!reply?.ok || reply.data?.version !== 2) {
      throw new Error(reply?.error || 'Нужна сборка терминала с FE capture API v2');
    }

    this.documentId = reply.documentId;

    return reply.data;
  }

  lifecycle(action) {
    const result = this.pending.then(action);

    this.pending = result.catch(() => undefined);

    return result;
  }

  async begin(reload = false) {
    await this.failing;
    await this.stop();
    await this.pumping;
    this.error = undefined;
    this.documentId = undefined;
    await this.page('connect');
    const sessionId = `${new Date().toISOString()}-${crypto.randomUUID()}`;

    this.session = await this.history.rpc({ method: 'start', sessionId, origin: this.origin });
    this.parts = [];
    this.length = 0;
    this.committed = 0;
    this.ack = undefined;
    this.batchId = undefined;
    this.recording = true;
    this.reloading = reload;
    try {
      await this.page(reload ? 'reload' : 'start', { sessionId });
      if (reload) {
        this.documentId = undefined;
      }

      this.pumping = this.pump();
      this.keepAlive();
    } catch (error) {
      await this.fail(error);
      throw error;
    }
  }

  async pump() {
    let retryUntil = this.reloading ? Date.now() + 15000 : 0;

    while (this.recording) {
      try {
        if (this.history.closed) {
          throw new Error('Worker истории расширения FE завершился с ошибкой');
        }

        if (this.reloading) {
          this.documentId = undefined;
          const connected = await this.page('connect');

          if (!connected.state.recording || connected.state.sessionId !== this.session.id) {
            throw new Error('Ожидание захвата FE в новом документе');
          }
        }

        const reply = await this.page('pull', { ack: this.ack });

        if (!this.recording) {
          return;
        }

        this.ack = undefined;
        this.reloading = false;
        retryUntil = 0;
        const { chunk, session } = reply.value;

        if (session?.partialStart && !this.session.partialStart) {
          this.session = await this.history.rpc({
            method: 'partial-start',
            sessionId: this.session.id,
          });
        }

        if (chunk) {
          if (chunk.id > this.committed) {
            if (this.batchId !== chunk.id) {
              if (chunk.from !== 0 || this.length) {
                throw new Error('Нарушен порядок фрагментов FE');
              }

              this.batchId = chunk.id;
            }

            if (chunk.from === this.length) {
              this.parts.push(chunk.text);
              this.length += chunk.text.length;
            }

            if (this.length !== chunk.end || this.length > 64 * 1048576) {
              throw new Error('Превышен бюджет или нарушен порядок передачи FE');
            }

            if (chunk.done) {
              const json = this.parts.join('');

              this.parts = [];
              this.length = 0;
              this.session = await this.history.rpc({
                method: 'ingest',
                sessionId: this.session.id,
                batchId: chunk.id,
                json,
              });
              this.committed = chunk.id;
            }
          }

          this.ack = { id: chunk.id, offset: chunk.end };
        } else {
          if (!reply.state.recording && !this.stopping) {
            throw new Error(reply.state.error || 'Захват FE на странице остановлен');
          }

          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        if (this.reloading && Date.now() < retryUntil) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }

        await this.fail(error);
      }
    }
  }

  fail(error) {
    if (!this.failing) {
      this.failing = this.cleanupFailure(error).finally(() => {
        this.failing = undefined;
      });
    }

    return this.failing;
  }

  async cleanupFailure(error) {
    this.error ??= String(error);
    this.recording = false;
    clearTimeout(this.heartbeat);
    this.parts = [];
    this.length = 0;
    await this.page('abort', { error: this.error.slice(0, 1000) }).catch(() => undefined);
    await this.page('close').catch(() => undefined);
    if (this.session) {
      if (this.history.closed) {
        this.history = new FEHistoryWorker();
      }

      await this.history
        .rpc({ method: 'stop', sessionId: this.session.id, error: this.error })
        .catch(() => undefined);
    }
  }

  async stop() {
    if (!this.recording) {
      return;
    }

    this.stopping = true;
    try {
      const stopped = await this.page('stop');

      this.error ??= stopped.state.error;
      this.recording = false;
      clearTimeout(this.heartbeat);
      await this.pumping;
      await this.history.rpc({ method: 'stop', sessionId: this.session.id, error: this.error });
      this.session =
        (await this.history.rpc({ method: 'sessions' })).find(
          (session) => session.id === this.session.id,
        ) ?? this.session;
      await this.page('close');
    } catch (error) {
      await this.fail(error);
      throw error;
    } finally {
      this.stopping = false;
    }
  }

  async navigate(documentId) {
    if (!this.reloading && documentId !== this.documentId && this.recording) {
      await this.fail('Страница перешла в другой документ: запись завершена');
    }
  }

  keepAlive() {
    clearTimeout(this.heartbeat);
    if (!this.recording) {
      return;
    }

    this.heartbeat = setTimeout(async () => {
      const documentId = this.documentId;
      const sessionId = this.session?.id;
      const current = () =>
        this.recording && documentId === this.documentId && sessionId === this.session?.id;

      try {
        if (documentId && !this.reloading && this.recording) {
          const reply = await feCaptureAction.execute({
            tabId: this.tabId,
            documentId,
            request: { token: this.token, method: 'state' },
          });

          if (!reply?.ok && current()) {
            await this.fail(reply?.error || 'Потеряна связь с захватом FE');
          }
        }
      } catch (error) {
        if (current()) {
          await this.fail(error);
        }
      } finally {
        if (current()) {
          this.keepAlive();
        }
      }
    }, 5000);
  }

  async close() {
    try {
      await this.failing;
      await this.stop();
      await this.pumping;
    } finally {
      this.recording = false;
      clearTimeout(this.heartbeat);
      await this.page('close').catch(() => undefined);
      await this.history.close();
    }
  }
}
