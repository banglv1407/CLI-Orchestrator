import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import type { PetMoveDefinition } from '../types';
import {
  BUILTIN_PETS,
  getActivePetId,
  getPetById,
  getPetEnabled,
  getResolvedActivePet,
  refreshPetRegistry,
  resolvePetAssetUrl,
  type MythicalPet,
} from '../lib/mythical-pets';

const SPEED_MIN = 8;
const SPEED_MAX = 18;
const DIRECTION_MS = 2000;
const IDLE_MIN_MS = 6600;
const IDLE_MAX_MS = 15_000;
const ACTION_DURATION_MULTIPLIER = 2;
const ACTION_MIN_MS = 1800;
const SHATTER_DURATION_MS = 1200;
const SHATTER_REDUCED_MOTION_MS = 250;
const SHATTER_RADIUS = 180;
const SHATTER_KINDS = new Set<PetMoveDefinition['kind']>([
  'beam',
  'orb-lunge',
  'web-shot',
  'big-kamehameha',
  'web-screen-split',
]);
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
  shatterTriggered: boolean;
}

interface ShatterShard {
  points: string;
  dx: number;
  dy: number;
  rotation: number;
}

interface ShatterEffect {
  id: number;
  x: number;
  y: number;
  color: string;
  durationMs: number;
  cracks: string[];
  shards: ShatterShard[];
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
  lastMoveId: string;
  clipId: string;
  special: SpecialRuntime | null;
  specialLoading: boolean;
  actionRequested: boolean;
  queuedAction: boolean;
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

function actionDuration(pet: MythicalPet, clipId: string) {
  return Math.max(
    ACTION_MIN_MS,
    clipDuration(pet, clipId) * ACTION_DURATION_MULTIPLIER,
  );
}

function chooseRelocationTarget(
  x: number,
  y: number,
  displaySize: number,
) {
  const margin = Math.max(48, displaySize / 2);
  const minX = margin;
  const maxX = Math.max(minX, window.innerWidth - margin);
  const minY = margin;
  const maxY = Math.max(minY, window.innerHeight - margin);
  const midX = window.innerWidth / 2;
  const midY = window.innerHeight / 2;

  const xRange = x <= midX
    ? [Math.max(midX, minX), maxX]
    : [minX, Math.min(midX, maxX)];
  const yRange = y <= midY
    ? [Math.max(midY, minY), maxY]
    : [minY, Math.min(midY, maxY)];

  let targetX = randomBetween(xRange[0], Math.max(xRange[0], xRange[1]));
  let targetY = randomBetween(yRange[0], Math.max(yRange[0], yRange[1]));
  const minimumDistance = Math.min(
    Math.hypot(maxX - minX, maxY - minY),
    Math.hypot(window.innerWidth, window.innerHeight) * 0.25,
  );

  if (Math.hypot(targetX - x, targetY - y) < minimumDistance) {
    const corners = [
      { x: minX, y: minY },
      { x: minX, y: maxY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
    ];
    const farthest = corners.reduce((best, candidate) => (
      Math.hypot(candidate.x - x, candidate.y - y)
        > Math.hypot(best.x - x, best.y - y)
        ? candidate
        : best
    ));
    targetX = farthest.x;
    targetY = farthest.y;
  }

  return { x: targetX, y: targetY };
}

function createShatterEffect(
  id: number,
  x: number,
  y: number,
  color: string,
  reducedMotion: boolean,
): ShatterEffect {
  const crackCount = reducedMotion ? 8 : 12;
  const cracks = Array.from({ length: crackCount }, (_, index) => {
    const angle = (Math.PI * 2 * index) / crackCount + randomBetween(-0.14, 0.14);
    const length = SHATTER_RADIUS * randomBetween(0.55, 1);
    const bendAngle = angle + randomBetween(-0.22, 0.22);
    const bendLength = length * randomBetween(0.38, 0.58);
    const bendX = x + Math.cos(bendAngle) * bendLength;
    const bendY = y + Math.sin(bendAngle) * bendLength;
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;
    return `M ${x} ${y} L ${bendX} ${bendY} L ${endX} ${endY}`;
  });
  const shards = reducedMotion
    ? []
    : Array.from({ length: 8 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 8 + randomBetween(-0.2, 0.2);
        const distance = randomBetween(25, 70);
        const centerX = x + Math.cos(angle) * distance;
        const centerY = y + Math.sin(angle) * distance;
        const size = randomBetween(7, 16);
        return {
          points: [
            `${centerX},${centerY - size}`,
            `${centerX + size * 0.8},${centerY + size * 0.7}`,
            `${centerX - size * 0.65},${centerY + size * 0.45}`,
          ].join(' '),
          dx: Math.cos(angle) * randomBetween(25, 55),
          dy: Math.sin(angle) * randomBetween(25, 55) + randomBetween(10, 30),
          rotation: randomBetween(-80, 80),
        };
      });

  return {
    id,
    x,
    y,
    color,
    durationMs: reducedMotion ? SHATTER_REDUCED_MOTION_MS : SHATTER_DURATION_MS,
    cracks,
    shards,
  };
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
    lastMoveId: '',
    clipId: 'travel',
    special: null,
    specialLoading: false,
    actionRequested: false,
    queuedAction: false,
  };
}

function chooseMove(pet: MythicalPet, previous: string) {
  const candidates = pet.moves.filter((move) => move.id !== previous);
  const pool = candidates.length ? candidates : pet.moves;
  return pool[Math.floor(Math.random() * pool.length)];
}

const CLONE_20_GRID = [
  { rx: 0.08, ry: 0.14, facing: 1 as const },
  { rx: 0.26, ry: 0.12, facing: -1 as const },
  { rx: 0.44, ry: 0.18, facing: 1 as const },
  { rx: 0.64, ry: 0.14, facing: -1 as const },
  { rx: 0.84, ry: 0.16, facing: 1 as const },
  { rx: 0.14, ry: 0.38, facing: -1 as const },
  { rx: 0.32, ry: 0.35, facing: 1 as const },
  { rx: 0.50, ry: 0.42, facing: -1 as const },
  { rx: 0.68, ry: 0.36, facing: 1 as const },
  { rx: 0.86, ry: 0.40, facing: -1 as const },
  { rx: 0.08, ry: 0.62, facing: 1 as const },
  { rx: 0.25, ry: 0.66, facing: -1 as const },
  { rx: 0.44, ry: 0.60, facing: 1 as const },
  { rx: 0.62, ry: 0.65, facing: -1 as const },
  { rx: 0.82, ry: 0.62, facing: 1 as const },
  { rx: 0.18, ry: 0.85, facing: -1 as const },
  { rx: 0.36, ry: 0.88, facing: 1 as const },
  { rx: 0.55, ry: 0.82, facing: -1 as const },
  { rx: 0.74, ry: 0.86, facing: 1 as const },
  { rx: 0.92, ry: 0.84, facing: -1 as const },
];

export function MythicalPet() {
  const actorRef = useRef<HTMLCanvasElement>(null);
  const cloneLeftRef = useRef<HTMLCanvasElement>(null);
  const cloneRightRef = useRef<HTMLCanvasElement>(null);
  const screenClonesCanvasRef = useRef<HTMLCanvasElement>(null);
  const effectCoreRef = useRef<SVGPathElement>(null);
  const effectGlowRef = useRef<SVGPathElement>(null);
  const orbRef = useRef<SVGCircleElement>(null);
  const hitboxRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef(0);
  const runtimeRef = useRef<LiveRuntime>(initialRuntime());
  const clipCacheRef = useRef(new Map<string, LoadedClip>());
  const clipPromisesRef = useRef(new Map<string, Promise<LoadedClip>>());
  const shatterIdRef = useRef(0);
  const [enabled, setEnabled] = useState(getPetEnabled);
  const [pet, setPet] = useState<MythicalPet>(getResolvedActivePet);
  const [shatterEffect, setShatterEffect] = useState<ShatterEffect | null>(null);
  const reducedMotionRef = useRef(false);

  const resetEffects = useCallback(() => {
    for (const path of [effectCoreRef.current, effectGlowRef.current]) {
      if (path) path.style.visibility = 'hidden';
    }
    if (orbRef.current) orbRef.current.style.visibility = 'hidden';
    for (const clone of [cloneLeftRef.current, cloneRightRef.current]) {
      if (clone) clone.style.visibility = 'hidden';
    }
    if (screenClonesCanvasRef.current) {
      const ctx = screenClonesCanvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, screenClonesCanvasRef.current.width, screenClonesCanvasRef.current.height);
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
      }>).detail;
      if (detail.id) setPet(getPetById(detail.id) ?? BUILTIN_PETS[0]);
      if (typeof detail.enabled === 'boolean') setEnabled(detail.enabled);
    };
    const onStorage = () => {
      setEnabled(getPetEnabled());
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
    runtime.actionRequested = false;
    runtime.queuedAction = false;
    setShatterEffect(null);
    resetEffects();
    void ensureClip(pet, 'idle');
    void ensureClip(pet, 'travel');
    void ensureClip(pet, 'blink');
  }, [ensureClip, pet, resetEffects]);

  useEffect(() => {
    if (!shatterEffect) return;
    const timeout = window.setTimeout(() => {
      setShatterEffect((current) => (
        current?.id === shatterEffect.id ? null : current
      ));
    }, shatterEffect.durationMs);
    return () => window.clearTimeout(timeout);
  }, [shatterEffect]);

  useEffect(() => {
    if (!enabled) {
      cancelAnimationFrame(animationRef.current);
      setShatterEffect(null);
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

    const beginSpecial = async (move: PetMoveDefinition) => {
      if (runtime.specialLoading || runtime.special) return;
      runtime.specialLoading = true;
      const loaded = await ensureClip(pet, move.clip);
      runtime.specialLoading = false;
      if (disposed || loaded.failed || pet.id !== (getPetById(pet.id)?.id ?? pet.id)) {
        runtime.lastMoveId = move.id;
        if (runtime.queuedAction) {
          runtime.queuedAction = false;
          runtime.actionRequested = true;
        }
        return;
      }
      const direction = runtime.facing;
      const roomLeft = runtime.x - 80;
      const roomRight = window.innerWidth - runtime.x - 80;
      const preferred = direction === 1 ? roomRight : roomLeft;
      const travel = clamp(preferred, 120, 280) * direction;
      let targetX = clamp(runtime.x + travel, 72, window.innerWidth - 72);
      let targetY = clamp(
        runtime.y + randomBetween(-90, 90),
        72,
        window.innerHeight - 72,
      );
      if (move.kind === 'teleport' || move.kind === 'blink') {
        const relocation = chooseRelocationTarget(
          runtime.x,
          runtime.y,
          pet.displaySize,
        );
        targetX = relocation.x;
        targetY = relocation.y;
      }
      runtime.special = {
        move,
        startedAt: performance.now(),
        durationMs: actionDuration(pet, move.clip),
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
        shatterTriggered: false,
      };
      runtime.lastMoveId = move.id;
      changeState('special', move.clip, performance.now(), runtime.special.durationMs);
    };

    const beginFallbackBlink = (now: number) => {
      changeState('blink', 'blink', now, actionDuration(pet, 'blink'));
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

      if (
        SHATTER_KINDS.has(special.move.kind)
        && progress >= 0.68
        && !special.shatterTriggered
      ) {
        special.shatterTriggered = true;
        shatterIdRef.current += 1;
        setShatterEffect(createShatterEffect(
          shatterIdRef.current,
          special.targetX,
          special.targetY,
          primary,
          reducedMotionRef.current,
        ));
      }

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
            const lungeProgress = easeInOut((progress - 0.48) / 0.52);
            runtime.x = special.startX
              + (special.targetX - special.startX) * lungeProgress;
            runtime.y = special.startY
              + (special.targetY - special.startY) * lungeProgress;
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
        case 'big-kamehameha': {
          if (progress <= 0.38) {
            const orb = orbRef.current;
            const orbX = runtime.x + runtime.facing * 38;
            if (orb) {
              orb.setAttribute('cx', String(orbX));
              orb.setAttribute('cy', String(runtime.y));
              orb.setAttribute('r', String(16 + Math.sin(progress * 30) * 14));
              orb.setAttribute('stroke', primary);
              orb.style.visibility = 'visible';
            }
          }
          if (progress > 0.22 && progress < 0.94) {
            const startX = runtime.x + runtime.facing * 36;
            const endX = runtime.facing === 1 ? window.innerWidth : 0;
            const width = 28 + Math.sin(progress * Math.PI) * 55;
            drawEffectPath(
              `M ${startX} ${runtime.y} L ${endX} ${runtime.y}`,
              secondary,
              primary,
              width,
            );
          }
          break;
        }
        case 'screen-clones': {
          const clonesCanvas = screenClonesCanvasRef.current;
          if (clonesCanvas) {
            if (clonesCanvas.width !== window.innerWidth || clonesCanvas.height !== window.innerHeight) {
              clonesCanvas.width = window.innerWidth;
              clonesCanvas.height = window.innerHeight;
            }
            const ctx = clonesCanvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, clonesCanvas.width, clonesCanvas.height);
              const loaded = clipCacheRef.current.get(
                `${pet.id}:${pet.animations[runtime.clipId]?.sheet}`,
              );
              if (loaded?.image && !loaded.failed) {
                const clip = pet.animations[runtime.clipId] ?? pet.animations.idle;
                const drawSize = frameDrawSize(pet, clip.frameWidth);
                const sourceFrame = runtime.frameIndex % clip.frameCount;
                const cloneAlpha = Math.sin(progress * Math.PI) * 0.9;

                CLONE_20_GRID.forEach((pos) => {
                  const cx = pos.rx * window.innerWidth;
                  const cy = pos.ry * window.innerHeight;

                  ctx.save();
                  ctx.globalAlpha = cloneAlpha;
                  ctx.imageSmoothingEnabled = false;
                  ctx.shadowColor = primary;
                  ctx.shadowBlur = 14;

                  ctx.translate(cx, cy);
                  if (pos.facing === -1) {
                    ctx.scale(-1, 1);
                  }
                  ctx.drawImage(
                    loaded.image!,
                    sourceFrame * clip.frameWidth,
                    0,
                    clip.frameWidth,
                    clip.frameHeight,
                    -drawSize / 2,
                    -drawSize / 2,
                    drawSize,
                    drawSize,
                  );
                  ctx.restore();
                });
              }
            }
          }

          if (progress > 0.08 && progress < 0.92) {
            let smokePaths = '';
            CLONE_20_GRID.forEach((pos, idx) => {
              const cx = pos.rx * window.innerWidth;
              const cy = pos.ry * window.innerHeight;
              const r = 22 + Math.sin(progress * Math.PI * 3 + idx) * 8;
              smokePaths += `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} `;
            });
            drawEffectPath(smokePaths.trim(), secondary, primary, 3);
          }
          break;
        }
        case 'web-screen-split': {
          if (progress > 0.12 && progress < 0.92) {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const cx = runtime.x;
            const cy = runtime.y;
            const webPath = `
              M ${cx} ${cy} L 0 0
              M ${cx} ${cy} L ${w} 0
              M ${cx} ${cy} L 0 ${h}
              M ${cx} ${cy} L ${w} ${h}
              M ${cx} ${cy} L ${cx} 0
              M ${cx} ${cy} L ${cx} ${h}
              M ${cx} ${cy} L 0 ${cy}
              M ${cx} ${cy} L ${w} ${cy}
              M ${w * 0.15} 0 Q ${cx} ${h * 0.15} ${w * 0.85} 0
              M ${w * 0.15} ${h} Q ${cx} ${h * 0.85} ${w * 0.85} ${h}
              M 0 ${h * 0.15} Q ${w * 0.15} ${cy} 0 ${h * 0.85}
              M ${w} ${h * 0.15} Q ${w * 0.85} ${cy} ${w} ${h * 0.85}
            `.replace(/\s+/g, ' ').trim();
            drawEffectPath(webPath, '#ffffff', primary, 2.5 + Math.sin(progress * Math.PI) * 2);
          }
          break;
        }
        case 'blink':
          if (progress >= 0.48 && !special.relocated) {
            runtime.x = special.targetX;
            runtime.y = special.targetY;
            special.relocated = true;
          }
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
      let elapsed = now - runtime.stateStartedAt;

      if (
        runtime.actionRequested
        && !runtime.specialLoading
        && !runtime.special
        && (runtime.state === 'idle' || runtime.state === 'travel')
      ) {
        runtime.actionRequested = false;
        const movement = chooseMove(pet, runtime.lastMoveId);
        if (movement) void beginSpecial(movement);
        else beginFallbackBlink(now);
        elapsed = now - runtime.stateStartedAt;
      }

      if (runtime.state === 'idle' && elapsed >= runtime.stateDurationMs) {
        runtime.vx = randomVelocity(pet.speedMultiplier);
        runtime.vy = randomVelocity(pet.speedMultiplier);
        changeState('travel', 'travel', now, DIRECTION_MS);
      } else if (runtime.state === 'travel') {
        runtime.x += runtime.vx * delta;
        runtime.y += runtime.vy * delta;
        if (elapsed >= runtime.stateDurationMs) {
          changeState(
            'idle',
            'idle',
            now,
            randomBetween(IDLE_MIN_MS, IDLE_MAX_MS),
          );
        }
      } else if (runtime.state === 'blink') {
        if (elapsed >= runtime.stateDurationMs) {
          if (runtime.queuedAction) {
            runtime.queuedAction = false;
            runtime.actionRequested = true;
          }
          changeState(
            'idle',
            'idle',
            now,
            randomBetween(IDLE_MIN_MS, IDLE_MAX_MS),
          );
        }
      } else if (runtime.state === 'special' && runtime.special) {
        if (now - runtime.special.startedAt >= runtime.special.durationMs) {
          runtime.special = null;
          resetEffects();
          if (runtime.queuedAction) {
            runtime.queuedAction = false;
            runtime.actionRequested = true;
            changeState('idle', 'idle', now, IDLE_MAX_MS);
          } else {
            changeState('recover', 'idle', now, 320);
          }
        }
      } else if (runtime.state === 'recover' && elapsed >= runtime.stateDurationMs) {
        if (runtime.queuedAction) {
          runtime.queuedAction = false;
          runtime.actionRequested = true;
        }
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
      const baseFrameInterval = 1000 / (clip.fps * pet.speedMultiplier);
      const isActionState = runtime.state === 'special' || runtime.state === 'blink';
      const frameInterval = isActionState
        ? clip.looped
          ? baseFrameInterval * ACTION_DURATION_MULTIPLIER
          : runtime.stateDurationMs / Math.max(1, clip.frameCount)
        : baseFrameInterval;
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
        setShatterEffect(null);
      } else {
        start();
      }
    };
    const onResize = () => {
      runtime.x = clamp(runtime.x, 48, window.innerWidth - 48);
      runtime.y = clamp(runtime.y, 48, window.innerHeight - 48);
      setShatterEffect(null);
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    start();
    return () => {
      disposed = true;
      cancelAnimationFrame(animationRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      setShatterEffect(null);
      resetEffects();
    };
  }, [enabled, ensureClip, pet, resetEffects]);

  const handleClick = useCallback(() => {
    const runtime = runtimeRef.current;
    if (
      runtime.actionRequested
      || runtime.specialLoading
      || runtime.state === 'special'
      || runtime.state === 'blink'
      || runtime.state === 'recover'
    ) {
      runtime.queuedAction = true;
      return;
    }
    runtime.actionRequested = true;
  }, []);

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
        {shatterEffect && (
          <g
            key={shatterEffect.id}
            className="pet-shatter-effect"
            style={{ animationDuration: `${shatterEffect.durationMs}ms` }}
            aria-hidden="true"
          >
            {shatterEffect.cracks.map((path, index) => (
              <path
                key={`crack-${index}`}
                d={path}
                fill="none"
                stroke={index % 2 === 0 ? '#f8fafc' : shatterEffect.color}
                strokeWidth={index % 3 === 0 ? 2.2 : 1.2}
                strokeLinecap="round"
                opacity={0.9}
                filter="url(#pet-effect-glow)"
              />
            ))}
            {shatterEffect.shards.map((shard, index) => (
              <polygon
                key={`shard-${index}`}
                points={shard.points}
                fill={index % 2 === 0 ? '#ffffff' : shatterEffect.color}
                fillOpacity={index % 2 === 0 ? 0.18 : 0.2}
                stroke={index % 2 === 0 ? '#f8fafc' : shatterEffect.color}
                strokeWidth="1"
                className="pet-shatter-shard"
                style={{
                  '--pet-shard-x': `${shard.dx}px`,
                  '--pet-shard-y': `${shard.dy}px`,
                  '--pet-shard-rotation': `${shard.rotation}deg`,
                  animationDuration: `${shatterEffect.durationMs}ms`,
                  transformOrigin: `${shatterEffect.x}px ${shatterEffect.y}px`,
                } as CSSProperties}
              />
            ))}
          </g>
        )}
      </svg>
      <canvas
        ref={screenClonesCanvasRef}
        width={typeof window !== 'undefined' ? window.innerWidth : 1920}
        height={typeof window !== 'undefined' ? window.innerHeight : 1080}
        className="fixed inset-0 pointer-events-none z-[38]"
        style={{ imageRendering: 'pixelated' }}
      />
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
        aria-label={`Play an action with ${pet.name}`}
        title={`${pet.name} · Click to play an action`}
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
      } else if (move?.kind === 'big-kamehameha' && progress > 0.2) {
        const gradient = context.createLinearGradient(centerX + 20, 0, canvas.width, 0);
        gradient.addColorStop(0, move.secondaryColor ?? '#ffffff');
        gradient.addColorStop(1, move.primaryColor ?? '#00d2ff');
        context.save();
        context.strokeStyle = gradient;
        context.lineWidth = 32;
        context.shadowColor = move.primaryColor ?? '#00d2ff';
        context.shadowBlur = 24;
        context.beginPath();
        context.moveTo(centerX + 18, centerY);
        context.lineTo(canvas.width, centerY);
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
      } else if (move?.kind === 'web-screen-split' && progress > 0.1) {
        context.save();
        context.strokeStyle = '#ffffff';
        context.lineWidth = 2;
        context.shadowColor = move.primaryColor ?? '#cbd5e1';
        context.shadowBlur = 10;
        context.beginPath();
        context.moveTo(0, 0); context.lineTo(canvas.width, canvas.height);
        context.moveTo(canvas.width, 0); context.lineTo(0, canvas.height);
        context.moveTo(centerX, 0); context.lineTo(centerX, canvas.height);
        context.moveTo(0, centerY); context.lineTo(canvas.width, centerY);
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
      if (move?.kind === 'clone' || move?.kind === 'screen-clones') {
        context.globalAlpha = Math.sin(progress * Math.PI) * 0.75;
        context.drawImage(actorBuffer, centerX - 150, centerY - 96, ACTOR_CANVAS, ACTOR_CANVAS);
        context.drawImage(actorBuffer, centerX - 42, centerY - 96, ACTOR_CANVAS, ACTOR_CANVAS);
        context.globalAlpha = 1;
      }
      context.drawImage(actorBuffer, centerX - 96, centerY - 96, ACTOR_CANVAS, ACTOR_CANVAS);

      if ((clip.looped || progress < 1) && !document.hidden) {
        animationRef.current = requestAnimationFrame(loop);
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationRef.current);
      } else if (clip.looped) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(loop);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    animationRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
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
