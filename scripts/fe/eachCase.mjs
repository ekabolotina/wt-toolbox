import { test } from 'node:test';
export const eachCase = (values) => (name, run) => {
  for (const value of values) {
    const title = name
      .replace(/%[si]/g, String(value))
      .replace(/\$(\w+)/g, (_, key) => String(value[key]));

    test(title, () => run(value));
  }
};
