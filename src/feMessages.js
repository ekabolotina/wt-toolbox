import { FEViewerClient } from './utils/FEViewerClient.js';

const connectButton = document.getElementById('connect');
const status = document.getElementById('status');
const controls = document.getElementById('connection');
const host = document.getElementById('viewer');
const token = crypto.randomUUID();
let generation = 0;
let client;
let viewer;
let port;
let theme = chrome.devtools.panels.themeName;

function applyTheme(value) {
  theme = value === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  viewer?.setTheme(theme);
}

applyTheme(theme);
chrome.devtools.panels.setThemeChangeHandler(applyTheme);

function ensurePort() {
  if (port) {
    return;
  }

  const opened = chrome.runtime.connect({
    name: `fe-viewer:${chrome.devtools.inspectedWindow.tabId}:${token}`,
  });

  port = opened;
  opened.onDisconnect.addListener(() => {
    if (port !== opened) {
      return;
    }

    port = undefined;
    if (client && !client.disposed && !client.closing) {
      const recovering = client;

      void recovering.request('connect').catch((error) => {
        if (client === recovering && !recovering.disposed && !recovering.closing) {
          recovering.onChange(undefined, String(error));
        }
      });
    }
  });
}

async function connect(retry = false) {
  const selected = ++generation;

  connectButton.disabled = true;
  connectButton.hidden = true;
  status.textContent = 'Подключение…';

  try {
    const { mountFEViewer } = await import('./vendor/feViewer.js');

    if (selected !== generation) {
      return;
    }

    const connected = new FEViewerClient(chrome.devtools.inspectedWindow.tabId, token, ensurePort);

    client = connected;
    for (let attempt = 0; ; attempt++) {
      try {
        await connected.request('connect');
        break;
      } catch (error) {
        if (!retry || attempt >= 19 || selected !== generation) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
    if (selected !== generation) {
      connected.invalidate();

      return;
    }

    controls.hidden = true;
    viewer = mountFEViewer(host, connected, () => {
      if (selected === generation) {
        client = undefined;
        viewer = undefined;
        port?.disconnect();
        port = undefined;
        controls.hidden = false;
        connectButton.disabled = false;
        connectButton.hidden = false;
        status.textContent = 'Подключение закрыто. История сохранена';
      }
    });
    viewer.setTheme(theme);
  } catch (error) {
    if (selected === generation) {
      await client?.close().catch(() => undefined);
      client?.invalidate();
      client = undefined;
      port?.disconnect();
      port = undefined;
      controls.hidden = false;
      connectButton.hidden = false;
      status.textContent = String(error);
    }
  } finally {
    if (selected === generation) {
      connectButton.disabled = false;
    }
  }
}

connectButton.addEventListener('click', () => void connect(true));
chrome.devtools.network.onNavigated.addListener(() => {
  if (client && !client.disposed) {
    void client.request('navigate').catch((error) => client?.onChange(undefined, String(error)));
  }
});
void connect(true);
