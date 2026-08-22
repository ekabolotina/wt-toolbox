import { DOMAINS } from '../consts/domains.js';
import { resolveApp } from '../utils/resolveApp.js';

const RULE_IDS = DOMAINS.map((_, i) => i + 1);

const RESOURCE_TYPES = [
  'main_frame',
  'sub_frame',
  'stylesheet',
  'script',
  'image',
  'font',
  'object',
  'xmlhttprequest',
  'ping',
  'csp_report',
  'media',
  'websocket',
  'other',
];

let pending = Promise.resolve();

function buildRules(cookieValue) {
  return DOMAINS.map((domain, i) => ({
    id: RULE_IDS[i],
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [{ header: 'Cookie', operation: 'append', value: cookieValue }],
    },
    condition: {
      urlFilter: `||${domain}`,
      resourceTypes: RESOURCE_TYPES,
    },
  }));
}

export const overridePR = async (payload) => {
  const { prNumber, enabled, appId } = payload;
  const active = Boolean(enabled && prNumber);
  const addRules = active ? buildRules(`${resolveApp(appId).cookie}=${prNumber}`) : [];

  const apply = () =>
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: RULE_IDS,
      addRules,
    });

  pending = pending.then(apply, apply);

  await pending;
};
