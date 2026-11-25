import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { spawn } from 'node:child_process';

// Real React/xterm and trusted mouse/keyboard input; Tauri IPC is simulated.
const directory = path.resolve('.temp/terminal-broadcast');
await fs.mkdir(directory, { recursive: true });
const profile = await fs.mkdtemp(path.join(directory, 'profile-'));
const configPath = path.join(directory, 'vite.config.mjs');
await fs.writeFile(configPath, `import base from '../../vite.config.mjs';
export default {
  ...base,
  plugins: [{name:'terminal-broadcast-observer',enforce:'pre',transform(code,id){
    if(id.split('?')[0].replaceAll('\\\\','/').endsWith('/src/components/TerminalPanel.tsx'))
      return code.replace('handle = terminalRefs.current[session.id];','handle = terminalRefs.current[session.id]; window.__broadcastHandles = terminalRefs.current;')
        .replace('const multiSelectActive = selectedMiniIds.length > 1;', 'const multiSelectActive = selectedMiniIds.length > 1; (window.__broadcastTransitions ??= []).push({active:visibleSessionId,selected:selectedMiniSessionIds,live:[...runningSessionIds]});');
  }},...base.plugins],
  optimizeDeps: {noDiscovery:false,include:['react','react-dom/client','react/jsx-runtime','react/jsx-dev-runtime','@xterm/xterm','@xterm/addon-fit','@xterm/addon-search']},
  server: {...base.server,host:'127.0.0.1',port:5193,strictPort:true},
};`);

