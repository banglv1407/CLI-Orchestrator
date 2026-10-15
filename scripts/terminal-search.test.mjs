import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

const bundled = await build({ entryPoints: ['src/lib/terminalSearch.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { handleTerminalSearchKey } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const context = { enabled: true, editableElsewhere: false, inSearchInput: false, searchVisible: false };

function dispatch(properties, overrides = {}) {
  const event = Object.assign(new Event('keydown', { cancelable: true }), {
    key: '', ctrlKey: false, metaKey: false, altKey: false, shiftKey: false, isComposing: false, ...properties,
  });
  const actions = [];
  const target = new EventTarget();
  target.addEventListener('keydown', key => {
    handleTerminalSearchKey(key, { ...context, ...overrides }, Object.fromEntries(
      ['open', 'next', 'previous', 'close'].map(action => [action, () => actions.push(action)]),
    ));
  });
  let fallbackCalls = 0;
  target.addEventListener('keydown', () => fallbackCalls++);
  return { accepted: target.dispatchEvent(event), actions, fallbackCalls };
}

test('Ctrl/Cmd+F, including Caps Lock and repeat, cancels browser find before the fallback', () => {
  for (const properties of [
    { key: 'f', ctrlKey: true }, { key: 'F', ctrlKey: true },
    { key: 'f', metaKey: true }, { key: 'f', ctrlKey: true, repeat: true },
  ]) {
    for (const searchVisible of [false, true]) {
      assert.deepEqual(dispatch(properties, { searchVisible, inSearchInput: searchVisible }), {
        accepted: false, actions: ['open'], fallbackCalls: 0,
      });
    }
  }
});

test('each navigation/close gesture has one owner, while Enter outside the search input belongs to its control', () => {
  const cases = [
    [{ key: 'F3' }, { searchVisible: true }, 'next'], [{ key: 'F3', shiftKey: true }, { searchVisible: true }, 'previous'],
    [{ key: 'g', ctrlKey: true }, { searchVisible: true }, 'next'],
    [{ key: 'G', ctrlKey: true, shiftKey: true }, { searchVisible: true }, 'previous'],
    [{ key: 'g', metaKey: true }, { searchVisible: true }, 'next'],
    [{ key: 'Enter' }, { searchVisible: true, inSearchInput: true }, 'next'],
    [{ key: 'Enter', shiftKey: true }, { searchVisible: true, inSearchInput: true }, 'previous'],
    [{ key: 'Escape' }, { searchVisible: true }, 'close'],
  ];
  for (const [properties, overrides, action] of cases) {
    assert.deepEqual(dispatch(properties, overrides), { accepted: false, actions: [action], fallbackCalls: 0 });
  }
  assert.deepEqual(dispatch({ key: 'Enter' }, { searchVisible: true }), { accepted: true, actions: [], fallbackCalls: 1 });
});

test('other views, editable controls, composition and unrelated CLI shortcuts keep their own keyboard handling', () => {
  const cases = [
    [{ key: 'f', ctrlKey: true }, { enabled: false }],
    [{ key: 'f', ctrlKey: true }, { editableElsewhere: true }],
    [{ key: 'f', ctrlKey: true, isComposing: true }, {}],
    [{ key: 'f', ctrlKey: true, altKey: true }, {}],
    [{ key: 'f', ctrlKey: true, shiftKey: true }, {}],
    [{ key: 'r', ctrlKey: true }, { searchVisible: true }],
    [{ key: 'g', ctrlKey: true }, {}],
    [{ key: 'F3' }, {}],
    [{ key: 'Escape' }, {}],
    [{ key: 'Enter' }, {}],
  ];
  for (const [properties, overrides] of cases) {
    assert.deepEqual(dispatch(properties, overrides), { accepted: true, actions: [], fallbackCalls: 1 });
  }
});
