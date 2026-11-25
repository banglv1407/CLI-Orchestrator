import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { spawn } from 'node:child_process';
import { connectBrowser, pause, until } from './browser-session.mjs';

const directory = path.resolve('.temp/terminal-links');
await fs.mkdir(directory, { recursive: true });
const profile = await fs.mkdtemp(path.join(directory, 'profile-'));
const processes = [];
const report = { scope: 'Production React/xterm, trusted shortcut; simulated Tauri IPC', cases: [] };
let browser;
try {
  const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5196', '--strictPort'], { windowsHide: true, stdio: 'pipe' });
  processes.push(vite);
  let log = '';
  vite.stdout.on('data', data => { log += data; });
  vite.stderr.on('data', data => { log += data; });
  await until(async () => { if (vite.exitCode !== null) throw new Error(log); try { return (await fetch('http://127.0.0.1:5196')).ok; } catch { return false; } }, 'preview');
  const executable = process.env.CLX_SHORTCUT_BROWSER ?? 'C:\\Users\\july1\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';
  const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--remote-allow-origins=http://localhost', '--user-data-dir=' + profile, '--window-size=1440,1000', 'about:blank'];
  if (process.env.CLX_SHORTCUT_BROWSER_NO_SANDBOX === '1') args.push('--no-sandbox');
  const processBrowser = spawn(executable, args, { windowsHide: true, stdio: 'ignore' });
  processes.push(processBrowser);
  let port;
  await until(async () => { if (processBrowser.exitCode !== null) throw new Error('Browser exited'); try { port = (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; return port && (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).some(t => t.type === 'page'); } catch { return false; } }, 'browser');
  browser = await connectBrowser(port);
  const { call, evaluate, key } = browser;
  const source = await fs.readFile('scripts/i18n-smoke.mjs', 'utf8');
  const match = source.match(/await call\('Page.addScriptToEvaluateOnNewDocument', \{ source: `([\s\S]*?)` \}\);/);
  assert.ok(match);
  const shim = vm.runInNewContext('`' + match[1] + '`');
  await call('Page.addScriptToEvaluateOnNewDocument', { source: shim + `
    localStorage.setItem('clx-ui-language', sessionStorage.getItem('links-locale') ?? 'en');
    localStorage.setItem('clx-mini-terminal-display-mode', 'title-only');
    localStorage.setItem('ai-cli-right-panel-visible', 'true');
    if (!sessionStorage.getItem('links-seeded')) {
      __smokeTerminalSessions = [
        {id:'root-a',cliName:'Agent Alpha',status:'running',workingDir:'D:/Dự án & tools',title:'Alpha'},
        {id:'root-b',cliName:'Agent Beta',status:'running',workingDir:'D:/other',title:'Beta'},
        {id:'root-ssh',cliName:'SSH: Fixture',status:'running',workingDir:'/srv/remote'}
      ];
      sessionStorage.setItem('clx-smoke-terminal-sessions', JSON.stringify(__smokeTerminalSessions));
      sessionStorage.setItem('links-seeded','true');
    }
    const originalInvoke = __TAURI_INTERNALS__.invoke;
    window.__linkCreates = [];
    window.__editorOpens = [];
    window.__linkDialogs = [];
    __TAURI_INTERNALS__.invoke = async (command,args) => {
      if (command === 'create_terminal_session') {
        __linkCreates.push(structuredClone(args.request));
        if (window.__failNextCreate) { window.__failNextCreate = false; throw new Error('fixture launch failed'); }
        const count = Number(sessionStorage.getItem('links-created') ?? 0) + 1;
        sessionStorage.setItem('links-created', String(count));
        const session = {id:'child-'+count,cliName:'Quick - shell',status:'running',workingDir:args.request.workingDir ?? 'D:/home',title:'Shell '+count};
        __smokeTerminalSessions.push(session);
        sessionStorage.setItem('clx-smoke-terminal-sessions',JSON.stringify(__smokeTerminalSessions));
        return structuredClone(session);
      }
      if (command === 'open_in_vscode') {
        __editorOpens.push(args.path);
        if (window.__failEditor) throw new Error('fixture VS Code missing');
        return null;
      }
      if (command === 'plugin:dialog|message') { __linkDialogs.push(args); return null; }
      if (command === 'list_directory_files') return [{name:'draft.txt',path:'D:/Dự án & tools/draft.txt',isDir:false}];
      return originalInvoke(command,args);
    };
  ` });
  const navigate = async () => {
    await call('Page.navigate', { url: 'http://127.0.0.1:5196' });
    await until(() => evaluate('document.querySelectorAll("[data-mini-terminal-session]").length >= 3'), 'terminal cards');
    await pause(250);
  };
  await navigate();
  const mini = id => `[data-mini-terminal-session="${id}"]`;
  const graphNode = id => `[data-terminal-graph-node="${id}"]`;
  const context = async selector => {
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:700,clientY:400}))`);
    await until(() => evaluate('!!document.querySelector("[data-context-menu-source]")'), 'context menu');
  };
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const select = async (selector, value) => {
    await evaluate(`(() => {const n=document.querySelector(${JSON.stringify(selector)});n.value=${JSON.stringify(value)};n.dispatchEvent(new Event('change',{bubbles:true}));})()`);
    await pause(100);
  };
  const edge = (child, parent) => evaluate(`!!document.querySelector('[data-terminal-link-child="${child}"][data-terminal-link-parent="${parent}"]')`);

  await click(mini('root-b'));
  await context(mini('root-a'));
  await click('[data-terminal-context-action="linked-bottom"]');
  await until(() => edge('child-1', 'root-a'), 'inactive context parent link');
  await until(() => evaluate('document.activeElement?.classList.contains("xterm-helper-textarea")'), 'context child focused');
  assert.equal(await evaluate('__linkCreates[0].workingDir'), 'D:/Dự án & tools');
  assert.ok(await evaluate('!!document.querySelector("[data-mini-terminal-panel=bottom] [data-mini-terminal-session=child-1]")'));
  report.cases.push('inactive mini context creates bottom child with the clicked parent directory');

  const inputs = await evaluate('__languageSmokeCalls.filter(c=>c.command==="send_cli_input").length');
  await key('`', 'Backquote', 192, 2, true);
  await until(() => edge('child-2', 'child-1'), 'shortcut child');
  assert.equal(await evaluate('__linkCreates.length'), 2);
  assert.equal(await evaluate('__languageSmokeCalls.filter(c=>c.command==="send_cli_input").length'), inputs);
  assert.ok(await evaluate('!!document.querySelector("[data-mini-terminal-panel=right] [data-mini-terminal-session=child-2]")'));
  report.cases.push('held Ctrl+Backquote creates exactly one linked right child without PTY bytes');

  for (const direction of ['vertical', 'horizontal']) {
    await select('[data-terminal-graph-direction]', direction);
    assert.equal(await evaluate('document.querySelector("[data-terminal-graph]").dataset.terminalGraph'), direction);
    assert.ok(await edge('child-2', 'child-1'));
    await browser.screenshot(path.join(directory, `graph-${direction}.png`));
  }
  await click(graphNode('root-a'));
  await until(() => evaluate('document.activeElement?.classList.contains("xterm-helper-textarea")'), 'graph selection focuses terminal');
  await evaluate(`__smokeEmit('cli-output',{sessionId:'root-a',cliName:'Agent Alpha',chunk:'retained-root-a\\r\\n',stream:'stdout'});window.__graphTerminalElement=document.querySelector('[data-terminal-main-session="root-a"] .xterm')`);
  await until(() => evaluate('document.querySelector("[data-terminal-main-session=root-a]").textContent.includes("retained-root-a")'), 'fixture output rendered');
  await click('[data-terminal-graph-toggle]');
  assert.equal(await evaluate('!!document.querySelector("[data-terminal-graph-canvas]")'), false);
  await click('[data-terminal-graph-toggle]');
  await context(mini('root-a'));
  await click('[data-mini-context-action=toggle-display]');
  await until(() => evaluate('document.querySelector("[data-mini-terminal-session=root-a]").dataset.miniTerminalMode==="preview"'), 'preview enabled');
  assert.ok(await evaluate('document.querySelector("[data-terminal-main-session=root-a] .xterm")===__graphTerminalElement && document.querySelector("[data-terminal-main-session=root-a]").textContent.includes("retained-root-a")'));
  await context(mini('root-a'));
  await click('[data-mini-context-action=toggle-display]');
  await until(() => evaluate('document.querySelector("[data-mini-terminal-session=root-a]").dataset.miniTerminalMode==="title-only"'), 'title-only restored');
  report.cases.push('graph collapse and preview/title-only changes preserve the mounted terminal and its output');
  assert.equal(await evaluate('document.querySelector("[data-terminal-graph-parent] option[value=child-2]")'), null, 'cycle target unavailable');
  await click(graphNode('child-2'));
  await select('[data-terminal-graph-parent]', 'root-b');
  assert.ok(await edge('child-2', 'root-b'));
  await select('[data-terminal-graph-parent]', '');
  assert.equal(await edge('child-2', 'root-b'), false);
  await select('[data-terminal-graph-parent]', 'child-1');
  assert.ok(await edge('child-2', 'child-1'));
  report.cases.push('graph selects sessions, switches direction, prevents cycles, reconnects and unlinks');

  await click(mini('root-a'));
  await evaluate(`document.querySelector('[data-mini-terminal-session="child-1"]').dispatchEvent(new MouseEvent('click',{bubbles:true,ctrlKey:true}));window.dispatchEvent(new CustomEvent('focus-active-terminal',{detail:{sessionId:'child-1'}}))`);
  await until(() => evaluate('!!document.querySelector("[data-terminal-broadcast]") && document.activeElement?.classList.contains("xterm-helper-textarea")'), 'group input focused');
  await call('Input.insertText', { text: 'linked-group-test' });
  await until(() => evaluate('__languageSmokeCalls.filter(c=>c.command==="send_cli_input" && c.args.request.input==="linked-group-test").length===2'), 'group receives input');
  assert.deepEqual(await evaluate('__languageSmokeCalls.filter(c=>c.command==="send_cli_input" && c.args.request.input==="linked-group-test").map(c=>c.args.request.sessionId).sort()'), ['child-1', 'root-a']);
  await click(mini('root-a'));
  report.cases.push('trusted typing still broadcasts exactly once to selected terminals across both trays; graph links alone do not broadcast');

  await context(mini('root-a'));
  await click('[data-terminal-context-action="vscode"]');
  assert.deepEqual(await evaluate('__editorOpens'), ['D:/Dự án & tools']);
  await click(mini('root-a'));
  await context('[data-terminal-main-session="root-a"]');
  await click('[data-terminal-context-action="vscode"]');
  assert.equal(await evaluate('__editorOpens.length'), 2);
  await evaluate(`Array.from(document.querySelectorAll('button')).find(n => n.textContent.trim() === 'draft.txt').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:150,clientY:240}))`);
  await until(() => evaluate('!!document.querySelector("[data-file-context-action=vscode]")'), 'Explorer VS Code action');
  await click('[data-file-context-action=vscode]');
  assert.equal(await evaluate('__editorOpens[2]'), 'D:/Dự án & tools/draft.txt');
  await context(mini('root-ssh'));
  assert.equal(await evaluate('!!document.querySelector("[data-terminal-context-action=vscode]")'), false);
  await click('[data-terminal-context-action="linked-right"]');
  await until(() => edge('child-3', 'root-ssh'), 'SSH navigation link');
  assert.equal(await evaluate('__linkCreates[2].workingDir'), undefined);
  await click(mini('root-ssh'));
  await until(() => evaluate('Array.from(document.querySelectorAll("button")).some(n=>n.textContent.trim()==="draft.txt")'), 'SSH Explorer tree');
  await evaluate(`Array.from(document.querySelectorAll('button')).find(n => n.textContent.trim() === 'draft.txt').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:150,clientY:240}))`);
  assert.equal(await evaluate('!!document.querySelector("[data-file-context-action=vscode]")'), false, 'unresolved SSH connection never exposes a local editor action');
  await evaluate('document.body.click()');
  report.cases.push('main and mini VS Code actions target local path; SSH paths excluded and local child uses default directory');

  await context(mini('root-a'));
  await evaluate('window.__failEditor=true');
  await click('[data-terminal-context-action="vscode"]');
  await until(() => evaluate('__linkDialogs.length===1'), 'editor error surfaced');
  report.cases.push('VS Code launch errors surface in a dialog');

  await click(mini('root-a'));
  await evaluate('window.__failNextCreate=true');
  await key('`', 'Backquote', 192, 2);
  await until(() => evaluate('document.querySelector("[data-mini-terminal-session=root-a]")?.getAttribute("aria-current")==="true"'), 'failed child returns parent');
  assert.equal(await evaluate('document.querySelectorAll("[data-mini-terminal-session]").length'), 6);
  assert.equal(await evaluate('document.querySelectorAll("[data-terminal-link-child]").length'), 3);
  report.cases.push('failed shell creation removes pending node and keeps the source session');

  await select('[data-terminal-graph-direction]', 'vertical');
  await navigate();
  assert.ok(await edge('child-2', 'child-1'));
  assert.equal(await evaluate('document.querySelector("[data-terminal-graph]").dataset.terminalGraph'), 'vertical');
  await context(mini('root-a'));
  await click('[data-mini-context-action=reload]');
  assert.ok(await edge('child-1', 'root-a'));
  await context(mini('root-a'));
  await click('[data-mini-context-action=close]');
  await until(() => evaluate('!document.querySelector("[data-mini-terminal-session=root-a]")'), 'parent closes');
  assert.ok(await evaluate('!!document.querySelector("[data-mini-terminal-session=child-1]")'));
  assert.ok(await edge('child-2', 'child-1'));
  assert.equal(await edge('child-1', 'root-a'), false);
  report.cases.push('reload retains links and direction; closing a parent preserves descendant sessions');

  const catalog = JSON.parse(await fs.readFile('src/i18n/messages.json', 'utf8'));
  for (const [index, language] of ['en', 'vi', 'ko'].entries()) {
    await evaluate(`sessionStorage.setItem('links-locale',${JSON.stringify(language)})`);
    await navigate();
    assert.equal(await evaluate('document.documentElement.lang'), language);
    assert.ok((await evaluate('document.querySelector("[data-terminal-graph]").textContent')).includes(catalog['Terminal links'][index]));
    await context(mini('child-1'));
    assert.equal(await evaluate('document.querySelector("[data-terminal-context-action=vscode]").textContent.trim()'), catalog['Open in VS Code'][index]);
    await browser.screenshot(path.join(directory, `menu-${language}.png`));
    await evaluate('document.body.click()');
  }
  report.cases.push('en/vi/ko graph and context actions rendered with localized copy');
  await call('Emulation.setDeviceMetricsOverride', { width: 1024, height: 768, deviceScaleFactor: 1, mobile: false });
  await context(mini('child-1'));
  assert.ok(await evaluate('(()=>{const r=document.querySelector("[data-context-menu-source]").getBoundingClientRect();return r.right<=innerWidth&&r.bottom<=innerHeight&&r.top>=0})()'));
  await browser.screenshot(path.join(directory, 'compact-ko.png'));
  report.cases.push('context menu stays inside the compact 1024x768 viewport');
  assert.deepEqual(browser.exceptions, []);
  report.exceptions = browser.exceptions;
  await fs.writeFile(path.join(directory, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} catch (error) {
  report.error = error.stack;
  if (browser) {
    try { report.page = await browser.evaluate('({body:document.body.innerText.slice(-6000),creates:window.__linkCreates,dialogs:window.__linkDialogs})'); await browser.screenshot(path.join(directory, 'failure.png')); } catch {}
  }
  await fs.writeFile(path.join(directory, 'failure.json'), JSON.stringify(report, null, 2));
  throw error;
} finally {
  browser?.close();
  for (const child of processes.reverse()) child.kill();
}
