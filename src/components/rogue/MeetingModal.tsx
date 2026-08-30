import React, { useState } from 'react';
import { Player } from './types';

interface MeetingModalProps {
  players: Player[];
  localPlayer: Player;
  timeLeft: number;
  isDiscussion: boolean;
  onCastVote: (targetId: string | null) => void;
  onSendChat: (text: string) => void;
  chatMessages: { sender: string; text: string; isGhost: boolean }[];
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  players,
  localPlayer,
  timeLeft,
  isDiscussion,
  onCastVote,
  onSendChat,
  chatMessages,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const handleVote = (targetId: string | null) => {
    if (hasVoted || isDiscussion || !localPlayer.isAlive) return;
    setHasVoted(true);
    onCastVote(targetId);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6 select-none animate-fadeIn">
      <div className="flex h-[88vh] w-full max-w-5xl rounded-2xl border border-rose-500/40 bg-slate-950/95 shadow-2xl shadow-rose-950/40 overflow-hidden text-slate-100">
        
        {/* Left Area: Diagnostic Emergency Meeting & Player Grid */}
        <div className="flex flex-1 flex-col border-r border-slate-800/80 p-6">
          {/* Header Status Bar */}
          <header className="flex items-center justify-between border-b border-rose-500/30 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-xl border border-rose-500/40 animate-pulse">
                🚨
              </span>
              <div>
                <h2 className="text-base font-bold uppercase tracking-wider text-rose-400 font-mono">
                  KERNEL LOCKDOWN // DIAGNOSTIC MEETING
                </h2>
                <p className="text-xs text-slate-400">
                  {isDiscussion ? '🔒 Discussion Phase: Review subroutines' : '🗳️ Voting Phase: Cast deallocation vote'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">COUNTDOWN:</span>
              <span className="text-lg font-bold font-mono text-amber-400">
                {timeLeft}s
              </span>
            </div>
          </header>

          {/* Player Voting Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1">
            {players.map((p) => {
              const isSelf = p.id === localPlayer.id;
              const isSelected = selectedPlayer === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (p.isAlive && !hasVoted && !isDiscussion && localPlayer.isAlive) {
                      setSelectedPlayer(isSelected ? null : p.id);
                    }
                  }}
                  className={`flex items-center justify-between rounded-xl p-3.5 border transition-all cursor-pointer ${
                    !p.isAlive
                      ? 'border-slate-800/50 bg-slate-900/30 opacity-40 grayscale cursor-not-allowed'
                      : isSelected
                      ? 'border-rose-500 bg-rose-500/10 shadow-md shadow-rose-500/20 ring-1 ring-rose-400'
                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Player Color Avatar */}
                    <div
                      className="h-9 w-9 rounded-lg border border-white/20 flex items-center justify-center font-bold text-xs shadow-inner"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.isAlive ? '🤖' : '💀'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{p.name}</span>
                        {isSelf && (
                          <span className="text-[9px] font-mono rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {p.isAlive ? 'SUBROUTINE ACTIVE' : 'TERMINATED'}
                      </span>
                    </div>
                  </div>

                  {/* Vote button indicator */}
                  {isSelected && p.isAlive && !hasVoted && !isDiscussion && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(p.id);
                      }}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-md"
                    >
                      VOTE
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Controls: Skip Vote */}
          <footer className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              onClick={() => handleVote(null)}
              disabled={hasVoted || isDiscussion || !localPlayer.isAlive}
              className={`rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium transition-all ${
                hasVoted || isDiscussion || !localPlayer.isAlive
                  ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500'
                  : 'bg-slate-900 text-slate-300 hover:border-amber-500/50 hover:bg-slate-800 hover:text-white'
              }`}
            >
              ⏭️ Skip Diagnostic Vote
            </button>

            {hasVoted && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span>✓</span> Vote Recorded by Kernel
              </span>
            )}
          </footer>
        </div>

        {/* Right Area: Meeting Realtime Diagnostic Terminal (Chat) */}
        <div className="flex w-80 flex-col bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
            <span className="text-sm">💬</span>
            <span className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider">
              Emergency Comms
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-2.5 ${
                  msg.isGhost
                    ? 'bg-purple-950/30 border border-purple-800/40 text-purple-300'
                    : 'bg-slate-950/80 border border-slate-800/60 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1">
                  <span className="font-bold text-cyan-400">{msg.sender}</span>
                  {msg.isGhost && <span className="text-purple-400">[ECHO]</span>}
                </div>
                <p className="break-words">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <form onSubmit={handleChatSubmit} className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder={localPlayer.isAlive ? "State your reasoning..." : "Dead units comm channel..."}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-cyan-600 px-3 py-2 text-xs font-bold text-white hover:bg-cyan-500"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
