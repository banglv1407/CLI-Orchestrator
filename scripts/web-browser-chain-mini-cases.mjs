import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { socksFixture, sshFixture, tunnelProxyFixture } from './web-browser-fixtures.mjs';
import { pause, until } from './browser-session.mjs';

export async function runChainMiniCases(ctx) {
  const { shell, invoke, report, track, directory, routeServers, originPort, targetUrl, openNative, openUI, attach, contentMatches, click, setInput, select, currentSession, currentTab, snapshot, bounds, capture } = ctx;
  const hop=(kind,host,port,extra={})=>({kind,host,port,username:'',secret:'',authMode:'password',keyPath:'',hostKey:'',...extra});
  const auth={username:'fixture',secret:'fixture-password'}, firstAuth={username:'first',secret:'first-hop-password'};
  const sites=Object.fromEntries(['clx-web-fixture.test','assets.clx-web-fixture.test','127.0.0.1'].map(host=>[`${host}:${originPort}`,originPort]));
  const last=await tunnelProxyFixture('chain-last',sites,report,track,auth);routeServers.push(last.server);
  const middle=await socksFixture('socks5',true,originPort,report,track,{'last-proxy.invalid:9090':last.port});routeServers.push(middle.server);
  const first=await tunnelProxyFixture('chain-first',{'bridge-proxy.invalid:1080':middle.port},report,track,firstAuth);routeServers.push(first.server);
  await click('[data-web-new-tab]');
  if(!await shell.evaluate('!!document.querySelector("#web-proxy-settings")'))await click('button[aria-controls="web-proxy-settings"]');
  await until(()=>shell.evaluate('!!document.querySelector("#web-hop-kind")'),'chain editor visible');
  await select('web-hop-kind','http');await setInput('web-hop-host','127.0.0.1');await setInput('web-hop-port',String(first.port));await setInput('web-hop-username',firstAuth.username);await setInput('web-hop-secret',firstAuth.secret);
  await click('[data-web-chain-add]');await select('web-hop-1-kind','socks5');await setInput('web-hop-1-host','bridge-proxy.invalid');await setInput('web-hop-1-port','1080');await setInput('web-hop-1-username',auth.username);await setInput('web-hop-1-secret',auth.secret);
  await click('[data-web-chain-add]');await setInput('web-hop-2-host','last-proxy.invalid');await setInput('web-hop-2-port','9090');await setInput('web-hop-2-username',auth.username);await setInput('web-hop-2-secret',auth.secret);
  await click('[data-web-hop-up="2"]');await click('[data-web-hop-down="1"]');
  await setInput('web-profile-name','Ordered route');await setInput('web-address',targetUrl);const before=report.originRequests.length;await click('[data-web-profile-save]');
  await until(async()=>(await invoke('web_browser_get_settings')).profiles.some(profile=>profile.name==='Ordered route'),'saved ordered profile');assert.equal(report.originRequests.length,before);
  const saved=(await invoke('web_browser_get_settings')).profiles.find(profile=>profile.name==='Ordered route');assert.deepEqual(saved.config.hops.map(hop=>hop.kind),['http','socks5','http']);
  const raw=await fs.readFile(path.join(directory,'browser-data','web-browser.json'),'utf8');assert(!raw.includes(firstAuth.secret));assert(!raw.includes(auth.secret));assert(raw.includes('dpapi:v1:'));
  const chainId=await openUI(targetUrl),chainTab=await currentTab();await attach(chainId,targetUrl);
  await contentMatches('window.fixture?.api?.ok && window.fixture.websocket==="websocket-ok" && document.querySelector("#image")?.naturalWidth===72 && document.readyState==="complete"','three ordered proxy stages');
  assert.equal((await snapshot(chainId)).error,null);
  assert(report.chainRequests.some(request=>request.proxy==='chain-first'&&request.method==='CONNECT'&&request.host==='bridge-proxy.invalid'));
  assert(report.socksRequests.some(request=>request.kind==='socks5'&&request.host==='last-proxy.invalid'));
  assert(report.chainRequests.some(request=>request.proxy==='chain-last'&&request.host==='assets.clx-web-fixture.test'));
  report.cases.push('the chain editor saves/reorders and opens authenticated HTTP -> SOCKS5 -> HTTP with remote-only next-hop names and encrypted credentials');

  const bad=structuredClone(saved.config);bad.routeId=randomUUID();bad.hops[1].secret='wrong-password';bad.url=`http://127.0.0.1:${originPort}/chain-must-not-bypass`;
  const badId=await openNative(bad);await until(async()=>(await snapshot(badId))?.error,'middle hop rejection');assert(!report.originRequests.some(request=>request.path==='/chain-must-not-bypass'));await invoke('web_browser_close',{sessionId:badId});
  report.cases.push('a middle SOCKS authentication failure stops the chain without skipping hops or falling back to direct loopback');

  const firstHttp=await tunnelProxyFixture('http-before-http',{'last-proxy.invalid:9090':last.port},report,track,firstAuth);routeServers.push(firstHttp.server);
  const httpId=await openNative({url:targetUrl,hops:[hop('http','127.0.0.1',firstHttp.port,firstAuth),hop('http','last-proxy.invalid',9090,auth)]});await attach(httpId,targetUrl);await contentMatches('window.fixture?.api?.ok && window.fixture.websocket==="websocket-ok"','HTTP -> HTTP');await invoke('web_browser_close',{sessionId:httpId});
  report.cases.push('two authenticated HTTP proxies tunnel in order and preserve full-page resources and WebSocket');

  const socks4=await socksFixture('socks4',false,originPort,report,track);routeServers.push(socks4.server);
  const beforeSocks4=await tunnelProxyFixture('before-socks4',{'socks4-proxy.invalid:1080':socks4.port},report,track);routeServers.push(beforeSocks4.server);
  const socks4Id=await openNative({url:targetUrl,hops:[hop('http','127.0.0.1',beforeSocks4.port),hop('socks4','socks4-proxy.invalid',1080)]});await attach(socks4Id,targetUrl);await contentMatches('window.fixture?.api?.ok && window.fixture.websocket==="websocket-ok"','HTTP -> SOCKS4a');await invoke('web_browser_close',{sessionId:socks4Id});
  report.cases.push('HTTP -> SOCKS4a resolves the next proxy and website remotely');

  const inner=await sshFixture(path.join(directory,'ssh-inner'),originPort);routeServers.push(inner);
  const between=await tunnelProxyFixture('between-ssh',{'inner-ssh.invalid:22':inner.port},report,track,auth);routeServers.push(between.server);
  const outer=await sshFixture(path.join(directory,'ssh-outer'),originPort,{'middle-http.invalid:9090':between.port});routeServers.push(outer);
  const prefix=[hop('ssh','127.0.0.1',outer.port,{...auth,hostKey:outer.fingerprint}),hop('http','middle-http.invalid',9090,auth)];
  const fingerprint=await invoke('web_browser_probe_fingerprint',{config:{url:'',hops:prefix},host:'inner-ssh.invalid',port:22});assert.equal(fingerprint,inner.fingerprint);
  const sshConfig={url:targetUrl,hops:[...prefix,hop('ssh','inner-ssh.invalid',22,{username:'fixture',authMode:'key',keyPath:inner.encryptedKeyPath,secret:'fixture-passphrase',hostKey:fingerprint})]};
  const sshId=await openNative(sshConfig);await attach(sshId,targetUrl);await contentMatches('window.fixture?.api?.ok && window.fixture.websocket==="websocket-ok" && document.querySelector("#image")?.naturalWidth===72','nested SSH through HTTP');await invoke('web_browser_close',{sessionId:sshId});
  const wrongPin=structuredClone(sshConfig);wrongPin.routeId=randomUUID();wrongPin.hops[2].hostKey='SHA256:'+'A'.repeat(43);await assert.rejects(openNative(wrongPin));
  assert(report.chainRequests.some(request=>request.proxy==='between-ssh'&&request.host==='inner-ssh.invalid'));
  report.cases.push('SSH -> authenticated HTTP -> encrypted-key SSH works, probes downstream fingerprints through the prefix and rejects an inner pin mismatch');

  await invoke('web_browser_set_viewport',{sessionId:chainId,bounds:await bounds(),visible:true});await attach(chainId,targetUrl);
  const choice=async(selector,value)=>shell.evaluate(`(()=>{const node=document.querySelector(${JSON.stringify(selector)});node.value=${JSON.stringify(value)};node.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await choice('[data-web-mini-placement]','both');
  await until(()=>shell.evaluate('document.querySelectorAll("[data-mini-web-panel]").length===2'),'separate right and bottom mini web');
  await until(()=>shell.evaluate(`Array.from(document.querySelectorAll('[data-mini-web-card="${chainTab}"] img')).length===2 && Array.from(document.querySelectorAll('[data-mini-web-card="${chainTab}"] img')).every(image=>image.naturalWidth>0)`),'native web preview images',15000);
  const preview=await invoke('web_browser_preview',{sessionId:chainId});assert.match(preview,/^data:image\/png;base64,/);
  await fs.writeFile(path.join(directory,'native-mini-site-preview.png'),Buffer.from(preview.split(',')[1],'base64'));
  report.cases.push('mini web has separate right/bottom areas with real native-page preview images and shared tab state');
  await click('[data-mini-web-panel="right"] button[aria-label="New web tab"]');const secondId=await openUI(targetUrl+'second'),secondTab=await currentTab();await attach(secondId,targetUrl+'second');await contentMatches('document.querySelector("#destination")?.textContent==="/second"','new tab from mini panel');
  const count=await shell.evaluate('document.querySelectorAll("[data-mini-web-panel=right] [data-mini-web-tab]").length');
  await shell.evaluate(`window.dispatchEvent(new CustomEvent('open-sidebar-tab',{detail:'terminal'}))`);
  await until(async()=>!(await snapshot(secondId)).visible,'hide browser on empty terminal');
  assert.equal(await shell.evaluate('document.querySelectorAll("[data-mini-web-panel=right] [data-mini-web-tab]").length'),count);
  await click(`[data-mini-web-panel="right"] [data-mini-web-tab="${chainTab}"]`);await until(async()=>(await snapshot(chainId)).visible,'activate original tab from mini list');
  assert.equal((await snapshot(secondId)).visible,false);
  report.cases.push('mini cards create/select existing tabs and preserve all web tabs through an empty terminal workspace');

  const known=new Set((await invoke('list_sessions')).map(session=>session.id)),created=[];
  try {
    for(let index=0;index<2;index++) {
      await shell.evaluate("window.dispatchEvent(new Event('create-quick-terminal'))");
      await until(async()=>{const sessions=await invoke('list_sessions');for(const session of sessions)if(!known.has(session.id)&&!created.includes(session.id))created.push(session.id);return created.length===index+1;},'local terminal alongside mini web');
    }
    await invoke('send_cli_input',{request:{sessionId:created[0],input:'echo CLX_MINI_WEB_PTY_MARKER\r'}});
    await until(()=>shell.evaluate('Array.from(document.querySelectorAll(".xterm-rows > div")).some(node=>node.textContent.trim()==="CLX_MINI_WEB_PTY_MARKER")'),'retained PTY output');
    await shell.evaluate(`document.querySelector('[data-mini-terminal-session="${created[0]}"]').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:800,clientY:400}))`);
    await click('[data-mini-context-action="move-panel"]');await until(()=>shell.evaluate('!!document.querySelector("[data-mini-terminal-panel=bottom]")'),'bottom mini terminal');
    await shell.evaluate(`document.querySelector('button[title="Show Right Panel"]')?.click()`);
    await until(()=>shell.evaluate('document.querySelector("[data-mini-terminal-panel=right]")?.getBoundingClientRect().width>0'),'right mini terminal expanded');
    await click(`[data-mini-web-panel="bottom"] [data-mini-web-tab="${chainTab}"]`);await until(async()=>(await snapshot(chainId)).visible,'web alongside both PTY areas');
    const separate=await shell.evaluate('(()=>{const r=selector=>document.querySelector(selector).getBoundingClientRect();return {right:r("[data-mini-terminal-panel=right]").right<=r("[data-mini-web-panel=right]").left+2,bottom:r("[data-mini-terminal-panel=bottom]").bottom<=r("[data-mini-web-panel=bottom]").top+2};})()');assert.deepEqual(separate,{right:true,bottom:true});
    await click(`[data-mini-web-panel="bottom"] [data-mini-web-close="${secondTab}"]`);await until(async()=>(await snapshot(secondId))===null,'close exactly one web tab');
    assert.equal(await shell.evaluate(`document.querySelectorAll('[data-mini-web-tab="${secondTab}"]').length`),0);assert((await snapshot(chainId)).visible);
    const running=await invoke('list_sessions');assert(created.every(id=>running.some(session=>session.id===id)));
    assert(await shell.evaluate('Array.from(document.querySelectorAll(".xterm-rows > div")).some(node=>node.textContent.trim()==="CLX_MINI_WEB_PTY_MARKER")'));
    assert.equal(await shell.evaluate('!!document.querySelector("[data-terminal-broadcast]")'),false);
    await capture('native-web-mini-and-terminal-panels.png');
    report.cases.push('right columns and bottom rows separate web from live mini terminals; closing a web tab preserves both real PTYs and their buffers');
    await choice('[data-mini-web-panel=right] [data-web-mini-display]','title-only');assert.equal(await shell.evaluate('document.querySelectorAll("[data-web-mini-preview]").length'),0);
    await choice('[data-mini-web-panel=right] [data-web-mini-display]','preview');await click('[data-web-mini-hide=right]');
    await until(()=>shell.evaluate('!document.querySelector("[data-mini-web-panel=right]") && !!document.querySelector("[data-mini-web-panel=bottom]")'),'independent web panel hide');
    assert(await shell.evaluate('document.querySelector("[data-mini-terminal-panel=right]").getBoundingClientRect().width>0'));
    await choice('[data-web-mini-placement]','both');
    report.cases.push('mini-web title/preview mode and per-area hiding are independent of terminal panel state');
  } finally {for(const id of created)await invoke('stop_cli',{request:{sessionId:id}}).catch(()=>undefined);}

  for(const [language,label] of [['vi','Mini web: cả hai'],['ko','미니 웹: 양쪽'],['en','Mini web: both']]) {
    await shell.evaluate(`localStorage.setItem('clx-ui-language',${JSON.stringify(language)});location.reload()`).catch(()=>undefined);
    await until(async()=>{try{return await shell.evaluate(`document.documentElement.lang===${JSON.stringify(language)} && !!document.querySelector('#root')?.textContent.length`);}catch{return false;}},'mini web locale '+language);
    await shell.evaluate(`window.dispatchEvent(new CustomEvent('open-sidebar-tab',{detail:'web'}))`);
    await until(()=>shell.evaluate('document.querySelector("[data-web-mini-placement]")?.value==="both" && document.querySelectorAll("[data-mini-web-panel]").length===2'),'persisted mini web choice');
    assert(await shell.evaluate(`document.querySelector('[data-web-mini-placement]').textContent.includes(${JSON.stringify(label)})`));
    await click('button[aria-controls="web-proxy-settings"]');await until(()=>shell.evaluate('document.querySelectorAll("[data-web-chain-hop]").length===3'),'restored ordered chain');
    await shell.screenshot(path.join(directory,`web-chain-mini-${language}.png`));
  }
  report.cases.push('ordered profiles and mini-web placement/display persist across English, Vietnamese and Korean frontend restarts');
}
