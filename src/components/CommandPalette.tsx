import { useEffect, useMemo, useRef, useState } from 'react';
import type { AppTheme, CliDefinition, SessionInfo, SshConnection } from '../types';

// Types

interface CommandItem {
  id: string;
  type: 'session' | 'cli' | 'ssh' | 'action';
  label: string;
  description: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionInfo[];
  clis: CliDefinition[];
  sshConnections: SshConnection[];
  theme: AppTheme;
  onSelectSession: (id: string) => void;
  onOpenCliInteraction: (cli: CliDefinition) => void;
  onConnectSsh: (conn: SshConnection) => void;
  onConnectRdp: (conn: SshConnection) => void;
  onAddCli: () => void;
  onAddSsh: () => void;
  onQuickSession: (panel: 'bottom' | 'right') => void;
  onSwitchView: (view: any) => void;
  onSwitchTheme: (theme: AppTheme) => void;
  activeMainView: string;
}

// Fuzzy matching

function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  let score = 0;
  let consecutive = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 10 + consecutive * 5;
      consecutive++;
      qi++;
    } else {
      consecutive = 0;
    }
  }
  return qi === q.length ? score : -1;
}

// Type icon

function TypeIcon({ type }: { type: CommandItem['type'] }) {
  switch (type) {
    case 'session': return <span className="text-xs mr-2">|</span>;
    case 'cli':     return <span className="text-xs mr-2 text-cyan-400">@</span>;
    case 'ssh':     return <span className="text-xs mr-2 text-green-400">#</span>;
    case 'action':  return <span className="text-xs mr-2 text-yellow-400">*</span>;
  }
}

// Component

