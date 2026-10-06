import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const directory = path.resolve('.temp/i18n-browser');
await fs.mkdir(directory, { recursive: true });
const profile = await fs.mkdtemp(path.join(directory, 'profile-'));
const processes = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(read, description, timeout = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try { const result = await read(); if (result) return result; } catch {}
    await pause(120);
  }
  throw new Error('Timed out: ' + description);
}
let socket;
try {
  const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5187', '--strictPort'], { windowsHide: true, stdio: 'pipe' });
  processes.push(vite);
  let viteLog = '';
  vite.stdout.on('data', data => { viteLog += data; });
  vite.stderr.on('data', data => { viteLog += data; });
  await until(async () => { if (vite.exitCode !== null) throw new Error(viteLog); return (await fetch('http://127.0.0.1:5187')).ok; }, 'Vite');
  const browser = process.env.CLX_I18N_BROWSER ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(browser, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, '--window-size=1440,1000', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  processes.push(edge);
  const port = await until(async () => (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0], 'Edge DevTools');
  const target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(item => item.type === 'page');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let id = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener('message', event => {
    const result = JSON.parse(event.data);
    if (result.id) {
      const task = pending.get(result.id); pending.delete(result.id);
      if (!task) return;
      if (result.error) task.reject(new Error(JSON.stringify(result.error))); else task.resolve(result.result);
    } else if (result.method === 'Runtime.exceptionThrown') exceptions.push(result.params.exceptionDetails.exception?.description ?? result.params.exceptionDetails.text);
  });
  function call(method, params = {}) {
    return new Promise((resolve, reject) => {
      const requestId = ++id;
      const timeout=setTimeout(()=>{pending.delete(requestId);reject(new Error('DevTools timeout: '+method));},15000);
      pending.set(requestId, { resolve(value){clearTimeout(timeout);resolve(value);}, reject(error){clearTimeout(timeout);reject(error);} });
      socket.send(JSON.stringify({ id: requestId, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  }
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__languageSmokeCalls = [];
    window.isTauri = true;
    let callbackId = 0;
    window.__TAURI_EVENT_PLUGIN_INTERNALS__ = { unregisterListener() {} };
    window.__TAURI_INTERNALS__ = {
      metadata: { currentWindow: { label: 'main' }, currentWebview: { label: 'main' } },
      transformCallback() { return ++callbackId; }, unregisterCallback() {},
      async invoke(command, args) {
        window.__languageSmokeCalls.push({ command, args });
        const values = {
          list_clis: [{ name: 'CLI User 42', command: 'example-cli', mode: 'interactive', args: [], env: {}, savedDirectories: [] }],
          list_sessions: [], list_project_tags: [], load_ssh_connections: [], list_quickapps: [{ id: 'user-app', name: 'User App 42', command: 'example-app', args: [], workingDir: '', order: 0, iconMissing: true }],
          get_git_status: [], list_files: [], get_system_logs: [], proxy_get_logs: [], proxy_get_backend_usage: [],
          agent_list_sessions: [], companion_get_history: [], dashboard_list_monitors: [], dashboard_probe_monitors: [],
          dashboard_get_all_connections: [], dashboard_get_target_connections: [],
          get_notepad: { schemaVersion: 2, activeTabId: 'fixture-note', tabs: [{ id: 'fixture-note', title: 'My user note', text: '', language: 'text' }] },
          companion_get_config: { baseUrl: 'https://example.invalid/v1', model: 'user-model', apiKeyPresent: false, streamEnabled: true, customPrompt: '', customHeaders: [], actionsEnabled: false },
          proxy_get_config: { port: 4000, backends: [], enabled: false }, proxy_status: { running: false, port: 4000, totalRequests: 0, activeRequests: 0 },
          builtin_llm_get_config: { enabled: false, modelPath: null, tokenizerPath: null, maxTokens: 1024, temperature: 0.7, repeatPenalty: 1.1, seed: 42, runtime: 'llama.cpp', serverPath: null, serverPort: 8081 },
          builtin_llm_status: { loaded: false, modelPath: null, enabled: false },
          buzz_get_config: { relayUrl: 'wss://example.invalid', allowInsecure: false, proxy: null },
          buzz_get_pubkey: 'user-key', buzz_live_status: ['ready', ''], buzz_list_channels: [], buzz_list_dms: [], buzz_list_agents: [], buzz_list_members: [], buzz_get_messages: [], buzz_get_my_profile: null,
          nes_get_config: { schema_version: 1, service_base_url: 'http://example.invalid', proxy: null }, nes_get_pubkey: 'user-key',
          pet_list_packs: { packs: [], errors: [] }, get_ssh_server_status: { running: false, port: 2222, localIp: '127.0.0.1', logs: [] },
          get_ssh_server_config: { username: 'user-fixture', password: '', publicKeys: [] },
          get_local_ip: '127.0.0.1', get_public_ip: '127.0.0.1', plugin_event_listen: 1,
        };
        if (command.startsWith('plugin:event|')) return 1;
        if (command === 'plugin:window|is_visible') return true;
        if (command === 'get_sysinfo') return { cpuUsage: 0, totalMemory: 1024, usedMemory: 0, disks: [] };
        if (Object.hasOwn(values, command)) return structuredClone(values[command]);
        if (/(?:^|_)list_/.test(command) || command.endsWith('_list') || command.endsWith('_logs')) return [];
        return null;
      }
    };
  ` });
  await call('Page.navigate', { url: 'http://127.0.0.1:5187' });
  try { await until(() => evaluate('document.querySelector("#root")?.innerText.length > 100'), 'React render', 30000); }
  catch(error){console.error(exceptions);console.log(await evaluate('({url:location.href,html:document.body.innerText,calls:window.__languageSmokeCalls})'));throw error;}
  await pause(500);
  const section = async value => {
    await evaluate(`window.dispatchEvent(new CustomEvent('open-settings',{detail:${JSON.stringify(value)}}))`);
    await pause(200);
    if(!(await evaluate('document.querySelector("#root")?.textContent.length>100'))){
      console.error('Section failed: '+value,exceptions);
      console.log(await evaluate('window.__languageSmokeCalls.slice(-15).map(call=>call.command)'));
      throw new Error('Section did not render: '+value);
    }
  };
  await section('appearance');
  try { await until(() => evaluate('Boolean(document.querySelector("#interface-language"))'), 'language selector'); }
  catch(error){console.error(exceptions);console.log(await evaluate('({html:document.body.innerText,calls:window.__languageSmokeCalls})'));throw error;}
  const options = await evaluate('Array.from(document.querySelector("#interface-language").options, option => [option.value, option.text])');
  assert.deepEqual(options, [['en', 'English'], ['vi', 'Tiếng Việt'], ['ko', '한국어']]);
  assert.ok(await evaluate('Boolean(document.querySelector("label[for=interface-language]"))'));
  async function selectLanguage(language) {
    await section('appearance');
    await evaluate(`(() => {const select=document.querySelector('#interface-language'); select.value=${JSON.stringify(language)};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
    await until(() => evaluate(`document.documentElement.lang===${JSON.stringify(language)}`), 'language ' + language);
    assert.equal(await evaluate("localStorage.getItem('clx-ui-language')"), language);
  }
  const catalog = JSON.parse(await fs.readFile('src/i18n/messages.json', 'utf8'));
  const invariants = JSON.parse(await fs.readFile('src/i18n/invariants.json', 'utf8'));
  const report = { selector: options, locales: {}, exceptions };
  for (const [index, language] of ['en', 'vi', 'ko'].entries()) {
    await selectLanguage(language);
    assert.ok((await evaluate('document.body.textContent')).includes(catalog['Interface language'][index]));
    await fs.writeFile(path.join(directory, `settings-${language}.png`), Buffer.from((await call('Page.captureScreenshot')).data, 'base64'));
    const sections = {};
    for (const name of ['appearance', 'mythical-pet', 'ai-companion', 'local-llm', 'buzz-nes', 'proxy', 'remote', 'logs', 'navigation']) {
      await section(name);
      sections[name] = await evaluate(`(() => {
        const catalog=${JSON.stringify(catalog)}, invariants=new Set(${JSON.stringify(invariants)}), index=${index};
        const untranslated=[];
        const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
        while(walker.nextNode()){
          const node=walker.currentNode, parent=node.parentElement, text=node.textContent.trim();
          if(!parent || !parent.getClientRects().length || parent.closest('pre,code,option'))continue;
          const entry=catalog[text] ?? Object.values(catalog).find(value=>value[0]===text);
          if(index && entry && entry[index]!==text && !invariants.has(text))untranslated.push(text);
        }
        return { headings:Array.from(document.querySelectorAll('h1,h2,h3'),el=>el.innerText), untranslated:[...new Set(untranslated)] };
      })()`);
    }
    report.locales[language] = { sections };
    console.log(language + ': all 9 Settings sections rendered');
  }
  await section('ai-companion');
  const draft = 'My unsaved prompt $1 {v0} Tiếng Việt 한국어';
  await evaluate(`(() => {const input=document.querySelector('form textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(input,${JSON.stringify(draft)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  const configLoads = await evaluate("window.__languageSmokeCalls.filter(call=>call.command==='companion_get_config').length");
  for (const language of ['en', 'vi', 'ko']) {
    await selectLanguage(language);
    await section('ai-companion');
    assert.equal(await evaluate("document.querySelector('form textarea').value"), draft);
    assert.equal(await evaluate("window.__languageSmokeCalls.filter(call=>call.command==='companion_get_config').length"), configLoads);
  }
  report.unsavedPromptPreserved = true;
  await fs.writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2));
  for (const language of ['vi', 'ko']) {
    await selectLanguage(language);
    const views = {};
    for (const name of ['terminal', 'quickapps', 'apiclient', 'dashboard', 'agent-sessions', 'buzz', 'game']) {
      await evaluate(`window.dispatchEvent(new CustomEvent('switch-main-view',{detail:${JSON.stringify(name)}}))`);
      await pause(250);
      views[name] = await evaluate('Array.from(document.querySelectorAll("h1,h2,h3"),element=>element.innerText)');
      if (!(await evaluate('document.querySelector("#root").innerText.length>100'))) {
        console.error('View failed: '+name,exceptions);
        console.log(await evaluate('window.__languageSmokeCalls.slice(-20).map(call=>call.command)'));
        throw new Error('View did not render: '+name);
      }
    }
    report.locales[language].views = views;
  }
  await section('appearance');
  await call('Page.reload');
  await until(() => evaluate("document.documentElement.lang==='ko' && document.querySelector('#root')?.innerText.length>100"), 'restored language');
  await section('appearance');
  assert.equal(await evaluate('document.querySelector("#interface-language").value'), 'ko');
  report.restartPersistence = true;
  await fs.writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2));
  console.log('Unsaved prompt and reload persistence passed; runtime exceptions: ' + exceptions.length);
  for (const [language, data] of Object.entries(report.locales)) {
    const leftovers = Object.entries(data.sections).filter(([,data])=>data.untranslated.length);
    assert.deepEqual(leftovers, [], 'Untranslated interface copy: ' + language);
  }
  if (exceptions.length) throw new Error(exceptions.join('\n'));
} finally {
  if(socket?.readyState===WebSocket.OPEN)socket.close();
  for (const process of processes.reverse()) process.kill();
}
