import { FECaptureSession } from './utils/FECaptureSession.js';

const viewers = new Map();

async function handle({ tabId, origin, documentId, request }) {
  const { token, method, command } = request;
  let viewer = viewers.get(token);

  if (method === 'connect' && !viewer) {
    viewer = new FECaptureSession(tabId, token);
    viewers.set(token, viewer);
  }

  if (!viewer || viewer.tabId !== tabId) {
    throw new Error('История FE не подключена');
  }

  viewer.origin = origin;
  let value;

  if (method === 'rpc') {
    const allowed = [
      'sessions',
      'page',
      'inspect',
      'inspect-array',
      'inspect-text',
      'inspect-clear',
      'export',
      'remove',
      'remove-all',
      'cancel',
    ];

    if (!allowed.includes(command?.method)) {
      throw new Error('Недопустимая команда истории FE');
    }

    value = await viewer.history.rpc(command);
  } else if (method === 'navigate') {
    await viewer.navigate(documentId);
  } else if (['start', 'stop', 'reload', 'close'].includes(method)) {
    await viewer.lifecycle(async () => {
      if (method === 'start' || method === 'reload') {
        await viewer.begin(method === 'reload');
      } else if (method === 'close') {
        try {
          await viewer.close();
        } finally {
          clearTimeout(viewer.lease);
          if (viewers.get(token) === viewer) {
            viewers.delete(token);
          }
        }
      } else {
        await viewer.stop();
      }
    });
  }

  if (method !== 'close') {
    clearTimeout(viewer.lease);
    viewer.lease = setTimeout(() => {
      void viewer
        .lifecycle(() => viewer.close())
        .catch(() => undefined)
        .finally(() => {
          if (viewers.get(token) === viewer) {
            viewers.delete(token);
          }
        });
    }, 20000);
  }

  return {
    version: 2,
    value,
    state: {
      recording: viewer.recording,
      sessionId: viewer.session?.id,
      session: viewer.session,
      error: viewer.error,
    },
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'fe-history') {
    return;
  }

  void handle(message.payload).then(
    (data) => sendResponse({ ok: true, data }),
    (error) => sendResponse({ ok: false, error: String(error) }),
  );

  return true;
});
