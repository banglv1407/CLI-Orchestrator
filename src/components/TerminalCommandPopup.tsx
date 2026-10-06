import { tFeedback as trFeedback, t as tr } from '../i18n';
import type { Ref } from 'react';
import type {
  TerminalCommandEnvironment,
  TerminalCommandSuggestion,
  TerminalEnvironmentOverride,
} from '../types';

export type TerminalCommandPopupPhase =
  | 'detecting'
  | 'input'
  | 'generating'
  | 'ready'
  | 'error';

interface TerminalCommandPopupProps {
  phase: TerminalCommandPopupPhase;
  position: { left: number; top: number };
  environment: TerminalCommandEnvironment | null;
  environmentOverride?: TerminalEnvironmentOverride;
  requestText: string;
  suggestion: TerminalCommandSuggestion | null;
  error: string | null;
  canInsert: boolean;
  inputRef: Ref<HTMLInputElement>;
  onRequestTextChange: (value: string) => void;
  onEnvironmentOverrideChange: (value: TerminalEnvironmentOverride | undefined) => void;
  onGenerate: () => void;
  onCopy: () => void;
  onInsert: () => void;
  onClose: () => void;
}

function EnvironmentBadge({
  environment,
  environmentOverride,
}: {
  environment: TerminalCommandEnvironment;
  environmentOverride?: TerminalEnvironmentOverride;
}) {
  const shell = environmentOverride?.shellDialect ?? environment.shellDialect;
  const platform =
    environmentOverride?.distroId ??
    environment.distroId ??
    environmentOverride?.distroFamily ??
    environment.distroFamily;
  return (
    <span className="rounded border border-cyber-line/70 bg-[#101a2e] px-1.5 py-0.5 text-[9px] text-slate-300">
      {environment.transport.toUpperCase()} · {platform ?? environment.osFamily} · {shell}
    </span>
  );
}

type EnvironmentChoice =
  | 'windows-bash'
  | 'windows-powershell'
  | 'windows-cmd'
  | 'ubuntu-bash'
  | 'rhel-bash';

function environmentChoiceValue(
  overrideValue?: TerminalEnvironmentOverride,
): EnvironmentChoice | '' {
  if (!overrideValue) return '';
  if (overrideValue.shellDialect === 'powershell') return 'windows-powershell';
  if (overrideValue.shellDialect === 'cmd') return 'windows-cmd';
  if (overrideValue.distroFamily === 'rhel') return 'rhel-bash';
  if (overrideValue.distroFamily === 'debian') return 'ubuntu-bash';
  return 'windows-bash';
}

