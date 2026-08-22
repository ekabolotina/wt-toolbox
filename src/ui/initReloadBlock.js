import { reloadTabAction } from '../actions/reloadTabAction.js';
import { prNumberStore } from '../stores/prNumberStore.js';
import { prEnabledStore } from '../stores/prEnabledStore.js';
import { appIdStore } from '../stores/appIdStore.js';

const reloadButton = document.getElementById('reloadPage');

export async function initReloadBlock() {
  const applied = {};
  const current = {};

  const update = (key, value) => {
    applied[key] ??= value;
    current[key] = value;

    reloadButton.hidden = Object.keys(applied).every((name) => current[name] === applied[name]);
  };

  reloadButton.addEventListener('click', async () => {
    Object.assign(applied, current);
    reloadButton.hidden = true;

    await reloadTabAction.execute();
  });

  prNumberStore.subscribe((prNumber) => update('prNumber', prNumber));
  prEnabledStore.subscribe((enabled) => update('enabled', enabled));
  appIdStore.subscribe((appId) => update('appId', appId));
}
