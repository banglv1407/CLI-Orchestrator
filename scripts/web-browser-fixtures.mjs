import fs from 'node:fs/promises';
import net from 'node:net';
import http from 'node:http';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { until } from './browser-session.mjs';

// All destination names are mapped explicitly to the local fixture server.
export async function socksFixture(kind, authenticated, originPort, report, track, destinations = {}) {
  const isFixture = host => ['clx-web-fixture.test', 'assets.clx-web-fixture.test', '127.0.0.1'].includes(host);
  const server = net.createServer(socket => {
    track(socket); let buffered=Buffer.alloc(0), stage='greeting', upstream;
    socket.on('error',()=>upstream?.destroy());
    const consume=count=>{ const bytes=buffered.subarray(0,count); buffered=buffered.subarray(count); return bytes; };
    const data=chunk=>{
      buffered=Buffer.concat([buffered,chunk]);
      if (kind==='socks5') {
        if(stage==='greeting') {
          if(buffered.length<2 || buffered.length<2+buffered[1]) return;
          const greeting=consume(2+buffered[1]), method=authenticated?2:0;
          if(greeting[0]!==5 || !greeting.subarray(2).includes(method)) {socket.end(Buffer.from([5,255]));return;}
          socket.write(Buffer.from([5,method]));stage=authenticated?'auth':'request';
        }
        if(stage==='auth') {
          if(buffered.length<2 || buffered.length<3+buffered[1] || buffered.length<3+buffered[1]+buffered[2+buffered[1]]) return;
          const userLength=buffered[1], secretLength=buffered[2+userLength], bytes=consume(3+userLength+secretLength);
          const ok=bytes.subarray(2,2+userLength).toString()==='fixture' && bytes.subarray(3+userLength).toString()==='fixture-password';
          socket.write(Buffer.from([1,ok?0:1])); if(!ok){socket.end();return;} stage='request';
        }
      } else stage='request';
      if(stage!=='request') return;
      let host,port,size;
      if(kind==='socks4') {
        if(buffered.length<9) return; const endUser=buffered.indexOf(0,8);if(endUser<0)return;
        port=buffered.readUInt16BE(2);size=endUser+1;
        if(buffered[4]===0 && buffered[5]===0 && buffered[6]===0 && buffered[7]!==0) {
          const endHost=buffered.indexOf(0,size);if(endHost<0)return;host=buffered.subarray(size,endHost).toString();size=endHost+1;
        } else host=Array.from(buffered.subarray(4,8)).join('.');
      } else {
        if(buffered.length<5) return;
        const address=buffered[3];size=address===3?7+buffered[4]:address===1?10:22;
        if(buffered.length<size)return;
        host=address===3?buffered.subarray(5,5+buffered[4]).toString():address===1?Array.from(buffered.subarray(4,8)).join('.'):'::1';port=buffered.readUInt16BE(size-2);
      }
      consume(size);stage='forward';socket.off('data',data);
      report.socksRequests.push({kind,authenticated,host,port});
      const destination=destinations[`${host}:${port}`] ?? (isFixture(host) && port===originPort ? originPort : null);
      if(!destination) {socket.destroy();return;}
      upstream=net.connect(destination,'127.0.0.1',()=>{
        socket.write(Buffer.from(kind==='socks4'?[0,90,0,0,127,0,0,1]:[5,0,0,1,127,0,0,1,0,1]));
        if(buffered.length)upstream.write(buffered);socket.pipe(upstream);upstream.pipe(socket);
      });
      track(upstream);upstream.on('error',()=>socket.destroy());socket.on('close',()=>upstream.destroy());
    };
    socket.on('data',data);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  return {server,port:server.address().port};
}

export async function sshFixture(directory, originPort, destinations = {}) {
  const binary=path.resolve('src-tauri/target/debug/examples/web-browser-route-fixture.exe');
  await fs.access(binary);
  const child=spawn(binary,[path.join(directory,'ssh'),String(originPort),JSON.stringify(destinations)],{windowsHide:true,stdio:['ignore','pipe','pipe']});
  let output='',error='';child.stdout.on('data',bytes=>output+=bytes);child.stderr.on('data',bytes=>error+=bytes);
  try {
    await until(()=>{if(child.exitCode!==null)throw new Error('SSH fixture exited: '+error);return output.includes('\n');},'SSH fixture startup');
    return {...JSON.parse(output.split('\n')[0]),close:()=>{const result=spawnSync('taskkill.exe',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});if(result.status!==0)child.kill();}};
  } catch(error) {child.kill();throw error;}
}

export async function tunnelProxyFixture(name, destinations, report, track, credentials) {
  const authorized = request => !credentials || request.headers['proxy-authorization'] === 'Basic '+Buffer.from(`${credentials.username}:${credentials.secret}`).toString('base64');
  const resolve = request => {
    let target; try {target=new URL(request.method==='CONNECT'?'http://'+request.url:request.url);}catch{return null;}
    report.chainRequests ??= []; report.chainRequests.push({proxy:name,method:request.method,host:target.hostname,port:Number(target.port||80)});
    const port=destinations[`${target.hostname}:${target.port||80}`];return port?{target,port}:null;
  };
  const proxy=http.createServer((request,response)=>{
    if(!authorized(request)){response.writeHead(407).end();return;}
    const destination=resolve(request);if(!destination){response.writeHead(502).end();return;}
    const headers={...request.headers};delete headers['proxy-authorization'];delete headers['proxy-connection'];
    const upstream=http.request({host:'127.0.0.1',port:destination.port,method:request.method,path:destination.target.pathname+destination.target.search,headers},remote=>{response.writeHead(remote.statusCode,remote.headers);remote.pipe(response);});
    upstream.on('error',()=>{if(!response.headersSent)response.writeHead(502);response.end();});request.pipe(upstream);
  });
  proxy.on('connection',track);
  for(const event of ['connect','upgrade']) proxy.on(event,(request,socket,head)=>{
    if(!authorized(request)){socket.end('HTTP/1.1 407 Proxy Authentication Required\r\nContent-Length: 0\r\n\r\n');return;}
    const destination=resolve(request);if(!destination){socket.end('HTTP/1.1 502 Bad Gateway\r\nContent-Length: 0\r\n\r\n');return;}
    const upstream=net.connect(destination.port,'127.0.0.1',()=>{
      if(event==='connect')socket.write('HTTP/1.1 200 Connection established\r\n\r\n');
      else {const headers=Object.entries(request.headers).filter(([key])=>!key.startsWith('proxy-')).map(([key,value])=>`${key}: ${value}`).join('\r\n');upstream.write(`${request.method} ${destination.target.pathname}${destination.target.search} HTTP/1.1\r\n${headers}\r\n\r\n`);}
      if(head.length)upstream.write(head);socket.pipe(upstream);upstream.pipe(socket);
    });
    track(upstream);upstream.on('error',()=>socket.destroy());socket.on('error',()=>upstream.destroy());socket.on('close',()=>upstream.destroy());
  });
  await new Promise(resolve=>proxy.listen(0,'127.0.0.1',resolve));return {server:proxy,port:proxy.address().port};
}
