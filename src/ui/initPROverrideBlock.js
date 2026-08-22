import { overridePRAction } from '../actions/overridePRAction.js';
import { prHistoryStore } from '../stores/prHistoryStore.js';
import { prNumberStore } from '../stores/prNumberStore.js';
import { prEnabledStore } from '../stores/prEnabledStore.js';
import { appIdStore } from '../stores/appIdStore.js';
import { APPS } from '../consts/apps.js';

const prInput = document.getElementById('prNumber');
const prHistory = document.getElementById('prHistory');
const prHistoryTags = document.getElementById('prHistoryTags');
const toggle = document.getElementById('toggle');
const appSelect = document.getElementById('appSelect');

function applyOverride() {
  return overridePRAction.execute({
    prNumber: prInput.value,
    enabled: toggle.checked,
    appId: appSelect.value,
  });
}

function createTag(prNumber) {
  const tag = document.createElement('button');

  tag.type = 'button';
  tag.className = 'pr-tag';
  tag.textContent = `#${prNumber}`;
  tag.title = `Подставить PR ${prNumber}`;

  tag.addEventListener('click', async () => {
    prInput.value = prNumber;

    await prNumberStore.save(prInput.value);
    await applyOverride();
  });

  return tag;
}

function createAppOption({ id, name, cookie }) {
  const option = document.createElement('option');

  option.value = id;
  option.textContent = name;
  option.title = cookie;

  return option;
}

export async function initPROverrideBlock() {
  const [prNumber, enabled, appId] = await Promise.all([
    prNumberStore.get(),
    prEnabledStore.get(),
    appIdStore.get(),
  ]);

  appSelect.replaceChildren(...APPS.map(createAppOption));
  prInput.value = prNumber;
  toggle.checked = enabled;
  appSelect.value = appId;

  await applyOverride();

  prInput.addEventListener('input', async () => {
    prInput.value = prInput.value.replace(/[^0-9]/g, '');

    await prNumberStore.save(prInput.value);
    await applyOverride();
  });

  toggle.addEventListener('change', async () => {
    await prEnabledStore.save(toggle.checked);
    await applyOverride();
  });

  appSelect.addEventListener('change', async () => {
    await appIdStore.save(appSelect.value);
    await applyOverride();
  });

  prHistoryStore.subscribe((history) => {
    prHistoryTags.replaceChildren(...history.map(createTag));
    prHistory.hidden = history.length === 0;
  });
}
