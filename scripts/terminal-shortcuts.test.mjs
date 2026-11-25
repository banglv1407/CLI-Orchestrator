import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

const bundle = await build({ entryPoints: ['src/lib/terminalShortcuts.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const {
  isNewTerminalShortcut,
  getCycleTerminalStep,
  cycleTerminalSessionId,
  installNewTerminalShortcut,
} = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const key = values => ({ ctrlKey:true, metaKey:false, altKey:false, shiftKey:false, code:'Backquote', key:'`', isComposing:false, ...values });

test('Ctrl+Backquote follows the physical key across layouts with a literal fallback', () => {
  for (const values of [{}, {key:'Dead'}, {key:'§'}, {code:'',key:'`'}, {code:'Unidentified',key:'`'}]) assert.equal(isNewTerminalShortcut(key(values)),true);
});

test('other shortcuts, extra modifiers, old binding and composition remain independent', () => {
  for (const values of [{ctrlKey:false}, {metaKey:true}, {altKey:true}, {shiftKey:true}, {code:'KeyN',key:'N',shiftKey:true}, {code:'KeyP',key:'p'}, {code:'Quote',key:'`'}, {isComposing:true}]) assert.equal(isNewTerminalShortcut(key(values)),false);
});

test('capture consumes both phases, launches once per press, suppresses repeat and cleans up', () => {
  const listeners = new Map();
  const removed = [];
  const target = {
    addEventListener(type, listener, capture) { assert.equal(capture,true); listeners.set(type,listener); },
    removeEventListener(type, listener, capture) { assert.equal(capture,true); assert.equal(listeners.get(type),listener); removed.push(type); listeners.delete(type); },
  };
  let count = 0;
  const cleanup = installNewTerminalShortcut(target,()=>{count++});
  let prevented = 0, stopped = 0;
  const dispatch = (type, values={}) => listeners.get(type)(key({type,repeat:false,preventDefault(){prevented++},stopImmediatePropagation(){stopped++},...values}));
  dispatch('keydown');
  dispatch('keydown',{repeat:true});
  dispatch('keyup');
  assert.equal(count,1);
  assert.equal(prevented,3);
  assert.equal(stopped,3);
  dispatch('keydown',{code:'KeyN',key:'N',shiftKey:true});
  assert.equal(count,1);
  dispatch('keydown');
  assert.equal(count,2,'a second intentional press is not throttled');
  cleanup();
  assert.deepEqual(removed,['keydown','keyup']);
  assert.equal(listeners.size,0);
});

test('Ctrl+Tab cycles forward with wrap-around to first terminal and Ctrl+Shift+Tab cycles backward', () => {
  assert.equal(getCycleTerminalStep(key({ code: 'Tab', key: 'Tab' })), 1);
  assert.equal(getCycleTerminalStep(key({ code: 'Tab', key: 'Tab', shiftKey: true })), -1);
  assert.equal(getCycleTerminalStep(key({ code: '', key: 'Tab' })), 1);
  for (const invalid of [{ ctrlKey: false }, { altKey: true }, { metaKey: true }, { isComposing: true }, { code: 'Backquote', key: '`' }]) {
    assert.equal(getCycleTerminalStep(key({ code: 'Tab', key: 'Tab', ...invalid })), 0);
  }

  const ids = ['term-1', 'term-2', 'term-3'];
  assert.equal(cycleTerminalSessionId(ids, 'term-1', 1), 'term-2');
  assert.equal(cycleTerminalSessionId(ids, 'term-2', 1), 'term-3');
  assert.equal(cycleTerminalSessionId(ids, 'term-3', 1), 'term-1', 'wraps back to beginning at the end');
  assert.equal(cycleTerminalSessionId(ids, 'term-1', -1), 'term-3');
  assert.equal(cycleTerminalSessionId(ids, null, 1), 'term-1');
  assert.equal(cycleTerminalSessionId([], 'term-1', 1), null);

  const listeners = new Map();
  const target = {
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type) { listeners.delete(type); },
  };
  const steps = [];
  const cleanup = installNewTerminalShortcut(target, () => {}, (step) => steps.push(step));
  let prevented = 0, stopped = 0;
  const dispatch = (type, values = {}) => listeners.get(type)(key({
    type, code: 'Tab', key: 'Tab', repeat: false,
    preventDefault() { prevented++; },
    stopImmediatePropagation() { stopped++; },
    ...values,
  }));
  dispatch('keydown');
  dispatch('keydown', { repeat: true });
  dispatch('keyup');
  dispatch('keydown', { shiftKey: true });
  assert.deepEqual(steps, [1, -1]);
  assert.equal(prevented, 4);
  assert.equal(stopped, 4);
  cleanup();
});
