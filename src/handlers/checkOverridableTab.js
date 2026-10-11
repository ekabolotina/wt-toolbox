import { isOverridableUrl } from '../utils/isOverridableUrl.js';

export const checkOverridableTab = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  return isOverridableUrl(tabs?.[0]?.url);
};
