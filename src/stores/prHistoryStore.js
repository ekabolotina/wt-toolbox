import { Storage } from '../utils/Storage.js';

const HISTORY_LIMIT = 3;

export const prHistoryStore = new Storage('prHistory', {
  encode: (prNumber, history) => {
    return [prNumber, ...history.filter((item) => item !== prNumber)].slice(0, HISTORY_LIMIT);
  },
  decode: (history) => {
    return Array.isArray(history) ? history : [];
  },
});
