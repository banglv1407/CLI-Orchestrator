// NES controller input — bitmask encoding, keyboard and Gamepad API mapping,
// and per-role persisted mappings (never sent to the server).

import { Controller } from "jsnes";

// Bitmask order per plan: Up, Down, Left, Right, A, B, Select, Start.
export const NES_BIT_UP = 0x01;
export const NES_BIT_DOWN = 0x02;
export const NES_BIT_LEFT = 0x04;
export const NES_BIT_RIGHT = 0x08;
export const NES_BIT_A = 0x10;
export const NES_BIT_B = 0x20;
export const NES_BIT_SELECT = 0x40;
export const NES_BIT_START = 0x80;
// SNES extensions — low eight bits stay byte-compatible with NES masks.
export const SNES_BIT_X = 0x100;
export const SNES_BIT_Y = 0x200;
export const SNES_BIT_L = 0x400;
export const SNES_BIT_R = 0x800;

// bit -> JSNES Controller button index
export const BIT_TO_JSNES_BUTTON: Record<number, number> = {
  [NES_BIT_UP]: Controller.BUTTON_UP,
  [NES_BIT_DOWN]: Controller.BUTTON_DOWN,
  [NES_BIT_LEFT]: Controller.BUTTON_LEFT,
  [NES_BIT_RIGHT]: Controller.BUTTON_RIGHT,
  [NES_BIT_A]: Controller.BUTTON_A,
  [NES_BIT_B]: Controller.BUTTON_B,
  [NES_BIT_SELECT]: Controller.BUTTON_SELECT,
  [NES_BIT_START]: Controller.BUTTON_START,
};

export const ALL_NES_BITS = [
  NES_BIT_UP,
  NES_BIT_DOWN,
  NES_BIT_LEFT,
  NES_BIT_RIGHT,
  NES_BIT_A,
  NES_BIT_B,
  NES_BIT_SELECT,
  NES_BIT_START,
] as const;

export type NesRole = "host" | "guest";

export interface NesKeyMapping {
  up: string[];
  down: string[];
  left: string[];
  right: string[];
  a: string[];
  b: string[];
  turboA: string[];
  turboB: string[];
  select: string[];
  start: string[];
  /** SNES-only extras; unused by the NES engine. */
  x?: string[];
  y?: string[];
  l?: string[];
  r?: string[];
}

export const DEFAULT_KEY_MAPPING: NesKeyMapping = {
  up: ["ArrowUp", "w", "W"],
  down: ["ArrowDown", "s", "S"],
  left: ["ArrowLeft", "a", "A"],
  right: ["ArrowRight", "d", "D"],
  a: ["z", "Z", "j", "J"],
  b: ["x", "X", "k", "K"],
  turboA: ["c", "C", "u", "U"],
  turboB: ["v", "V", "i", "I"],
  select: ["Shift", "Tab"],
  start: ["Enter", " "],
  // SNES extras (shared defaults; remappable per role like the rest)
  x: ["l", "L"],
  y: ["o", "O"],
  l: ["q", "Q"],
  r: ["e", "E"],
};

const MAPPING_KEY = (role: NesRole) => `clx-nes-keymapping-${role}`;

export function loadKeyMapping(role: NesRole): NesKeyMapping {
  try {
    const raw = localStorage.getItem(MAPPING_KEY(role));
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_KEY_MAPPING, ...parsed };
    }
  } catch {
    // ignore malformed mapping
  }
  return DEFAULT_KEY_MAPPING;
}

export function saveKeyMapping(role: NesRole, mapping: NesKeyMapping): void {
  localStorage.setItem(MAPPING_KEY(role), JSON.stringify(mapping));
}

/**
 * Polls keyboard and the Gamepad API and produces the current 8-bit controller
 * bitmask. Keyboard state is tracked via window listeners; gamepad state is
 * sampled at poll time.
 */
export class NesControllerInput {
  private role: NesRole;
  private mapping: NesKeyMapping;
  private pressed = new Set<string>();
  private turboCounter = 0;

