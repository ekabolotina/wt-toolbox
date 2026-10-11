const ATTEMPTS = 20;
const RETRY_DELAY = 250;

// Runs in the inspected page. The live window.__PRELOADED_DATA is no use here: the terminal deletes
// remoteConfig from it once read, whereas the inline script still holds the payload as served.
function readPreloadedData() {
  const prefix = 'window.__PRELOADED_DATA =';
  const script = Array.from(document.scripts).find((item) =>
    item.textContent.trim().startsWith(prefix),
  );

  if (!script) {
    return document.readyState === 'loading' ? null : { found: false };
  }

  const json = script.textContent.trim().slice(prefix.length).replace(/;\s*$/, '');

  return { found: true, data: JSON.parse(json) };
}

function evaluate(func) {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(`(${func})()`, (result, exceptionInfo) => {
      if (exceptionInfo?.isException || exceptionInfo?.isError) {
        reject(exceptionInfo);
      } else {
        resolve(result);
      }
    });
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeEntries(entries) {
  return Object.entries(entries)
    .map(([key, value]) => [key, typeof value === 'string' ? value : JSON.stringify(value)])
    .sort(([a], [b]) => a.localeCompare(b));
}

// Resolves to { found: false } when the page has no preloaded data, otherwise to
// { found: true, entries } with entries as sorted [key, value] string pairs, or null when the
// preloaded data carries no remote config.
export async function readRemoteConfigEntries() {
  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    const result = await evaluate(readPreloadedData);

    if (result) {
      const entries = result.data?.remoteConfig?.entries;

      return result.found
        ? { found: true, entries: entries ? normalizeEntries(entries) : null }
        : result;
    }

    await delay(RETRY_DELAY);
  }

  return { found: false };
}
