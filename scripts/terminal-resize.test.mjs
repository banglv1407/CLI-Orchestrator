import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

globalThis.self = globalThis;
const { Terminal } = createRequire(import.meta.url)('@xterm/xterm');
const bundled = await build({ entryPoints: ['src/lib/terminalResize.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { ConptyResizeAddon, INITIAL_TERMINAL_SIZE, TerminalResizeQueue } = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`
);
const write = (term, text) => new Promise(resolve => term.write(text, resolve));
function lines(term) {
  const buffer = term.buffer.active;
  return Array.from({ length: buffer.length }, (_, index) => buffer.getLine(index).translateToString(true));
}
function terminal(options = {}) {
  const term = new Terminal({ ...INITIAL_TERMINAL_SIZE, scrollback: 2000, ...options });
  term.loadAddon(new ConptyResizeAddon());
  return term;
}

for (const scenario of ['height', 'width', 'mixed']) {
  test(`native ConPTY ${scenario} redraws retain every line and character once`, async () => {
    const capture = JSON.parse(await readFile(`scripts/fixtures/terminal-resize/conpty-${scenario}.json`, 'utf8'));
    const term = terminal();
    try {
      let original;
      for (const stage of capture.stages) {
        term.resize(stage.cols, stage.rows);
        await write(term, stage.chunks.join(''));
        const content = lines(term).join('');
        original ??= content;
        assert.equal(content, original, `${stage.cols} x ${stage.rows}: no lost, repeated, or reordered characters`);
        for (let index = 1; index <= 60; index++) {
          const marker = `FIXTURE_${String(index).padStart(3, '0')}`;
          assert.equal(content.split(marker).length - 1, 1, `${stage.cols} x ${stage.rows}: ${marker}`);
        }
        assert.ok(term.buffer.active.cursorY < stage.rows);
        assert.ok(term.buffer.active.baseY + stage.rows <= term.buffer.active.length);
      }
    } finally { term.dispose(); }
  });
}

test('normal history survives alternate-screen TUI resizing and terminal reset', async () => {
  const term = terminal();
  try {
    await write(term, 'NORMAL_HISTORY\r\n' + 'history '.repeat(30) + '\r\n');
    const history = lines(term).join('');
    await write(term, '\x1b[?1049h\x1b[2J\x1b[HALT_SCREEN');
    for (const [cols, rows] of [[80, 20], [160, 50], [100, 18]]) {
      term.resize(cols, rows);
      await write(term, '\x1b[2J\x1b[HALT_SCREEN');
      assert.equal(term.buffer.active.type, 'alternate');
      assert.equal(lines(term).join('').split('ALT_SCREEN').length - 1, 1);
    }
    await write(term, '\x1b[?1049l');
    assert.equal(term.buffer.active.type, 'normal');
    assert.equal(lines(term).join(''), history);
    term.reset();
    await write(term, 'AFTER_RESET\r\n' + 'reset '.repeat(35) + '\r\n');
    const resetContent = lines(term).join('');
    for (const [cols, rows] of [[140, 34], [80, 20], [160, 50]]) term.resize(cols, rows);
    assert.equal(lines(term).join(''), resetContent);
  } finally { term.dispose(); }
});

test('wide and colored scrollback survives resize while a reader is scrolled up', async () => {
  const term = terminal();
  try {
    await write(term, Array.from({ length: 80 }, (_, index) => `UNICODE_${index}: \x1b[31m漢字é🦀\x1b[0m ` + 'abc'.repeat(32)).join('\r\n') + '\r\n');
    const original = lines(term).join('');
    term.scrollToLine(10);
    for (const [cols, rows] of [[80, 20], [160, 50], [100, 18], [140, 34]]) {
      term.resize(cols, rows);
      assert.equal(lines(term).join(''), original);
      assert.ok(term.buffer.active.viewportY < term.buffer.active.baseY, 'resizing must not scroll a reader to the bottom');
      const colored = Array.from({ length: term.buffer.active.length }, (_, row) => term.buffer.active.getLine(row))
        .some(line => Array.from({ length: term.cols }, (_, col) => line.getCell(col)).some(cell => cell?.getChars() === '漢' && cell.getFgColor() === 1));
      assert.ok(colored, 'reflow preserves cell attributes');
    }
  } finally { term.dispose(); }
});

test('reflow respects the scrollback bound under repeated expansion and shrinking', async () => {
  const term = terminal({ cols: 80, rows: 12, scrollback: 100 });
  try {
    await write(term, Array.from({ length: 300 }, (_, index) => `BOUNDED_${index} ` + 'text'.repeat(22)).join('\r\n') + '\r\n');
    for (let index = 0; index < 30; index++) {
      const cols = index % 2 ? 40 : 160;
      const rows = index % 2 ? 10 : 24;
      term.resize(cols, rows);
      assert.ok(term.buffer.active.length <= rows + 100);
      assert.ok(term.buffer.active.baseY >= 0);
      assert.ok(term.buffer.active.baseY + rows <= term.buffer.active.length);
      assert.ok(term.buffer.active.cursorY < rows);
    }
  } finally { term.dispose(); }
});

test('addon disposal restores the resize method', () => {
  const term = new Terminal();
  const original = term.resize;
  const addon = new ConptyResizeAddon();
  term.loadAddon(addon);
  assert.notEqual(term.resize, original);
  addon.dispose();
  assert.equal(term.resize, original);
  term.dispose();
});

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const tick = () => new Promise(resolve => setImmediate(resolve));

test('PTY resizes execute in order and coalesce pending drag dimensions', async () => {
  const calls = [], waits = [];
  const queue = new TerminalResizeQueue(size => {
    const wait = deferred(); calls.push(size); waits.push(wait); return wait.promise;
  }, assert.fail);
  const first = { cols: 80, rows: 20 }, latest = { cols: 140, rows: 34 };
  queue.enqueue(first);
  queue.enqueue({ cols: 100, rows: 24 });
  queue.enqueue(latest);
  assert.deepEqual(calls, [first], 'only one native request can be outstanding');
  waits[0].resolve(); await tick();
  assert.deepEqual(calls, [first, latest]);
  waits[1].resolve(); await tick();
  queue.enqueue(latest); await tick();
  assert.equal(calls.length, 2, 'already applied dimensions do not cause a redraw');
  queue.dispose();
});

test('closing a PTY cancels pending resizes and ignores late completion errors', async () => {
  const wait = deferred(), calls = [], errors = [];
  const queue = new TerminalResizeQueue(size => { calls.push(size); return wait.promise; }, error => errors.push(error));
  queue.enqueue({ cols: 80, rows: 20 });
  queue.enqueue({ cols: 120, rows: 30 });
  queue.dispose();
  wait.reject(new Error('session closed')); await tick();
  queue.enqueue({ cols: 140, rows: 34 });
  assert.equal(calls.length, 1);
  assert.deepEqual(errors, []);
});

test('failed dimensions can be retried and other PTYs resize independently', async () => {
  const errors = [], calls = [];
  const first = new TerminalResizeQueue(async size => { calls.push(size); if (calls.length === 1) throw new Error('temporary failure'); }, error => errors.push(error));
  const secondCalls = [];
  const second = new TerminalResizeQueue(async size => { secondCalls.push(size); }, assert.fail);
  const size = { cols: 120, rows: 30 };
  first.enqueue(size); second.enqueue(size); await tick();
  first.enqueue(size); await tick();
  assert.equal(errors.length, 1);
  assert.equal(calls.length, 2);
  assert.equal(secondCalls.length, 1);
  first.dispose(); second.dispose();
});
