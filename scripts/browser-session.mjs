import fs from 'node:fs/promises';

export const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function until(read, description, timeout = 25000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await read()) return;
    await pause(100);
  }
  throw new Error('Timed out: ' + description);
}

export async function connectBrowser(port, { enablePage = true, targetId } = {}) {
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find(target => target.type === 'page' && (!targetId || target.id === targetId));
  if (!target) throw new Error('No browser page on port ' + port);
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject) => { socket.addEventListener('open',resolve,{once:true}); socket.addEventListener('error',reject,{once:true}); });
  const pending = new Map();
  const exceptions = [];
  let nextId = 0;
  socket.addEventListener('message',event => {
    const response = JSON.parse(event.data);
    if (response.id) {
      const request = pending.get(response.id);
      if (!request) return;
      pending.delete(response.id);
      clearTimeout(request.timeout);
      if (response.error) request.reject(new Error(JSON.stringify(response.error))); else request.resolve(response.result);
    } else if (response.method === 'Runtime.exceptionThrown') exceptions.push(response.params.exceptionDetails.exception?.description ?? response.params.exceptionDetails.text);
  });
  const call = (method,params={}) => new Promise((resolve,reject) => {
    const id = ++nextId;
    const timeout = setTimeout(()=>{pending.delete(id);reject(new Error('DevTools timeout: '+method));},20000);
    pending.set(id,{resolve,reject,timeout});
    socket.send(JSON.stringify({id,method,params}));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  };
  if (enablePage) await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setFocusEmulationEnabled',{enabled:true});
  const key = async (name, code, virtualKey, modifiers=0, repeat=false) => {
    const params = { key:name,code,windowsVirtualKeyCode:virtualKey,nativeVirtualKeyCode:virtualKey,modifiers };
    await call('Input.dispatchKeyEvent',{type:'keyDown',...params});
    if (repeat) await call('Input.dispatchKeyEvent',{type:'keyDown',...params,autoRepeat:true});
    await call('Input.dispatchKeyEvent',{type:'keyUp',...params});
    await pause(80);
  };
  return {
    call,evaluate,key,exceptions,
    screenshot: async file => fs.writeFile(file,Buffer.from((await call('Page.captureScreenshot')).data,'base64')),
    close: () => socket.close(),
  };
}
