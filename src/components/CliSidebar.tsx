import { useState } from 'react';
import type { CliDefinition, SessionInfo } from '../types';

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M8 5.25c0-.6.66-.96 1.16-.64l10 6.75a.75.75 0 0 1 0 1.28l-10 6.75A.75.75 0 0 1 8 18.75V5.25Z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.86 3.49a2.2 2.2 0 1 1 3.11 3.11L8 18.57l-4 1 1-4 11.86-12.08Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2m-1 0v14H9V6" />
    </svg>
  );
}

interface CliSidebarProps {
  clis: CliDefinition[];
  sessions: SessionInfo[];
  activeCli: string;
  activeSessionId: string | null;
  onSelectCli: (cliName: string) => void;
  onOpenCliInteraction: (cli: CliDefinition) => void;
  onSelectSession: (sessionId: string) => void;
  onAddCli: () => void;
  onEditCli: (cli: CliDefinition) => void;
  onDeleteCli: (cli: CliDefinition) => void;
}

export function CliSidebar({
  clis,
  sessions,
  activeCli,
  activeSessionId,
  onSelectCli,
  onOpenCliInteraction,
  onSelectSession,
  onAddCli,
  onEditCli,
  onDeleteCli,
}: CliSidebarProps) {
  const [showCliList, setShowCliList] = useState(true);
  const [showSessions, setShowSessions] = useState(true);

  return (
    <aside className="flex h-full w-72 flex-col border-r border-cyber-line bg-cyber-panel/75 backdrop-blur">
      <div className="border-b border-cyber-line p-4">
        <h1 className="font-display text-xl uppercase tracking-[0.2em] text-cyber-neon">CLI Manager</h1>
        <p className="mt-2 text-sm text-slate-300">Interactive-first terminal orchestrator for local AI CLIs.</p>
      </div>

      <section className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowCliList((value) => !value)}
            className="font-display text-xs uppercase tracking-[0.2em] text-slate-400"
          >
            CLIs {showCliList ? '[-]' : '[+]'}
          </button>
          <button
            type="button"
            onClick={onAddCli}
            className="rounded border border-cyber-neon/40 px-1.5 py-0.5 text-[11px] text-cyber-neon transition hover:border-cyber-neon hover:bg-cyber-neon/10"
          >
            Add CLI
          </button>
        </div>

        {showCliList ? (
          <div className="space-y-1">
            {clis.map((cli) => (
              <div
                key={cli.name}
                className={`rounded border px-1.5 py-1 transition ${activeCli === cli.name
                    ? 'border-cyber-neon bg-cyber-neon/10'
                    : 'border-cyber-line bg-cyber-base/60'
                  }`}
              >
                <div className="flex items-start gap-1.5">
                  <button type="button" onClick={() => onSelectCli(cli.name)} className="min-w-0 flex-1 text-left leading-tight">
                    <span className="block truncate text-[13px] font-semibold text-slate-100">{cli.name}</span>
                    <span className="block truncate text-[9px] text-slate-400">{cli.command}</span>
                  </button>

                  <div className="mt-0.5 flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onOpenCliInteraction(cli)}
                      aria-label={`Start ${cli.name}`}
                      title="Start"
                      className="flex h-5 w-5 items-center justify-center rounded border border-cyber-neon/70 text-cyber-neon transition hover:bg-cyber-neon/10"
                    >
                      <PlayIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditCli(cli)}
                      aria-label={`Edit ${cli.name}`}
                      title="Edit"
                      className="flex h-5 w-5 items-center justify-center rounded border border-cyber-electric/60 text-cyber-electric transition hover:bg-cyber-electric/10"
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCli(cli)}
                      aria-label={`Delete ${cli.name}`}
                      title="Delete"
                      className="flex h-5 w-5 items-center justify-center rounded border border-cyber-warn/60 text-cyber-warn transition hover:bg-cyber-warn/10"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mb-2 mt-7 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowSessions((value) => !value)}
            className="font-display text-xs uppercase tracking-[0.2em] text-slate-400"
          >
            Active Sessions {showSessions ? '[-]' : '[+]'}
          </button>
        </div>

        {showSessions ? (
          <div className="space-y-2">
            {sessions.length === 0 ? (
              <p className="rounded border border-dashed border-cyber-line p-3 text-sm text-slate-400">No active PTY sessions.</p>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full rounded border px-3 py-2 text-left transition ${activeSessionId === session.id
                      ? 'border-cyber-electric bg-cyber-electric/15'
                      : session.status === 'loading'
                        ? 'border-cyber-glow/60 bg-cyber-glow/10'
                        : 'border-cyber-line bg-cyber-base/60 hover:border-cyber-electric/80'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">{session.cliName}</span>
                    <span className="text-xs uppercase tracking-wider text-slate-400">{session.status}</span>
                  </div>
                  {session.projectTag ? <p className="mt-1 truncate text-xs text-cyber-electric">#{session.projectTag}</p> : null}
                  {session.workingDir ? <p className="mt-1 truncate text-xs text-slate-500">{session.workingDir}</p> : null}
                  <p className="mt-1 truncate font-mono text-xs text-slate-500">{session.id}</p>
                </button>
              ))
            )}
          </div>
        ) : null}
      </section>
    </aside>
  );
}
