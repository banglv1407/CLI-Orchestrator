import React from 'react';
import { Player } from './types';

interface GameOverModalProps {
  winningTeam: 'system_engineer' | 'rogue_agent';
  players: Player[];
  summary: string;
  onReturnToLobby: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winningTeam,
  players,
  summary,
  onReturnToLobby,
}) => {
  const isEngineerWin = winningTeam === 'system_engineer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6 select-none animate-fadeIn">
      <div
        className={`flex w-full max-w-xl flex-col items-center rounded-3xl border p-8 shadow-2xl text-slate-100 text-center ${
          isEngineerWin
            ? 'border-cyan-500/40 bg-slate-950/95 shadow-cyan-950/40'
            : 'border-rose-500/40 bg-slate-950/95 shadow-rose-950/40'
        }`}
      >
        {/* Victory Icon */}
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-3xl text-4xl mb-4 shadow-lg ${
            isEngineerWin
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}
        >
          {isEngineerWin ? '🛡️' : '⚔️'}
        </div>

        {/* Title */}
        <h2
          className={`text-2xl font-bold font-mono uppercase tracking-wider ${
            isEngineerWin ? 'text-cyan-400' : 'text-rose-400'
          }`}
        >
          {isEngineerWin ? 'VICTORY // CORE SECURED' : 'DEFEAT // STATION BREACHED'}
        </h2>
        <p className="mt-2 text-xs text-slate-300 max-w-md">{summary}</p>

        {/* Rogues Reveal list */}
        <div className="mt-6 w-full rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Identified Infiltrators
          </span>
          <div className="mt-3 flex justify-center gap-3">
            {players
              .filter((p) => p.role === 'rogue_agent')
              .map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-2 rounded-xl bg-rose-950/40 border border-rose-800/60 px-3 py-1.5"
                >
                  <div
                    className="h-6 w-6 rounded-lg border border-white/20 flex items-center justify-center text-xs"
                    style={{ backgroundColor: r.color }}
                  >
                    🤖
                  </div>
                  <span className="text-xs font-semibold text-rose-200">{r.name}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Return Button */}
        <button
          onClick={onReturnToLobby}
          className={`mt-8 w-full rounded-2xl py-3 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 ${
            isEngineerWin
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/25'
              : 'bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/25'
          }`}
        >
          RETURN TO LOBBY
        </button>
      </div>
    </div>
  );
};
