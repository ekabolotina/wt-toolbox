import { isFEViewerUrl } from '../utils/isFEViewerUrl.js';
import { feViewerConnections } from '../utils/feViewerConnections.js';

export async function feViewer({ tabId, documentId, request }, expectedConnection) {
  const connection = feViewerConnections.get(request.token);

  try {
    const tab = await chrome.tabs.get(tabId);

    if (!isFEViewerUrl(tab.url)) {
      throw new Error('FE Messages недоступны на этой странице');
    }

    if (expectedConnection && feViewerConnections.get(request.token) !== expectedConnection) {
      return { ok: true };
    }

    const [injection] = await chrome.scripting.executeScript({
      target: documentId ? { tabId, documentIds: [documentId] } : { tabId },
      world: 'MAIN',
      func: async (request) => {
        try {
          if (typeof window.aDebug?.feViewer !== 'function') {
            throw new Error(
              'В этой сборке терминала нет API FE Messages. Дождитесь загрузки или выберите сборку с ADIRWEB-3127',
            );
          }

          return { ok: true, data: await window.aDebug.feViewer(request) };
        } catch (error) {
          return { ok: false, error: String(error) };
        }
      },
      args: [request],
    });

    if (!injection?.result) {
      throw new Error('Страница не ответила');
    }

    if (injection.result.ok && connection && request.method !== 'close') {
      connection.documentId = injection.documentId;
      if (connection.closed && !feViewerConnections.has(request.token)) {
        await feViewer({
          tabId,
          documentId: injection.documentId,
          request: { method: 'close', token: request.token },
        });
        throw new Error('DevTools закрыт во время подключения');
      }
    }

    if (injection.result.ok && request.method === 'reload') {
      await chrome.tabs.reload(tabId);
    }

    return { ...injection.result, documentId: injection.documentId };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
