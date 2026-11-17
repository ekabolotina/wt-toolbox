import { matchesFEValue } from './matchesFEValue.js';
import { FE_LIMITS } from './limits.js';
const { HISTORY_LIMIT, PAGE_SIZE } = FE_LIMITS;

export class FEHistory {
  db;
  limit;
  exportRecord;
  sessionLocks = new Map();
  constructor(db, limit = HISTORY_LIMIT) {
    this.db = db;
    this.limit = limit;
  }
  async holdLock(name, mode = 'exclusive') {
    if (!navigator.locks) {
      return () => undefined;
    }

    return new Promise((resolve, reject) => {
      void navigator.locks
        .request(name, { mode, ifAvailable: true }, async (lock) => {
          if (!lock) {
            reject(new Error('История FE занята: сначала остановите запись во всех вкладках'));

            return;
          }

          await new Promise((release) => resolve(release));
        })
        .catch(reject);
    });
  }
  async createSession(id, origin) {
    const session = { id, startedAt: Date.now(), count: 0, bytes: 0, origin };
    const releaseHistory = await this.holdLock(`terminal-fe-history:${this.db.name}`, 'shared');
    let releaseSession;

    try {
      releaseSession = await this.holdLock(`terminal-fe-session:${id}`);
      await this.db.add('sessions', session);
      this.sessionLocks.set(id, () => {
        releaseSession?.();
        releaseHistory();
      });
    } catch (error) {
      releaseSession?.();
      releaseHistory();
      throw error;
    }

    return session;
  }
  async append(sessionId, records, batchId) {
    const tx = await this.db.transaction(['sessions', 'messages', 'meta'], 'readwrite');

    void tx.done.catch(() => undefined);
    const session = await tx.objectStore('sessions').get(sessionId);
    const total = (await tx.objectStore('meta').get('bytes')) ?? 0;
    const bytes = records.reduce((sum, record) => sum + record.bytes, 0);
    const acknowledged = (await tx.objectStore('meta').get(`transfer:${sessionId}`)) ?? 0;

    if (session && batchId !== undefined && batchId <= acknowledged) {
      await tx.done;

      return session;
    }

    if (batchId !== undefined && batchId !== acknowledged + 1) {
      tx.abort();
      await tx.done.catch(() => undefined);
      throw new Error('Нарушен порядок пачек FE');
    }

    if (!session || session.endedAt || total + bytes > this.limit) {
      tx.abort();
      await tx.done.catch(() => undefined);
      throw new Error('Запись остановлена: превышен лимит истории или сеанс закрыт');
    }

    const writes = records.map((record) => {
      session.count++;

      return tx.objectStore('messages').add({ ...record, sessionId, seq: session.count });
    });

    await Promise.all(writes);
    session.bytes += bytes;
    await tx.objectStore('sessions').put(session);
    await tx.objectStore('meta').put(total + bytes, 'bytes');
    if (batchId !== undefined) {
      await tx.objectStore('meta').put(batchId, `transfer:${sessionId}`);
    }

    await tx.done;

    return session;
  }
  async finish(sessionId, error) {
    try {
      const tx = await this.db.transaction('sessions', 'readwrite');

      void tx.done.catch(() => undefined);
      const session = await tx.store.get(sessionId);

      if (session) {
        session.endedAt = Date.now();
        session.error = error ?? session.error;
        await tx.store.put(session);
      }

      await tx.done;
    } finally {
      this.sessionLocks.get(sessionId)?.();
      this.sessionLocks.delete(sessionId);
    }
  }
  async markPartialStart(sessionId) {
    const tx = await this.db.transaction('sessions', 'readwrite');
    const session = await tx.store.get(sessionId);

    if (session) {
      session.partialStart = true;
      await tx.store.put(session);
    }

    await tx.done;

    return session;
  }
  async recoverInterrupted() {
    if (!navigator.locks) {
      return;
    }

    let before;
    let page;

    do {
      page = await this.sessions(before);
      for (const session of page) {
        if (!session.endedAt) {
          await navigator.locks.request(
            `terminal-fe-session:${session.id}`,
            { ifAvailable: true },
            async (lock) => {
              if (lock) {
                const current = await this.db.get('sessions', session.id);

                if (current && !current.endedAt) {
                  await this.finish(session.id, 'Запись прервана при закрытии или сбое расширения');
                }
              }
            },
          );
        }
      }
      before = page[page.length - 1]?.id;
    } while (page.length === 100);
  }
  async sessions(before) {
    const sessions = [];
    const tx = await this.db.transaction('sessions');
    let cursor = await tx.store.openCursor(
      before ? IDBKeyRange.upperBound(before, true) : null,
      'prev',
    );

    while (cursor && sessions.length < 100) {
      sessions.push(cursor.value);
      cursor = await cursor.continue();
    }

    return sessions;
  }
  async page(
    filter,
    next,
    maxSeq = Infinity,
    cancelled = () => false,
    limit = PAGE_SIZE,
    probe = false,
  ) {
    const entity = filter.entity.trim();
    const lower = entity
      ? [filter.sessionId, entity, filter.from, 0]
      : [filter.sessionId, filter.from, 0];
    const upper = entity
      ? [filter.sessionId, entity, filter.to, Infinity]
      : [filter.sessionId, filter.to, Infinity];
    const range = IDBKeyRange.bound(lower, next ?? upper, false, Boolean(next));
    const tx = await this.db.transaction('messages');
    let cursor = await tx.store.index(entity ? 'entityTime' : 'time').openCursor(range, 'prev');
    const result = { rows: [], scanned: 0, next };
    const deadline = performance.now() + 8;
    let scannedBytes = 0;

    while (
      cursor &&
      (probe || result.rows.length < Math.min(PAGE_SIZE, limit)) &&
      result.scanned < 1000 &&
      !cancelled()
    ) {
      const record = cursor.value;

      result.scanned++;
      scannedBytes += record.bytes;
      if (
        record.seq <= maxSeq &&
        (!filter.fe || String(record.fe) === filter.fe) &&
        (!filter.direction || record.direction === filter.direction) &&
        matchesFEValue(record.json, filter)
      ) {
        if (probe) {
          result.matched = true;
          break;
        }

        const row = { ...record };

        delete row.json;

        result.rows.push(row);
      }

      result.next = cursor.key;
      cursor = await cursor.continue();
      if (scannedBytes >= 1048576 || performance.now() >= deadline) {
        break;
      }
    }
    if (!cursor) {
      result.next = undefined;
    }

    await tx.done;

    return result;
  }
  async readJSON(sessionId, seq) {
    const record = await this.db.get('messages', [sessionId, seq]);

    if (!record) {
      throw new Error('Сообщение не найдено');
    }

    return record.json;
  }
  async exportChunk(sessionId, after, maxSeq, offset = 0) {
    if (!offset && after >= maxSeq) {
      this.exportRecord = undefined;

      return { text: '', next: undefined, offset: 0 };
    }

    const cached =
      offset && this.exportRecord?.sessionId === sessionId && this.exportRecord.seq === after
        ? this.exportRecord
        : undefined;

    this.exportRecord = undefined;
    const tx = cached ? undefined : await this.db.transaction('messages');
    let cursor = await tx?.store.openCursor(
      IDBKeyRange.bound([sessionId, after], [sessionId, maxSeq], !offset, false),
    );

    if (offset && (cached?.seq ?? cursor?.value.seq) !== after) {
      throw new Error('Экспортируемое сообщение удалено');
    }

    const parts = [];
    let length = 0;
    let seq = after;
    let count = 0;
    const deadline = performance.now() + 8;

    while ((cursor || cached) && length < 65536 && count < 100) {
      const record = cached ?? cursor?.value;

      if (!record) {
        break;
      }

      const { json, ...meta } = record;
      const prefix = JSON.stringify(meta).slice(0, -1) + ',"message":';

      if (offset >= prefix.length + json.length + 2) {
        throw new Error('Неверная позиция экспорта');
      }

      let end = Math.min(prefix.length + json.length + 2, offset + 65536 - length);
      const last =
        end <= prefix.length
          ? prefix.charCodeAt(end - 1)
          : json.charCodeAt(end - prefix.length - 1);

      // Each fragment is encoded independently when streaming to a file
      if (last >= 0xd800 && last <= 0xdbff) {
        end--;
      }

      const part =
        prefix.slice(offset, end) +
        json.slice(Math.max(0, offset - prefix.length), Math.max(0, end - prefix.length)) +
        '}\n'.slice(
          Math.max(0, offset - prefix.length - json.length),
          Math.max(0, end - prefix.length - json.length),
        );

      parts.push(part);
      count++;
      length += part.length;
      seq = record.seq;
      if (end < prefix.length + json.length + 2) {
        this.exportRecord = record;

        return { text: parts.join(''), next: seq, offset: end };
      }

      if (cached) {
        return { text: parts.join(''), next: seq < maxSeq ? seq : undefined, offset: 0 };
      }

      offset = 0;
      cursor = await cursor?.continue();
      if (performance.now() >= deadline) {
        break;
      }
    }

    return { text: parts.join(''), next: cursor ? seq : undefined, offset: 0 };
  }
  async remove(sessionId) {
    if (this.exportRecord?.sessionId === sessionId) {
      this.exportRecord = undefined;
    }

    if (navigator.locks) {
      return navigator.locks.request(
        `terminal-fe-session:${sessionId}`,
        { ifAvailable: true },
        async (lock) => {
          if (!lock) {
            throw new Error('Нельзя удалить сеанс, который записывается в другой вкладке');
          }

          await this.deleteSession(sessionId);
        },
      );
    }

    const session = await this.db.get('sessions', sessionId);

    if (session && !session.endedAt) {
      throw new Error('Сначала остановите запись выбранного сеанса');
    }

    return this.deleteSession(sessionId);
  }
  async deleteSession(sessionId) {
    const tx = await this.db.transaction(['sessions', 'messages', 'meta'], 'readwrite');

    void tx.done.catch(() => undefined);
    const session = await tx.objectStore('sessions').get(sessionId);

    await tx
      .objectStore('messages')
      .delete(IDBKeyRange.bound([sessionId, 0], [sessionId, Infinity]));
    await tx.objectStore('sessions').delete(sessionId);
    await tx.objectStore('meta').delete(`transfer:${sessionId}`);
    const total = (await tx.objectStore('meta').get('bytes')) ?? 0;

    await tx.objectStore('meta').put(Math.max(0, total - (session?.bytes ?? 0)), 'bytes');
    await tx.done;
  }
  async removeAll() {
    this.exportRecord = undefined;
    const release = await this.holdLock(`terminal-fe-history:${this.db.name}`);

    try {
      const tx = await this.db.transaction(['sessions', 'messages', 'meta'], 'readwrite');

      void tx.done.catch(() => undefined);
      if (!navigator.locks) {
        let cursor = await tx.objectStore('sessions').openCursor();

        while (cursor) {
          if (!cursor.value.endedAt) {
            tx.abort();
            await tx.done.catch(() => undefined);
            throw new Error('Сначала остановите запись во всех вкладках');
          }

          cursor = await cursor.continue();
        }
      }

      await Promise.all([
        tx.objectStore('sessions').clear(),
        tx.objectStore('messages').clear(),
        tx.objectStore('meta').clear(),
      ]);
      await tx.done;
    } finally {
      release();
    }
  }
  close() {
    this.exportRecord = undefined;
    for (const release of this.sessionLocks.values()) {
      release();
    }
    this.sessionLocks.clear();
    this.db.close();
  }
}
