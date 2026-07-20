import { checkVpnAction } from './actions/checkVpnAction.js';
import { overridePRAction } from './actions/overridePRAction.js';
import { getStandAction } from './actions/getStandAction.js';
import { checkVpn } from './handlers/checkVpn.js';
import { overridePR } from './handlers/overridePR.js';
import { getStand } from './handlers/getStand.js';

checkVpnAction.register(checkVpn);
overridePRAction.register(overridePR);
getStandAction.register(getStand);

chrome.runtime.onInstalled.addListener(() => {});
