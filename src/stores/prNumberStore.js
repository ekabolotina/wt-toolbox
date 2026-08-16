import { Storage } from '../utils/Storage.js';

export const prNumberStore = new Storage('prNumber', {
  decode: (prNumber) => {
    return prNumber ?? '';
  },
});
