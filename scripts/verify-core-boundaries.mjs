import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

if (existsSync(resolve(repositoryRoot, 'src', 'components', 'QuickAppsPanel.tsx'))) {
  failures.push('QuickAppsPanel.tsx is still inside the Core frontend source tree');
}
for (const path of [
  ['src', 'components', 'ApiClientPanel.tsx'],
  ['src', 'components', 'ProxyPanel.tsx'],
  ['src', 'components', 'AIChatPanel.tsx'],
  ['src', 'lib', 'api-client-store.ts'],
  ['src', 'lib', 'api-history.ts'],
]) {
  if (existsSync(resolve(repositoryRoot, ...path))) {
    failures.push(`${path.join('/')} is still inside the Core frontend source tree`);
  }
}

const forbiddenRust = [
  'quickapps_commands',
  'quickapp_registry',
  'list_quickapps',
  'upsert_quickapp',
  'delete_quickapp',
  'launch_quickapp',
  'reextract_icons',
  'api_proxy_request',
  'api_proxy_stream',
  'api_proxy_abort',
  'ApiProxyState',
  'proxy_commands',
  'companion_get_catalog',
  'companion_help_search',
  'companion_get_help',
  'companion_send',
  'companion_cancel',
  'send_companion_chat',
  'builtin_llm_commands',
  'builtin_llm_status',
  'builtin_llm_load',
  'builtin_llm_unload',
  'builtin_llm_generate',
  'builtin_llm_get_config',
  'builtin_llm_save_config',
  'start_ssh_server',
  'stop_ssh_server',
  'get_ssh_server_status',
  'get_ssh_server_config',
  'save_ssh_server_config',
  'buzz_get_config',
  'buzz_set_config',
  'buzz_list_channels',
  'buzz_send_message',
  'buzz_has_identity',
  'buzz_subscribe_live',
  'nes_get_config',
  'nes_save_config',
  'nes_open_rom',
  'nes_create_room_and_invite',
  'nes_list_rooms',
];
for (const file of walk(resolve(repositoryRoot, 'src-tauri', 'src'), new Set(['.rs']))) {
  const text = readFileSync(file, 'utf8');
  for (const token of forbiddenRust) {
    if (text.includes(token)) failures.push(`${relative(repositoryRoot, file)} still contains ${token}`);
  }
}

const coreCargo = readFileSync(resolve(repositoryRoot, 'src-tauri', 'Cargo.toml'), 'utf8');
if (/^ico\s*=/m.test(coreCargo)) failures.push('Core still owns the Quick Apps ico dependency');
if (/^candle-core\s*=/m.test(coreCargo)) failures.push('Core still owns candle-core dependency');
if (/^tokenizers\s*=/m.test(coreCargo)) failures.push('Core still owns tokenizers dependency');
if (/^russh\s*=/m.test(coreCargo)) failures.push('Core still owns russh dependency');
if (/^russh-keys\s*=/m.test(coreCargo)) failures.push('Core still owns russh-keys dependency');
if (/^tokio-tungstenite\s*=/m.test(coreCargo)) failures.push('Core still owns tokio-tungstenite dependency');
if (/^nes-protocol\s*=/m.test(coreCargo)) failures.push('Core still owns nes-protocol dependency');
if (/^k256\s*=/m.test(coreCargo)) failures.push('Core still owns k256 dependency');

const coreBundles = walk(resolve(repositoryRoot, 'dist'), new Set(['.js']));
if (!coreBundles.length) failures.push('Core dist has not been built');
for (const file of coreBundles) {
  const source = readFileSync(file, 'utf8');
  if (source.includes('quickapp-form')) {
    failures.push(`${relative(repositoryRoot, file)} still embeds the Quick Apps panel`);
  }
  if (source.includes('Paste curl command here') || source.includes('clx-apiclient-history')) {
    failures.push(`${relative(repositoryRoot, file)} still embeds the API Client UI`);
  }
  if (source.includes('proxyStatus') || source.includes('proxyStart') || source.includes('proxyStop') || source.includes('proxyGetConfig')) {
    failures.push(`${relative(repositoryRoot, file)} still embeds the CliProxyAI direct invoke wrappers`);
  }
}
const moduleBundle = resolve(repositoryRoot, 'dist-modules', 'clx.quickapps', 'index.js');
if (!existsSync(moduleBundle) || !readFileSync(moduleBundle, 'utf8').includes('quickapp-form')) {
  failures.push('Quick Apps module bundle is missing its panel marker');
}
const apiClientBundle = resolve(repositoryRoot, 'dist-modules', 'clx.api-client', 'index.js');
if (!existsSync(apiClientBundle) || !readFileSync(apiClientBundle, 'utf8').includes('Paste curl command here')) {
  failures.push('API Client module bundle is missing its panel marker');
}

const cliProxyBundle = resolve(repositoryRoot, 'dist-modules', 'clx.cli-proxy', 'index.js');
if (!existsSync(cliProxyBundle)) {
  failures.push('CliProxy module bundle is missing');
}

const companionBundle = resolve(repositoryRoot, 'dist-modules', 'clx.ai-companion', 'index.js');
if (!existsSync(companionBundle)) {
  failures.push('AI Companion module bundle is missing');
}

const localLlmBundle = resolve(repositoryRoot, 'dist-modules', 'clx.local-llm', 'index.js');
if (!existsSync(localLlmBundle)) {
  failures.push('Local LLM module bundle is missing');
}

const buzzBundle = resolve(repositoryRoot, 'dist-modules', 'clx.buzz', 'index.js');
if (!existsSync(buzzBundle)) { failures.push('Buzz module bundle is missing'); }

const nesBundle = resolve(repositoryRoot, 'dist-modules', 'clx.nes', 'index.js');
if (!existsSync(nesBundle)) { failures.push('NES module bundle is missing'); }

const sshBundle = resolve(repositoryRoot, 'dist-modules', 'clx.ssh', 'index.js');
if (!existsSync(sshBundle)) {
  failures.push('SSH module bundle is missing');
}

if (failures.length) {
  process.stderr.write(`${failures.map((failure) => `- ${failure}`).join('\n')}\n`);
  process.exit(1);
}
process.stdout.write('Core/module Quick Apps, API Client, CliProxy, AI Companion, Local LLM, SSH, Buzz, and NES boundaries verified.\n');

function walk(root, extensions) {
  if (!existsSync(root)) return [];
  const result = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...walk(path, extensions));
    else if (entry.isFile() && extensions.has(extname(entry.name))) result.push(path);
  }
  return result;
}
