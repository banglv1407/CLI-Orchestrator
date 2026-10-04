import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const tauriConfigPath = resolve(repositoryRoot, 'src-tauri', 'tauri.conf.json');
const tauriCliPath = resolve(
  repositoryRoot,
  'node_modules',
  '@tauri-apps',
  'cli',
  'tauri.js',
);

const now = new Date();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const productionName = process.env.CLX_BUILD_NAME || `CLX (${month}${day})`;

const baseConfig = JSON.parse(readFileSync(tauriConfigPath, 'utf8'));
const windows = baseConfig.app?.windows;

if (!Array.isArray(windows) || windows.length === 0) {
  throw new Error('src-tauri/tauri.conf.json must define at least one app window.');
}

const productionConfig = {
  productName: productionName,
  mainBinaryName: productionName,
  app: {
    windows: windows.map((window) => ({
      ...window,
      title: productionName,
    })),
  },
};

console.log(`Building production release: ${productionName}`);

const result = spawnSync(
  process.execPath,
  [
    tauriCliPath,
    'build',
    '--config',
    JSON.stringify(productionConfig),
    ...process.argv.slice(2),
  ],
  {
    cwd: repositoryRoot,
    stdio: 'inherit',
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
