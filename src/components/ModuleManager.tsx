import { useCallback, useEffect, useState } from 'react';

import {
  moduleCatalog,
  moduleRestart,
  moduleSetEnabled,
  type ModuleSnapshot,
} from '../lib/modules';

const MODULE_LABELS: Record<string, string> = {
  'clx.quickapps': 'Quick Apps',
  'clx.api-client': 'API Client',
  'clx.buzz': 'Buzz',
  'clx.nes': 'NES',
  'clx.pet': 'Animated Pet',
  'clx.ai-companion': 'AI Companion',
  'clx.cli-proxy': 'CliProxyAI',
  'clx.ssh': 'SSH',
  'clx.local-llm': 'Local LLM',
};

export function ModuleManager() {
  const [modules, setModules] = useState<ModuleSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setModules(await moduleCatalog());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setEnabled = async (module: ModuleSnapshot, enabled: boolean) => {
    setBusy(module.moduleId);
    setError(null);
    try {
      await moduleSetEnabled(module.moduleId, enabled);
      await refresh();
      window.dispatchEvent(new CustomEvent('clx-modules-changed'));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(null);
    }
  };

  const restart = async (module: ModuleSnapshot) => {
    setBusy(module.moduleId);
    setError(null);
    try {
      await moduleRestart(module.moduleId);
      await refresh();
      window.dispatchEvent(new CustomEvent('clx-modules-changed'));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <div className="text-xs text-slate-500">Checking installed packs…</div>;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200">Module Manager</h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Enable or disable verified installed packs immediately. Rerun CLX Setup to add, remove, or repair pack files.
        </p>
      </div>
      {error && <div className="rounded border border-red-500/30 bg-red-950/20 p-3 text-xs text-red-200">{error}</div>}
      <div className="grid gap-3 xl:grid-cols-2">
        {modules.map((module) => {
          const installed = module.state !== 'notInstalled';
          const canEnable = module.state === 'disabled' || module.state === 'ready' || module.state === 'running';
          return (
            <div key={module.moduleId} className="rounded-lg border border-cyber-line/30 bg-slate-950/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-200">{MODULE_LABELS[module.moduleId] ?? module.moduleId}</div>
                  <div className="mt-0.5 truncate font-mono text-[10px] text-slate-500">{module.moduleId}</div>
                </div>
                <span className={`rounded px-2 py-1 text-[9px] font-bold uppercase ${stateClass(module.state)}`}>
                  {module.state}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div>Version: <span className="text-slate-300">{module.version ?? '—'}</span></div>
                <div>Size: <span className="text-slate-300">{formatBytes(module.installedSize)}</span></div>
                <div>Integrity: <span className="text-slate-300">{module.integrity}</span></div>
                <div>Entitlement: <span className="text-slate-300">{module.entitlement}</span></div>
              </div>
              {module.error && (
                <div className="mt-3 rounded bg-red-950/20 p-2 text-[10px] text-red-200/90">
                  {module.error.message}{module.error.repairable ? ' Rerun Setup to repair.' : ''}
                </div>
              )}
              <div className="mt-4 flex items-center gap-2">
                {installed ? (
                  <button
                    type="button"
                    disabled={busy === module.moduleId || (!module.enabled && !canEnable)}
                    onClick={() => void setEnabled(module, !module.enabled)}
                    className="rounded border border-cyber-electric/30 px-3 py-1.5 text-[10px] font-semibold text-cyber-electric disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {module.enabled ? 'Disable' : 'Enable'}
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500">Not installed — rerun CLX Setup</span>
                )}
                {installed && (module.state === 'ready' || module.state === 'running') && (
                  <button
                    type="button"
                    disabled={busy === module.moduleId}
                    onClick={() => void restart(module)}
                    className="rounded border border-slate-600 px-3 py-1.5 text-[10px] text-slate-300 disabled:opacity-40"
                  >
                    Restart runtime
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
}

function stateClass(state: ModuleSnapshot['state']) {
  if (state === 'ready' || state === 'running') return 'bg-emerald-500/15 text-emerald-300';
  if (state === 'disabled') return 'bg-slate-500/15 text-slate-300';
  if (state === 'notInstalled') return 'bg-slate-800 text-slate-500';
  if (state === 'locked') return 'bg-amber-500/15 text-amber-300';
  return 'bg-red-500/15 text-red-300';
}

