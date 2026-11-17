import { ENTITY_NAMES } from './entityNames.js';
export function setupEntityPicker(input, list, toggle) {
  const entities = ENTITY_NAMES;
  let matches = [];
  let active = -1;
  const close = () => {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const select = (entity) => {
    input.value = entity;
    close();
  };
  const highlight = () => {
    for (const [index, option] of [...list.children].entries()) {
      option.setAttribute('aria-selected', String(index === active));
    }
    if (active >= 0) {
      input.setAttribute('aria-activedescendant', `fe-entity-${active}`);
      list.children[active]?.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  };
  const show = () => {
    const term = input.value.trim().toLocaleLowerCase();

    matches = entities.filter((entity) => entity.toLocaleLowerCase().includes(term)).slice(0, 50);
    active = -1;
    list.replaceChildren();
    for (const [index, entity] of matches.entries()) {
      const option = input.ownerDocument.createElement('div');

      option.id = `fe-entity-${index}`;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.textContent = entity;
      option.title = entity;
      option.addEventListener('click', () => select(entity));
      list.append(option);
    }
    if (!matches.length) {
      const empty = input.ownerDocument.createElement('div');

      empty.className = 'empty';
      empty.textContent = 'Совпадений нет — можно ввести своё имя';
      list.append(empty);
    }

    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    input.removeAttribute('aria-activedescendant');
  };

  input.addEventListener('input', show);
  input.addEventListener('focus', show);
  input.addEventListener('blur', close);
  list.addEventListener('pointerdown', (event) => event.preventDefault());
  toggle.addEventListener('pointerdown', (event) => event.preventDefault());
  toggle.addEventListener('click', () => {
    const opened = !list.hidden;

    input.focus();
    if (opened) {
      close();
    } else {
      show();
    }
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (list.hidden) {
        show();
      }

      if (matches.length) {
        if (active < 0) {
          active = event.key === 'ArrowDown' ? 0 : matches.length - 1;
        } else {
          active = (active + (event.key === 'ArrowDown' ? 1 : matches.length - 1)) % matches.length;
        }

        highlight();
      }
    } else if (event.key === 'Enter' && !list.hidden && active >= 0) {
      event.preventDefault();
      select(matches[active]);
    } else if (event.key === 'Escape' && !list.hidden) {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === 'Tab') {
      close();
    }
  });
}
