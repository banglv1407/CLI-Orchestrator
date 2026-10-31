import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { connectBrowser, pause, until } from './browser-session.mjs';

// The launcher supplies a separate WebView2 profile and process. No IPC is
// mocked here: every created shell and output marker comes from the release.
const directory = path.resolve('.temp/native-terminal-shortcut');
await fs.mkdir(directory,{recursive:true});
const port = Number(process.env.CLX_NATIVE_DEBUG_PORT ?? '9225');
const report = { scope:'Packaged Windows Tauri/WebView2, real IPC and local PTY; DevTools keyboard automation',cases:[],createdIds:[] };
let browser;
const invoke = (command,args={}) => browser.evaluate(`__TAURI_INTERNALS__.invoke(${JSON.stringify(command)},${JSON.stringify(args)})`);
try {
  await until(async()=>{try{return (await fetch(`http://127.0.0.1:${port}/json/list`)).ok}catch{return false}},'native WebView2 debugger',30000);
  browser = await connectBrowser(port,{enablePage:false});
  const {evaluate,key} = browser;
  await until(()=>evaluate('!!window.__TAURI_INTERNALS__ && document.querySelector("#root")?.textContent.length>100'),'native React startup',30000);
  const initial = await invoke('list_sessions');
  assert.equal(initial.length,0,'test must attach to a separate new application instance');
  report.cases.push('release executable launches and renders its embedded production frontend');
  const create = async repeat => {
    const before=await invoke('list_sessions');
    const known=new Set(before.map(session=>session.id));
    await key('`','Backquote',192,2,repeat);
    await until(async()=>{
      const sessions=await invoke('list_sessions');
      for(const session of sessions)if(!known.has(session.id)&&!report.createdIds.includes(session.id))report.createdIds.push(session.id);
      return sessions.length===before.length+1;
    },'one native shell');
    const id=report.createdIds.at(-1);
    await until(()=>evaluate(`document.querySelector('[data-mini-terminal-session="${id}"]')?.getAttribute('aria-current')==='true' && document.activeElement?.classList.contains('xterm-helper-textarea') && !document.activeElement.closest('[data-mini-terminal-session]') && getComputedStyle(document.activeElement).visibility==='visible'`),'new native terminal focus');
    return id;
  };
  await create(true);
  report.cases.push('held Ctrl+Backquote creates exactly one real local shell and focuses it');
  const marker='CLX_SHORTCUT_NATIVE_OK_20261015';
  await browser.call('Input.insertText',{text:'echo '+marker});
  await key('Enter','Enter',13);
  await until(()=>evaluate(`Array.from(document.querySelectorAll('.xterm-rows > div')).some(node=>!node.closest('[data-mini-terminal-session]')&&node.textContent.trim()===${JSON.stringify(marker)})`),'real shell output marker');
  report.cases.push('typed echo command executes through the real PTY and renders a separate output line');
  await evaluate('window.dispatchEvent(new CustomEvent("open-settings",{detail:"appearance"}))');
  await until(()=>evaluate('!!document.querySelector("#interface-language")'),'native Settings');
  await evaluate('document.querySelector("#interface-language").focus()');
  await create(false);
  report.cases.push('Ctrl+Backquote from a Settings control switches to and focuses a second real terminal');
  const beforeOld=(await invoke('list_sessions')).length;
  await key('N','KeyN',78,10);
  await pause(200);
  assert.equal((await invoke('list_sessions')).length,beforeOld);
  report.cases.push('old Ctrl+Shift+N does not create a native session');
  assert.equal(browser.exceptions.length,0,JSON.stringify(browser.exceptions));
  report.exceptions=browser.exceptions;
  await browser.screenshot(path.join(directory,'native-verified.png'));
}catch(error){
  report.error=error.stack;
  throw error;
}finally{
  if(browser){
    for(const id of report.createdIds){try{await invoke('stop_cli',{request:{sessionId:id}})}catch(error){report.cleanupError=String(error)}}
    const originalLocale=process.env.CLX_NATIVE_RESTORE_LOCALE;
    if(['en','vi','ko'].includes(originalLocale)){try{await invoke('set_ui_language',{language:originalLocale})}catch(error){report.localeRestoreError=String(error)}}
    report.remainingSessions=(await invoke('list_sessions').catch(()=>[])).length;
    browser.close();
  }
  await fs.writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
}
