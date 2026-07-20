import { overridePRAction } from '../actions/overridePRAction.js';

const prInput = document.getElementById('prNumber');
const toggle = document.getElementById('toggle');
const stateHint = document.getElementById('stateHint');

function updateLabel() {
  if (toggle.checked) {
    stateHint.textContent = 'Активен';
    stateHint.classList.add('active');
  } else {
    stateHint.textContent = 'Неактивен';
    stateHint.classList.remove('active');
  }
}

async function updatePr() {
  updateLabel();
  await overridePRAction.execute({ prNumber: prInput.value, enabled: toggle.checked });
  await chrome.storage.local.set({ prNumber: prInput.value, enabled: toggle.checked });
}

export async function initPROverrideBlock() {
  prInput.addEventListener('input', async () => {
    prInput.value = prInput.value.replace(/[^0-9]/g, '');
    await updatePr();
  });

  toggle.addEventListener('change', updatePr);

  chrome.storage.local.get(['prNumber', 'enabled'], async (result) => {
    console.log(result);
    if (result.prNumber) {
      prInput.value = result.prNumber;
    }

    toggle.checked = !!result.enabled;
    await updatePr();
  });
}
