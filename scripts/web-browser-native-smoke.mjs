import assert from 'node:assert/strict';
import { socksFixture, sshFixture } from './web-browser-fixtures.mjs';
import { runChainMiniCases } from './web-browser-chain-mini-cases.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import { createHash, randomUUID } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { connectBrowser, pause, until } from './browser-session.mjs';

// Real release binary, real IPC, native child WebView and local networking.
// The fixture never resolves or contacts external hosts. Test roots isolate
// browser settings/profiles; existing CLX processes are never terminated.
const directory = path.resolve('.temp/web-browser-native', randomUUID());
await fs.mkdir(directory, { recursive: true });
const browserRoot = path.join(directory, 'browser-data');
const shellRoot = path.join(directory, 'shell-profile');
const report = { scope: 'Native Windows Tauri/WebView2 and loopback Direct/HTTP/SOCKS/SSH fixtures', directory, cases: [], socksRequests: [], proxyRequests: [], originRequests: [], exceptions: [] };
report.cases.push=(...entries)=>{for(const entry of entries)console.log('PASS: '+entry);return Array.prototype.push.apply(report.cases,entries);};
const sockets = new Set();
const track = socket => { sockets.add(socket); socket.on('error', () => undefined); socket.once('close', () => sockets.delete(socket)); };
const listen = server => new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
const snippet = `<!doctype html><meta charset="utf-8"><title>CLX full website fixture</title>
<link rel="stylesheet" href="http://assets.clx-web-fixture.test:PORT/style.css">
<main><h1 id="heading">Full website through proxy</h1><p id="result">Loading</p>
<img id="image" src="http://assets.clx-web-fixture.test:PORT/image.svg" width="72" height="72">
<a id="second" href="/second">Second page</a> <a id="popup" href="/popup" target="_blank">New window</a>
<form id="login" method="post" action="/login"><input name="user" value="local-fixture"><button>Sign in</button></form>
<a id="download" href="/download">Download fixture</a></main><script src="/app.js"></script>`;
const origin = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://fixture.test');
  report.originRequests.push({ method: request.method, path: url.pathname, host: request.headers.host, cookie: request.headers.cookie ?? '' });
  if (url.pathname === '/style.css') { response.setHeader('Content-Type', 'text/css'); response.end('body{font:20px sans-serif;background:#eef8ff;color:#143c58;padding:36px}h1{color:rgb(17, 89, 119)}a,button{margin:12px}'); }
  else if (url.pathname === '/image.svg') { response.setHeader('Content-Type', 'image/svg+xml'); response.end('<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><rect width="72" height="72" rx="16" fill="#15b8a6"/><path d="M16 36h40M36 16v40" stroke="white" stroke-width="6"/></svg>'); }
  else if (url.pathname === '/api/data') { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify({ ok: true, cookie: (request.headers.cookie ?? '').includes('fixture_cookie=present') })); }
  else if (url.pathname === '/module.js') { response.setHeader('Content-Type', 'text/javascript'); response.end('export const marker="dynamic-module-ok";'); }
  else if (url.pathname === '/app.js') {
    response.setHeader('Content-Type', 'text/javascript');
    response.end(`window.fixture={};document.querySelector('#result').textContent='JavaScript loaded';fetch('/api/data').then(r=>r.json()).then(data=>window.fixture.api=data);import('/module.js').then(module=>window.fixture.module=module.marker);const socket=new WebSocket('ws://'+location.host+'/socket');socket.onmessage=event=>{window.fixture.websocket=event.data;socket.close()};`);
  } else if (url.pathname === '/login') {
    request.resume(); response.writeHead(302, { Location: '/account', 'Set-Cookie': 'fixture_session=authenticated; Path=/; HttpOnly; SameSite=Lax' }); response.end();
  } else if (url.pathname === '/account') {
    response.setHeader('Content-Type', 'text/html'); response.end(`<title>Fixture account</title><h1 id="account">${(request.headers.cookie ?? '').includes('fixture_session=authenticated') ? 'Authenticated account' : 'Missing session'}</h1>`);
  } else if (url.pathname === '/redirect') { response.writeHead(302, { Location: '/second' }); response.end(); }
  else if (url.pathname === '/second' || url.pathname === '/popup') { response.setHeader('Content-Type', 'text/html'); response.end(`<title>Fixture ${url.pathname.slice(1)}</title><h1 id="destination">${url.pathname}</h1>`); }
  else if (url.pathname === '/download') { response.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment; filename="clx-local-fixture.txt"' }); response.end('CLX native proxy download fixture'); }
  else { response.writeHead(200, { 'Content-Type': 'text/html', 'Set-Cookie': 'fixture_cookie=present; Path=/; SameSite=Lax' }); response.end(snippet.replaceAll('PORT', String(origin.address().port)).replaceAll('assets.clx-web-fixture.test', request.headers.host?.startsWith('127.0.0.1:') ? '127.0.0.1' : 'assets.clx-web-fixture.test')+(url.searchParams.has('blocked')?`<img src="http://denied.clx-web-fixture.test:${originPort}/optional.svg" alt="Optional resource">`:'')); }
});
origin.on('connection', track);
origin.on('upgrade', (request, socket) => {
  report.originRequests.push({ method: 'UPGRADE', path: request.url, host: request.headers.host });
  const accept = createHash('sha1').update(request.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
  const payload = Buffer.from('websocket-ok'); socket.write(Buffer.concat([Buffer.from([0x81, payload.length]), payload]));
  socket.on('data', data => { if ((data[0] & 0xf) === 8) socket.end(Buffer.from([0x88, 0])); });
});
const originPort = await listen(origin);
const isFixture = hostname => ['clx-web-fixture.test', 'assets.clx-web-fixture.test', '127.0.0.1'].includes(hostname);
const proxy = http.createServer((request, response) => {
  let target;
  try { target = new URL(request.url); } catch { response.writeHead(400).end(); return; }
  report.proxyRequests.push({ method: request.method, url: request.url });
  if (!isFixture(target.hostname) || Number(target.port) !== originPort) { response.writeHead(502).end(); return; }
  const headers = { ...request.headers }; delete headers['proxy-connection']; delete headers['proxy-authorization'];
  const upstream = http.request({ hostname: '127.0.0.1', port: originPort, method: request.method, path: target.pathname + target.search, headers }, remote => {
    response.writeHead(remote.statusCode, remote.headers); remote.pipe(response);
  });
  upstream.on('error', () => { if (!response.headersSent) response.writeHead(502); response.end(); });
  request.pipe(upstream);
});
proxy.on('connection', track);
proxy.on('connect', (request, socket, head) => {
  const target = new URL('http://' + request.url);
  report.proxyRequests.push({ method: 'CONNECT', url: target.href });
  if (!isFixture(target.hostname) || Number(target.port) !== originPort) { socket.end('HTTP/1.1 502 Bad Gateway\r\n\r\n'); return; }
  const upstream = net.connect(originPort, '127.0.0.1', () => {
    socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    if (head.length) upstream.write(head);
    socket.pipe(upstream); upstream.pipe(socket);
  });
  track(upstream); upstream.on('error', () => socket.destroy()); socket.on('error', () => upstream.destroy());
});
proxy.on('upgrade', (request, socket, head) => {
  const target = new URL(request.url, 'http://' + request.headers.host);
  report.proxyRequests.push({ method: 'UPGRADE', url: target.href });
  if (!isFixture(target.hostname) || Number(target.port) !== originPort) { socket.destroy(); return; }
  const upstream = net.connect(originPort, '127.0.0.1', () => {
    const headers = Object.entries(request.headers).filter(([key]) => !key.startsWith('proxy-')).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    upstream.write(`${request.method} ${target.pathname}${target.search} HTTP/1.1\r\n${headers}\r\n\r\n`);
    if (head.length) upstream.write(head);
    socket.pipe(upstream); upstream.pipe(socket);
  });
  track(upstream); upstream.on('error', () => socket.destroy()); socket.on('error', () => upstream.destroy());
});
const proxyPort = await listen(proxy);
const targetUrl = `http://clx-web-fixture.test:${originPort}/`;
const makeHop=(kind,port,extra={})=>({kind,host:'127.0.0.1',port,username:'',secret:'',authMode:'password',keyPath:'',hostKey:'',...extra});
const config={url:targetUrl,hop:makeHop('http',proxyPort)};
const activePort=async root=>{for(const suffix of ['EBWebView/DevToolsActivePort','DevToolsActivePort']) {try{const value=Number((await fs.readFile(path.join(root,suffix),'utf8')).split('\n')[0]);if(value)return value;}catch{}}return 0;};
const readPort=async root=>{let value;await until(async()=>{value=await activePort(root);try{return value && (await fetch(`http://127.0.0.1:${value}/json/list`)).ok;}catch{return false;}},'native debugger '+root,35000);return value;};
let processHandle,shell,content,ssh;
const connections=[];const routeServers=[];
const invoke=(command,args={})=>shell.evaluate(`window.__TAURI_INTERNALS__.invoke(${JSON.stringify(command)},${JSON.stringify(args)})`);
const setInput=(id,value)=>shell.evaluate(`(()=>{const node=document.getElementById(${JSON.stringify(id)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(node,${JSON.stringify(value)});node.dispatchEvent(new Event('input',{bubbles:true}));})()`);
const select=(id,value)=>shell.evaluate(`(()=>{const node=document.getElementById(${JSON.stringify(id)});node.value=${JSON.stringify(value)};node.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const click=selector=>shell.evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const currentSession=()=>shell.evaluate('document.querySelector("[data-web-browser-root]")?.dataset.webBrowserSession');
const currentTab=()=>shell.evaluate('document.querySelector("[data-web-browser-root]")?.dataset.webActiveTab');
const snapshot=sessionId=>invoke('web_browser_snapshot',{sessionId});
const contentMatches=(expression,description)=>until(async()=>{try{return await content.evaluate(expression);}catch{return false;}},description,25000);
const contentClick=async selector=>{await contentMatches('document.readyState==="complete"','document ready');await content.call('Runtime.evaluate',{expression:`document.querySelector(${JSON.stringify(selector)}).click()`,userGesture:true,awaitPromise:true,returnByValue:true});};
const attach=async (id,url)=>{
  const page=await snapshot(id);assert(page?.routeKey);
  const root=path.join(browserRoot,'web-browser','profiles',page.routeKey),port=await readPort(root);
  let target;await until(async()=>{const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();target=targets.find(target=>target.type==='page' && target.url===url);return !!target;},'content target '+url);
  content=await connectBrowser(port,{enablePage:false,targetId:target.id});connections.push(content);return content;
};
const capture=async name=>{
  const result=spawnSync('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File','scripts/capture-web-browser-window.ps1','-ProcessId',String(processHandle.pid),'-OutputPath',path.join(directory,name)],{windowsHide:true,encoding:'utf8',timeout:15000});
  assert.equal(result.status,0,result.stderr||String(result.error));
};
const readySession=async old=>{let id;await until(async()=>{id=await currentSession();return id && id!==old && (await snapshot(id))?.visible;},'new native tab',40000);return id;};
const openUI=async (url,enter=false)=>{
  const old=await currentSession();await setInput('web-address',url);
  await until(()=>shell.evaluate('document.querySelector("[data-web-go]")?.disabled===false'),'address ready');
  if(enter) await shell.evaluate('document.querySelector("#web-address").dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",bubbles:true,cancelable:true}))');else await click('[data-web-go]');
  let id;await until(async()=>{id=await currentSession();return id && !(await shell.evaluate('document.querySelector("[data-web-go]").disabled')) && ((await snapshot(id))?.url===url);},'Go opens '+url,45000);
  assert.equal(await shell.evaluate('!!document.querySelector("#web-proxy-settings")'),false,'Go does not open settings');return id;
};
const bounds=()=>shell.evaluate('(()=>{const r=document.querySelector("[data-web-browser-viewport]").getBoundingClientRect();return {x:r.x*devicePixelRatio,y:r.y*devicePixelRatio,width:r.width*devicePixelRatio,height:r.height*devicePixelRatio};})()');
const openNative=async cfg=>{const id=randomUUID();await invoke('web_browser_set_viewport',{sessionId:id,bounds:await bounds(),visible:true});await invoke('web_browser_open',{request:{sessionId:id,config:cfg,bounds:await bounds()}});return id;};
try {
  const executable=process.env.CLX_WEB_BROWSER_EXE;assert(executable,'Set CLX_WEB_BROWSER_EXE.');
  const environment={...process.env,CLX_WEBVIEW_DATA_DIR:shellRoot,CLX_WEB_BROWSER_DATA_DIR:browserRoot,WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:'--remote-debugging-port=0 --no-sandbox --disable-gpu --no-first-run'};delete environment.WEBVIEW2_USER_DATA_FOLDER;
  const runLog=await fs.open(path.join(directory,'native-startup.log'),'w');
  processHandle=spawn(path.resolve(executable),[],{windowsHide:true,env:environment,stdio:['ignore',runLog.fd,runLog.fd]});await runLog.close();report.pid=processHandle.pid;
  shell=await connectBrowser(await readPort(shellRoot),{enablePage:false});
  await until(()=>shell.evaluate('!!window.__TAURI_INTERNALS__ && !!document.querySelector("#root")?.textContent.length'),'native startup',30000);
  assert.deepEqual(await invoke('web_browser_get_config'),{url:''});
  await shell.evaluate(`window.dispatchEvent(new CustomEvent('open-sidebar-tab',{detail:'web'}))`);
  await until(()=>shell.evaluate('!!document.querySelector("#web-address")'),'Web panel');
  assert.equal(await shell.evaluate('!!document.querySelector("#web-proxy-settings")'),false);
  const directUrl=`http://127.0.0.1:${originPort}/`,directId=await openUI(directUrl,true),directTab=await currentTab();
  await attach(directId,directUrl);
  await contentMatches('window.fixture?.api?.ok && window.fixture.module==="dynamic-module-ok" && window.fixture.websocket==="websocket-ok" && document.querySelector("#image")?.naturalWidth===72','full direct page');
  assert.equal(report.proxyRequests.length,0);
  report.cases.push('Enter immediately opens the full website with Direct and no proxy configuration');
  await click('[data-web-new-tab]');await click('button[aria-controls="web-proxy-settings"]');
  await select('web-hop-kind','http');await setInput('web-hop-host','127.0.0.1');await setInput('web-hop-port',String(proxyPort));await setInput('web-address',targetUrl);await setInput('web-profile-name','Office HTTP');
  const before=report.originRequests.length;await click('[data-web-profile-save]');
  await until(()=>shell.evaluate('document.querySelector("#web-profile-select").value!=="custom"'),'saved named configuration');
  assert.equal(report.originRequests.length,before);
  const savedSettings=await invoke('web_browser_get_settings'),profile=savedSettings.profiles.find(p=>p.name==='Office HTTP');assert(profile);
  await shell.screenshot(path.join(directory,'web-settings-en.png'));
  report.cases.push('a named connection can be saved without opening the website');
  const httpId=await openUI(targetUrl),httpTab=await currentTab();await attach(httpId,targetUrl);
  await contentMatches('window.fixture?.api?.cookie && window.fixture.module==="dynamic-module-ok" && window.fixture.websocket==="websocket-ok" && document.querySelector("#image")?.naturalWidth===72','full HTTP-proxy page');
  assert.equal(await content.evaluate('getComputedStyle(document.querySelector("#heading")).color'),'rgb(17, 89, 119)');
  for(const pathname of ['/','/style.css','/image.svg','/app.js','/api/data','/module.js'])assert(report.proxyRequests.some(request=>new URL(request.url).pathname===pathname),'proxy saw '+pathname);
  assert.equal(await content.evaluate('location.origin'),`http://clx-web-fixture.test:${originPort}`);
  report.cases.push('Go opens HTML, cross-host CSS/image, JS, dynamic import, fetch, cookies and WebSocket through HTTP proxy');
  assert.equal((await snapshot(directId)).visible,false);await click(`[data-web-tab="${directTab}"]`);
  await until(async()=>(await snapshot(directId)).visible && !(await snapshot(httpId)).visible,'switch to direct tab');
  await click(`[data-web-tab="${httpTab}"]`);await until(async()=>(await snapshot(httpId)).visible,'return to HTTP tab');
  assert.equal(await shell.evaluate('document.querySelectorAll("[role=tab][data-web-tab]").length'),2);
  report.cases.push('multiple native tabs retain independent pages and show only the selected tab');
  await capture('native-full-page.png');
  for(const command of ['list_sessions','plugin:event|emit']) {
    const denied=await content.evaluate(`window.__TAURI_INTERNALS__?.invoke ? window.__TAURI_INTERNALS__.invoke(${JSON.stringify(command)},{event:'clx-isolation-test',payload:null}).then(()=>false,()=>true) : true`);assert.equal(denied,true);
  }
  assert(Array.isArray(await invoke('plugin:window|get_all_windows')));
  report.cases.push('website content is denied both CLX commands and built-in event IPC');
  await contentClick('#login button');await contentMatches('document.querySelector("#account")?.textContent==="Authenticated account"','form, redirect and HttpOnly session');
  await invoke('web_browser_action',{sessionId:httpId,action:'back'});await contentMatches('!!document.querySelector("#heading")','back');
  await invoke('web_browser_action',{sessionId:httpId,action:'forward'});await contentMatches('!!document.querySelector("#account")','forward');
  await invoke('web_browser_navigate',{sessionId:httpId,url:targetUrl+'redirect'});await contentMatches('document.querySelector("#destination")?.textContent==="/second"','redirect');
  report.cases.push('form POST, HttpOnly cookies, back, forward and redirects work through the route');
  await invoke('web_browser_navigate',{sessionId:httpId,url:targetUrl});await contentMatches('!!document.querySelector("#popup")','home');await contentClick('#popup');
  const popupId=await readySession(httpId),popupTab=await currentTab();await attach(popupId,targetUrl+'popup');await contentMatches('document.querySelector("#destination")?.textContent==="/popup"','popup content');
  assert.equal((await snapshot(httpId)).visible,false);assert.equal((await snapshot(popupId)).routeKey,(await snapshot(httpId)).routeKey);
  await click(`[data-web-tab-close="${popupTab}"]`);await until(async()=>(await snapshot(popupId))===null,'popup tab closed');
  await click(`[data-web-tab="${httpTab}"]`);await attach(httpId,targetUrl);
  report.cases.push('target=_blank creates a managed tab on the source connection; closing it preserves other tabs');
  await shell.evaluate(`window.dispatchEvent(new CustomEvent('open-settings',{detail:'appearance'}))`);await until(async()=>!(await snapshot(httpId)).visible,'hide content for Settings');
  await shell.evaluate(`window.dispatchEvent(new CustomEvent('open-sidebar-tab',{detail:'web'}))`);await until(async()=>(await snapshot(httpId)).visible,'restore browser');
  const originalSize=await invoke('get_window_size');await invoke('adjust_window_scale',{zoomPercent:100,baseWidth:1180,baseHeight:780});await pause(400);
  const expected=await shell.evaluate('document.querySelector("[data-web-browser-viewport]").getBoundingClientRect().width*devicePixelRatio'),actual=await content.evaluate('innerWidth*devicePixelRatio');assert(Math.abs(expected-actual)<3,`${actual} vs ${expected}`);
  await invoke('adjust_window_scale',{zoomPercent:100,baseWidth:originalSize.width,baseHeight:originalSize.height});
  report.cases.push('native content hides for Settings and follows resized physical bounds');
  await until(async()=>(await invoke('web_browser_get_history')).some(entry=>entry.url===targetUrl),'history persisted');
  await click('[data-web-history-toggle]');await until(()=>shell.evaluate('!!document.querySelector("[data-web-history-entry]")'),'history UI');
  const history=await invoke('web_browser_get_history'),entry=history.find(entry=>entry.url===targetUrl+'second')??history[0];
  await click(`[data-web-history-entry="${entry.id}"] button`);await until(async()=>(await snapshot(await currentSession()))?.url===entry.url,'reopen history');
  await until(()=>shell.evaluate('!document.querySelector("[data-web-history]") && !document.querySelector("[data-web-go]").disabled'),'history navigation finished');
  await click('[data-web-history-toggle]');const deleteEntry=(await invoke('web_browser_get_history'))[0];
  await until(()=>shell.evaluate(`!!document.querySelector('[data-web-history-entry="${deleteEntry.id}"]')`),'history record rendered');
  await click(`[data-web-history-entry="${deleteEntry.id}"] button:last-child`);await until(async()=>!(await invoke('web_browser_get_history')).some(entry=>entry.id===deleteEntry.id),'delete history entry');
  await click('[data-web-history-clear]');await pause(1600);assert.equal((await invoke('web_browser_get_history')).length,0);assert.deepEqual(JSON.parse(await fs.readFile(path.join(browserRoot,'web-browser-history.json'),'utf8')),[]);
  await click('[data-web-history-toggle]');
  report.cases.push('history records real navigation, reopens with its named connection, deletes one/all and stays cleared');
  const authenticatedProxy=http.createServer((request,response)=>{
    if(request.headers['proxy-authorization']!=='Basic '+Buffer.from('fixture:fixture-password').toString('base64')) {response.writeHead(407).end();return;}
    proxy.emit('request',request,response);
  });
  authenticatedProxy.on('connection',track);
  for(const event of ['connect','upgrade']) authenticatedProxy.on(event,(request,socket,head)=>{
    if(request.headers['proxy-authorization']!=='Basic '+Buffer.from('fixture:fixture-password').toString('base64')) {socket.end('HTTP/1.1 407 Proxy Authentication Required\r\n\r\n');return;}
    proxy.emit(event,request,socket,head);
  });
  const authenticatedPort=await listen(authenticatedProxy);routeServers.push(authenticatedProxy);
  const authenticatedId=await openNative({url:targetUrl,hop:makeHop('http',authenticatedPort,{username:'fixture',secret:'fixture-password'})});
  await attach(authenticatedId,targetUrl);await contentMatches('window.fixture?.api?.ok && window.fixture.websocket==="websocket-ok" && document.querySelector("#image")?.naturalWidth===72','authenticated HTTP proxy');
  await invoke('web_browser_close',{sessionId:authenticatedId});
  assert(!report.originRequests.some(request=>request.proxyAuthorization));
  report.cases.push('HTTP proxy username/password authenticates full-page resources and WebSocket');
  // Route adapters use native commands with real child surfaces and local servers.
  for(const [kind,authenticated] of [['socks4',false],['socks5',false],['socks5',true]]) {
    const fixture=await socksFixture(kind,authenticated,originPort,report,track);routeServers.push(fixture.server);
    const cfg={url:targetUrl,hop:makeHop(kind,fixture.port,authenticated?{username:'fixture',secret:'fixture-password'}:{})};
    const id=await openNative(cfg);await attach(id,targetUrl);await contentMatches('window.fixture?.api?.ok && window.fixture.websocket==="websocket-ok" && document.querySelector("#image")?.naturalWidth===72','full '+kind+' page');
    assert(report.socksRequests.some(request=>request.kind===kind && request.authenticated===authenticated && request.host==='assets.clx-web-fixture.test'));
    await invoke('web_browser_close',{sessionId:id});
    report.cases.push(`${kind}${authenticated?' with username/password':''} loads a full native website with remote DNS and WebSocket`);
  }
  ssh=await sshFixture(directory,originPort);
  const sshHop=makeHop('ssh',ssh.port,{username:'fixture',secret:'fixture-password',hostKey:ssh.fingerprint});
  const discovered=await invoke('probe_ssh_fingerprint',{host:'127.0.0.1',port:ssh.port});assert.equal(discovered,ssh.fingerprint);
  for(const [mode,extra] of [['password',{}],['key',{authMode:'key',keyPath:ssh.keyPath,secret:''}],['encrypted-key',{authMode:'key',keyPath:ssh.encryptedKeyPath,secret:'fixture-passphrase'}]]) {
    const cfg={url:targetUrl,hop:{...sshHop,...extra}},first=await openNative(cfg);await attach(first,targetUrl);
    await contentMatches('window.fixture?.api?.ok && window.fixture.websocket==="websocket-ok" && document.querySelector("#image")?.naturalWidth===72','SSH '+mode);
    if(mode==='password') {
      const second=await openNative({...cfg,url:targetUrl+'second'});await attach(second,targetUrl+'second');await invoke('web_browser_close',{sessionId:first});await invoke('web_browser_navigate',{sessionId:second,url:targetUrl});await contentMatches('window.fixture?.api?.ok','shared SSH remains after first tab closes');await invoke('web_browser_close',{sessionId:second});
      const reopened=await openNative(cfg);await attach(reopened,targetUrl);await contentMatches('window.fixture?.api?.ok','same SSH profile reopens');await invoke('web_browser_close',{sessionId:reopened});
    } else await invoke('web_browser_close',{sessionId:first});
    report.cases.push('pinned SSH '+mode+' loads the full native website'+(mode==='password'?' and survives shared-tab close and route reopen':''));
  }
  const savedSSH=await invoke('web_browser_save_profile',{id:null,name:'Office SSH',config:{url:targetUrl,hop:sshHop}});assert.equal(savedSSH.profiles.length,2);
  const rawSettings=await fs.readFile(path.join(browserRoot,'web-browser.json'),'utf8');assert(rawSettings.includes('dpapi:v1:'));assert(!rawSettings.includes('fixture-password'));
  for(const changed of [{secret:'wrong-password'},{hostKey:'SHA256:'+'A'.repeat(43)}]) await assert.rejects(openNative({url:targetUrl,hop:{...sshHop,...changed}}));
  report.cases.push('SSH fingerprint discovery works, wrong password/pin fail closed, saved credentials use Windows DPAPI');
  const deniedDestination=await openNative({url:`http://denied.clx-web-fixture.test:${originPort}/`,hop:sshHop});
  await until(async()=>(await snapshot(deniedDestination))?.error,'SSH main-document forwarding error');
  await invoke('web_browser_close',{sessionId:deniedDestination});
  report.cases.push('an SSH forwarding failure for the main document is reported even when the adapter returns HTTP 502');
  const stalledSSH=net.createServer(track),stalledPort=await listen(stalledSSH);routeServers.push(stalledSSH);
  const cancelledId=randomUUID(),cancelBounds=await bounds();
  await shell.evaluate(`window.__cancelledWebOpen=undefined;void window.__TAURI_INTERNALS__.invoke('web_browser_open',{request:${JSON.stringify({sessionId:cancelledId,config:{url:targetUrl,hop:{...sshHop,port:stalledPort}},bounds:cancelBounds})}}).then(()=>window.__cancelledWebOpen='opened',error=>window.__cancelledWebOpen=String(error));`);
  await pause(150);const cancelStart=Date.now();await invoke('web_browser_close',{sessionId:cancelledId});
  await until(()=>shell.evaluate('typeof window.__cancelledWebOpen==="string"'),'pending SSH cancelled',3000);
  assert.match(await shell.evaluate('window.__cancelledWebOpen'),/cancelled/);assert(Date.now()-cancelStart<3000);assert.equal(await snapshot(cancelledId),null);
  report.cases.push('closing a pending SSH tab cancels authentication immediately without blocking other browser controls');
  const dead=net.createServer(),deadPort=await listen(dead);await new Promise(resolve=>dead.close(resolve));
  const closedId=await openNative({url:`http://127.0.0.1:${originPort}/direct-only`,hop:makeHop('http',deadPort)});await until(async()=>(await snapshot(closedId))?.error,'failed proxy');assert(!report.originRequests.some(request=>request.path==='/direct-only'));await invoke('web_browser_close',{sessionId:closedId});
  report.cases.push('a failed proxy reports an error and never falls back to direct, including loopback');
  const beforeTLS=report.originRequests.length;
  const rejectedTLS=await openNative({url:targetUrl,hop:makeHop('https',proxyPort)});
  await until(async()=>(await snapshot(rejectedTLS))?.error,'HTTPS proxy TLS mismatch');
  assert.equal(report.originRequests.length,beforeTLS);await invoke('web_browser_close',{sessionId:rejectedTLS});
  report.cases.push('HTTPS proxy requires TLS and cannot downgrade to a plaintext HTTP proxy');
  for(const url of ['file:///C:/Windows/win.ini','http://tauri.localhost/','javascript://bad']) await assert.rejects(openNative({...config,url}));
  report.cases.push('native commands reject app origins and unsafe schemes');
  // A trusted reload loads profiles saved by native commands, then Go selects SSH.
  await shell.evaluate('location.reload()').catch(()=>undefined);
  await until(async()=>{try{return await shell.evaluate(`!!document.querySelector('button[aria-label="Web Browser"]')`);}catch{return false;}},'trusted restart');
  await shell.evaluate(`window.dispatchEvent(new CustomEvent('open-sidebar-tab',{detail:'web'}))`);
  await until(()=>shell.evaluate('document.querySelector("#web-profile-select")?.options.length>=3'),'restored named connections');
  const sshProfile=savedSSH.profiles.find(profile=>profile.name==='Office SSH');await select('web-profile-select',sshProfile.id);
  const partialUrl=targetUrl+'?blocked=1';
  const namedSshId=await openUI(partialUrl);await attach(namedSshId,partialUrl);await contentMatches('window.fixture?.api?.ok && document.readyState==="complete"','Go on saved SSH route');
  assert.equal((await snapshot(namedSshId)).error,null,'a blocked optional resource does not fail the main document');
  await until(async()=>(await invoke('web_browser_get_history')).some(entry=>entry.profileId===sshProfile.id),'named SSH navigation in history');
  const retainedHistory=await invoke('web_browser_get_history');
  report.cases.push('a saved SSH profile opens with Go after restart and records successful navigation despite a blocked optional resource');
  // Reload real trusted frontend: named routes/history persist and tabs are fresh.
  for(const [language,title] of [['vi','Trình duyệt web'],['ko','웹 브라우저'],['en','Web Browser']]) {
    await shell.evaluate(`localStorage.setItem('clx-ui-language',${JSON.stringify(language)});location.reload()`).catch(()=>undefined);
    await until(async()=>{try{return await shell.evaluate(`document.documentElement.lang===${JSON.stringify(language)} && !!document.querySelector('button[aria-label="${title}"]')`);}catch{return false;}},'locale reload '+language);
    await shell.evaluate(`window.dispatchEvent(new CustomEvent('open-sidebar-tab',{detail:'web'}))`);await until(()=>shell.evaluate('document.querySelector("#web-profile-select")?.options.length>=3'),'saved profile selector');
    assert.equal(await shell.evaluate('document.querySelector("[data-web-browser-root]").getAttribute("aria-label")'),title);
    await select('web-profile-select',profile.id);assert.equal(await shell.evaluate('document.querySelector("#web-address").value'),targetUrl);
    await click('button[aria-controls="web-proxy-settings"]');await shell.screenshot(path.join(directory,`web-settings-${language}.png`));
    assert.equal((await invoke('web_browser_get_settings')).profiles.length,2);
    assert.deepEqual(await invoke('web_browser_get_history'),retainedHistory);
    await select('web-profile-select',sshProfile.id);await shell.screenshot(path.join(directory,`web-ssh-${language}.png`));
    await select('web-profile-select',profile.id);
  }
  report.cases.push('named HTTP/SSH profiles and en/vi/ko controls survive trusted frontend reloads');
  await click('[data-web-profile-delete]');await until(async()=>(await invoke('web_browser_get_settings')).profiles.length===1,'delete saved profile');
  assert.equal((await invoke('web_browser_get_config')).hop.kind,'ssh');
  report.cases.push('saved profiles can be deleted without silently switching the current connection to Direct');
  await runChainMiniCases({shell,invoke,report,track,directory,routeServers,originPort,targetUrl,openNative,openUI,attach,contentMatches,click,setInput,select,currentSession,currentTab,snapshot,bounds,capture});
  report.exceptions=shell.exceptions;assert.equal(shell.exceptions.length,0,JSON.stringify(shell.exceptions));report.result='passed';
} catch(error) {
  report.result='failed';report.error=error.stack;process.exitCode=1;
  if(shell){try{await shell.screenshot(path.join(directory,'failure-shell.png'));report.shellDiagnostic=await shell.evaluate('document.querySelector("[data-web-browser-root]")?.innerText');}catch{}}
  if(content){try{report.contentDiagnostic=await content.evaluate('({url:location.href,title:document.title,fixture:window.fixture,body:document.body?.textContent.slice(0,1000)})');}catch{}}
} finally {
  for(const connection of connections)connection.close();if(shell)shell.close();
  if(processHandle?.pid){const result=spawnSync('taskkill.exe',['/PID',String(processHandle.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});if(result.status!==0)processHandle.kill();}
  ssh?.close();for(const socket of sockets)socket.destroy();for(const server of routeServers)server.close();proxy.closeAllConnections();origin.closeAllConnections();proxy.close();origin.close();
  await fs.writeFile(path.join(directory,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({result:report.result,directory,cases:report.cases,error:report.error},null,2));
}
