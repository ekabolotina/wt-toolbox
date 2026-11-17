import assert from 'node:assert/strict';
import { setImmediate as nextTurn } from 'node:timers/promises';
import test from 'node:test';
import { FECaptureSession } from '../src/utils/FECaptureSession.js';

test('capture cleanup, stop errors and delayed navigation preserve session ownership', async (t) => {
  const previousWorker = globalThis.Worker;
  const previousChrome = globalThis.chrome;
  const commands = [];
  let abortGate;
  let stopError;
  let rejectStop = false;
  let workers = 0;
  let listener;
  let stateGate;

  globalThis.Worker = class {
    constructor() {
      workers++;
    }
    postMessage({ id, command }) {
      commands.push(command);
      const value =
        command.method === 'start'
          ? { id: command.sessionId, count: 0, bytes: 0, startedAt: 1 }
          : command.method === 'sessions'
            ? []
            : undefined;

      globalThis.queueMicrotask(() => this.onmessage?.({ data: { id, value } }));
    }
    terminate() {}
  };
  globalThis.chrome = {
    runtime: {
      onMessage: {
        addListener: (value) => {
          listener = value;
        },
      },
      async sendMessage({ payload: { documentId, request } }) {
        if (request.method === 'state' && stateGate) {
          await stateGate;

          return { ok: false, error: 'old capture closed' };
        }

        if (rejectStop && request.method === 'stop') {
          throw new Error('stop failed');
        }

        if (request.method === 'abort' && abortGate) {
          await abortGate;
        }

        return {
          ok: true,
          documentId: documentId ?? 'new-document',
          data: {
            version: 2,
            value: { session: {} },
            state: { recording: true, error: request.method === 'stop' ? stopError : undefined },
          },
        };
      },
    },
  };

  try {
    await t.test('new start waits for the old asynchronous failure cleanup', async () => {
      const viewer = new FECaptureSession(1, 'owner');
      let release;

      abortGate = new Promise((resolve) => {
        release = resolve;
      });
      viewer.session = { id: 'old' };
      viewer.documentId = 'old-document';
      viewer.recording = true;
      const failing = viewer.fail('navigation');
      const restarting = viewer.begin();

      try {
        await nextTurn();
        assert.equal(commands.filter((command) => command.method === 'start').length, 0);
        release();
        await failing;
        abortGate = undefined;
        await restarting;
        assert.equal(viewer.recording, true);
        assert.equal(viewer.documentId, 'new-document');
        assert(
          !commands.some(
            (command) => command.method === 'stop' && command.sessionId === viewer.session.id,
          ),
        );
      } finally {
        release();
        abortGate = undefined;
        await Promise.allSettled([failing, restarting]);
        await viewer.close();
      }
    });
    await t.test(
      'navigation for the already attached document preserves reload capture',
      async () => {
        const viewer = new FECaptureSession(1, 'owner');

        viewer.session = { id: 'reloaded' };
        viewer.documentId = 'new-document';
        viewer.recording = true;
        try {
          await viewer.navigate('new-document');
          assert.equal(viewer.recording, true);
          assert.equal(viewer.error, undefined);
        } finally {
          await viewer.close();
        }
      },
    );
    await t.test(
      'manual stop persists the capture error returned after its final drain',
      async () => {
        const viewer = new FECaptureSession(1, 'owner');

        viewer.session = { id: 'stop-error' };
        viewer.recording = true;
        stopError = 'capture budget exceeded';
        try {
          await viewer.stop();
          assert(
            commands.some(
              (command) =>
                command.method === 'stop' &&
                command.sessionId === 'stop-error' &&
                command.error === stopError,
            ),
          );
        } finally {
          stopError = undefined;
          await viewer.close();
        }
      },
    );
    await t.test(
      'a failed close removes the old worker so reconnect can read history',
      async () => {
        await import('../src/feHistory.js');
        const request = (method) =>
          new Promise((resolve) =>
            listener(
              {
                type: 'fe-history',
                payload: { tabId: 1, origin: 'test', request: { method, token: 'close-error' } },
              },
              {},
              resolve,
            ),
          );

        await request('connect');
        await request('start');
        const before = workers;

        rejectStop = true;
        try {
          assert.equal((await request('close')).ok, false);
          rejectStop = false;
          assert.equal((await request('connect')).ok, true);
          assert.equal(workers, before + 1);
        } finally {
          rejectStop = false;
          await request('close');
        }
      },
    );
    await t.test(
      'late heartbeat error cannot stop a new session in the same document',
      async () => {
        const viewer = new FECaptureSession(1, 'owner');
        const originalTimeout = globalThis.setTimeout;
        let tick;
        let release;

        viewer.session = { id: 'before-heartbeat' };
        viewer.recording = true;
        viewer.documentId = 'new-document';
        stateGate = new Promise((resolve) => {
          release = resolve;
        });
        globalThis.setTimeout = (callback) => {
          tick = callback;
        };
        try {
          viewer.keepAlive();
        } finally {
          globalThis.setTimeout = originalTimeout;
        }

        const heartbeat = tick();

        try {
          await viewer.stop();
          await viewer.begin();
          release();
          await heartbeat;
          assert.equal(viewer.recording, true);
          assert(
            !commands.some(
              (command) => command.method === 'stop' && command.sessionId === viewer.session.id,
            ),
          );
        } finally {
          release();
          stateGate = undefined;
          await heartbeat;
          await viewer.close();
        }
      },
    );
  } finally {
    globalThis.Worker = previousWorker;
    globalThis.chrome = previousChrome;
  }
});
