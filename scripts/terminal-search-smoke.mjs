import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { spawn } from 'node:child_process';

// Actual React/xterm rendering and keyboard events; Tauri IPC is simulated.
const directory = path.resolve('.temp/terminal-search');
await fs.mkdir(directory, { recursive: true });
const profile = await fs.mkdtemp(path.join(directory, 'profile-'));
const configPath = path.join(directory, 'vite.config.mjs');
await fs.writeFile(configPath, `import base from '../../vite.config.mjs';
export default {
  ...base,
  plugins: [{name:'terminal-search-observer',enforce:'pre',transform(code,id){
    if(id.split('?')[0].replaceAll('\\\\','/').endsWith('/src/components/TerminalPanel.tsx'))
      return code.replace('handle = terminalRefs.current[session.id];','handle = terminalRefs.current[session.id]; window.__searchHandles = terminalRefs.current;');
  }},...base.plugins],
  optimizeDeps: {noDiscovery:false,include:['react','react-dom/client','react/jsx-runtime','react/jsx-dev-runtime','@xterm/xterm','@xterm/addon-fit','@xterm/addon-search']},
  server: {...base.server,host:'127.0.0.1',port:5192,strictPort:true},
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
const report = { scope: 'Current React + installed xterm/SearchAddon; simulated Tauri IPC', cases: [], exceptions: [] };
let socket, evaluate;
try {
  const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--config', configPath, '--configLoader', 'native'], { windowsHide: true, stdio: 'pipe' });
  processes.push(vite);
  let viteLog = '';
  vite.stdout.on('data', data => { viteLog += data; });
  vite.stderr.on('data', data => { viteLog += data; });
  await until(async () => {
    if (vite.exitCode !== null) throw new Error(viteLog);
    try { return (await fetch('http://127.0.0.1:5192')).ok; } catch { return false; }
  }, 'Vite');
  const browserPath = process.env.CLX_SEARCH_BROWSER ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserArgs = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, '--window-size=1440,1000', 'about:blank'];
  if (process.env.CLX_SEARCH_BROWSER_NO_SANDBOX === '1') browserArgs.push('--no-sandbox');
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
  const sessions = ['search-a', 'search-b'].map(id => ({ id, cliName: 'powershell', title: id, status: 'running', workingDir: 'D:\\CLI-Ochestor', panel: 'right' }));
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setFocusEmulationEnabled', { enabled: true });
  await call('Page.addScriptToEvaluateOnNewDocument', { source: shim + `
    window.__smokeTerminalSessions = ${JSON.stringify(sessions)};
    localStorage.setItem('ai-cli-right-panel-visible','true');
    localStorage.setItem('clx-mini-terminal-display-mode','title-only');
    localStorage.setItem('clx-ui-language','en');
    window.__searchKeyEvents = [];
    window.addEventListener('keydown',event=>{
      const target=document.activeElement;
      setTimeout(()=>__searchKeyEvents.push({key:event.key,prevented:event.defaultPrevented,trusted:event.isTrusted,target:target?.tagName}),0);
    },true);
    window.__searchState = (sid='search-a')=>{
      const handle=window.__searchHandles?.[sid];
      return {bar:!!document.querySelector('[data-terminal-search]'),result:document.querySelector('[data-terminal-search-results]')?.textContent??null,
        query:document.querySelector('[data-terminal-search] input')?.value??null,
        inputFocused:document.activeElement===document.querySelector('[data-terminal-search] input'),
        selection:handle?.term.getSelection(),position:handle?.term.getSelectionPosition(),viewport:handle?.term.buffer.active.viewportY,
        markers:handle?.term.markers.length,decorations:document.querySelectorAll('.xterm-decoration').length,
        inputCalls:__languageSmokeCalls.filter(c=>c.command==='send_cli_input').length};
    };
  ` });
  await call('Page.navigate', { url: 'http://127.0.0.1:5192' });
  await until(() => evaluate('Boolean(window.__searchHandles?.["search-a"]?.term.element && document.querySelector("[data-mini-terminal-session=search-b]"))'), 'actual main terminals');
  await pause(600);
  const key = async (name, modifiers = 0) => {
    const codes = { f: ['KeyF',70], F: ['KeyF',70], g: ['KeyG',71], G: ['KeyG',71], F3: ['F3',114], Enter: ['Enter',13], Escape: ['Escape',27], Backspace: ['Backspace',8] };
    const [code,virtualKey] = codes[name];
    const params = { key: name, code, modifiers, windowsVirtualKeyCode: virtualKey, nativeVirtualKeyCode: virtualKey };
    await call('Input.dispatchKeyEvent', { type: 'keyDown', ...params, ...(name === 'Enter' ? {text:'\r'} : {}) });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
    await pause(80);
  };
  const state = sid => evaluate(`__searchState(${JSON.stringify(sid ?? 'search-a')})`);
  const setQuery = async text => {
    await evaluate('document.querySelector("[data-terminal-search] input").focus();document.querySelector("[data-terminal-search] input").select()');
    if (text) await call('Input.insertText', { text }); else await key('Backspace');
  };
  const output = async (sid, chunk) => {
    await evaluate(`__smokeEmit('cli-output',{sessionId:${JSON.stringify(sid)},chunk:${JSON.stringify(chunk)},stream:'stdout'})`);
    await until(() => evaluate(`!__searchHandles[${JSON.stringify(sid)}].isWriting && !__searchHandles[${JSON.stringify(sid)}].writeQueue.length`), 'parsed output');
  };
  const content = '\x1b[31mNeedle ONE\x1b[0m\r\n' + 'prefix '.repeat(30) + 'Needle TWO\r\n' + Array.from({length:90},(_,i)=>'FILLER_'+i).join('\r\n') + '\r\nNEEDLE THREE\r\nsymbols a+b [x] 漢字 tiếng Việt 한국어\r\n';
  await output('search-a', content);
  await output('search-b', 'Needle B1\r\nNeedle B2\r\n');
  await evaluate('__searchHandles["search-a"].term.focus()');
  await key('f',2);
  await until(() => evaluate('__searchState().inputFocused'), 'Ctrl+F focuses CLX search');
  assert.equal((await state()).inputCalls,0);
  assert.deepEqual(await evaluate('__searchKeyEvents.slice(-1).map(e=>({key:e.key,prevented:e.prevented,trusted:e.trusted}))'),[{key:'f',prevented:true,trusted:true}]);
  assert.equal(await evaluate('document.querySelectorAll("[data-terminal-search]").length'),1);
  report.cases.push('Ctrl+F from xterm canceled before default, single CLX bar, no PTY input');

  await setQuery('Need');
  await until(() => evaluate('__searchState().result==="1/3"'), 'incremental first match');
  const first = await state();
  await call('Input.insertText', { text: 'le' });
  await until(() => evaluate('__searchState().selection==="Needle"'), 'expanded query');
  assert.equal((await state()).result,'1/3');
  assert.deepEqual((await state()).position.start,first.position.start);
  assert.ok(first.position.start.y < await evaluate('__searchHandles["search-a"].term.buffer.active.baseY'), 'search includes off-screen scrollback');
  assert.ok((await state()).decorations > 0, 'SearchAddon renders actual decorations without proposed-API error');
  report.cases.push('incremental input stays on first match; off-screen scrollback and decorations');

  for (const [name,modifiers,result] of [['Enter',0,'2/3'],['Enter',0,'3/3'],['Enter',0,'1/3'],['Enter',8,'3/3'],['F3',0,'1/3'],['F3',8,'3/3'],['g',2,'1/3'],['G',10,'3/3']]) {
    await key(name,modifiers);
    assert.equal((await state()).result,result, name+' advances exactly once');
  }
  assert.equal((await state()).inputCalls,0);
  report.cases.push('Enter/Shift+Enter, F3/Shift+F3, Ctrl+G/Ctrl+Shift+G wrap once without CLI input');
  await evaluate('document.querySelector("[data-terminal-search] button[title^=Next]").click()');
  assert.equal((await state()).result,'1/3');
  await evaluate('document.querySelector("[data-terminal-search] button[title^=Previous]").click()');
  assert.equal((await state()).result,'3/3');
  for (const [name,modifiers] of [['f',2],['F',2],['f',4]]) {
    await key(name,modifiers);
    assert.equal((await state()).result,'3/3');
    assert.deepEqual(await evaluate('({start:document.activeElement.selectionStart,end:document.activeElement.selectionEnd})'),{start:0,end:6});
    assert.equal((await evaluate('__searchKeyEvents.slice(-1)'))[0].prevented,true);
  }
  report.cases.push('toolbar navigation and repeated/Caps Lock/Cmd+F preserve and select query');

  for (const query of ['a+b [x]', '漢字 tiếng Việt 한국어', 'Needle TWO']) {
    await setQuery(query);
    await until(() => evaluate('__searchState().result==="1/1"'), 'literal/Unicode/wrapped match');
    assert.equal((await state()).selection,query);
  }
  report.cases.push('literal punctuation, Unicode and text in wrapped lines');
  const originalColumns = await evaluate('__searchHandles["search-a"].term.cols');
  await output('search-a','p'.repeat(originalColumns-1)+'漢字 MatchWrap\r\n');
  await setQuery('漢字 MatchWrap');
  await until(() => evaluate('__searchState().result==="1/1"'), 'match across wide-character wrap padding');
  for (const [width,height] of [[900,720],[1800,1100],[1440,1000]]) {
    await call('Emulation.setDeviceMetricsOverride', { width,height,deviceScaleFactor:1,mobile:false });
    await pause(500);
    assert.equal((await state()).result,'1/1');
    assert.equal((await state()).selection,'漢字 MatchWrap');
  }
  report.cases.push('logical search selection survives width/height reflow and wide-character padding');
  await setQuery('unmatched_search_text');
  await until(() => evaluate('__searchState().result==="No match"'), 'no match status');
  assert.equal((await state()).selection,'');
  await setQuery('');
  assert.equal((await state()).result,null);
  assert.equal((await state()).selection,'');
  assert.equal((await state()).markers,0);
  report.cases.push('no-match and empty input clear highlights, selection and count');

  await setQuery('Needle');
  await until(() => evaluate('__searchState().result==="1/3"'), 'active search before switch');
  await evaluate('document.querySelector("[data-mini-terminal-session=search-b]").click()');
  await until(() => evaluate('__searchState("search-b").result==="1/2" && __searchState("search-b").inputFocused'), 'new terminal search');
  assert.equal((await state()).selection,'');
  assert.equal((await state()).markers,0);
  await output('search-a','Needle BACKGROUND\r\n');
  await pause(300);
  assert.equal((await state('search-b')).result,'1/2');
  assert.equal((await state()).markers,0);
  await evaluate('document.querySelector("[data-mini-terminal-session=search-a]").click()');
  await until(() => evaluate('__searchState().result==="1/4"'), 'returning session count');
  assert.equal((await state('search-b')).markers,0);
  report.cases.push('tab switching clears old session marks; background output cannot change visible results');

  await output('search-a','Needle LIVE\r\n');
  await until(() => evaluate('__searchState().result?.endsWith("/5")'), 'live output refresh');
  const resultBeforeResize = (await state()).result;
  await call('Emulation.setDeviceMetricsOverride', { width:1000,height:750,deviceScaleFactor:1,mobile:false });
  await until(() => evaluate('__searchState().result?.endsWith("/5") && !__searchHandles["search-a"].resizeQueue.isResizing'), 'resize search refresh');
  await pause(350);
  assert.equal((await state()).result,resultBeforeResize);
  report.cases.push('active query refreshes after new output and layout resize');
  await output('search-a','Needle CLOSE_PENDING\r\n');
  await key('Escape');
  await pause(300);
  assert.equal((await state()).bar,false);
  assert.equal((await state()).markers,0);
  assert.equal((await state()).selection,'');
  assert.equal(await evaluate('document.activeElement===__searchHandles["search-a"].term.textarea'),true);
  assert.equal((await state()).inputCalls,0);
  report.cases.push('Escape cancels search and pending refresh without leaving highlights or sending escape to CLI');

  await key('f',2);
  await setQuery('Needle');
  await evaluate('window.dispatchEvent(new CustomEvent("open-settings",{detail:"general"}))');
  await until(() => evaluate('!__searchState().bar'), 'settings closes terminal search');
  assert.equal((await state()).markers,0);
  await evaluate('document.activeElement?.blur()');
  await key('f',2);
  assert.equal((await state()).bar,false);
  assert.equal((await evaluate('__searchKeyEvents.slice(-1)'))[0].prevented,false);
  await evaluate('document.querySelector("[data-mini-terminal-session=search-a]").click()');
  await pause(300);
  await evaluate('(() => {const input=document.createElement("input");input.id="other-editor";document.body.append(input);input.focus();})()');
  await key('f',2);
  assert.equal((await state()).bar,false);
  assert.equal((await evaluate('__searchKeyEvents.slice(-1)'))[0].prevented,false);
  assert.equal(await evaluate('document.activeElement.id'), 'other-editor');
  await evaluate('document.querySelector("#other-editor").remove();__searchHandles["search-a"].term.focus()');
  report.cases.push('terminal search is scoped away from settings and other editable controls');

  await output('search-a','\x1b[3J\x1b[2J\x1b[H'+Array.from({length:1005},()=> 'BOUND').join(' ')+'\r\n');
  await key('f',2);
  await setQuery('BOUND');
  await until(() => evaluate('__searchState().result==="1/1000+"'), 'bounded highlighting');
  await key('Escape');
  assert.equal((await state()).markers,0);
  report.cases.push('highlight limit is indicated as 1000+ and cleanup releases every marker');
  assert.equal(report.exceptions.length,0, JSON.stringify(report.exceptions));
  await fs.writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
} catch (error) {
  if (evaluate) {
    try { report.page = await evaluate('(async()=>({state:__searchState(),body:document.body.innerText.slice(0,2500),events:__searchKeyEvents.slice(-8),calls:__languageSmokeCalls.slice(-15).map(c=>c.command),sessions:__smokeTerminalSessions,listedSessions:await __TAURI_INTERNALS__.invoke("list_sessions"),listedClis:await __TAURI_INTERNALS__.invoke("list_clis")}))()'); } catch {}
  }
  await fs.writeFile(path.join(directory,'failure.json'),JSON.stringify({error:error.stack,report},null,2));
  throw error;
} finally {
  socket?.close();
  for (const child of processes.reverse()) child.kill();
}
