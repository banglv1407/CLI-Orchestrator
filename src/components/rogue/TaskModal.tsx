import React, { useState } from 'react';
import { TaskPoint } from './types';

interface TaskModalProps {
  task: TaskPoint;
  onComplete: (taskId: string) => void;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onComplete, onClose }) => {
  // Mini-game: Fix Wires state
  const [wireLeft, setWireLeft] = useState<number | null>(null);
  const [connectedWires, setConnectedWires] = useState<Record<number, number>>({});

  // Mini-game: Card Swipe state
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeStatus, setSwipeStatus] = useState<'idle' | 'swiping' | 'success' | 'fail'>('idle');

  // Mini-game: Quantum Disk state
  const [diskAngle, setDiskAngle] = useState(0);
  const [targetAngle] = useState(180);

  const colors = ['#ef4444', '#3b82f6', '#eab308', '#ec4899'];

  const handleConnectWire = (rightIdx: number) => {
    if (wireLeft !== null) {
      if (wireLeft === rightIdx) {
        const next = { ...connectedWires, [wireLeft]: rightIdx };
        setConnectedWires(next);
        setWireLeft(null);
        if (Object.keys(next).length === 4) {
          setTimeout(() => onComplete(task.id), 500);
        }
      } else {
        setWireLeft(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="relative w-full max-w-md rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/20 text-slate-100">
        <header className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            <div>
              <h3 className="font-bold text-sm text-cyan-400">{task.name}</h3>
              <p className="text-[11px] text-slate-400">{task.room} - Quantum Subsystem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </header>

        {/* Task type: Fix Wires */}
        {task.type === 'wires' && (
          <div className="flex flex-col gap-4 py-4">
            <p className="text-xs text-slate-300 text-center">
              Connect matching optical fiber frequencies:
            </p>
            <div className="flex justify-between items-center px-6">
              <div className="flex flex-col gap-4">
                {colors.map((c, i) => (
                  <button
                    key={`l-${i}`}
                    onClick={() => setWireLeft(i)}
                    style={{ backgroundColor: c }}
                    className={`h-7 w-12 rounded border-2 transition-all ${
                      wireLeft === i ? 'border-white ring-2 ring-cyan-400 scale-105' : 'border-black/50'
                    } ${connectedWires[i] !== undefined ? 'opacity-50' : ''}`}
                  />
                ))}
              </div>

              <div className="text-xs text-slate-500 font-mono">───⚡───</div>

              <div className="flex flex-col gap-4">
                {[2, 0, 3, 1].map((cIdx, i) => (
                  <button
                    key={`r-${i}`}
                    onClick={() => handleConnectWire(cIdx)}
                    style={{ backgroundColor: colors[cIdx] }}
                    className={`h-7 w-12 rounded border-2 border-black/50 transition-all ${
                      Object.values(connectedWires).includes(cIdx) ? 'opacity-50' : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Task type: Biometric Card Swipe */}
        {task.type === 'card_swipe' && (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 w-full text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                STATUS: {swipeStatus.toUpperCase()}
              </span>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all"
                  style={{ width: `${swipeProgress}%` }}
                />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={swipeProgress}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSwipeProgress(val);
                if (val === 100) {
                  setSwipeStatus('success');
                  setTimeout(() => onComplete(task.id), 400);
                }
              }}
              className="w-full h-8 accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">Drag authorization card across the scanner</p>
          </div>
        )}

        {/* Task type: Quantum Disk & Download (Fallback) */}
        {(task.type === 'quantum_disk' || task.type === 'download_data') && (
          <div className="flex flex-col items-center gap-6 py-6 text-center">
            <div className="text-4xl animate-spin">💿</div>
            <p className="text-xs text-slate-300">Synchronizing Quantum Memory Sector...</p>
            <button
              onClick={() => onComplete(task.id)}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-white shadow-lg hover:from-cyan-400 hover:to-blue-500"
            >
              Verify Quantum Hash
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
