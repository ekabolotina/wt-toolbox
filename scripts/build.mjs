import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(root, 'dist');

if (path.dirname(target) !== root || path.basename(target) !== 'dist') {
  throw new Error('Unexpected build directory');
}

await rm(target, { recursive: true, force: true });
await mkdir(target);
await cp(path.join(root, 'manifest.json'), path.join(target, 'manifest.json'));
await cp(path.join(root, 'src'), path.join(target, 'src'), { recursive: true });
