import { checkVpnAction } from './actions/checkVpnAction.js';
import { overridePRAction } from './actions/overridePRAction.js';
import { getStandAction } from './actions/getStandAction.js';
import { reloadTabAction } from './actions/reloadTabAction.js';
import { getPullRequestAction } from './actions/getPullRequestAction.js';
import { runUITestsAction } from './actions/runUITestsAction.js';
import { overrideRemoteConfigAction } from './actions/overrideRemoteConfigAction.js';
import { checkOverridableTabAction } from './actions/checkOverridableTabAction.js';
import { checkVpn } from './handlers/checkVpn.js';
import { overridePR } from './handlers/overridePR.js';
import { getStand } from './handlers/getStand.js';
import { reloadTab } from './handlers/reloadTab.js';
import { getPullRequest } from './handlers/getPullRequest.js';
import { runUITests } from './handlers/runUITests.js';
import { overrideRemoteConfig } from './handlers/overrideRemoteConfig.js';
import { checkOverridableTab } from './handlers/checkOverridableTab.js';
import { trackAppliedPR } from './handlers/trackAppliedPR.js';

checkVpnAction.register(checkVpn);
overridePRAction.register(overridePR);
getStandAction.register(getStand);
reloadTabAction.register(reloadTab);
getPullRequestAction.register(getPullRequest);
runUITestsAction.register(runUITests);
overrideRemoteConfigAction.register(overrideRemoteConfig);
checkOverridableTabAction.register(checkOverridableTab);

trackAppliedPR();

chrome.runtime.onInstalled.addListener(() => {});
