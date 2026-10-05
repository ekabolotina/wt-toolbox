import { getPullRequestAction } from '../actions/getPullRequestAction.js';
import { runUITestsAction } from '../actions/runUITestsAction.js';
import { reloadTabAction } from '../actions/reloadTabAction.js';

const uiTestsCard = document.getElementById('uiTestsCard');
const uiTestsPrNumber = document.getElementById('uiTestsPrNumber');
const runUITestsButton = document.getElementById('runUITests');
const uiTestsStatus = document.getElementById('uiTestsStatus');

function setStatus(state, text) {
  uiTestsStatus.className = `ui-tests-status ${state}`;
  uiTestsStatus.textContent = text;
}

export async function initRunUITestsBlock() {
  runUITestsButton.addEventListener('click', async () => {
    runUITestsButton.disabled = true;
    setStatus('pending', 'Отправка комментария...');

    const result = await runUITestsAction.execute();

    if (result?.ok) {
      setStatus('success', 'Комментарий /run-ui-tests отправлен');
      await reloadTabAction.execute();

      return;
    }

    runUITestsButton.disabled = false;

    if (result?.status === 401) {
      setStatus('error', 'Нет авторизации в Bitbucket');
    } else {
      setStatus('error', `Ошибка: ${result?.status || result?.error || 'неизвестная'}`);
    }
  });

  getPullRequestAction
    .execute()
    .then((id) => {
      if (id) {
        uiTestsPrNumber.textContent = `#${id}`;
        uiTestsCard.hidden = false;
      }
    })
    .catch(() => {});
}
