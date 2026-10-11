let pending = Promise.resolve();

// Every dynamic-rule update goes through one queue, so a slow call can't be overtaken by a newer
// one and the last update is the one left in effect.
export function updateDynamicRules(options) {
  const apply = () => chrome.declarativeNetRequest.updateDynamicRules(options);

  pending = pending.then(apply, apply);

  return pending;
}
