import { initPROverrideBlock } from './ui/initPROverrideBlock.js';
import { initReloadBlock } from './ui/initReloadBlock.js';
import { initVPNBlock } from './ui/initVPNBlock.js';
import { initStandBlock } from './ui/initStandBlock.js';
import { initRunUITestsBlock } from './ui/initRunUITestsBlock.js';

await initPROverrideBlock();
await initReloadBlock();
await initVPNBlock();
await initStandBlock();
await initRunUITestsBlock();
