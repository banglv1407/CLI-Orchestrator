import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeWebsiteUrl, normalizeWebBrowserConfig, physicalBrowserBounds, sameWebConnection, getWebRoute } from '../src/lib/webBrowser.ts';
import { readWebMiniPreferences, writeWebMiniPreferences, webMiniVisible, hideWebMiniPanel } from '../src/lib/webMini.ts';
const hop = { kind: 'http', host: '127.0.0.1', port: 9090, username: '', secret: '', authMode: 'password', keyPath: '', hostKey: '' };
const draft = { url: 'http://intranet.test:8080/app', hop };
test('website paths, queries, fragments and HTTPS keep their real origin', () => {
  assert.equal(normalizeWebsiteUrl(' intranet.test:8080/app?q=one#tab '), 'http://intranet.test:8080/app?q=one#tab');
  assert.equal(normalizeWebsiteUrl('https://site.test/login'), 'https://site.test/login');
});
test('app origins, unsafe schemes, URL credentials and controls are rejected', () => {
  for (const url of ['', 'file:///C:/secret', 'tauri://localhost', 'javascript://test', 'http://tauri.localhost/', 'http://asset.localhost/', 'http://user:secret@site.test', 'http://si\nte.test/']) assert.throws(() => normalizeWebsiteUrl(url), /valid HTTP or HTTPS/);
});
test('direct browsing is default and profiles may omit a URL', () => {
  assert.equal(normalizeWebBrowserConfig({ url: 'site.test' }).hop, undefined);
  assert.equal(normalizeWebBrowserConfig({ url: '' }, true).url, '');
  assert.throws(() => normalizeWebBrowserConfig({ url: '' }), /valid HTTP or HTTPS/);
});
test('HTTP and SOCKS endpoints stay separate from the site', () => {
  for (const kind of ['http', 'https', 'socks4', 'socks5']) {
    const result = normalizeWebBrowserConfig({ ...draft, hop: { ...hop, kind, host: ' proxy.test ' } });
    assert.equal(result.url, draft.url); assert.equal(result.hop.host, 'proxy.test'); assert.equal(result.hop.kind, kind);
  }
  assert.equal(normalizeWebBrowserConfig({ ...draft, hop: { ...hop, host: '[::1]' } }).hop.host, '[::1]');
});
test('endpoints reject browser argument injection and invalid ports', () => {
  for (const host of ['', 'http://proxy.test', 'proxy.test:8888', 'user:password@proxy.test', 'proxy.test --no-proxy-server', 'proxy.test"', 'proxy.test/path', 'proxy.test?x']) assert.throws(() => normalizeWebBrowserConfig({ ...draft, hop: { ...hop, host } }), /proxy hostname/);
  for (const port of [0, 65536, 9090.5, -1, NaN, '9090']) assert.throws(() => normalizeWebBrowserConfig({ ...draft, hop: { ...hop, port } }), /proxy hostname/);
});
test('SOCKS4 rejects credentials and SOCKS5 validates byte lengths', () => {
  assert.throws(() => normalizeWebBrowserConfig({ ...draft, hop: { ...hop, kind: 'socks4', username: 'user' } }), /SOCKS4 credentials/);
  assert.throws(() => normalizeWebBrowserConfig({ ...draft, hop: { ...hop, kind: 'socks5', username: 'a'.repeat(256) } }), /255 bytes/);
  assert.throws(() => normalizeWebBrowserConfig({ ...draft, hop: { ...hop, kind: 'socks5', username: 'user', secret: 'ắ'.repeat(100) } }), /255 bytes/);
});
test('SSH needs authentication and a SHA256 fingerprint', () => {
  const ssh = { ...hop, kind: 'ssh', username: 'user', secret: 'pass', hostKey: 'SHA256:' + 'A'.repeat(43) };
  assert.equal(normalizeWebBrowserConfig({ ...draft, hop: ssh }).hop.kind, 'ssh');
  for (const fields of [{ username: '' }, { secret: '' }, { hostKey: '' }, { hostKey: 'SHA256:bad' }, { authMode: 'key', keyPath: '' }]) assert.throws(() => normalizeWebBrowserConfig({ ...draft, hop: { ...ssh, ...fields } }));
  assert.equal(normalizeWebBrowserConfig({ ...draft, hop: { ...ssh, authMode: 'key', keyPath: 'C:\\keys\\id_ed25519', secret: '' } }).hop.authMode, 'key');
});
test('navigation reuses a route, credential or profile changes create a new view', () => {
  assert(sameWebConnection(draft, { ...draft, url: 'http://other.test/', hop: { ...hop } }));
  for (const fields of [{ secret: 'new' }, { username: 'new' }, { host: 'other.test' }, { port: 9091 }, { kind: 'socks5' }, { hostKey: 'new' }]) assert(!sameWebConnection(draft, { ...draft, hop: { ...hop, ...fields } }));
  assert(!sameWebConnection(draft, { ...draft, profileId: 'another' }));
  assert(!sameWebConnection(draft, { ...draft, routeId: 'revision' }));
  assert(!sameWebConnection(draft, { url: draft.url }));
});
test('viewport uses physical Windows scaling and rejects invisible bounds', () => {
  const rect = { x: 84, y: 180, width: 800, height: 500 };
  assert.deepEqual(physicalBrowserBounds(rect, 1.5), { x: 126, y: 270, width: 1200, height: 750 });
  assert.deepEqual(physicalBrowserBounds(rect, 1), rect);
  for (const width of [0, -1, NaN, Infinity]) assert.equal(physicalBrowserBounds({ ...rect, width }, 1), null);
  assert.equal(physicalBrowserBounds(rect, 0), null);
});

