import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_SIDEBAR_ORDER,
  DEFAULT_VISIBLE_SIDEBAR_TABS,
  loadSidebarOrder,
  loadVisibleSidebarTabs,
} from '../src/lib/sidebarNavigation.ts';

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('fresh navigation includes AI Companion, and a later explicit hide survives reload', () => {
  const saved = storage();
  assert.deepEqual(loadSidebarOrder(saved), DEFAULT_SIDEBAR_ORDER);
  assert.deepEqual(loadVisibleSidebarTabs(saved), DEFAULT_VISIBLE_SIDEBAR_TABS);
  const hidden = DEFAULT_VISIBLE_SIDEBAR_TABS.filter(tab => tab !== 'ai-chat');
  saved.setItem('ai-cli-sidebar-visible-tabs', JSON.stringify(hidden));
  assert.deepEqual(loadVisibleSidebarTabs(saved), hidden);
  assert.deepEqual(loadVisibleSidebarTabs(saved), hidden);
});

test('legacy navigation gains chat once while preserving custom ordering and other visibility', () => {
  const saved = storage({
    'ai-cli-sidebar-tabs-order': JSON.stringify(['settings', 'buzz', 'apiclient', 'cli-manager', 'agent-sessions']),
    'ai-cli-sidebar-visible-tabs': JSON.stringify(['buzz', 'cli-manager', 'settings']),
  });
  const order = loadSidebarOrder(saved);
  assert.deepEqual(order.slice(0, 4), ['buzz', 'apiclient', 'cli-manager', 'agent-sessions']);
  assert.ok(order.includes('ai-chat'));
  assert.equal(order.at(-1), 'settings');
  assert.deepEqual(loadSidebarOrder(saved), order);
  assert.deepEqual(loadVisibleSidebarTabs(saved), ['buzz', 'cli-manager', 'settings', 'ai-chat']);
  saved.setItem('ai-cli-sidebar-visible-tabs', JSON.stringify(['buzz', 'cli-manager', 'settings']));
  assert.deepEqual(loadVisibleSidebarTabs(saved), ['buzz', 'cli-manager', 'settings']);
});

test('saved AI Companion ordering survives reload; malformed and retired IDs cannot enter navigation', () => {
  const saved = storage({
    'ai-cli-sidebar-tabs-order': JSON.stringify(['ai-chat', 'ai-chat', 'settings', 'web-ai', null, {}, 'cli-manager']),
    'ai-cli-sidebar-visible-tabs': JSON.stringify(['ai-chat', 'ai-chat', 'web-ai', {}, 'settings']),
  });
  const order = loadSidebarOrder(saved);
  assert.equal(order[0], 'ai-chat');
  assert.equal(order.length, DEFAULT_SIDEBAR_ORDER.length);
  assert.equal(order.at(-1), 'settings');
  assert.deepEqual(loadSidebarOrder(saved), order);
  assert.deepEqual(loadVisibleSidebarTabs(saved), ['ai-chat', 'settings']);
  for (const value of ['{broken', '{}', '[]', '["retired"]']) {
    const invalid = storage({ 'ai-cli-sidebar-tabs-order': value, 'ai-cli-sidebar-visible-tabs': value });
    assert.deepEqual(loadSidebarOrder(invalid), DEFAULT_SIDEBAR_ORDER);
    assert.deepEqual(loadVisibleSidebarTabs(invalid), DEFAULT_VISIBLE_SIDEBAR_TABS);
  }
});

test('unavailable storage still returns usable navigation defaults', () => {
  const unavailable = {
    getItem() { throw new Error('unavailable'); },
    setItem() { throw new Error('unavailable'); },
  };
  assert.deepEqual(loadSidebarOrder(unavailable), DEFAULT_SIDEBAR_ORDER);
  assert.deepEqual(loadVisibleSidebarTabs(unavailable), DEFAULT_VISIBLE_SIDEBAR_TABS);
});
