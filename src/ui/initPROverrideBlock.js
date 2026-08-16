import { overridePRAction } from '../actions/overridePRAction.js';
import { prHistoryStore } from '../stores/prHistoryStore.js';
import { prNumberStore } from '../stores/prNumberStore.js';
import { prEnabledStore } from '../stores/prEnabledStore.js';

const prInput = document.getElementById('prNumber');
const prHistory = document.getElementById('prHistory');
const prHistoryTags = document.getElementById('prHistoryTags');
const toggle = document.getElementById('toggle');

function createTag(prNumber) {
  const tag = document.createElement('button');

  tag.type = 'button';
  tag.className = 'pr-tag';
  tag.textContent = `#${prNumber}`;
  tag.title = `Подставить PR ${prNumber}`;

  tag.addEventListener('click', async () => {
    prInput.value = prNumber;

    await prNumberStore.save(prInput.value);
  });

  return tag;
}

export async function initPROverrideBlock() {
  prInput.addEventListener('input', async () => {
    prInput.value = prInput.value.replace(/[^0-9]/g, '');

    await prNumberStore.save(prInput.value);
  });

  toggle.addEventListener('change', async () => {
    await prEnabledStore.save(toggle.checked);
  });

  prNumberStore.subscribe(async (prNumber) => {
    prInput.value = prNumber;

    await overridePRAction.execute({ prNumber, enabled: toggle.checked });
  });

  prEnabledStore.subscribe(async (enabled) => {
    toggle.checked = enabled;

    await overridePRAction.execute({ prNumber: prInput.value, enabled });
  });

  prHistoryStore.subscribe((history) => {
    prHistoryTags.replaceChildren(...history.map(createTag));
    prHistory.hidden = history.length === 0;
  });
}
