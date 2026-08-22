import { Storage } from '../utils/Storage.js';
import { resolveApp } from '../utils/resolveApp.js';

export const appIdStore = new Storage('appId', {
  encode: (appId) => {
    return resolveApp(appId).id;
  },
  decode: (appId) => {
    return resolveApp(appId).id;
  },
});
