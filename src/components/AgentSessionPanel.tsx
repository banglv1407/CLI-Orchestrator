// Agent Session Browser — browse Hermes, Antigravity, Claude, and Codex sessions.
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { AgentSessionEntry, AgentSessionMessage, CliDefinition } from '../types';
import {
  agentListSessions,
  agentSessionPreview,
  agentExportSessionContext,
  createTerminalSession,
  listClis,
} from '../lib/tauri';

type AgentFilter = 'all' | 'hermes' | 'antigravity' | 'claude' | 'codex';
type DateFilter = 'all' | 'today' | '7d' | '30d';

interface TagFilter {
  type: 'model' | 'folder';
  value: string;
  display: string;
}

export interface ResumeCommandInfo {
  cliName: string;
  customArgs: string[];
  commandDisplay: string;
}

export function getAgentResumeCommand(session: AgentSessionEntry): ResumeCommandInfo {
  const agent = session.agent.toLowerCase();
  if (agent === 'hermes') {
    return {
      cliName: 'HM',
      customArgs: ['--resume', session.id],
      commandDisplay: `hermes --resume ${session.id}`,
    };
  }
  if (agent === 'claude') {
    return {
      cliName: 'CLAUDE',
      customArgs: ['--resume', session.id],
      commandDisplay: `claude --resume ${session.id}`,
    };
  }
  if (agent === 'codex') {
    return {
      cliName: 'Codex',
      customArgs: ['resume', session.id],
      commandDisplay: `codex resume ${session.id}`,
    };
  }
  if (agent === 'antigravity') {
    return {
      cliName: 'Antigravity',
      customArgs: ['--conversation', session.id],
      commandDisplay: `agy --conversation ${session.id}`,
    };
  }
  return {
    cliName: session.agent,
    customArgs: ['--resume', session.id],
    commandDisplay: `${session.agent} --resume ${session.id}`,
  };
}

