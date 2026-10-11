import { checkOverridableTabAction } from '../actions/checkOverridableTabAction.js';
import { remoteConfigStore } from '../stores/remoteConfigStore.js';
import { getAppliedOverrides } from '../utils/getAppliedOverrides.js';

const remoteConfigCard = document.getElementById('remoteConfigCard');
const remoteConfigStatus = document.getElementById('remoteConfigStatus');

export async function initRemoteConfigSummaryBlock() {
  // Written by the DevTools panel, so the count follows edits made while the popup is open.
  remoteConfigStore.subscribe((flags) => {
    const count = getAppliedOverrides(flags).size;

    if (count > 0) {
      remoteConfigStatus.textContent = `Переопределено ФТ: ${count}`;
      remoteConfigStatus.classList.toggle('active', true);
    } else {
      remoteConfigStatus.textContent = `Переопределений нет`;
      remoteConfigStatus.classList.toggle('active', false);
    }
  });

  checkOverridableTabAction
    .execute()
    .then((overridable) => {
      remoteConfigCard.hidden = !overridable;
    })
    .catch(() => {});
}
