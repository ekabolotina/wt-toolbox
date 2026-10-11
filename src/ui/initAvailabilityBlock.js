import { DOMAINS } from '../consts/domains.js';
import { isOverridableUrl } from '../utils/isOverridableUrl.js';

const content = document.getElementById('remoteConfigContent');
const unavailableState = document.getElementById('unavailableState');

function update(url) {
  const available = isOverridableUrl(url);

  content.hidden = !available;
  unavailableState.hidden = available;
}

// The panel outlives navigation away from a supported domain, so it swaps its content for a notice.
export async function initAvailabilityBlock() {
  unavailableState.textContent = `Доступно только на ${DOMAINS.join(', ')}`;

  chrome.devtools.inspectedWindow.eval('location.href', update);
  chrome.devtools.network.onNavigated.addListener(update);
}
