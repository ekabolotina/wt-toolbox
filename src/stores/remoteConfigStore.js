import { Storage } from '../utils/Storage.js';

export const remoteConfigStore = new Storage('remoteConfig', {
  decode: (flags) => {
    return Array.isArray(flags) ? flags : [];
  },
});