test('ordered chains validate every stage and one-hop arrays retain the single-hop identity', () => {
  const chain = { url: draft.url, hops: [hop, { ...hop, kind: 'socks5', host: 'second.test', port: 1080 }] };
  const normalized = normalizeWebBrowserConfig(chain);
  assert.equal(normalized.hop, undefined); assert.equal(getWebRoute(normalized).length, 2);
  assert.equal(getWebRoute(normalized)[1].host, 'second.test');
  assert(sameWebConnection(normalizeWebBrowserConfig({ ...draft, hop }), normalizeWebBrowserConfig({ url: draft.url, hops: [hop] })));
  assert(!sameWebConnection(chain, { ...chain, hops: [...chain.hops].reverse() }));
  assert(!sameWebConnection(chain, { ...chain, hops: [hop, { ...chain.hops[1], secret: 'new-password', username: 'user' }] }));
  assert.throws(() => normalizeWebBrowserConfig({ ...chain, hop }), /Choose one connection/);
  assert.throws(() => normalizeWebBrowserConfig({ ...chain, hops: Array(9).fill(hop) }), /at most 8/);
  assert.throws(() => normalizeWebBrowserConfig({ ...chain, hops: [hop, { ...hop, host: 'bad --argument' }] }), /proxy hostname/);
});

test('mini-web placement/display persists safely and hiding one area preserves the other', () => {
  const previous = globalThis.localStorage; const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  try {
    assert.deepEqual(readWebMiniPreferences(), { placement: 'hidden', display: 'preview' });
    writeWebMiniPreferences({ placement: 'both', display: 'title-only' });
    assert.deepEqual(readWebMiniPreferences(), { placement: 'both', display: 'title-only' });
    assert(webMiniVisible('both', 'right') && webMiniVisible('both', 'bottom'));
    assert.equal(hideWebMiniPanel('both', 'right'), 'bottom'); assert.equal(hideWebMiniPanel('both', 'bottom'), 'right');
    assert.equal(hideWebMiniPanel('right', 'right'), 'hidden');
    values.set('clx-web-mini-panels', '{broken'); assert.equal(readWebMiniPreferences().placement, 'hidden');
    globalThis.localStorage = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
    assert.equal(readWebMiniPreferences().placement, 'hidden'); assert.doesNotThrow(() => writeWebMiniPreferences({ placement: 'both', display: 'preview' }));
  } finally { globalThis.localStorage = previous; }
});
