import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

const bundled = await build({ entryPoints: ['src/lib/terminalBroadcast.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { selectMiniTerminals, terminalInputTargets, buildTerminalPasteInput, TerminalInputAddon } = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`
);

test('plain selection replaces a group; first modifier selection includes the active session', () => {
  assert.deepEqual(selectMiniTerminals(['a', 'b'], 'c', false, 'a'), ['c']);
  assert.deepEqual(selectMiniTerminals([], 'b', true, 'a'), ['a', 'b']);
  assert.deepEqual(selectMiniTerminals([], 'b', true, null), ['b']);
});

test('modifier toggles remove recipients and never duplicate a session', () => {
  assert.deepEqual(selectMiniTerminals(['a', 'b'], 'b', true, 'a'), ['a']);
  assert.deepEqual(selectMiniTerminals(['a', 'b'], 'a', true, 'a'), ['b']);
  assert.deepEqual(selectMiniTerminals(['a'], 'a', true, 'a'), []);
  assert.deepEqual(selectMiniTerminals(['a', 'a'], 'b', true, 'a'), ['a', 'b']);
});

test('broadcast preserves Unicode, whitespace, and literal text while normalizing pasted newlines', () => {
  const text = '  Tiếng Việt 한국어 漢字\r\nline 2\nlast\r  ';
  assert.equal(buildTerminalPasteInput(text, false), '  Tiếng Việt 한국어 漢字\rline 2\rlast\r  ');
  assert.equal(buildTerminalPasteInput('$(literal) `text`', false), '$(literal) `text`');
});

test('each terminal receives its own paste protocol without an unsolicited submit key', () => {
  assert.equal(buildTerminalPasteInput('a\nb', true), '\x1b[200~a\rb\x1b[201~');
  assert.equal(buildTerminalPasteInput('a\nb', false), 'a\rb');
});

test('recipients exclude exited sessions and keep unselected sources local', () => {
  const running = new Set(['a', 'b', 'c']);
  assert.deepEqual(terminalInputTargets('a', ['a', 'b', 'b', 'stopped'], running), ['a', 'b']);
  assert.deepEqual(terminalInputTargets('c', ['a', 'b'], running), ['c']);
  assert.deepEqual(terminalInputTargets('a', ['a', 'stopped'], running), ['a']);
  assert.deepEqual(terminalInputTargets('stopped', ['a', 'b', 'stopped'], running), []);
});

test('input observer distinguishes each user input from protocol responses and disposes both listeners', () => {
  const subscriptions = new Map();
  const subscribe = name => callback => { subscriptions.set(name, callback); return { dispose: () => subscriptions.delete(name) }; };
  const received = [];
  const addon = new TerminalInputAddon((data, userInput) => received.push({ data, userInput }));
  addon.activate({ _core: { coreService: { onUserInput: subscribe('user') } }, onData: subscribe('data') });
  subscriptions.get('data')('\x1b[1;1R');
  subscriptions.get('user')();
  subscriptions.get('data')('Tiếng Việt');
  subscriptions.get('data')('\x1b[?1;2c');
  subscriptions.get('user')();
  subscriptions.get('data')('\r');
  subscriptions.get('user')();
  subscriptions.get('data')('\x1b[<0;20;10M');
  assert.deepEqual(received, [
    { data: '\x1b[1;1R', userInput: false }, { data: 'Tiếng Việt', userInput: true },
    { data: '\x1b[?1;2c', userInput: false }, { data: '\r', userInput: true },
    { data: '\x1b[<0;20;10M', userInput: false },
  ]);
  addon.dispose();
  addon.dispose();
  assert.equal(subscriptions.size, 0);
});
