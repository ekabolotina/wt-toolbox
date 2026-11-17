import { feViewerAction } from '../actions/feViewerAction.js';
import { writeClipboard } from './writeClipboard.js';

export class FEViewerClient {
  isRecording = false;
  sessionId;
  onChange = () => {};
  disposed = false;
  timer;
  documentId;
  polling = false;
  closing = false;

  constructor(tabId, token, ensurePort) {
    this.tabId = tabId;
    this.token = token;
    this.ensurePort = ensurePort;
  }

  async request(method, command) {
    if (this.disposed || (this.closing && method !== 'close')) {
      throw new Error('Подключение FE закрыто');
    }

    this.ensurePort();

    const reply = await feViewerAction.execute({
      tabId: this.tabId,
      documentId: this.documentId,
      request: { token: this.token, method, command },
    });

    if (this.disposed) {
      throw new Error('Страница изменилась');
    }

    if (!reply?.ok || reply.data?.version !== 2) {
      throw new Error(reply?.error || 'Несовместимая версия FE Messages');
    }

    this.documentId = reply.documentId;
    const state = reply.data.state;

    if (this.isRecording !== state.recording) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.isRecording = state.recording;
    this.sessionId = state.sessionId;
    this.onChange(state.session, state.error);

    if (method !== 'close' && method !== 'reload') {
      this.schedule();
    }

    return reply.data.value;
  }

  schedule() {
    if (this.disposed || this.closing || this.timer || this.polling) {
      return;
    }

    this.timer = setTimeout(
      async () => {
        this.timer = undefined;
        this.polling = true;
        try {
          try {
            await this.request('state');
          } catch {
            if (!this.disposed && !this.closing) {
              await this.request('connect');
            }
          }
        } catch (error) {
          if (!this.disposed && !this.closing) {
            this.onChange(undefined, String(error));
          }
        } finally {
          this.polling = false;
          this.schedule();
        }
      },
      this.isRecording ? 1000 : 5000,
    );
  }

  rpc(command) {
    return this.request('rpc', command);
  }

  copy(text) {
    return writeClipboard(text);
  }
  start() {
    return this.request('start');
  }
  stop() {
    return this.request('stop');
  }
  reload() {
    return this.request('reload');
  }

  invalidate() {
    this.disposed = true;
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  async close() {
    this.closing = true;
    try {
      if (!this.disposed) {
        await this.request('close');
      }
    } finally {
      this.invalidate();
    }
  }
}
