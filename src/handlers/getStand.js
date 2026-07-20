function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

async function isPrNumStringExistOnPage(tabId) {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const scripts = document.querySelectorAll('script');

        return Array.from(scripts).some((s) => s.textContent.includes('_PR_NUM'));
      },
    });

    return Boolean(result?.result);
  } catch {
    return false;
  }
}

export const getStand = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  if (chrome.runtime.lastError || !tabs || !tabs[0]) {
    throw chrome.runtime.lastError ?? 'Unknown error';
  }

  const domain = getDomain(tabs[0].url);

  if (domain === 'invest-test.alfabank.ru') {
    return 'int';
  }

  if (domain === 'local.invest-test.alfabank.ru') {
    return 'local-int';
  }

  if (domain === 'local.invest.alfabank.ru') {
    return 'local-prod';
  }

  if (domain === 'invest.alfabank.ru') {
    const hasPrNum = await isPrNumStringExistOnPage(tabs[0].id);

    return hasPrNum ? 'prelive' : 'prod';
  }

  return 'unknown';
};
