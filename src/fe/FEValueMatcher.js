export class FEValueMatcher {
  filter;
  path;
  constructor(filter) {
    this.filter = filter;
    this.path = filter.field.replace(/\[\]/g, '.*').split('.').filter(Boolean);
  }
  test(value, keys, from = 0) {
    const { filter, path } = this;
    const selected =
      !path.length ||
      (path.length > 1
        ? keys.length - from === path.length &&
          path.every((part, i) => part === '*' || part === keys[from + i])
        : keys[keys.length - 1] === path[0]);

    if (!selected) {
      return false;
    }

    if (filter.field && filter.operator === 'exists') {
      return true;
    }

    if (value !== null && typeof value === 'object') {
      return false;
    }

    const text = String(value);

    return filter.operator === 'equals'
      ? text === filter.value
      : text.toLocaleLowerCase().includes(filter.value.toLocaleLowerCase());
  }
}
