import { getStandAction } from '../actions/getStandAction.js';

const standBadge = document.getElementById('standBadge');

const LABEL_BY_STAND = {
  int: 'Int',
  prelive: 'Prelive',
  prod: 'Prod',
};

export async function initStandBlock() {
  getStandAction.execute().then((stand) => {
    const label = LABEL_BY_STAND[stand];

    if (label) {
      standBadge.textContent = label;
      standBadge.className = `stand-badge ${stand}`;
    } else {
      standBadge.textContent = '\u2014';
      standBadge.className = 'stand-badge';
    }
  });
}
