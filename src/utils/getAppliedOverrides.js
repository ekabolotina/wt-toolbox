// The overrides that actually reach the page URL, as a key → value map: enabled rows with a
// non-empty key, a later duplicate replacing an earlier one.
export function getAppliedOverrides(flags) {
  const applied = new Map();

  for (const { key, value, enabled } of flags) {
    const name = key.trim();

    if (enabled && name) {
      applied.set(name, value);
    }
  }

  return applied;
}
