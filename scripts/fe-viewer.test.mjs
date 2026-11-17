import assert from 'node:assert/strict';
import { setImmediate as nextTurn } from 'node:timers/promises';
import test from 'node:test';
import { feViewer } from '../src/handlers/feViewer.js';
import { trackFEViewer } from '../src/handlers/trackFEViewer.js';
import { feViewerConnections } from '../src/utils/feViewerConnections.js';

test('disconnect cleanup preserves a replacement owner and closes an abandoned connection', async (t) => {
  const originalChrome = globalThis.chrome;
  const token = 'test-fe-viewer-owner';

  try {
    for (const replace of [true, false]) {
      await t.test(`replacement=${replace}`, async () => {
        feViewerConnections.clear();
        let onConnect;
        let hold = false;
        let release;
        let closes = 0;
        let recording = true;
        const gate = new Promise((resolve) => {
          release = resolve;
        });

        globalThis.chrome = {
          runtime: {
            onConnect: {
              addListener(listener) {
                onConnect = listener;
              },
            },
          },
          tabs: {
            async get() {
              if (hold) {
                hold = false;
                await gate;
              }

              return { url: 'https://invest.alfabank.ru/' };
            },
          },
          scripting: {
            async executeScript({ args: [request] }) {
              if (request.method === 'close') {
                closes++;
                recording = false;
              }

              return [{ documentId: 'document-one', result: { ok: true, data: { recording } } }];
            },
          },
        };
        trackFEViewer();
        const open = () => {
          let onDisconnect;

          onConnect({
            name: `fe-viewer:1:${token}`,
            onDisconnect: {
              addListener(listener) {
                onDisconnect = listener;
              },
            },
          });

          return () => {
            const originalTimeout = globalThis.setTimeout;
            let cleanup;

            globalThis.setTimeout = (callback) => {
              cleanup = callback;
            };
            try {
              onDisconnect();
            } finally {
              globalThis.setTimeout = originalTimeout;
            }

            return cleanup;
          };
        };
        const disconnect = open();

        await feViewer({ tabId: 1, request: { method: 'connect', token } });
        hold = true;
        disconnect()();
        if (replace) {
          open();
          const reply = await feViewer({ tabId: 1, request: { method: 'connect', token } });

          assert.equal(reply.data.recording, true);
        }

        release();
        await nextTurn();
        assert.equal(recording, replace);
        assert.equal(closes, replace ? 0 : 1);
        assert.equal(feViewerConnections.has(token), replace);
      });
    }
  } finally {
    feViewerConnections.clear();
    globalThis.chrome = originalChrome;
  }
});
