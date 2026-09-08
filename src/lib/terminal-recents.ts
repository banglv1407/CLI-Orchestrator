export interface RecentTerminal {
  cliName: string;
  workingDir: string;
  lastUsed: number;
}

const KEY = 'clx-terminal-recents-v1';
export const RECENTS_CHANGED = 'clx-terminal-recents-changed';
export const recentKey = (item: RecentTerminal) => JSON.stringify([item.cliName, item.workingDir]);

export function parseRecents(raw: string | null): RecentTerminal[] {
  try {
    const parsed: unknown = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter((item): item is RecentTerminal =>
      item !== null && typeof item === 'object' &&
      typeof item.cliName === 'string' && item.cliName.trim().length > 0 &&
      typeof item.workingDir === 'string' && item.workingDir.trim().length > 0 &&
      typeof item.lastUsed === 'number' && Number.isFinite(item.lastUsed) && item.lastUsed > 0,
    ).sort((a, b) => b.lastUsed - a.lastUsed);
    const seen = new Set<string>();
    return valid.filter(item => {
      const key = recentKey(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 50).map(({ cliName, workingDir, lastUsed }) => ({ cliName, workingDir, lastUsed }));
  } catch { return []; }
}

export function loadRecents(): RecentTerminal[] {
  try { return parseRecents(localStorage.getItem(KEY)); } catch { return []; }
}

export function recordRecent(cliName: string, workingDir?: string): void {
  if (!workingDir || !cliName) return;
  const current = loadRecents();
  const item = { cliName, workingDir, lastUsed: Math.max(Date.now(), (current[0]?.lastUsed || 0) + 1) };
  const next = [item, ...current.filter(old => recentKey(old) !== recentKey(item))].slice(0, 50);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(RECENTS_CHANGED));
  } catch {
    // History storage must not turn a successful terminal launch into a failure.
  }
}
