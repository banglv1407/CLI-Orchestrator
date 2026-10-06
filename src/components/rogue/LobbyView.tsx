import { t as tr } from '../../i18n';
import React, { useState } from 'react';
import { Player } from './types';

interface LobbyViewProps {
  players: Player[];
  localPlayer: Player;
  onUpdateName: (name: string) => void;
  onUpdateColor: (color: string) => void;
  onUpdateRole: (role: 'system_engineer' | 'rogue_agent') => void;
  onStartGame: () => void;
}

export const COLOR_PALETTE = [
  { id: 'cyan', hex: '#06b6d4', label: 'Quantum Cyan' },
  { id: 'rose', hex: '#ef4444', label: 'Rogue Crimson' },
  { id: 'emerald', hex: '#10b981', label: 'Matrix Emerald' },
  { id: 'amber', hex: '#f59e0b', label: 'Plasma Amber' },
  { id: 'violet', hex: '#8b5cf6', label: 'Void Violet' },
  { id: 'fuchsia', hex: '#d946ef', label: 'Cyber Neon' },
  { id: 'blue', hex: '#3b82f6', label: 'Cobalt Shield' },
  { id: 'slate', hex: '#64748b', label: 'Titanium Grey' },
];

export const LobbyView: React.FC<LobbyViewProps> = ({
  players,
  localPlayer,
  onUpdateName,
  onUpdateColor,
  onUpdateRole,
  onStartGame,
}) => {
  const [copied, setCopied] = useState(false);
  const roomId = 'ROGUE-NODE-8891';

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`🎮 Join Rogue Node AI Outpost room: ${roomId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/95 p-6 backdrop-blur-md select-none text-slate-100 animate-fadeIn">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-8 shadow-2xl shadow-cyan-950/40">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-3xl shadow-lg shadow-cyan-500/20">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-mono uppercase tracking-wider text-white">{tr("Rogue Node // Quantum Outpost")}</h1>
                <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/40">{tr("LOBBY")}</span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">{tr("Room Code: ")}<span className="text-cyan-400 font-bold">{roomId}</span>{tr(" (Encrypted by Nostr NIP-98)")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyInvite}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-mono font-semibold text-slate-200 hover:border-cyan-500 hover:text-white transition-all shadow-md"
            >
              <span>{copied ? '✓' : '🔗'}</span>
              <span>{copied ? tr("Invite Copied!") : tr("Copy Buzz Invite")}</span>
            </button>

            <button
              onClick={onStartGame}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all hover:scale-105"
            >
              <span>🚀</span>
              <span>{tr("START MISSION")}</span>
            </button>
          </div>
        </header>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
          {/* Left: Customization Panel */}
          <div className="col-span-5 flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">{tr("Android Operator Config")}</h2>

            {/* Operator Avatar Preview */}
            <div className="flex items-center gap-4 rounded-xl bg-slate-900/80 p-4 border border-slate-800">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/20 text-3xl shadow-inner transition-all"
                style={{ backgroundColor: localPlayer.color }}
              >
                🤖
              </div>
              <div>
                <span className="text-sm font-bold text-white">{localPlayer.name}</span>
                <p className="text-[11px] font-mono text-cyan-400">
                  {localPlayer.role === 'rogue_agent' ? tr("⚔️ Rogue Agent") : tr("🔧 System Engineer")}
                </p>
              </div>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-slate-400">{tr("Callsign / Identity Name")}</label>
              <input
                type="text"
                value={localPlayer.name}
                onChange={(e) => onUpdateName(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Color Selection Palette */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-slate-400">{tr("Chassis Color Matrix")}</label>
              <div className="grid grid-cols-4 gap-2.5">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onUpdateColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`h-9 rounded-xl border-2 transition-all hover:scale-105 ${
                      localPlayer.color === c.hex
                        ? 'border-white ring-2 ring-cyan-400 scale-105 shadow-md'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    title={tr(c.label)}
                  />
                ))}
              </div>
            </div>

            {/* Role Switcher (For Sandbox / Testing) */}
            <div className="flex flex-col gap-2 mt-auto">
              <label className="text-xs font-mono text-slate-400">{tr("Test Role Override")}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateRole('system_engineer')}
                  className={`rounded-xl py-2 text-xs font-semibold border transition-all ${
                    localPlayer.role === 'system_engineer'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >{tr("🔧 Engineer")}</button>
                <button
                  onClick={() => onUpdateRole('rogue_agent')}
                  className={`rounded-xl py-2 text-xs font-semibold border transition-all ${
                    localPlayer.role === 'rogue_agent'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >{tr("⚔️ Rogue")}</button>
              </div>
            </div>
          </div>

          {/* Right: Connected Crew Members (20 Max) */}
          <div className="col-span-7 flex flex-col rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">{tr("Connected Crew (")}{players.length}/20)
              </h2>
              <span className="text-xs font-mono text-emerald-400">{tr("● Mesh Synchronized")}</span>
            </div>

            {/* Players List Grid */}
            <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-lg shadow-inner"
                    style={{ backgroundColor: p.color }}
                  >
                    🤖
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{p.name}</span>
                      {p.id === localPlayer.id && (
                        <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[9px] font-mono text-cyan-300 border border-cyan-500/30">{tr("YOU")}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{tr("READY TO LAUNCH")}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Instruction Footer */}
            <footer className="mt-4 rounded-xl bg-slate-900/50 border border-slate-800/60 p-3 text-center">
              <p className="text-[11px] text-slate-400">{tr("Controls: ")}<kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-cyan-400 font-mono">WASD</kbd>{tr(" or ")}<kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-cyan-400 font-mono">{tr("ARROWS")}</kbd>{tr(" to move · ")}<kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-amber-400 font-mono">[E]</kbd>{tr(" Tasks & Vents · ")}<kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-rose-400 font-mono">[Q]</kbd>{tr(" Kill · ")}<kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-rose-400 font-mono">[R]</kbd>{tr(" Report/Meeting")}</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
