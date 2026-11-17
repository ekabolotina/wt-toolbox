import './installIndexedDB.mjs';
import { it, describe, mock } from 'node:test';
import { expect } from 'expect';
import { eachCase } from './eachCase.mjs';
import { randomUUID } from 'node:crypto';
import { FEHistory } from '../../src/fe/FEHistory.js';
import { openFEDatabase } from '../../src/fe/openFEDatabase.js';
import { makeRecord } from './makeRecord.mjs';
const filter = {
  sessionId: 'one',
  entity: '',
  fe: '',
  direction: '',
  from: 0,
  to: Number.MAX_SAFE_INTEGER,
  field: '',
  operator: 'contains',
  value: '',
};
const record = (at, data = { IdFI: 123, price: 100 }) =>
  makeRecord(
    { type: 'FinInfoExEntity', data },
    { at, fe: 1, source: 'socket', connectionId: 1, direction: 'IN' },
  );

describe('История FE', () => {
  it('recovery повторно проверяет завершение после получения session-lock', async () => {
    const history = new FEHistory(await openFEDatabase(`fe-recovery-${randomUUID()}`));
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'locks');
    let completed;

    try {
      await history.createSession('one');
      Object.defineProperty(navigator, 'locks', {
        configurable: true,
        value: {
          request: async (_name, _options, action) => {
            await history.finish('one');
            completed = (await history.sessions())[0];
            await action({});
          },
        },
      });
      await history.recoverInterrupted();
      expect((await history.sessions())[0]).toEqual(completed);
    } finally {
      history.close();
      if (descriptor) {
        Object.defineProperty(navigator, 'locks', descriptor);
      } else {
        Reflect.deleteProperty(navigator, 'locks');
      }
    }
  });
  it('повтор пачки после потери ACK не дублирует записи и счётчики после повторного открытия БД', async () => {
    const name = `fe-transfer-${randomUUID()}`;
    let history = new FEHistory(await openFEDatabase(name));

    try {
      await history.createSession('one', 'https://invest-test.alfabank.ru');
      const first = await history.append('one', [record(1), record(2)], 1);

      history.close();
      history = new FEHistory(await openFEDatabase(name));
      expect(await history.append('one', [record(1), record(2)], 1)).toEqual(first);
      expect((await history.page(filter)).rows.map((row) => row.seq)).toEqual([2, 1]);
      await expect(history.append('one', [record(3)], 3)).rejects.toThrow('порядок');
      expect(await history.append('one', [record(3)], 2)).toMatchObject({
        count: 3,
        origin: 'https://invest-test.alfabank.ru',
      });
    } finally {
      history.close();
    }
  });
  it('экспорт делит большое сообщение на ограниченные фрагменты без изменения JSONL', async () => {
    const db = await openFEDatabase(`fe-history-${randomUUID()}`);
    const history = new FEHistory(db);
    const payload = { text: '😀x'.repeat(80000) + '"\\\n', Id: '9007199254740993n' };

    try {
      await history.createSession('one');
      await history.append('one', [record(1000, payload), record(2000)]);
      let after = 0;
      let offset = 0;
      let result = '';
      let chunks = 0;

      while (true) {
        const part = await history.exportChunk('one', after, 2, offset);

        expect(part.text.length).toBeLessThanOrEqual(65536);
        result += new TextDecoder().decode(new TextEncoder().encode(part.text));
        chunks++;
        if (part.next === undefined) {
          break;
        }

        after = part.next;
        offset = part.offset;
      }
      expect(chunks).toBeGreaterThan(2);
      const rows = result
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line));

      expect(rows.map((row) => row.seq)).toEqual([1, 2]);
      expect(rows[0].message.data.text === payload.text).toBe(true);
      expect(rows[0].message.data.Id).toBe('9007199254740993n');
      expect(rows[1].message.data).toEqual({ IdFI: 123, price: 100 });
      const onlyLarge = [];

      after = 0;
      offset = 0;
      while (true) {
        const part = await history.exportChunk('one', after, 1, offset);

        onlyLarge.push(part.text);
        if (part.next === undefined) {
          break;
        }

        after = part.next;
        offset = part.offset;
      }
      expect(JSON.parse(onlyLarge.join('')).seq).toBe(1);
      const partial = await history.exportChunk('one', 0, 2);

      await history.finish('one');
      await history.remove('one');
      await expect(
        history.exportChunk('one', partial.next ?? -1, 2, partial.offset),
      ).rejects.toThrow('удалено');
    } finally {
      history.close();
    }
  });
  it('ограничивает число совпадений и оставляет найденное probe-сообщение следующей странице', async () => {
    const clock = mock.method(performance, 'now', () => 0);
    const history = new FEHistory(await openFEDatabase(`fe-history-${randomUUID()}`));
    const query = { ...filter, fe: '1' };

    try {
      await history.createSession('one');
      await history.append(
        'one',
        Array.from({ length: 251 }, (_, i) => ({
          ...record(i, { id: i }),
          fe: i % 3 === 0 ? 1 : 2,
        })),
      );
      const first = await history.page(query, undefined, Infinity, () => false, 3);

      expect(first.rows.map((row) => row.seq)).toEqual([250, 247, 244]);
      const probe = await history.page(query, first.next, Infinity, () => false, 0, true);

      expect(probe.matched).toBe(true);
      expect(probe.rows).toEqual([]);
      const second = await history.page(query, probe.next, Infinity, () => false, 2);

      expect(second.rows.map((row) => row.seq)).toEqual([241, 238]);
      const end = await history.page(
        { ...query, field: 'missing', operator: 'exists' },
        second.next,
        Infinity,
        () => false,
        1,
        true,
      );

      expect(end.matched).not.toBe(true);
      expect(end.next).toBeUndefined();
    } finally {
      history.close();
      clock.mock.restore();
    }
  });
  it('удаляет все сеансы за пределами первой страницы и возвращает место для записи', async () => {
    const first = record(1000);
    const history = new FEHistory(await openFEDatabase(`fe-history-${randomUUID()}`), first.bytes);

    try {
      for (let i = 0; i < 105; i++) {
        const id = `session-${i}`;

        await history.createSession(id);
        if (i === 0) {
          await history.append(id, [first]);
        }

        await history.finish(id);
      }
      expect(await history.sessions()).toHaveLength(100);
      await history.removeAll();
      expect(await history.sessions()).toEqual([]);
      await expect(history.readJSON('session-0', 1)).rejects.toThrow('не найдено');
      await history.createSession('new');
      await expect(history.append('new', [first])).resolves.toMatchObject({ count: 1 });
    } finally {
      history.close();
    }
  });
  it('не удаляет никакие сеансы, пока другая вкладка записывает историю', async () => {
    const name = `fe-history-${randomUUID()}`;
    const history = new FEHistory(await openFEDatabase(name));
    const other = new FEHistory(await openFEDatabase(name));

    try {
      await history.createSession('old');
      await history.append('old', [record(1000)]);
      await history.finish('old');
      await other.createSession('active');
      await other.append('active', [record(2000)]);
      await expect(history.removeAll()).rejects.toThrow('остановите запись');
      expect(await history.sessions()).toHaveLength(2);
      expect(await history.readJSON('old', 1)).toContain('123');
      expect(await history.readJSON('active', 1)).toContain('123');
      await other.finish('active');
      await history.removeAll();
      expect(await history.sessions()).toEqual([]);
    } finally {
      history.close();
      other.close();
    }
  });
  it('сохраняет переданный JSON без изменений после повторного открытия', async () => {
    const name = `fe-history-${randomUUID()}`;
    const history = new FEHistory(await openFEDatabase(name));

    await history.createSession('one');
    await history.append('one', [
      record(1000, { Id: '9007199254740993n', ConnectionKey: '[REDACTED]' }),
    ]);
    history.close();
    const reopened = new FEHistory(await openFEDatabase(name));

    try {
      const detail = await reopened.readJSON('one', 1);

      expect(JSON.parse(detail).data).toEqual({
        Id: '9007199254740993n',
        ConnectionKey: '[REDACTED]',
      });
      expect((await reopened.sessions())[0].count).toBe(1);
    } finally {
      reopened.close();
    }
  });
  it('пагинация не пропускает совпадения и исключает сообщения после снимка выдачи', async () => {
    const history = new FEHistory(await openFEDatabase(`fe-history-${randomUUID()}`));

    try {
      await history.createSession('one');
      await history.append(
        'one',
        Array.from({ length: 105 }, () => record(1000)),
      );
      const seen = [];
      let next;

      do {
        const page = await history.page(filter, next, 105);

        seen.push(...page.rows.map((row) => row.seq));
        next = page.next;
        if (!seen.length) {
          throw new Error('Пустая начальная выдача');
        }

        if (seen.length === page.rows.length) {
          await history.append('one', [record(1000)]);
        }
      } while (next);
      expect(seen).toEqual(Array.from({ length: 105 }, (_, i) => 105 - i));
    } finally {
      history.close();
    }
  });
  eachCase([
    { field: 'IdFI', operator: 'equals', value: '123', count: 1 },
    { field: 'data[].IdFI', operator: 'equals', value: '456', count: 1 },
    { field: 'missing', operator: 'exists', value: '', count: 0 },
    { field: 'price', operator: 'exists', value: '', count: 1 },
    { field: '', operator: 'contains', value: 'HELLO', count: 1 },
  ])('ищет $field / $operator / $value', async ({ count, ...query }) => {
    const history = new FEHistory(await openFEDatabase(`fe-history-${randomUUID()}`));

    try {
      await history.createSession('one');
      await history.append('one', [record(1000), record(2000, [{ IdFI: 456, note: 'hello' }])]);
      const page = await history.page({
        ...filter,
        ...query,
        from: 1000,
        to: 2000,
        fe: '1',
        direction: 'IN',
      });

      expect(page.rows).toHaveLength(count);
      expect((await history.page({ ...filter, from: 3000 })).rows).toHaveLength(0);
    } finally {
      history.close();
    }
  });
  it('лимит сохраняет старую историю, удаление возвращает место, экспорт содержит JSON', async () => {
    const first = record(1000);
    const history = new FEHistory(await openFEDatabase(`fe-history-${randomUUID()}`), first.bytes);

    try {
      await history.createSession('one');
      await history.createSession('two');
      await history.append('one', [first]);
      await expect(history.append('two', [first])).rejects.toThrow('лимит');
      expect(await history.readJSON('one', 1)).toContain('123');
      const exported = await history.exportChunk('one', 0, 1);

      expect(JSON.parse(exported.text).message.data).toEqual({ IdFI: 123, price: 100 });
      await history.finish('one');
      await history.remove('one');
      await expect(history.append('two', [first])).resolves.toMatchObject({ count: 1 });
      await history.finish('two');
      await expect(history.append('two', [first])).rejects.toThrow('сеанс закрыт');
    } finally {
      history.close();
    }
  });
});