  constructor(role: NesRole) {
    this.role = role;
    this.mapping = loadKeyMapping(role);
  }

  setMapping(mapping: NesKeyMapping): void {
    this.mapping = mapping;
  }

  getMapping(): NesKeyMapping {
    return this.mapping;
  }

  attach(): () => void {
    const onDown = (e: KeyboardEvent) => {
      this.pressed.add(e.key);
    };
    const onUp = (e: KeyboardEvent) => {
      this.pressed.delete(e.key);
    };
    const onBlur = () => this.pressed.clear();
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }

  private keyHeld(keys: string[]): boolean {
    if (!keys || keys.length === 0) return false;
    return keys.some((k) => this.pressed.has(k));
  }

  readBitmask(): number {
    this.turboCounter = (this.turboCounter + 1) % 4;
    // Turbo fires on 2 out of 4 frames (~30Hz toggle at 60fps)
    const turboActive = this.turboCounter < 2;

    let mask = 0;
    if (this.keyHeld(this.mapping.up)) mask |= NES_BIT_UP;
    if (this.keyHeld(this.mapping.down)) mask |= NES_BIT_DOWN;
    if (this.keyHeld(this.mapping.left)) mask |= NES_BIT_LEFT;
    if (this.keyHeld(this.mapping.right)) mask |= NES_BIT_RIGHT;

    // Button A or Turbo A
    const aHeld = this.keyHeld(this.mapping.a);
    const turboAHeld = this.keyHeld(this.mapping.turboA);
    if (aHeld || (turboAHeld && turboActive)) {
      mask |= NES_BIT_A;
    }

    // Button B or Turbo B
    const bHeld = this.keyHeld(this.mapping.b);
    const turboBHeld = this.keyHeld(this.mapping.turboB);
    if (bHeld || (turboBHeld && turboActive)) {
      mask |= NES_BIT_B;
    }

    if (this.keyHeld(this.mapping.select)) mask |= NES_BIT_SELECT;
    if (this.keyHeld(this.mapping.start)) mask |= NES_BIT_START;

    // SNES-only face/shoulder buttons (no-op on NES; extra bits are masked
    // out by the engine before reaching JSNES).
    if (this.keyHeld(this.mapping.x ?? [])) mask |= SNES_BIT_X;
    if (this.keyHeld(this.mapping.y ?? [])) mask |= SNES_BIT_Y;
    if (this.keyHeld(this.mapping.l ?? [])) mask |= SNES_BIT_L;
    if (this.keyHeld(this.mapping.r ?? [])) mask |= SNES_BIT_R;

    // Gamepad API (standard mapping):
    // D-Pad: 12=Up, 13=Down, 14=Left, 15=Right
    // Buttons: 0=A (South), 1=B (East), 2=Turbo B / X (West), 3=Turbo A / Y (North)
    // 8=Select (Back/Share), 9=Start (Options/Menu)
    const pads = typeof navigator !== "undefined" ? navigator.getGamepads?.() : null;
    if (pads) {
      for (const pad of pads) {
        if (!pad || !pad.connected) continue;
        const b = (i: number) => pad.buttons[i]?.pressed ?? false;
        if (b(12)) mask |= NES_BIT_UP;
        if (b(13)) mask |= NES_BIT_DOWN;
        if (b(14)) mask |= NES_BIT_LEFT;
        if (b(15)) mask |= NES_BIT_RIGHT;

        // A & Turbo A
        if (b(0) || (b(3) && turboActive)) mask |= NES_BIT_A;
        // B & Turbo B
        if (b(1) || (b(2) && turboActive)) mask |= NES_BIT_B;

        if (b(8)) mask |= NES_BIT_SELECT;
        if (b(9)) mask |= NES_BIT_START;

        // SNES extras: 2=Y (west), 3=X (north), 4=L, 5=R
        if (b(3)) mask |= SNES_BIT_X;
        if (b(2)) mask |= SNES_BIT_Y;
        if (b(4)) mask |= SNES_BIT_L;
        if (b(5)) mask |= SNES_BIT_R;
      }
    }
    return mask;
  }
}
