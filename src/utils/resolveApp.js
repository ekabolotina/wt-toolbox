import { APPS } from '../consts/apps.js';

const DEFAULT_APP = APPS[0];

export function resolveApp(appId) {
  return APPS.find((app) => app.id === appId) ?? DEFAULT_APP;
}
