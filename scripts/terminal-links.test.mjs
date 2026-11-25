import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';
const bundle = await build({ entryPoints: ['src/lib/terminalLinks.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { canLinkTerminal, layoutTerminalGraph, readTerminalLinks, saveTerminalLinks } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);

test('reparenting prevents self and ancestor cycles, permits siblings and unlinking', () => {
  const links = { b: 'a', c: 'b', d: 'a' };
  assert.equal(canLinkTerminal(links, 'a', 'c'), false);
  assert.equal(canLinkTerminal(links, 'a', 'a'), false);
  assert.equal(canLinkTerminal(links, 'd', 'c'), true);
  assert.equal(canLinkTerminal({ b: 'c', c: 'b' }, 'a', 'b'), false);
});

test('both graph directions keep branching nodes separate and edges attached to their parent', () => {
  for (const direction of ['horizontal', 'vertical']) {
    const graph = layoutTerminalGraph(['a', 'b', 'c', 'd', 'e'], { b: 'a', c: 'a', d: 'b' }, direction);
    assert.equal(graph.nodes.length, 5);
    assert.equal(graph.edges.length, 3);
    assert.equal(new Set(graph.nodes.map(n => `${n.x},${n.y}`)).size, 5);
    const byId = Object.fromEntries(graph.nodes.map(n => [n.id, n]));
    for (const edge of graph.edges) {
      assert.ok(byId[edge.child][direction === 'horizontal' ? 'x' : 'y'] > byId[edge.parent][direction === 'horizontal' ? 'x' : 'y']);
      assert.ok(edge.path.startsWith('M '));
    }
  }
});

test('closing a parent leaves descendants visible as roots; corrupt cycles do not hang layout', () => {
  const graph = layoutTerminalGraph(['b', 'c'], { b: 'a', c: 'b' }, 'horizontal');
  assert.equal(graph.edges.length, 1);
  assert.equal(graph.edges[0].parent, 'b');
  assert.equal(layoutTerminalGraph(['a', 'b'], { a: 'b', b: 'a' }, 'vertical').nodes.length, 2);
  assert.deepEqual(layoutTerminalGraph([], {}, 'horizontal').edges, []);
});

test('stored links survive reload and malformed or unavailable storage is harmless', () => {
  let value = '{"b":"a","a":"b","bad":42,"self":"self"}';
  globalThis.localStorage = { getItem: () => value, setItem: (_, next) => { value = next; } };
  assert.deepEqual({ ...readTerminalLinks() }, { b: 'a' });
  saveTerminalLinks({ c: 'b', b: 'a' });
  assert.deepEqual({ ...readTerminalLinks() }, { c: 'b', b: 'a' });
  for (const bad of ['null', '[]', 'broken']) { value = bad; assert.deepEqual({ ...readTerminalLinks() }, {}); }
  localStorage.getItem = () => { throw new Error('blocked'); };
  localStorage.setItem = () => { throw new Error('blocked'); };
  assert.deepEqual(readTerminalLinks(), {});
  assert.doesNotThrow(() => saveTerminalLinks({ b: 'a' }));
  delete globalThis.localStorage;
});
