import { feViewer } from './feViewer.js';
import { feViewerConnections } from '../utils/feViewerConnections.js';

export function trackFEViewer() {
  chrome.runtime.onConnect.addListener((port) => {
    const match = /^fe-viewer:(\d+):([\w-]{16,80})$/.exec(port.name);

    if (!match) {
      return;
    }

    const connection = {
      tabId: Number(match[1]),
      token: match[2],
      documentId: undefined,
      closed: false,
    };

    feViewerConnections.set(connection.token, connection);
    port.onDisconnect.addListener(() => {
      connection.closed = true;
      // A replacement port with the same owner preserves the page recorder and the current UI
      setTimeout(async () => {
        if (feViewerConnections.get(connection.token) !== connection) {
          return;
        }

        try {
          if (connection.documentId) {
            await feViewer(
              {
                tabId: connection.tabId,
                documentId: connection.documentId,
                request: { method: 'close', token: connection.token },
              },
              connection,
            );
          }
        } finally {
          if (feViewerConnections.get(connection.token) === connection) {
            feViewerConnections.delete(connection.token);
          }
        }
      }, 500);
    });
  });
}
