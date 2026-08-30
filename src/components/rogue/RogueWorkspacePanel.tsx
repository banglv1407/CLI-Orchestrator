import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TaskModal } from './TaskModal';
import { RogueCanvas } from './RogueCanvas';
import { beginMeeting, castVote, completeTask, createRound, localKill, RogueSnapshot, snapshotRound } from './gameCore';

interface RogueWorkspacePanelProps {
  isVisible: boolean;
}

const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e'];

export const RogueWorkspacePanel: React.FC<RogueWorkspacePanelProps> = ({ isVisible }) => {
  const roundRef = useRef(createRound());
  const inputRef = useRef(new Set<string>());
  const [snapshot, setSnapshot] = useState<RogueSnapshot>(() => snapshotRound(roundRef.current));
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [name, setName] = useState('Operator_01');
  const [color, setColor] = useState(COLORS[0]);
  const [role, setRole] = useState<'system_engineer' | 'rogue_agent'>('system_engineer');
  const [voteTarget, setVoteTarget] = useState<string | null>(null);

  const sync = useCallback((next: RogueSnapshot) => setSnapshot(next), []);
  const syncNow = useCallback(() => setSnapshot(snapshotRound(roundRef.current)), []);
  const resetLobby = useCallback(() => {
    roundRef.current = createRound(role, name, color);
    setActiveTaskId(null);
    setVoteTarget(null);
    syncNow();
  }, [color, name, role, syncNow]);
  const start = useCallback(() => {
    roundRef.current = createRound(role, name, color);
    roundRef.current.phase = 'running';
    setActiveTaskId(null);
    syncNow();
  }, [color, name, role, syncNow]);
  const openTask = useCallback(() => {
    const next = snapshotRound(roundRef.current);
    if (next.nearbyTask) setActiveTaskId(next.nearbyTask.id);
  }, []);
  const report = useCallback(() => { beginMeeting(roundRef.current); setVoteTarget(null); syncNow(); }, [syncNow]);
  const kill = useCallback(() => { localKill(roundRef.current); syncNow(); }, [syncNow]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        event.preventDefault();
        inputRef.current.add(event.code);
      }
      if (event.repeat) return;
      if (event.code === 'KeyE') openTask();
      if (event.code === 'KeyQ') kill();
      if (event.code === 'KeyR') report();
    };
    const onKeyUp = (event: KeyboardEvent) => inputRef.current.delete(event.code);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); inputRef.current.clear(); };
  }, [isVisible, kill, openTask, report]);

  const activeTask = snapshot.tasks.find((task) => task.id === activeTaskId);
  const isEngineer = snapshot.localPlayer.role === 'system_engineer';

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950 text-white select-none">
      <RogueCanvas isVisible={isVisible} roundRef={roundRef} inputRef={inputRef} onSnapshot={sync} />

      {snapshot.phase === 'running' && (
        <>
          <div className="absolute left-4 top-4 z-20 min-w-[270px] rounded-2xl border border-cyan-400/25 bg-slate-950/85 p-3 shadow-2xl shadow-cyan-950/30 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-wider text-slate-300">
              <span>STATION CALIBRATION</span><span className="text-emerald-300">{Math.round(snapshot.taskProgress * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300" style={{ width: `${snapshot.taskProgress * 100}%` }} /></div>
            <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[10px]">
              <span className={isEngineer ? 'text-cyan-300' : 'text-rose-300'}>{isEngineer ? 'SYSTEM ENGINEER' : 'ROGUE AGENT'}</span>
              <span className="text-slate-400">145 u/s · fixed step</span>
            </div>
          </div>
          <div className="absolute bottom-5 right-5 z-20 flex flex-wrap justify-end gap-2">
            {snapshot.nearbyTask && <button onClick={openTask} className="rounded-xl border border-amber-300/60 bg-amber-400 px-4 py-3 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/25 hover:bg-amber-300">CALIBRATE [E]</button>}
            {!isEngineer && <button disabled={!snapshot.nearbyTarget || snapshot.killCooldown > 0} onClick={kill} className="rounded-xl border border-rose-300/30 bg-rose-600 px-4 py-3 text-xs font-black disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500">DISABLE [Q]{snapshot.killCooldown ? ` · ${snapshot.killCooldown}s` : ''}</button>}
            <button onClick={report} className="rounded-xl border border-cyan-400/30 bg-slate-950/90 px-4 py-3 text-xs font-bold text-cyan-200 hover:border-cyan-300">CALL REVIEW [R]</button>
          </div>
          <div className="absolute bottom-5 left-5 z-20 rounded-xl border border-slate-700/70 bg-slate-950/80 px-3 py-2 font-mono text-[10px] text-slate-400">WASD / ARROWS · E ACTION · R REVIEW{!snapshot.localPlayer.isAlive ? ' · ECHO MODE' : ''}</div>
        </>
      )}

      {snapshot.phase === 'lobby' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/84 p-6 backdrop-blur-md">
          <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan-400/25 bg-slate-900/92 shadow-2xl shadow-cyan-950/60 md:grid-cols-[1.1fr_.9fr]">
            <div className="relative min-h-[420px] overflow-hidden border-b border-slate-700/70 p-8 md:border-b-0 md:border-r">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_35%,rgba(8,145,178,.25),transparent_45%)]" />
              <div className="relative"><p className="font-mono text-[11px] tracking-[.28em] text-cyan-300">ENTERTAINMENT // LOCAL SIMULATION</p><h1 className="mt-3 text-4xl font-black tracking-tight text-white">ROGUE NODE</h1><p className="mt-3 max-w-md text-sm leading-6 text-slate-300">An original local deduction mission. Repair the station, identify the rogue process, and move with intent—not twitch speed.</p></div>
              <img src="/rogue/assets/operator-atlas.png" alt="Original Rogue Node operator sprites" className="relative mx-auto mt-5 h-48 w-48 object-cover object-[0_0] [image-rendering:pixelated]" />
              <div className="relative mt-3 grid grid-cols-3 gap-2 text-center font-mono text-[10px]"><span className="rounded-lg bg-slate-800/80 p-2 text-cyan-200">LOCAL BOTS</span><span className="rounded-lg bg-slate-800/80 p-2 text-cyan-200">FIXED 60Hz</span><span className="rounded-lg bg-slate-800/80 p-2 text-cyan-200">NO NETWORK</span></div>
            </div>
            <div className="p-8">
              <label className="text-xs font-bold text-slate-300">OPERATOR ID</label><input value={name} maxLength={18} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-400" />
              <p className="mt-5 text-xs font-bold text-slate-300">PROCESS ALIGNMENT</p><div className="mt-2 grid grid-cols-2 gap-2"><button onClick={() => setRole('system_engineer')} className={`rounded-xl border p-3 text-left text-xs ${role === 'system_engineer' ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200' : 'border-slate-700 text-slate-400'}`}><b>ENGINEER</b><br />Complete all tasks.</button><button onClick={() => setRole('rogue_agent')} className={`rounded-xl border p-3 text-left text-xs ${role === 'rogue_agent' ? 'border-rose-400 bg-rose-400/10 text-rose-200' : 'border-slate-700 text-slate-400'}`}><b>ROGUE</b><br />Outnumber the crew.</button></div>
              <p className="mt-5 text-xs font-bold text-slate-300">SIGNAL COLOR</p><div className="mt-2 flex gap-2">{COLORS.map((entry) => <button key={entry} aria-label={entry} onClick={() => setColor(entry)} className={`h-7 w-7 rounded-full border-2 ${color === entry ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: entry }} />)}</div>
              <button onClick={start} className="mt-7 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/20 hover:from-cyan-300 hover:to-blue-400">START LOCAL MISSION</button>
              <p className="mt-3 text-center font-mono text-[10px] text-slate-500">Original sprite art · local sandbox · no online room</p>
            </div>
          </div>
        </div>
      )}

      {activeTask && snapshot.phase === 'running' && <TaskModal task={activeTask} onComplete={(taskId) => { completeTask(roundRef.current, taskId); setActiveTaskId(null); syncNow(); }} onClose={() => setActiveTaskId(null)} />}

      {snapshot.phase === 'meeting' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/90 p-6 backdrop-blur-md"><div className="w-full max-w-3xl rounded-3xl border border-rose-400/35 bg-slate-900 p-6 shadow-2xl"><div className="flex items-start justify-between border-b border-slate-700 pb-4"><div><p className="font-mono text-[10px] tracking-[.2em] text-rose-300">STATION REVIEW</p><h2 className="mt-1 text-2xl font-black">CAST A PROCESS VOTE</h2></div><span className="rounded-xl bg-slate-950 px-4 py-2 font-mono text-lg text-amber-300">{snapshot.meetingSeconds}s</span></div><p className="mt-4 text-sm text-slate-400">Choose a live process, or skip. The session returns to the station when the timer expires.</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{snapshot.players.filter((player) => player.isAlive).map((player) => <button key={player.id} onClick={() => setVoteTarget(player.id)} className={`flex items-center justify-between rounded-xl border p-3 text-left ${voteTarget === player.id ? 'border-rose-400 bg-rose-400/10' : 'border-slate-700 bg-slate-950/60'}`}><span><b>{player.name}</b>{player.isLocal && <small className="ml-2 text-cyan-300">YOU</small>}<br /><small className="text-slate-500">{player.currentRoom}</small></span><span className="h-3 w-3 rounded-full" style={{ backgroundColor: player.color }} /></button>)}</div><div className="mt-5 flex gap-2"><button onClick={() => { castVote(roundRef.current, voteTarget); setVoteTarget(null); syncNow(); }} className="flex-1 rounded-xl bg-rose-500 py-3 text-xs font-black text-white">CONFIRM VOTE</button><button onClick={() => { castVote(roundRef.current, null); syncNow(); }} className="rounded-xl border border-slate-600 px-5 text-xs font-bold text-slate-300">SKIP</button></div></div></div>
      )}

      {snapshot.phase === 'game_over' && <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-6 backdrop-blur-md"><div className="w-full max-w-lg rounded-3xl border border-cyan-400/30 bg-slate-900 p-8 text-center shadow-2xl"><p className="font-mono text-[10px] tracking-[.25em] text-cyan-300">MISSION COMPLETE</p><h2 className={`mt-3 text-3xl font-black ${snapshot.winner === 'system_engineer' ? 'text-cyan-300' : 'text-rose-300'}`}>{snapshot.winner === 'system_engineer' ? 'STATION SECURED' : 'STATION BREACHED'}</h2><p className="mt-3 text-sm text-slate-300">{snapshot.summary}</p><div className="mt-6 flex justify-center gap-2">{snapshot.players.map((player) => <span key={player.id} title={player.name} className={`h-3 w-3 rounded-full ${player.isAlive ? '' : 'opacity-25'}`} style={{ backgroundColor: player.color }} />)}</div><button onClick={resetLobby} className="mt-8 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-xs font-black text-slate-950">RETURN TO LOBBY</button></div></div>}
    </div>
  );
};