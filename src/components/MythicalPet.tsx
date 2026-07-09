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

const SPEED_MIN = 6;   // px/s
const SPEED_MAX = 16;  // px/s
const DIR_CHANGE_INTERVAL = 5000; // ms
const DIR_JITTER = 0.15;

// Pet canvas padding around the sprite
const PET_PADDING = 16;

// How long the pet idles before walking again (ms)
const IDLE_MIN = 2000;
const IDLE_MAX = 5000;

function randSpeed(): number {
  return SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
}
function randSign(): number {
  return Math.random() < 0.5 ? 1 : -1;
}

/** Simple ease-in-out for smooth start/stop */
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ---------------------------------------------------------------------------
// Animation state
// ---------------------------------------------------------------------------
type PetState = 'idle' | 'walk';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MythicalPet({ onOpenChat }: { onOpenChat: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [enabled, setEnabled] = useState(getPetEnabled);

  // Persistent state across re-renders
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
    // State machine
    petState: 'walk' as PetState,
    stateStartTime: 0,
    idleDuration: IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN),
    // Easing for walk transitions
    walkProgress: 1, // 0→1 during walk start, used for easing
    // Bobbing
    bobOffset: 0,
    // Current pet bounding box (for hit-testing & canvas positioning)
    pw: 0,
    ph: 0,
  });

  // ── Listen for pet changes from Settings ──
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

  // ── Resize handler — clamp pet position to new bounds ──
  useEffect(() => {
    const onResize = () => {
      const s = stateRef.current;
      const maxX = window.innerWidth - s.pw - PET_PADDING * 2;
      const maxY = window.innerHeight - s.ph - PET_PADDING * 2;
      if (s.x > maxX) s.x = Math.max(0, maxX);
      if (s.y > maxY) s.y = Math.max(0, maxY);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Tab visibility — pause/resume animation loop ──
  useEffect(() => {
    const s = stateRef.current;
    const handler = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else {
        s.lastTime = 0; // reset delta so it doesn't spike on resume
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // ── Animation loop ──
  useEffect(() => {
    if (!enabled) return; // Don't start loop when disabled

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const s = stateRef.current;

    const loop = (now: number) => {
      if (document.hidden) {
        // Don't schedule next frame when tab is hidden
        return;
      }

      const pet = getPetById(s.petId) || ALL_PETS[0];
      const frame = pet.frames[s.frameIdx];
      const fontSize = 10 * pet.scale;
      const lineHeight = 12 * pet.scale;
      const pw = frame.width * fontSize * 0.6;
      const ph = frame.height * lineHeight;
      s.pw = pw;
      s.ph = ph;

      // ── Delta time (capped at 100ms to prevent huge jumps) ──
      const dt = s.lastTime > 0 ? Math.min((now - s.lastTime) / 1000, 0.1) : 1 / 60;
      s.lastTime = now;

      // ── State machine ──
      const stateElapsed = now - s.stateStartTime;

      if (s.petState === 'idle') {
        // Stay idle for a random duration, then start walking
        if (stateElapsed > s.idleDuration) {
          s.petState = 'walk';
          s.stateStartTime = now;
          s.vx = randSpeed() * randSign();
          s.vy = randSpeed() * randSign();
          s.walkProgress = 0;
        }
      } else if (s.petState === 'walk') {
        // Walk for DIR_CHANGE_INTERVAL, then maybe idle
        if (stateElapsed > DIR_CHANGE_INTERVAL) {
          if (Math.random() < 0.4) {
            // Switch to idle
            s.petState = 'idle';
            s.stateStartTime = now;
            s.idleDuration = IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN);
            s.vx = 0;
            s.vy = 0;
          } else {
            // Keep walking with new direction
            s.stateStartTime = now;
            if (Math.random() < 0.35) s.vx = randSpeed() * randSign();
            if (Math.random() < 0.35) s.vy = randSpeed() * randSign();
          }
        }

        // Ensure minimum speed while walking
        if (Math.abs(s.vx) < SPEED_MIN * 0.4) s.vx = randSpeed() * (s.vx >= 0 ? 1 : -1);
        if (Math.abs(s.vy) < SPEED_MIN * 0.4) s.vy = randSpeed() * (s.vy >= 0 ? 1 : -1);

        // Ease into walk speed
        if (s.walkProgress < 1) {
          s.walkProgress = Math.min(1, s.walkProgress + dt * 2);
        }
        const easedSpeed = easeInOut(s.walkProgress);

        // ── Update position ──
        s.x += s.vx * dt * easedSpeed + (Math.random() - 0.5) * DIR_JITTER * 10 * dt;
        s.y += s.vy * dt * easedSpeed + (Math.random() - 0.5) * DIR_JITTER * 10 * dt;
      }

      // ── Bobbing effect (subtle vertical oscillation) ──
      s.bobOffset = Math.sin(now / 600) * 1.5;

      // ── Bounce off edges ──
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      if (s.x < 0) { s.x = 0; s.vx = Math.abs(s.vx); s.facing = 1; }
      if (s.x > winW - pw) { s.x = winW - pw; s.vx = -Math.abs(s.vx); s.facing = -1; }
      if (s.y < 0) { s.y = 0; s.vy = Math.abs(s.vy); }
      if (s.y > winH - ph) { s.y = winH - ph; s.vy = -Math.abs(s.vy); }

      // ── Facing ──
      if (s.vx > 3) s.facing = 1;
      else if (s.vx < -3) s.facing = -1;

      // ── Frame advance ──
      if (now - s.lastFrameTime >= pet.frameInterval) {
        s.frameIdx = (s.frameIdx + 1) % pet.frames.length;
        s.lastFrameTime = now;
      }

      // ── Update canvas size & position ──
      const canvasW = Math.ceil(pw + PET_PADDING * 2);
      const canvasH = Math.ceil(ph + PET_PADDING * 2);
      if (canvas.width !== canvasW) canvas.width = canvasW;
      if (canvas.height !== canvasH) canvas.height = canvasH;

      // Position canvas to follow pet
      const left = Math.round(s.x - PET_PADDING);
      const top = Math.round(s.y - PET_PADDING + s.bobOffset);
      canvas.style.left = `${left}px`;
      canvas.style.top = `${top}px`;

      // ── Render to canvas ──
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.save();

      // Position + flip (draw at padding offset within the small canvas)
      const drawX = s.facing === 1 ? PET_PADDING : PET_PADDING + pw;
      ctx.translate(drawX, PET_PADDING);
      if (s.facing === -1) ctx.scale(-1, 1);

      // Font setup
      ctx.font = `bold ${fontSize}px "Courier New", "Fira Code", "Consolas", monospace`;
      ctx.textBaseline = 'top';

      // Glow layer
      ctx.shadowColor = pet.glowColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = pet.color;
      for (let i = 0; i < frame.lines.length; i++) {
        ctx.fillText(frame.lines[i], 0, i * lineHeight);
      }
      // Second pass for brighter core
      ctx.shadowBlur = 3;
      ctx.fillStyle = pet.color;
      for (let i = 0; i < frame.lines.length; i++) {
        ctx.fillText(frame.lines[i], 0, i * lineHeight);
      }

      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [enabled]);

  // ── Click handler — no stopPropagation, only triggers on pet area ──
  const handleClick = useCallback(
    (_e: React.MouseEvent) => {
      // The canvas now only covers the pet sprite area,
      // so any click on it IS a click on the pet.
      onOpenChat();
    },
    [onOpenChat],
  );

  // ── Don't render anything when disabled ──
  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed z-[40]"
      style={{
        pointerEvents: 'auto',
        cursor: 'pointer',
        // Initial position will be set by the animation loop
        left: 0,
        top: 0,
      }}
      onClick={handleClick}
      title="Click to open AI chat"
    />
  );
}
