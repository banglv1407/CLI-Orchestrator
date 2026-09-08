import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRecents, recordRecent, loadRecents } from '../src/lib/terminal-recents.ts';

test('persisted history validates, orders and deduplicates CLI-folder pairs', () => {
  assert.deepEqual(parseRecents('{broken'), []);
  assert.deepEqual(parseRecents('{}'), []);
  const items = [
    { cliName: 'codex', workingDir: 'D:/one', lastUsed: 1 },
    { cliName: 'codex', workingDir: 'D:/two', lastUsed: 2 },
    { cliName: 'codex', workingDir: 'D:/one', lastUsed: 3 },
    { cliName: 'other', workingDir: 'D:/one', lastUsed: 4 },
    { cliName: 'bad', workingDir: null, lastUsed: 100 },
  ];
  assert.deepEqual(parseRecents(JSON.stringify(items)).map(x => [x.cliName, x.workingDir, x.lastUsed]),
    [['other', 'D:/one', 4], ['codex', 'D:/one', 3], ['codex', 'D:/two', 2]]);
});

test('launch history survives reload, moves reused pair first, caps at 50 and tolerates unavailable storage', () => {
  const values = new Map();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  } });
  globalThis.window = new EventTarget();
  for (let i = 0; i < 60; i++) recordRecent('codex', 'D:/' + i);
  assert.equal(loadRecents().length, 50);
  recordRecent('codex', 'D:/20');
  assert.equal(loadRecents()[0].workingDir, 'D:/20');
  assert.equal(loadRecents().length, 50);
  assert.deepEqual(parseRecents([...values.values()][0]), loadRecents());
  recordRecent('other', 'D:/20');
  assert.equal(loadRecents()[0].cliName, 'other');
  assert.equal(loadRecents()[1].cliName, 'codex');
  localStorage.setItem = () => { throw new Error('quota'); };
  assert.doesNotThrow(() => recordRecent('codex', 'D:/new'));
});
