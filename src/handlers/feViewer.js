import { ensureFEHistory } from '../utils/ensureFEHistory.js';
import { feViewerConnections } from '../utils/feViewerConnections.js';

export async function feViewer({ tabId, request }, expectedConnection) {
  try {
    await ensureFEHistory();
    if (expectedConnection && feViewerConnections.get(request.token) !== expectedConnection) {
      return { ok: true };
    }

    let origin;
    let documentId;

    try {
      origin = new URL((await chrome.tabs.get(tabId)).url).origin;
    } catch {
      origin = undefined;
    }

    if (expectedConnection && feViewerConnections.get(request.token) !== expectedConnection) {
      return { ok: true };
    }

    if (request.method === 'navigate') {
      try {
        const [frame] = await chrome.scripting.executeScript({
          target: { tabId },
          func: () => null,
        });

        documentId = frame?.documentId;
      } catch {
        documentId = undefined;
      }
    }

    const reply = await chrome.runtime.sendMessage({
      type: 'fe-history',
      payload: { tabId, origin, documentId, request },
    });
    const connection = feViewerConnections.get(request.token);

    if (reply?.ok && connection && request.method !== 'close') {
      connection.documentId = 'extension-history';
    }

    if (reply?.ok && !connection && request.method !== 'close') {
      await chrome.runtime.sendMessage({
        type: 'fe-history',
        payload: { tabId, request: { token: request.token, method: 'close' } },
      });

      return { ok: false, error: 'DevTools закрыт во время подключения' };
    }

    return reply;
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