export function CommandPalette({
  isOpen, onClose, sessions, clis, sshConnections, theme,
  onSelectSession, onOpenCliInteraction, onConnectSsh, onConnectRdp,
  onAddCli, onAddSsh, onQuickSession, onSwitchView, onSwitchTheme,
  activeMainView,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build all command items

  const allItems = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];

    // Sessions
    for (const s of sessions) {
      const label = s.cliName.startsWith('SSH: ')
        ? s.cliName.slice(5)
        : s.cliName;
      items.push({
        id: 'session-' + s.id,
        type: 'session' as const,
        label,
        description: s.workingDir ?? '',
        action: () => onSelectSession(s.id),
      });
    }

    // CLI definitions
    for (const c of clis) {
      items.push({
        id: 'cli-' + c.name,
        type: 'cli' as const,
        label: 'Start: ' + c.name,
        description: c.defaultWorkingDir ?? c.command,
        action: () => onOpenCliInteraction(c),
      });
    }

    // SSH connections
    for (const conn of sshConnections) {
      items.push({
        id: 'ssh-' + conn.id,
        type: 'ssh' as const,
        label: 'SSH: ' + conn.name,
        description: conn.user + '@' + conn.host + ':' + conn.port,
        action: () => onConnectSsh(conn),
      });
      items.push({
        id: 'rdp-' + conn.id,
        type: 'ssh' as const,
        label: 'RDP: ' + conn.name,
        description: conn.host + ':' + conn.port,
        action: () => onConnectRdp(conn),
      });
    }

    // Actions
    items.push({
      id: 'action-quick-right', type: 'action' as const,
      label: 'Quick Shell (right panel)',
      description: 'Open a shell session',
      action: () => onQuickSession('right'),
    });
    items.push({
      id: 'action-quick-bottom', type: 'action' as const,
      label: 'Quick Shell (bottom panel)',
      description: 'Open a shell session',
      action: () => onQuickSession('bottom'),
    });
    items.push({
      id: 'action-new-cli', type: 'action' as const,
      label: 'New CLI Tool...',
      description: 'Register a new CLI tool',
      action: onAddCli,
    });
    items.push({
      id: 'action-quick-config', type: 'action' as const,
      label: '⚡ Search & Edit Config Files',
      description: 'Quickly open YAML, JSON, TOML, ENV configs',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-quick-config-search'));
      },
    });
    items.push({
      id: 'action-new-ssh', type: 'action' as const,
      label: 'New SSH Connection...',
      description: 'Add a remote server',
      action: onAddSsh,
    });

    // Views
    items.push({
      id: 'action-view-companion', type: 'action' as const,
      label: 'View: AI Companion',
      description: 'Open AI Companion chat',
      action: () => window.dispatchEvent(new CustomEvent('open-sidebar-tab', { detail: 'ai-chat' })),
    });
    if (activeMainView !== 'terminal') {
      items.push({
        id: 'action-view-terminal', type: 'action' as const,
        label: 'View: Terminal',
        description: 'Switch to terminal view',
        action: () => onSwitchView('terminal'),
      });
    }
    if (activeMainView !== 'quickapps') {
      items.push({
        id: 'action-view-quickapps', type: 'action' as const,
        label: 'View: Quick Apps',
        description: 'Switch to quick apps panel',
        action: () => onSwitchView('quickapps'),
      });
    }
    if (activeMainView !== 'apiclient') {
      items.push({
        id: 'action-view-apiclient', type: 'action' as const,
        label: 'View: API Client',
        description: 'Switch to API client panel',
        action: () => onSwitchView('apiclient'),
      });
    }
    if (activeMainView !== 'agent-sessions') {
      items.push({
        id: 'action-view-agent-sessions', type: 'action' as const,
        label: 'View: Agent Sessions',
        description: 'Browse agent conversation history',
        action: () => onSwitchView('agent-sessions'),
      });
    }
    if (activeMainView !== 'game') {
      items.push({
        id: 'action-view-game', type: 'action' as const,
        label: 'View: Entertainment',
        description: 'Switch to Entertainment & Games workspace',
        action: () => onSwitchView('game'),
      });
    }
    if (activeMainView !== 'proxy') {
      items.push({
        id: 'action-view-proxy', type: 'action' as const,
        label: 'View: CliProxyAI',
        description: 'Switch to proxy panel',
        action: () => onSwitchView('proxy'),
      });
    }
    if (activeMainView !== 'logs') {
      items.push({
        id: 'action-view-logs', type: 'action' as const,
        label: 'View: System Logs',
        description: 'Switch to system logs panel',
        action: () => onSwitchView('logs'),
      });
    }
    if (activeMainView !== 'remote') {
      items.push({
        id: 'action-view-remote', type: 'action' as const,
        label: 'View: Remote SSH',
        description: 'Switch to remote SSH panel',
        action: () => onSwitchView('remote'),
      });
    }
    // Settings sections deep links
    const settingsSections: { id: string; label: string; desc: string }[] = [
      { id: 'proxy', label: 'Settings: CliProxyAI', desc: 'Configure upstream AI backends' },
      { id: 'appearance', label: 'Settings: Appearance', desc: 'Configure application theme and styling' },
      { id: 'mythical-pet', label: 'Settings: Mythical Pet', desc: 'Enable/disable and select mythical pets' },
      { id: 'ai-companion', label: 'Settings: AI Companion', desc: 'Configure OpenAI-compatible endpoint settings' },
      { id: 'local-llm', label: 'Settings: Local LLM', desc: 'Manage offline GGUF inference fallbacks' },
      { id: 'navigation', label: 'Settings: Sidebar Navigation', desc: 'Reorder sidebar activity icons' },
    ];

    for (const sec of settingsSections) {
      items.push({
        id: 'settings-section-' + sec.id,
        type: 'action' as const,
        label: sec.label,
        description: sec.desc,
        action: () => {
          window.dispatchEvent(new CustomEvent('open-settings', { detail: sec.id }));
        },
      });
    }

    // Themes
    const themeLabels: Record<AppTheme, string> = {
      cyberpunk: 'Cyberpunk',
      kawaii: 'Kawaii',
      light: 'Light',
    };
    for (const t of (['cyberpunk', 'kawaii', 'light'] as AppTheme[])) {
      if (t !== theme) {
        items.push({
          id: 'action-theme-' + t, type: 'action' as const,
          label: 'Theme: ' + themeLabels[t],
          description: 'Switch to ' + themeLabels[t] + ' theme',
          action: () => onSwitchTheme(t),
        });
      }
    }

    return items;
  }, [
    sessions, clis, sshConnections, theme, activeMainView,
    onSelectSession, onOpenCliInteraction, onConnectSsh, onConnectRdp,
    onAddCli, onAddSsh, onQuickSession, onSwitchView, onSwitchTheme,
  ]);

  // Filter and rank

  const results = useMemo(() => {
    if (!query.trim()) return allItems;
    const scored = allItems.map((item) => ({
      item,
      score: Math.max(fuzzyScore(query, item.label), fuzzyScore(query, item.description)),
    }));
    return scored
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
  }, [query, allItems]);

  // Reset on open

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Clamp

  const safeIndex = Math.min(selectedIndex, Math.max(0, results.length - 1));

  // Keyboard

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[safeIndex]) {
          results[safeIndex].action();
          onClose();
        }
        break;
    }
  };

  // Scroll into view

  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.children[safeIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [safeIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
    >
      <div className="w-full max-w-xl rounded-lg border border-cyber-line bg-cyber-panel shadow-2xl overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-cyber-line">
          <span className="text-cyan-400 text-sm font-mono">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm outline-none border-none"
            spellCheck={false}
          />
          <kbd className="text-[10px] text-slate-500 bg-cyber-base px-1.5 py-0.5 rounded border border-cyber-line">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-72 overflow-y-auto py-1">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-slate-500 text-sm">
              No matching commands
            </div>
          ) : (
            results.map((item, idx) => {
              const active = idx === safeIndex;
              return (
                <button
                  key={item.id}
                  className={
                    'w-full flex items-center gap-2 px-4 py-2 text-left text-sm transition-colors ' +
                    (active
                      ? 'bg-cyber-line/30 text-cyan-300'
                      : 'text-slate-300 hover:bg-cyber-line/20')
                  }
                  onClick={() => { item.action(); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <TypeIcon type={item.type} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-slate-500 truncate max-w-[180px]">
                      {item.description}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-600 uppercase w-14 text-right">
                    {item.type}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-4 py-2 border-t border-cyber-line text-[10px] text-slate-500">
          <span>arrow keys navigate</span>
          <span>enter select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
