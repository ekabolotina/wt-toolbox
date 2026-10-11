import { overrideRemoteConfigAction } from '../actions/overrideRemoteConfigAction.js';
import { remoteConfigStore } from '../stores/remoteConfigStore.js';
import { getAppliedOverrides } from '../utils/getAppliedOverrides.js';
import { readRemoteConfigEntries } from '../utils/readRemoteConfigEntries.js';

const searchInput = document.getElementById('flagSearch');
const addButton = document.getElementById('addFlag');
const reloadButton = document.getElementById('reloadPage');
const flagRows = document.getElementById('flagRows');
const flagRowTemplate = document.getElementById('flagRowTemplate');
const flagEmptyState = document.getElementById('flagEmptyState');
const flagCount = document.getElementById('flagCount');
const remoteRows = document.getElementById('remoteRows');
const remoteRowTemplate = document.getElementById('remoteRowTemplate');
const remoteEmptyState = document.getElementById('remoteEmptyState');
const remoteCount = document.getElementById('remoteCount');

const rowFlags = new WeakMap();

// Keys that stopped being overridden this session. The rule only adds enabled keys and strips
// disabled ones, so a deleted or renamed key would otherwise linger in the page URL.
const staleKeys = new Set();

let flags = [];

// Shown instead of the remote table while it has no entries to list; null once they are rendered.
let remoteNotice = 'Загрузка…';
let remoteRequest = 0;

// Strikes out the remote entries whose value the page no longer sees.
function markOverriddenRemoteRows() {
  const applied = getAppliedOverrides(flags);

  for (const row of remoteRows.children) {
    row.classList.toggle('overridden', applied.has(row.dataset.key));
  }
}

async function applyOverride() {
  markOverriddenRemoteRows();

  await remoteConfigStore.save(flags);
  await overrideRemoteConfigAction.execute(flags);
}

function filterRows(rows, getKey, query) {
  let visibleCount = 0;

  for (const row of rows.children) {
    row.hidden = !getKey(row).toLowerCase().includes(query);

    if (!row.hidden) {
      visibleCount += 1;
    }
  }

  return visibleCount;
}

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleFlags = filterRows(flagRows, (row) => rowFlags.get(row).key, query);
  const visibleRemote = filterRows(remoteRows, (row) => row.dataset.key, query);

  flagCount.textContent = visibleFlags;
  remoteCount.textContent = remoteNotice ? '' : visibleRemote;

  if (flags.length === 0) {
    flagEmptyState.textContent = 'Переопределений пока нет';
  } else {
    flagEmptyState.textContent = visibleFlags === 0 ? 'Ничего не найдено' : '';
  }

  if (remoteNotice) {
    remoteEmptyState.textContent = remoteNotice;
  } else {
    remoteEmptyState.textContent = visibleRemote === 0 ? 'Ничего не найдено' : '';
  }
}

function createFlagRow(flag) {
  const row = flagRowTemplate.content.firstElementChild.cloneNode(true);
  const enabledInput = row.querySelector('.flag-enabled');
  const keyInput = row.querySelector('.flag-key');
  const valueInput = row.querySelector('.flag-value');
  const deleteButton = row.querySelector('.flag-delete');
  let committedKey = flag.key;

  rowFlags.set(row, flag);
  enabledInput.checked = flag.enabled;
  keyInput.value = flag.key;
  valueInput.value = flag.value;

  enabledInput.addEventListener('change', async () => {
    flag.enabled = enabledInput.checked;

    await applyOverride();
  });

  keyInput.addEventListener('input', async () => {
    flag.key = keyInput.value;

    await applyOverride();
  });

  keyInput.addEventListener('change', () => {
    staleKeys.add(committedKey);
    committedKey = keyInput.value;
  });

  valueInput.addEventListener('input', async () => {
    flag.value = valueInput.value;

    await applyOverride();
  });

  deleteButton.addEventListener('click', async () => {
    flags = flags.filter((item) => item !== flag);
    staleKeys.add(flag.key);
    row.remove();
    applySearch();

    await applyOverride();
  });

  return row;
}

async function addFlag(flag, focusSelector) {
  const row = createFlagRow(flag);

  flags.push(flag);
  flagRows.append(row);
  applySearch();
  row.querySelector(focusSelector).focus();

  await applyOverride();
}

async function overrideRemoteFlag(key, value) {
  const existingRow = Array.from(flagRows.children).find(
    (row) => rowFlags.get(row).key.trim() === key,
  );

  if (existingRow) {
    existingRow.querySelector('.flag-value').focus();

    return;
  }

  await addFlag({ key, value, enabled: true }, '.flag-value');
}

function createRemoteRow([key, value]) {
  const row = remoteRowTemplate.content.firstElementChild.cloneNode(true);
  const keyCell = row.querySelector('.remote-key');
  const valueCell = row.querySelector('.remote-value');

  row.dataset.key = key;
  keyCell.textContent = key;
  keyCell.title = key;
  valueCell.textContent = value;
  valueCell.title = value;

  row.querySelector('.remote-edit').addEventListener('click', () => overrideRemoteFlag(key, value));

  return row;
}

async function loadRemoteConfig() {
  const request = ++remoteRequest;
  let result;

  remoteRows.replaceChildren();
  remoteNotice = 'Загрузка…';
  applySearch();

  try {
    result = await readRemoteConfigEntries();
  } catch {
    result = { error: true };
  }

  // A navigation started a newer read, which owns the table now.
  if (request !== remoteRequest) {
    return;
  }

  if (result.error) {
    remoteNotice = 'Не удалось разобрать __PRELOADED_DATA';
  } else if (!result.found) {
    remoteNotice = 'На странице нет __PRELOADED_DATA';
  } else if (!result.entries) {
    remoteNotice = 'В __PRELOADED_DATA нет remoteConfig';
  } else if (result.entries.length === 0) {
    remoteNotice = 'Remote config пуст';
  } else {
    remoteNotice = null;
    remoteRows.replaceChildren(...result.entries.map(createRemoteRow));
    markOverriddenRemoteRows();
  }

  applySearch();
}

// Runs in the inspected page.
function navigateWithout(keys) {
  const url = new URL(window.location.href);

  keys.forEach((key) => url.searchParams.delete(key));

  if (url.href === window.location.href) {
    window.location.reload();
  } else {
    window.location.replace(url.href);
  }
}

function reloadPage() {
  const keys = [...staleKeys].map((key) => key.trim()).filter(Boolean);

  staleKeys.clear();
  chrome.devtools.inspectedWindow.eval(`(${navigateWithout})(${JSON.stringify(keys)})`);
}

export async function initRemoteConfigBlock() {
  flags = await remoteConfigStore.get();
  flagRows.replaceChildren(...flags.map(createFlagRow));
  applySearch();

  await overrideRemoteConfigAction.execute(flags);

  searchInput.addEventListener('input', applySearch);
  reloadButton.addEventListener('click', reloadPage);

  addButton.addEventListener('click', () => {
    searchInput.value = '';

    return addFlag({ key: '', value: '', enabled: true }, '.flag-key');
  });

  chrome.devtools.network.onNavigated.addListener(loadRemoteConfig);
  loadRemoteConfig();
}
