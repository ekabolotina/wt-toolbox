import { checkVpnAction } from './actions/checkVpnAction.js';
import { overridePRAction } from './actions/overridePRAction.js';
import { getStandAction } from './actions/getStandAction.js';
import { reloadTabAction } from './actions/reloadTabAction.js';
import { checkVpn } from './handlers/checkVpn.js';
import { overridePR } from './handlers/overridePR.js';
import { getStand } from './handlers/getStand.js';
import { reloadTab } from './handlers/reloadTab.js';
import { trackAppliedPR } from './handlers/trackAppliedPR.js';

checkVpnAction.register(checkVpn);
overridePRAction.register(overridePR);
getStandAction.register(getStand);
reloadTabAction.register(reloadTab);

trackAppliedPR();

chrome.runtime.onInstalled.addListener(() => {});
