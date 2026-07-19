import { useEffect, useState, useRef, useCallback } from 'react';
import { confirm } from '@tauri-apps/plugin-dialog';
import {
  dashboardGetResourceUsage,
  dashboardDeleteMonitor,
  dashboardKillProcesses,
  dashboardListMonitors,
  dashboardProbeMonitors,
  dashboardUpsertMonitor,
  type ResourceUsage,
  type MonitorConfig,
  type MonitorProcessIdentity,
  type MonitorSnapshot,
} from '../lib/tauri';
import {
  getSystemLogs,
  proxyStatus,
  proxyStart,
  proxyStop,
  proxyGetLogs,
  getSshServerStatus,
  startSshServer,
  stopSshServer,
  type SshServerStatus,
} from '../lib/tauri';
import type { ProxyStatus, ProxyLogEntry, SystemLogEntry } from '../types';
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

export function DashboardPanel() {
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
  const [pxyStatus, setPxyStatus] = useState<ProxyStatus | null>(null);
  const [pxyLogs, setPxyLogs] = useState<ProxyLogEntry[]>([]);
  const [pxyErr, setPxyErr] = useState<string | null>(null);
  const [pxyLoading, setPxyLoading] = useState(false);

  // ═══ SSH Server ═══
  const [sshStatus, setSshStatus] = useState<SshServerStatus | null>(null);
  const [sshLogs, setSshLogs] = useState<string[]>([]);
  const [sshErr, setSshErr] = useState<string | null>(null);
  const [sshLoading, setSshLoading] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshInFlightRef = useRef(false);

  // ── Master refresh ──────────────────────────────────────────────
  const refreshAll = useCallback(async () => {
    if (refreshInFlightRef.current) return;
    refreshInFlightRef.current = true;
    try {
    // Resource usage
    try { setUsage(await dashboardGetResourceUsage()); setResError(null); } catch (e) { setResError(String(e)); }

    // Target-aware TCP monitors
    try {
      const snapshots = await dashboardProbeMonitors();
      setMonitorSnapshots((previous) => {
        const next = { ...previous };
        for (const snapshot of snapshots) next[snapshot.monitorId] = snapshot;
        return next;
      });
    } catch { /* keep the last known snapshots */ }

    // System logs
    try {
      setSysLogs(await getSystemLogs(50));
      setSysLogErr(null);
    } catch (e) { setSysLogErr(String(e)); }

    // Proxy
    try {
      setPxyStatus(await proxyStatus());
      setPxyLogs(await proxyGetLogs());
      setPxyErr(null);
    } catch (e) { setPxyErr(String(e)); }

    // SSH Server
    try {
      const st = await getSshServerStatus();
      setSshStatus(st);
      setSshLogs(st.logs.slice(-20));
      setSshErr(null);
    } catch (e) { setSshErr(String(e)); }
    } finally {
      refreshInFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    refreshAll();
    intervalRef.current = setInterval(refreshAll, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
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
        await proxyStop();
      } else {
        await proxyStart();
      }
      await refreshAll();
    } catch (e) {
      setPxyErr(String(e));
    } finally {
      setPxyLoading(false);
    }
  };

  // ── SSH actions ─────────────────────────────────────────────────
  const toggleSsh = async () => {
    setSshLoading(true);
    setSshErr(null);
    try {
      if (sshStatus?.running) {
        await stopSshServer();
      } else {
        const port = sshStatus?.port ?? 2222;
        await startSshServer(port);
      }
      await refreshAll();
    } catch (e) {
      setSshErr(String(e));
    } finally {
      setSshLoading(false);
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
            <span className="text-xl font-black text-cyber-neon leading-none">{fmtMemShort(usage.memoryMb)}</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-slate-500">{usage.memoryPercent.toFixed(1)}% RAM</span>
              <span className="text-[9px] text-slate-600">{usage.childCount} children</span>
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
        <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/10 flex flex-col overflow-hidden min-h-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-line/20 shrink-0">
            <h3 className="text-[9px] uppercase tracking-[0.12em] text-slate-500 font-bold">System Logs</h3>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">
              {sysLogs.length} entries
            </span>
          </div>
          {sysLogErr ? (
            <div className="flex-1 flex items-center justify-center text-[10px] text-red-400 px-3">{sysLogErr}</div>
          ) : (
            <div className="flex-1 overflow-y-auto px-3 py-1.5 min-h-0 space-y-0.5">
              {sysLogs.slice(0, 30).map((l, i) => (
                <div key={i} className="text-[10px] leading-relaxed truncate">
                  <span className="text-slate-600 mr-1">{l.timestamp}</span>
                  <span className={`font-semibold mr-1 ${LEVEL_CLASSES[l.level] || 'text-slate-400'}`}>
                    {l.level.padEnd(5, '\u00A0')}
                  </span>
                  <span className="text-cyan-500/70 mr-1">{l.source}</span>
                  <span className="text-slate-300">{l.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Port Monitor (top-right) ── */}
        <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/10 flex flex-col overflow-hidden min-h-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-line/20 shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[9px] uppercase tracking-[0.12em] text-slate-500 font-bold">Port Monitor</h3>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">{monitors.length} tracked</span>
            </div>
            <button type="button" onClick={() => { setEditingMonitor(null); setEditorOpen(true); }} className="rounded border border-cyber-electric/40 bg-cyber-electric/5 px-2 py-1 text-[8px] font-black uppercase text-cyber-electric hover:bg-cyber-electric/10">+ Monitor</button>
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

        {/* ── LLM Proxy (bottom-left) ── */}
        <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/10 flex flex-col overflow-hidden min-h-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-line/20 shrink-0">
            <h3 className="text-[9px] uppercase tracking-[0.12em] text-slate-500 font-bold">LLM Proxy</h3>
            <div className="flex items-center gap-2">
              {pxyStatus && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">
                  {pxyStatus.activeBackends} backends
                </span>
              )}
              <button
                type="button"
                onClick={toggleProxy}
                disabled={pxyLoading}
                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border transition-colors ${
                  pxyStatus?.running
                    ? 'border-red-500/40 bg-red-500/8 text-red-400 hover:bg-red-500/15'
                    : 'border-green-500/40 bg-green-500/8 text-green-400 hover:bg-green-500/15'
                } ${pxyLoading ? 'opacity-50' : ''}`}
              >
                {pxyLoading ? '…' : pxyStatus?.running ? 'STOP' : 'START'}
              </button>
            </div>
          </div>
          {pxyErr ? (
            <div className="flex-1 flex items-center justify-center text-[10px] text-red-400 px-3">{pxyErr}</div>
          ) : (
            <div className="flex-1 overflow-y-auto px-3 py-1.5 min-h-0 space-y-0.5">
              {/* Status line */}
              {pxyStatus && (
                <div className="flex items-center gap-2 text-[10px] pb-1.5 border-b border-cyber-line/15 mb-1">
                  <div className={`w-2 h-2 rounded-full ${pxyStatus.running ? 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'bg-red-500'}`} />
                  <span className="text-cyber-electric font-bold">:{pxyStatus.port}</span>
                  <span className="text-slate-500">{pxyStatus.running ? 'running' : 'stopped'}</span>
                  {pxyStatus.running && (
                    <span className="text-slate-600 ml-auto">{pxyStatus.totalRequests} req</span>
                  )}
                </div>
              )}
              {/* Recent proxy logs — 10 latest (newest first), click opens Settings > Proxy Logs */}
              {[...pxyLogs].reverse().slice(0, 10).map((l) => {
                  const lastUserMsg = extractLastUserMsg(l.requestJson);
                  const respPreview = extractResponsePreview(l.responseJson, l.normalizedResponseJson);
                  return (
                  <div key={l.id} className="border-b border-cyber-line/10 pb-0.5">
                    <div
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('settings-select-section', { detail: 'proxy' }));
                        window.dispatchEvent(new CustomEvent('switch-main-view', { detail: 'settings' }));
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('proxy-select-subtab', { detail: 'logs' }));
                        }, 50);
                      }}
                      className="flex flex-col cursor-pointer hover:bg-white/[0.02] rounded px-1 py-0.5 transition-colors"
                    >
                      {/* Row 1: meta */}
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-600 w-[50px] shrink-0">{l.timestamp}</span>
                        <span className={`font-semibold min-w-[28px] ${l.success ? 'text-green-400' : 'text-red-400'}`}>
                          {l.status}
                        </span>
                        <span className="text-cyan-500/70 truncate flex-1 min-w-0">{l.backend}/{l.model}</span>
                        <span className="text-slate-500 shrink-0">{l.durationMs}ms</span>
                        {l.totalTokens > 0 && (
                          <span className="text-[8px] text-slate-600 shrink-0" title={`P:${l.promptTokens} C:${l.completionTokens}`}>
                            {l.totalTokens.toLocaleString()}t
                          </span>
                        )}
                        <span className="text-slate-600 shrink-0" title="Open in Settings → Proxy Logs">↗</span>
                      </div>
                      {/* Row 2: Q + A preview */}
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
              {pxyLogs.length === 0 && (
                <div className="flex items-center justify-center h-full text-[10px] text-slate-600 italic">
                  No proxy requests yet
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── SSH Server (bottom-right) ── */}
        <div className="rounded-xl border border-cyber-line/40 bg-cyber-panel/10 flex flex-col overflow-hidden min-h-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-line/20 shrink-0">
            <h3 className="text-[9px] uppercase tracking-[0.12em] text-slate-500 font-bold">SSH Server</h3>
            <button
              type="button"
              onClick={toggleSsh}
              disabled={sshLoading}
              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border transition-colors ${
                sshStatus?.running
                  ? 'border-red-500/40 bg-red-500/8 text-red-400 hover:bg-red-500/15'
                  : 'border-green-500/40 bg-green-500/8 text-green-400 hover:bg-green-500/15'
              } ${sshLoading ? 'opacity-50' : ''}`}
            >
              {sshLoading ? '…' : sshStatus?.running ? 'STOP' : 'START'}
            </button>
          </div>
          {sshErr ? (
            <div className="flex-1 flex items-center justify-center text-[10px] text-red-400 px-3">{sshErr}</div>
          ) : (
            <div className="flex-1 overflow-y-auto px-3 py-1.5 min-h-0 space-y-0.5">
              {/* Status line */}
              {sshStatus && (
                <div className="flex items-center gap-2 text-[10px] pb-1.5 border-b border-cyber-line/15 mb-1">
                  <div className={`w-2 h-2 rounded-full ${sshStatus.running ? 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'bg-red-500'}`} />
                  {sshStatus.running ? (
                    <>
                      <span className="text-cyber-electric font-bold">:{sshStatus.port}</span>
                      <span className="text-slate-400">{sshStatus.localIp}</span>
                      <span className="text-green-400 ml-auto">active</span>
                    </>
                  ) : (
                    <span className="text-slate-500">stopped</span>
                  )}
                </div>
              )}
              {/* SSH logs */}
              {sshLogs.length > 0 ? (
                sshLogs.map((line, i) => (
                  <div key={i} className="text-[10px] leading-relaxed truncate text-slate-400">
                    {line}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-1 text-slate-600">
                  <span className="text-[9px] uppercase tracking-wider">SSH server off</span>
                  <span className="text-[9px] text-slate-700 italic">Start to accept remote connections</span>
                </div>
              )}
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
              <button type="submit" disabled={!sudoPassword || !!killBusy} className="rounded border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-[9px] font-black uppercase text-amber-300 disabled:opacity-50">{killBusy ? 'Workingâ€¦' : 'Retry with sudo'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
