import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { spawn } from 'node:child_process';
import { connectBrowser, pause, until } from './browser-session.mjs';

const directory = path.resolve('.temp/terminal-shortcuts');
await fs.mkdir(directory,{recursive:true});
const profile = await fs.mkdtemp(path.join(directory,'profile-'));
const processes = [];
const report = { scope:'Production React/xterm and trusted keyboard; simulated Tauri IPC',cases:[] };
let browser;
try {
  const vite = spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5194','--strictPort'],{windowsHide:true,stdio:'pipe'});
  processes.push(vite);
  let viteLog = '';
  vite.stdout.on('data',data=>{viteLog+=data});
  vite.stderr.on('data',data=>{viteLog+=data});
  await until(async()=>{if(vite.exitCode!==null)throw new Error(viteLog);try{return (await fetch('http://127.0.0.1:5194')).ok}catch{return false}},'preview');
  const executable = process.env.CLX_SHORTCUT_BROWSER ?? 'C:\\Users\\july1\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';
  const args = ['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+profile,'--window-size=1440,1000','about:blank'];
  if(process.env.CLX_SHORTCUT_BROWSER_NO_SANDBOX==='1')args.push('--no-sandbox');
  const processBrowser = spawn(executable,args,{windowsHide:true,stdio:'ignore'});
  processes.push(processBrowser);
  let port;
  await until(async()=>{if(processBrowser.exitCode!==null)throw new Error('Browser exited');try{port=(await fs.readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];return !!port}catch{return false}},'browser');
  browser = await connectBrowser(port);
  const {call,evaluate,key} = browser;
  const source = await fs.readFile('scripts/i18n-smoke.mjs','utf8');
  const match = source.match(/await call\('Page.addScriptToEvaluateOnNewDocument', \{ source: `([\s\S]*?)` \}\);/);
  assert.ok(match);
  const shim = vm.runInNewContext('`'+match[1]+'`');
  await call('Page.addScriptToEvaluateOnNewDocument',{source:shim+`
    localStorage.setItem('clx-ui-language','en');
    localStorage.setItem('clx-mini-terminal-display-mode','title-only');
    localStorage.setItem('ai-cli-right-panel-visible','true');
    const originalInvoke=__TAURI_INTERNALS__.invoke;
    let created=0;
    window.__shortcutCreates=[];
    __TAURI_INTERNALS__.invoke=async(command,args)=>{
      if(command==='create_terminal_session'){
        __shortcutCreates.push(structuredClone(args.request));
        const session={id:'shortcut-'+(++created),cliName:'Quick - shell',status:'running',workingDir:args.request.workingDir??'D:/fixture',title:'Shell '+created};
        __smokeTerminalSessions.push(session);
        return structuredClone(session);
      }
      if(command==='list_directory_files')return [{name:'draft.txt',path:'D:/fixture/draft.txt',isDir:false,size:12}];
      if(command==='read_file_content')return 'original draft';
      return originalInvoke(command,args);
    };
    window.__shortcutState=()=>({count:__shortcutCreates.length,active:document.querySelector('[data-mini-terminal-session][aria-current=true]')?.dataset.miniTerminalSession,
      focused:document.activeElement?.classList.contains('xterm-helper-textarea')&&getComputedStyle(document.activeElement).visibility==='visible',
      inputs:__languageSmokeCalls.filter(c=>c.command==='send_cli_input').length});
  `});
  await call('Page.navigate',{url:'http://127.0.0.1:5194'});
  await until(()=>evaluate('document.querySelector("#root")?.textContent.length>100'),'React');
  await pause(300);
  const shortcut = async ({repeat=false}={}) => {
    const before=await evaluate('__shortcutState()');
    await key('`','Backquote',192,2,repeat);
    await until(()=>evaluate(`__shortcutState().count===${before.count+1}&&__shortcutState().active==='shortcut-${before.count+1}'&&__shortcutState().focused`),'one new focused terminal');
    assert.equal((await evaluate('__shortcutState()')).inputs,before.inputs,'shortcut sends no PTY bytes');
  };
  await shortcut({repeat:true});
  report.cases.push('empty workspace: one held Ctrl+Backquote creates one focused terminal; no PTY bytes');
  await shortcut();
  report.cases.push('focused xterm: a second press creates another terminal without cooldown');
  const count=await evaluate('__shortcutState().count');
  await key('N','KeyN',78,10);
  await pause(100);
  assert.equal(await evaluate('__shortcutState().count'),count);
  await key('`','Backquote',192,10);
  assert.equal(await evaluate('__shortcutState().count'),count);
  report.cases.push('Ctrl+Shift+N and Ctrl+Shift+Backquote do not create terminals');

  for(const view of ['quickapps','buzz','game','apiclient','settings','remote','proxy','logs','dashboard','agent-sessions']){
    await evaluate(`window.dispatchEvent(new CustomEvent('switch-main-view',{detail:${JSON.stringify(view)}}))`);
    await pause(200);
    const input=await evaluate('Array.from(document.querySelectorAll("input,textarea,select,button")).find(n=>n.getClientRects().length&&getComputedStyle(n).visibility==="visible"&&!n.disabled)?.outerHTML.slice(0,120)');
    assert.ok(input,'view has interactive controls: '+view);
    await evaluate('Array.from(document.querySelectorAll("input,textarea,select,button")).find(n=>n.getClientRects().length&&getComputedStyle(n).visibility==="visible"&&!n.disabled)?.focus()');
    await shortcut();
    report.cases.push(view+': global shortcut opens and focuses the main terminal');
  }

  await evaluate('document.querySelector("[data-terminal-shortcut-return]")?.click();window.dispatchEvent(new CustomEvent("switch-main-view",{detail:"game"}))');
  const controlsSelector = 'button[title="Configure Controller Key Mapping"]';
  await until(()=>evaluate(`!!document.querySelector(${JSON.stringify(controlsSelector)})`),'game controls');
  await evaluate(`document.querySelector(${JSON.stringify(controlsSelector)}).click()`);
  await evaluate('Array.from(document.querySelectorAll("button")).find(n=>n.textContent.trim()==="+ Bind").click()');
  await until(()=>evaluate('Array.from(document.querySelectorAll("button")).some(n=>n.textContent.trim()==="Press key…")'),'game key binding capture');
  await shortcut();
  const beforeGameEnter=await evaluate('__shortcutState().inputs');
  await key('Enter','Enter',13);
  await until(()=>evaluate(`__shortcutState().inputs===${beforeGameEnter+1}`),'hidden game mapper releases keyboard');
  report.cases.push('game key-binding capture cannot swallow Ctrl+Backquote or subsequent terminal Enter');

  await evaluate('document.querySelector("[data-mini-terminal-session=shortcut-1]").dispatchEvent(new MouseEvent("click",{bubbles:true,ctrlKey:true}))');
  await until(()=>evaluate('!!document.querySelector("[data-terminal-broadcast]")'),'group selected');
  await shortcut();
  assert.equal(await evaluate('!!document.querySelector("[data-terminal-broadcast]")'),false);
  assert.equal(await evaluate('document.querySelectorAll("[data-mini-terminal-selected=true]").length'),1);
  report.cases.push('creating a terminal clears the previous broadcast group and keeps the new session active');

  await evaluate('(()=>{const field=document.createElement("textarea");field.id="shortcut-blocker";document.body.append(field);field.focus();window.__blockedKeys=0;window.__lateBlocker=e=>{__blockedKeys++;e.stopImmediatePropagation()};window.addEventListener("keydown",__lateBlocker,true);})()');
  await shortcut();
  assert.equal(await evaluate('__blockedKeys'),0);
  await evaluate('window.removeEventListener("keydown",__lateBlocker,true);document.querySelector("#shortcut-blocker").remove()');
  report.cases.push('early capture wins over a later window capture handler that stops propagation');

  await evaluate('document.activeElement?.blur()');
  await key('n','KeyN',78,2);
  await until(()=>evaluate('!!document.querySelector("[data-terminal-shortcut-dialogs] textarea")'),'notepad');
  await evaluate('document.querySelector("[data-terminal-shortcut-dialogs] textarea").focus()');
  await call('Input.insertText',{text:'notepad kept'});
  await shortcut();
  assert.equal(await evaluate('getComputedStyle(document.querySelector("[data-terminal-shortcut-dialogs]")).display'),'none');
  await evaluate('document.querySelector("[data-terminal-shortcut-return]").click()');
  await until(()=>evaluate('getComputedStyle(document.querySelector("[data-terminal-shortcut-dialogs]")).display!=="none"'),'restore notepad');
  assert.ok(await evaluate('Array.from(document.querySelectorAll("[data-terminal-shortcut-dialogs] textarea")).some(n=>n.value.includes("notepad kept"))'));
  await key('n','KeyN',78,2);
  report.cases.push('notepad shortcut is preserved; opening a terminal hides and restores its unsaved text');

  await key('p','KeyP',80,2);
  await pause(150);
  await shortcut();
  assert.equal(await evaluate('getComputedStyle(document.querySelector("[data-terminal-shortcut-dialogs]")).display'),'none');
  await evaluate('document.querySelector("[data-terminal-shortcut-return]").click()');
  await until(()=>evaluate('document.activeElement?.tagName==="INPUT" && !!document.activeElement.closest("[data-terminal-shortcut-dialogs]")'),'restored palette focus');
  await key('Escape','Escape',27);
  report.cases.push('command palette: Ctrl+Backquote opens a terminal and can restore the palette');

  await evaluate('Array.from(document.querySelectorAll("span")).find(n=>n.textContent==="draft.txt").click()');
  await until(()=>evaluate('Array.from(document.querySelectorAll("textarea")).some(n=>n.value==="original draft")'),'file editor');
  await evaluate('(()=>{const editor=Array.from(document.querySelectorAll("textarea")).find(n=>n.value==="original draft");editor.focus();editor.select()})()');
  await call('Input.insertText',{text:'unsaved file draft'});
  await shortcut();
  await evaluate('document.querySelector("[data-terminal-shortcut-return]").click()');
  assert.ok(await evaluate('Array.from(document.querySelectorAll("textarea")).some(n=>n.value==="unsaved file draft")'));
  report.cases.push('file editor draft survives opening a terminal and returning without a file write');

  await evaluate('window.dispatchEvent(new Event("trigger-command-palette"))');
  await until(()=>evaluate('Array.from(document.querySelectorAll("[data-terminal-shortcut-dialogs] *")).some(n=>n.childElementCount===0&&n.textContent==="New CLI Tool...")'),'palette CLI action');
  await evaluate('Array.from(document.querySelectorAll("[data-terminal-shortcut-dialogs] *")).find(n=>n.childElementCount===0&&n.textContent==="New CLI Tool...").click()');
  await until(()=>evaluate('!!document.querySelector("[data-terminal-shortcut-dialogs] input")'),'CLI form');
  await evaluate('document.querySelector("[data-terminal-shortcut-dialogs] input").focus()');
  await call('Input.insertText',{text:'draft cli name'});
  await shortcut();
  await evaluate('document.querySelector("[data-terminal-shortcut-return]").click()');
  assert.ok(await evaluate('Array.from(document.querySelectorAll("[data-terminal-shortcut-dialogs] input")).some(n=>n.value==="draft cli name")'));
  report.cases.push('CLI registration modal preserves its draft when opening and returning from a terminal');

  assert.equal(browser.exceptions.length,0,JSON.stringify(browser.exceptions));
  report.exceptions=browser.exceptions;
  await browser.screenshot(path.join(directory,'shortcut-verified.png'));
  await fs.writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
}catch(error){
  report.error=error.stack;
  if(browser){try{report.page=await browser.evaluate('({state:window.__shortcutState?.(),body:document.body.innerText.slice(0,3000)})')}catch{}}
  await fs.writeFile(path.join(directory,'failure.json'),JSON.stringify(report,null,2));
  throw error;
}finally{
  browser?.close();
  for(const child of processes.reverse())child.kill();
}
