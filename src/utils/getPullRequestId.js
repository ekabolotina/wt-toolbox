import { UI_TESTS_REPO } from '../consts/uiTestsRepo.js';

const PATH_PREFIX = `/projects/${UI_TESTS_REPO.project}/repos/${UI_TESTS_REPO.repo}/pull-requests/`;

export function getPullRequestId(url) {
  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.hostname !== UI_TESTS_REPO.host || !parsed.pathname.startsWith(PATH_PREFIX)) {
    return null;
  }

  const [id] = parsed.pathname.slice(PATH_PREFIX.length).split('/');

  return /^\d+$/.test(id) ? id : null;
}
