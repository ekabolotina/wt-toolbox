import { checkVpnAction } from './actions/checkVpnAction.js';
import { overridePRAction } from './actions/overridePRAction.js';
import { getStandAction } from './actions/getStandAction.js';
import { reloadTabAction } from './actions/reloadTabAction.js';
import { getPullRequestAction } from './actions/getPullRequestAction.js';
import { runUITestsAction } from './actions/runUITestsAction.js';
import { checkVpn } from './handlers/checkVpn.js';
import { overridePR } from './handlers/overridePR.js';
import { getStand } from './handlers/getStand.js';
import { reloadTab } from './handlers/reloadTab.js';
import { getPullRequest } from './handlers/getPullRequest.js';
import { runUITests } from './handlers/runUITests.js';
import { trackAppliedPR } from './handlers/trackAppliedPR.js';

checkVpnAction.register(checkVpn);
overridePRAction.register(overridePR);
getStandAction.register(getStand);
reloadTabAction.register(reloadTab);
getPullRequestAction.register(getPullRequest);
runUITestsAction.register(runUITests);

trackAppliedPR();

chrome.runtime.onInstalled.addListener(() => {});
