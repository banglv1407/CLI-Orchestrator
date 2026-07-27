import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PetMoveDefinition } from '../types';
import {
  BUILTIN_PETS,
  getActivePetId,
  getPetById,
  getPetEnabled,
  getPetSpecialsEnabled,
  getResolvedActivePet,
  refreshPetRegistry,
  resolvePetAssetUrl,
  type MythicalPet,
} from '../lib/mythical-pets';

const SPEED_MIN = 8;
const SPEED_MAX = 18;
const DIRECTION_MS = 5000;
const IDLE_MIN_MS = 2200;
const IDLE_MAX_MS = 5000;
const SPECIAL_MIN_MS = 25_000;
const SPECIAL_MAX_MS = 45_000;
const BLINK_MIN_MS = 10_000;
const BLINK_MAX_MS = 18_000;
const ACTOR_CANVAS = 192;
const EFFECT_MAX = 320;

type MotionState = 'idle' | 'travel' | 'blink' | 'special' | 'recover';

interface LoadedClip {
  image: HTMLImageElement;
  failed?: boolean;
}

interface SpecialRuntime {
  move: PetMoveDefinition;
  startedAt: number;
  durationMs: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  anchorX: number;
  anchorY: number;
  relocated: boolean;
}

interface LiveRuntime {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  state: MotionState;
  stateStartedAt: number;
  stateDurationMs: number;
  frameIndex: number;
  lastFrameAt: number;
  lastTickAt: number;
  nextSpecialAt: number;
  nextBlinkAt: number;
  lastMoveId: string;
  clipId: string;
  special: SpecialRuntime | null;
  specialLoading: boolean;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomVelocity(speedMultiplier = 1) {
  return randomBetween(SPEED_MIN, SPEED_MAX)
    * speedMultiplier
    * (Math.random() < 0.5 ? -1 : 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

function quadratic(
  start: number,
  control: number,
  end: number,
  progress: number,
) {
  const inverse = 1 - progress;
  return (
    inverse * inverse * start
    + 2 * inverse * progress * control
    + progress * progress * end
  );
}

function clipDuration(pet: MythicalPet, clipId: string) {
  const clip = pet.animations[clipId] ?? pet.animations.idle;
  return (clip.frameCount / (clip.fps * pet.speedMultiplier)) * 1000;
}

function frameDrawSize(pet: MythicalPet, frameWidth: number) {
  if (pet.source === 'builtin') return pet.displaySize;
  return frameWidth * (pet.displaySize / 96);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not decode pet image: ${url}`));
    image.src = url;
  });
}

function drawFrame(
  context: CanvasRenderingContext2D,
  pet: MythicalPet,
  clipId: string,
  loaded: LoadedClip | undefined,
  frameIndex: number,
  facing: 1 | -1,
  alpha = 1,
) {
  const clip = pet.animations[clipId] ?? pet.animations.idle;
  if (!loaded?.image || loaded.failed) return;
  const drawSize = frameDrawSize(pet, clip.frameWidth);
  const x = (ACTOR_CANVAS - drawSize) / 2;
  const y = (ACTOR_CANVAS - drawSize) / 2;
  const sourceFrame = frameIndex % clip.frameCount;

  context.save();
  context.globalAlpha = alpha;
  context.imageSmoothingEnabled = false;
  context.shadowColor = pet.glowColor;
  context.shadowBlur = pet.source === 'builtin' ? 8 : 12;
  if (facing === -1) {
    context.translate(ACTOR_CANVAS, 0);
    context.scale(-1, 1);
  }
  context.drawImage(
    loaded.image,
    sourceFrame * clip.frameWidth,
    0,
    clip.frameWidth,
    clip.frameHeight,
    x,
    y,
    drawSize,
    drawSize,
  );
  context.shadowBlur = 2;
  context.drawImage(
    loaded.image,
    sourceFrame * clip.frameWidth,
    0,
    clip.frameWidth,
    clip.frameHeight,
    x,
    y,
    drawSize,
    drawSize,
  );
  context.restore();
}

function initialRuntime(): LiveRuntime {
  const now = performance.now();
  return {
    x: randomBetween(120, Math.max(121, window.innerWidth - 120)),
    y: randomBetween(120, Math.max(121, window.innerHeight - 120)),
    vx: randomVelocity(),
    vy: randomVelocity(),
    facing: 1,
    state: 'travel',
    stateStartedAt: now,
    stateDurationMs: DIRECTION_MS,
    frameIndex: 0,
    lastFrameAt: 0,
    lastTickAt: 0,
    nextSpecialAt: now + randomBetween(SPECIAL_MIN_MS, SPECIAL_MAX_MS),
    nextBlinkAt: now + randomBetween(BLINK_MIN_MS, BLINK_MAX_MS),
    lastMoveId: '',
    clipId: 'travel',
    special: null,
    specialLoading: false,
  };
}

function chooseMove(pet: MythicalPet, previous: string) {
  const candidates = pet.moves.filter((move) => move.id !== previous);
  const pool = candidates.length ? candidates : pet.moves;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function MythicalPet({ onOpenChat }: { onOpenChat: () => void }) {
  const actorRef = useRef<HTMLCanvasElement>(null);
  const cloneLeftRef = useRef<HTMLCanvasElement>(null);
  const cloneRightRef = useRef<HTMLCanvasElement>(null);
  const effectCoreRef = useRef<SVGPathElement>(null);
  const effectGlowRef = useRef<SVGPathElement>(null);
  const orbRef = useRef<SVGCircleElement>(null);
  const hitboxRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef(0);
  const runtimeRef = useRef<LiveRuntime>(initialRuntime());
  const clipCacheRef = useRef(new Map<string, LoadedClip>());
  const clipPromisesRef = useRef(new Map<string, Promise<LoadedClip>>());
  const [enabled, setEnabled] = useState(getPetEnabled);
  const [specialsEnabled, setSpecialsEnabled] = useState(getPetSpecialsEnabled);
  const [pet, setPet] = useState<MythicalPet>(getResolvedActivePet);
  const reducedMotionRef = useRef(false);

  const resetEffects = useCallback(() => {
    for (const path of [effectCoreRef.current, effectGlowRef.current]) {
      if (path) path.style.visibility = 'hidden';
    }
    if (orbRef.current) orbRef.current.style.visibility = 'hidden';
    for (const clone of [cloneLeftRef.current, cloneRightRef.current]) {
      if (clone) clone.style.visibility = 'hidden';
    }
  }, []);

  const ensureClip = useCallback(async (
    targetPet: MythicalPet,
    clipId: string,
  ): Promise<LoadedClip> => {
    const clip = targetPet.animations[clipId] ?? targetPet.animations.idle;
    const key = `${targetPet.id}:${clip.sheet}`;
    const cached = clipCacheRef.current.get(key);
    if (cached) return cached;
    const pending = clipPromisesRef.current.get(key);
    if (pending) return pending;

    const promise = resolvePetAssetUrl(targetPet, clip.sheet)
      .then(loadImage)
      .then((image) => {
        const loaded = { image };
        clipCacheRef.current.set(key, loaded);
        return loaded;
      })
      .catch((error) => {
        console.warn(`[pet] ${error instanceof Error ? error.message : String(error)}`);
        const failed = { image: new Image(), failed: true };
        clipCacheRef.current.set(key, failed);
        return failed;
      })
      .finally(() => {
        clipPromisesRef.current.delete(key);
      });
    clipPromisesRef.current.set(key, promise);
    return promise;
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reducedMotionRef.current = media.matches;
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    let disposed = false;
    refreshPetRegistry().then(() => {
      if (!disposed) setPet(getResolvedActivePet());
    });

    const onPetChange = (event: Event) => {
      const detail = (event as CustomEvent<{
        id?: string;
        enabled?: boolean;
        specialsEnabled?: boolean;
      }>).detail;
      if (detail.id) setPet(getPetById(detail.id) ?? BUILTIN_PETS[0]);
      if (typeof detail.enabled === 'boolean') setEnabled(detail.enabled);
      if (typeof detail.specialsEnabled === 'boolean') {
        setSpecialsEnabled(detail.specialsEnabled);
      }
    };
    const onStorage = () => {
      setEnabled(getPetEnabled());
      setSpecialsEnabled(getPetSpecialsEnabled());
      setPet(getPetById(getActivePetId()) ?? BUILTIN_PETS[0]);
    };
    const onRegistry = () => {
      setPet(getPetById(getActivePetId()) ?? BUILTIN_PETS[0]);
    };
    window.addEventListener('mythical-pet-change', onPetChange);
    window.addEventListener('mythical-pet-registry-change', onRegistry);
    window.addEventListener('storage', onStorage);
    return () => {
      disposed = true;
      window.removeEventListener('mythical-pet-change', onPetChange);
      window.removeEventListener('mythical-pet-registry-change', onRegistry);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    clipCacheRef.current.clear();
    clipPromisesRef.current.clear();
    const runtime = runtimeRef.current;
    runtime.state = 'idle';
    runtime.clipId = 'idle';
    runtime.stateStartedAt = performance.now();
    runtime.stateDurationMs = randomBetween(IDLE_MIN_MS, IDLE_MAX_MS);
    runtime.frameIndex = 0;
    runtime.vx = randomVelocity(pet.speedMultiplier);
    runtime.vy = randomVelocity(pet.speedMultiplier);
    runtime.special = null;
    runtime.specialLoading = false;
    runtime.nextSpecialAt = performance.now()
      + randomBetween(SPECIAL_MIN_MS, SPECIAL_MAX_MS);
    resetEffects();
    void ensureClip(pet, 'idle');
    void ensureClip(pet, 'travel');
    void ensureClip(pet, 'blink');
  }, [ensureClip, pet, resetEffects]);

  useEffect(() => {
    if (!enabled) {
      cancelAnimationFrame(animationRef.current);
      resetEffects();
      return;
    }
    const actor = actorRef.current;
    const leftClone = cloneLeftRef.current;
    const rightClone = cloneRightRef.current;
    const hitbox = hitboxRef.current;
    if (!actor || !leftClone || !rightClone || !hitbox) return;
    const actorContext = actor.getContext('2d');
    const leftContext = leftClone.getContext('2d');
    const rightContext = rightClone.getContext('2d');
    if (!actorContext || !leftContext || !rightContext) return;

    let disposed = false;
    const runtime = runtimeRef.current;

    const changeState = (
      state: MotionState,
      clipId: string,
      now: number,
      durationMs: number,
    ) => {
      runtime.state = state;
      runtime.clipId = clipId;
      runtime.stateStartedAt = now;
      runtime.stateDurationMs = durationMs;
      runtime.frameIndex = 0;
      runtime.lastFrameAt = 0;
      void ensureClip(pet, clipId);
    };

    const beginSpecial = async (move: PetMoveDefinition, now: number) => {
      if (runtime.specialLoading || runtime.special) return;
      runtime.specialLoading = true;
      const loaded = await ensureClip(pet, move.clip);
      runtime.specialLoading = false;
      if (disposed || loaded.failed || pet.id !== (getPetById(pet.id)?.id ?? pet.id)) {
        runtime.nextSpecialAt = now + randomBetween(SPECIAL_MIN_MS, SPECIAL_MAX_MS);
        return;
      }
      const direction = runtime.facing;
      const roomLeft = runtime.x - 80;
      const roomRight = window.innerWidth - runtime.x - 80;
      const preferred = direction === 1 ? roomRight : roomLeft;
      const travel = clamp(preferred, 120, 280) * direction;
      const targetX = clamp(runtime.x + travel, 72, window.innerWidth - 72);
      const targetY = clamp(
        runtime.y + randomBetween(-90, 90),
        72,
        window.innerHeight - 72,
      );
      runtime.special = {
        move,
        startedAt: performance.now(),
        durationMs: Math.max(
          700 / pet.speedMultiplier,
          clipDuration(pet, move.clip),
        ),
        startX: runtime.x,
        startY: runtime.y,
        targetX,
        targetY,
        anchorX: clamp(
          runtime.x + direction * randomBetween(140, 240),
          24,
          window.innerWidth - 24,
        ),
        anchorY: clamp(runtime.y - randomBetween(120, 220), 18, window.innerHeight - 40),
        relocated: false,
      };
      runtime.lastMoveId = move.id;
      changeState('special', move.clip, performance.now(), runtime.special.durationMs);
    };

    const positionCanvas = (
      canvas: HTMLCanvasElement,
      x: number,
      y: number,
      visible = true,
    ) => {
      canvas.style.transform = `translate3d(${Math.round(x - ACTOR_CANVAS / 2)}px, ${Math.round(y - ACTOR_CANVAS / 2)}px, 0)`;
      canvas.style.visibility = visible ? 'visible' : 'hidden';
    };

    const drawEffectPath = (
      path: string,
      primary: string,
      glow: string,
      width: number,
    ) => {
      const core = effectCoreRef.current;
      const halo = effectGlowRef.current;
      if (!core || !halo) return;
      core.setAttribute('d', path);
      halo.setAttribute('d', path);
      core.setAttribute('stroke', primary);
      halo.setAttribute('stroke', glow);
      core.setAttribute('stroke-width', String(width));
      halo.setAttribute('stroke-width', String(width * 2.8));
      core.style.visibility = 'visible';
      halo.style.visibility = 'visible';
    };

    const renderSpecial = (now: number) => {
      const special = runtime.special;
      if (!special) return 1;
      const progress = clamp(
        (now - special.startedAt) / special.durationMs,
        0,
        1,
      );
      const eased = easeInOut(progress);
      const primary = special.move.primaryColor ?? pet.glowColor;
      const secondary = special.move.secondaryColor ?? '#ffffff';
      resetEffects();

      switch (special.move.kind) {
        case 'teleport': {
          if (progress >= 0.48 && !special.relocated) {
            runtime.x = special.targetX;
            runtime.y = special.targetY;
            special.relocated = true;
          }
          const radius = 24 + Math.sin(progress * Math.PI) * 48;
          const orb = orbRef.current;
          if (orb) {
            orb.setAttribute('cx', String(special.relocated ? runtime.x : special.startX));
            orb.setAttribute('cy', String(special.relocated ? runtime.y : special.startY));
            orb.setAttribute('r', String(radius));
            orb.setAttribute('stroke', primary);
            orb.style.visibility = 'visible';
          }
          return Math.abs(Math.cos(progress * Math.PI));
        }
        case 'beam': {
          if (progress > 0.22 && progress < 0.88) {
            const length = Math.min(
              EFFECT_MAX,
              Math.max(120, special.targetX - special.startX) * runtime.facing,
            );
            const startX = runtime.x + runtime.facing * 34;
            const endX = clamp(
              startX + runtime.facing * Math.abs(length),
              0,
              window.innerWidth,
            );
            drawEffectPath(
              `M ${startX} ${runtime.y} L ${endX} ${runtime.y}`,
              secondary,
              primary,
              7 + Math.sin(progress * 24) * 2,
            );
          }
          break;
        }
        case 'clone': {
          const cloneAlpha = Math.sin(progress * Math.PI);
          leftContext.clearRect(0, 0, ACTOR_CANVAS, ACTOR_CANVAS);
          rightContext.clearRect(0, 0, ACTOR_CANVAS, ACTOR_CANVAS);
          const loaded = clipCacheRef.current.get(
            `${pet.id}:${pet.animations[runtime.clipId]?.sheet}`,
          );
          drawFrame(
            leftContext,
            pet,
            runtime.clipId,
            loaded,
            runtime.frameIndex,
            runtime.facing,
            cloneAlpha * 0.8,
          );
          drawFrame(
            rightContext,
            pet,
            runtime.clipId,
            loaded,
            runtime.frameIndex,
            runtime.facing,
            cloneAlpha * 0.8,
          );
          positionCanvas(leftClone, runtime.x - 100, runtime.y + 12, true);
          positionCanvas(rightClone, runtime.x + 100, runtime.y + 12, true);
          break;
        }
        case 'orb-lunge': {
          if (progress > 0.18) {
            const orb = orbRef.current;
            const orbX = runtime.x + runtime.facing * 46;
            if (orb) {
              orb.setAttribute('cx', String(orbX));
              orb.setAttribute('cy', String(runtime.y - 4));
              orb.setAttribute('r', String(12 + Math.sin(progress * Math.PI) * 18));
              orb.setAttribute('stroke', primary);
              orb.style.visibility = 'visible';
            }
          }
          if (progress > 0.48) {
            runtime.x = clamp(
              special.startX + runtime.facing * 110 * eased,
              72,
              window.innerWidth - 72,
            );
          }
          break;
        }
        case 'web-shot': {
          if (progress > 0.15 && progress < 0.9) {
            drawEffectPath(
              `M ${runtime.x + runtime.facing * 32} ${runtime.y - 8} Q ${special.anchorX} ${runtime.y - 90} ${special.targetX} ${special.targetY}`,
              '#ffffff',
              primary,
              2,
            );
          }
          break;
        }
        case 'web-zip': {
          drawEffectPath(
            `M ${runtime.x} ${runtime.y - 26} L ${special.anchorX} ${special.anchorY}`,
            '#ffffff',
            primary,
            2,
          );
          runtime.x = quadratic(
            special.startX,
            special.anchorX,
            special.targetX,
            eased,
          );
          runtime.y = quadratic(
            special.startY,
            special.anchorY + 80,
            special.targetY,
            eased,
          );
          break;
        }
        case 'blink':
          runtime.x = special.startX
            + (special.targetX - special.startX) * eased;
          return Math.abs(Math.cos(progress * Math.PI));
      }
      return 1;
    };

    const loop = (now: number) => {
      if (disposed || document.hidden) return;
      const delta = runtime.lastTickAt
        ? Math.min((now - runtime.lastTickAt) / 1000, 0.1)
        : 1 / 60;
      runtime.lastTickAt = now;
      const elapsed = now - runtime.stateStartedAt;

      if (
        specialsEnabled
        && !reducedMotionRef.current
        && pet.moves.length
        && now >= runtime.nextSpecialAt
        && (runtime.state === 'idle' || runtime.state === 'travel')
      ) {
        const movement = chooseMove(pet, runtime.lastMoveId);
        if (movement) void beginSpecial(movement, now);
        runtime.nextSpecialAt = now
          + randomBetween(SPECIAL_MIN_MS, SPECIAL_MAX_MS);
      }

      if (
        now >= runtime.nextBlinkAt
        && (runtime.state === 'idle' || runtime.state === 'travel')
      ) {
        changeState('blink', 'blink', now, clipDuration(pet, 'blink'));
        runtime.nextBlinkAt = now + randomBetween(BLINK_MIN_MS, BLINK_MAX_MS);
      }

      if (runtime.state === 'idle' && elapsed >= runtime.stateDurationMs) {
        runtime.vx = randomVelocity(pet.speedMultiplier);
        runtime.vy = randomVelocity(pet.speedMultiplier);
        changeState('travel', 'travel', now, DIRECTION_MS);
      } else if (runtime.state === 'travel') {
        runtime.x += runtime.vx * delta;
        runtime.y += runtime.vy * delta;
        if (elapsed >= runtime.stateDurationMs) {
          if (Math.random() < 0.3) {
            changeState(
              'idle',
              'idle',
              now,
              randomBetween(IDLE_MIN_MS, IDLE_MAX_MS),
            );
          } else {
            runtime.vx = randomVelocity(pet.speedMultiplier);
            runtime.vy = randomVelocity(pet.speedMultiplier);
            changeState('travel', 'travel', now, DIRECTION_MS);
          }
        }
      } else if (runtime.state === 'blink') {
        runtime.x += runtime.vx * delta * 4;
        runtime.y += runtime.vy * delta * 4;
        if (elapsed >= runtime.stateDurationMs) {
          changeState('travel', 'travel', now, DIRECTION_MS);
        }
      } else if (runtime.state === 'special' && runtime.special) {
        if (now - runtime.special.startedAt >= runtime.special.durationMs) {
          runtime.special = null;
          resetEffects();
          changeState('recover', 'idle', now, 320);
        }
      } else if (runtime.state === 'recover' && elapsed >= runtime.stateDurationMs) {
        changeState(
          'idle',
          'idle',
          now,
          randomBetween(IDLE_MIN_MS, IDLE_MAX_MS),
        );
      }

      const half = Math.max(40, pet.displaySize / 2);
      if (runtime.x < half) {
        runtime.x = half;
        runtime.vx = Math.abs(
          runtime.vx || randomVelocity(pet.speedMultiplier),
        );
      }
      if (runtime.x > window.innerWidth - half) {
        runtime.x = window.innerWidth - half;
        runtime.vx = -Math.abs(
          runtime.vx || randomVelocity(pet.speedMultiplier),
        );
      }
      if (runtime.y < half) {
        runtime.y = half;
        runtime.vy = Math.abs(
          runtime.vy || randomVelocity(pet.speedMultiplier),
        );
      }
      if (runtime.y > window.innerHeight - half) {
        runtime.y = window.innerHeight - half;
        runtime.vy = -Math.abs(
          runtime.vy || randomVelocity(pet.speedMultiplier),
        );
      }
      if (runtime.vx > 2) runtime.facing = 1;
      if (runtime.vx < -2) runtime.facing = -1;

      const clip = pet.animations[runtime.clipId] ?? pet.animations.idle;
      const frameInterval = 1000 / (clip.fps * pet.speedMultiplier);
      if (now - runtime.lastFrameAt >= frameInterval) {
        runtime.frameIndex = clip.looped
          ? (runtime.frameIndex + 1) % clip.frameCount
          : Math.min(runtime.frameIndex + 1, clip.frameCount - 1);
        runtime.lastFrameAt = now;
      }

      let actorAlpha = 1;
      if (runtime.state === 'special') actorAlpha = renderSpecial(now);
      else resetEffects();

      actorContext.clearRect(0, 0, ACTOR_CANVAS, ACTOR_CANVAS);
      const loaded = clipCacheRef.current.get(`${pet.id}:${clip.sheet}`);
      drawFrame(
        actorContext,
        pet,
        runtime.clipId,
        loaded,
        runtime.frameIndex,
        runtime.facing,
        actorAlpha,
      );
      positionCanvas(actor, runtime.x, runtime.y);
      const hitboxSize = Math.max(44, pet.displaySize);
      hitbox.style.transform = `translate3d(${Math.round(runtime.x - hitboxSize / 2)}px, ${Math.round(runtime.y - hitboxSize / 2)}px, 0)`;
      hitbox.style.width = `${hitboxSize}px`;
      hitbox.style.height = `${hitboxSize}px`;

      animationRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (disposed || document.hidden) return;
      runtime.lastTickAt = 0;
      runtime.stateStartedAt = performance.now();
      if (runtime.special) {
        runtime.special.startedAt = performance.now();
      }
      cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(loop);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationRef.current);
      } else {
        start();
      }
    };
    const onResize = () => {
      runtime.x = clamp(runtime.x, 48, window.innerWidth - 48);
      runtime.y = clamp(runtime.y, 48, window.innerHeight - 48);
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    start();
    return () => {
      disposed = true;
      cancelAnimationFrame(animationRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      resetEffects();
    };
  }, [enabled, ensureClip, pet, resetEffects, specialsEnabled]);

  const handleClick = useCallback(() => onOpenChat(), [onOpenChat]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-[40] pointer-events-none" aria-hidden={false}>
      <svg className="fixed inset-0 h-full w-full overflow-visible pointer-events-none">
        <defs>
          <filter id="pet-effect-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={effectGlowRef}
          fill="none"
          strokeLinecap="round"
          opacity="0.42"
          filter="url(#pet-effect-glow)"
          style={{ visibility: 'hidden' }}
        />
        <path
          ref={effectCoreRef}
          fill="none"
          strokeLinecap="round"
          style={{ visibility: 'hidden' }}
        />
        <circle
          ref={orbRef}
          fill="rgba(255,255,255,0.2)"
          strokeWidth="5"
          filter="url(#pet-effect-glow)"
          style={{ visibility: 'hidden' }}
        />
      </svg>
      {[cloneLeftRef, cloneRightRef, actorRef].map((ref, index) => (
        <canvas
          key={index}
          ref={ref}
          width={ACTOR_CANVAS}
          height={ACTOR_CANVAS}
          className="fixed left-0 top-0 pointer-events-none"
          style={{
            width: ACTOR_CANVAS,
            height: ACTOR_CANVAS,
            imageRendering: 'pixelated',
            visibility: index < 2 ? 'hidden' : 'visible',
          }}
        />
      ))}
      <button
        ref={hitboxRef}
        type="button"
        className="fixed left-0 top-0 pointer-events-auto cursor-pointer rounded-full bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-neon"
        onClick={handleClick}
        aria-label={`Open AI with ${pet.name}`}
        title={`${pet.name} · Click to open AI`}
      />
    </div>
  );
}

export function PetPreviewStage({
  pet,
  clipId,
  replayToken,
}: {
  pet: MythicalPet;
  clipId: string;
  replayToken: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef(0);
  const [loaded, setLoaded] = useState<LoadedClip | null>(null);
  const clip = pet.animations[clipId] ?? pet.animations.idle;
  const move = useMemo(
    () => pet.moves.find((candidate) => candidate.clip === clipId),
    [clipId, pet.moves],
  );

  useEffect(() => {
    let disposed = false;
    setLoaded(null);
    resolvePetAssetUrl(pet, clip.sheet)
      .then(loadImage)
      .then((image) => {
        if (!disposed) setLoaded({ image });
      })
      .catch(() => {
        if (!disposed) setLoaded({ image: new Image(), failed: true });
      });
    return () => {
      disposed = true;
    };
  }, [clip.sheet, pet]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !loaded || loaded.failed) return;
    const started = performance.now();
    const duration = Math.max(
      700 / pet.speedMultiplier,
      (clip.frameCount / (clip.fps * pet.speedMultiplier)) * 1000,
    );
    const actorBuffer = document.createElement('canvas');
    actorBuffer.width = ACTOR_CANVAS;
    actorBuffer.height = ACTOR_CANVAS;
    const actor2d = actorBuffer.getContext('2d');
    if (!actor2d) return;

    const loop = (now: number) => {
      const elapsed = now - started;
      const progress = clip.looped
        ? (elapsed % duration) / duration
        : Math.min(elapsed / duration, 1);
      const frame = Math.min(
        clip.frameCount - 1,
        Math.floor(
          (elapsed / 1000) * clip.fps * pet.speedMultiplier,
        ) % clip.frameCount,
      );
      context.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 16;

      if (move?.kind === 'beam' && progress > 0.22 && progress < 0.88) {
        const gradient = context.createLinearGradient(centerX + 32, 0, canvas.width - 12, 0);
        gradient.addColorStop(0, move.secondaryColor ?? '#ffffff');
        gradient.addColorStop(1, move.primaryColor ?? pet.glowColor);
        context.save();
        context.strokeStyle = gradient;
        context.lineWidth = 13;
        context.shadowColor = move.primaryColor ?? pet.glowColor;
        context.shadowBlur = 18;
        context.beginPath();
        context.moveTo(centerX + 26, centerY);
        context.lineTo(canvas.width - 12, centerY);
        context.stroke();
        context.restore();
      } else if (
        (move?.kind === 'web-shot' || move?.kind === 'web-zip')
        && progress > 0.12
      ) {
        context.save();
        context.strokeStyle = '#ffffff';
        context.lineWidth = 2;
        context.shadowColor = move.primaryColor ?? '#ef4444';
        context.shadowBlur = 7;
        context.beginPath();
        context.moveTo(centerX + 28, centerY - 8);
        context.quadraticCurveTo(centerX + 76, centerY - 94, canvas.width - 18, 24);
        context.stroke();
        context.restore();
      } else if (move?.kind === 'orb-lunge' && progress > 0.18) {
        context.save();
        context.strokeStyle = move.primaryColor ?? pet.glowColor;
        context.fillStyle = 'rgba(255,255,255,0.28)';
        context.shadowColor = move.primaryColor ?? pet.glowColor;
        context.shadowBlur = 16;
        context.lineWidth = 5;
        context.beginPath();
        context.arc(centerX + 44, centerY - 4, 14 + Math.sin(progress * Math.PI) * 10, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.restore();
      }

      actor2d.clearRect(0, 0, ACTOR_CANVAS, ACTOR_CANVAS);
      drawFrame(actor2d, pet, clipId, loaded, frame, 1);
      if (move?.kind === 'clone') {
        context.globalAlpha = Math.sin(progress * Math.PI) * 0.65;
        context.drawImage(actorBuffer, centerX - 150, centerY - 96, ACTOR_CANVAS, ACTOR_CANVAS);
        context.drawImage(actorBuffer, centerX - 42, centerY - 96, ACTOR_CANVAS, ACTOR_CANVAS);
        context.globalAlpha = 1;
      }
      context.drawImage(actorBuffer, centerX - 96, centerY - 96, ACTOR_CANVAS, ACTOR_CANVAS);

      if (clip.looped || progress < 1) {
        animationRef.current = requestAnimationFrame(loop);
      }
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [clip, clipId, loaded, move, pet, replayToken]);

  return (
    <div className="overflow-hidden rounded-xl border border-cyber-line/50 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),rgba(2,6,23,0.85)_70%)]">
      <canvas
        ref={canvasRef}
        width={320}
        height={220}
        className="block h-[220px] w-full"
        style={{ imageRendering: 'pixelated' }}
        aria-label={`${pet.name} ${clipId} preview`}
      />
    </div>
  );
}
