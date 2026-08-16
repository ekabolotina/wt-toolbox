import { DOMAINS } from '../utils/domains.js';
import { prHistoryStore } from '../stores/prHistoryStore.js';
import { prNumberStore } from '../stores/prNumberStore.js';
import { prEnabledStore } from '../stores/prEnabledStore.js';

const URL_FILTERS = DOMAINS.map((domain) => `*://${domain}/*`);

async function rememberAppliedPr() {
  const [prNumber, enabled] = await Promise.all([prNumberStore.get(), prEnabledStore.get()]);

  if (!enabled || !prNumber) {
    return;
  }

  await prHistoryStore.save(prNumber);
}

export function trackAppliedPR() {
  chrome.webRequest.onBeforeRequest.addListener(
    () => {
      rememberAppliedPr();
    },
    { urls: URL_FILTERS, types: ['main_frame'] },
  );
}
