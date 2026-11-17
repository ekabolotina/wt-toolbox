import { FEValueMatcher } from './FEValueMatcher.js';
import { FE_LIMITS } from './limits.js';
const { PAGE_SIZE } = FE_LIMITS;
const propertyPath = (path, key) =>
  path + (/^[a-z_$][\w$]*$/i.test(key) ? `${path ? '.' : ''}${key}` : `[${JSON.stringify(key)}]`);

// Keep the original JSON and a small navigation cache, never a parsed copy of the whole array
export class FEJSONDocument {
  json;
  ranges = new Map();
  active = new Map();
  arrays = new Map();
  deadline = 0;
  constructor(json) {
    this.json = json;
  }
  async pause(cancelled) {
    if (cancelled()) {
      throw new Error('Просмотр сообщения отменён');
    }

    if (performance.now() >= this.deadline) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      this.deadline = performance.now() + 8;
      if (cancelled()) {
        throw new Error('Просмотр сообщения отменён');
      }
    }
  }
  space(at) {
    while (/\s/.test(this.json[at] ?? '') && at < this.json.length) {
      at++;
    }

    return at;
  }
  remember(range) {
    if (this.ranges.size >= 200) {
      const oldest = this.ranges.keys().next().value;

      if (oldest !== undefined) {
        this.ranges.delete(oldest);
      }
    }

    this.ranges.set(range.start, range);

    return range;
  }
  pin(range) {
    this.active.delete(range.start);
    this.active.set(range.start, range);
    if (this.active.size > 16) {
      const oldest = this.active.keys().next().value;

      if (oldest !== undefined) {
        this.active.delete(oldest);
      }
    }
  }
  async range(start, cancelled) {
    const active = this.active.get(start);

    if (active) {
      return active;
    }

    const cached = this.ranges.get(start);

    if (cached) {
      return cached;
    }

    if (!Number.isSafeInteger(start) || start < 0 || start >= this.json.length) {
      throw new Error('Неверная позиция JSON');
    }

    if (start === 0) {
      return this.remember({ start, end: this.json.length });
    }

    const first = this.json[start];
    let quoted = first === '"';
    let depth = first === '[' || first === '{' ? 1 : 0;
    let at = start + 1;
    let checkpoint = start + 65536;

    for (; at < this.json.length; at++) {
      if (at >= checkpoint) {
        await this.pause(cancelled);
        checkpoint = at + 65536;
      }

      const char = this.json[at];

      if (quoted) {
        if (char === '\\') {
          at++;
        } else if (char === '"') {
          quoted = false;
          if (first === '"') {
            at++;
            break;
          }
        }
      } else if (char === '"') {
        quoted = true;
      } else if (char === '[' || char === '{') {
        depth++;
      } else if (char === ']' || char === '}') {
        if (!depth || --depth === 0) {
          if (depth === 0 && (first === '[' || first === '{')) {
            at++;
          }

          break;
        }
      } else if (!depth && (char === ',' || /\s/.test(char))) {
        break;
      }
    }

    return this.remember({ start, end: at });
  }
  node({ start, end }) {
    const first = this.json[start];
    let type = 'number';

    if (first === '{') {
      type = 'object';
    } else if (first === '[') {
      type = 'array';
    } else if (first === '"') {
      type = 'string';
    } else if (first === 'n') {
      type = 'null';
    } else if (first === 't' || first === 'f') {
      type = 'boolean';
    }

    const index = this.arrays.get(start);
    const count = type === 'array' && index?.complete ? index.count : undefined;
    let preview = type === 'object' ? '{…}' : 'Array(…)';

    if (count !== undefined) {
      preview = `Array(${count})`;
    }

    if (type !== 'object' && type !== 'array') {
      preview = this.json.slice(start, Math.min(end, start + 120));
      if (end - start > 120) {
        preview += '…';
      }
    }

    return { offset: start, length: end - start, type, preview, count };
  }
  async entry(type, cursor, cancelled) {
    let at = this.space(cursor.offset);
    let key = `[${cursor.index}]`;

    if (type === 'object') {
      const name = await this.range(at, cancelled);

      key = JSON.parse(this.json.slice(name.start, name.end));
      at = this.space(name.end) + 1;
    }

    const range = await this.range(this.space(at), cancelled);
    let next = this.space(range.end);

    if (this.json[next] === ',') {
      next = this.space(next + 1);
    }

    return { key, range, next: { offset: next, index: cursor.index + 1 } };
  }
  async matches(start, keys, matcher, cancelled, relative = 0) {
    await this.pause(cancelled);
    const type = this.json[start];

    if (type !== '{' && type !== '[') {
      const range = await this.range(start, cancelled);
      const value = JSON.parse(this.json.slice(start, range.end));

      return {
        end: range.end,
        found: matcher.test(value, keys) || matcher.test(value, keys, relative),
      };
    }

    if (matcher.test(this, keys) || matcher.test(this, keys, relative)) {
      return { end: start, found: true };
    }

    let at = this.space(start + 1);
    let index = 0;

    while (this.json[at] !== (type === '{' ? '}' : ']')) {
      let key = String(index++);

      if (type === '{') {
        const name = await this.range(at, cancelled);

        key = JSON.parse(this.json.slice(at, name.end));
        at = this.space(this.space(name.end) + 1);
      }

      const child = await this.matches(at, [...keys, key], matcher, cancelled, relative);

      if (child.found) {
        return child;
      }

      at = this.space(child.end);
      if (this.json[at] === ',') {
        at = this.space(at + 1);
      }
    }

    return { end: at + 1, found: false };
  }
  async find(range, after, filter, cancelled, through, limit, probe) {
    const result = { node: this.node(range), entries: [], columns: [], scanned: 0 };
    const matcher = new FEValueMatcher(filter);
    const trail = after?.trail?.map((frame) => ({
      ...frame,
    })) ?? [
      { ...range, offset: after?.offset ?? this.space(range.start + 1), index: after?.index ?? 0 },
    ];
    const deadline = performance.now() + 8;
    let bytes = 0;

    while (trail.length && (probe || result.entries.length < Math.min(PAGE_SIZE, limit))) {
      await this.pause(cancelled);
      const frame = trail[trail.length - 1];

      if (frame.offset >= frame.end - 1 || (trail.length === 1 && frame.index > through)) {
        trail.pop();
        continue;
      }

      const array = this.json[frame.start] === '[';
      const item = await this.entry(array ? 'array' : 'object', frame, cancelled);
      const keys = trail.slice(1).map((parent) => parent.key ?? '');
      const key = array ? String(frame.index) : item.key;
      const prefix = keys.reduce(propertyPath, '');
      const label = array ? `${prefix}[${frame.index}]` : propertyPath(prefix, key);

      keys.push(key);
      const container = this.json[item.range.start] === '{' || this.json[item.range.start] === '[';
      const direct = container && matcher.test(this, keys);
      const found = array
        ? (await this.matches(item.range.start, keys, matcher, cancelled, keys.length)).found
        : direct ||
          (!container && (await this.matches(item.range.start, keys, matcher, cancelled)).found);

      result.scanned++;
      if (found && probe) {
        result.matched = true;
        result.next = { offset: frame.offset, index: frame.index, trail };

        return result;
      }

      const context = found && !array && !container;
      const selected = context ? frame : item.range;

      Object.assign(frame, context ? { offset: frame.end } : item.next);
      if (found) {
        result.entries.push({
          ...this.node(selected),
          key: (context ? prefix || '$' : label).slice(0, 320),
          arrayOffset: array ? frame.start : undefined,
          cells: [],
        });
      } else if (!array && container) {
        // Traverse wrappers until an array element or an object with a matching scalar is found
        trail.push({ ...item.range, offset: this.space(item.range.start + 1), index: 0, key });
      }

      bytes += container && !array && !found ? 0 : selected.end - selected.start;
      if (result.scanned >= 1000 || bytes >= 1048576 || performance.now() >= deadline) {
        break;
      }
    }
    while (trail.length) {
      const frame = trail[trail.length - 1];

      if (frame.offset < frame.end - 1 && (trail.length > 1 || frame.index <= through)) {
        result.next = { offset: frame.offset, index: frame.index, trail };
        break;
      }

      trail.pop();
    }

    return result;
  }
  async page(
    offset,
    after,
    filter,
    cancelled = () => false,
    through = Infinity,
    describeArrays = false,
    limit = PAGE_SIZE,
    probe = false,
  ) {
    this.deadline = performance.now() + 8;
    const range = await this.range(offset, cancelled);

    this.pin(range);
    const node = this.node(range);
    const result = { node, entries: [], columns: [], scanned: 0 };
    const searching = Boolean(filter.field || filter.value);

    if (
      (node.type !== 'object' && node.type !== 'array') ||
      (node.type === 'array' && describeArrays && !searching)
    ) {
      return result;
    }

    if (searching) {
      return this.find(range, after, filter, cancelled, through, limit, probe);
    }

    const columns = new Map();
    let cursor = after ?? { offset: this.space(range.start + 1), index: 0 };
    let bytes = 0;
    const deadline = performance.now() + 8;

    while (
      cursor.offset < range.end - 1 &&
      cursor.index <= through &&
      (probe || result.entries.length < Math.min(PAGE_SIZE, limit)) &&
      result.scanned < 1000
    ) {
      await this.pause(cancelled);
      const item = await this.entry(node.type, cursor, cancelled);

      result.scanned++;
      bytes += item.range.end - item.range.start;
      if (probe) {
        result.matched = true;
        result.next = cursor;

        return result;
      }

      const entry = {
        ...this.node(item.range),
        key: item.key.slice(0, 120),
        cells: [],
      };

      if (node.type === 'array' && entry.type === 'object') {
        let field = { offset: this.space(item.range.start + 1), index: 0 };

        while (field.offset < item.range.end - 1) {
          await this.pause(cancelled);
          const cell = await this.entry('object', field, cancelled);
          let column = columns.get(cell.key);

          if (column === undefined && columns.size < 8) {
            column = columns.size;
            columns.set(cell.key, column);
            result.columns.push(cell.key.slice(0, 120));
          }

          if (column !== undefined) {
            entry.cells.push({ column, node: this.node(cell.range) });
          }

          field = cell.next;
        }
      }

      result.entries.push(entry);
      cursor = item.next;
      if (bytes >= 1048576 || performance.now() >= deadline) {
        break;
      }
    }
    if (cursor.offset < range.end - 1 && cursor.index <= through) {
      result.next = cursor;
    }

    return result;
  }
  async segments(offset, from = 0, to, cancelled = () => false) {
    this.deadline = performance.now() + 8;
    const range = await this.range(offset, cancelled);

    if (this.json[offset] !== '[') {
      throw new Error('Этот узел не является массивом');
    }

    this.pin(range);
    let index = this.arrays.get(offset);

    if (!index) {
      index = {
        end: range.end,
        cursor: { offset: this.space(offset + 1), index: 0 },
        count: 0,
        starts: [],
        complete: false,
      };
    }

    this.arrays.delete(offset);
    this.arrays.set(offset, index);
    if (this.arrays.size > 8) {
      const oldest = this.arrays.keys().next().value;

      if (oldest !== undefined) {
        this.arrays.delete(oldest);
      }
    }

    const deadline = performance.now() + 8;
    let scanned = 0;
    let bytes = 0;

    while (!index.complete && index.cursor.offset < index.end - 1) {
      await this.pause(cancelled);
      const item = await this.entry('array', index.cursor, cancelled);

      if (index.count % PAGE_SIZE === 0) {
        index.starts.push(index.cursor.offset);
      }

      index.count++;
      bytes += item.range.end - index.cursor.offset;
      index.cursor = item.next;
      if (++scanned >= 10000 || bytes >= 1048576 || performance.now() >= deadline) {
        break;
      }
    }
    index.complete = index.cursor.offset >= index.end - 1;
    const result = { count: index.count, complete: index.complete, segments: [] };

    if (!index.complete || !index.count) {
      return result;
    }

    const end = Math.min(to ?? index.count - 1, index.count - 1);

    if (
      !Number.isSafeInteger(from) ||
      from < 0 ||
      from % PAGE_SIZE ||
      from > end ||
      !Number.isSafeInteger(end)
    ) {
      throw new Error('Неверный диапазон массива');
    }

    let span = PAGE_SIZE;

    while (Math.ceil((end - from + 1) / span) > PAGE_SIZE) {
      span *= PAGE_SIZE;
    }
    for (let start = from; start <= end; start += span) {
      result.segments.push({
        from: start,
        to: Math.min(end, start + span - 1),
        cursor: { offset: index.starts[start / PAGE_SIZE], index: start },
      });
    }

    return result;
  }
  async text(offset, from, cancelled = () => false) {
    const range = await this.range(offset, cancelled);

    this.pin(range);

    return {
      text: this.json.slice(range.start + from, Math.min(range.end, range.start + from + 65536)),
      length: range.end - range.start,
    };
  }
}
