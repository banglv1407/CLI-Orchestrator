import { useEffect, useState, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { confirm } from '@tauri-apps/plugin-dialog';
import {
  dashboardGetResourceUsage,
  dashboardDeleteMonitor,
  dashboardKillProcesses,
  dashboardListMonitors,
  dashboardProbeMonitors,
  dashboardUpsertMonitor,
  dashboardGetTargetConnections,
  dashboardGetAllConnections,
  type ResourceUsage,
  type MonitorConfig,
  type MonitorProcessIdentity,
  type MonitorSnapshot,
  type TcpConnection,
} from '../lib/tauri';
import {
  getSystemLogs,
} from '../lib/tauri';
import type { SystemLogEntry } from '../types';
import { MonitorEditorModal } from './MonitorEditorModal';
import { MonitorLogDrawer } from './MonitorLogDrawer';

function fmtMemShort(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb.toFixed(1)} MB`;
}
function fmtUptime(s: number): string {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m`;
  return `${s}s`;
}
function fmtPath(p: string, maxLen = 36): string {
  if (p.length <= maxLen) return p;
  return '…' + p.slice(-(maxLen - 1));
}

function monitorTargetLabel(monitor: MonitorConfig): string {
  if (monitor.targetType === 'local') return 'localhost';
  const target = monitor.target ? `${monitor.target.user}@${monitor.target.host}` : 'missing target';
  return monitor.jump ? `${target} via ${monitor.jump.user}@${monitor.jump.host}` : target;
}

const MONITOR_STATUS_CLASSES: Record<string, string> = {
  listening: 'border-green-500/25 bg-green-500/5',
  notListening: 'border-red-500/25 bg-red-500/5',
  unreachable: 'border-orange-500/25 bg-orange-500/5',
  permissionDenied: 'border-amber-500/25 bg-amber-500/5',
  unsupported: 'border-fuchsia-500/25 bg-fuchsia-500/5',
  stale: 'border-slate-500/25 bg-slate-500/5',
};

const LEVEL_CLASSES: Record<string, string> = {
  ERROR: 'text-red-400',
  WARN: 'text-amber-300',
  INFO: 'text-cyan-400',
  DEBUG: 'text-slate-500',
};

// ════════════════════════════════════════════════════════════════════

/** Extract the last user message from an OpenAI chat request JSON */
function extractLastUserMsg(requestJson: string): string {
  try {
    const r = JSON.parse(requestJson);
    const msgs: any[] = r?.messages;
    if (!msgs || !msgs.length) return '';
    // Find the last message with role 'user'
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i]?.role === 'user') {
        const c = typeof msgs[i].content === 'string' ? msgs[i].content : JSON.stringify(msgs[i].content);
        return c.length > 140 ? c.slice(0, 137) + '…' : c;
      }
    }
    return '';
  } catch { return ''; }
}

/** Extract response text from an OpenAI chat response JSON */
function extractResponsePreview(responseJson: string | undefined, normalizedResponseJson?: string): string {
  try {
    const r = JSON.parse(normalizedResponseJson || responseJson || '{}');
    const txt: string = r?.choices?.[0]?.message?.content || r?.choices?.[0]?.text || '';
    return txt.length > 200 ? txt.slice(0, 197) + '…' : txt;
  } catch { return ''; }
}

// ═══ Widget tooltips ═══
const TOOLTIPS: Record<string, string> = {
  syslogs: 'System logs from CLX backend — ring-buffer of last 500 entries. Filter by level (ERROR/WARN/INFO/DEBUG) and source.',
  portmon: 'Port monitor: track TCP ports on localhost or remote SSH hosts. Shows PID, RAM, CPU, uptime. Kill hung listeners. View live service logs.',
  proxy: 'LLM Proxy: embedded Axum HTTP proxy providing OpenAI-compatible /v1/chat/completions on 127.0.0.1:{port}. Load-balanced across configurable backends.',
  targetmon: 'Target Monitor: enter an IP or domain to filter all TCP connections to/from that target. Uses nslookup for domain resolution.',
  connlog: 'Connection Log: realtime dump of all TCP connections from this machine via netstat. Sorted by remote address frequency. Aggregated 1/5/10 min stats.',
};

// ═══ Expand Modal: full data overlay ═══
function ExpandModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-8 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-5xl h-[85vh] rounded-xl border border-cyber-line/50 bg-cyber-panel shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-line/30 shrink-0">
          <h2 className="text-xs uppercase tracking-[0.15em] text-cyber-electric font-black">{title}</h2>
          <button type="button" onClick={onClose} className="rounded border border-slate-600/30 px-2 py-1 text-[10px] font-bold uppercase text-slate-400 hover:text-slate-200 hover:border-slate-400/50">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}

// ═══ Connection aggregate stats ═══
interface ConnectionHistoryBucket {
  ts: number;
  established: number;
  listening: number;
  total: number;
  remotes: Record<string, number>;
}

function makeConnectionBucket(conns: TcpConnection[]): ConnectionHistoryBucket {
  const remotes: Record<string, number> = {};
  let established = 0;
  let listening = 0;
  for (const connection of conns) {
    if (connection.state === 'ESTABLISHED') established += 1;
    if (connection.state === 'LISTENING') listening += 1;
    if (connection.remoteAddr) remotes[connection.remoteAddr] = (remotes[connection.remoteAddr] || 0) + 1;
  }
  return { ts: Date.now(), established, listening, total: conns.length, remotes };
}

function computeConnAggregates(history: ConnectionHistoryBucket[]) {
  const now = Date.now();
  const ranges: [string, number][] = [['1m', 60_000], ['5m', 300_000], ['10m', 600_000]];
  const stats: Record<string, { established: number; listening: number; total: number; uniqueRemotes: number; topRemotes: [string, number][] }> = {};

  for (const [label, windowMs] of ranges) {
    const cutoff = now - windowMs;
    const buckets = history.filter((bucket) => bucket.ts >= cutoff);
    const unique = new Set<string>();
    const remoteCounts = new Map<string, number>();

    let est = 0; let lst = 0; let total = 0;
    for (const bucket of buckets) {
      est += bucket.established;
      lst += bucket.listening;
      total += bucket.total;
      for (const [address, count] of Object.entries(bucket.remotes)) {
        unique.add(address);
        remoteCounts.set(address, (remoteCounts.get(address) || 0) + count);
      }
    }
    stats[label] = {
      established: est, listening: lst, total,
      uniqueRemotes: unique.size,
      topRemotes: [...remoteCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5),
    };
  }
  return stats;
}

