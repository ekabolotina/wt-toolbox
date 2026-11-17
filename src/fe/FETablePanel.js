import { setupEntityPicker } from './setupEntityPicker.js';
import { FEMessageView } from './FEMessageView.js';
import { FE_LIMITS } from './limits.js';
const { HISTORY_LIMIT, PAGE_SIZE } = FE_LIMITS;

export class FETablePanel {
  recorder;
  onDispose;
  host = document.createElement('div');
  shadow = this.host.attachShadow({ mode: 'open' });
  root;
  sessions = [];
  session;
  filter;
  cursors = [undefined];
  next;
  pageIndex = 0;
  query = 0;
  snapshotSeq = 0;
  messageView;
  busy = false;
  exporting = false;
  destroyed = false;
  starting = false;
  clearing = false;
  reloading = false;
  constructor(recorder, onDispose, container, styles) {
    this.recorder = recorder;
    this.onDispose = onDispose;
    this.shadow.innerHTML = `<style>${styles}</style>
      <section class="panel" aria-label="Сообщения FE" tabindex="-1">
        <header><strong>FE messages</strong><div class="recording-controls" role="group" aria-label="Управление записью"><button id="record" title="Начать новый сеанс записи входящих и исходящих сообщений FE; вывод DEBUG_FE_MESSAGES в консоль будет отключён">Начать запись</button><button id="reload" title="Сохранить текущую запись, перезагрузить вкладку и один раз включить запись до первого FE-сообщения">Перезагрузить и начать запись</button></div><select id="session" aria-label="Сеанс" title="Выберите сохранённый сеанс записи для просмотра"></select>
          <button id="olderSessions" title="Загрузить предыдущие 100 сеансов">Более ранние сеансы</button><button id="latestSessions" title="Вернуться к последним 100 сеансам записи">Последние сеансы</button><button id="close" aria-label="Отключиться" title="Отключиться и остановить запись">×</button></header>
        <form><label>FE <input name="fe" placeholder="Все" inputmode="numeric" title="Номер FE. Пустое поле — все FE"></label>
          <div class="entity-picker"><label for="fe-entity">Сущность (Entity)</label><div class="entity-control"><input id="fe-entity" name="entity" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="fe-entities" autocomplete="off" placeholder="Все / введите имя" title="Точное имя сущности: выберите подсказку или введите своё. Пустое поле — все сущности"><button id="entityToggle" type="button" aria-label="Показать список сущностей" aria-controls="fe-entities" aria-expanded="false" title="Показать подходящие имена сущностей">▾</button></div><div id="fe-entities" class="entity-options" role="listbox" aria-label="Сущности" hidden></div></div>
          <label>Направление <select name="direction" title="IN — получено от FE, OUT — отправлено в FE"><option value="">Все</option><option>IN</option><option>OUT</option></select></label>
          <details class="period"><summary title="Фильтр по дате и времени: начало и конец периода">Период</summary><div class="period-fields"><label>С <input name="from" type="datetime-local" step="0.001" title="Начало диапазона включительно, в местном времени. Пустое поле — без ограничения"></label><label>По <input name="to" type="datetime-local" step="0.001" title="Конец диапазона включительно, в местном времени. Пустое поле — без ограничения"></label></div></details>
          <label>Поле <input name="field" placeholder="idFi / data[].idFi" title="Имя поля или путь, например data[].idFi. Без поля поиск выполняется по всем скалярным значениям"></label>
          <select name="operator" aria-label="Операция" title="Содержит — поиск подстроки; равно — точное совпадение; существует — проверка наличия поля без учёта значения"><option value="contains">содержит</option><option value="equals">равно</option><option value="exists">существует</option></select>
          <label>Значение <input name="value" title="Искомое значение. Не учитывается при операции «существует»"></label><button type="submit" title="Применить все фильтры вместе и показать первую страницу результатов">Найти</button><button id="clearSearch" type="button" title="Сбросить все фильтры, включая период, и показать первую страницу текущего сеанса">Очистить поиск</button></form>
        <div class="body"><div class="list"><table><thead><tr><th>Время</th><th>FE</th><th>Напр.</th><th>Entity</th></tr></thead><tbody></tbody></table>
          <button id="prev" title="Предыдущая страница результатов">Назад</button><button id="next" title="Следующая страница: до 100 совпадений после применения фильтров">Далее</button><span id="progress"></span></div>
          <div class="detail"><div id="messageView"></div></div></div>
        <footer><div id="stats" class="status"></div><div id="status" role="status" class="status"></div>
          <button id="refresh" title="Повторить поиск с текущими фильтрами, включая поступившие сообщения, и вернуться на первую страницу">Обновить список</button><span id="newMessages" class="muted" title="Число сохранённых сообщений после последнего поиска, без учёта фильтров"></span><button id="export" title="Сохранить весь выбранный сеанс в JSONL: одно сообщение на строку, без учёта фильтров">Скачать сеанс (JSONL)</button><button id="remove" class="danger" title="Безвозвратно удалить выбранный сеанс из локальной истории; потребуется подтверждение">Удалить сеанс</button><button id="removeAll" class="danger" title="Безвозвратно удалить всю локальную историю FE во всех вкладках. Сначала остановите запись во всех вкладках">Удалить все сеансы</button>
          <span>SharedWorker: соединение принадлежит текущей активной вкладке</span></footer>
      </section>`;
    this.root = this.element('.panel');
    setupEntityPicker(
      this.element('#fe-entity'),
      this.element('#fe-entities'),
      this.element('#entityToggle'),
    );
    this.messageView = new FEMessageView(this.element('#messageView'), this.recorder);
    this.recorder.onChange = (session, error) => {
      if (this.destroyed) {
        return;
      }

      if (session) {
        const existing = this.sessions.find((item) => item.id === session.id);

        if (existing) {
          Object.assign(existing, session);
        }

        if (this.session?.id === session.id) {
          this.session = session;
        }
      }

      if (error) {
        this.status(error, true);
      }

      this.update();
    };
    this.element('form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.run(() => this.search());
    });
    this.button('olderSessions', () =>
      this.loadSessions(undefined, this.sessions[this.sessions.length - 1]?.id),
    );
    this.button('latestSessions', () => this.loadSessions());
    this.button('record', () => this.toggleRecording());
    this.button('reload', () => this.reloadAndRecord());
    this.button('close', async () => this.hide());
    this.button('refresh', () => this.search());
    this.button('clearSearch', async () => {
      this.element('form').reset();
      await this.search();
    });
    this.button('prev', () => this.loadPage(this.pageIndex - 1));
    this.button('next', async () => {
      this.cursors[this.pageIndex + 1] = this.next;
      await this.loadPage(this.pageIndex + 1);
    });
    this.button('export', () => this.export());
    this.button('removeAll', () => this.removeAll());
    this.button('remove', async () => {
      if (!this.session || this.recorder.isRecording || this.exporting) {
        return;
      }

      if (!this.view.confirm('Удалить выбранный сеанс FE без возможности восстановления?')) {
        return;
      }

      await this.recorder.rpc({ method: 'remove', sessionId: this.session.id });
      await this.loadSessions();
    });
    this.element('#session').addEventListener('change', () =>
      this.run(async () => {
        this.session = this.sessions.find((item) => item.id === this.element('#session').value);
        await this.search();
      }),
    );
    this.root.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.hide();
        event.stopPropagation();
      }
    });
    this.root.classList.add('embedded');
    this.element('#close').title = 'Отключиться и остановить запись';
    container.append(this.host);
    this.run(() => this.loadSessions(this.recorder.sessionId));
    this.reveal();
  }
  get view() {
    return this.host.ownerDocument.defaultView ?? window;
  }
  element(selector) {
    const element = this.shadow.querySelector(selector);

    if (!element) {
      throw new Error(`Не найден элемент ${selector}`);
    }

    return element;
  }
  button(id, action) {
    this.element(`#${id}`).addEventListener('click', () => this.run(action));
  }
  run(action) {
    void action().catch((error) => this.status(String(error), true));
  }
  status(message, error = false) {
    const element = this.element('#status');

    element.textContent = message;
    element.classList.toggle('error', error);
  }
  update() {
    const active = this.recorder.isRecording || this.starting;
    let recordLabel = 'Начать запись';
    let stateLabel = '○ Просмотр';

    if (this.starting) {
      recordLabel = 'Подготовка';
      stateLabel = '○ Подготовка';
    } else if (active) {
      recordLabel = 'Остановить запись';
      stateLabel = '● Запись';
    }

    this.element('#record').textContent = recordLabel;
    this.element('#record').title = active
      ? 'Остановить сбор сообщений и дождаться сохранения очереди. История останется доступна'
      : 'Начать новый сеанс записи входящих и исходящих сообщений FE; вывод DEBUG_FE_MESSAGES в консоль будет отключён';
    this.element('#record').disabled = this.starting || this.clearing || this.reloading;
    this.element('#reload').disabled =
      this.starting || this.clearing || this.exporting || this.reloading;
    this.element('#remove').disabled =
      active || !this.session || this.exporting || this.clearing || this.reloading;
    this.element('#removeAll').disabled =
      active || !this.sessions.length || this.exporting || this.clearing || this.reloading;
    this.element('#export').disabled =
      !this.session || this.exporting || this.clearing || this.reloading;
    const session = this.session;

    this.element('#newMessages').textContent =
      `Новых сообщений: ${Math.max(0, (session?.count ?? 0) - this.snapshotSeq)}`;
    this.element('#stats').textContent = session
      ? `${stateLabel} · Сохранено: ${session.count} · Данные сеанса: ${(session.bytes / 1048576).toFixed(2)} MiB · Лимит всей истории: ${HISTORY_LIMIT / 1048576} MiB`
      : 'Выберите сеанс или начните запись';
  }
  async loadSessions(selectedId = this.session?.id, before) {
    this.sessions = await this.recorder.rpc({ method: 'sessions', before });
    this.element('#olderSessions').disabled = this.sessions.length < 100;
    this.session = this.sessions.find((item) => item.id === selectedId) ?? this.sessions[0];
    const select = this.element('#session');

    select.replaceChildren();
    for (const session of this.sessions) {
      const option = document.createElement('option');

      option.value = session.id;
      option.textContent = `${new Date(session.startedAt).toLocaleString()}${session.origin ? ` · ${session.origin}` : ''}`;
      select.append(option);
    }
    select.value = this.session?.id ?? '';
    if (this.session?.error) {
      this.status(this.session.error, true);
    } else if (this.session?.partialStart) {
      this.status('В начале сеанса пропущен начальный фрагмент существующего direct-потока');
    }

    await this.search();
  }
  async removeAll() {
    if (this.recorder.isRecording || this.starting || this.exporting || this.clearing) {
      return;
    }

    if (
      !this.view.confirm('Удалить ВСЕ сеансы FE и все сообщения без возможности восстановления?')
    ) {
      return;
    }

    this.clearing = true;
    this.update();
    try {
      this.query++;
      this.messageView.clear();
      await this.recorder.rpc({ method: 'remove-all' });
      await this.loadSessions();
      this.status('Все сеансы FE удалены');
    } finally {
      this.clearing = false;
      this.update();
    }
  }
  async reloadAndRecord() {
    if (this.starting || this.exporting || this.clearing || this.reloading) {
      throw new Error('Дождитесь завершения текущей операции');
    }

    this.reloading = true;
    this.status('Сохранение истории перед перезагрузкой…');
    this.update();
    try {
      await this.recorder.stop();
      await this.recorder.reload();
      await this.loadSessions(this.recorder.sessionId);
      this.reloading = false;
      this.update();
    } catch (error) {
      this.reloading = false;
      this.update();
      throw error;
    }
  }
  async toggleRecording() {
    if (this.recorder.isRecording) {
      await this.recorder.stop();
      this.status('Запись остановлена');
      await this.loadSessions();

      return;
    }

    if (this.starting) {
      return;
    }

    this.starting = true;
    this.update();
    try {
      await this.recorder.start();
      await this.loadSessions(this.recorder.sessionId);
      this.status(
        'Запись включена. Начальный фрагмент существующего direct-соединения пропускается при синхронизации',
      );
      if (navigator.storage?.persist) {
        void navigator.storage
          .persist()
          .then((persistent) => {
            if (!persistent && !this.destroyed) {
              this.status(
                'Браузер не закрепил хранилище: история может быть очищена при нехватке места',
              );
            }
          })
          .catch(() => undefined);
      }
    } finally {
      this.starting = false;
      this.update();
    }
  }
  async search() {
    this.query++;
    this.messageView.clear();
    await this.recorder.rpc({ method: 'cancel' });
    const form = this.element('form');
    const data = new FormData(form);
    const value = (name) => String(data.get(name) ?? '').trim();
    const from = value('from') ? new Date(value('from')).getTime() : 0;
    const to = value('to') ? new Date(value('to')).getTime() : Number.MAX_SAFE_INTEGER;

    if (!Number.isFinite(from) || !Number.isFinite(to) || from > to) {
      throw new Error('Неверный диапазон времени');
    }

    const operator = value('operator');

    this.filter = {
      sessionId: this.session?.id ?? '',
      entity: value('entity'),
      fe: value('fe'),
      direction: value('direction'),
      from,
      to,
      field: value('field'),
      value: value('value'),
      operator: operator === 'exists' || operator === 'equals' ? operator : 'contains',
    };
    this.snapshotSeq = this.session?.count ?? 0;
    this.cursors = [undefined];
    await this.loadPage(0);
  }
  async loadPage(index) {
    if (!this.filter || index < 0) {
      return;
    }

    const query = ++this.query;

    this.busy = true;
    this.element('#prev').disabled = true;
    this.element('#next').disabled = true;
    const tbody = this.element('tbody');

    tbody.replaceChildren();
    this.element('#progress').textContent = 'Поиск…';
    const session = this.session;
    const page = { rows: [], scanned: 0, next: this.cursors[index] };

    if (session) {
      do {
        const chunk = await this.recorder.rpc({
          method: 'page',
          filter: this.filter,
          next: page.next,
          maxSeq: this.snapshotSeq,
          limit: PAGE_SIZE - page.rows.length,
        });

        if (query !== this.query || this.destroyed) {
          return;
        }

        page.scanned += chunk.scanned;
        page.rows.push(...chunk.rows);
        page.next = chunk.next;
        this.element('#progress').textContent =
          `Поиск… найдено ${page.rows.length}, просмотрено ${page.scanned}`;
      } while (page.rows.length < PAGE_SIZE && page.next);
      if (page.rows.length === PAGE_SIZE && page.next) {
        let after = page.next;

        while (after) {
          const probe = await this.recorder.rpc({
            method: 'page',
            filter: this.filter,
            next: after,
            maxSeq: this.snapshotSeq,
            limit: 1,
            probe: true,
          });

          if (query !== this.query || this.destroyed) {
            return;
          }

          page.scanned += probe.scanned;
          page.next = probe.next;
          this.element('#progress').textContent =
            `Поиск… найдено ${page.rows.length}, просмотрено ${page.scanned}`;
          if (probe.matched) {
            break;
          }

          after = probe.next;
        }
      }
    }

    if (query !== this.query || this.destroyed) {
      return;
    }

    this.pageIndex = index;
    this.next = page.next;
    this.busy = false;
    for (const row of page.rows) {
      const tr = document.createElement('tr');

      for (const text of [
        new Date(row.at).toLocaleTimeString() + `.${String(row.at % 1000).padStart(3, '0')}`,
        String(row.fe),
        row.direction,
      ]) {
        const cell = document.createElement('td');

        cell.textContent = text;
        tr.append(cell);
      }
      const cell = document.createElement('td');

      cell.textContent = row.entity;
      tr.tabIndex = 0;
      tr.title = 'Показать JSON этого сообщения';
      tr.setAttribute('aria-selected', 'false');
      const select = () =>
        this.run(async () => {
          for (const other of tbody.children) {
            other.setAttribute('aria-selected', String(other === tr));
          }
          await this.messageView.show(row, this.filter);
        });

      tr.addEventListener('click', select);
      tr.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select();
        }
      });
      tr.append(cell);
      tbody.append(tr);
    }
    this.element('#prev').disabled = index === 0 || this.busy;
    this.element('#next').disabled = !this.next || this.busy;
    this.element('#progress').textContent =
      ` Страница ${index + 1}: ${page.rows.length} совпадений / ${page.scanned} просмотрено`;
    this.update();
  }
  async export() {
    const session = this.session;

    if (!session || this.exporting) {
      return;
    }

    const exportMaxSeq = session.count;

    this.exporting = true;
    this.update();
    try {
      let after = 0;
      let offset = 0;
      let part = 0;
      let chunks = [];
      let bytes = 0;
      const download = () => {
        const url = URL.createObjectURL(new Blob(chunks, { type: 'application/x-ndjson' }));
        const link = document.createElement('a');

        link.href = url;
        link.download = `fe-history-${++part}.jsonl`;
        link.click();
        URL.revokeObjectURL(url);
        chunks = [];
        bytes = 0;
      };

      if (session.count) {
        while (true) {
          const chunk = await this.recorder.rpc({
            method: 'export',
            sessionId: session.id,
            after,
            offset,
            maxSeq: exportMaxSeq,
          });
          const size = new TextEncoder().encode(chunk.text).byteLength;

          if (bytes + size > 16 * 1048576 && chunks.length) {
            download();
          }

          chunks.push(chunk.text);
          bytes += size;
          if (chunk.next === undefined) {
            break;
          }

          after = chunk.next;
          offset = chunk.offset;
        }
      }

      if (chunks.length) {
        download();
      }

      this.status('Экспорт завершён');
    } finally {
      this.exporting = false;
      this.update();
    }
  }
  reveal() {
    this.root.focus();
  }
  setTheme(theme) {
    this.host.dataset.theme = theme;
  }
  destroy() {
    return this.dispose();
  }
  hide() {
    if (this.exporting || this.starting || this.clearing || this.reloading) {
      this.status('Дождитесь завершения текущей операции');

      return;
    }

    this.run(() => this.dispose());
  }
  async dispose() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.query++;
    this.messageView.destroy();
    this.host.remove();
    try {
      await this.recorder.close();
    } finally {
      this.onDispose();
    }
  }
}
