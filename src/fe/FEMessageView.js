import { FE_LIMITS } from './limits.js';
const { PAGE_SIZE } = FE_LIMITS;
const emptyFilter = () => ({ field: '', operator: 'contains', value: '' });

export class FEMessageView {
  host;
  recorder;
  row;
  query = 0;
  copyQuery = 0;
  reads = Promise.resolve();
  paths = new WeakMap();
  crumbs = [];
  cursors = [undefined];
  pageIndex = 0;
  page;
  raw = false;
  textOffset = 0;
  textLength = 0;
  constructor(host, recorder) {
    this.host = host;
    this.recorder = recorder;
    host.classList.add('json-viewer');
    host.innerHTML = `
      <div id="selected"></div>
      <div class="json-controls"><button type="button" data-action="tree" title="Показать раскрываемые поля и диапазоны массива">Структура</button><button type="button" data-action="raw" title="Показать текущий узел текстом, порциями до 65 536 символов">Исходный JSON</button><button type="button" data-action="copy">Копировать JSON узла</button><button type="button" data-action="reset" title="Показать все поля и элементы текущего узла; фильтры списка сообщений сохранятся" hidden>Показать всё</button></div>
      <nav class="json-path" aria-label="Путь JSON"></nav>
      <details class="jsonFilter"><summary title="Поиск внутри выбранного узла без изменения фильтров списка сообщений">Поиск в узле</summary><form class="json-search" aria-label="Поиск внутри сообщения">
        <label>Поле <input name="jsonField" placeholder="Имя / вложенный.путь" title="Поиск среди дочерних узлов; внутри массива путь задаётся относительно его элемента. Пустое поле — все значения"></label>
        <select name="jsonOperator" aria-label="Операция внутри сообщения"><option value="contains">содержит</option><option value="equals">равно</option><option value="exists">существует</option></select>
        <label>Значение <input name="json-value" title="Искомое значение внутри дочернего узла или элемента массива"></label><button type="submit" title="Искать только внутри текущего узла выбранного сообщения">Найти в узле</button><button type="button" data-action="reset" title="Убрать фильтр внутри текущего узла">Сбросить</button>
      </form></details>
      <div class="json-status" role="status"></div>
      <div class="json-content"></div>
      <div class="json-controls jsonPager"><button type="button" data-action="prev" title="Предыдущая порция результатов или текста JSON">Назад по узлу</button><button type="button" data-action="next" title="Следующая порция результатов или текста JSON">Далее по узлу</button></div>`;
    host.addEventListener('click', this.onClick);
    host.addEventListener('submit', this.onSubmit);
    host.hidden = true;
  }
  element(selector) {
    const element = this.host.querySelector(selector);

    if (!element) {
      throw new Error(`Не найден элемент ${selector}`);
    }

    return element;
  }
  get current() {
    return this.crumbs[this.crumbs.length - 1];
  }
  highlight(element, text) {
    const filter = this.current.filter;
    const field = filter.field.replace(/\[\]/g, '').split('.').pop() || '';
    const term = filter.operator === 'exists' ? field : filter.value || field;
    const parts = term
      ? text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
      : [text];

    element.replaceChildren();
    for (const [index, part] of parts.entries()) {
      if (index % 2) {
        const mark = element.ownerDocument.createElement('mark');

        mark.textContent = part;
        element.append(mark);
      } else {
        element.append(element.ownerDocument.createTextNode(part));
      }
    }
  }
  button(label, action) {
    const button = document.createElement('button');

    button.type = 'button';
    button.textContent = label;
    button.dataset.action = action;

    return button;
  }
  nodeButton(node, label = node.preview) {
    const button = this.button(label, 'open');

    button.dataset.offset = String(node.offset);
    button.dataset.label = label;
    button.title = `${node.type} · ${node.length} символов JSON. Открыть этот узел`;

    return button;
  }
  onSubmit = (event) => {
    event.preventDefault();
    const operator = this.element('[name=jsonOperator]').value;

    this.current.filter = {
      field: this.element('[name=jsonField]').value.trim(),
      value: this.element('[name=json-value]').value,
      operator: operator === 'equals' || operator === 'exists' ? operator : 'contains',
    };
    this.resetPage();
    this.raw = false;
    void this.load();
  };
  onClick = (event) => {
    const button = event.target.closest('button');

    if (!button || button.disabled || !this.row) {
      return;
    }

    const action = button.dataset.action;

    if (action === 'copy' || action === 'copy-object') {
      event.preventDefault();
      const copy = ++this.copyQuery;
      const query = this.query;
      const whole = action === 'copy-object';
      const offset = whole ? Number(button.dataset.offset) : this.current.offset;
      const from = !whole && this.raw ? this.textOffset : 0;

      this.reads = this.reads.then(() => this.copy(query, copy, offset, from, whole));

      return;
    }

    if (action === 'open') {
      const path = this.paths.get(button);

      if (path) {
        this.crumbs = path;
      } else {
        this.crumbs.push({
          offset: Number(button.dataset.offset),
          label: button.dataset.label ?? '',
          filter: emptyFilter(),
        });
      }

      this.raw = false;
      this.resetPage();
    } else if (action === 'crumb') {
      this.crumbs.length = Number(button.dataset.index) + 1;
      this.resetPage();
    } else if (action === 'reset') {
      this.current.filter = emptyFilter();
      this.raw = false;
      this.resetPage();
    } else if (action === 'raw' || action === 'tree') {
      this.raw = action === 'raw';
      this.textOffset = 0;
    } else if (action === 'prev') {
      if (this.raw) {
        this.textOffset = Math.max(0, this.textOffset - 65536);
      } else {
        this.pageIndex--;
      }
    } else if (action === 'next') {
      if (this.raw) {
        this.textOffset += 65536;
      } else {
        this.cursors[++this.pageIndex] = this.page?.next;
      }
    } else {
      return;
    }

    void this.load();
  };
  resetPage() {
    this.pageIndex = 0;
    this.cursors = [undefined];
    this.textOffset = 0;
  }
  async show(row, filter = emptyFilter()) {
    this.row = row;
    this.crumbs = [
      {
        offset: 0,
        label: '$',
        filter: { field: filter.field, operator: filter.operator, value: filter.value },
      },
    ];
    this.raw = false;
    this.resetPage();
    this.host.hidden = false;
    this.element('#selected').textContent =
      `${row.entity} · ${row.source} · connection ${row.connectionId} · #${row.seq}`;
    await this.load();
  }
  clear() {
    this.query++;
    this.row = undefined;
    this.page = undefined;
    this.crumbs = [];
    this.element('.json-content').replaceChildren();
    this.host.hidden = true;
    void this.recorder.rpc({ method: 'inspect-clear' }).catch(() => undefined);
  }
  destroy() {
    this.clear();
    this.host.removeEventListener('click', this.onClick);
    this.host.removeEventListener('submit', this.onSubmit);
  }
  async load() {
    const row = this.row;

    if (!row) {
      return;
    }

    const query = ++this.query;
    const current = this.current;
    const status = this.element('.json-status');
    const content = this.element('.json-content');
    const prev = this.element('[data-action=prev]');
    const next = this.element('[data-action=next]');

    content.setAttribute('aria-busy', 'true');
    this.element('.jsonPager').hidden = true;
    prev.disabled = true;
    next.disabled = true;
    this.element('[data-action=copy]').disabled = true;
    content.replaceChildren();
    this.paths = new WeakMap();
    content.classList.toggle('json-tree', !this.raw);
    status.textContent = 'Поиск внутри сообщения…';
    status.classList.remove('error');
    this.element('.jsonFilter').hidden = this.raw;
    this.element('.json-controls [data-action=reset]').hidden =
      !current.filter.field && !current.filter.value;
    this.element('.jsonFilter > summary').textContent =
      current.filter.field || current.filter.value
        ? 'Поиск в узле · фильтр применён'
        : 'Поиск в узле';
    this.element('[name=jsonField]').value = current.filter.field;
    this.element('[name=json-value]').value = current.filter.value;
    this.element('[name=jsonOperator]').value = current.filter.operator;
    this.element('.json-path').replaceChildren(
      ...this.crumbs.map((crumb, index) => {
        const button = this.button(crumb.label, 'crumb');

        button.dataset.index = String(index);
        button.title = 'Перейти к этому уровню JSON';

        return button;
      }),
    );
    try {
      if (this.raw) {
        const part = await this.recorder.rpc({
          method: 'inspect-text',
          sessionId: row.sessionId,
          seq: row.seq,
          offset: current.offset,
          from: this.textOffset,
        });

        if (query !== this.query) {
          return;
        }

        this.textLength = part.length;
        const pre = document.createElement('pre');

        this.highlight(pre, part.text);
        content.append(pre);
        status.textContent = `JSON: символы ${this.textOffset + 1}–${this.textOffset + part.text.length} из ${part.length}`;
        prev.disabled = this.textOffset === 0;
        next.disabled = this.textOffset + part.text.length >= part.length;
        this.element('.jsonPager').hidden = prev.disabled && next.disabled;
      } else {
        let page;
        const entries = [];
        let after = this.cursors[this.pageIndex];
        let scanned = 0;

        do {
          page = await this.recorder.rpc({
            method: 'inspect',
            sessionId: row.sessionId,
            seq: row.seq,
            offset: current.offset,
            after,
            filter: current.filter,
            describeArrays: true,
            limit: PAGE_SIZE - entries.length,
          });
          if (query !== this.query) {
            return;
          }

          scanned += page.scanned;
          entries.push(
            ...page.entries.map((entry) => ({
              ...entry,
              preview: this.entryPreview(entry, page.columns),
              cells: [],
            })),
          );
          after = page.next;
          status.textContent = `Поиск внутри сообщения… просмотрено ${scanned}`;
        } while (entries.length < PAGE_SIZE && page.next);
        page = { ...page, entries, columns: [], scanned };
        if (entries.length === PAGE_SIZE && page.next) {
          let cursor = page.next;

          while (cursor) {
            const probe = await this.recorder.rpc({
              method: 'inspect',
              sessionId: row.sessionId,
              seq: row.seq,
              offset: current.offset,
              after: cursor,
              filter: current.filter,
              limit: 1,
              probe: true,
            });

            if (query !== this.query) {
              return;
            }

            scanned += probe.scanned;
            page.next = probe.next;
            status.textContent = `Поиск внутри сообщения… просмотрено ${scanned}`;
            if (probe.matched) {
              break;
            }

            cursor = probe.next;
          }
        }

        this.page = page;
        this.textLength = page.node.length;
        await this.render(page, () => query === this.query);
        if (query !== this.query) {
          return;
        }

        const searching = Boolean(current.filter.field || current.filter.value);

        if (searching) {
          const first = content.querySelector(':scope > .jsonEntry');

          if (first instanceof HTMLDetailsElement) {
            first.open = true;
          }
        }

        status.textContent = searching ? `Показано совпадений: ${page.entries.length}` : '';
        this.element('.jsonFilter').hidden =
          page.node.type !== 'object' && page.node.type !== 'array';
        prev.disabled = this.pageIndex === 0;
        next.disabled = !page.next;
        this.element('.jsonPager').hidden = prev.disabled && next.disabled;
      }

      const copy = this.element('[data-action=copy]');

      copy.disabled = false;
      copy.textContent =
        this.textLength > 65536 ? 'Копировать фрагмент JSON' : 'Копировать JSON узла';
      copy.title = 'До 65 536 символов. Для полного большого сообщения доступен экспорт сеанса';
    } catch (error) {
      if (query === this.query) {
        status.textContent = String(error);
        status.classList.add('error');
      }
    } finally {
      if (query === this.query) {
        content.setAttribute('aria-busy', 'false');
      }
    }
  }
  async render(page, current) {
    const content = this.element('.json-content');

    if (page.node.type !== 'array' && page.node.type !== 'object') {
      const pre = document.createElement('pre');

      this.highlight(pre, page.node.preview);
      content.append(pre);

      return;
    }

    content.classList.add('json-tree');
    if (page.node.type === 'array' && !this.current.filter.field && !this.current.filter.value) {
      await this.renderArray(content, page.node, this.crumbs, current);
    } else {
      this.renderNodes(content, page, this.crumbs);
      const data =
        this.current.offset === 0
          ? page.entries.find((entry) => entry.key === 'data' && entry.type === 'array')
          : undefined;
      const value = data && content.querySelector(`.json-value[data-offset="${data.offset}"]`);

      if (data && value) {
        const count = this.reads.then(async () => {
          const description = await this.describeArray(data, current);

          if (description && current()) {
            value.textContent = data.preview;
            value.title = data.preview;
          }
        });

        this.reads = count.catch(() => undefined);
        await count;
      }
    }
  }
  async describeArray(node, current, from = 0, to, progress) {
    const row = this.row;

    if (!row || !current()) {
      return;
    }

    let data;

    do {
      data = await this.recorder.rpc({
        method: 'inspect-array',
        sessionId: row.sessionId,
        seq: row.seq,
        offset: node.offset,
        from,
        to,
      });
      if (!current()) {
        return;
      }

      progress?.(data.count);
    } while (!data.complete);
    node.count = data.count;
    node.preview = `Array(${data.count})`;

    return data;
  }
  async renderArray(parent, node, path, current, from = 0, to, heading = true) {
    const data = await this.describeArray(node, current, from, to, (count) => {
      parent.textContent = `Подсчёт элементов массива… ${count}`;
    });

    if (!data) {
      return;
    }

    parent.replaceChildren();
    if (heading) {
      const info = document.createElement('div');

      info.className = 'muted';
      info.textContent =
        data.count > 100
          ? `Array(${data.count}) · ${Math.ceil(data.count / 100)} сегментов по 100 элементов`
          : `Array(${data.count})`;
      parent.append(info);
    }

    if (!data.count) {
      return;
    }

    if (data.count <= 100 && from === 0 && to === undefined) {
      const children = document.createElement('div');

      parent.append(children);
      await this.renderSegment(children, node, data.segments[0], path, current);

      return;
    }

    for (const segment of data.segments) {
      const range = document.createElement('details');
      const summary = document.createElement('summary');
      const children = document.createElement('div');
      const query = this.query;
      let revision = 0;

      range.className = 'json-branch jsonRange';
      summary.className = 'json-summary';
      summary.textContent = `[${segment.from} … ${segment.to}]`;
      summary.title = `${segment.to - segment.from + 1} элементов. Загрузить только этот диапазон`;
      children.className = 'json-children';
      range.append(summary, children);
      range.ontoggle = () => {
        const token = ++revision;

        children.replaceChildren();
        if (range.open && range.isConnected && query === this.query) {
          this.collapseSiblings(range);
          const valid = () =>
            current() &&
            query === this.query &&
            token === revision &&
            range.open &&
            range.isConnected;

          this.reads = this.reads.then(async () => {
            if (!valid()) {
              return;
            }

            try {
              if (segment.to - segment.from < 100) {
                await this.renderSegment(children, node, segment, path, valid);
              } else {
                await this.renderArray(
                  children,
                  node,
                  path,
                  valid,
                  segment.from,
                  segment.to,
                  false,
                );
              }
            } catch (error) {
              if (valid()) {
                children.textContent = String(error);
              }
            }
          });
        }
      };
      parent.append(range);
    }
  }
  async renderSegment(parent, node, segment, path, current) {
    const row = this.row;

    if (!row || !current()) {
      return;
    }

    if (this.element('.json-content').querySelectorAll('.jsonEntry').length > 200) {
      this.expansionLimit(parent, node, path);

      return;
    }

    const pages = [];
    let after = segment.cursor;

    do {
      parent.textContent = `Загрузка [${segment.from} … ${segment.to}]…`;
      const page = await this.recorder.rpc({
        method: 'inspect',
        sessionId: row.sessionId,
        seq: row.seq,
        offset: node.offset,
        after,
        through: segment.to,
        filter: emptyFilter(),
      });

      if (!current()) {
        return;
      }

      pages.push(page);
      after = page.next;
    } while (after);
    parent.replaceChildren();
    for (const page of pages) {
      this.renderNodes(parent, page, path);
    }
  }
  collapseSiblings(branch) {
    for (const sibling of branch.parentElement?.children ?? []) {
      if (sibling instanceof HTMLDetailsElement && sibling !== branch) {
        sibling.open = false;
        sibling.querySelector(':scope > .json-children')?.replaceChildren();
      }
    }
  }
  renderNodes(parent, page, path) {
    if (
      this.element('.json-content').querySelectorAll('.jsonEntry').length + page.entries.length >
      300
    ) {
      this.expansionLimit(parent, page.node, path);

      return;
    }

    for (const entry of page.entries) {
      const expandable = (entry.type === 'object' || entry.type === 'array') && entry.length > 2;
      const row = document.createElement(expandable ? 'details' : 'div');
      const line = document.createElement(expandable ? 'summary' : 'div');
      const name = document.createElement('span');
      const value = document.createElement('span');
      const childPath = [
        ...path,
        { offset: entry.offset, label: entry.key || '""', filter: emptyFilter() },
      ];
      const preview = this.entryPreview(entry, page.columns);

      row.className = expandable ? 'jsonEntry json-branch' : 'jsonEntry';
      line.className = expandable ? 'json-summary' : 'json-leaf';
      name.className = 'json-name';
      name.title = entry.key || '""';
      this.highlight(
        name,
        `${page.node.type === 'array' ? entry.key.slice(1, -1) : entry.key || '""'}: `,
      );
      value.className = 'json-value';
      value.dataset.type = entry.type;
      if (entry.type === 'array') {
        value.dataset.offset = String(entry.offset);
      }

      this.highlight(value, preview.slice(0, 320));
      value.title = preview.slice(0, 640);
      line.append(name, value);
      if (expandable) {
        const jump = this.nodeButton(entry, '↗');

        jump.className = 'json-jump';
        jump.dataset.label = entry.key || '""';
        jump.setAttribute('aria-label', `Открыть ${entry.key || '""'} отдельно`);
        jump.title = 'Открыть этот узел отдельно: поиск, JSON и копирование';
        this.paths.set(jump, childPath);
        line.append(jump);
      }

      if (
        (page.node.type === 'array' || entry.arrayOffset !== undefined) &&
        entry.type === 'object'
      ) {
        const copy = this.button('⧉', 'copy-object');

        copy.className = 'json-jump';
        copy.dataset.offset = String(entry.offset);
        copy.title = `Копировать JSON объекта ${entry.key} целиком`;
        copy.setAttribute('aria-label', copy.title);
        line.append(copy);
      }

      row.append(line);
      parent.append(row);
      if (row instanceof HTMLDetailsElement) {
        this.setupBranch(row, entry, childPath);
      }
    }
  }
  entryPreview(entry, columns) {
    if (entry.length === 2 && (entry.type === 'object' || entry.type === 'array')) {
      return entry.type === 'object' ? '{}' : '[]';
    }

    if (entry.type === 'object' && entry.cells.length) {
      const fields = entry.cells
        .slice(0, 4)
        .map((cell) => `${columns[cell.column]}: ${cell.node.preview}`);

      return `{${fields.join(', ')}${entry.cells.length > 4 ? ', …' : ''}}`.slice(0, 320);
    }

    return entry.preview;
  }
  expansionLimit(parent, node, path) {
    const hint = document.createElement('div');
    const jump = this.nodeButton(node, 'Открыть этот узел отдельно');

    this.paths.set(jump, path);
    hint.className = 'muted';
    hint.textContent =
      'Достигнут лимит раскрытого дерева. Сверните другие ветки или откройте узел отдельно';
    parent.replaceChildren(hint, jump);
  }
  setupBranch(branch, node, path) {
    const children = document.createElement('div');
    const query = this.query;
    const row = this.row;
    let revision = 0;

    children.className = 'json-children';
    branch.append(children);
    branch.ontoggle = () => {
      const token = ++revision;

      children.replaceChildren();
      if (!branch.open || !row) {
        return;
      }

      this.collapseSiblings(branch);
      const current = () =>
        query === this.query && token === revision && branch.open && branch.isConnected;
      const load = async (after) => {
        if (!current()) {
          return;
        }

        children.replaceChildren();
        if (this.element('.json-content').querySelectorAll('.jsonEntry').length > 200) {
          this.expansionLimit(children, node, path);

          return;
        }

        children.textContent = 'Загрузка полей…';
        try {
          const page = await this.recorder.rpc({
            method: 'inspect',
            sessionId: row.sessionId,
            seq: row.seq,
            offset: node.offset,
            after,
            filter: emptyFilter(),
            describeArrays: true,
          });

          if (!current()) {
            return;
          }

          children.replaceChildren();
          if (page.node.type === 'array') {
            await this.renderArray(children, page.node, path, current);
            if (current() && page.node.count !== undefined) {
              const value = branch.querySelector(':scope > summary > .json-value');

              if (value) {
                value.textContent = `Array(${page.node.count})`;
              }
            }

            return;
          }

          this.renderNodes(children, page, path);
          if (!page.entries.length) {
            children.textContent = node.type === 'array' ? '[]' : '{}';
          }

          if (page.next) {
            const more = this.button('Следующая порция полей', 'branch-next');

            more.title = 'Заменить эту порцию следующей, не накапливая элементы';
            more.onclick = () => {
              this.reads = this.reads.then(() => load(page.next));
            };
            children.append(more);
          }
        } catch (error) {
          if (current()) {
            children.textContent = String(error);
          }
        }
      };

      this.reads = this.reads.then(() => load());
    };
  }
  async copy(query, copy, offset, from, whole) {
    const row = this.row;

    if (!row || query !== this.query || copy !== this.copyQuery) {
      return;
    }

    try {
      const parts = [];

      while (true) {
        const part = await this.recorder.rpc({
          method: 'inspect-text',
          sessionId: row.sessionId,
          seq: row.seq,
          offset,
          from,
        });

        if (query !== this.query || copy !== this.copyQuery) {
          return;
        }

        parts.push(part.text);
        from += part.text.length;
        if (!whole || from >= part.length) {
          break;
        }

        if (!part.text.length) {
          throw new Error('Не удалось прочитать JSON объекта целиком');
        }

        this.element('.json-status').textContent =
          `Копирование JSON объекта… ${from} / ${part.length}`;
      }
      if (query === this.query && copy === this.copyQuery) {
        const view = this.host.ownerDocument.defaultView;

        if (!view) {
          throw new Error('Окно просмотрщика закрыто');
        }

        if (this.recorder.copy) {
          await this.recorder.copy(parts.join(''));
        } else {
          await view.navigator.clipboard.writeText(parts.join(''));
        }

        if (query === this.query && copy === this.copyQuery) {
          this.element('.json-status').textContent = whole
            ? 'JSON объекта скопирован'
            : 'JSON скопирован';
        }
      }
    } catch (error) {
      if (query === this.query && copy === this.copyQuery) {
        this.element('.json-status').textContent = String(error);
      }
    }
  }
}
