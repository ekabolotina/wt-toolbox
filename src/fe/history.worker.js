import { FEHistory } from './FEHistory.js';
import { openFEDatabase } from './openFEDatabase.js';
import { FEJSONDocument } from './FEJSONDocument.js';
import { FE_LIMITS } from './limits.js';
const { QUEUE_LIMIT } = FE_LIMITS;
const scope = self;
const historyPromise = openFEDatabase().then(async (db) => {
  const history = new FEHistory(db);

  await history.recoverInterrupted();

  return history;
});
const failedSessions = new Map();
let queue = Promise.resolve();
let queryVersion = 0;
let detailVersion = 0;
let inspected;
let inspectRead = Promise.resolve();

async function inspectDocument(history, sessionId, seq, version) {
  if (version !== detailVersion) {
    throw new Error('Просмотр сообщения отменён');
  }

  const key = JSON.stringify([sessionId, seq]);

  if (inspected?.key !== key) {
    inspected = undefined;
    let selected;
    const document = inspectRead.then(async () => {
      if (inspected !== selected) {
        throw new Error('Просмотр сообщения отменён');
      }

      const json = await history.readJSON(sessionId, seq);

      if (inspected !== selected) {
        throw new Error('Просмотр сообщения отменён');
      }

      return new FEJSONDocument(json);
    });

    selected = { key, document };
    inspected = selected;
    inspectRead = document.then(
      () => undefined,
      () => undefined,
    );
  }

  const selected = inspected;

  try {
    const document = await selected.document;

    if (version !== detailVersion || inspected !== selected) {
      throw new Error('Просмотр сообщения отменён');
    }

    return document;
  } catch (error) {
    if (inspected === selected && version === detailVersion) {
      inspected = undefined;
    }

    throw error;
  }
}
async function execute(command, version, detail) {
  const history = await historyPromise;

  if (command.method === 'ingest' && failedSessions.has(command.sessionId)) {
    throw new Error('Запись сеанса остановлена после ошибки');
  }

  switch (command.method) {
    case 'sessions':
      return history.sessions(command.before);
    case 'start':
      failedSessions.clear();

      return history.createSession(command.sessionId, command.origin);
    case 'ingest': {
      if (
        command.json.length > QUEUE_LIMIT / 2 ||
        !Number.isSafeInteger(command.batchId) ||
        command.batchId < 1
      ) {
        throw new Error('Неверная пачка передачи FE');
      }

      const decoded = JSON.parse(command.json);

      if (!Array.isArray(decoded) || decoded.length > 100000) {
        throw new Error('Неверные записи FE');
      }

      const records = decoded.map((record) => {
        if (
          !record ||
          typeof record.json !== 'string' ||
          typeof record.entity !== 'string' ||
          record.entity.length > 1000 ||
          typeof record.source !== 'string' ||
          record.source.length > 1000 ||
          !['IN', 'OUT'].includes(record.direction) ||
          !Number.isSafeInteger(record.at) ||
          !Number.isSafeInteger(record.fe) ||
          !Number.isSafeInteger(record.connectionId)
        ) {
          throw new Error('Неверные метаданные FE');
        }

        return {
          at: record.at,
          fe: record.fe,
          source: record.source,
          connectionId: record.connectionId,
          direction: record.direction,
          entity: record.entity,
          json: record.json,
          bytes: new TextEncoder().encode(record.json).byteLength,
        };
      });

      return history.append(command.sessionId, records, command.batchId);
    }
    case 'stop':
      return history.finish(
        command.sessionId,
        command.error ?? failedSessions.get(command.sessionId),
      );
    case 'partial-start':
      return history.markPartialStart(command.sessionId);
    case 'page':
      if (version !== queryVersion) {
        return { rows: [], scanned: 0 };
      }

      return history.page(
        command.filter,
        command.next,
        command.maxSeq,
        () => version !== queryVersion,
        command.limit,
        command.probe,
      );
    case 'inspect': {
      const document = await inspectDocument(history, command.sessionId, command.seq, detail);

      return document.page(
        command.offset,
        command.after,
        command.filter,
        () => detail !== detailVersion,
        command.through,
        command.describeArrays,
        command.limit,
        command.probe,
      );
    }
    case 'inspect-array': {
      const document = await inspectDocument(history, command.sessionId, command.seq, detail);

      return document.segments(
        command.offset,
        command.from,
        command.to,
        () => detail !== detailVersion,
      );
    }
    case 'inspect-text': {
      const document = await inspectDocument(history, command.sessionId, command.seq, detail);

      return document.text(command.offset, command.from, () => detail !== detailVersion);
    }
    case 'inspect-clear':
      return undefined;
    case 'export':
      return history.exportChunk(command.sessionId, command.after, command.maxSeq, command.offset);
    case 'remove':
      return history.remove(command.sessionId);
    case 'remove-all':
      return history.removeAll();
    case 'cancel':
      return undefined;
    case 'close':
      history.close();

      return undefined;
  }
}
scope.onmessage = ({ data: { id, command } }) => {
  if (
    [
      'inspect',
      'inspect-array',
      'inspect-text',
      'inspect-clear',
      'remove',
      'remove-all',
      'close',
    ].includes(command.method)
  ) {
    detailVersion++;
  }

  if (['inspect-clear', 'remove', 'remove-all', 'close'].includes(command.method)) {
    inspected = undefined;
  }

  if (
    (command.method === 'inspect' ||
      command.method === 'inspect-text' ||
      command.method === 'inspect-array') &&
    inspected?.key !== JSON.stringify([command.sessionId, command.seq])
  ) {
    inspected = undefined;
  }

  if (['page', 'cancel', 'remove-all'].includes(command.method)) {
    queryVersion++;
  }

  const version = queryVersion;
  const detail = detailVersion;
  const failure = (error) => {
    if (command.method === 'ingest') {
      failedSessions.set(
        command.sessionId,
        failedSessions.get(command.sessionId) ??
          (error instanceof Error ? error.message : String(error)),
      );
    }

    scope.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
  };
  const run = async () => {
    try {
      const value = await execute(command, version, detail);

      scope.postMessage({ id, value });
    } catch (error) {
      failure(error);
    }
  };

  if (
    [
      'sessions',
      'page',
      'export',
      'cancel',
      'inspect',
      'inspect-array',
      'inspect-text',
      'inspect-clear',
    ].includes(command.method)
  ) {
    void run();
  } else {
    queue = queue.then(run);
  }
};
