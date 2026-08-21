import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const packageJson = readJson('package.json');
const tauriConfig = readJson('src-tauri/tauri.conf.json');
const cargoVersion = readCargoVersion('src-tauri/Cargo.toml');
const version = packageJson.version;
const npmCliPath = process.env.npm_execpath || resolve(
  dirname(process.execPath),
  'node_modules',
  'npm',
  'bin',
  'npm-cli.js',
);

if (!version || version !== tauriConfig.version || version !== cargoVersion) {
  throw new Error(
    `Release versions must match: package=${version}, tauri=${tauriConfig.version}, cargo=${cargoVersion}`,
  );
}
if (!process.env.CLX_MODULE_SIGNING_KEY) {
  throw new Error('CLX_MODULE_SIGNING_KEY is required for a production build');
}

if (!existsSync(npmCliPath)) {
  throw new Error(`Unable to locate npm CLI: ${npmCliPath}`);
}
run(process.execPath, [npmCliPath, 'run', 'build:modules']);
run('cargo', ['build', '-p', 'clx-quickapps-sidecar', '--release']);
run('cargo', ['build', '-p', 'clx-api-client-sidecar', '--release']);
const stagedOutput = run(process.execPath, ['scripts/stage-modules.mjs'], { capture: true });
const staged = JSON.parse(stagedOutput.trim().split(/\r?\n/).at(-1));
run(process.execPath, ['scripts/stage-api-client.mjs']);
run(process.execPath, ['scripts/generate-modules-nsh.mjs']);
run(process.execPath, [npmCliPath, 'run', 'verify:core-boundaries']);

const tauriCliPath = resolve(
  repositoryRoot,
  'node_modules',
  '@tauri-apps',
  'cli',
  'tauri.js',
);
run(process.execPath, [tauriCliPath, 'build', ...process.argv.slice(2)], {
  env: {
    ...process.env,
    CLX_MODULE_PUBLISHER_PUBLIC_KEY: staged.publicKey,
  },
});

const nsisDirectory = resolve(repositoryRoot, 'target', 'release', 'bundle', 'nsis');
const expectedName = `CLX_${version}_x64-setup.exe`;
const expectedPath = resolve(nsisDirectory, expectedName);
if (!existsSync(expectedPath)) {
  const installers = existsSync(nsisDirectory)
    ? readdirSync(nsisDirectory).filter((name) => name.toLowerCase().endsWith('-setup.exe'))
    : [];
  if (installers.length !== 1) {
    throw new Error(`Expected one NSIS artifact in ${nsisDirectory}; found ${installers.length}`);
  }
  renameSync(resolve(nsisDirectory, installers[0]), expectedPath);
}
process.stdout.write(`Production installer: ${expectedPath}\n`);

function readJson(path) {
  return JSON.parse(readFileSync(resolve(repositoryRoot, path), 'utf8'));
}

function readCargoVersion(path) {
  const source = readFileSync(resolve(repositoryRoot, path), 'utf8');
  const match = source.match(/^version\s*=\s*"([^"]+)"/m);
  if (!match) throw new Error(`No package version found in ${path}`);
  return match[1];
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repositoryRoot,
    encoding: options.capture ? 'utf8' : undefined,
    stdio: options.capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
    env: options.env || process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} failed with exit code ${result.status}`);
  }
  if (options.capture) {
    process.stdout.write(result.stdout);
    return result.stdout;
  }
  return '';
}
