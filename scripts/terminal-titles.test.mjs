import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { build } from 'esbuild';
import ts from 'typescript';

const bundled = await build({
  entryPoints: ['src/lib/terminalTitles.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { getMiniTerminalTitle } = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`
);
const session = (values = {}) => ({ id: 'pty-one', cliName: 'HM', status: 'running', ...values });
const current = (values = {}) => ({
  sessionId: 'pty-one', agent: 'hermes', agentSessionId: 'current-id', title: 'Current conversation', ...values,
});

test('Hermes resume and aliases ignore launch commands containing technical IDs', () => {
  const launchTitle = 'cmd.exe /K hermes --resume 20261011_123456_abcdef';
  assert.equal(getMiniTerminalTitle(session({ title: 'Saved conversation' }), launchTitle), 'Saved conversation');
  assert.equal(getMiniTerminalTitle(session({ cliName: 'Custom alias', agent: 'hermes', title: 'Saved conversation' }), launchTitle), 'Saved conversation');
  assert.equal(getMiniTerminalTitle(session(), launchTitle, current()), 'Current conversation');
});

test('fresh Hermes and Hermes launched inside a shell use live names', () => {
  assert.equal(getMiniTerminalTitle(session({ cliName: 'hermes' }), 'python.exe', current()), 'Current conversation');
  assert.equal(getMiniTerminalTitle(session({ cliName: 'PowerShell' }), 'PowerShell', current()), 'Current conversation');
  assert.equal(getMiniTerminalTitle(session(), 'old terminal title', current({ title: '  Đổi tên 👩‍💻  ' })), 'Đổi tên 👩‍💻');
});

test('concurrent PTYs in the same folder keep independent titles and session switches', () => {
  const first = session({ workingDir: 'D:\\shared', title: 'Saved first' });
  const second = session({ id: 'pty-two', workingDir: 'D:\\shared' });
  const titles = {
    'pty-one': current({ title: 'First conversation' }),
    'pty-two': current({ sessionId: 'pty-two', agentSessionId: 'other-id', title: 'Second conversation' }),
  };
  assert.equal(getMiniTerminalTitle(first, 'cmd.exe', titles[first.id]), 'First conversation');
  assert.equal(getMiniTerminalTitle(second, 'cmd.exe', titles[second.id]), 'Second conversation');
  titles[first.id] = current({ agentSessionId: 'switched-id', title: 'Switched conversation' });
  assert.equal(getMiniTerminalTitle(first, 'cmd.exe', titles[first.id]), 'Switched conversation');
  assert.equal(getMiniTerminalTitle(second, 'cmd.exe', titles[second.id]), 'Second conversation');
});

test('an untitled current conversation cannot inherit the initial resume name or its ID', () => {
  const resumed = session({ title: 'Original name', workingDir: 'D:\\shared' });
  for (const title of [null, '', '   ']) {
    assert.equal(getMiniTerminalTitle(resumed, 'hermes --resume original-id', current({ title })), 'HM — D:\\shared');
  }
  assert.equal(getMiniTerminalTitle(session(), 'hermes --resume id'), 'HM');
});

test('other CLIs retain OSC title changes and saved-title fallback', () => {
  const codex = session({ cliName: 'Codex', title: 'Saved task', workingDir: 'D:\\work' });
  assert.equal(getMiniTerminalTitle(codex, '  Current task  '), 'Current task');
  assert.equal(getMiniTerminalTitle(codex, '  '), 'Saved task');
  assert.equal(getMiniTerminalTitle(session({ cliName: 'Shell' })), 'Shell');
});

// Drive the actual panel effect with delayed IPC and a controlled clock. This
// catches late results and overlapping requests when visibility/PTYs change.
const panelSource = await readFile('src/components/TerminalPanel.tsx', 'utf8');
const ast = ts.createSourceFile('TerminalPanel.tsx', panelSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let pollSource;
function visit(node) {
  if (ts.isCallExpression(node) && node.expression.getText(ast) === 'useEffect' &&
      node.arguments[0]?.getText(ast).includes('await listTerminalSessionTitles()')) {
    pollSource = node.arguments[0].getText(ast);
  }
  ts.forEachChild(node, visit);
}
visit(ast);
assert.ok(pollSource, 'the panel must refresh provider session names');
const pollCallback = ts.transpileModule(`(${pollSource})`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;
function pollFixture(values = {}) {
  const timers = new Map();
  const pending = [];
  let nextTimer = 0;
  let titles = {};
  const context = {
    uiActive: true, titleSessionKey: 'pty-one:running',
    agentTitleRequestInFlight: { current: false },
    sessionsRef: { current: [session()] },
    setAgentSessionTitles: (updater) => { titles = updater(titles); },
    listTerminalSessionTitles: () => new Promise((resolve) => { pending.push(resolve); }),
    window: {
      setTimeout: (callback) => { timers.set(++nextTimer, callback); return nextTimer; },
      clearTimeout: (id) => timers.delete(id),
    },
    ...values,
  };
  const effect = vm.runInNewContext(pollCallback, context);
  return {
    effect, context, pending, timers,
    get titles() { return titles; },
    tick: () => {
      const [id, callback] = timers.entries().next().value;
      timers.delete(id);
      callback();
    },
  };
}
const settle = async () => { await Promise.resolve(); await Promise.resolve(); };

test('title polling stops while hidden and cannot publish after cleanup', async () => {
  const hidden = pollFixture({ uiActive: false });
  assert.equal(hidden.effect(), undefined);
  assert.equal(hidden.pending.length, 0);
  const fixture = pollFixture();
  const cleanup = fixture.effect();
  assert.equal(fixture.pending.length, 1);
  cleanup();
  fixture.pending[0]([current()]);
  await settle();
  assert.equal(Object.keys(fixture.titles).length, 0);
  assert.equal(fixture.timers.size, 0);
  assert.equal(fixture.context.agentTitleRequestInFlight.current, false);
});

test('PTY changes do not overlap title requests or retain removed session names', async () => {
  const fixture = pollFixture();
  const firstCleanup = fixture.effect();
  firstCleanup();
  fixture.context.sessionsRef.current = [session({ id: 'pty-two' })];
  const secondCleanup = fixture.effect();
  assert.equal(fixture.pending.length, 1, 'old IPC must finish before another request starts');
  fixture.pending[0]([current()]);
  await settle();
  assert.equal(Object.keys(fixture.titles).length, 0);
  fixture.tick();
  assert.equal(fixture.pending.length, 2);
  fixture.pending[1]([current(), current({ sessionId: 'pty-two', title: 'Second name' })]);
  await settle();
  assert.equal(fixture.titles['pty-one'], undefined);
  assert.equal(fixture.titles['pty-two'].title, 'Second name');
  secondCleanup();
  assert.equal(fixture.timers.size, 0);
});
