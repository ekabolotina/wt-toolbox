import { getPullRequestId } from '../utils/getPullRequestId.js';

export const getPullRequest = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  return getPullRequestId(tabs?.[0]?.url);
};
