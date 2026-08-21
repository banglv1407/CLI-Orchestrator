import { useState, useEffect } from 'react';
import { petListPacks } from './api';

interface PetPack { manifest: { id: string; name: string; pets: any[] } }

export function PetSettingsSection() {
  const [packs, setPacks] = useState<PetPack[]>([]);
  useEffect(() => {
    petListPacks().then((r: any) => setPacks(r?.packs || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-3 text-xs">
      <h3 className="font-display text-sm uppercase tracking-wider text-slate-200 font-bold">Desktop Pets</h3>
      {packs.length === 0 ? (
        <p className="text-slate-500 italic text-[11px]">No pet packs installed.</p>
      ) : (
        <div className="space-y-1">
          {packs.map((p) => (
            <div key={p.manifest.id} className="flex items-center justify-between p-2 rounded border border-cyber-line/40 bg-cyber-base/40">
              <span className="font-semibold text-slate-200">{p.manifest.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{p.manifest.pets.length} pets</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
