import { Player, QUANTUM_STATION_MAP, StationMap, TaskPoint, Wall } from './types';

export type RoguePhase = 'lobby' | 'running' | 'meeting' | 'game_over';
export type Direction = 'down' | 'left' | 'right' | 'up';

export const PLAYER_SPEED = 145;
export const GHOST_SPEED = 165;
const BOT_SPEED = 108;
const PLAYER_RADIUS = 18;
const TASK_RANGE = 54;
const KILL_RANGE = 44;
const KILL_COOLDOWN_SECONDS = 18;

export interface RogueRound {
  phase: RoguePhase;
  players: Player[];
  tasks: TaskPoint[];
  elapsed: number;
  killCooldown: number;
  meetingSeconds: number;
  winner?: 'system_engineer' | 'rogue_agent';
  summary?: string;
  botTargets: Record<string, number>;
}

export interface RogueSnapshot {
  phase: RoguePhase;
  players: Player[];
  tasks: TaskPoint[];
  localPlayer: Player;
  nearbyTask?: TaskPoint;
  nearbyTarget?: Player;
  taskProgress: number;
  killCooldown: number;
  meetingSeconds: number;
  winner?: 'system_engineer' | 'rogue_agent';
  summary?: string;
}

const spawnPlayers = (role: 'system_engineer' | 'rogue_agent', name: string, color: string): Player[] => {
  const botRoles = role === 'rogue_agent'
    ? ['system_engineer', 'system_engineer', 'system_engineer'] as const
    : ['rogue_agent', 'system_engineer', 'system_engineer'] as const;
  return [
    { id: 'local-player', name: name.trim() || 'Operator_01', color, x: 1200, y: 550, vx: 0, vy: 0, isAlive: true, role, isLocal: true, facing: 'down', currentRoom: 'Cafeteria / Command Core' },
    { id: 'bot-2', name: 'Cyber_Zero', color: '#ef4444', x: role === 'system_engineer' ? 1900 : 1260, y: role === 'system_engineer' ? 780 : 550, vx: 0, vy: 0, isAlive: true, role: botRoles[0], isLocal: false, facing: 'left', currentRoom: role === 'system_engineer' ? 'Server Farm / Comms' : 'Cafeteria / Command Core' },
    { id: 'bot-3', name: 'Aether_9', color: '#10b981', x: 1140, y: 590, vx: 0, vy: 0, isAlive: true, role: botRoles[1], isLocal: false, facing: 'right', currentRoom: 'Cafeteria / Command Core' },
    { id: 'bot-4', name: 'Volt_Echo', color: '#f59e0b', x: 1210, y: 640, vx: 0, vy: 0, isAlive: true, role: botRoles[2], isLocal: false, facing: 'up', currentRoom: 'Cafeteria / Command Core' },
  ];
};

export const createRound = (role: 'system_engineer' | 'rogue_agent' = 'system_engineer', name = 'Operator_01', color = '#06b6d4'): RogueRound => ({
  phase: 'lobby',
  players: spawnPlayers(role, name, color),
  tasks: QUANTUM_STATION_MAP.tasks.map((task) => ({ ...task, isCompleted: false })),
  elapsed: 0,
  killCooldown: 0,
  meetingSeconds: 0,
  botTargets: { 'bot-2': 0, 'bot-3': 1, 'bot-4': 2 },
});

const getRoom = (x: number, y: number, map: StationMap = QUANTUM_STATION_MAP) =>
  map.rooms.find((room) => x >= room.x && x <= room.x + room.w && y >= room.y && y <= room.y + room.h)?.name ?? 'Transit Deck';

const isBlocked = (x: number, y: number, walls: Wall[] = QUANTUM_STATION_MAP.walls) => walls.some((wall) =>
  x + PLAYER_RADIUS > wall.x && x - PLAYER_RADIUS < wall.x + wall.w && y + PLAYER_RADIUS > wall.y && y - PLAYER_RADIUS < wall.y + wall.h,
);

const move = (player: Player, dx: number, dy: number) => {
  const nextX = Math.max(PLAYER_RADIUS + 4, Math.min(QUANTUM_STATION_MAP.width - PLAYER_RADIUS - 4, player.x + dx));
  const nextY = Math.max(PLAYER_RADIUS + 4, Math.min(QUANTUM_STATION_MAP.height - PLAYER_RADIUS - 4, player.y + dy));
  if (!isBlocked(nextX, player.y)) player.x = nextX;
  if (!isBlocked(player.x, nextY)) player.y = nextY;
  player.vx = dx;
  player.vy = dy;
  if (Math.abs(dx) + Math.abs(dy) > 0.01) {
    player.facing = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
  }
  player.currentRoom = getRoom(player.x, player.y);
};

const distance = (a: Player | TaskPoint, b: Player | TaskPoint) => Math.hypot(a.x - b.x, a.y - b.y);

const finish = (round: RogueRound, winner: 'system_engineer' | 'rogue_agent', summary: string) => {
  round.phase = 'game_over';
  round.winner = winner;
  round.summary = summary;
};

const checkWinner = (round: RogueRound) => {
  if (round.phase === 'game_over') return;
  if (round.tasks.every((task) => task.isCompleted)) {
    finish(round, 'system_engineer', 'All station subsystems are calibrated.');
    return;
  }
  const alive = round.players.filter((player) => player.isAlive);
  const rogues = alive.filter((player) => player.role === 'rogue_agent').length;
  const engineers = alive.length - rogues;
  if (rogues === 0) finish(round, 'system_engineer', 'Every rogue process was ejected.');
  else if (rogues >= engineers) finish(round, 'rogue_agent', 'Rogue processes now control the station.');
};

