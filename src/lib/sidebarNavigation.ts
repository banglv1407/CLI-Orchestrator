export type SidebarTab = 'cli-manager' | 'agent-sessions' | 'ai-chat' | 'dashboard' | 'quickapps' | 'buzz' | 'game' | 'apiclient' | 'settings';

export const DEFAULT_SIDEBAR_ORDER: SidebarTab[] = [
  'cli-manager', 'agent-sessions', 'ai-chat', 'dashboard', 'quickapps', 'buzz', 'game', 'apiclient', 'settings',
];
export const DEFAULT_VISIBLE_SIDEBAR_TABS: SidebarTab[] = ['cli-manager', 'agent-sessions', 'ai-chat', 'settings'];
export const PINNED_SIDEBAR_TABS = new Set<SidebarTab>(['settings']);

type SidebarStorage = Pick<Storage, 'getItem' | 'setItem'>;
const AI_CHAT_ADDED_KEY = 'ai-cli-sidebar-ai-chat-added';

function isSidebarTab(value: unknown): value is SidebarTab {
  return typeof value === 'string' && DEFAULT_SIDEBAR_ORDER.includes(value as SidebarTab);
}

function readTabs(storage: SidebarStorage, key: string): SidebarTab[] {
  try {
    const value: unknown = JSON.parse(storage.getItem(key) ?? 'null');
    return Array.isArray(value) ? [...new Set(value.filter(isSidebarTab))] : [];
  } catch {
    return [];
  }
}

export function normalizeSidebarOrder(order: readonly unknown[]): SidebarTab[] {
  const list = [...new Set(order.filter(isSidebarTab))];
  for (const tab of DEFAULT_SIDEBAR_ORDER) {
    if (!list.includes(tab)) list.push(tab);
  }
  return [
    ...list.filter(tab => !PINNED_SIDEBAR_TABS.has(tab)),
    ...list.filter(tab => PINNED_SIDEBAR_TABS.has(tab)),
  ];
}

export function loadSidebarOrder(storage: SidebarStorage = localStorage): SidebarTab[] {
  const order = normalizeSidebarOrder(readTabs(storage, 'ai-cli-sidebar-tabs-order'));
  try { storage.setItem('ai-cli-sidebar-tabs-order', JSON.stringify(order)); } catch { /* Keep navigation usable. */ }
  return order;
}

export function loadVisibleSidebarTabs(storage: SidebarStorage = localStorage): SidebarTab[] {
  const saved = readTabs(storage, 'ai-cli-sidebar-visible-tabs');
  const visible = saved.length ? saved : [...DEFAULT_VISIBLE_SIDEBAR_TABS];
  try {
    // Reveal the newly available feature once, then preserve explicit hide choices.
    if (storage.getItem(AI_CHAT_ADDED_KEY) !== 'true' && !visible.includes('ai-chat')) {
      const agentIndex = visible.indexOf('agent-sessions');
      visible.splice(agentIndex >= 0 ? agentIndex + 1 : visible.length, 0, 'ai-chat');
    }
    storage.setItem('ai-cli-sidebar-visible-tabs', JSON.stringify(visible));
    storage.setItem(AI_CHAT_ADDED_KEY, 'true');
  } catch { /* Keep navigation usable. */ }
  return visible;
}
