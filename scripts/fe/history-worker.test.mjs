import './installIndexedDB.mjs';
import assert from 'node:assert/strict';
import { before, after, test, mock } from 'node:test';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { FEHistory } from '../../src/fe/FEHistory.js';
import { makeRecord } from './makeRecord.mjs';

const pending = new Map();
let id = 0;
const previousSelf = globalThis.self;
const previousPost = globalThis.postMessage;
const previousHandler = globalThis.onmessage;

function rpc(command) {
  return new Promise((resolve, reject) => {
    const requestId = ++id;

    pending.set(requestId, { resolve, reject });
    self.onmessage({ data: { id: requestId, command } });
  });
}

function ingest(sessionId, batchId, values) {
  const records = values.map((value) =>
    makeRecord(
      { type: 'FinInfoExEntity', data: { value } },
      { at: 1000, fe: 1, source: 'worker', connectionId: 1, direction: 'IN' },
    ),
  );

  return rpc({ method: 'ingest', sessionId, batchId, json: JSON.stringify(records) });
}

before(async () => {
  globalThis.self = globalThis;
  globalThis.postMessage = (response) => {
    const request = pending.get(response.id);

    pending.delete(response.id);
    if (response.error) {
      request?.reject(new Error(response.error));
    } else {
      request?.resolve(response.value);
    }
  };
  await import('../../src/fe/history.worker.js');
});

after(async () => {
  await rpc({ method: 'close' });
  globalThis.onmessage = previousHandler;
  globalThis.postMessage = previousPost;
  globalThis.self = previousSelf;
});

for (const failure of [false, true]) {
  test(`Stop ждёт commit всех принятых пачек и сохраняет первую ошибку, failure=${failure}`, async () => {
    const sessionId = `commit-${failure}`;
    let release;
    let writing;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    const started = new Promise((resolve) => {
      writing = resolve;
    });
    const original = FEHistory.prototype.append;
    const append = mock.method(
      FEHistory.prototype,
      'append',
      async function (...args) {
        writing();
        await gate;
        if (failure) {
          throw new Error('DB commit failed');
        }

        return original.apply(this, args);
      },
      { times: 1 },
    );

    try {
      await rpc({ method: 'start', sessionId });
      const first = ingest(sessionId, 1, ['first']);
      const firstFailure = failure && assert.rejects(first, /DB commit failed/);

      await started;
      const second = ingest(sessionId, 2, ['second']);
      const secondFailure = failure && assert.rejects(second, /после ошибки/);
      let finished = false;
      const stop = rpc({ method: 'stop', sessionId }).then(() => {
        finished = true;
      });

      await nextTurn();
      assert.equal(finished, false);
      release();
      if (failure) {
        await Promise.all([firstFailure, secondFailure]);
      } else {
        assert.deepEqual(
          (await Promise.all([first, second])).map((session) => session.count),
          [1, 2],
        );
      }

      await stop;
      const session = (await rpc({ method: 'sessions' })).find((item) => item.id === sessionId);

      assert.equal(session.count, failure ? 0 : 2);
      assert.equal(session.error, failure ? 'DB commit failed' : undefined);
      assert.equal(typeof session.endedAt, 'number');
      if (!failure) {
        const detail = await rpc({ method: 'inspect-text', sessionId, seq: 2, offset: 0, from: 0 });

        assert.equal(JSON.parse(detail.text).data.value, 'second');
      }
    } finally {
      release();
      append.mock.restore();
    }
  });
}

test('позднее чтение старого сообщения не заменяет новый просмотр и clear освобождает выбор', async () => {
  const sessionId = 'inspect-generation';

  await rpc({ method: 'start', sessionId });
  await ingest(sessionId, 1, ['old', 'skipped', 'new']);
  await rpc({ method: 'stop', sessionId });
  let release;
  let started;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const reading = new Promise((resolve) => {
    started = resolve;
  });
  const original = FEHistory.prototype.readJSON;
  const read = mock.method(
    FEHistory.prototype,
    'readJSON',
    async function (...args) {
      started();
      await gate;

      return original.apply(this, args);
    },
    { times: 1 },
  );
  const filter = { field: '', value: '', operator: 'contains' };

  try {
    const oldFailure = assert.rejects(
      rpc({ method: 'inspect', sessionId, seq: 1, offset: 0, filter }),
      /отменён/,
    );

    await reading;
    const skippedFailure = assert.rejects(
      rpc({ method: 'inspect', sessionId, seq: 2, offset: 0, filter }),
      /отменён/,
    );
    const newest = rpc({ method: 'inspect', sessionId, seq: 3, offset: 0, filter });

    await nextTurn();
    assert.equal(read.mock.callCount(), 1);
    release();
    const current = await newest;
    const data = current.entries.find((entry) => entry.key === 'data');

    assert.ok(data);
    await Promise.all([oldFailure, skippedFailure]);
    const node = await rpc({ method: 'inspect', sessionId, seq: 3, offset: data.offset, filter });

    assert.equal(node.entries[0].preview, '"new"');
    await rpc({ method: 'inspect-clear' });
    const reopened = await rpc({ method: 'inspect', sessionId, seq: 1, offset: 0, filter });

    assert.deepEqual(
      reopened.entries.map((entry) => entry.key),
      ['type', 'data'],
    );
    await rpc({ method: 'inspect-clear' });
  } finally {
    release();
    read.mock.restore();
  }
});