const completeNearestTaskFor = (round: RogueRound, player: Player) => {
  const task = round.tasks.find((candidate) => !candidate.isCompleted && distance(player, candidate) < TASK_RANGE);
  if (task) task.isCompleted = true;
};

const stepBots = (round: RogueRound, dt: number) => {
  const local = round.players[0];
  for (const bot of round.players.filter((player) => !player.isLocal && player.isAlive)) {
    let target: TaskPoint | Player | undefined;
    if (bot.role === 'rogue_agent') {
      target = round.players.filter((player) => player.role !== 'rogue_agent' && player.isAlive).sort((a, b) => distance(bot, a) - distance(bot, b))[0];
      if (target && distance(bot, target) < KILL_RANGE && round.killCooldown <= 0) {
        target.isAlive = false;
        round.killCooldown = 8;
        checkWinner(round);
        continue;
      }
    } else {
      const openTasks = round.tasks.filter((task) => !task.isCompleted);
      if (!openTasks.length) continue;
      const index = round.botTargets[bot.id] % openTasks.length;
      target = openTasks[index];
      if (distance(bot, target) < TASK_RANGE - 8) {
        completeNearestTaskFor(round, bot);
        round.botTargets[bot.id] = (round.botTargets[bot.id] + 1) % Math.max(1, openTasks.length);
        continue;
      }
    }
    if (target) {
      const dx = target.x - bot.x;
      const dy = target.y - bot.y;
      const length = Math.hypot(dx, dy) || 1;
      move(bot, dx / length * BOT_SPEED * dt, dy / length * BOT_SPEED * dt);
    }
  }
  if (!local.isAlive) local.vx = local.vy = 0;
};

export const stepRound = (round: RogueRound, input: ReadonlySet<string>, dt: number) => {
  if (round.phase === 'meeting') {
    round.meetingSeconds -= dt;
    if (round.meetingSeconds <= 0) round.phase = 'running';
    return;
  }
  if (round.phase !== 'running') return;
  round.elapsed += dt;
  round.killCooldown = Math.max(0, round.killCooldown - dt);
  const local = round.players[0];
  const x = (input.has('KeyD') || input.has('ArrowRight') ? 1 : 0) - (input.has('KeyA') || input.has('ArrowLeft') ? 1 : 0);
  const y = (input.has('KeyS') || input.has('ArrowDown') ? 1 : 0) - (input.has('KeyW') || input.has('ArrowUp') ? 1 : 0);
  const length = Math.hypot(x, y) || 1;
  const speed = local.isAlive ? PLAYER_SPEED : GHOST_SPEED;
  move(local, x / length * speed * dt, y / length * speed * dt);
  stepBots(round, dt);
  checkWinner(round);
};

export const beginMeeting = (round: RogueRound) => {
  if (round.phase !== 'running') return;
  round.phase = 'meeting';
  round.meetingSeconds = 34;
};

export const completeTask = (round: RogueRound, taskId: string) => {
  const local = round.players[0];
  const task = round.tasks.find((candidate) => candidate.id === taskId && !candidate.isCompleted);
  if (round.phase === 'running' && local.isAlive && task && distance(local, task) < TASK_RANGE + 16) {
    task.isCompleted = true;
    checkWinner(round);
  }
};

export const localKill = (round: RogueRound) => {
  const local = round.players[0];
  if (round.phase !== 'running' || local.role !== 'rogue_agent' || !local.isAlive || round.killCooldown > 0) return;
  const target = round.players.find((player) => !player.isLocal && player.isAlive && player.role !== 'rogue_agent' && distance(local, player) < KILL_RANGE);
  if (target) {
    target.isAlive = false;
    round.killCooldown = KILL_COOLDOWN_SECONDS;
    checkWinner(round);
  }
};

export const castVote = (round: RogueRound, targetId: string | null) => {
  if (round.phase !== 'meeting') return;
  const target = round.players.find((player) => player.id === targetId && player.isAlive);
  if (target) target.isAlive = false;
  round.phase = 'running';
  checkWinner(round);
};

export const snapshotRound = (round: RogueRound): RogueSnapshot => {
  const localPlayer = round.players[0];
  const nearbyTask = localPlayer.isAlive && localPlayer.role === 'system_engineer'
    ? round.tasks.find((task) => !task.isCompleted && distance(localPlayer, task) < TASK_RANGE)
    : undefined;
  const nearbyTarget = localPlayer.isAlive && localPlayer.role === 'rogue_agent'
    ? round.players.find((player) => !player.isLocal && player.isAlive && player.role !== 'rogue_agent' && distance(localPlayer, player) < KILL_RANGE)
    : undefined;
  return {
    phase: round.phase,
    players: round.players.map((player) => ({ ...player })),
    tasks: round.tasks.map((task) => ({ ...task })),
    localPlayer: { ...localPlayer },
    nearbyTask: nearbyTask ? { ...nearbyTask } : undefined,
    nearbyTarget: nearbyTarget ? { ...nearbyTarget } : undefined,
    taskProgress: round.tasks.filter((task) => task.isCompleted).length / round.tasks.length,
    killCooldown: Math.ceil(round.killCooldown),
    meetingSeconds: Math.max(0, Math.ceil(round.meetingSeconds)),
    winner: round.winner,
    summary: round.summary,
  };
};
