import type {
  PetAnimationClip,
  PetMoveDefinition,
  PetPackDiagnostic,
  PetPackPetDefinition,
} from '../types';
import { petListPacks, petLoadAsset } from './tauri';

export interface MythicalPet {
  /** Stable persisted id. Local pets use <pack-id>:<pet-id>. */
  id: string;
  localId: string;
  source: 'builtin' | 'local';
  packId?: string;
  packName?: string;
  name: string;
  nameVn: string;
  thumbnail?: string;
  displaySize: number;
  speedMultiplier: number;
  glowColor: string;
  animations: Record<string, PetAnimationClip>;
  moves: PetMoveDefinition[];
}

export interface PetTuning {
  displaySize: number;
  speedMultiplier: number;
}

type PetTuningOverrides = Record<string, Partial<PetTuning>>;

const legacyClip = (
  sheet: string,
  fps: number,
  looped = true,
): PetAnimationClip => ({
  sheet,
  frameWidth: 48,
  frameHeight: 48,
  frameCount: 4,
  fps,
  looped,
});

export const BUILTIN_PETS: MythicalPet[] = [
  {
    id: 'goku',
    localId: 'goku',
    source: 'builtin',
    name: 'Goku (Ultra Instinct)',
    nameVn: 'Goku (Bản Năng Vô Cực)',
    displaySize: 72,
    speedMultiplier: 1,
    glowColor: '#38bdf8',
    animations: {
      idle: legacyClip('/assets/pets/dragon.png', 7),
      travel: legacyClip('/assets/pets/dragon.png', 7),
      blink: legacyClip('/assets/pets/dragon.png', 10, false),
    },
    moves: [
      {
        id: 'instant-transmission',
        label: 'Instant Transmission',
        kind: 'teleport',
        clip: 'blink',
        primaryColor: '#38bdf8',
        secondaryColor: '#ffffff',
      },
      {
        id: 'kamehameha-beam',
        label: 'Kamehameha',
        kind: 'beam',
        clip: 'idle',
        primaryColor: '#0ea5e9',
        secondaryColor: '#e0f2fe',
      },
      {
        id: 'big-kamehameha',
        label: 'Big Kamehameha',
        kind: 'big-kamehameha',
        clip: 'idle',
        primaryColor: '#00d2ff',
        secondaryColor: '#ffffff',
      },
    ],
  },
  {
    id: 'naruto',
    localId: 'naruto',
    source: 'builtin',
    name: 'Naruto (Seventh Hokage)',
    nameVn: 'Naruto (Hokage Đệ Thất)',
    displaySize: 72,
    speedMultiplier: 1,
    glowColor: '#f97316',
    animations: {
      idle: legacyClip('/assets/pets/phoenix.png', 7),
      travel: legacyClip('/assets/pets/phoenix.png', 7),
      blink: legacyClip('/assets/pets/phoenix.png', 10, false),
    },
    moves: [
      {
        id: 'shadow-clone-duo',
        label: 'Shadow Clone Jutsu',
        kind: 'clone',
        clip: 'idle',
        primaryColor: '#f97316',
        secondaryColor: '#fef08a',
      },
      {
        id: 'rasengan',
        label: 'Rasengan',
        kind: 'orb-lunge',
        clip: 'travel',
        primaryColor: '#38bdf8',
        secondaryColor: '#60a5fa',
      },
      {
        id: 'multi-clone-jutsu',
        label: '20 Shadow Clones Screen Jutsu',
        kind: 'screen-clones',
        clip: 'idle',
        primaryColor: '#f97316',
        secondaryColor: '#facc15',
      },
    ],
  },
  {
    id: 'web-ranger',
    localId: 'web-ranger',
    source: 'builtin',
    name: 'Spider-Man (Web Ranger)',
    nameVn: 'Người Nhện (Web Ranger)',
    displaySize: 72,
    speedMultiplier: 1,
    glowColor: '#ef4444',
    animations: {
      idle: legacyClip('/assets/pets/qilin.png', 6),
      travel: legacyClip('/assets/pets/qilin.png', 6),
      blink: legacyClip('/assets/pets/qilin.png', 10, false),
    },
    moves: [
      {
        id: 'web-shot',
        label: 'Web Shot',
        kind: 'web-shot',
        clip: 'idle',
        primaryColor: '#e2e8f0',
        secondaryColor: '#ef4444',
      },
      {
        id: 'web-zip',
        label: 'Web Zip',
        kind: 'web-zip',
        clip: 'travel',
        primaryColor: '#ef4444',
        secondaryColor: '#3b82f6',
      },
      {
        id: 'full-web-spider',
        label: 'Full Web Spider Matrix',
        kind: 'web-screen-split',
        clip: 'idle',
        primaryColor: '#cbd5e1',
        secondaryColor: '#ef4444',
      },
    ],
  },
  {
    id: 'dragon',
    localId: 'dragon',
    source: 'builtin',
    name: 'Dragon',
    nameVn: 'Rồng',
    displaySize: 72,
    speedMultiplier: 1,
    glowColor: '#22d3ee',
    animations: {
      idle: legacyClip('/assets/pets/dragon.png', 7),
      travel: legacyClip('/assets/pets/dragon.png', 7),
      blink: legacyClip('/assets/pets/dragon.png', 10, false),
    },
    moves: [
      {
        id: 'fire-beam',
        label: 'Fire Beam',
        kind: 'beam',
        clip: 'idle',
        primaryColor: '#22d3ee',
        secondaryColor: '#ffffff',
      },
      {
        id: 'dragon-kamehameha',
        label: 'Dragon Kamehameha',
        kind: 'big-kamehameha',
        clip: 'idle',
        primaryColor: '#06b6d4',
        secondaryColor: '#67e8f9',
      },
    ],
  },
  {
    id: 'phoenix',
    localId: 'phoenix',
    source: 'builtin',
    name: 'Phoenix',
    nameVn: 'Phượng Hoàng',
    displaySize: 72,
    speedMultiplier: 1,
    glowColor: '#fb923c',
    animations: {
      idle: legacyClip('/assets/pets/phoenix.png', 7),
      travel: legacyClip('/assets/pets/phoenix.png', 7),
      blink: legacyClip('/assets/pets/phoenix.png', 10, false),
    },
    moves: [
      {
        id: 'solar-teleport',
        label: 'Solar Teleport',
        kind: 'teleport',
        clip: 'blink',
        primaryColor: '#fb923c',
        secondaryColor: '#fdba74',
      },
      {
        id: 'flame-clones',
        label: 'Flame Clones Jutsu',
        kind: 'screen-clones',
        clip: 'idle',
        primaryColor: '#f97316',
        secondaryColor: '#fef08a',
      },
    ],
  },
  {
    id: 'qilin',
    localId: 'qilin',
    source: 'builtin',
    name: 'Qilin',
    nameVn: 'Kỳ Lân',
    displaySize: 72,
    speedMultiplier: 1,
    glowColor: '#a78bfa',
    animations: {
      idle: legacyClip('/assets/pets/qilin.png', 6),
      travel: legacyClip('/assets/pets/qilin.png', 6),
      blink: legacyClip('/assets/pets/qilin.png', 10, false),
    },
    moves: [
      {
        id: 'spirit-lunge',
        label: 'Spirit Lunge',
        kind: 'orb-lunge',
        clip: 'travel',
        primaryColor: '#a78bfa',
        secondaryColor: '#ddd6fe',
      },
      {
        id: 'spirit-web-trap',
        label: 'Spirit Web Trap',
        kind: 'web-screen-split',
        clip: 'idle',
        primaryColor: '#c084fc',
        secondaryColor: '#e9d5ff',
      },
    ],
  },
  {
    id: 'pegasus',
    localId: 'pegasus',
    source: 'builtin',
    name: 'Pegasus',
    nameVn: 'Thiên Mã',
    displaySize: 72,
    speedMultiplier: 1,
    glowColor: '#facc15',
    animations: {
      idle: legacyClip('/assets/pets/pegasus.png', 7),
      travel: legacyClip('/assets/pets/pegasus.png', 7),
      blink: legacyClip('/assets/pets/pegasus.png', 10, false),
    },
    moves: [
      {
        id: 'starlight-beam',
        label: 'Starlight Beam',
        kind: 'beam',
        clip: 'idle',
        primaryColor: '#facc15',
        secondaryColor: '#fef08a',
      },
    ],
  },
];

