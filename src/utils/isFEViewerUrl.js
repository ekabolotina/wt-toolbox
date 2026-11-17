import { isOverridableUrl } from './isOverridableUrl.js';

export function isFEViewerUrl(url) {
  try {
    const parsed = new URL(url);

    return (
      ['http:', 'https:'].includes(parsed.protocol) &&
      (isOverridableUrl(url) ||
        [
          'localhost',
          '127.0.0.1',
          'local.invest.alfabank.ru',
          'local.invest-test.alfabank.ru',
        ].includes(parsed.hostname))
    );
  } catch {
    return false;
  }
}
