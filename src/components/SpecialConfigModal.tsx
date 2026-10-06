import { tFeedback as trFeedback, t as tr } from '../i18n';
import { useEffect, useState } from 'react';
import type { SpecialConfigFile } from '../types';

interface SpecialConfigModalProps {
  isOpen: boolean;
  initialConfig: SpecialConfigFile | null;
  onClose: () => void;
  onSave: (entry: SpecialConfigFile) => void;
}

export function SpecialConfigModal({
  isOpen,
  initialConfig,
  onClose,
  onSave,
}: SpecialConfigModalProps) {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [description, setDescription] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(initialConfig?.name ?? '');
    setPath(initialConfig?.path ?? '');
    setDescription(initialConfig?.description ?? '');
    setGroup(initialConfig?.group ?? '');
    setError(null);
  }, [initialConfig, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a config name.');
      return;
    }
    if (!path.trim()) {
      setError('Please enter a file path.');
      return;
    }

    onSave({
      id: initialConfig?.id || `special-${Date.now()}`,
      name: name.trim(),
      path: path.trim(),
      description: description.trim(),
      group: group.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-cyber-neon/50 bg-cyber-panel p-5 shadow-2xl backdrop-blur-md select-none">
        <div className="mb-4 flex items-center justify-between border-b border-cyber-line/40 pb-3">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-neon font-bold">
            {initialConfig ? tr("✏️ Edit Quick Config File") : tr("⚡ Add Quick Config File")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-cyber-line px-2 py-1 text-xs text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono">{tr("Config Name / Title *")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr("e.g. Nginx Server Config, Docker Compose")}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs text-slate-100 font-mono outline-none focus:border-cyber-neon transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono">{tr("File Path (Relative or Absolute) *")}</label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder={tr("e.g. docker-compose.yml, config/app.yaml, .env")}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs text-slate-100 font-mono outline-none focus:border-cyber-electric transition"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono">{tr("Group / Category (e.g. Docker, Environment, Database, General)")}</label>
            <input
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder={tr("e.g. Docker, Environment, Database")}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs text-slate-100 font-mono outline-none focus:border-cyber-neon transition"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono">{tr("Description (Mô tả chi tiết mục đích cấu hình)")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={tr("e.g. Cấu hình cổng server, môi trường và chuỗi kết nối database")}
              rows={3}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs text-slate-100 font-mono outline-none focus:border-cyber-neon transition resize-none"
            />
          </div>

          {error && (
            <div className="rounded border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300 font-mono">
              {trFeedback(error ?? '')}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-cyber-line px-4 py-1.5 text-xs text-slate-400 hover:text-slate-200 uppercase font-mono transition"
            >{tr("Cancel")}</button>
            <button
              type="submit"
              className="rounded border border-cyber-neon/50 bg-cyber-neon/15 px-4 py-1.5 text-xs font-bold text-cyber-neon hover:bg-cyber-neon/25 uppercase font-mono transition shadow-neon-sm-faint"
            >{tr("Save Config")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
