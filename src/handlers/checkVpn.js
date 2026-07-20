export const checkVpn = () =>
  new Promise((resolve) => {
    const marker = `_chk_${Date.now()}`;
    const url = `https://invest-test.alfabank.ru/${marker}`;
    let done = false;

    const finish = (vpn) => {
      if (done) {
        return;
      }

      done = true;
      chrome.webRequest.onCompleted.removeListener(onCompleted);
      chrome.webRequest.onErrorOccurred.removeListener(onError);
      clearTimeout(timer);
      resolve(vpn);
    };

    const timer = setTimeout(() => finish(false), 4000);
    const filter = { urls: [`*://invest-test.alfabank.ru/*${marker}*`] };

    const onCompleted = (details) => {
      if (details.url === url) {
        finish(true);
      }
    };

    const onError = (details) => {
      if (details.url === url) {
        const isDnsError =
          details.error &&
          (details.error.includes('ERR_NAME_NOT_RESOLVED') ||
            details.error.includes('ERR_NAME_RESOLUTION_FAILED'));

        finish(!isDnsError);
      }
    };

    chrome.webRequest.onCompleted.addListener(onCompleted, filter);
    chrome.webRequest.onErrorOccurred.addListener(onError, filter);

    fetch(url, { cache: 'no-store' }).catch(() => {});
  });
