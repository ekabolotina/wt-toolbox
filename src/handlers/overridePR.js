import { DOMAINS } from '../utils/domains.js';

const COOKIE_NAME = '_PR_NUM';
const RULE_IDS = DOMAINS.map((_, i) => i + 1);

export const overridePR = async (payload) => {
  const { prNumber, enabled } = payload;

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: RULE_IDS,
  });

  if (!enabled || !prNumber) {
    return;
  }

  const cookieValue = `${COOKIE_NAME}=${prNumber}`;

  const rules = DOMAINS.map((domain, i) => ({
    id: RULE_IDS[i],
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [{ header: 'Cookie', operation: 'append', value: cookieValue }],
    },
    condition: {
      urlFilter: `||${domain}`,
      resourceTypes: [
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
      ],
    },
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules,
  });
};
