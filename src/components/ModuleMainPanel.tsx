import { useEffect, useRef, useState } from 'react';

import { loadUiContributions, moduleCatalog, type ModuleSnapshot } from '../lib/modules';

interface ModuleMainPanelProps {
  moduleId: string;
  contributionId: string;
}

export function ModuleMainPanel({ moduleId, contributionId }: ModuleMainPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let teardown: void | (() => void);
    setError(null);
    void (async () => {
      const catalog = await moduleCatalog();
      const snapshot = catalog.find((module): module is ModuleSnapshot => module.moduleId === moduleId);
      if (!snapshot) throw new Error(`Unknown module: ${moduleId}`);
      const contributions = await loadUiContributions(snapshot);
      const contribution = contributions.get(contributionId);
      if (!contribution || contribution.kind !== 'mainPanel') {
        throw new Error(`Module main panel is unavailable: ${contributionId}`);
      }
      if (!active || !containerRef.current) return;
      teardown = contribution.mount(containerRef.current);
    })().catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : String(reason));
    });
    return () => {
      active = false;
      if (typeof teardown === 'function') teardown();
    };
  }, [contributionId, moduleId]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-red-300">
        <div className="max-w-lg rounded border border-red-500/30 bg-red-950/20 p-4">
          <div className="font-semibold">Module failed closed</div>
          <div className="mt-1 text-red-200/80">{error}</div>
          <div className="mt-3 text-xs text-slate-400">Rerun CLX Setup to repair or modify installed pack files.</div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full min-h-0 w-full" />;
}

