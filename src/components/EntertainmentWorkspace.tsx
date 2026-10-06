import { t as tr } from '../i18n';
import React, { useState } from 'react';
import { NesWorkspacePanel } from './NesWorkspacePanel';
import { RogueWorkspacePanel } from './rogue/RogueWorkspacePanel';

interface EntertainmentWorkspaceProps {
  isVisible: boolean;
}

export type EntertainmentSubTab = 'rogue' | 'nes';

export const EntertainmentWorkspace: React.FC<EntertainmentWorkspaceProps> = ({ isVisible }) => {
  const [activeSubTab, setActiveSubTab] = useState<EntertainmentSubTab>('nes');

  return (
    <div className="flex h-full w-full flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Header / Sub-tab Switcher */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-cyber-line/20 bg-slate-900/90 px-4 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕹️</span>
            <span className="font-bold tracking-wide text-white uppercase text-xs font-mono">{tr("Entertainment Hub")}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Navigation Pill Buttons */}
          <nav className="flex items-center gap-1.5 rounded-lg bg-slate-950/70 p-1 border border-slate-800/80">
            <button
              onClick={() => setActiveSubTab('rogue')}
              className={`hidden items-center gap-2 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                activeSubTab === 'rogue'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <span>🤖</span>
              <span>{tr("Rogue Node (AI Outpost)")}</span>
              <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-mono text-emerald-300 border border-emerald-500/30">{tr("HOT")}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('nes')}
              className={`flex items-center gap-2 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                activeSubTab === 'nes'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <span>🎮</span>
              <span>{tr("NES Retro Multiplayer")}</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-800/60 px-2.5 py-0.5 border border-slate-700/50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{tr("Online Services Ready")}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Area: Keep both mounted for instant tab switching & background state */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        {/* Rogue Node View */}
        <div
          className={`absolute inset-0 h-full w-full ${
            activeSubTab === 'rogue' ? 'block' : 'hidden pointer-events-none'
          }`}
        >
          {false && <RogueWorkspacePanel isVisible={isVisible && activeSubTab === 'rogue'} />}
        </div>

        {/* NES Retro View */}
        <div
          className={`absolute inset-0 h-full w-full ${
            activeSubTab === 'nes' ? 'block' : 'hidden pointer-events-none'
          }`}
        >
          <NesWorkspacePanel isVisible={isVisible && activeSubTab === 'nes'} />
        </div>
      </div>
    </div>
  );
};
