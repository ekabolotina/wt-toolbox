import { UI_TESTS_REPO } from '../consts/uiTestsRepo.js';
import { getPullRequestId } from '../utils/getPullRequestId.js';

const COMMENT_TEXT = '/run-ui-tests';

// Runs inside the Bitbucket tab, so the request carries the user's session cookie.
async function postComment(url, text) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Atlassian-Token': 'no-check',
      },
      body: JSON.stringify({ text }),
    });

    return { ok: response.ok, status: response.status };
  } catch (error) {
    return { ok: false, status: 0, error: String(error) };
  }
}

export const runUITests = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  if (chrome.runtime.lastError || !tabs || !tabs[0]) {
    return { ok: false, status: 0, error: 'Нет активной вкладки' };
  }

  const id = getPullRequestId(tabs[0].url);

  if (!id) {
    return { ok: false, status: 0, error: 'Вкладка не является PR' };
  }

  const { project, repo } = UI_TESTS_REPO;
  const url = `/rest/api/1.0/projects/${project}/repos/${repo}/pull-requests/${id}/comments`;

  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: postComment,
      args: [url, COMMENT_TEXT],
    });

    return injection?.result ?? { ok: false, status: 0, error: 'Скрипт не выполнился' };
  } catch (error) {
    return { ok: false, status: 0, error: String(error) };
  }
};