function timeAgo(ts: number): string {
  if (!ts || ts <= 0) return '—';
  const now = Date.now() / 1000;
  const diff = now - ts;
  if (diff < 0) return 'vừa xong';
  if (diff < 60) return 'vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)}m trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h trước`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d trước`;
  const d = new Date(ts * 1000);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

function formatFullDate(ts: number): string {
  if (!ts || ts <= 0) return '—';
  const d = new Date(ts * 1000);
  return `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${d.toLocaleDateString()}`;
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…' : s;
}

export function AgentSessionPanel() {
  const [sessions, setSessions] = useState<AgentSessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<AgentSessionEntry | null>(null);
  const [messages, setMessages] = useState<AgentSessionMessage[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [availableClis, setAvailableClis] = useState<CliDefinition[]>([]);

  // Filters (default is SHOW ALL / no filter)
  const [agentFilter, setAgentFilter] = useState<AgentFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [tagFilter, setTagFilter] = useState<TagFilter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Status feedback
  const [copyPathStatus, setCopyPathStatus] = useState(false);
  const [copyContextStatus, setCopyContextStatus] = useState(false);
  const [copyResumeCmdStatus, setCopyResumeCmdStatus] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  // Load available CLIs and Sessions
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [sessList, clis] = await Promise.all([
        agentListSessions(),
        listClis().catch(() => [] as CliDefinition[]),
      ]);
      setSessions(sessList);
      setAvailableClis(clis);
    } catch (e) {
      console.error('agentListSessions', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Select session and load preview
  const selectSession = useCallback(async (session: AgentSessionEntry) => {
    if (selectedSession?.id === session.id) {
      setSelectedSession(null);
      setMessages([]);
      return;
    }
    setSelectedSession(session);
    setLoadingPreview(true);
    try {
      const msgs = await agentSessionPreview(
        session.id,
        session.agent,
        session.realPath,
        40
      );
      setMessages(msgs);
    } catch {
      setMessages([]);
    }
    setLoadingPreview(false);
    setTimeout(() => previewRef.current?.scrollTo({ top: 0 }), 50);
  }, [selectedSession]);

  // Resume session with the EXACT command for each agent CLI
  const handleResumeSession = useCallback(async (session: AgentSessionEntry) => {
    try {
      const resumeInfo = getAgentResumeCommand(session);

      // Verify if cli exists in available list, otherwise use fallback name
      const matched = availableClis.find(
        (c) =>
          c.name.toLowerCase() === resumeInfo.cliName.toLowerCase() ||
          c.name.toLowerCase() === session.agent.toLowerCase() ||
          c.command.toLowerCase() === session.agent.toLowerCase()
      );

      const targetCliName = matched ? matched.name : resumeInfo.cliName;

      await createTerminalSession({
        cliName: targetCliName,
        workingDir: session.cwd || undefined,
        customArgs: resumeInfo.customArgs,
      });

      window.dispatchEvent(new CustomEvent('switch-main-view', { detail: 'terminal' }));
    } catch (e) {
      console.error('Failed to resume session', e);
    }
  }, [availableClis]);

  // Copy resume command string
  const handleCopyResumeCmd = useCallback(async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopyResumeCmdStatus(true);
      setTimeout(() => setCopyResumeCmdStatus(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  }, []);

  // Copy real path on disk
  const handleCopyRealPath = useCallback(async () => {
    if (!selectedSession?.realPath) return;
    try {
      await navigator.clipboard.writeText(selectedSession.realPath);
      setCopyPathStatus(true);
      setTimeout(() => setCopyPathStatus(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  }, [selectedSession]);

  // Copy full context to clipboard
  const handleCopyContext = useCallback(async () => {
    if (!selectedSession) return;
    try {
      const res = await agentExportSessionContext({
        sessionId: selectedSession.id,
        agent: selectedSession.agent,
        realPath: selectedSession.realPath,
        cwd: selectedSession.cwd,
      });
      await navigator.clipboard.writeText(res.contextMarkdown);
      setCopyContextStatus(true);
      setTimeout(() => setCopyContextStatus(false), 2000);
    } catch (e) {
      console.error('Failed to copy context', e);
    }
  }, [selectedSession]);

  // Transfer session to target agent CLI
  const handleTransferToAgent = useCallback(async (targetCli: CliDefinition) => {
    if (!selectedSession) return;
    setTransferring(true);
    setTransferSuccess(null);
    try {
      // 1. Export context to disk file
      const res = await agentExportSessionContext({
        sessionId: selectedSession.id,
        agent: selectedSession.agent,
        realPath: selectedSession.realPath,
        cwd: selectedSession.cwd,
        targetAgent: targetCli.name,
      });

      // 2. Copy context to clipboard
      await navigator.clipboard.writeText(res.contextMarkdown).catch(() => {});

      // 3. Create new terminal session with target CLI
      await createTerminalSession({
        cliName: targetCli.name,
        workingDir: selectedSession.cwd || undefined,
      });

      setTransferSuccess(`Đã chuyển sang ${targetCli.name}! Context đã lưu & copy clipboard.`);
      setTimeout(() => setTransferSuccess(null), 3000);

      // 4. Switch to terminal view
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('switch-main-view', { detail: 'terminal' }));
      }, 400);
    } catch (e) {
      console.error('Transfer failed', e);
    } finally {
      setTransferring(false);
    }
  }, [selectedSession]);

  // Filtered and sorted sessions (Strict descending by newest date)
  const filteredSessions = useMemo(() => {
    const now = Date.now() / 1000;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayTs = startOfToday.getTime() / 1000;

    return sessions
      .filter((s) => {
        // 1. Agent filter
        if (agentFilter !== 'all') {
          if (s.agent.toLowerCase() !== agentFilter.toLowerCase()) return false;
        }

        // 2. Date filter
        const sTime = s.startedAt || 0;
        if (dateFilter === 'today') {
          if (sTime < startOfTodayTs) return false;
        } else if (dateFilter === '7d') {
          if (sTime < now - 7 * 86400) return false;
        } else if (dateFilter === '30d') {
          if (sTime < now - 30 * 86400) return false;
        }

        // 3. Active Tag filter (Model or Folder)
        if (tagFilter) {
          if (tagFilter.type === 'model') {
            if ((s.model || '').toLowerCase() !== tagFilter.value.toLowerCase()) return false;
          } else if (tagFilter.type === 'folder') {
            const sCwd = (s.cwd || '').toLowerCase();
            const fVal = tagFilter.value.toLowerCase();
            const sFolder = s.cwd ? s.cwd.split(/[/\\]/).filter(Boolean).pop()?.toLowerCase() || '' : '';
            if (sFolder !== fVal && !sCwd.includes(fVal)) return false;
          }
        }

        // 4. Text search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const titleMatch = (s.title || '').toLowerCase().includes(q);
          const modelMatch = (s.model || '').toLowerCase().includes(q);
          const cwdMatch = (s.cwd || '').toLowerCase().includes(q);
          const idMatch = s.id.toLowerCase().includes(q);
          if (!titleMatch && !modelMatch && !cwdMatch && !idMatch) return false;
        }

        return true;
      })
      .sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
  }, [sessions, agentFilter, dateFilter, tagFilter, searchQuery]);

  // Click on top Agent pills: sets agent and clears any conflicting specific tag
  const handleSelectAgent = useCallback((agent: AgentFilter) => {
    setAgentFilter(agent);
    setTagFilter(null);
  }, []);

  // Click on Agent badge on card: toggle this agent
  const handleToggleAgentTag = useCallback((agent: string) => {
    const a = agent.toLowerCase() as AgentFilter;
    setTagFilter(null);
    setAgentFilter((prev) => (prev === a ? 'all' : a));
  }, []);

  // Click on Model tag on card: toggle this model
  const handleToggleModelTag = useCallback((model: string) => {
    setTagFilter((prev) => {
      if (prev?.type === 'model' && prev.value.toLowerCase() === model.toLowerCase()) {
        return null;
      }
      return { type: 'model', value: model, display: model };
    });
    setAgentFilter('all');
  }, []);

  // Click on Folder tag on card: toggle this folder
  const handleToggleFolderTag = useCallback((folderPath: string) => {
    const folderName = folderPath.split(/[/\\]/).filter(Boolean).pop() || folderPath;
    setTagFilter((prev) => {
      if (prev?.type === 'folder' && prev.value.toLowerCase() === folderName.toLowerCase()) {
        return null;
      }
      return { type: 'folder', value: folderName, display: folderName };
    });
  }, []);

  // Agent counts
  const agentCounts = useMemo(() => {
    const counts = { all: sessions.length, hermes: 0, antigravity: 0, claude: 0, codex: 0 };
    for (const s of sessions) {
      const a = s.agent.toLowerCase();
      if (a === 'hermes') counts.hermes++;
      else if (a === 'antigravity') counts.antigravity++;
      else if (a === 'claude') counts.claude++;
      else if (a === 'codex') counts.codex++;
    }
    return counts;
  }, [sessions]);

  // Target agent CLIs for handoff
  const handoffClis = useMemo(() => {
    if (availableClis.length > 0) {
      return availableClis.filter((c) =>
        ['hm', 'hermes', 'claude', 'codex', 'antigravity', 'qwen', 'gemini', 'opencode', 'aider'].includes(
          c.name.toLowerCase()
        )
      );
    }
    // Fallback default agents
    return [
      { name: 'HM', command: 'hermes', args: [], mode: 'interactive', env: {}, enableRtk: false },
      { name: 'CLAUDE', command: 'claude', args: [], mode: 'interactive', env: {}, enableRtk: false },
      { name: 'Codex', command: 'codex', args: [], mode: 'interactive', env: {}, enableRtk: false },
      { name: 'Antigravity', command: 'agy', args: [], mode: 'interactive', env: {}, enableRtk: false },
    ] as CliDefinition[];
  }, [availableClis]);

  const getAgentBadge = (agent: string) => {
    const a = agent.toLowerCase();
    if (a === 'hermes') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm flex items-center gap-1">
          <span>🤖</span> Hermes
        </span>
      );
    }
    if (a === 'antigravity') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm flex items-center gap-1">
          <span>🪐</span> Antigravity
        </span>
      );
    }
    if (a === 'claude') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-sm flex items-center gap-1">
          <span>⚡</span> Claude
        </span>
      );
    }
    if (a === 'codex') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm flex items-center gap-1">
          <span>🔮</span> Codex
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-700 text-zinc-300">
        {agent}
      </span>
    );
  };

  const isFilterActive =
    agentFilter !== 'all' ||
    dateFilter !== 'all' ||
    tagFilter !== null ||
    searchQuery.trim() !== '';

  const clearAllFilters = useCallback(() => {
    setAgentFilter('all');
    setDateFilter('all');
    setTagFilter(null);
    setSearchQuery('');
  }, []);

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-100 overflow-hidden font-sans">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-700/60 bg-zinc-900/95 shrink-0">
        <span className="text-base font-bold tracking-wide flex items-center gap-1.5 text-zinc-100">
          <span>🗂</span> Agent Sessions
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
          {filteredSessions.length} / {sessions.length} sessions
        </span>
        <div className="flex-1" />
        {isFilterActive && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Xóa tất cả các điều kiện lọc"
          >
            <span>✕</span> Xóa bộ lọc
          </button>
        )}
        <button
          onClick={refresh}
          className="text-xs text-zinc-300 hover:text-white px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          title="Tải lại danh sách sessions"
        >
          <span>🔄</span> Làm mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/50 flex flex-wrap items-center gap-3 shrink-0">
        {/* Agent Filter Pills */}
        <div className="flex items-center gap-1 bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700/60">
          <button
            onClick={() => handleSelectAgent('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              agentFilter === 'all'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tất cả ({agentCounts.all})
          </button>
          <button
            onClick={() => handleSelectAgent('hermes')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              agentFilter === 'hermes'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-amber-400'
            }`}
          >
            Hermes ({agentCounts.hermes})
          </button>
          <button
            onClick={() => handleSelectAgent('antigravity')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              agentFilter === 'antigravity'
                ? 'bg-cyan-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-cyan-400'
            }`}
          >
            Antigravity ({agentCounts.antigravity})
          </button>
          <button
            onClick={() => handleSelectAgent('claude')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              agentFilter === 'claude'
                ? 'bg-orange-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-orange-400'
            }`}
          >
            Claude ({agentCounts.claude})
          </button>
          <button
            onClick={() => handleSelectAgent('codex')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              agentFilter === 'codex'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-emerald-400'
            }`}
          >
            Codex ({agentCounts.codex})
          </button>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1 bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700/60">
          <button
            onClick={() => setDateFilter('all')}
            className={`px-2 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              dateFilter === 'all'
                ? 'bg-zinc-600 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Toàn thời gian
          </button>
          <button
            onClick={() => setDateFilter('today')}
            className={`px-2 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              dateFilter === 'today'
                ? 'bg-zinc-600 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setDateFilter('7d')}
            className={`px-2 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              dateFilter === '7d'
                ? 'bg-zinc-600 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            7 ngày
          </button>
          <button
            onClick={() => setDateFilter('30d')}
            className={`px-2 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              dateFilter === '30d'
                ? 'bg-zinc-600 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            30 ngày
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="🔍 Tìm tiêu đề, thư mục, model, session ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-zinc-800/90 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {isFilterActive && (
        <div className="px-4 py-1.5 bg-zinc-950/70 border-b border-zinc-800 flex flex-wrap items-center gap-1.5 text-xs shrink-0">
          <span className="text-zinc-500 font-medium text-[11px] mr-1">Đang lọc:</span>
          {agentFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px]">
              <span>Agent: {agentFilter}</span>
              <button onClick={() => setAgentFilter('all')} className="hover:text-white font-bold ml-0.5 cursor-pointer">✕</button>
            </span>
          )}
          {tagFilter?.type === 'model' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px]">
              <span>Model: {tagFilter.display}</span>
              <button onClick={() => setTagFilter(null)} className="hover:text-white font-bold ml-0.5 cursor-pointer">✕</button>
            </span>
          )}
          {tagFilter?.type === 'folder' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px]">
              <span>Thư mục: {tagFilter.display}</span>
              <button onClick={() => setTagFilter(null)} className="hover:text-white font-bold ml-0.5 cursor-pointer">✕</button>
            </span>
          )}
          {dateFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-700/60 text-zinc-300 border border-zinc-600 text-[11px]">
              <span>Thời gian: {dateFilter === 'today' ? 'Hôm nay' : dateFilter === '7d' ? '7 ngày' : '30 ngày'}</span>
              <button onClick={() => setDateFilter('all')} className="hover:text-white font-bold ml-0.5 cursor-pointer">✕</button>
            </span>
          )}
          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px]">
              <span>Từ khóa: "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="hover:text-white font-bold ml-0.5 cursor-pointer">✕</button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-amber-400 hover:text-amber-300 ml-auto text-[11px] underline font-medium cursor-pointer"
          >
            ✕ Xóa tất cả
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Session List */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-xs gap-2">
              <span className="animate-spin text-lg">⟳</span>
              <span>Đang tải danh sách session...</span>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-xs gap-2">
              <span className="text-2xl">📭</span>
              <span>Không tìm thấy session nào phù hợp</span>
              {isFilterActive && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Xóa bộ lọc để xem tất cả
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {filteredSessions.map((s) => {
                const isSelected = selectedSession?.id === s.id;
                const isAgentActive = agentFilter === s.agent.toLowerCase();
                const isModelActive =
                  tagFilter?.type === 'model' &&
                  (s.model || '').toLowerCase() === tagFilter.value.toLowerCase();
                const folderName = s.cwd ? s.cwd.split(/[/\\]/).filter(Boolean).pop() || s.cwd : null;
                const isFolderActive =
                  tagFilter?.type === 'folder' &&
                  !!folderName &&
                  folderName.toLowerCase() === tagFilter.value.toLowerCase();

                return (
                  <div
                    key={`${s.agent}-${s.id}`}
                    onClick={() => selectSession(s)}
                    onDoubleClick={() => handleResumeSession(s)}
                    className={`px-4 py-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-l-4 border-amber-500'
                        : 'hover:bg-zinc-800/50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {/* Clickable Agent Tag Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleAgentTag(s.agent);
                        }}
                        className={`cursor-pointer rounded transition-all focus:outline-none ${
                          isAgentActive
                            ? 'ring-2 ring-amber-400 shadow-sm brightness-110'
                            : 'hover:opacity-80'
                        }`}
                        title={
                          isAgentActive
                            ? `Đang lọc theo ${s.agent}. Click để bỏ lọc.`
                            : `Click để lọc theo agent: ${s.agent}`
                        }
                      >
                        {getAgentBadge(s.agent)}
                      </button>

                      {/* Title */}
                      <span className="text-xs font-semibold text-zinc-200 truncate flex-1" title={s.title || s.id}>
                        {s.title || s.id}
                      </span>

                      {/* Date & Time */}
                      <span className="text-[11px] text-zinc-400 shrink-0 font-medium" title={formatFullDate(s.startedAt)}>
                        {timeAgo(s.startedAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 ml-0.5 text-[11px] text-zinc-400">
                      {/* Clickable Model Tag */}
                      {s.model && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleModelTag(s.model!);
                          }}
                          className={`px-1.5 py-0.5 rounded font-mono text-[10px] cursor-pointer transition-all border ${
                            isModelActive
                              ? 'bg-purple-600/30 text-purple-200 border-purple-400 font-bold ring-1 ring-purple-400 shadow-sm'
                              : 'bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-300 border-zinc-700/60'
                          }`}
                          title={
                            isModelActive
                              ? `Đang lọc theo model ${s.model}. Click để bỏ lọc.`
                              : `Click để lọc theo model: ${s.model}`
                          }
                        >
                          {s.model}
                        </button>
                      )}

                      {/* Message Count */}
                      {s.messageCount > 0 && (
                        <span className="text-zinc-500 text-[10px]">
                          💬 {s.messageCount} lượt
                        </span>
                      )}

                      {/* Clickable Folder Tag */}
                      {s.cwd && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFolderTag(s.cwd!);
                          }}
                          className={`text-[10px] flex items-center gap-1 cursor-pointer transition-all px-1.5 py-0.5 rounded border max-w-[280px] truncate ${
                            isFolderActive
                              ? 'bg-blue-600/30 text-blue-200 border-blue-400 font-bold ring-1 ring-blue-400 shadow-sm'
                              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/40 hover:bg-zinc-800 border-zinc-700/50'
                          }`}
                          title={
                            isFolderActive
                              ? `Đang lọc theo thư mục ${folderName || s.cwd}. Click để bỏ lọc.`
                              : `Click để lọc theo thư mục: ${s.cwd}`
                          }
                        >
                          <span>📂</span>
                          <span className="truncate">{s.cwd.split(/[/\\]/).filter(Boolean).slice(-2).join('/')}</span>
                        </button>
                      )}

                      {/* Exact time label */}
                      <span className="text-zinc-500 text-[10px] ml-auto">
                        {formatFullDate(s.startedAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Preview & Action Pane */}
        {selectedSession ? (
          <div ref={previewRef} className="w-[52%] border-l border-zinc-700/60 overflow-y-auto bg-zinc-900/95 flex flex-col">
            {/* Action Bar Header */}
            <div className="p-3 border-b border-zinc-800 sticky top-0 bg-zinc-900/95 z-10 backdrop-blur space-y-2.5">
              <div className="flex items-center gap-2">
                {getAgentBadge(selectedSession.agent)}
                <span className="text-xs font-bold text-zinc-100 truncate flex-1" title={selectedSession.title || selectedSession.id}>
                  {selectedSession.title || selectedSession.id}
                </span>

                {/* Primary Action: RESUME SESSION */}
                <button
                  onClick={() => handleResumeSession(selectedSession)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-md shadow-amber-900/20 flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
                  title={`Chạy lệnh resume chính xác: ${getAgentResumeCommand(selectedSession).commandDisplay}`}
                >
                  <span>▶</span>
                  <span>Resume Session</span>
                </button>
              </div>

              {/* Exact Resume Command Snippet */}
              <div className="flex items-center gap-2 text-[11px] font-mono bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-amber-400 select-all">
                <span className="text-zinc-500 font-bold">$</span>
                <span className="truncate flex-1 font-semibold">
                  {getAgentResumeCommand(selectedSession).commandDisplay}
                </span>
                <button
                  onClick={() => handleCopyResumeCmd(getAgentResumeCommand(selectedSession).commandDisplay)}
                  className="text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] shrink-0 font-sans flex items-center gap-1 transition-all"
                  title="Sao chép lệnh resume"
                >
                  <span>{copyResumeCmdStatus ? '✓' : '📋'}</span>
                  <span>{copyResumeCmdStatus ? 'Đã copy' : 'Copy'}</span>
                </button>
              </div>

              {/* Real path / metadata info */}
              <div className="text-[11px] text-zinc-400 space-y-1 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-medium shrink-0">Session ID:</span>
                  <span className="font-mono text-zinc-300 select-all truncate">{selectedSession.id}</span>
                </div>
                {selectedSession.cwd && (
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-zinc-500 font-medium shrink-0">Working Dir:</span>
                    <span className="text-zinc-300 truncate select-all font-mono text-[10px]" title={selectedSession.cwd}>
                      {selectedSession.cwd}
                    </span>
                  </div>
                )}
                {selectedSession.realPath && (
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-zinc-500 font-medium shrink-0">Real Path:</span>
                    <span className="text-zinc-400 text-[10px] truncate select-all font-mono" title={selectedSession.realPath}>
                      {selectedSession.realPath}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Copy Real Path, Copy Context, Transfer */}
              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Copy Real Path */}
                {selectedSession.realPath && (
                  <button
                    onClick={handleCopyRealPath}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-medium flex items-center gap-1 transition-all ${
                      copyPathStatus
                        ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                    }`}
                  >
                    <span>📋</span>
                    <span>{copyPathStatus ? '✓ Đã copy path' : 'Copy Real Path'}</span>
                  </button>
                )}

                {/* 2. Copy Context */}
                <button
                  onClick={handleCopyContext}
                  className={`px-2.5 py-1 text-xs rounded-lg border font-medium flex items-center gap-1 transition-all ${
                    copyContextStatus
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                  }`}
                >
                  <span>📄</span>
                  <span>{copyContextStatus ? '✓ Đã copy context' : 'Copy Context'}</span>
                </button>

                {/* 3. Transfer to Agent Dropdown / Buttons */}
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-[11px] text-zinc-400 font-medium">⚡ Chuyển sang:</span>
                  <div className="flex items-center gap-1">
                    {handoffClis.map((cli) => (
                      <button
                        key={cli.name}
                        onClick={() => handleTransferToAgent(cli)}
                        disabled={transferring}
                        className="px-2 py-0.5 text-[11px] rounded bg-zinc-800 hover:bg-amber-600 hover:text-white text-zinc-300 border border-zinc-700 font-medium transition-all"
                        title={`Mở CLI ${cli.name} kèm context của session này`}
                      >
                        {cli.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transfer Success Notification */}
              {transferSuccess && (
                <div className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                  <span>✓</span>
                  <span>{transferSuccess}</span>
                </div>
              )}
            </div>

            {/* Conversation Messages */}
            <div className="p-3 flex-1 overflow-y-auto space-y-2.5">
              {loadingPreview ? (
                <div className="flex items-center justify-center h-32 text-zinc-500 text-xs gap-2">
                  <span className="animate-spin text-sm">⟳</span>
                  <span>Đang tải nội dung hội thoại...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-zinc-500 text-xs gap-1">
                  <span>Không có tin nhắn chi tiết</span>
                  <span className="text-[10px] text-zinc-600">Session có thể chỉ chứa metadata hoặc logs bên ngoài</span>
                </div>
              ) : (
                messages.map((m, i) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={i}
                      className={`text-xs rounded-lg p-2.5 border transition-all ${
                        isUser
                          ? 'bg-blue-950/30 border-blue-500/30 text-zinc-200'
                          : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                        <span className={isUser ? 'text-blue-400' : 'text-amber-400'}>
                          {isUser ? '👤 Người dùng (User)' : '🤖 Trợ lý (AI)'}
                        </span>
                        {m.timestamp > 0 && (
                          <span className="text-zinc-500 font-normal">
                            {formatFullDate(m.timestamp)}
                          </span>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap break-words leading-relaxed select-text font-mono text-[11px]">
                        {truncate(m.content || '', 1000)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div className="w-[52%] border-l border-zinc-700/60 flex flex-col items-center justify-center text-zinc-500 text-xs p-6 text-center gap-2">
            <span className="text-3xl">👈</span>
            <span className="font-medium text-zinc-300 text-sm">Chọn một session để xem chi tiết</span>
            <p className="text-[11px] text-zinc-500 max-w-sm">
              Double-click session để Resume ngay với lệnh chính xác của từng agent.
              Xem trước tin nhắn, sao chép đường dẫn file thực tế, xuất context hoặc chuyển tiếp sang Agent khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