const processes = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(read, description, timeout = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await read()) return;
    await pause(100);
  }
  throw new Error('Timed out: ' + description);
}
const report = { scope: 'Current React + installed xterm; simulated Tauri IPC; trusted selection/typing; clipboard-event fixture', cases: [], exceptions: [], console: [] };
let socket, evaluate;
try {
  const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--config', configPath, '--configLoader', 'native'], { windowsHide: true, stdio: 'pipe' });
  processes.push(vite);
  let viteLog = '';
  vite.stdout.on('data', data => { viteLog += data; });
  vite.stderr.on('data', data => { viteLog += data; });
  await until(async () => {
    if (vite.exitCode !== null) throw new Error(viteLog);
    try { return (await fetch('http://127.0.0.1:5193')).ok; } catch { return false; }
  }, 'Vite');
  const browserPath = process.env.CLX_BROADCAST_BROWSER ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserArgs = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, '--window-size=1440,1000', 'about:blank'];
  if (process.env.CLX_BROADCAST_BROWSER_NO_SANDBOX === '1') browserArgs.push('--no-sandbox');
  const browser = spawn(browserPath, browserArgs, { windowsHide: true, stdio: 'ignore' });
  processes.push(browser);
  let port;
  await until(async () => {
    if (browser.exitCode !== null) throw new Error('Browser exited: ' + browser.exitCode);
    try { port = (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; return !!port; } catch { return false; }
  }, 'browser DevTools');
  const target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(item => item.type === 'page');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const response = JSON.parse(event.data);
    if (response.id) {
      const request = pending.get(response.id);
      pending.delete(response.id);
      if (!request) return;
      clearTimeout(request.timeout);
      if (response.error) request.reject(new Error(JSON.stringify(response.error))); else request.resolve(response.result);
    } else if (response.method === 'Runtime.exceptionThrown') report.exceptions.push(response.params.exceptionDetails.exception?.description ?? response.params.exceptionDetails.text);
    else if (response.method === 'Runtime.consoleAPICalled' && response.params.type === 'error') report.console.push(response.params.args.map(arg=>arg.value??arg.description));
  });
  function call(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timeout = setTimeout(() => { pending.delete(id); reject(new Error('DevTools timeout: ' + method)); }, 20000);
      pending.set(id, { resolve, reject, timeout });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  };
  const smokeSource = await fs.readFile('scripts/i18n-smoke.mjs', 'utf8');
  const shimMatch = smokeSource.match(/await call\('Page.addScriptToEvaluateOnNewDocument', \{ source: `([\s\S]*?)` \}\);/);
  assert.ok(shimMatch, 'existing Tauri browser fixture');
  const shim = vm.runInNewContext('`' + shimMatch[1] + '`');
  const sessions = ['multi-a', 'multi-b', 'multi-c', 'multi-bottom'].map(id => ({ id, cliName: id === 'multi-bottom' ? 'Quick - shell' : 'powershell', title: id, status: 'running', workingDir: 'D:\\CLI-Ochestor' }));
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setFocusEmulationEnabled', { enabled: true });
  await call('Page.addScriptToEvaluateOnNewDocument', { source: shim + `
    window.__smokeTerminalSessions = ${JSON.stringify(sessions)};
    localStorage.setItem('ai-cli-right-panel-visible','true');
    if (!localStorage.getItem('clx-mini-terminal-display-mode')) localStorage.setItem('clx-mini-terminal-display-mode','preview');
    localStorage.setItem('clx-ui-language','en');
    window.__broadcastState = () => ({
      selected:Array.from(document.querySelectorAll('[data-mini-terminal-selected=true]'),node=>node.dataset.miniTerminalSession).sort(),
      active:document.querySelector('[data-mini-terminal-session][aria-current=true]')?.dataset.miniTerminalSession,
      group:!!document.querySelector('[data-terminal-broadcast]'),
      input:__languageSmokeCalls.filter(c=>c.command==='send_cli_input').map(c=>c.args.request)
    });
  ` });
  await call('Page.navigate', { url: 'http://127.0.0.1:5193' });
  const terminalsReady = () => evaluate('Object.keys(window.__broadcastHandles??{}).length===4 && document.querySelectorAll("[data-mini-terminal-session] .xterm").length===4');
  try { await until(terminalsReady, 'four real main and mini terminals'); }
  catch (error) {
    // First-time Vite dependency discovery can invalidate the initial module
    // graph before React mounts. Retry only that empty, exception-free page.
    if (report.exceptions.length || await evaluate('!!document.querySelector("#root")?.textContent || __languageSmokeCalls.length>0')) throw error;
    await call('Page.reload');
    await until(terminalsReady, 'main and mini terminals after dependency discovery');
  }
  await pause(500);
  const selector = id => `[data-mini-terminal-session=${id}]`;
  const state = () => evaluate('__broadcastState()');
  const resetInput = () => evaluate('window.__languageSmokeCalls=window.__languageSmokeCalls.filter(c=>c.command!=="send_cli_input")');
  const focus = id => evaluate(`__broadcastHandles[${JSON.stringify(id)}].term.focus()`);
  async function click(targetSelector, modifiers = 0) {
    const point = await evaluate(`(() => {const node=document.querySelector(${JSON.stringify(targetSelector)});node.scrollIntoView({block:'nearest',inline:'nearest'});const r=node.getBoundingClientRect();return {x:r.x+Math.min(25,r.width/2),y:r.y+r.height/2};})()`);
    await call('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point, modifiers });
    await call('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, modifiers, button: 'left', buttons: 1, clickCount: 1 });
    await call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, modifiers, button: 'left', buttons: 0, clickCount: 1 });
    await pause(100);
  }
  async function key(name, modifiers = 0) {
    const codes = { Enter: ['Enter',13], ' ': ['Space',32], Backspace: ['Backspace',8], Escape: ['Escape',27], c: ['KeyC',67], C: ['KeyC',67], f: ['KeyF',70], v: ['KeyV',86] };
    const [code, virtualKey] = codes[name];
    const params = { key: name, code, modifiers, windowsVirtualKeyCode: virtualKey, nativeVirtualKeyCode: virtualKey };
    await call('Input.dispatchKeyEvent', { type: 'keyDown', ...params, ...(name === 'Enter' ? { text: '\r' } : {}) });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
    await pause(70);
  }
  async function expectInput(expected) {
    await until(async () => (await state()).input.length >= expected.length, 'input IPC delivery');
    await pause(60);
    const actual = (await state()).input.sort((a,b) => a.sessionId.localeCompare(b.sessionId));
    assert.deepEqual(actual, expected.map(([sessionId,input]) => ({sessionId,input})).sort((a,b) => a.sessionId.localeCompare(b.sessionId)));
  }
  async function output(id, chunk) {
    await evaluate(`__smokeEmit('cli-output',{sessionId:${JSON.stringify(id)},chunk:${JSON.stringify(chunk)},stream:'stdout'})`);
    await until(() => evaluate(`!__broadcastHandles[${JSON.stringify(id)}].isWriting && !__broadcastHandles[${JSON.stringify(id)}].writeQueue.length`), 'parsed terminal output');
    await pause(50);
  }
  async function paste(id, text) {
    await focus(id);
    await evaluate(`(() => {const data=new DataTransfer();data.setData('text/plain',${JSON.stringify(text)});__broadcastHandles[${JSON.stringify(id)}].term.textarea.dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:data}));})()`);
    await pause(70);
  }
  const order = await evaluate('Array.from(document.querySelectorAll("[data-mini-terminal-session]"),node=>[node.dataset.miniTerminalSession,node.closest("[data-mini-terminal-panel]").dataset.miniTerminalPanel])');
  await click(selector('multi-a'));
  await click(selector('multi-b'), 2);
  await click(selector('multi-bottom'), 2);
  assert.deepEqual((await state()).selected, ['multi-a','multi-b','multi-bottom']);
  assert.equal((await state()).group, true);
  assert.equal((await state()).active, 'multi-bottom');
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll("[data-mini-terminal-session]"),node=>[node.dataset.miniTerminalSession,node.closest("[data-mini-terminal-panel]").dataset.miniTerminalPanel])'), order);
  report.cases.push('trusted Ctrl-click across both panels selects three recipients without reordering/docking');

  await resetInput();
  await focus('multi-bottom');
  const unicode = 'Tiếng Việt 한국어 漢字';
  await call('Input.insertText', { text: unicode });
  await expectInput(['multi-a','multi-b','multi-bottom'].map(id => [id,unicode]));
  report.cases.push('trusted Unicode typing in main xterm reaches exactly the selected sessions once');

  await resetInput();
  await evaluate('__broadcastHandles["multi-bottom"].term.blur();__broadcastHandles["multi-bottom"].term.focus()');
  await call('Input.imeSetComposition',{text:'한글',selectionStart:2,selectionEnd:2});
  await call('Input.insertText',{text:'한글'});
  await expectInput(['multi-a','multi-b','multi-bottom'].map(id=>[id,'한글']));
  report.cases.push('IME composition commits once to every recipient through xterm deferred composition handling');

  for (const [name,modifiers,payload] of [['Enter',0,'\r'],['Enter',8,'\n'],['Backspace',0,'\x7f'],['c',2,'\x03']]) {
    await resetInput();
    await key(name,modifiers);
    await expectInput(['multi-a','multi-b','multi-bottom'].map(id => [id,payload]));
  }
  report.cases.push('Enter, Shift+Enter, Backspace and Ctrl+C broadcast once through the input queue');

  await output('multi-b','\x1b[?2004h');
  const multiline = '  first\r\nTiếng Việt\nlast  ';
  const normalized = '  first\rTiếng Việt\rlast  ';
  for (let repeat = 0; repeat < 2; repeat++) {
    await resetInput();
    await paste('multi-bottom',multiline);
    await expectInput([['multi-a',normalized],['multi-b','\x1b[200~'+normalized+'\x1b[201~'],['multi-bottom',normalized]]);
  }
  report.cases.push('repeated multiline clipboard events preserve Unicode/whitespace and each recipient paste mode without duplicates or automatic Enter');

  await resetInput();
  await focus('multi-bottom');
  // Suppress the actual clipboard event without reading the machine's clipboard.
  // This isolates the key handler from the paste path exercised above.
  await evaluate('window.__blockNativePaste=event=>{event.preventDefault();event.stopImmediatePropagation()};window.addEventListener("paste",__blockNativePaste,true)');
  await key('v',2);
  await evaluate('window.removeEventListener("paste",__blockNativePaste,true)');
  assert.equal((await state()).input.length,0, 'Ctrl+V key itself never sends a control byte or extra clipboard payload');
  await key('f',2);
  await until(() => evaluate('!!document.querySelector("[data-terminal-search]")'), 'terminal search');
  await call('Input.insertText',{text:'search only'});
  await key('Enter');
  await key('Escape');
  assert.equal((await state()).input.length,0);
  await output('multi-bottom','copy me\r\n');
  await evaluate('__broadcastHandles["multi-bottom"].term.select(0,0,4)');
  await key('C',10);
  assert.equal((await state()).input.length,0);
  report.cases.push('Ctrl+V key, search input/navigation and copy shortcut do not leak bytes into the group');

  for (const id of ['multi-a','multi-bottom']) {
    await resetInput();
    await output(id,'\x1b[6n');
    await until(async () => (await state()).input.length>0, 'DSR response');
    const received = (await state()).input;
    assert.equal(received.length,1);
    assert.equal(received[0].sessionId,id);
    assert.match(received[0].input,/^\x1b\[\d+;\d+R$/);
  }
  await output('multi-bottom','\x1b[?1004h');
  await resetInput();
  await evaluate('document.querySelector("[data-terminal-broadcast-clear]").focus()');
  await focus('multi-bottom');
  await pause(100);
  assert.ok((await state()).input.length>0);
  assert.ok((await state()).input.every(item=>item.sessionId==='multi-bottom' && /^(?:\x1b\[[IO])+$/.test(item.input)));
  await output('multi-bottom','\x1b[?1004l\x1b[?1000h\x1b[?1006h');
  await resetInput();
  const mousePoint = await evaluate('(() => {const r=__broadcastHandles["multi-bottom"].term.element.querySelector(".xterm-screen").getBoundingClientRect();return {x:r.x+30,y:r.y+20};})()');
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...mousePoint,button:'left',buttons:1,clickCount:1});
  await call('Input.dispatchMouseEvent',{type:'mouseReleased',...mousePoint,button:'left',buttons:0,clickCount:1});
  await pause(100);
  assert.ok((await state()).input.length>0);
  assert.ok((await state()).input.every(item=>item.sessionId==='multi-bottom' && /^(?:\x1b\[<\d+;\d+;\d+[Mm])+$/.test(item.input)));
  await output('multi-bottom','\x1b[?1000l\x1b[?1006l');
  report.cases.push('focused/background DSR, focus reports and actual SGR mouse reports stay local to their source PTY');

  await resetInput();
  await evaluate('__broadcastHandles["multi-bottom"].term.input("QUEUED",true);document.querySelector("[data-mini-terminal-session=multi-c]").click()');
  await expectInput(['multi-a','multi-b','multi-bottom'].map(id=>[id,'QUEUED']));
  assert.equal((await state()).group,false);
  await resetInput();
  await focus('multi-c');
  await call('Input.insertText',{text:'single'});
  await expectInput([['multi-c','single']]);
  report.cases.push('plain selection restores single input; queued input retains the original recipients when selection changes');

  await resetInput();
  await evaluate('document.querySelector("[data-mini-terminal-session=multi-b]").focus()');
  await key(' ',2);
  await evaluate('document.querySelector("[data-mini-terminal-session=multi-bottom]").focus()');
  await key('Enter',2);
  assert.deepEqual((await state()).selected,['multi-b','multi-bottom','multi-c']);
  assert.equal((await state()).input.length,0);
  await evaluate('localStorage.setItem("clx-mini-terminal-display-mode","title-only");window.dispatchEvent(new CustomEvent("clx-mini-terminal-config-changed",{detail:{displayMode:"title-only"}}));');
  await until(()=>evaluate('document.querySelectorAll("[data-mini-terminal-session] .xterm").length===0'), 'title-only mode');
  assert.deepEqual((await state()).selected,['multi-b','multi-bottom','multi-c']);
  await click(selector('multi-c'),2);
  assert.deepEqual((await state()).selected,['multi-b','multi-bottom']);
  await click(selector('multi-c'),2);
  await click(selector('multi-bottom'));
  await click(selector('multi-b'),2);
  await click(selector('multi-c'),2);
  report.cases.push('Ctrl+Space/Enter and title-only Ctrl-click add/remove without PTY input; display mode preserves the group');

  await click(selector('multi-c')+' button');
  await until(()=>evaluate('!document.querySelector("[data-mini-terminal-session=multi-c]")'), 'close exact selected session');
  assert.deepEqual((await state()).selected,['multi-b','multi-bottom']);
  const stopped = await evaluate('__languageSmokeCalls.filter(c=>c.command==="stop_cli").map(c=>c.args.request.sessionId)');
  assert.deepEqual(stopped,['multi-c']);
  await evaluate('__smokeTerminalSessions.find(s=>s.id==="multi-b").status="completed";__smokeEmit("cli-status",{sessionId:"multi-b",status:"completed",cliName:"powershell"})');
  await until(()=>evaluate('!__broadcastState().group'), 'exited recipient pruned');
  await resetInput();
  await focus('multi-bottom');
  await call('Input.insertText',{text:'after exit'});
  await expectInput([['multi-bottom','after exit']]);
  report.cases.push('close targets exactly one session; completed sessions leave the group and receive no subsequent input');

  await click(selector('multi-bottom'));
  await click(selector('multi-a'),2);
  const catalog = JSON.parse(await fs.readFile('src/i18n/messages.json','utf8'));
  for (const [index,language] of ['en','vi','ko'].entries()) {
    await evaluate(`(async()=>{const {setLanguage}=await import('/src/i18n/index.ts');setLanguage(${JSON.stringify(language)});})()`);
    await until(()=>evaluate(`document.documentElement.lang===${JSON.stringify(language)}`),'locale '+language);
    assert.equal(await evaluate('document.querySelector("[data-terminal-broadcast-count]").textContent'),catalog['{count} terminals selected'][index].replace('{count}','2'));
    assert.ok((await evaluate('document.querySelector("[data-terminal-broadcast]").textContent')).includes(catalog['Typing and pasting are sent to all selected terminals'][index]));
  }
  await evaluate('(async()=>{const {setLanguage}=await import("/src/i18n/index.ts");setLanguage("vi")})()');
  await fs.writeFile(path.join(directory,'multi-terminal-vi.png'),Buffer.from((await call('Page.captureScreenshot')).data,'base64'));
  await click('[data-terminal-broadcast-clear]');
  assert.equal((await state()).group,false);
  await click(selector('multi-bottom'),2);
  assert.equal((await state()).group,true);
  await call('Page.reload');
  await until(()=>evaluate('document.querySelectorAll("[data-mini-terminal-mode=title-only]").length===4'),'reload');
  assert.equal((await state()).group,false);
  report.cases.push('en/vi/ko group controls, clear selection, and reload without persisted broadcast recipients');
  assert.equal(report.exceptions.length,0,JSON.stringify(report.exceptions));
  await fs.writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
} catch (error) {
  if (evaluate) {
    try { report.page=await evaluate('(() => {const state=window.__broadcastState?.();if(state)state.input=state.input.map(({sessionId,input})=>({sessionId,length:input.length}));return {state,transitions:window.__broadcastTransitions?.slice(-20),url:location.href,html:document.documentElement.outerHTML.slice(0,2500),body:document.body.innerText.slice(0,2200),calls:window.__languageSmokeCalls?.slice(-15).map(c=>c.command)};})()'); } catch {}
  }
  await fs.writeFile(path.join(directory,'failure.json'),JSON.stringify({error:error.stack,report},null,2));
  throw error;
} finally {
  socket?.close();
  for (const child of processes.reverse()) child.kill();
}
