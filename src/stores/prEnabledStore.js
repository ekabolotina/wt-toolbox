import { Storage } from '../utils/Storage.js';

export const prEnabledStore = new Storage('enabled', {
  decode: (enabled) => {
    return Boolean(enabled);
  },
});
