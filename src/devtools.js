import { isOverridableUrl } from './utils/isOverridableUrl.js';
import { isFEViewerUrl } from './utils/isFEViewerUrl.js';

let fePanelCreated = false;

let panelCreated = false;

// A panel can't be removed once created, so it is only created for a page it can work on —
// either the one DevTools opened on or the first such page navigated to later.
function createPanelFor(url) {
  if (!fePanelCreated && isFEViewerUrl(url)) {
    fePanelCreated = true;
    chrome.devtools.panels.create('FE Messages', 'src/icons/icon16.png', 'src/feMessages.html');
  }

  if (panelCreated || !isOverridableUrl(url)) {
    return;
  }

  panelCreated = true;

  // Paths are resolved from the extension root, not from this page.
  chrome.devtools.panels.create('Remote Config', 'src/icons/icon16.png', 'src/remoteConfig.html');
}

chrome.devtools.inspectedWindow.eval('location.href', createPanelFor);
chrome.devtools.network.onNavigated.addListener(createPanelFor);
