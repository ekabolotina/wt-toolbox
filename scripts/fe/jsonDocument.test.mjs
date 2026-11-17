import { test, afterEach, mock } from 'node:test';
import { expect } from 'expect';
import { eachCase } from './eachCase.mjs';
import { FEJSONDocument } from '../../src/fe/FEJSONDocument.js';
const filter = { field: '', value: '', operator: 'contains' };

afterEach(() => mock.restoreAll());
async function entries(document, offset, query = filter) {
  const result = [];
  let after;

  do {
    const page = await document.page(offset, after, query);

    expect(page.entries.length).toBeLessThanOrEqual(100);
    expect(page.columns.length).toBeLessThanOrEqual(8);
    expect(JSON.stringify(page).length).toBeLessThan(250000);
    result.push(...page.entries);
    after = page.next;
  } while (after);

  return result;
}
test('поиск из корня возвращает объекты массива с исходными индексами вместо поля data', async () => {
  const values = Array.from({ length: 7000 }, (_, id) => ({
    IdObject: id,
    nested: { code: `x${id}` },
  }));
  const document = new FEJSONDocument(JSON.stringify({ type: 'AnyEntity', data: values }));
  const rows = await entries(document, 0, {
    field: 'IdObject',
    operator: 'equals',
    value: '6717',
  });

  expect(rows.map((row) => row.key)).toEqual(['data[6717]']);
  expect(JSON.parse((await document.text(rows[0].offset, 0)).text)).toEqual(values[6717]);
});
eachCase(['nested.code', 'data[].nested.code', 'IdObject', 'data[].IdObject'])(
  'поиск %s поддерживает полный путь и путь относительно элемента без дублей',
  async (field) => {
    const object = { IdObject: 'target', nested: { code: 'target' }, items: ['target', 'target'] };
    const document = new FEJSONDocument(JSON.stringify({ data: [{ IdObject: 'other' }, object] }));
    const rows = await entries(document, 0, { field, operator: 'equals', value: 'target' });

    expect(rows.map((row) => row.key)).toEqual(['data[1]']);
    expect(JSON.parse((await document.text(rows[0].offset, 0)).text)).toEqual(object);
    expect(
      await entries(document, 0, {
        field: 'wrong.nested.code',
        operator: 'equals',
        value: 'target',
      }),
    ).toEqual([]);
  },
);
test('поиск не дублирует элемент с несколькими совпадениями и различает exists контейнера', async () => {
  const document = new FEJSONDocument(
    JSON.stringify({
      meta: { code: 'target' },
      data: [{ nested: ['target', 'target'], code: 'target' }, null, 'target'],
      tail: { rows: [{ code: 'target' }] },
    }),
  );

  expect(
    (await entries(document, 0, { ...filter, value: 'target' })).map((row) => row.key),
  ).toEqual(['meta', 'data[0]', 'data[2]', 'tail.rows[0]']);
  expect(
    (await entries(document, 0, { ...filter, field: 'data', operator: 'exists' })).map(
      (row) => row.key,
    ),
  ).toEqual(['data']);
  expect(
    (await entries(document, 0, { field: '', operator: 'equals', value: 'null' })).map(
      (row) => row.key,
    ),
  ).toEqual(['data[1]']);
});
test('совпадение в поле объекта возвращает весь объект один раз и сохраняет продолжение поиска', async () => {
  const data = { IdFI: 144950, Version: '144950n', bids: [{ price: 42 }], asks: [] };
  const document = new FEJSONDocument(
    JSON.stringify({ type: 'OrderBookExEntity', data, other: { IdFI: 144950, active: true } }),
  );
  const query = { ...filter, value: '144950' };
  const first = await document.page(0, undefined, query, () => false, Infinity, false, 1);

  expect(first.entries.map((row) => row.key)).toEqual(['data']);
  expect(first.entries[0].type).toBe('object');
  expect(JSON.parse((await document.text(first.entries[0].offset, 0)).text)).toEqual(data);
  const fields = await entries(document, first.entries[0].offset);

  expect(fields.map((row) => row.key)).toEqual(['IdFI', 'Version', 'bids', 'asks']);
  const probe = await document.page(0, first.next, query, () => false, Infinity, false, 0, true);

  expect(probe.matched).toBe(true);
  const rest = await document.page(0, probe.next, query);

  expect(rest.entries.map((row) => row.key)).toEqual(['other']);
  expect(rest.next).toBeUndefined();
  expect((await entries(document, 0, query)).map((row) => row.key)).toEqual(['data', 'other']);
  expect((await entries(document, 0, { ...query, field: 'IdFI' })).map((row) => row.key)).toEqual([
    'data',
    'other',
  ]);
  const local = await entries(document, first.entries[0].offset, query);

  expect(local.map((row) => row.key)).toEqual(['$']);
  expect(JSON.parse((await document.text(local[0].offset, 0)).text)).toEqual(data);
});
test('продолжение поиска и probe переходят между wrapper-массивами без потерь и изменения старого курсора', async () => {
  mock.method(performance, 'now', () => 0);
  const values = Array.from({ length: 101 }, (_, id) => ({ id, keep: true }));
  const document = new FEJSONDocument(
    JSON.stringify({
      first: { rows: values.slice(0, 100) },
      gap: Array.from({ length: 1500 }, () => ({ keep: false })),
      last: { rows: values.slice(100) },
    }),
  );
  const query = { ...filter, field: 'keep', operator: 'equals', value: 'true' };
  const first = await document.page(0, undefined, query);

  expect(first.entries).toHaveLength(100);
  expect(first.entries[99].key).toBe('first.rows[99]');
  const saved = JSON.stringify(first.next);
  let after = first.next;
  let probe;

  do {
    probe = await document.page(0, after, query, () => false, Infinity, false, 0, true);
    expect(probe.entries).toEqual([]);
    after = probe.next;
  } while (after && !probe.matched);
  expect(probe.matched).toBe(true);
  const last = await document.page(0, after, query);

  expect(last.entries.map((row) => row.key)).toEqual(['last.rows[0]']);
  expect(last.next).toBeUndefined();
  expect(JSON.stringify(first.next)).toBe(saved);
  expect((await entries(document, 0, query)).map((row) => row.key)).toEqual([
    ...values.slice(0, 100).map((_, i) => `first.rows[${i}]`),
    'last.rows[0]',
  ]);
});
test('универсальная навигация сохраняет каждый индекс смешанного массива и вложенные узлы', async () => {
  const values = [null, true, false, 0, '', [], {}, { name: 'first', nested: [1, 2] }, ['a', 'b']];
  const document = new FEJSONDocument(JSON.stringify({ payload: values }));
  const root = await entries(document, 0);
  const rows = await entries(document, root[0].offset);

  expect(rows.map((row) => row.key)).toEqual(values.map((_, i) => `[${i}]`));
  expect(rows.map((row) => row.type)).toEqual([
    'null',
    'boolean',
    'boolean',
    'number',
    'string',
    'array',
    'object',
    'object',
    'array',
  ]);
  for (let i = 0; i < rows.length; i++) {
    expect(JSON.parse((await document.text(rows[i].offset, 0)).text)).toEqual(values[i]);
  }
  const object = await entries(document, rows[7].offset);
  const nested = object.find((row) => row.key === 'nested');

  expect(nested).toBeDefined();
  expect((await entries(document, nested?.offset ?? -1)).map((row) => row.preview)).toEqual([
    '1',
    '2',
  ]);
});
test('порции большого массива не теряют строки, поздние поля и различие отсутствующего поля и null', async () => {
  mock.method(performance, 'now', () => 0);
  const values = Array.from({ length: 1205 }, (_, index) =>
    index % 2 ? { later: index } : { value: null, index },
  );
  const document = new FEJSONDocument(JSON.stringify(values));
  const first = await document.page(0, undefined, filter);

  expect(first.columns).toContain('value');
  const column = first.columns.indexOf('value');

  expect(first.entries[0].cells.find((cell) => cell.column === column)?.node.type).toBe('null');
  expect(first.entries[1].cells.find((cell) => cell.column === column)).toBeUndefined();
  const rows = await entries(document, 0);

  expect(rows.map((row) => row.key)).toEqual(values.map((_, i) => `[${i}]`));
});
eachCase([
  { field: 'id', operator: 'equals', value: '717', expected: '[717]' },
  { field: 'nested.code', operator: 'equals', value: 'x717', expected: '[717]' },
  { field: 'items[].code', operator: 'contains', value: 'x717', expected: '[717]' },
  { field: '', operator: 'contains', value: 'x717', expected: '[717]' },
  { field: 'special', operator: 'exists', value: '', expected: '[717]' },
])(
  'локальный поиск $field / $operator пропускает большие промежутки',
  async ({ expected, ...query }) => {
    const values = Array.from({ length: 1500 }, (_, id) => ({
      id,
      nested: { code: `x${id}` },
      items: [{ code: `x${id}` }],
      ...(id === 717 ? { special: null } : {}),
    }));
    const document = new FEJSONDocument(JSON.stringify(values));

    expect((await entries(document, 0, query)).map((row) => row.key)).toEqual([expected]);
    expect(await entries(document, 0, { ...filter, value: 'not found anywhere' })).toEqual([]);
  },
);
test('известная колонка находится и после восьмого поля другого элемента', async () => {
  mock.method(performance, 'now', () => 0);
  const document = new FEJSONDocument(
    JSON.stringify([
      { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 },
      { x1: 1, x2: 2, x3: 3, x4: 4, x5: 5, x6: 6, x7: 7, x8: 8, a: 42 },
    ]),
  );
  const page = await document.page(0, undefined, filter);
  const column = page.columns.indexOf('a');

  expect(page.entries[1].cells.find((cell) => cell.column === column)?.node.preview).toBe('42');
});
test('лимит совпадений и probe не поглощают первый элемент следующей страницы', async () => {
  mock.method(performance, 'now', () => 0);
  const document = new FEJSONDocument(
    JSON.stringify(Array.from({ length: 251 }, (_, id) => ({ id, fe: id % 3 === 0 ? 1 : 2 }))),
  );
  const query = { ...filter, field: 'fe', operator: 'equals', value: '1' };
  const first = await document.page(0, undefined, query, () => false, Infinity, false, 3);

  expect(first.entries.map((entry) => entry.key)).toEqual(['[0]', '[3]', '[6]']);
  const probe = await document.page(0, first.next, query, () => false, Infinity, false, 0, true);

  expect(probe.matched).toBe(true);
  expect(probe.entries).toEqual([]);
  const second = await document.page(0, probe.next, query, () => false, Infinity, false, 2);

  expect(second.entries.map((entry) => entry.key)).toEqual(['[9]', '[12]']);
  const bounded = await document.page(0, first.next, query, () => false, 8, false, 1, true);

  expect(bounded.matched).not.toBe(true);
  expect(bounded.next).toBeUndefined();
});
test('ключи и escaped строки адресуются позициями без prototype lookup или разбиения ключа по точке', async () => {
  const value = JSON.parse(
    '{"__proto__":{"a.b":"quote \\" \\\\ \\n \\u0041"},"constructor":false,"toString":0,"":[],"/~":null}',
  );
  const json = JSON.stringify(value);
  const document = new FEJSONDocument(json);
  const root = await entries(document, 0);

  expect(root.map((row) => row.key)).toEqual(Object.keys(value));
  for (const row of root) {
    expect(JSON.parse((await document.text(row.offset, 0)).text)).toEqual(value[row.key]);
  }
  const child = await entries(document, root[0].offset);

  expect(child[0].key).toBe('a.b');
  expect(JSON.parse((await document.text(child[0].offset, 0)).text)).toBe(value.__proto__['a.b']);
  expect((await entries(document, 0, { ...filter, value: 'A' })).map((row) => row.key)).toContain(
    '__proto__',
  );
});
eachCase(['[]', '{}', 'null', 'false', '0', '""'])(
  'пустые контейнеры и scalar root: %s',
  async (json) => {
    const document = new FEJSONDocument(json);

    expect(await entries(document, 0)).toEqual([]);
    expect(await document.text(0, 0)).toEqual({ text: json, length: json.length });
  },
);
test('большая строка выдаётся фрагментами и scanner отдаёт управление для отмены', async () => {
  const json = JSON.stringify({ payload: ['\\'.repeat(4 * 1024 * 1024)] });
  const document = new FEJSONDocument(json);
  let cancelled = false;
  const timer = setTimeout(() => {
    cancelled = true;
  }, 0);

  await expect(document.page(0, undefined, filter, () => cancelled)).rejects.toThrow('отменён');
  clearTimeout(timer);
  const part = await document.text(0, 0);

  expect(part.text.length).toBe(65536);
  expect(part.length).toBe(json.length);
  expect((await document.text(0, 65536)).text).toBe(json.slice(65536, 131072));
});
async function segments(document, from = 0, to) {
  let result;

  do {
    result = await document.segments(0, from, to);
    expect(result.segments.length).toBeLessThanOrEqual(100);
    if (!result.complete) {
      expect(result.segments).toEqual([]);
    }
  } while (!result.complete);

  return result;
}
eachCase([0, 1, 99, 100, 101, 200, 201])(
  'массив из %s элементов имеет точный размер и фиксированные диапазоны',
  async (count) => {
    const document = new FEJSONDocument(
      JSON.stringify(Array.from({ length: count }, (_, id) => ({ id }))),
    );
    const description = await document.page(0, undefined, filter, () => false, Infinity, true);

    expect(description.entries).toEqual([]);
    const indexed = await segments(document);

    expect(indexed.count).toBe(count);
    expect(indexed.segments.map(({ from, to }) => [from, to])).toEqual(
      Array.from({ length: Math.ceil(count / 100) }, (_, i) => [
        i * 100,
        Math.min(count - 1, i * 100 + 99),
      ]),
    );
    expect(
      (await document.page(0, undefined, filter, () => false, Infinity, true)).node.count,
    ).toBe(count);
    const seen = [];

    for (const segment of indexed.segments) {
      let after = segment.cursor;

      do {
        const page = await document.page(0, after, filter, () => false, segment.to);

        seen.push(...page.entries.map((entry) => entry.key));
        after = page.next;
      } while (after);
    }
    expect(seen).toEqual(Array.from({ length: count }, (_, i) => `[${i}]`));
  },
);
test('большой массив группирует диапазоны и позволяет сразу открыть последний сегмент', async () => {
  const document = new FEJSONDocument(JSON.stringify(Array.from({ length: 10001 }, (_, i) => i)));
  const indexed = await segments(document);

  expect(indexed.segments.map(({ from, to }) => [from, to])).toEqual([
    [0, 9999],
    [10000, 10000],
  ]);
  const children = await segments(document, 0, 9999);

  expect(children.segments).toHaveLength(100);
  const last = children.segments[99];
  const page = await document.page(0, last.cursor, filter, () => false, last.to);

  expect(page.entries[0].key).toBe('[9900]');
  expect(JSON.parse((await document.text(last.cursor.offset, 0)).text)).toBe(9900);
});
test('подсчёт не принимает вложенные или escaped запятые за границы элементов', async () => {
  const values = Array.from({ length: 201 }, (_, i) => ({
    i,
    nested: [[1, 2], { text: 'a,]\\"\n😀' }],
  }));
  const document = new FEJSONDocument(JSON.stringify(values));
  const indexed = await segments(document);
  const last = indexed.segments[2];
  const page = await document.page(0, last.cursor, filter, () => false, last.to);

  expect(indexed.count).toBe(201);
  expect(page.entries.map((entry) => entry.key)).toEqual(['[200]']);
  expect(JSON.parse((await document.text(page.entries[0].offset, 0)).text)).toEqual(values[200]);
});
test('отменённый и незавершённый подсчёт не публикует ложные сегменты и корректно продолжается', async () => {
  const document = new FEJSONDocument(
    JSON.stringify(['\\'.repeat(2 * 1024 * 1024), ...Array.from({ length: 201 }, (_, i) => i)]),
  );
  let cancelled = false;
  const timer = setTimeout(() => {
    cancelled = true;
  }, 0);

  await expect(document.segments(0, 0, undefined, () => cancelled)).rejects.toThrow('отменён');
  clearTimeout(timer);
  const partial = await document.segments(0);

  expect(partial.complete).toBe(false);
  expect(partial.segments).toEqual([]);
  const indexed = await segments(document);

  expect(indexed.count).toBe(202);
  const last = indexed.segments[2];
  const page = await document.page(0, last.cursor, filter, () => false, last.to);

  expect(page.entries.map((entry) => entry.key)).toEqual(['[200]', '[201]']);
});
