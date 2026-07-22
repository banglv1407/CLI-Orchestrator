import { useEffect, useMemo, useRef, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import {
  dashboardDiscoverLogSources,
  dashboardStartLogStream,
  dashboardStopLogStream,
  type MonitorConfig,
  type MonitorLogBatchEvent,
  type MonitorLogSource,
  type MonitorLogSourceCandidate,
  type MonitorLogStateEvent,
  type MonitorSnapshot,
} from '../lib/tauri';

interface MonitorLogDrawerProps {
  monitor: MonitorConfig;
  snapshot: MonitorSnapshot | null;
  onClose: () => void;
}

interface LogLine {
  sequence: number;
  stream: string;
  text: string;
}

const MAX_LINES = 5_000;
const MAX_BYTES = 2 * 1024 * 1024;
const RENDER_LINES = 500;
const FLUSH_MS = 100;
const PAUSED_COUNTER_MS = 250;

function boundedAppend(lines: LogLine[], additions: LogLine[]): LogLine[] {
  const result = additions.length ? lines.concat(additions) : lines;
  let bytes = result.reduce((total, line) => total + line.text.length * 2, 0);
  while (result.length > MAX_LINES || bytes > MAX_BYTES) {
    const removed = result.shift();
    if (removed) bytes -= removed.text.length * 2;
  }
  return result;
}

export function MonitorLogDrawer({ monitor, snapshot, onClose }: MonitorLogDrawerProps) {
  const [candidates, setCandidates] = useState<MonitorLogSourceCandidate[]>([]);
  const [selectedSource, setSelectedSource] = useState<MonitorLogSource | null>(monitor.logSource.kind === 'auto' ? null : monitor.logSource);
  const [discovering, setDiscovering] = useState(monitor.logSource.kind === 'auto');
  const [streamId, setStreamId] = useState<string | null>(null);
  const streamIdRef = useRef<string | null>(null);
  const [streamState, setStreamState] = useState<MonitorLogStateEvent['state']>('connecting');
  const [stateMessage, setStateMessage] = useState<string | null>(null);
  const [lines, setLines] = useState<LogLine[]>([]);
  const linesRef = useRef<LogLine[]>([]);
  const queuedLinesRef = useRef<LogLine[]>([]);
  const pausedRef = useRef(false);
  const pausedSinceRenderRef = useRef(0);
  const lastPendingRenderRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [search, setSearch] = useState('');
  const [useSudo, setUseSudo] = useState(false);
  const [sudoPassword, setSudoPassword] = useState('');
  const [starting, setStarting] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    streamIdRef.current = streamId;
  }, [streamId]);

  useEffect(() => {
    let cancelled = false;
    const discover = async () => {
      if (monitor.logSource.kind !== 'auto') return;
      const pid = snapshot?.listeners[0]?.pid;
      if (!pid) {
        setStateMessage('No listener PID is available for log discovery.');
        setDiscovering(false);
        return;
      }
      try {
        const found = await dashboardDiscoverLogSources(monitor.id, pid);
        if (cancelled) return;
        setCandidates(found);
        const highConfidence = found.filter((candidate) => candidate.confidence >= 90);
        if (highConfidence.length === 1) setSelectedSource(highConfidence[0].source);
        if (found.length === 0) setStateMessage('No reliable log source was found. Configure a manual source on this monitor.');
      } catch (error) {
        if (!cancelled) setStateMessage(String(error));
      } finally {
        if (!cancelled) setDiscovering(false);
      }
    };
    void discover();
    return () => { cancelled = true; };
  }, [monitor, snapshot]);

  useEffect(() => {
    const unlistenChunk = listen<MonitorLogBatchEvent>('dashboard-log-batch', (event) => {
      if (event.payload.streamId !== streamIdRef.current) return;
      queuedLinesRef.current.push(...event.payload.lines);
    });
    const unlistenState = listen<MonitorLogStateEvent>('dashboard-log-state', (event) => {
      if (event.payload.streamId !== streamIdRef.current) return;
      setStreamState(event.payload.state);
      setStateMessage(event.payload.message || null);
    });
    const flushTimer = window.setInterval(() => {
      if (queuedLinesRef.current.length === 0) return;
      const additions = queuedLinesRef.current.splice(0);
      linesRef.current = boundedAppend(linesRef.current, additions);
      if (!pausedRef.current) {
        setLines(linesRef.current);
        return;
      }
      pausedSinceRenderRef.current += additions.length;
      const now = Date.now();
      if (now - lastPendingRenderRef.current >= PAUSED_COUNTER_MS) {
        lastPendingRenderRef.current = now;
        setPendingCount(pausedSinceRenderRef.current);
      }
    }, FLUSH_MS);
    return () => {
      window.clearInterval(flushTimer);
      void unlistenChunk.then((dispose) => dispose());
      void unlistenState.then((dispose) => dispose());
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight });
  }, [lines, paused]);

  useEffect(() => () => {
    if (streamIdRef.current) void dashboardStopLogStream(streamIdRef.current);
  }, []);

  const visibleLines = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query ? lines.filter((line) => line.text.toLowerCase().includes(query)) : lines;
    return filtered.slice(-RENDER_LINES);
  }, [lines, search]);

  const start = async (source = selectedSource) => {
    if (!source) return;
    setStarting(true);
    setStateMessage(null);
    if (streamIdRef.current) await dashboardStopLogStream(streamIdRef.current);
    try {
      const started = await dashboardStartLogStream(monitor.id, source, useSudo ? sudoPassword : undefined);
      streamIdRef.current = started.streamId;
      setStreamId(started.streamId);
      setSelectedSource(started.source);
      setStreamState('connecting');
      setSudoPassword('');
    } catch (error) {
      setStreamState('error');
      setStateMessage(String(error));
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    if (selectedSource && !streamId && !discovering) void start(selectedSource);
    // Start once when discovery resolves or a configured source is present.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSource, discovering]);

  const close = async () => {
    if (streamIdRef.current) await dashboardStopLogStream(streamIdRef.current);
    onClose();
  };

  const togglePause = () => {
    setPaused((current) => {
      const next = !current;
      pausedRef.current = next;
      if (!next) {
        pausedSinceRenderRef.current = 0;
        setPendingCount(0);
        setLines(linesRef.current);
      }
      return next;
    });
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(linesRef.current.map((line) => line.text).join('\n'));
  };

  return (
    <div className="fixed inset-0 z-[75] flex justify-end bg-black/55 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) void close(); }}>
      <aside className="flex h-full w-full max-w-3xl flex-col border-l border-cyber-line bg-[#080d18] shadow-2xl">
        <header className="flex items-center gap-3 border-b border-cyber-line/50 px-4 py-3">
          <div className={`h-2.5 w-2.5 rounded-full ${streamState === 'following' ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : streamState === 'error' || streamState === 'needsElevation' ? 'bg-red-400' : 'bg-amber-400 animate-pulse'}`} />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-xs font-black uppercase tracking-[0.12em] text-slate-100">{monitor.label}</h2>
            <p className="truncate text-[9px] text-slate-500">TCP :{monitor.servicePort} · {selectedSource?.kind || 'selecting source'} · {streamState}</p>
          </div>
          {monitor.targetType === 'ssh' && <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[8px] font-black uppercase text-amber-300">SSH unverified</span>}
          <button type="button" onClick={() => void close()} className="text-xl text-slate-500 hover:text-white">×</button>
        </header>

        <div className="flex flex-wrap items-center gap-2 border-b border-cyber-line/30 bg-cyber-panel/30 px-4 py-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search current buffer" className="min-w-[180px] flex-1 rounded border border-cyber-line/50 bg-black/30 px-2.5 py-1.5 text-[10px] text-slate-200 outline-none focus:border-cyber-electric" />
          <button type="button" onClick={togglePause} className={`rounded border px-2.5 py-1.5 text-[9px] font-bold uppercase ${paused ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-cyber-line text-slate-400'}`}>{paused ? `Resume${pendingCount ? ` · ${pendingCount}` : ''}` : 'Pause'}</button>
          <button type="button" onClick={() => { linesRef.current = []; queuedLinesRef.current = []; setLines([]); setPendingCount(0); }} className="rounded border border-cyber-line px-2.5 py-1.5 text-[9px] font-bold uppercase text-slate-400">Clear</button>
          <button type="button" onClick={() => void copyAll()} className="rounded border border-cyber-line px-2.5 py-1.5 text-[9px] font-bold uppercase text-slate-400">Copy all</button>
        </div>

        {(discovering || (!selectedSource && candidates.length > 0)) && (
          <div className="border-b border-cyber-line/30 p-4">
            <p className="mb-2 text-[9px] font-black uppercase tracking-wider text-slate-500">{discovering ? 'Discovering log sources…' : 'Select a log source'}</p>
            <div className="grid gap-2">
              {candidates.map((candidate) => (
                <button key={candidate.id} type="button" onClick={() => setSelectedSource(candidate.source)} className="flex items-center gap-3 rounded border border-cyber-line/40 bg-cyber-panel/20 p-3 text-left hover:border-cyber-electric/50">
                  <span className="rounded bg-cyan-500/10 px-2 py-1 text-[9px] font-black text-cyan-300">{candidate.confidence}%</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-bold text-slate-200">{candidate.label}</span><span className="block truncate text-[9px] text-slate-500">{candidate.reason}</span></span>
                </button>
              ))}
            </div>
          </div>
        )}

        {(streamState === 'error' || streamState === 'needsElevation' || stateMessage) && (
          <div className="flex flex-wrap items-center gap-2 border-b border-red-500/20 bg-red-500/5 px-4 py-2">
            <span className="min-w-0 flex-1 text-[10px] text-red-300">{stateMessage}</span>
            {monitor.targetOs !== 'windows' && (
              <label className="flex items-center gap-1.5 text-[9px] text-slate-400"><input type="checkbox" checked={useSudo} onChange={(e) => setUseSudo(e.target.checked)} /> sudo</label>
            )}
            {useSudo && <input type="password" value={sudoPassword} onChange={(e) => setSudoPassword(e.target.value)} placeholder="sudo password" className="rounded border border-red-500/30 bg-black/30 px-2 py-1 text-[10px] outline-none" />}
            <button type="button" disabled={starting || !selectedSource || (useSudo && !sudoPassword)} onClick={() => void start()} className="rounded border border-red-500/40 px-2.5 py-1 text-[9px] font-bold uppercase text-red-300 disabled:opacity-50">Retry</button>
          </div>
        )}

        <div ref={viewportRef} className="flex-1 overflow-auto px-4 py-3 font-mono text-[11px] leading-relaxed">
          {visibleLines.length === 0 ? (
            <div className="flex h-full items-center justify-center text-[10px] italic text-slate-600">Waiting for log output…</div>
          ) : visibleLines.map((line) => (
            <div key={`${line.sequence}-${line.stream}`} className={`whitespace-pre-wrap break-words ${line.stream === 'stderr' ? 'text-red-300' : line.stream === 'system' ? 'text-amber-300' : 'text-slate-300'}`}>{line.text}</div>
          ))}
        </div>
        <footer className="flex items-center justify-between border-t border-cyber-line/30 px-4 py-2 text-[8px] uppercase tracking-wider text-slate-600"><span>{linesRef.current.length.toLocaleString()} / {MAX_LINES.toLocaleString()} lines · rendering {Math.min(visibleLines.length, RENDER_LINES)}</span><span>Memory-only · 2 MiB cap</span></footer>
      </aside>
    </div>
  );
}
