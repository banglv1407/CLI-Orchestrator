import { useEffect, useMemo, useState } from 'react';
import type { CliDefinition } from '../types';

interface CliEditorModalProps {
  isOpen: boolean;
  initialCli: CliDefinition | null;
  onClose: () => void;
  onSubmit: (payload: { cli: CliDefinition; originalName?: string }) => Promise<void>;
}

export function CliEditorModal({ isOpen, initialCli, onClose, onSubmit }: CliEditorModalProps) {
  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [group, setGroup] = useState('');
  const [defaultWorkingDir, setDefaultWorkingDir] = useState('');
  const [argsText, setArgsText] = useState('');
  const [enableRtk, setEnableRtk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(initialCli?.name ?? '');
    setCommand(initialCli?.command ?? '');
    setGroup(initialCli?.group ?? 'Default');
    setDefaultWorkingDir(initialCli?.defaultWorkingDir ?? '');
    setArgsText((initialCli?.args ?? []).join('\n'));
    setEnableRtk(initialCli?.enableRtk ?? false);
    setError(null);
    setSaving(false);
  }, [initialCli, isOpen]);

  const title = useMemo(() => (initialCli ? 'Edit CLI' : 'Add CLI'), [initialCli]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-xl border border-cyber-line bg-cyber-panel p-4 shadow-neon">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-neon">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-cyber-line px-2 py-1 text-xs text-slate-300"
          >
            Close
          </button>
        </div>

        <div className="grid gap-3">
          <label className="text-xs uppercase tracking-wider text-slate-400">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyber-neon"
              placeholder="qwen"
            />
          </label>

          <label className="text-xs uppercase tracking-wider text-slate-400">
            Command
            <input
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              className="mt-1 w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyber-neon"
              placeholder="qwen"
            />
          </label>

          <label className="text-xs uppercase tracking-wider text-slate-400">
            Group (Optional)
            <input
              value={group}
              onChange={(event) => setGroup(event.target.value)}
              className="mt-1 w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyber-neon"
              placeholder="Default"
            />
          </label>

          <label className="text-xs uppercase tracking-wider text-slate-400">
            Default Working Directory (Optional)
            <input
              value={defaultWorkingDir}
              onChange={(event) => setDefaultWorkingDir(event.target.value)}
              className="mt-1 w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyber-neon"
              placeholder="D:\\projects\\my-repo"
            />
          </label>

          <label className="text-xs uppercase tracking-wider text-slate-400">
            Startup Args (one per line)
            <textarea
              value={argsText}
              onChange={(event) => setArgsText(event.target.value)}
              className="mt-1 h-24 w-full resize-none rounded border border-cyber-line bg-cyber-base px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyber-neon"
              placeholder="code\n{prompt}"
            />
          </label>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={enableRtk}
              onChange={(event) => setEnableRtk(event.target.checked)}
              className="rounded border-cyber-line bg-cyber-base text-cyber-neon focus:ring-cyber-neon accent-cyber-neon"
            />
            <span className="text-xs text-slate-200 font-medium flex items-center gap-1">
              ⚡ <span className="text-cyber-electric font-semibold">Enable RTK Token Compression</span>
              <span className="text-[10px] text-slate-400 font-normal">(Auto wrap command with rtk)</span>
            </span>
          </label>
        </div>

        {error ? <p className="mt-3 text-sm text-cyber-warn">{error}</p> : null}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-cyber-line px-3 py-2 text-xs uppercase tracking-wider text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              const trimmedName = name.trim();
              const trimmedCommand = command.trim();

              if (!trimmedName || !trimmedCommand) {
                setError('Name and command are required.');
                return;
              }

              const args = argsText
                .split(/\r?\n/)
                .map((row) => row.trim())
                .filter((row) => row.length > 0);

              setSaving(true);
              setError(null);

              const cli: CliDefinition = {
                name: trimmedName,
                command: trimmedCommand,
                mode: 'interactive',
                group: group.trim() || undefined,
                defaultWorkingDir: defaultWorkingDir.trim() || undefined,
                args,
                env: initialCli?.env ?? {},
                savedDirectories: initialCli?.savedDirectories ?? [],
                enableRtk,
              };

              void onSubmit({
                cli,
                originalName: initialCli?.name,
              })
                .then(() => {
                  setSaving(false);
                  onClose();
                })
                .catch((submitError) => {
                  const message = submitError instanceof Error ? submitError.message : String(submitError);
                  setError(message);
                  setSaving(false);
                });
            }}
            className="rounded border border-cyber-neon px-3 py-2 text-xs uppercase tracking-wider text-cyber-neon disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
