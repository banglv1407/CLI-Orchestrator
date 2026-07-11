// mythical-pets.ts
// Mythical creature pixel-art sprite-sheet animations (4 frames each, 48x48).
// Sprites live in /assets/pets/<id>.png (public/assets/pets/).

export interface MythicalPet {
  id: string;
  name: string;
  nameVn: string;
  /** Path to the sprite sheet PNG (horizontal strip of 48x48 frames) */
  spritePath: string;
  /** Number of frames in the sheet */
  frameCount: number;
  /** Width/height of each frame in pixels */
  frameSize: number;
  /** Milliseconds between frame advances */
  frameInterval: number;
  /** Display scale (1 = 48px native) */
  scale: number;
  /** Glow/shadow color for the pet aura */
  glowColor: string;
}

export const ALL_PETS: MythicalPet[] = [
  {
    id: 'dragon',
    name: 'Dragon',
    nameVn: 'Rồng',
    spritePath: '/assets/pets/dragon.png',
    frameCount: 4,
    frameSize: 48,
    frameInterval: 150,
    scale: 1.5,
    glowColor: 'rgba(34,211,238,0.4)',
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    nameVn: 'Phượng Hoàng',
    spritePath: '/assets/pets/phoenix.png',
    frameCount: 4,
    frameSize: 48,
    frameInterval: 140,
    scale: 1.5,
    glowColor: 'rgba(251,146,60,0.4)',
  },
  {
    id: 'qilin',
    name: 'Qilin',
    nameVn: 'Kỳ Lân',
    spritePath: '/assets/pets/qilin.png',
    frameCount: 4,
    frameSize: 48,
    frameInterval: 160,
    scale: 1.5,
    glowColor: 'rgba(167,139,250,0.4)',
  },
  {
    id: 'pegasus',
    name: 'Pegasus',
    nameVn: 'Thiên Mã',
    spritePath: '/assets/pets/pegasus.png',
    frameCount: 4,
    frameSize: 48,
    frameInterval: 140,
    scale: 1.5,
    glowColor: 'rgba(250,204,21,0.4)',
  },
];

export function getPetById(id: string): MythicalPet | undefined {
  return ALL_PETS.find((p) => p.id === id);
}

const PET_KEY = 'clx-mythical-pet';
const PET_ENABLED_KEY = 'clx-mythical-pet-enabled';

export function getActivePetId(): string {
  try { return localStorage.getItem(PET_KEY) || 'dragon'; } catch { return 'dragon'; }
}
export function setActivePetId(id: string) {
  try { localStorage.setItem(PET_KEY, id); } catch {}
}
export function getPetEnabled(): boolean {
  try { return localStorage.getItem(PET_ENABLED_KEY) !== 'false'; } catch { return true; }
}
export function setPetEnabled(v: boolean) {
  try { localStorage.setItem(PET_ENABLED_KEY, String(v)); } catch {}
}