export function TerminalCommandPopup({
  phase,
  position,
  environment,
  environmentOverride,
  requestText,
  suggestion,
  error,
  canInsert,
  inputRef,
  onRequestTextChange,
  onEnvironmentOverrideChange,
  onGenerate,
  onCopy,
  onInsert,
  onClose,
}: TerminalCommandPopupProps) {
  const needsOverride =
    !!environment &&
    environment.eligible &&
    (!environment.supported || environment.confidence !== 'high');
  const generateDisabled =
    phase === 'detecting' ||
    phase === 'generating' ||
    !requestText.trim() ||
    !environment?.eligible ||
    (needsOverride && !environmentOverride);

  const setEnvironmentChoice = (choice: EnvironmentChoice) => {
    if (choice === 'windows-powershell') {
      onEnvironmentOverrideChange({ shellDialect: 'powershell', distroFamily: 'windows' });
      return;
    }
    if (choice === 'windows-cmd') {
      onEnvironmentOverrideChange({ shellDialect: 'cmd', distroFamily: 'windows' });
      return;
    }
    if (choice === 'windows-bash') {
      onEnvironmentOverrideChange({
        shellDialect: 'bash',
        distroId: 'windows',
        distroFamily: 'windows',
      });
      return;
    }
    const family = choice === 'rhel-bash' ? 'rhel' : 'debian';
    onEnvironmentOverrideChange({
      shellDialect: 'bash',
      distroId: family === 'debian' ? 'ubuntu' : 'rhel',
      distroFamily: family,
      packageManager: family === 'debian' ? 'apt' : 'dnf',
    });
  };

  return (
    <div
      role="dialog"
      aria-label={tr("Generate a terminal command")}
      className="fixed z-[120] flex w-[420px] max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-xl border border-cyber-accent/60 bg-[#080e1c]/98 font-mono text-[11px] shadow-2xl shadow-cyber-accent/20 backdrop-blur-md"
      style={{ left: position.left, top: position.top }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-2 border-b border-cyber-line/50 bg-[#0d1628] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-bold tracking-wide text-cyber-accent">{tr("⌁ COMMAND ASSISTANT")}</span>
          {environment && <EnvironmentBadge environment={environment} environmentOverride={environmentOverride} />}
        </div>
        <button
          type="button"
          onClick={onClose}
          title={tr("Close (Esc)")}
          className="h-6 w-6 shrink-0 rounded border border-cyber-line/50 text-slate-400 hover:border-cyber-warn/60 hover:text-cyber-warn"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2.5 p-3">
        {phase === 'detecting' ? (
          <div className="py-3 text-center text-cyber-electric animate-pulse">{tr("Detecting the active shell…")}</div>
        ) : (
          <>
            {environment && !environment.eligible && (
              <div className="rounded border border-cyber-warn/50 bg-cyber-warn/10 px-2.5 py-2 text-cyber-warn">
                {trFeedback(environment.reason ?? "This session is not an eligible shell session.")}
              </div>
            )}

            {needsOverride && environment?.eligible && (
              <div className="rounded border border-cyber-electric/40 bg-cyber-electric/5 p-2.5">
                <div className="mb-1.5 text-[10px] text-cyber-electric">{tr("Detection is uncertain. Choose the target environment.")}</div>
                <select
                  aria-label={tr("Target operating system and shell")}
                  value={environmentChoiceValue(environmentOverride)}
                  onChange={(event) =>
                    event.target.value
                      ? setEnvironmentChoice(event.target.value as EnvironmentChoice)
                      : onEnvironmentOverrideChange(undefined)
                  }
                  className="w-full rounded border border-cyber-line bg-[#0a1222] px-2 py-1.5 text-slate-200 outline-none focus:border-cyber-accent"
                >
                  <option value="">{tr("Choose target…")}</option>
                  {environment.transport === 'local' && (
                    <>
                      <option value="windows-bash">{tr("Windows · Bash (default)")}</option>
                      <option value="windows-powershell">Windows · PowerShell</option>
                      <option value="windows-cmd">Windows · cmd</option>
                    </>
                  )}
                  <option value="ubuntu-bash">Ubuntu / Debian · Bash (apt)</option>
                  <option value="rhel-bash">Red Hat / Fedora / Rocky / Alma · Bash (dnf)</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={requestText}
                disabled={!environment?.eligible || phase === 'generating'}
                onChange={(event) => onRequestTextChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    onClose();
                  } else if (event.key === 'Enter' && !generateDisabled) {
                    event.preventDefault();
                    onGenerate();
                  }
                }}
                placeholder={tr("Describe the command you need…")}
                className="min-w-0 flex-1 rounded border border-cyber-line bg-[#060b16] px-2.5 py-2 text-cyber-text outline-none placeholder:text-slate-600 focus:border-cyber-accent disabled:opacity-50"
              />
              <button
                type="button"
                disabled={generateDisabled}
                onClick={onGenerate}
                className="rounded border border-cyber-accent/60 bg-cyber-accent/10 px-3 py-2 font-bold text-cyber-accent hover:bg-cyber-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {phase === 'generating' ? tr("Generating…") : tr("Generate")}
              </button>
            </div>

            {error && (
              <div className="max-h-20 overflow-auto rounded border border-cyber-warn/50 bg-cyber-warn/10 px-2.5 py-2 text-cyber-warn">
                {trFeedback(error ?? '')}
              </div>
            )}

            {suggestion && (
              <div className="flex flex-col gap-2 rounded border border-cyber-neon/40 bg-[#050b13] p-2.5">
                <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                  <span className="rounded bg-cyber-neon/10 px-1.5 py-0.5 text-cyber-neon">{tr("syntax verified · ")}{suggestion.validation.validator}
                  </span>
                  <span className="rounded bg-cyber-electric/10 px-1.5 py-0.5 text-cyber-electric">
                    {suggestion.source}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      suggestion.risk === 'destructive'
                        ? 'bg-red-500/15 text-red-300'
                        : suggestion.risk === 'elevated'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-slate-500/15 text-slate-300'
                    }`}
                  >
                    {suggestion.risk}
                  </span>
                </div>
                <div className="max-h-24 overflow-auto whitespace-pre-wrap break-all rounded bg-black/40 px-2 py-2 text-[12px] text-slate-100">
                  {suggestion.command}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] text-slate-500">{tr("Syntax verified; runtime success still depends on the target system.")}</span>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={onCopy}
                      className="rounded border border-cyber-line px-2.5 py-1.5 text-slate-300 hover:border-cyber-electric/60 hover:text-cyber-electric"
                    >{tr("Copy")}</button>
                    <button
                      type="button"
                      disabled={!canInsert}
                      onClick={onInsert}
                      title={
                        canInsert
                          ? tr("Paste at the current prompt without pressing Enter")
                          : tr("Insert is available only at a recognized empty shell prompt")
                      }
                      className="rounded border border-cyber-neon/60 bg-cyber-neon/10 px-2.5 py-1.5 font-bold text-cyber-neon hover:bg-cyber-neon/20 disabled:cursor-not-allowed disabled:opacity-35"
                    >{tr("Insert")}</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
