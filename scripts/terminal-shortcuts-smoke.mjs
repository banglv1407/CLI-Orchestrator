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
  await until(async()=>{if(processBrowser.exitCode!==null)throw new Error('Browser exited');try{port=(await fs.readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];if(!port)return false;const list=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();return list.some(t=>t.type==='page')}catch{return false}},'browser');
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
      if(command==='list_directory_files')return [
        {name:'draft.txt',path:'D:/fixture/draft.txt',isDir:false,size:12},
        {name:'config.json',path:'D:/fixture/config.json',isDir:false,size:15},
        {name:'new-note.md',path:'D:/fixture/new-note.md',isDir:false,size:18}
      ];
      if(command==='read_file_content'){
        const p=String(args?.path??'');
        if(p.endsWith('config.json'))return '{"port":8080}';
        if(p.endsWith('new-note.md'))return ['# Fresh note','line 2'].join(String.fromCharCode(10));
        return 'original draft';
      }
      if(command==='get_git_detail')return {
        isRepo:true,
        branch:'dev',
        upstream:'origin/dev',
        ahead:2,
        behind:1,
        lastCommitHash:'33c9397',
        lastCommitMessage:'feat: git detail panel',
        lastCommitAuthor:'Boss',
        lastCommitRelativeTime:'5 minutes ago',
        totalAdditions:5,
        totalDeletions:1,
        entries:[
          {path:'draft.txt',status:'modified',staged:true,additions:3,deletions:1},
          {path:'new-note.md',status:'untracked',staged:false,additions:2,deletions:0}
        ]
      };
      if(command==='get_git_diff'){
        const fp=String(args?.filePath??'');
        if(fp==='draft.txt')return ['diff --git a/draft.txt b/draft.txt','--- a/draft.txt','+++ b/draft.txt','@@ -1 +1 @@','-original draft','+updated draft'].join(String.fromCharCode(10));
        if(fp==='new-note.md'&&args?.isUntracked===true)return ['--- /dev/null','+++ b/new-note.md','@@ -0,0 +1,2 @@','+# Fresh note','+line 2'].join(String.fromCharCode(10));
        return '';
      }
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

  // Verify 1: Ctrl+Tab cycles forward across all terminals and wraps around to first; Ctrl+Shift+Tab cycles backward
  await evaluate('document.querySelector("[data-terminal-shortcut-return]")?.click()');
  await shortcut();
  const totalSessions = await evaluate('document.querySelectorAll("[data-mini-terminal-session]").length');
  assert.ok(totalSessions >= 3, 'at least 3 terminals exist for cycle verification');
  await evaluate('document.querySelector("[data-mini-terminal-session=shortcut-1]").click()');
  await until(() => evaluate('__shortcutState().active==="shortcut-1"'), 'activate first terminal');
  await key('Tab', 'Tab', 9, 2);
  await until(() => evaluate('__shortcutState().active==="shortcut-2"'), 'Ctrl+Tab advances to second terminal');
  await key('Tab', 'Tab', 9, 10);
  await until(() => evaluate('__shortcutState().active==="shortcut-1"'), 'Ctrl+Shift+Tab steps back to first terminal');
  await key('Tab', 'Tab', 9, 10);
  await until(() => evaluate(`__shortcutState().active==="shortcut-${totalSessions}"`), 'Ctrl+Shift+Tab wraps from first to last');
  await key('Tab', 'Tab', 9, 2);
  await until(() => evaluate('__shortcutState().active==="shortcut-1"'), 'Ctrl+Tab wraps from last back to first');
  report.cases.push('Ctrl+Tab and Ctrl+Shift+Tab cycle terminals with wrap-around from end to start');

  // Verify 2: Mini-terminal right-click context menu offers New, Reload, Toggle display, Config, Move panel
  await evaluate('(()=>{const card=document.querySelector("[data-mini-terminal-session=shortcut-1]");const r=card.getBoundingClientRect();card.dispatchEvent(new MouseEvent("contextmenu",{bubbles:true,cancelable:true,clientX:r.left+12,clientY:r.top+12}))})()');
  await until(() => evaluate('!!document.querySelector("[data-context-menu-source=mini]")'), 'mini terminal context menu opens');
  const miniActions = await evaluate('Array.from(document.querySelectorAll("[data-context-menu-source=mini] [data-mini-context-action]")).map(n=>n.dataset.miniContextAction)');
  assert.deepEqual(miniActions, ['new', 'reload', 'toggle-display', 'config', 'move-panel', 'close']);
  const beforeMiniNew = await evaluate('__shortcutState().count');
  await evaluate('document.querySelector("[data-mini-context-action=new]").click()');
  await until(() => evaluate(`__shortcutState().count===${beforeMiniNew + 1}`), 'mini context menu New creates terminal');
  await evaluate('(()=>{const panel=document.querySelector("[data-mini-terminal-panel=right]");const r=panel.getBoundingClientRect();panel.dispatchEvent(new MouseEvent("contextmenu",{bubbles:true,cancelable:true,clientX:r.left+8,clientY:r.bottom-8}))})()');
  await until(() => evaluate('!!document.querySelector("[data-context-menu-source=mini]")'), 'mini panel background context menu opens');
  await evaluate('document.querySelector("[data-mini-context-action=reload]").click()');
  assert.equal(await evaluate('!!document.querySelector("[data-context-menu-source=mini]")'), false);
  report.cases.push('mini-terminal right-click menu exposes new, reload, display mode, config, move panel, and close');

  // Verify 3: File editor search lets user type complete word continuously without losing focus or premature jump
  await evaluate('Array.from(document.querySelectorAll("span")).find(n=>n.textContent==="draft.txt").click()');
  await until(() => evaluate('Array.from(document.querySelectorAll("textarea")).some(n=>n.value.includes("draft"))'), 'reopen file editor');
  await evaluate('Array.from(document.querySelectorAll("button")).find(n=>n.title?.includes("Find in File")||n.textContent.includes("Find")).click()');
  await until(() => evaluate('!!Array.from(document.querySelectorAll("input")).find(n=>n.placeholder?.includes("Find in file"))'), 'file search input visible');
  await evaluate('Array.from(document.querySelectorAll("input")).find(n=>n.placeholder?.includes("Find in file")).focus()');
  for (const ch of ['d', 'r', 'a', 'f', 't']) {
    await call('Input.insertText', { text: ch });
    const stillFocused = await evaluate('document.activeElement?.tagName==="INPUT" && document.activeElement?.placeholder?.includes("Find in file")');
    assert.equal(stillFocused, true, `search input keeps focus after typing "${ch}"`);
  }
  assert.equal(await evaluate('Array.from(document.querySelectorAll("input")).find(n=>n.placeholder?.includes("Find in file")).value'), 'draft');
  await until(() => evaluate('document.body.innerText.includes("1 / 1")'), 'debounced file search finds full word match');
  report.cases.push('file editor search keeps input focus across keystrokes and matches full typed word after debounce');

  // Verify 4: Standalone FileEditorPanel supports multi-file tabs, Pin/Unpin side-panel vs modal, Explorer tab pill, Close saved, and dirty tab guard
  await evaluate('Array.from(document.querySelectorAll("span")).find(n=>n.textContent==="config.json").click()');
  await until(() => evaluate('document.querySelectorAll("[data-file-editor-tab]").length===2 && Array.from(document.querySelectorAll("[data-file-editor-panel] textarea")).some(n=>n.value.includes("8080"))'), 'second file opens in new tab');
  assert.equal(await evaluate('document.querySelectorAll("[data-file-editor-tab-dirty]").length'), 1, 'dirty badge isolated to draft.txt tab');
  await evaluate('document.querySelector("[data-file-editor-tab-path=\\"D:/fixture/draft.txt\\"]").click()');
  await until(() => evaluate('Array.from(document.querySelectorAll("[data-file-editor-panel] textarea")).some(n=>n.value==="unsaved file draft")'), 'switching back to draft.txt restores its unsaved content');
  await evaluate('document.querySelector("[data-file-editor-pin-toggle]").click()');
  await until(() => evaluate('document.querySelector("[data-file-editor-panel]")?.dataset.fileEditorPinned==="true" && !!document.querySelector("[data-file-editor-resizer]")'), 'pinned mode docks editor beside terminal with resizer');
  await evaluate('document.querySelector("[data-file-editor-pin-toggle]").click()');
  await until(() => evaluate('document.querySelector("[data-file-editor-panel]")?.dataset.fileEditorPinned==="false" && !document.querySelector("[data-file-editor-resizer]")'), 'unpinned mode restores floating modal');
  await evaluate('document.querySelector("[data-file-editor-close]").click()');
  await until(() => evaluate('!document.querySelector("[data-file-editor-panel]")'), 'hide panel keeps tabs in background');
  await evaluate('document.querySelector("[data-open-file-editor-tabs]").click()');
  await until(() => evaluate('document.querySelectorAll("[data-file-editor-tab]").length===2'), 'Explorer tabs pill reopens multi-tab editor');
  await evaluate('document.querySelector("[data-file-editor-close-all]").click()');
  await until(() => evaluate('document.querySelectorAll("[data-file-editor-tab]").length===1'), 'Close saved closes clean config.json and preserves dirty draft.txt');
  await evaluate('document.querySelector("[data-file-editor-tab-close]").click()');
  await until(() => evaluate('!!document.querySelector("[data-file-editor-confirm-modal]")'), 'closing dirty tab prompts confirmation modal');
  await evaluate('document.querySelector("[data-file-editor-confirm-discard]").click()');
  await until(() => evaluate('!document.querySelector("[data-file-editor-panel]") && !document.querySelector("[data-open-file-editor-tabs]")'), 'discarding last tab closes editor cleanly');
  report.cases.push('standalone FileEditorPanel supports multi-file tabs, pin/unpin docked & modal modes, Close saved, and dirty tab confirmation');

  // Verify 5: Git Detail panel displays branch, upstream, ahead/behind, latest commit, diff stats, and opens files/diffs via unified multi-tab FileEditorPanel
  await until(() => evaluate('document.querySelector("[data-git-detail-branch-badge]")?.textContent?.includes("dev")'), 'Git Detail collapsed header shows active branch badge');
  await evaluate('document.querySelector("[data-git-detail-toggle]").click()');
  await until(() => evaluate('!!document.querySelector("[data-git-detail-panel]") && document.querySelector("[data-git-detail-upstream]")?.textContent?.includes("origin/dev") && document.querySelector("[data-git-detail-commit]")?.textContent?.includes("33c9397")'), 'Git Detail expands with branch, upstream, and latest commit card');
  assert.ok(await evaluate('document.querySelector("[data-git-detail-stats]")?.textContent?.includes("+5") && document.querySelector("[data-git-detail-stats]")?.textContent?.includes("-1")'), 'Git Detail displays aggregate +/- diff stats');
  await evaluate('document.querySelector("[data-git-detail-file=\\"draft.txt\\"]").click()');
  await until(() => evaluate('!!document.querySelector("[data-file-editor-panel]") && Array.from(document.querySelectorAll("[data-diff-line]")).some(n=>n.textContent.includes("+updated draft"))'), 'clicking modified item in Git Detail opens unified FileEditorPanel in Diff mode');
  await evaluate('document.querySelector("[data-git-detail-edit=\\"draft.txt\\"]").click()');
  await until(() => evaluate('document.querySelectorAll("[data-file-editor-tab]").length===1 && Array.from(document.querySelectorAll("[data-file-editor-panel] textarea")).some(n=>n.value==="original draft")'), 'clicking edit icon in Git Detail switches existing tab to Edit mode without duplicating tabs');
  await evaluate('document.querySelector("[data-git-detail-file=\\"new-note.md\\"]").click()');
  await until(() => evaluate('document.querySelectorAll("[data-file-editor-tab]").length===2 && Array.from(document.querySelectorAll("[data-diff-line]")).some(n=>n.textContent.includes("+++ b/new-note.md"))'), 'clicking untracked item in Git Detail opens second tab with synthesized unified diff');
  await evaluate('document.querySelector("[data-file-editor-close-all]").click()');
  await until(() => evaluate('!document.querySelector("[data-file-editor-panel]")'), 'Close saved closes clean tabs opened from Git Detail');
  report.cases.push('Git Detail shows branch/upstream/commit/stats and opens diff & edit directly in unified multi-tab FileEditorPanel');

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
