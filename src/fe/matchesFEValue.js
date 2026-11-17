import { FEValueMatcher } from './FEValueMatcher.js';

export function matchesFEValue(json, filter) {
  if (!filter.field && !filter.value) {
    return true;
  }

  const matcher = new FEValueMatcher(filter);
  let found = false;

  function check(value, keys) {
    if (found) {
      return;
    }

    if (matcher.test(value, keys)) {
      found = true;

      return;
    }

    if (value !== null && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        check(child, [...keys, key]);
        if (found) {
          break;
        }
      }
    }
  }
  check(JSON.parse(json), []);

  return found;
}
