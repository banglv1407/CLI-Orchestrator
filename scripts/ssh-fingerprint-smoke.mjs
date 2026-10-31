import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { spawn } from 'node:child_process';
import { connectBrowser, pause, until } from './browser-session.mjs';

const directory = path.resolve('.temp/ssh-fingerprint');
await fs.mkdir(directory, { recursive: true });
const profile = await fs.mkdtemp(path.join(directory, 'profile-'));
const processes = [];
const report = { scope: 'Production React with simulated Tauri IPC/clipboard. Rust fixtures cover real SSH.', cases: [] };
const fingerprint = byte => 'SHA256:' + Buffer.alloc(32, byte).toString('base64').replace(/=+$/, '');
const remote = fingerprint(0), other = fingerprint(2), local = fingerprint(1);
const networkError = 'Cannot read the SSH fingerprint. Check the host, port and SSH service.';
const catalog = JSON.parse(await fs.readFile('src/i18n/messages.json', 'utf8'));
assert.equal(catalog['Get fingerprint'][1], 'Lấy fingerprint');
assert.equal(catalog['Get fingerprint'][2], '지문 가져오기');
let browser;
try {
  const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5197', '--strictPort'], { windowsHide: true, stdio: 'pipe' });
  processes.push(vite);
  let viteLog = '';
  vite.stdout.on('data', data => { viteLog += data; });
  vite.stderr.on('data', data => { viteLog += data; });
  await until(async () => {
    if (vite.exitCode !== null) throw new Error(viteLog);
    try { return (await fetch('http://127.0.0.1:5197')).ok; } catch { return false; }
  }, 'preview');
  const executable = process.env.CLX_SSH_BROWSER ?? 'C:/Users/july1/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe';
  const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, '--window-size=1600,1150', 'about:blank'];
  if (process.env.CLX_SSH_BROWSER_NO_SANDBOX === '1') args.push('--no-sandbox');
  const chromium = spawn(executable, args, { windowsHide: true, stdio: 'ignore' });
  processes.push(chromium);
  let port;
  await until(async () => {
    if (chromium.exitCode !== null) throw new Error('Browser exited');
    try { port = (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; return !!port; } catch { return false; }
  }, 'browser');
  report.devtoolsTargets = await (await fetch("http://127.0.0.1:"+port+"/json/list")).json();
  browser = await connectBrowser(port);
  const { call, evaluate } = browser;
  const original = await fs.readFile('scripts/i18n-smoke.mjs', 'utf8');
  const match = original.match(/await call\('Page.addScriptToEvaluateOnNewDocument', \{ source: \x60([\s\S]*?)\x60 \}\);/);
  assert.ok(match, 'shared IPC fixture');
  const shim = vm.runInNewContext(String.fromCharCode(96) + match[1] + String.fromCharCode(96));
  const setup = function(localFingerprint) {
    if (!localStorage.getItem('clx-ui-language')) localStorage.setItem('clx-ui-language', 'en');
    window.__fpCalls = []; window.__fpPending = []; window.__fpSaves = []; window.__localError = '';
    window.__copyFails = false; window.__copied = '';
    window.__fpConfig = JSON.parse(sessionStorage.getItem('ssh-fixture-config') ?? 'null') ?? { port:4000, enabled:false, backends:[] };
    const originalInvoke = __TAURI_INTERNALS__.invoke;
    __TAURI_INTERNALS__.invoke = async (command, args) => {
      if (command === 'probe_ssh_fingerprint') {
        __fpCalls.push(structuredClone(args));
        return new Promise((resolve, reject) => __fpPending.push({ resolve, reject }));
      }
      if (command === 'get_ssh_server_fingerprint') {
        if (__localError) throw __localError;
        return localFingerprint;
      }
      if (command === 'proxy_get_config') return structuredClone(__fpConfig);
      if (command === 'proxy_save_config' || command === 'proxy_add_backend') {
        __fpSaves.push({ command, args:structuredClone(args) });
        if (command === 'proxy_save_config') __fpConfig = structuredClone(args.config);
        else __fpConfig.backends.push({ ...structuredClone(args.backend), id:'saved-' + __fpConfig.backends.length });
        sessionStorage.setItem('ssh-fixture-config', JSON.stringify(__fpConfig));
        return structuredClone(__fpConfig);
      }
      return originalInvoke(command, args);
    };
    Object.defineProperty(navigator, 'clipboard', { configurable:true, value:{ writeText:async value => {
      if (__copyFails) throw new Error('fixture clipboard denied'); window.__copied = value;
    } } });
    window.__visible = node => node.getClientRects().length > 0;
    window.__button = (text, root = document) => Array.from(root.querySelectorAll('button')).find(node => __visible(node) && node.textContent.trim() === text);
    window.__field = (kind = 'remote') => Array.from(document.querySelectorAll('[data-ssh-fingerprint=' + kind + ']')).find(__visible);
    window.__hop = () => Array.from(document.querySelectorAll('fieldset')).find(node => __visible(node) && node.querySelector('option[value=ssh]'));
    window.__set = (node, value) => {
      if (!node) throw new Error('Missing input');
      Object.getOwnPropertyDescriptor(node.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype, 'value').set.call(node, value);
      node.dispatchEvent(new Event(node.tagName === 'SELECT' ? 'change' : 'input', { bubbles:true }));
    };
    window.__resolve = value => __fpPending.shift().resolve(value);
    window.__reject = value => __fpPending.shift().reject(value);
  };
  await call('Page.addScriptToEvaluateOnNewDocument', { source:shim + '(' + setup.toString() + ')(' + JSON.stringify(local) + ')' });
  await call('Page.navigate', { url:'http://127.0.0.1:5197' });
  const render = () => until(() => evaluate('document.querySelector("#root")?.textContent.length>100'), 'React');
  await render();
  const view = async name => {
    await evaluate('window.dispatchEvent(new CustomEvent("switch-main-view",{detail:' + JSON.stringify(name) + '}))');
    await pause(150);
  };
  const click = text => evaluate('__button(' + JSON.stringify(text) + ').click()');
  const resolve = value => evaluate('__resolve(' + JSON.stringify(value) + ')');
  const fetchRemote = () => evaluate('__field().querySelector("button").click()');
  const value = () => evaluate('__field()?.querySelector("input").value');
  const setHost = host => evaluate('__set(__hop().querySelector("input[placeholder=\\"proxy.example.com\\"]"),' + JSON.stringify(host) + ')');
  const setPort = port => evaluate('__set(__hop().querySelector("input[type=number]"),' + JSON.stringify(port) + ')');
  const setKind = kind => evaluate('__set(__hop().querySelector("select"),' + JSON.stringify(kind) + ')');
  const add = async index => {
    await click(catalog['Add Backend'][index]);
    await setKind('ssh');
    await until(() => evaluate('!!__field()'), 'SSH controls');
  };

  for (const [index, language] of ['en', 'vi', 'ko'].entries()) {
    if (index) {
      await evaluate('localStorage.setItem("clx-ui-language",' + JSON.stringify(language) + ');sessionStorage.removeItem("ssh-fixture-config")');
      await call('Page.reload');
      await render();
    }
    await view('proxy');
    await add(index);
    assert.equal(await evaluate('__field().querySelector("button").disabled'), true);
    await setHost('fixture.test');
    await setPort(2222);
    await evaluate('__field().querySelector("button").click();__field().querySelector("button").click()');
    assert.equal(await evaluate('__fpCalls.length'), 1);
    assert.deepEqual(await evaluate('__fpCalls[0]'), { host:'fixture.test', port:2222 });
    assert.equal(await evaluate('__field().querySelector("button").textContent'), catalog['Fetching fingerprint...'][index]);
    assert.equal(await evaluate('__field().querySelector("input").readOnly'), true);
    await evaluate('__set(__hop().querySelector("input[autocomplete=off]"),"draft-user");__set(__hop().querySelector("input[type=password]"),"draft-secret")');
    await resolve(remote);
    await until(async () => (await value()) === remote, 'fetched value');
    assert.equal(await evaluate('__hop().querySelector("input[autocomplete=off]").value'), 'draft-user');
    assert.equal(await evaluate('__hop().querySelector("input[type=password]").value'), 'draft-secret');
    assert.equal(await evaluate('__fpSaves.length'), 0);
    await evaluate('__field().querySelectorAll("button")[1].click()');
    await until(() => evaluate('window.__copied===' + JSON.stringify(remote)), 'copy fingerprint');
    assert.equal(await evaluate('__field().querySelectorAll("button")[1].textContent'), catalog['Copied'][index]);
    report.cases.push(language + ': credential-free IPC, duplicate prevention, loading, correct fill, latest auth draft and copy without saving');

    await fetchRemote();
    await evaluate('__reject(' + JSON.stringify(networkError) + ')');
    await until(() => evaluate('!!__field().querySelector("[role=alert]")'), 'network error');
    assert.equal(await evaluate('__field().querySelector("[role=alert]").textContent'), catalog[networkError][index]);
    assert.equal(await value(), remote);
    await fetchRemote();
    await resolve(remote);
    await until(() => evaluate('!__field().querySelector("[role=alert]")'), 'retry');
    report.cases.push(language + ': localized network error, retained value and successful retry');

    if (!index) {
      await fetchRemote();
      await setHost('second.test');
      assert.equal(await value(), '');
      await resolve(other);
      await pause(80);
      assert.equal(await value(), '', 'stale host result ignored');
      await fetchRemote();
      await resolve(remote);
      await until(async () => (await value()) === remote, 'new host fingerprint');
      await fetchRemote();
      await setPort(2200);
      assert.equal(await value(), '');
      await resolve(other);
      await pause(80);
      assert.equal(await value(), '', 'stale port result ignored');
      report.cases.push('host/port edits clear pin and ignore obsolete results');

      await fetchRemote();
      await evaluate('__set(__hop().querySelectorAll("select")[1],"key")');
      await evaluate('__set(Array.from(__hop().querySelectorAll("label")).find(n=>n.textContent.startsWith("Private key path")).querySelector("input"),"C:/fixture/id_ed25519")');
      await resolve(remote);
      await until(async () => (await value()) === remote, 'key authentication');
      assert.equal(await evaluate('__hop().querySelectorAll("select")[1].value'), 'key');
      assert.equal(await evaluate('Array.from(__hop().querySelectorAll("label")).find(n=>n.textContent.startsWith("Private key path")).querySelector("input").value'), 'C:/fixture/id_ed25519');
      report.cases.push('switching to private-key authentication during lookup preserves current key draft');

      await fetchRemote();
      await setKind('http');
      await resolve(other);
      await pause(80);
      assert.equal(await evaluate('!!__field()'), false);
      await setKind('ssh');
      assert.equal(await value(), '');
      await setHost('fixture.test');
      await fetchRemote();
      await click('Cancel');
      await resolve(other);
      await add(index);
      assert.equal(await value(), '');
      report.cases.push('hop change and editor cancellation discard in-flight results');

      await setHost('saved.test');
      await evaluate('__set(__hop().querySelector("input[autocomplete=off]"),"saved-user");__set(__hop().querySelector("input[type=password]"),"saved-secret")');
      for (const [placeholder, text] of [
        ['Name (e.g. OpenAI)', 'Saved Fingerprint Backend'],
        ['Endpoint URL (e.g. https://api.openai.com/v1)', 'https://provider.invalid/v1'],
        ['API Key', 'fixture-api-key'],
        ['Model identifier (e.g. gpt-4o)', 'fixture-model'],
      ]) await evaluate('__set(document.querySelector(' + JSON.stringify('input[placeholder=' + JSON.stringify(placeholder) + ']') + '),' + JSON.stringify(text) + ')');
      await fetchRemote();
      await resolve(remote);
      await until(async () => (await value()) === remote, 'before save');
      await click('Save Backend');
      await until(() => evaluate('__fpConfig.backends.length===1&&!__field()'), 'save backend');
      assert.equal(await evaluate('__fpConfig.backends[0].hop.hostKey'), remote);
      await evaluate('document.querySelector("button[title=Edit]").click()');
      await until(() => evaluate('!!__field()'), 'edit backend');
      assert.equal(await value(), remote);
      await fetchRemote();
      await resolve(other);
      await until(async () => (await value()) === other, 'edit fetch');
      await click('Update');
      await until(() => evaluate('__fpConfig.backends[0].hop.hostKey===' + JSON.stringify(other)), 'update');
      await call('Page.reload');
      await render();
      await view('proxy');
      await evaluate('document.querySelector("button[title=Edit]").click()');
      await until(() => evaluate('!!__field()'), 'reloaded editor');
      assert.equal(await value(), other);
      report.cases.push('Add/Edit explicit save and reload persist discovered fingerprints');
    }

    await evaluate('__field()?.scrollIntoView({block:"center"})');
    await pause(120);
    await browser.screenshot(path.join(directory, language + '-backend.png'));
    await view('remote');
    await until(() => evaluate('!!__field("server")'), 'local SSH field');
    assert.equal(await evaluate('__field("server").querySelector("input").readOnly'), true);
    await evaluate('__field("server").querySelector("button").click()');
    await until(() => evaluate('__field("server").querySelector("input").value===' + JSON.stringify(local)), 'local fingerprint');
    await evaluate('__field("server").querySelectorAll("button")[1].click()');
    await until(() => evaluate('window.__copied===' + JSON.stringify(local)), 'local copy');
    await evaluate('__localError="Cannot decode the SSH server host key.";__field("server").querySelector("button").click()');
    await until(() => evaluate('!!__field("server").querySelector("[role=alert]")'), 'local key error');
    assert.equal(await evaluate('__field("server").querySelector("[role=alert]").textContent'), catalog['Cannot decode the SSH server host key.'][index]);
    await evaluate('__localError="";__field("server").querySelector("button").click()');
    await until(() => evaluate('!__field("server").querySelector("[role=alert]")'), 'local retry');
    await evaluate('__copyFails=true;__field("server").querySelectorAll("button")[1].click()');
    await until(() => evaluate('!!__field("server").querySelector("[role=alert]")'), 'clipboard error');
    assert.equal(await evaluate('__field("server").querySelector("[role=alert]").textContent'), catalog['Cannot copy the SSH fingerprint.'][index]);
    await evaluate('__copyFails=false;__field("server").querySelectorAll("button")[1].click()');
    await until(() => evaluate('!__field("server").querySelector("[role=alert]")'), 'clipboard retry');
    await browser.screenshot(path.join(directory, language + '-server.png'));
    report.cases.push(language + ': local server fingerprint/copy, localized host-key and clipboard errors, retry');
    console.log(language + ' SSH fingerprint controls passed');
  }
  assert.deepEqual(browser.exceptions, []);
  report.exceptions = browser.exceptions;
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.error = String(error.stack ?? error);
  if (browser) {
    report.exceptions = browser.exceptions;
    try { report.snapshot = await browser.evaluate('({text:document.body.innerText,calls:window.__fpCalls})'); await browser.screenshot(path.join(directory, 'failure.png')); } catch {}
  }
  throw error;
} finally {
  browser?.close();
  for (const process of processes.reverse()) if (process.exitCode === null) process.kill();
  await fs.writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2));
  console.log(report.cases.length + ' SSH fingerprint browser cases; ' + report.status);
}
