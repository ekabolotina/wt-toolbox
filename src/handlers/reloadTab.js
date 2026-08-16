export const reloadTab = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  if (chrome.runtime.lastError || !tabs || !tabs[0]) {
    throw chrome.runtime.lastError ?? 'Unknown error';
  }

  await chrome.tabs.reload(tabs[0].id);
};
