import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getActivePetId,
  getPetById,
  getPetEnabled,
  ALL_PETS,
} from '../lib/mythical-pets';

// ---------------------------------------------------------------------------
// Pet motion constants
// ---------------------------------------------------------------------------

const SPEED_MIN = 6;
const SPEED_MAX = 16;
const DIR_CHANGE_INTERVAL = 5000;
const DIR_JITTER = 0.15;

const PET_PADDING = 16;

const IDLE_MIN = 2000;
const IDLE_MAX = 5000;

function randSpeed(): number {
  return SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
}
function randSign(): number {
  return Math.random() < 0.5 ? 1 : -1;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ---------------------------------------------------------------------------
type PetState = 'idle' | 'walk';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MythicalPet({ onOpenChat }: { onOpenChat: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [enabled, setEnabled] = useState(getPetEnabled);

  // Preloaded sprite images
  const spriteCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const stateRef = useRef({
    petId: getActivePetId(),
    x: Math.random() * window.innerWidth * 0.8,
    y: Math.random() * window.innerHeight * 0.7,
    vx: randSpeed() * randSign(),
    vy: randSpeed() * randSign(),
    frameIdx: 0,
    lastFrameTime: 0,
    lastTime: 0,
    facing: 1 as number,
    lastDirChange: 0,
    enabled: getPetEnabled(),
    petState: 'walk' as PetState,
    stateStartTime: 0,
    idleDuration: IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN),
    walkProgress: 1,
    bobOffset: 0,
    displayW: 0,
    displayH: 0,
  });

  // ── Preload all sprite images ──
  useEffect(() => {
    ALL_PETS.forEach((pet) => {
      if (!spriteCache.current.has(pet.id)) {
        const img = new Image();
        img.src = pet.spritePath;
        spriteCache.current.set(pet.id, img);
      }
    });
  }, []);

  // ── Listen for pet changes ──
  useEffect(() => {
    const onStorage = () => {
      const s = stateRef.current;
      s.petId = getActivePetId();
      s.enabled = getPetEnabled();
      setEnabled(s.enabled);
    };
    const onPetChange = (e: Event) => {
      const ce = e as CustomEvent<{ id?: string; enabled?: boolean }>;
      const s = stateRef.current;
      if (ce.detail.id) s.petId = ce.detail.id;
      if (typeof ce.detail.enabled === 'boolean') {
        s.enabled = ce.detail.enabled;
        setEnabled(ce.detail.enabled);
      }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('mythical-pet-change', onPetChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('mythical-pet-change', onPetChange);
    };
  }, []);

  // ── Resize handler ──
  useEffect(() => {
    const onResize = () => {
      const s = stateRef.current;
      const maxX = window.innerWidth - s.displayW - PET_PADDING * 2;
      const maxY = window.innerHeight - s.displayH - PET_PADDING * 2;
      if (s.x > maxX) s.x = Math.max(0, maxX);
      if (s.y > maxY) s.y = Math.max(0, maxY);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Tab visibility ──
  useEffect(() => {
    const s = stateRef.current;
    const handler = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else {
        s.lastTime = 0;
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // ── Animation loop ──
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const s = stateRef.current;

    const loop = (now: number) => {
      if (document.hidden) return;

      const pet = getPetById(s.petId) || ALL_PETS[0];
      const sprite = spriteCache.current.get(pet.id);
      
      // Compute display size
      const frameW = pet.frameSize * pet.scale;
      const frameH = pet.frameSize * pet.scale;
      s.displayW = frameW;
      s.displayH = frameH;

      // ── Delta time ──
      const dt = s.lastTime > 0 ? Math.min((now - s.lastTime) / 1000, 0.1) : 1 / 60;
      s.lastTime = now;

      // ── State machine ──
      const stateElapsed = now - s.stateStartTime;

      if (s.petState === 'idle') {
        if (stateElapsed > s.idleDuration) {
          s.petState = 'walk';
          s.stateStartTime = now;
          s.vx = randSpeed() * randSign();
          s.vy = randSpeed() * randSign();
          s.walkProgress = 0;
        }
      } else if (s.petState === 'walk') {
        if (stateElapsed > DIR_CHANGE_INTERVAL) {
          if (Math.random() < 0.4) {
            s.petState = 'idle';
            s.stateStartTime = now;
            s.idleDuration = IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN);
            s.vx = 0;
            s.vy = 0;
          } else {
            s.stateStartTime = now;
            if (Math.random() < 0.35) s.vx = randSpeed() * randSign();
            if (Math.random() < 0.35) s.vy = randSpeed() * randSign();
          }
        }

        if (Math.abs(s.vx) < SPEED_MIN * 0.4) s.vx = randSpeed() * (s.vx >= 0 ? 1 : -1);
        if (Math.abs(s.vy) < SPEED_MIN * 0.4) s.vy = randSpeed() * (s.vy >= 0 ? 1 : -1);

        if (s.walkProgress < 1) {
          s.walkProgress = Math.min(1, s.walkProgress + dt * 2);
        }
        const easedSpeed = easeInOut(s.walkProgress);

        s.x += s.vx * dt * easedSpeed + (Math.random() - 0.5) * DIR_JITTER * 10 * dt;
        s.y += s.vy * dt * easedSpeed + (Math.random() - 0.5) * DIR_JITTER * 10 * dt;
      }

      // ── Bobbing ──
      s.bobOffset = Math.sin(now / 600) * 1.5;

      // ── Bounce off edges ──
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      if (s.x < 0) { s.x = 0; s.vx = Math.abs(s.vx); s.facing = 1; }
      if (s.x > winW - frameW) { s.x = winW - frameW; s.vx = -Math.abs(s.vx); s.facing = -1; }
      if (s.y < 0) { s.y = 0; s.vy = Math.abs(s.vy); }
      if (s.y > winH - frameH) { s.y = winH - frameH; s.vy = -Math.abs(s.vy); }

      // ── Facing ──
      if (s.vx > 3) s.facing = 1;
      else if (s.vx < -3) s.facing = -1;

      // ── Frame advance ──
      if (now - s.lastFrameTime >= pet.frameInterval) {
        s.frameIdx = (s.frameIdx + 1) % pet.frameCount;
        s.lastFrameTime = now;
      }

      // ── Canvas sizing & position ──
      const canvasW = Math.ceil(frameW + PET_PADDING * 2);
      const canvasH = Math.ceil(frameH + PET_PADDING * 2);
      if (canvas.width !== canvasW) canvas.width = canvasW;
      if (canvas.height !== canvasH) canvas.height = canvasH;

      const left = Math.round(s.x - PET_PADDING);
      const top = Math.round(s.y - PET_PADDING + s.bobOffset);
      canvas.style.left = `${left}px`;
      canvas.style.top = `${top}px`;

      // ── Render ──
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.save();

      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        // Draw sprite image
        const drawX = s.facing === 1 ? PET_PADDING : PET_PADDING + frameW;
        ctx.translate(drawX, PET_PADDING);
        if (s.facing === -1) ctx.scale(-1, 1);

        // Glow effect
        ctx.shadowColor = pet.glowColor;
        ctx.shadowBlur = 10;

        // Source rectangle: current frame from horizontal sprite sheet
        const srcX = s.frameIdx * pet.frameSize;
        ctx.drawImage(
          sprite,
          srcX, 0, pet.frameSize, pet.frameSize,
          0, 0, frameW, frameH,
        );

        // Second pass for sharper core
        ctx.shadowBlur = 3;
        ctx.drawImage(
          sprite,
          srcX, 0, pet.frameSize, pet.frameSize,
          0, 0, frameW, frameH,
        );
      }

      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [enabled]);

  // ── Click handler ──
  const handleClick = useCallback(
    (_e: React.MouseEvent) => {
      onOpenChat();
    },
    [onOpenChat],
  );

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed z-[40]"
      style={{
        pointerEvents: 'auto',
        cursor: 'pointer',
        left: 0,
        top: 0,
      }}
      onClick={handleClick}
      title="Click to open AI chat"
    />
  );
}