/** Backward-compatible export used by older settings/sidebar code. */
export const ALL_PETS = BUILTIN_PETS;

let localPets: MythicalPet[] = [];
let diagnostics: PetPackDiagnostic[] = [];
let refreshPromise: Promise<MythicalPet[]> | null = null;

const MAX_CACHE_ENTRIES = 6;
const MAX_CACHE_BYTES = 24 * 1024 * 1024;

interface CachedAsset {
  url: string;
  bytes: number;
}

const assetCache = new Map<string, CachedAsset>();
const loadingAssets = new Map<string, Promise<string>>();
let cachedBytes = 0;

const PET_TUNING_KEY = 'clx-mythical-pet-tuning';
const PET_SIZE_MIN = 20;
const PET_SIZE_MAX = 160;
const PET_SPEED_MIN = 0.5;
const PET_SPEED_MAX = 2;

function clampTuning(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function readPetTuningOverrides(): PetTuningOverrides {
  try {
    const raw = localStorage.getItem(PET_TUNING_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object'
      ? parsed as PetTuningOverrides
      : {};
  } catch {
    return {};
  }
}

function writePetTuningOverrides(overrides: PetTuningOverrides) {
  try {
    localStorage.setItem(PET_TUNING_KEY, JSON.stringify(overrides));
  } catch {
    // Browser storage can be unavailable in restricted WebViews.
  }
}

function getBasePets(): MythicalPet[] {
  return [...BUILTIN_PETS, ...localPets];
}

function applyPetTuning(
  pet: MythicalPet,
  overrides: PetTuningOverrides,
): MythicalPet {
  const tuning = overrides[pet.id];
  if (!tuning) return pet;
  return {
    ...pet,
    displaySize: clampTuning(
      Number(tuning.displaySize ?? pet.displaySize),
      PET_SIZE_MIN,
      PET_SIZE_MAX,
    ),
    speedMultiplier: clampTuning(
      Number(tuning.speedMultiplier ?? pet.speedMultiplier),
      PET_SPEED_MIN,
      PET_SPEED_MAX,
    ),
  };
}

function toRegisteredPet(
  packId: string,
  packName: string,
  pet: PetPackPetDefinition,
): MythicalPet {
  const moves = [...(pet.moves || [])];
  const petIdLower = pet.id.toLowerCase();

  if (petIdLower.includes('goku') && !moves.some((m) => m.kind === 'big-kamehameha')) {
    moves.push({
      id: 'big-kamehameha',
      label: 'Big Kamehameha',
      kind: 'big-kamehameha',
      clip: 'idle',
      primaryColor: '#00d2ff',
      secondaryColor: '#ffffff',
    });
  }
  if (petIdLower.includes('naruto') && !moves.some((m) => m.kind === 'screen-clones')) {
    moves.push({
      id: 'multi-clone-jutsu',
      label: '20 Shadow Clones Screen Jutsu',
      kind: 'screen-clones',
      clip: 'idle',
      primaryColor: '#f97316',
      secondaryColor: '#facc15',
    });
  }
  if (
    (petIdLower.includes('ranger') || petIdLower.includes('spider')) &&
    !moves.some((m) => m.kind === 'web-screen-split')
  ) {
    moves.push({
      id: 'full-web-spider',
      label: 'Full Web Spider Matrix',
      kind: 'web-screen-split',
      clip: 'idle',
      primaryColor: '#cbd5e1',
      secondaryColor: '#ef4444',
    });
  }

  return {
    ...pet,
    id: `${packId}:${pet.id}`,
    localId: pet.id,
    source: 'local',
    packId,
    packName,
    moves,
  };
}

function revokeCachedAssets() {
  assetCache.forEach((asset) => URL.revokeObjectURL(asset.url));
  assetCache.clear();
  loadingAssets.clear();
  cachedBytes = 0;
}

function evictAssetCache() {
  while (
    assetCache.size > MAX_CACHE_ENTRIES
    || cachedBytes > MAX_CACHE_BYTES
  ) {
    const oldest = assetCache.entries().next().value as
      | [string, CachedAsset]
      | undefined;
    if (!oldest) break;
    assetCache.delete(oldest[0]);
    cachedBytes -= oldest[1].bytes;
    URL.revokeObjectURL(oldest[1].url);
  }
}

function base64ToBlobUrl(dataBase64: string, mimeType: string): CachedAsset {
  const binary = atob(dataBase64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return {
    url: URL.createObjectURL(new Blob([bytes], { type: mimeType })),
    bytes: bytes.byteLength,
  };
}

export async function resolvePetAssetUrl(
  pet: MythicalPet,
  relativePath: string,
): Promise<string> {
  if (pet.source === 'builtin') return relativePath;
  if (!pet.packId) throw new Error(`Local pet '${pet.id}' has no pack id`);

  const key = `${pet.packId}:${relativePath}`;
  const cached = assetCache.get(key);
  if (cached) {
    assetCache.delete(key);
    assetCache.set(key, cached);
    return cached.url;
  }
  const loading = loadingAssets.get(key);
  if (loading) return loading;

  const promise = petLoadAsset(pet.packId, relativePath)
    .then((payload) => {
      const asset = base64ToBlobUrl(payload.dataBase64, payload.mimeType);
      assetCache.set(key, asset);
      cachedBytes += asset.bytes;
      evictAssetCache();
      return asset.url;
    })
    .finally(() => {
      loadingAssets.delete(key);
    });
  loadingAssets.set(key, promise);
  return promise;
}

export function getRegisteredPets(): MythicalPet[] {
  const overrides = readPetTuningOverrides();
  return getBasePets().map((pet) => applyPetTuning(pet, overrides));
}

export function getPetDefaultTuning(id: string): PetTuning | undefined {
  const pet = getBasePets().find((candidate) => candidate.id === id);
  if (!pet) return undefined;
  return {
    displaySize: pet.displaySize,
    speedMultiplier: pet.speedMultiplier,
  };
}

export function setPetTuning(id: string, tuning: PetTuning) {
  const defaults = getPetDefaultTuning(id);
  if (!defaults) return;
  const overrides = readPetTuningOverrides();
  const displaySize = Math.round(
    clampTuning(tuning.displaySize, PET_SIZE_MIN, PET_SIZE_MAX),
  );
  const speedMultiplier = Math.round(
    clampTuning(tuning.speedMultiplier, PET_SPEED_MIN, PET_SPEED_MAX) * 10,
  ) / 10;

  if (
    displaySize === defaults.displaySize
    && Math.abs(speedMultiplier - defaults.speedMultiplier) < 0.001
  ) {
    delete overrides[id];
  } else {
    overrides[id] = { displaySize, speedMultiplier };
  }
  writePetTuningOverrides(overrides);
  window.dispatchEvent(new CustomEvent('mythical-pet-registry-change'));
}

export function resetPetTuning(id: string) {
  const overrides = readPetTuningOverrides();
  delete overrides[id];
  writePetTuningOverrides(overrides);
  window.dispatchEvent(new CustomEvent('mythical-pet-registry-change'));
}

export function getPetDiagnostics(): PetPackDiagnostic[] {
  return [...diagnostics];
}

export async function refreshPetRegistry(): Promise<MythicalPet[]> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = petListPacks()
    .then((response) => {
      revokeCachedAssets();
      diagnostics = response.errors;
      localPets = response.packs.flatMap((pack) =>
        pack.manifest.pets.map((pet) =>
          toRegisteredPet(pack.manifest.id, pack.manifest.name, pet),
        ),
      );
      const pets = getRegisteredPets();
      window.dispatchEvent(
        new CustomEvent('mythical-pet-registry-change', {
          detail: { pets, diagnostics },
        }),
      );
      return pets;
    })
    .catch((error) => {
      diagnostics = [
        {
          directory: '(registry)',
          error: error instanceof Error ? error.message : String(error),
        },
      ];
      return getRegisteredPets();
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export function getPetById(id: string): MythicalPet | undefined {
  return getRegisteredPets().find((pet) => pet.id === id);
}

export function getResolvedActivePet(): MythicalPet {
  return getPetById(getActivePetId()) ?? BUILTIN_PETS[0];
}

const PET_KEY = 'clx-mythical-pet';
const PET_ENABLED_KEY = 'clx-mythical-pet-enabled';

export function getActivePetId(): string {
  try {
    return localStorage.getItem(PET_KEY) || 'dragon';
  } catch {
    return 'dragon';
  }
}

export function setActivePetId(id: string) {
  try {
    localStorage.setItem(PET_KEY, id);
  } catch {
    // Browser storage can be unavailable in restricted WebViews.
  }
}

export function getPetEnabled(): boolean {
  try {
    return localStorage.getItem(PET_ENABLED_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function setPetEnabled(value: boolean) {
  try {
    localStorage.setItem(PET_ENABLED_KEY, String(value));
  } catch {
    // Browser storage can be unavailable in restricted WebViews.
  }
}
