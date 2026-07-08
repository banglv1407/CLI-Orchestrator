export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface KeyValueState {
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiHistoryEntry {
  url: string;
  method: HttpMethod;
  timestamp: number;
  headers: KeyValueState[];
  params: KeyValueState[];
  body: string;
}

const HISTORY_KEY = 'clx-apiclient-history';
const MAX_HISTORY = 50;

export function loadApiHistory(): ApiHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ApiHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveApiHistory(entry: ApiHistoryEntry): ApiHistoryEntry[] {
  const current = loadApiHistory();
  const filtered = current.filter((e) => !(e.url === entry.url && e.method === entry.method));
  filtered.unshift(entry);
  const trimmed = filtered.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  window.dispatchEvent(new CustomEvent('apiclient-history-changed', { detail: trimmed }));
  return trimmed;
}

export function clearApiHistory() {
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new CustomEvent('apiclient-history-changed', { detail: [] }));
}

export const METHOD_COLORS: Record<string, string> = {
  GET: '#61affe',
  POST: '#49cc90',
  PUT: '#fca130',
  DELETE: '#f93e3e',
  PATCH: '#50e3c2',
  HEAD: '#9012fe',
  OPTIONS: '#0d5aa7',
};