// ═══ Sort connections by remote frequency (most calls → top) ═══
function sortConnsByRemoteFreq(conns: TcpConnection[]): TcpConnection[] {
  const freq = new Map<string, number>();
  for (const c of conns) freq.set(c.remoteAddr, (freq.get(c.remoteAddr) || 0) + 1);
  return [...conns].sort((a, b) => (freq.get(b.remoteAddr) || 0) - (freq.get(a.remoteAddr) || 0));
}

export function DashboardPanel() {
  const [uiHealth, setUiHealth] = useState({ p95LagMs: 0, maxLongTaskMs: 0 });
  useEffect(() => {
    const lagSamples: number[] = [];
    let expected = performance.now() + 1_000;
    let ticks = 0;
    let maxLongTaskMs = 0;
    const timer = window.setInterval(() => {
      const now = performance.now();
      lagSamples.push(Math.max(0, now - expected));
      if (lagSamples.length > 60) lagSamples.shift();
      expected = now + 1_000;
      ticks += 1;
      if (ticks % 5 === 0) {
        const sorted = [...lagSamples].sort((a, b) => a - b);
        const p95 = sorted[Math.max(0, Math.ceil(sorted.length * 0.95) - 1)] || 0;
        setUiHealth({ p95LagMs: p95, maxLongTaskMs });
      }
    }, 1_000);
    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) maxLongTaskMs = Math.max(maxLongTaskMs, entry.duration);
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch { /* Long Tasks API is optional in WebView2 versions. */ }
    return () => {
      window.clearInterval(timer);
      observer?.disconnect();
    };
  }, []);

  // ═══ Widget toggles (localStorage persisted) ═══
  const [widgets, setWidgets] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('clx-dashboard-widgets');
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return { syslogs: true, portmon: true, proxy: true, targetmon: true, connlog: true };
  });
  const saveWidgets = (next: Record<string, boolean>) => {
    setWidgets(next);
    localStorage.setItem('clx-dashboard-widgets', JSON.stringify(next));
  };
  const toggleWidget = (key: string) => saveWidgets({ ...widgets, [key]: !widgets[key] });

  // ═══ Expanded modal ═══
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);

  // ═══ Connection history buffer (sliding window for time aggregates) ═══
  const connHistoryRef = useRef<ConnectionHistoryBucket[]>([]);
  const MAX_HISTORY = 60; // 10 minutes at the 10-second cadence.

  // ═══ Resource usage ═══
  const [usage, setUsage] = useState<ResourceUsage | null>(null);
  const [resError, setResError] = useState<string | null>(null);

  // ═══ Port monitor ═══
  const [monitors, setMonitors] = useState<MonitorConfig[]>([]);
  const [monitorSnapshots, setMonitorSnapshots] = useState<Record<string, MonitorSnapshot>>({});
  const [expandedMonitor, setExpandedMonitor] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<MonitorConfig | null>(null);
  const [logMonitorId, setLogMonitorId] = useState<string | null>(null);
  const [monitorErrors, setMonitorErrors] = useState<Record<string, string>>({});
  const [killBusy, setKillBusy] = useState<string | null>(null);
  const [forceablePids, setForceablePids] = useState<Record<string, number[]>>({});
  const [sudoPrompt, setSudoPrompt] = useState<{
    monitor: MonitorConfig;
    processes: MonitorProcessIdentity[];
    mode: 'normal' | 'force';
  } | null>(null);
  const [sudoPassword, setSudoPassword] = useState('');

  // ═══ System Logs ═══
  const [sysLogs, setSysLogs] = useState<SystemLogEntry[]>([]);
  const [sysLogErr, setSysLogErr] = useState<string | null>(null);

  // ═══ Proxy ═══
  const [pxyStatus, setPxyStatus] = useState<{ running: boolean; port: number; activeBackends: number; totalRequests: number } | null>(null);
  const [pxyLogs, setPxyLogs] = useState<any[]>([]);
  const [pxyErr, setPxyErr] = useState<string | null>(null);
  const [pxyLoading, setPxyLoading] = useState(false);

  // ═══ Target Connection Monitor ═══
  const [targetInput, setTargetInput] = useState('');
  const [target, setTarget] = useState('');
  const [targetConns, setTargetConns] = useState<TcpConnection[]>([]);
  const [targetError, setTargetError] = useState<string | null>(null);

  // ═══ Realtime Connection Log ═══
  const [allConns, setAllConns] = useState<TcpConnection[]>([]);
  const [allConnsError, setAllConnsError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshInFlightRef = useRef(false);

  // ── Master refresh ──────────────────────────────────────────────
  const refreshAll = useCallback(async () => {
    if (refreshInFlightRef.current) return;
    refreshInFlightRef.current = true;
    try {
    // Resource usage
    try { setUsage(await dashboardGetResourceUsage()); setResError(null); } catch (e) { setResError(String(e)); }

    // Target-aware TCP monitors
    if (widgets.portmon) {
      try {
        const snapshots = await dashboardProbeMonitors();
        setMonitorSnapshots((previous) => {
          const next = { ...previous };
          for (const snapshot of snapshots) next[snapshot.monitorId] = snapshot;
          return next;
        });
      } catch { /* keep the last known snapshots */ }
    }

    // System logs
    if (widgets.syslogs) {
      try { setSysLogs(await getSystemLogs(50)); setSysLogErr(null); } catch (e) { setSysLogErr(String(e)); }
    }

    // Proxy
    if (widgets.proxy) {
      try {
        const res = await invoke<{ running: boolean; port: number; activeBackends: number; totalRequests: number }>('module_call', {
          moduleId: 'clx.cli-proxy',
          method: 'clx.cli-proxy.status',
          params: {},
        }).catch(() => null);
        if (res) {
          setPxyStatus(res as any);
          const logs = await invoke<any[]>('module_call', {
            moduleId: 'clx.cli-proxy',
            method: 'clx.cli-proxy.getRecentLogs',
            params: { limit: 10 },
          }).catch(() => []);
          setPxyLogs(logs || []);
          setPxyErr(null);
        } else {
          setPxyStatus(null);
          setPxyLogs([]);
          setPxyErr('CliProxyAI module is not running or not installed');
        }
      } catch (e) { setPxyErr(String(e)); }
    }

    // Target connections
    if (target && widgets.targetmon) {
      try { setTargetConns(await dashboardGetTargetConnections(target)); setTargetError(null); } catch (e) { setTargetError(String(e)); }
    }

    // All connections (realtime) + history buffer
    if (widgets.connlog) {
      try {
        const conns = await dashboardGetAllConnections();
        setAllConns(conns);
        setAllConnsError(null);
        // Append to history
        connHistoryRef.current.push(makeConnectionBucket(conns));
        if (connHistoryRef.current.length > MAX_HISTORY) connHistoryRef.current.shift();
      } catch (e) { setAllConnsError(String(e)); }
    }
    } finally {
      refreshInFlightRef.current = false;
    }
  }, [widgets, target]);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      await refreshAll();
      if (!cancelled) intervalRef.current = setTimeout(() => void tick(), 10_000);
    };
    void tick();
    return () => {
      cancelled = true;
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [refreshAll]);

  useEffect(() => {
    let active = true;
    const loadAndMigrate = async () => {
      try {
        let loaded = await dashboardListMonitors();
        const legacyRaw = localStorage.getItem('clx-dashboard-ports');
        if (legacyRaw && localStorage.getItem('clx-dashboard-ports-migrated-v2') !== '1') {
          let ports: number[] = [];
          try { ports = JSON.parse(legacyRaw); } catch { /* ignore invalid legacy storage */ }
          const existingLocal = new Set(loaded.filter((item) => item.targetType === 'local').map((item) => item.servicePort));
          for (const port of ports.filter((value) => Number.isInteger(value) && value > 0 && value <= 65535 && !existingLocal.has(value))) {
            await dashboardUpsertMonitor({
              id: crypto.randomUUID(),
              label: `Local :${port}`,
              servicePort: port,
              targetType: 'local',
              target: null,
              jump: null,
              targetOs: 'auto',
              logSource: { kind: 'auto' },
              legacyImported: true,
            });
          }
          localStorage.setItem('clx-dashboard-ports-migrated-v2', '1');
          localStorage.removeItem('clx-dashboard-ports');
          loaded = await dashboardListMonitors();
        }
        if (active) setMonitors(loaded);
      } catch (error) {
        if (active) setMonitorErrors({ _load: String(error) });
      }
    };
    void loadAndMigrate();
    return () => { active = false; };
  }, []);

  // ── Monitor actions ─────────────────────────────────────────────
  const reloadMonitors = useCallback(async () => {
    setMonitors(await dashboardListMonitors());
    await refreshAll();
  }, [refreshAll]);

  const removeMonitor = async (monitor: MonitorConfig) => {
    const accepted = await confirm(`Remove monitor “${monitor.label}” for ${monitorTargetLabel(monitor)}:${monitor.servicePort}?`, { title: 'Remove monitor', kind: 'warning' });
    if (!accepted) return;
    try {
      await dashboardDeleteMonitor(monitor.id);
      setMonitors((current) => current.filter((item) => item.id !== monitor.id));
      setMonitorSnapshots((current) => { const next = { ...current }; delete next[monitor.id]; return next; });
    } catch (error) {
      setMonitorErrors((current) => ({ ...current, [monitor.id]: String(error) }));
    }
  };

  const runKill = async (monitor: MonitorConfig, processes: MonitorProcessIdentity[], mode: 'normal' | 'force', sudo?: string) => {
    const actionKey = `${monitor.id}:${processes.map((process) => process.pid).join(',')}`;
    setKillBusy(actionKey);
    setMonitorErrors((current) => ({ ...current, [monitor.id]: '' }));
    try {
      const result = await dashboardKillProcesses(monitor.id, processes, mode, sudo);
      setForceablePids((current) => ({ ...current, [monitor.id]: result.forceAvailable ? result.stillListening : [] }));
      await refreshAll();
      setSudoPrompt(null);
      setSudoPassword('');
    } catch (error) {
      const message = String(error);
      if (!sudo && monitor.targetOs !== 'windows' && /permission|operation not permitted|sudo/i.test(message)) {
        setSudoPrompt({ monitor, processes, mode });
      } else {
        setMonitorErrors((current) => ({ ...current, [monitor.id]: message }));
      }
    } finally {
      setKillBusy(null);
    }
  };

  const confirmKill = async (monitor: MonitorConfig, processes: MonitorProcessIdentity[], mode: 'normal' | 'force') => {
    const pidText = processes.map((process) => process.pid).join(', ');
    const accepted = await confirm(`${mode === 'force' ? 'Force kill' : 'Stop'} PID ${pidText} on ${monitorTargetLabel(monitor)}:${monitor.servicePort}? The backend will reject any PID whose start identity changed.`, { title: mode === 'force' ? 'Force kill listener' : 'Stop listener', kind: 'warning' });
    if (accepted) await runKill(monitor, processes, mode);
  };

  // ── Proxy actions ───────────────────────────────────────────────
  const toggleProxy = async () => {
    setPxyLoading(true);
    setPxyErr(null);
    try {
      if (pxyStatus?.running) {
        await invoke('module_call', { moduleId: 'clx.cli-proxy', method: 'clx.cli-proxy.stop', params: {} });
      } else {
        await invoke('module_call', { moduleId: 'clx.cli-proxy', method: 'clx.cli-proxy.start', params: {} });
      }
      await refreshAll();
    } catch (e) {
      setPxyErr(String(e));
    } finally {
      setPxyLoading(false);
    }
  };

  // ── Grid layout for ports ───────────────────────────────────────
  const portGridCols = monitors.length <= 2 ? 1 : 2;

  return (
    <div className="h-full bg-cyber-base font-mono text-xs text-slate-300 flex flex-col overflow-hidden">
      {/* ═══ Resource Bar (top) ═══ */}
      <div className="flex items-center gap-6 px-5 py-2.5 border-b border-cyber-line/30 shrink-0 select-none">
        <span className="text-[9px] uppercase tracking-[0.15em] text-slate-600">CLX</span>
        {usage ? (
          <>
            <span className="text-xl font-black text-cyber-neon leading-none">{fmtMemShort(usage.uiMemoryMb)}</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-slate-500">UI-owned · full service tree {fmtMemShort(usage.treeMemoryMb)}</span>
              <span className="text-[9px] text-slate-600">{usage.processCount} processes · {usage.webviewCount} WebViews · lag p95 {uiHealth.p95LagMs.toFixed(0)} ms{uiHealth.maxLongTaskMs ? ` · long ${uiHealth.maxLongTaskMs.toFixed(0)} ms` : ''}</span>
            </div>
          </>
        ) : (
          <span className="text-[9px] text-slate-700 italic">loading…</span>
        )}
        {resError && <span className="text-[9px] text-red-400 ml-2">{resError}</span>}
      </div>

      {/* ═══ 2×2 Grid ═══ */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 p-4 min-h-0 overflow-hidden">
        {/* ── System Logs (top-left) ── */}
        {widgets.syslogs ? (
          <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/10 flex flex-col overflow-hidden min-h-0 cursor-pointer" onClick={() => setExpandedWidget('syslogs')}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-line/20 shrink-0">
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-[9px] uppercase tracking-[0.12em] text-slate-500 font-bold">System Logs</h3>
                <span className="cursor-help rounded-full border border-slate-600/50 w-3.5 h-3.5 flex items-center justify-center text-[8px] text-slate-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors leading-none" title={TOOLTIPS.syslogs}>?</span>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">{sysLogs.length} entries</span>
                <button type="button" onClick={() => toggleWidget('syslogs')} className="rounded border border-amber-500/40 bg-amber-500/5 px-1.5 py-0.5 text-[8px] font-black uppercase text-amber-400 hover:bg-amber-500/15">OFF</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-1.5 min-h-0 space-y-0.5">
              {sysLogErr ? (
                <div className="flex items-center justify-center h-full text-[10px] text-red-400">{sysLogErr}</div>
              ) : (
                sysLogs.slice(0, 30).map((l, i) => (
                  <div key={i} className="text-[10px] leading-relaxed truncate">
                    <span className="text-slate-600 mr-1">{l.timestamp}</span>
                    <span className={`font-semibold mr-1 ${LEVEL_CLASSES[l.level] || 'text-slate-400'}`}>{l.level.padEnd(5, '\u00A0')}</span>
                    <span className="text-cyan-500/70 mr-1">{l.source}</span>
                    <span className="text-slate-300">{l.message}</span>
                  </div>
                ))
              )}
              <div className="text-[8px] text-slate-600 text-center pt-1">Click to expand → full log viewer with level filter</div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/5 flex items-center justify-center min-h-0">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] uppercase tracking-wider text-slate-600">System Logs off</span>
              <button type="button" onClick={() => toggleWidget('syslogs')} className="rounded border border-green-500/40 bg-green-500/5 px-3 py-1.5 text-[9px] font-black uppercase text-green-400 hover:bg-green-500/15">Turn ON</button>
            </div>
          </div>
        )}

        {/* ── Port Monitor (top-right) ── */}
        {widgets.portmon ? (
          <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/10 flex flex-col overflow-hidden min-h-0">
            <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-line/20 shrink-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[9px] uppercase tracking-[0.12em] text-slate-500 font-bold">Port Monitor</h3>
                <span className="cursor-help rounded-full border border-slate-600/50 w-3.5 h-3.5 flex items-center justify-center text-[8px] text-slate-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors leading-none" title={TOOLTIPS.portmon}>?</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">{monitors.length} tracked</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => toggleWidget('portmon')} className="rounded border border-amber-500/40 bg-amber-500/5 px-1.5 py-0.5 text-[8px] font-black uppercase text-amber-400 hover:bg-amber-500/15">OFF</button>
                <button type="button" onClick={() => { setEditingMonitor(null); setEditorOpen(true); }} className="rounded border border-cyber-electric/40 bg-cyber-electric/5 px-2 py-1 text-[8px] font-black uppercase text-cyber-electric hover:bg-cyber-electric/10">+ Monitor</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
              {monitorErrors._load && <div className="mb-2 rounded border border-red-500/30 bg-red-500/5 p-2 text-[9px] text-red-300">{monitorErrors._load}</div>}
              {monitors.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-600">
                  <span className="text-[9px] uppercase tracking-wider">No services tracked</span>
                  <button type="button" onClick={() => { setEditingMonitor(null); setEditorOpen(true); }} className="rounded border border-cyber-electric/40 px-3 py-1.5 text-[9px] font-bold uppercase text-cyber-electric">Add local or SSH monitor</button>
                </div>
              ) : (
                <div className={`grid gap-2 ${portGridCols === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {monitors.map((monitor) => {
                    const snapshot = monitorSnapshots[monitor.id];
                    const status = snapshot?.status || 'stale';
                    const alive = status === 'listening';
                    const isExpanded = expandedMonitor === monitor.id;
                    const listeners = snapshot?.listeners || [];
                    const killableListeners = listeners.filter((listener) => listener.startToken.trim().length > 0);
                    const canOpenLogs = alive && (monitor.logSource.kind !== 'auto' || listeners.length > 0);
                    const forceSet = new Set(forceablePids[monitor.id] || []);
                    return (
                      <div key={monitor.id} className={`rounded-lg border p-2.5 transition-colors ${MONITOR_STATUS_CLASSES[status] || MONITOR_STATUS_CLASSES.stale}`}>
                        <button type="button" className="flex w-full items-center gap-2 text-left" onClick={() => setExpandedMonitor(isExpanded ? null : monitor.id)}>
                          <div className={`h-2 w-2 shrink-0 rounded-full ${alive ? 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]' : status === 'notListening' ? 'bg-red-500' : 'bg-amber-400'}`} />
                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-center gap-1.5"><span className="truncate text-[10px] font-bold text-slate-100">{monitor.label}</span><span className="text-[10px] font-black text-cyan-400">:{monitor.servicePort}</span></div>
                            <div className="truncate text-[8px] text-slate-600" title={monitorTargetLabel(monitor)}>{monitorTargetLabel(monitor)}</div>
                          </div>
                          {monitor.targetType === 'ssh' && <span className="rounded border border-amber-500/20 px-1 py-0.5 text-[7px] font-black text-amber-400">UNVERIFIED</span>}
                          <span className="text-[8px] uppercase text-slate-500">{status}</span>
                          <span className="text-slate-600">{isExpanded ? '▴' : '▾'}</span>
                        </button>
                        {/* ... (existing port monitor expand content unchanged) ... */}
                        {alive && listeners[0] && (
                          <div className="mt-1.5 flex items-center gap-3 text-[9px]">
                            <span className="text-green-400">{fmtMemShort(listeners.reduce((sum, item) => sum + item.memoryMb, 0))}</span>
                            <span className="text-slate-600">{listeners.length} PID{listeners.length === 1 ? '' : 's'}</span>
                            <span className="text-amber-400">{fmtUptime(Math.max(...listeners.map((item) => item.uptimeSeconds)))}</span>
                            <button type="button" onClick={() => setLogMonitorId(monitor.id)} className="ml-auto rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase text-amber-300">Logs</button>
                          </div>
                        )}
                        {alive && !listeners[0] && (
                          <div className="mt-1.5 flex items-center gap-2 text-[9px] text-slate-500">
                            <span>TCP listener found · process metadata unavailable</span>
                            {monitor.logSource.kind !== 'auto' && <button type="button" onClick={() => setLogMonitorId(monitor.id)} className="ml-auto rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase text-amber-300">Logs</button>}
                          </div>
                        )}
                        {!alive && <div className="mt-1 text-[9px] text-slate-500">{snapshot?.error || (status === 'notListening' ? 'TCP port is not listening' : 'Waiting for probe…')}</div>}
                        {monitorErrors[monitor.id] && <div className="mt-1 break-words text-[8px] text-red-300">{monitorErrors[monitor.id]}</div>}
                        {isExpanded && (
                          <div className="mt-2 space-y-2 border-t border-cyber-line/20 pt-2">
                            {listeners.map((listener) => {
                              const actionKey = `${monitor.id}:${listener.pid}`;
                              const force = forceSet.has(listener.pid);
                              const canKill = listener.startToken.trim().length > 0;
                              return (
                                <div key={`${listener.pid}:${listener.startToken}`} className="rounded border border-cyber-line/30 bg-black/20 p-2">
                                  <div className="flex items-center gap-2"><span className="font-bold text-slate-200">PID {listener.pid}</span><span className="min-w-0 flex-1 truncate text-[9px] text-slate-500">{listener.processName}</span><button type="button" title={canKill ? 'Revalidates PID and start identity before stopping' : 'Stable process start identity is unavailable'} disabled={!canKill || killBusy === actionKey} onClick={() => void confirmKill(monitor, [listener], force ? 'force' : 'normal')} className={`rounded border px-1.5 py-0.5 text-[8px] font-black uppercase disabled:opacity-50 ${force ? 'border-red-500 bg-red-500/20 text-red-200' : 'border-red-500/40 text-red-400'}`}>{force ? 'Force' : 'Stop'}</button></div>
                                  {listener.exePath && <div className="mt-1 truncate text-[8px] text-slate-600" title={listener.exePath}>{fmtPath(listener.exePath, 58)}</div>}
                                  <div className="mt-1 flex gap-3 text-[8px] text-slate-600"><span>{fmtMemShort(listener.memoryMb)}</span><span>CPU {listener.cpuTimeSeconds.toFixed(1)}s</span><span>{fmtUptime(listener.uptimeSeconds)}</span></div>
                                </div>
                              );
                            })}
                            {killableListeners.length > 1 && <button type="button" onClick={() => void confirmKill(monitor, killableListeners, killableListeners.some((item) => forceSet.has(item.pid)) ? 'force' : 'normal')} className="w-full rounded border border-red-500/40 bg-red-500/5 py-1 text-[8px] font-black uppercase text-red-400">{killableListeners.some((item) => forceSet.has(item.pid)) ? 'Force all confirmed PIDs' : 'Stop all confirmed PIDs'}</button>}
                            <div className="grid grid-cols-3 gap-1.5">
                              <button type="button" disabled={!canOpenLogs} onClick={() => setLogMonitorId(monitor.id)} className="rounded border border-amber-500/40 py-1 text-[8px] font-bold uppercase text-amber-300 disabled:opacity-40">Live logs</button>
                              <button type="button" onClick={() => { setEditingMonitor(monitor); setEditorOpen(true); }} className="rounded border border-cyber-line py-1 text-[8px] font-bold uppercase text-slate-400">Edit</button>
                              <button type="button" onClick={() => void removeMonitor(monitor)} className="rounded border border-red-500/30 py-1 text-[8px] font-bold uppercase text-red-400">Remove</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/5 flex items-center justify-center min-h-0">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] uppercase tracking-wider text-slate-600">Port Monitor off</span>
              <button type="button" onClick={() => toggleWidget('portmon')} className="rounded border border-green-500/40 bg-green-500/5 px-3 py-1.5 text-[9px] font-black uppercase text-green-400 hover:bg-green-500/15">Turn ON</button>
            </div>
          </div>
        )}

        {/* ── LLM Proxy (bottom-left) ── */}
        {widgets.proxy ? (
          <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/10 flex flex-col overflow-hidden min-h-0 cursor-pointer" onClick={() => setExpandedWidget('proxy')}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-line/20 shrink-0">
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-[9px] uppercase tracking-[0.12em] text-slate-500 font-bold">LLM Proxy</h3>
                <span className="cursor-help rounded-full border border-slate-600/50 w-3.5 h-3.5 flex items-center justify-center text-[8px] text-slate-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors leading-none" title={TOOLTIPS.proxy}>?</span>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {pxyStatus && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">{pxyStatus.activeBackends} backends</span>
                )}
                <button type="button" onClick={() => toggleWidget('proxy')} className="rounded border border-amber-500/40 bg-amber-500/5 px-1.5 py-0.5 text-[8px] font-black uppercase text-amber-400 hover:bg-amber-500/15">OFF</button>
                <button type="button" onClick={toggleProxy} disabled={pxyLoading} className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border transition-colors ${pxyStatus?.running ? 'border-red-500/40 bg-red-500/8 text-red-400 hover:bg-red-500/15' : 'border-green-500/40 bg-green-500/8 text-green-400 hover:bg-green-500/15'} ${pxyLoading ? 'opacity-50' : ''}`}>
                  {pxyLoading ? '…' : pxyStatus?.running ? 'STOP' : 'START'}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-1.5 min-h-0 space-y-0.5">
              {pxyErr ? (
                <div className="flex items-center justify-center h-full text-[10px] text-red-400">{pxyErr}</div>
              ) : (
                <>
                  {pxyStatus && (
                    <div className="flex items-center gap-2 text-[10px] pb-1.5 border-b border-cyber-line/15 mb-1">
                      <div className={`w-2 h-2 rounded-full ${pxyStatus.running ? 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'bg-red-500'}`} />
                      <span className="text-cyber-electric font-bold">:{pxyStatus.port}</span>
                      <span className="text-slate-500">{pxyStatus.running ? 'running' : 'stopped'}</span>
                      {pxyStatus.running && <span className="text-slate-600 ml-auto">{pxyStatus.totalRequests} req</span>}
                    </div>
                  )}
                  {[...pxyLogs].reverse().slice(0, 10).map((l) => {
                    const lastUserMsg = extractLastUserMsg(l.requestJson);
                    const respPreview = extractResponsePreview(l.responseJson, l.normalizedResponseJson);
                    return (
                      <div key={l.id} className="border-b border-cyber-line/10 pb-0.5">
                        <div className="flex flex-col hover:bg-white/[0.02] rounded px-1 py-0.5 transition-colors">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="text-slate-600 w-[50px] shrink-0">{l.timestamp}</span>
                            <span className={`font-semibold min-w-[28px] ${l.success ? 'text-green-400' : 'text-red-400'}`}>{l.status}</span>
                            <span className="text-cyan-500/70 truncate flex-1 min-w-0">{l.backend}/{l.model}</span>
                            <span className="text-slate-500 shrink-0">{l.durationMs}ms</span>
                            {l.totalTokens > 0 && <span className="text-[8px] text-slate-600 shrink-0">{l.totalTokens.toLocaleString()}t</span>}
                          </div>
                          {(lastUserMsg || respPreview) && (
                            <div className="flex flex-col gap-0.5 mt-0.5 text-[9px]">
                              {lastUserMsg && <span className="text-amber-400/80 truncate max-w-full">Q: {lastUserMsg}</span>}
                              {respPreview && <span className="text-green-400/70 truncate max-w-full">A: {respPreview}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {pxyLogs.length === 0 && <div className="flex items-center justify-center h-full text-[10px] text-slate-600 italic">No proxy requests yet</div>}
                  <div className="text-[8px] text-slate-600 text-center pt-1">Click to expand → full proxy log</div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/5 flex items-center justify-center min-h-0">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] uppercase tracking-wider text-slate-600">LLM Proxy off</span>
              <button type="button" onClick={() => toggleWidget('proxy')} className="rounded border border-green-500/40 bg-green-500/5 px-3 py-1.5 text-[9px] font-black uppercase text-green-400 hover:bg-green-500/15">Turn ON</button>
            </div>
          </div>
        )}

        {/* ── Target Monitor + Connection Log (bottom-right) ── */}
        <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/10 flex flex-col overflow-hidden min-h-0">
          {/* ══ Top half: Target Monitor ══ */}
          {widgets.targetmon ? (
            <div className="flex flex-col flex-1 min-h-0 border-b border-cyber-line/20">
              <div className="flex items-center justify-between px-3 py-1.5 shrink-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[9px] uppercase tracking-[0.12em] text-slate-500 font-bold">Target Monitor</h3>
                  <span className="cursor-help rounded-full border border-slate-600/50 w-3.5 h-3.5 flex items-center justify-center text-[8px] text-slate-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors leading-none" title={TOOLTIPS.targetmon}>?</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">{targetConns.length} conns</span>
                  <button type="button" onClick={() => toggleWidget('targetmon')} className="rounded border border-amber-500/40 bg-amber-500/5 px-1.5 py-0.5 text-[8px] font-black uppercase text-amber-400 hover:bg-amber-500/15">OFF</button>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 pb-1.5 shrink-0">
                <input type="text" value={targetInput} onChange={(e) => setTargetInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setTarget(targetInput.trim()); void refreshAll(); } }}
                  placeholder="IP or domain (e.g. 8.8.8.8, github.com)"
                  className="flex-1 rounded border border-cyber-line/50 bg-cyber-base px-2 py-0.5 text-[10px] text-slate-200 outline-none focus:border-cyber-electric" />
                <button type="button" onClick={() => { setTarget(targetInput.trim()); void refreshAll(); }}
                  className="rounded border border-cyber-electric/40 bg-cyber-electric/5 px-2 py-0.5 text-[8px] font-black uppercase text-cyber-electric hover:bg-cyber-electric/10">Track</button>
                {target && (
                  <button type="button" onClick={() => { setTarget(''); setTargetInput(''); setTargetConns([]); setTargetError(null); }}
                    className="rounded border border-red-500/30 px-2 py-0.5 text-[8px] font-black uppercase text-red-400">Clear</button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto px-3 pb-1 min-h-0 space-y-0.5">
                {targetError ? (
                  <div className="text-[10px] text-red-400 text-center py-2">{targetError}</div>
                ) : !target ? (
                  <div className="flex items-center justify-center h-full text-[9px] text-slate-600">Enter a target IP/domain</div>
                ) : targetConns.length === 0 ? (
                  <div className="text-[9px] text-slate-600 text-center py-2">No active connections to {target}</div>
                ) : (
                  targetConns.map((conn, i) => (
                    <div key={i} className="flex items-center gap-1 text-[9px] leading-relaxed py-0.5 border-b border-cyber-line/10">
                      <span className="text-slate-600 shrink-0">{conn.state}</span>
                      <span className="text-cyan-400/80 shrink-0">{conn.localAddr}:{conn.localPort}</span>
                      <span className="text-slate-600 shrink-0">→</span>
                      <span className="text-green-400/80 truncate">{conn.remoteAddr}:{conn.remotePort}</span>
                      {conn.processName && <span className="text-slate-500 shrink-0 ml-auto text-[8px]">{conn.processName}{conn.pid ? ` (${conn.pid})` : ''}</span>}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-0 border-b border-cyber-line/20 items-center justify-center gap-3">
              <span className="text-[9px] uppercase tracking-wider text-slate-600">Target Monitor off</span>
              <button type="button" onClick={() => toggleWidget('targetmon')} className="rounded border border-green-500/40 bg-green-500/5 px-3 py-1.5 text-[9px] font-black uppercase text-green-400 hover:bg-green-500/15">Turn ON</button>
            </div>
          )}

          {/* ══ Bottom half: Connection Log ══ */}
          {widgets.connlog ? (
            <div className="flex flex-col flex-1 min-h-0 cursor-pointer" onClick={() => setExpandedWidget('connlog')}>
              <div className="flex items-center justify-between px-3 py-1.5 shrink-0 border-b border-cyber-line/20">
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-[9px] uppercase tracking-[0.12em] text-slate-500 font-bold">Connection Log</h3>
                  <span className="cursor-help rounded-full border border-slate-600/50 w-3.5 h-3.5 flex items-center justify-center text-[8px] text-slate-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors leading-none" title={TOOLTIPS.connlog}>?</span>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">{allConns.length} conns</span>
                  <button type="button" onClick={() => toggleWidget('connlog')} className="rounded border border-amber-500/40 bg-amber-500/5 px-1.5 py-0.5 text-[8px] font-black uppercase text-amber-400 hover:bg-amber-500/15">OFF</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-3 pb-1 min-h-0 space-y-0.5">
                {allConnsError ? (
                  <div className="text-[10px] text-red-400 text-center py-2">{allConnsError}</div>
                ) : allConns.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-[10px] text-slate-600 italic">No active connections</div>
                ) : (
                  (() => {
                    const sorted = sortConnsByRemoteFreq(allConns);
                    return sorted.slice(0, 25).map((conn, i) => (
                      <div key={i} className="flex items-center gap-1 text-[9px] leading-relaxed py-0.5 border-b border-cyber-line/10">
                        <span className={`shrink-0 w-[55px] ${conn.state === 'ESTABLISHED' ? 'text-green-400' : conn.state === 'LISTENING' ? 'text-cyan-400' : 'text-amber-400'}`}>{conn.state}</span>
                        <span className="text-cyan-400/80 shrink-0">{conn.localAddr}:{conn.localPort}</span>
                        <span className="text-slate-600 shrink-0">→</span>
                        <span className="text-green-400/80 truncate">{conn.remoteAddr}:{conn.remotePort}</span>
                        {conn.processName && <span className="text-slate-500 shrink-0 ml-auto text-[8px]">{conn.processName}{conn.pid ? ` (${conn.pid})` : ''}</span>}
                      </div>
                    ));
                  })()
                )}
                <div className="text-[8px] text-slate-600 text-center pt-1">Click to expand → aggregate stats + full list</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-0 items-center justify-center gap-3">
              <span className="text-[9px] uppercase tracking-wider text-slate-600">Connection Log off</span>
              <button type="button" onClick={() => toggleWidget('connlog')} className="rounded border border-green-500/40 bg-green-500/5 px-3 py-1.5 text-[9px] font-black uppercase text-green-400 hover:bg-green-500/15">Turn ON</button>
            </div>
          )}
        </div>
      </div>

      <MonitorEditorModal
        open={editorOpen}
        monitor={editingMonitor}
        onClose={() => { setEditorOpen(false); setEditingMonitor(null); }}
        onSaved={() => { void reloadMonitors(); }}
      />

      {logMonitorId && (() => {
        const monitor = monitors.find((item) => item.id === logMonitorId);
        if (!monitor) return null;
        return (
          <MonitorLogDrawer
            monitor={monitor}
            snapshot={monitorSnapshots[monitor.id] || null}
            onClose={() => setLogMonitorId(null)}
          />
        );
      })()}

      {sudoPrompt && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <form
            className="w-full max-w-sm rounded-xl border border-amber-500/30 bg-cyber-panel p-5 shadow-2xl"
            onSubmit={(event) => {
              event.preventDefault();
              if (!sudoPassword) return;
              void runKill(sudoPrompt.monitor, sudoPrompt.processes, sudoPrompt.mode, sudoPassword);
            }}
          >
            <h2 className="font-display text-xs font-black uppercase tracking-[0.12em] text-amber-300">Elevation required</h2>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
              Enter the sudo password for {monitorTargetLabel(sudoPrompt.monitor)}. It is sent only to this action and is never stored.
            </p>
            <input
              autoFocus
              type="password"
              value={sudoPassword}
              onChange={(event) => setSudoPassword(event.target.value)}
              placeholder="sudo password"
              className="mt-4 w-full rounded border border-amber-500/30 bg-cyber-base px-3 py-2 text-[11px] text-slate-100 outline-none focus:border-amber-400"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => { setSudoPrompt(null); setSudoPassword(''); }} className="rounded border border-cyber-line px-3 py-1.5 text-[9px] font-bold uppercase text-slate-400">Cancel</button>
              <button type="submit" disabled={!sudoPassword || !!killBusy} className="rounded border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-[9px] font-black uppercase text-amber-300 disabled:opacity-50">{killBusy ? 'Working…' : 'Retry with sudo'}</button>
            </div>
          </form>
        </div>
      )}

      {/* ═══ Expand Modals ═══ */}
      {expandedWidget === 'syslogs' && (
        <ExpandModal title="System Logs — Full Viewer" onClose={() => setExpandedWidget(null)}>
          <div className="p-4 space-y-1">
            {sysLogs.map((l, i) => (
              <div key={i} className="text-[10px] leading-relaxed border-b border-cyber-line/10 py-1">
                <span className="text-slate-600 mr-2">{l.timestamp}</span>
                <span className={`font-semibold mr-2 ${LEVEL_CLASSES[l.level] || 'text-slate-400'}`}>{l.level.padEnd(5, '\u00A0')}</span>
                <span className="text-cyan-500/70 mr-2">{l.source}</span>
                <span className="text-slate-300">{l.message}</span>
              </div>
            ))}
          </div>
        </ExpandModal>
      )}

      {expandedWidget === 'proxy' && (
        <ExpandModal title="LLM Proxy — Full Log" onClose={() => setExpandedWidget(null)}>
          <div className="p-4 space-y-2">
            {pxyStatus && (
              <div className="flex items-center gap-3 text-[11px] pb-3 border-b border-cyber-line/20 mb-3">
                <div className={`w-2 h-2 rounded-full ${pxyStatus.running ? 'bg-green-400' : 'bg-red-500'}`} />
                <span className="text-cyber-electric font-bold">Port :{pxyStatus.port}</span>
                <span className="text-slate-500">{pxyStatus.running ? 'running' : 'stopped'}</span>
                <span className="text-slate-600">{pxyStatus.totalRequests} total requests</span>
                <span className="text-slate-600 ml-auto">{pxyStatus.activeBackends} backends</span>
              </div>
            )}
            {[...pxyLogs].reverse().map((l) => {
              const lastUserMsg = extractLastUserMsg(l.requestJson);
              const respPreview = extractResponsePreview(l.responseJson, l.normalizedResponseJson);
              return (
                <div key={l.id} className="border-b border-cyber-line/10 pb-2">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-slate-600 w-[60px]">{l.timestamp}</span>
                    <span className={`font-semibold ${l.success ? 'text-green-400' : 'text-red-400'}`}>{l.status}</span>
                    <span className="text-cyan-400">{l.backend}/{l.model}</span>
                    <span className="text-slate-500">{l.durationMs}ms</span>
                    {l.totalTokens > 0 && <span className="text-[9px] text-slate-600">{l.promptTokens}P + {l.completionTokens}C = {l.totalTokens}t</span>}
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[8px] uppercase text-slate-600 mb-1">Request</div>
                      <pre className="text-[9px] text-amber-300/80 bg-black/20 rounded p-2 max-h-[200px] overflow-y-auto whitespace-pre-wrap">{l.requestJson}</pre>
                    </div>
                    <div>
                      <div className="text-[8px] uppercase text-slate-600 mb-1">Response</div>
                      <pre className="text-[9px] text-green-300/80 bg-black/20 rounded p-2 max-h-[200px] overflow-y-auto whitespace-pre-wrap">{l.normalizedResponseJson || l.responseJson || '(empty)'}</pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ExpandModal>
      )}

      {expandedWidget === 'connlog' && (
        <ExpandModal title="Connection Log — Aggregate Stats + Full List" onClose={() => setExpandedWidget(null)}>
          <div className="p-4 space-y-4">
            {(() => {
              const stats = computeConnAggregates(connHistoryRef.current);
              return (
                <>
                  {/* Aggregate Stats Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {(['1m', '5m', '10m'] as const).map((label) => {
                      const s = stats[label];
                      if (!s) return null;
                      return (
                        <div key={label} className="rounded-lg border border-cyber-line/30 bg-black/20 p-3">
                          <div className="text-[8px] uppercase tracking-[0.12em] text-slate-500 mb-2">Last {label}</div>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                            <span className="text-slate-600">Established</span>
                            <span className="text-green-400 text-right font-bold">{s.established}</span>
                            <span className="text-slate-600">Listening</span>
                            <span className="text-cyan-400 text-right font-bold">{s.listening}</span>
                            <span className="text-slate-600">Total</span>
                            <span className="text-slate-300 text-right font-bold">{s.total}</span>
                            <span className="text-slate-600">Unique remotes</span>
                            <span className="text-amber-400 text-right font-bold">{s.uniqueRemotes}</span>
                          </div>
                          {s.topRemotes.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-cyber-line/20">
                              <div className="text-[8px] uppercase text-slate-600 mb-1">Top remotes</div>
                              {s.topRemotes.map(([addr, count], j) => (
                                <div key={j} className="flex items-center justify-between text-[9px] text-slate-400">
                                  <span className="truncate max-w-[140px]">{addr}</span>
                                  <span className="text-cyan-400">{count}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Full connection list */}
                  <div>
                    <div className="text-[8px] uppercase tracking-[0.12em] text-slate-500 mb-2">All connections (sorted by frequency)</div>
                    <div className="space-y-0.5 max-h-[50vh] overflow-y-auto">
                      {sortConnsByRemoteFreq(allConns).map((conn, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] border-b border-cyber-line/10 py-1">
                          <span className={`shrink-0 w-[70px] ${conn.state === 'ESTABLISHED' ? 'text-green-400' : conn.state === 'LISTENING' ? 'text-cyan-400' : 'text-amber-400'}`}>{conn.state}</span>
                          <span className="text-cyan-400/80 shrink-0">{conn.localAddr}:{conn.localPort}</span>
                          <span className="text-slate-600">→</span>
                          <span className="text-green-400/80 truncate">{conn.remoteAddr}:{conn.remotePort}</span>
                          {conn.processName && <span className="text-slate-500 shrink-0 ml-auto">{conn.processName}{conn.pid ? ` (${conn.pid})` : ''}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </ExpandModal>
      )}
    </div>
  );
}
