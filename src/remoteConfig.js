import { initAvailabilityBlock } from './ui/initAvailabilityBlock.js';
import { initRemoteConfigBlock } from './ui/initRemoteConfigBlock.js';

document.documentElement.dataset.theme = chrome.devtools.panels.themeName;

await initAvailabilityBlock();
await initRemoteConfigBlock();
