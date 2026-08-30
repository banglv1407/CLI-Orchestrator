import { MutableRefObject, useEffect, useRef } from 'react';
import { RogueRound, RogueSnapshot, stepRound, snapshotRound } from './gameCore';
import { QUANTUM_STATION_MAP } from './types';

interface RogueCanvasProps {
  isVisible: boolean;
  roundRef: MutableRefObject<RogueRound>;
  inputRef: MutableRefObject<Set<string>>;
  onSnapshot: (snapshot: RogueSnapshot) => void;
}

const FRAME_SIZE = 192;
const PROP_FRAME_SIZE = 192;
const directionRow = { down: 0, left: 1, right: 2, up: 3 } as const;

const drawScene = (context: CanvasRenderingContext2D, width: number, height: number, round: RogueRound, atlas: HTMLImageElement | null, props: HTMLImageElement | null, tiles: HTMLImageElement | null) => {
  const local = round.players[0];
  const cameraX = Math.round(width / 2 - local.x);
  const cameraY = Math.round(height / 2 - local.y);
  context.fillStyle = '#020617';
  context.fillRect(0, 0, width, height);
  context.save();
  context.translate(cameraX, cameraY);
  context.imageSmoothingEnabled = false;
  const drawProp = (index: number, x: number, y: number, width: number, height: number) => {
    if (!props?.complete || !props.naturalWidth) return;
    const column = index % 4;
    const row = Math.floor(index / 4);
    context.drawImage(props, column * PROP_FRAME_SIZE, row * PROP_FRAME_SIZE, PROP_FRAME_SIZE, PROP_FRAME_SIZE, x - width / 2, y - height, width, height);
  };
  const drawTile = (index: number, x: number, y: number, size: number) => {
    if (!tiles?.complete || !tiles.naturalWidth) return false;
    const column = index % 4;
    const row = Math.floor(index / 4);
    context.drawImage(tiles, column * PROP_FRAME_SIZE, row * PROP_FRAME_SIZE, PROP_FRAME_SIZE, PROP_FRAME_SIZE, x, y, size, size);
    return true;
  };

  const gridLeft = Math.floor((-cameraX) / 80) * 80;
  const gridTop = Math.floor((-cameraY) / 80) * 80;
  let tilesReady = false;
  for (let x = gridLeft; x < -cameraX + width + 80; x += 80) {
    for (let y = gridTop; y < -cameraY + height + 80; y += 80) {
      const variation = Math.abs((x / 80 * 13 + y / 80 * 7) % 11);
      tilesReady = drawTile(variation === 0 ? 1 : variation === 3 ? 2 : variation === 7 ? 3 : 0, x, y, 80) || tilesReady;
    }
  }
  if (!tilesReady) {
    context.strokeStyle = 'rgba(56, 189, 248, 0.07)';
    context.lineWidth = 1;
    for (let x = gridLeft; x < -cameraX + width + 80; x += 80) { context.beginPath(); context.moveTo(x, -cameraY); context.lineTo(x, -cameraY + height); context.stroke(); }
    for (let y = gridTop; y < -cameraY + height + 80; y += 80) { context.beginPath(); context.moveTo(-cameraX, y); context.lineTo(-cameraX + width, y); context.stroke(); }
  }

  for (const room of QUANTUM_STATION_MAP.rooms) {
    const gradient = context.createLinearGradient(room.x, room.y, room.x + room.w, room.y + room.h);
    gradient.addColorStop(0, 'rgba(8, 47, 73, 0.64)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.86)');
    context.fillStyle = gradient;
    context.fillRect(room.x, room.y, room.w, room.h);
    context.strokeStyle = 'rgba(34, 211, 238, 0.28)';
    context.lineWidth = 2;
    context.strokeRect(room.x + 1, room.y + 1, room.w - 2, room.h - 2);
    context.fillStyle = 'rgba(103, 232, 249, 0.72)';
    context.font = '700 12px ui-monospace, monospace';
    context.fillText(room.name.toUpperCase(), room.x + 18, room.y + 28);
  }

  for (const wall of QUANTUM_STATION_MAP.walls) {
    context.fillStyle = '#172554';
    context.fillRect(wall.x, wall.y, wall.w, wall.h);
    context.fillStyle = '#0e7490';
    context.fillRect(wall.x, wall.y, wall.w, Math.min(4, wall.h));
    context.strokeStyle = 'rgba(125, 211, 252, 0.32)';
    context.strokeRect(wall.x, wall.y, wall.w, wall.h);
  }

  const roomDecor: Array<[number, number, number, number, number]> = [
    [8, 420, 980, 100, 100], [9, 1980, 1050, 92, 106], [10, 930, 600, 82, 88],
    [11, 1470, 1430, 64, 96], [12, 1040, 720, 68, 54], [13, 710, 1300, 42, 70],
    [14, 1580, 920, 50, 40], [15, 1370, 450, 52, 72],
  ];
  for (const [index, x, y, propWidth, propHeight] of roomDecor) drawProp(index, x, y, propWidth, propHeight);

  const taskSprite = { wires: 1, card_swipe: 0, quantum_disk: 2, download_data: 3 } as const;
  for (const task of round.tasks) {
    drawProp(taskSprite[task.type], task.x, task.y, 64, 70);
    if (task.isCompleted) {
      context.strokeStyle = '#4ade80';
      context.lineWidth = 2;
      context.beginPath(); context.moveTo(task.x - 14, task.y - 34); context.lineTo(task.x - 3, task.y - 23); context.lineTo(task.x + 17, task.y - 48); context.stroke();
    }
  }
  for (const vent of QUANTUM_STATION_MAP.vents) drawProp(4, vent.x, vent.y + 9, 58, 42);

  for (const player of round.players) {
    const moving = Math.abs(player.vx) + Math.abs(player.vy) > 1;
    const frame = moving ? Math.floor(round.elapsed * 7) % 4 : Math.floor(round.elapsed * 2) % 4;
    context.save();
    context.globalAlpha = player.isAlive ? 1 : 0.38;
    if (atlas?.complete && atlas.naturalWidth) {
      const row = directionRow[player.facing];
      context.drawImage(atlas, frame * FRAME_SIZE, row * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE, player.x - 34, player.y - 56, 68, 68);
    } else {
      context.fillStyle = player.color;
      context.fillRect(player.x - 10, player.y - 22, 20, 28);
    }
    context.fillStyle = player.isLocal ? '#e0f2fe' : '#cbd5e1';
    context.font = '700 10px ui-monospace, monospace';
    context.textAlign = 'center';
    context.fillText(player.isLocal ? `YOU Ã‚Â· ${player.name}` : player.name, player.x, player.y - 66);
    context.restore();
  }
  context.restore();

  if (round.phase === 'running' && local.isAlive) {
    const fog = context.createRadialGradient(width / 2, height / 2, 120, width / 2, height / 2, local.role === 'rogue_agent' ? 510 : 400);
    fog.addColorStop(0, 'rgba(2, 6, 23, 0)');
    fog.addColorStop(0.62, 'rgba(2, 6, 23, 0.18)');
    fog.addColorStop(1, 'rgba(2, 6, 23, 0.92)');
    context.fillStyle = fog;
    context.fillRect(0, 0, width, height);
  }
};

export const RogueCanvas = ({ isVisible, roundRef, inputRef, onSnapshot }: RogueCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;
    const atlas = new Image();
    atlas.src = '/rogue/assets/operator-atlas.png';
    const props = new Image();
    props.src = '/rogue/assets/station-props-atlas.png';
    const tiles = new Image();
    tiles.src = '/rogue/assets/station-tiles-atlas.png';
    let width = 1;
    let height = 1;
    let dpr = 1;
    let frameId = 0;
    let lastTime = performance.now();
    let accumulator = 0;
    let lastSnapshot = 0;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const frame = (now: number) => {
      const elapsed = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      accumulator += elapsed;
      while (accumulator >= 1 / 60) {
        stepRound(roundRef.current, inputRef.current, 1 / 60);
        accumulator -= 1 / 60;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScene(context, width, height, roundRef.current, atlas, props, tiles);
      if (now - lastSnapshot >= 120) {
        onSnapshot(snapshotRound(roundRef.current));
        lastSnapshot = now;
      }
      frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(frameId); observer.disconnect(); };
  }, [inputRef, isVisible, onSnapshot, roundRef]);

  return <canvas ref={canvasRef} className="block h-full w-full cursor-crosshair" aria-label="Rogue Node game canvas" />;
};
