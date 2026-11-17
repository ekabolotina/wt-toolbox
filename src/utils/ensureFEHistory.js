let creating;

export async function ensureFEHistory() {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL('src/feHistory.html')],
  });

  if (contexts.length) {
    return;
  }

  if (!creating) {
    creating = chrome.offscreen
      .createDocument({
        url: 'src/feHistory.html',
        reasons: ['WORKERS'],
        justification: 'Сохранение очереди FE в IndexedDB расширения и поиск в отдельном worker',
      })
      .finally(() => {
        creating = undefined;
      });
  }

  await creating;
}
