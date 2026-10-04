// Game Profiles for NES AI Bot — extracts RAM state and translates Laya decisions
// Supports: Super Mario Bros, Contra (all variants / Super C / Probotector), Jackal (Top Gunner), Generic Fallback.

import {
  NES_BIT_A,
  NES_BIT_B,
  NES_BIT_DOWN,
  NES_BIT_LEFT,
  NES_BIT_RIGHT,
  NES_BIT_UP,
} from "./nes-input";

export type Direction = "RIGHT" | "LEFT" | "UP" | "DOWN" | "NONE";

export interface ReflexHint {
  urgentJump?: boolean;
  urgentDuck?: boolean;
  autofireB?: boolean;
  holdSprintB?: boolean;
  fireA?: boolean;
  direction?: Direction;
}

export interface GameDecisionResult {
  actionLabel: string;
  direction?: Direction;
  shouldJump?: boolean;
  jumpProb?: number;
  holdSprintB?: boolean;
  autofireB?: boolean;
  mask: number; // Fallback legacy bitmask
}

export interface GameProfile {
  id: string;
  title: string;
  matches(romName: string, romData?: Uint8Array | null): boolean;
  extractState(
    ram: Uint8Array,
    frameCount: number,
    playerSlot?: 0 | 1,
  ): {
    state: Record<string, any>;
    questions: Record<string, any>;
    isTitleScreen?: boolean;
    reflexHint?: ReflexHint;
  } | null;
  mapDecisionToBitmask(
    data: any,
    ram: Uint8Array,
    frameCount: number,
    playerSlot?: 0 | 1,
  ): GameDecisionResult;
  resetState?(): void;
}

// ─────────────────────────────────────────────────────────────
// 1. SUPER MARIO BROS PROFILE
// ─────────────────────────────────────────────────────────────
export const MarioProfile: GameProfile = {
  id: "mario",
  title: "Super Mario Bros",
  matches(romName: string) {
    const s = romName.toLowerCase();
    return s.includes("mario") || s.includes("smb");
  },
  extractState(ram: Uint8Array, _frameCount: number) {
    const gameMode = ram[0x0770];
    if (gameMode === 0) {
      return { state: {}, questions: {}, isTitleScreen: true };
    }

    // Mario World coordinates: page (0x006D) * 256 + sub-page X (0x0086)
    const marioWorldX = (ram[0x006d] || 0) * 256 + (ram[0x0086] || 0);
    const marioY = ram[0x00ce] || 0;
    const isGrounded = ram[0x001d] === 0;

    let closestEnemyDist = 999;
    let enemyDanger = false;

    // Mario 5 active enemy slots (0x000F..0x0013)
    for (let slot = 0; slot < 5; slot++) {
      const active = ram[0x000f + slot] !== 0;
      const state = ram[0x001e + slot]; // < 0x20 is alive/threatening
      if (!active || state >= 0x20) continue;

      const eWorldX = (ram[0x006e + slot] || 0) * 256 + (ram[0x0087 + slot] || 0);
      const eY = ram[0x00cf + slot] || 0;
      const distX = eWorldX - marioWorldX;

      if (distX > 0 && distX < closestEnemyDist) {
        closestEnemyDist = distX;
        const distY = Math.abs(eY - marioY);
        if (distX < 60 && distY < 36) {
          enemyDanger = true;
        }
      }
    }

    const state = {
      on_ground: isGrounded,
      enemy_distance: Math.min(255, closestEnemyDist),
      enemy_danger: enemyDanger,
    };

    const questions = {
      tactics: {
        type: "choice",
        instructions: "Mario movement tactics",
        criteria: {
          SPRINT_FORWARD: "sprint right towards the goal",
          CAREFUL_ADVANCE: "advance right with caution",
          FALL_BACK: "retreat left away from danger",
        },
      },
      jump: {
        type: "noul",
        instructions: "Jump over upcoming obstacle or enemy",
      },
    };

    const reflexHint: ReflexHint = {
      urgentJump: isGrounded && (enemyDanger || closestEnemyDist < 58),
      holdSprintB: true,
      direction: "RIGHT",
    };

    return { state, questions, reflexHint };
  },
  mapDecisionToBitmask(data: any) {
    const tactics = data?.answers?.tactics?.choice || "SPRINT_FORWARD";
    const jumpProb = Number(data?.answers?.jump?.noul ?? 0);
    const shouldJump = jumpProb > 0.35;
    const direction: Direction = tactics === "FALL_BACK" ? "LEFT" : "RIGHT";

    return {
      actionLabel: tactics === "FALL_BACK" ? "RETREAT" : "SPRINT",
      direction,
      shouldJump,
      jumpProb,
      holdSprintB: true,
      mask: direction === "LEFT" ? NES_BIT_LEFT : (NES_BIT_RIGHT | NES_BIT_B),
    };
  },
};

// ─────────────────────────────────────────────────────────────
// 2. CONTRA (CLASSIC / PROBOTECTOR)
// ─────────────────────────────────────────────────────────────
export const ContraProfile: GameProfile = {
  id: "contra",
  title: "Contra (NES)",
  matches(romName: string) {
    const s = romName.toLowerCase();
    const isSuper =
      s.includes("super c") ||
      s.includes("super contra") ||
      s.includes("super-c") ||
      s.includes("probotector ii") ||
      s.includes("probotector 2");
    return (s.includes("contra") || s.includes("probotector")) && !isSuper;
  },
  extractState(ram: Uint8Array) {
    const p1X = ram[0x0334] || 0;
    const p1Y = ram[0x031a] || 0;

    let closestEnemyDist = 999;
    let bulletDanger = false;

    // Contra RAM: 16 enemy/bullet slots at 0x033E..0x034D (X) and 0x0324..0x0333 (Y)
    for (let slot = 0; slot < 16; slot++) {
      if (ram[0x030a + slot] === 0) continue;
      const eX = ram[0x033e + slot];
      const eY = ram[0x0324 + slot];
      const dx = eX - p1X;
      const dy = Math.abs(eY - p1Y);

      if (dx > -25 && dx < closestEnemyDist) {
        if (dx > 0) closestEnemyDist = dx;
        if (Math.abs(dx) < 65 && dy < 35) {
          bulletDanger = true;
        }
      }
    }

    const state = {
      player_x: p1X,
      player_y: p1Y,
      threat_distance: Math.min(255, closestEnemyDist),
      under_fire: bulletDanger,
    };

    const questions = {
      posture: {
        type: "choice",
        instructions: "Combat tactical posture in Contra",
        criteria: {
          ASSAULT: "advance right firing heavy weapons",
          PRONE_FIRE: "duck down to evade bullets",
          TACTICAL_RETREAT: "move left to create distance",
        },
      },
      evasion: {
        type: "noul",
        instructions: "Perform combat jump to clear obstacles or fire",
      },
    };

    const reflexHint: ReflexHint = {
      autofireB: true,
      urgentJump: bulletDanger,
      urgentDuck: bulletDanger && closestEnemyDist < 40,
      direction: "RIGHT",
    };

    return { state, questions, reflexHint };
  },
  mapDecisionToBitmask(data: any) {
    const posture = data?.answers?.posture?.choice || "ASSAULT";
    const jumpProb = Number(data?.answers?.evasion?.noul ?? 0);
    const shouldJump = jumpProb > 0.30;

    let direction: Direction = "RIGHT";
    if (posture === "PRONE_FIRE") {
      direction = "DOWN";
    } else if (posture === "TACTICAL_RETREAT") {
      direction = "LEFT";
    }

    return {
      actionLabel: posture,
      direction,
      shouldJump,
      jumpProb,
      autofireB: true,
      mask: direction === "DOWN" ? NES_BIT_DOWN : (direction === "LEFT" ? NES_BIT_LEFT : NES_BIT_RIGHT),
    };
  },
};

// ─────────────────────────────────────────────────────────────
// 3. SUPER CONTRA (SUPER C)
// ─────────────────────────────────────────────────────────────
export const SuperContraProfile: GameProfile = {
  id: "super_c",
  title: "Super C / Super Contra",
  matches(romName: string) {
    const s = romName.toLowerCase();
    return (
      s.includes("super c") ||
      s.includes("super contra") ||
      s.includes("super-c") ||
      s.includes("probotector ii") ||
      s.includes("probotector 2")
    );
  },
  extractState(ram: Uint8Array) {
    const p1X = ram[0x00cc] || ram[0x054c] || 0;
    const p1Y = ram[0x00ce] || ram[0x0532] || 0;

    let threatDist = 999;
    let bulletDanger = false;

    // Scan enemy and bullet slots
    for (let slot = 0; slot < 14; slot++) {
      if (ram[0x0518 + slot] === 0) continue;
      const eX = ram[0x053c + slot];
      const eY = ram[0x0522 + slot];
      const dx = eX - p1X;
      const dy = Math.abs(eY - p1Y);

      if (dx > -20 && dx < threatDist) {
        if (dx > 0) threatDist = dx;
        if (Math.abs(dx) < 65 && dy < 38) {
          bulletDanger = true;
        }
      }
    }

    const state = {
      player_x: p1X,
      player_y: p1Y,
      threat_distance: Math.min(255, threatDist),
      under_fire: bulletDanger,
    };

    const questions = {
      tactics: {
        type: "choice",
        instructions: "Tactical movement in Super Contra",
        criteria: {
          RUSH_FIRE: "charge forward firing main weapon",
          PRONE_DEFENSE: "crouch down to avoid incoming shots",
          FALLBACK: "move back to widen firing angle",
        },
      },
      jump: {
        type: "noul",
        instructions: "Jump over bullets or platform gaps",
      },
    };

    const reflexHint: ReflexHint = {
      autofireB: true,
      urgentJump: bulletDanger,
      direction: "RIGHT",
    };

    return { state, questions, reflexHint };
  },
  mapDecisionToBitmask(data: any) {
    const tactics = data?.answers?.tactics?.choice || "RUSH_FIRE";
    const jumpProb = Number(data?.answers?.jump?.noul ?? 0);
    const shouldJump = jumpProb > 0.30;

    let direction: Direction = "RIGHT";
    if (tactics === "PRONE_DEFENSE") direction = "DOWN";
    else if (tactics === "FALLBACK") direction = "LEFT";

    return {
      actionLabel: tactics,
      direction,
      shouldJump,
      jumpProb,
      autofireB: true,
      mask: direction === "DOWN" ? NES_BIT_DOWN : (direction === "LEFT" ? NES_BIT_LEFT : NES_BIT_RIGHT),
    };
  },
};

// ─────────────────────────────────────────────────────────────
// 4. JACKAL / TOP GUNNER / XE JEEP
// ─────────────────────────────────────────────────────────────
export const JackalProfile: GameProfile = {
  id: "jackal",
  title: "Jackal (Xe Jeep)",
  matches(romName: string) {
    const s = romName.toLowerCase();
    return (
      s.includes("jackal") ||
      s.includes("top gunner") ||
      s.includes("akai yousai") ||
      s.includes("red fortress")
    );
  },
  extractState(ram: Uint8Array) {
    const jeepY = ram[0x0560] || 0;
    const jeepX = ram[0x05a0] || 0;

    let closestEnemyDist = 999;
    let enemyDirectAhead = false;

    // Scan Jackal enemy slots (31 active slots)
    for (let slot = 1; slot < 32; slot++) {
      if (ram[0x0500 + slot] === 0) continue;
      const eY = ram[0x0560 + slot];
      const eX = ram[0x05a0 + slot];
      const dy = eY - jeepY;
      const dx = eX - jeepX;
      const dist = Math.hypot(dx, dy);

      if (dist < closestEnemyDist) {
        closestEnemyDist = dist;
        // Bunkers / tanks in direct line of fire ahead
        if (Math.abs(dx) < 24 && dy < 0 && Math.abs(dy) < 90) {
          enemyDirectAhead = true;
        }
      }
    }

    const state = {
      jeep_x: jeepX,
      jeep_y: jeepY,
      enemy_distance: Math.round(Math.min(255, closestEnemyDist)),
      bunker_targeted: enemyDirectAhead,
    };

    const questions = {
      drive: {
        type: "choice",
        instructions: "Steering direction for Jackal rescue jeep",
        criteria: {
          UP: "advance north deeper into enemy territory",
          LEFT: "dodge left past obstacles and gunfire",
          RIGHT: "dodge right past obstacles and gunfire",
          DOWN: "retreat south to clear cluster",
        },
      },
      missile: {
        type: "noul",
        instructions: "Fire heavy grenade or missile at bunker or armored vehicle",
      },
    };

    const reflexHint: ReflexHint = {
      autofireB: true,
      fireA: enemyDirectAhead,
      direction: "UP",
    };

    return { state, questions, reflexHint };
  },
  mapDecisionToBitmask(data: any) {
    const drive = data?.answers?.drive?.choice || "UP";
    const missileProb = Number(data?.answers?.missile?.noul ?? 0);
    const shouldFireA = missileProb > 0.35;

    let direction: Direction = "UP";
    if (drive === "LEFT") direction = "LEFT";
    else if (drive === "RIGHT") direction = "RIGHT";
    else if (drive === "DOWN") direction = "DOWN";

    let mask = 0;
    if (direction === "UP") mask |= NES_BIT_UP;
    else if (direction === "DOWN") mask |= NES_BIT_DOWN;
    else if (direction === "LEFT") mask |= NES_BIT_LEFT;
    else if (direction === "RIGHT") mask |= NES_BIT_RIGHT;

    return {
      actionLabel: drive,
      direction,
      shouldJump: shouldFireA, // Reuses A button pulse
      jumpProb: missileProb,
      autofireB: true,
      mask,
    };
  },
};

// ─────────────────────────────────────────────────────────────
// 5. BATTLE CITY / TANK 1990
// ─────────────────────────────────────────────────────────────
function isBattleCityTerrainBlocked(
  ram: Uint8Array,
  x: number,
  y: number,
  canBreakSteel = false,
  hasBoat = false,
): boolean {
  if (x < 24 || x > 216 || y < 24 || y > 216) return true;
  const cols = [x >> 3, (x + 15) >> 3];
  const rows = [y >> 3, (y + 15) >> 3];
  for (const r of rows) {
    for (const c of cols) {
      if (r < 0 || r >= 30 || c < 0 || c >= 32) return true;
      const tile = ram[0x0400 + r * 32 + c];
      // Stone / Steel / Đá (0x10, 0x20, 0x14..0x1f)
      if (!canBreakSteel && (tile === 0x10 || tile === 0x20 || (tile >= 0x14 && tile <= 0x1f))) {
        return true;
      }
      // Water / Nước (0x12, 0x13) - impassable without boat
      if (!hasBoat && (tile === 0x12 || tile === 0x13)) {
        return true;
      }
      // Eagle base / Đại bàng (0xc8..0xcb)
      if (tile >= 0xc8 && tile <= 0xcb) {
        return true;
      }
    }
  }
  return false;
}

function hasBrickAhead(ram: Uint8Array, x: number, y: number, dir: Direction): boolean {
  let cx = x;
  let cy = y;
  if (dir === "UP") cy = y - 4;
  else if (dir === "DOWN") cy = y + 17;
  else if (dir === "LEFT") cx = x - 4;
  else if (dir === "RIGHT") cx = x + 17;
  if (cx < 24 || cx > 216 || cy < 24 || cy > 216) return false;
  const cols = [cx >> 3, (cx + 15) >> 3];
  const rows = [cy >> 3, (cy + 15) >> 3];
  for (const r of rows) {
    for (const c of cols) {
      if (r < 0 || r >= 30 || c < 0 || c >= 32) continue;
      const tile = ram[0x0400 + r * 32 + c];
      if (tile >= 0x01 && tile <= 0x0f) return true;
    }
  }
  return false;
}

interface BattleCityNavState {
  currentDir: Direction;
  holdDirFrames: number;
  lastX: number;
  lastY: number;
  stuckFrames: number;
}

const bcNavStates: [BattleCityNavState, BattleCityNavState] = [
  { currentDir: "UP", holdDirFrames: 0, lastX: -1, lastY: -1, stuckFrames: 0 },
  { currentDir: "UP", holdDirFrames: 0, lastX: -1, lastY: -1, stuckFrames: 0 },
];

export const BattleCityProfile: GameProfile = {
  id: "battle_city",
  title: "Battle City / Tank 1990",
  matches(romName: string) {
    const s = romName.toLowerCase();
    return (
      s.includes("battle city") ||
      s.includes("battlecity") ||
      s.includes("tank 1990") ||
      s.includes("tank1990") ||
      s.includes("tank")
    );
  },
  resetState() {
    bcNavStates[0] = { currentDir: "UP", holdDirFrames: 0, lastX: -1, lastY: -1, stuckFrames: 0 };
    bcNavStates[1] = { currentDir: "UP", holdDirFrames: 0, lastX: -1, lastY: -1, stuckFrames: 0 };
  },
  extractState(ram: Uint8Array, frameCount: number, playerSlot: 0 | 1 = 0) {
    const p1X = ram[0x0090] || 0;
    const p1Y = ram[0x0098] || 0;
    const stage = ram[0x0085] || 0;

    // Title / Stage Intermission: stage > 35 or menu cursor at (72, 139)
    const isTitle = stage > 35 || (p1X === 72 && p1Y === 139);
    if (isTitle) {
      return { state: {}, questions: {}, isTitleScreen: true };
    }

    const slot = playerSlot ?? 0;
    const nav = bcNavStates[slot];

    const posX = ram[0x0090 + slot] || 0;
    const posY = ram[0x0098 + slot] || 0;
    const stat = ram[0x00a0 + slot] || 0;
    const isAlive = stat >= 0x80 && stat < 0xe0;

    if (!isAlive) {
      return {
        state: { player_x: posX, player_y: posY },
        questions: {},
        reflexHint: { direction: "UP", autofireB: false },
      };
    }

    const tankTier = ram[0x00a8 + slot] || 0; // 0x60 = 3-star tier (pierces steel)
    const canBreakSteel = (tankTier & 0xf0) >= 0x60;

    // 1. Powerup Event detection ($88 < 0x80 and $86 > 0)
    const hasItem = ram[0x0088] < 0x80 && ram[0x0086] > 0;
    const itemX = ram[0x0086];
    const itemY = ram[0x0087];
    const itemType = ram[0x0088]; // 0:Grenade, 1:Clock, 2:Shovel, 3:Star, 4:Helmet, 5:Tank, 6:Gun, 7:Boat

    // 2. Scan active enemies (slots 2..7)
    let closestEnemyDist = 999;
    let targetEnemy: { x: number; y: number } | null = null;
    let eagleThreat = false;
    let alignedShoot = false;

    for (let s = 2; s <= 7; s++) {
      const eStat = ram[0x00a0 + s];
      if (eStat >= 0x80 && eStat < 0xe0) {
        const eX = ram[0x0090 + s];
        const eY = ram[0x0098 + s];
        const dist = Math.hypot(eX - posX, eY - posY);

        if (eY > 140) eagleThreat = true;

        if (dist < closestEnemyDist) {
          closestEnemyDist = dist;
          targetEnemy = { x: eX, y: eY };
        }

        if (Math.abs(eX - posX) <= 8 || Math.abs(eY - posY) <= 8) {
          alignedShoot = true;
        }
      }
    }

    // 3. Bullet evasion (reflex dodge perpendicular to incoming bullets)
    let dodgeDir: Direction = "NONE";
    const step = 4;
    for (let b = 2; b <= 7; b++) {
      if ((ram[0x00cc + b] & 0xf0) === 0x40) {
        const bx = ram[0x00b8 + b];
        const by = ram[0x00c2 + b];
        const dx = bx - posX;
        const dy = by - posY;
        if (Math.abs(dx) < 12 && dy > -60 && dy < 0) {
          if (!isBattleCityTerrainBlocked(ram, posX + step, posY, canBreakSteel)) dodgeDir = "RIGHT";
          else if (!isBattleCityTerrainBlocked(ram, posX - step, posY, canBreakSteel)) dodgeDir = "LEFT";
        } else if (Math.abs(dy) < 12 && Math.abs(dx) < 60) {
          if (!isBattleCityTerrainBlocked(ram, posX, posY + step, canBreakSteel)) dodgeDir = "DOWN";
          else if (!isBattleCityTerrainBlocked(ram, posX, posY - step, canBreakSteel)) dodgeDir = "UP";
        }
      }
    }

    // 4. Target Selection: Powerup Item has top priority!
    let target: { x: number; y: number; isItem?: boolean } | null = null;
    if (hasItem) {
      target = { x: itemX, y: itemY, isItem: true };
    } else if (targetEnemy) {
      target = targetEnemy;
    }

    // 5. Anti-stuck watchdog tracking
    if (posX === nav.lastX && posY === nav.lastY) {
      nav.stuckFrames++;
    } else {
      nav.stuckFrames = 0;
      nav.lastX = posX;
      nav.lastY = posY;
    }

    // 6. Lane-Aligned Smooth Navigation (eliminates jitter & avoids stone/water)
    if (dodgeDir !== "NONE") {
      nav.currentDir = dodgeDir;
      nav.holdDirFrames = 8;
    } else if (nav.holdDirFrames > 0 && nav.stuckFrames < 8) {
      nav.holdDirFrames--;
    } else if (target) {
      const dx = target.x - posX;
      const dy = target.y - posY;

      // Line-of-sight combat alignment
      if (!target.isItem && Math.abs(dx) <= 6) {
        nav.currentDir = dy < 0 ? "UP" : "DOWN";
        nav.holdDirFrames = 12;
      } else if (!target.isItem && Math.abs(dy) <= 6) {
        nav.currentDir = dx < 0 ? "LEFT" : "RIGHT";
        nav.holdDirFrames = 12;
      } else {
        const alignedX = posX % 8 === 0;
        const alignedY = posY % 8 === 0;

        const wantPrimary: Direction =
          Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "LEFT" : "RIGHT") : (dy < 0 ? "UP" : "DOWN");
        const wantSecondary: Direction =
          wantPrimary === "LEFT" || wantPrimary === "RIGHT" ? (dy < 0 ? "UP" : "DOWN") : (dx < 0 ? "LEFT" : "RIGHT");

        const canMove = (d: Direction) => {
          let nx = posX;
          let ny = posY;
          if (d === "UP") ny -= step;
          else if (d === "DOWN") ny += step;
          else if (d === "LEFT") nx -= step;
          else if (d === "RIGHT") nx += step;
          return !isBattleCityTerrainBlocked(ram, nx, ny, canBreakSteel);
        };

        if (nav.stuckFrames > 16) {
          const alts: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"];
          for (const d of alts) {
            if (canMove(d) && d !== nav.currentDir) {
              nav.currentDir = d;
              nav.holdDirFrames = 15;
              break;
            }
          }
          nav.stuckFrames = 0;
        } else if (canMove(wantPrimary)) {
          const isHoriz = wantPrimary === "LEFT" || wantPrimary === "RIGHT";
          if ((isHoriz && alignedY) || (!isHoriz && alignedX) || nav.currentDir === wantPrimary) {
            nav.currentDir = wantPrimary;
            nav.holdDirFrames = 10;
          } else if (canMove(nav.currentDir)) {
            // Keep current direction until grid snapped to turn cleanly
          } else if (canMove(wantSecondary)) {
            nav.currentDir = wantSecondary;
            nav.holdDirFrames = 10;
          }
        } else if (canMove(wantSecondary)) {
          nav.currentDir = wantSecondary;
          nav.holdDirFrames = 10;
        } else if (hasBrickAhead(ram, posX, posY, wantPrimary)) {
          // Face brick wall and shoot to blast open a passage
          nav.currentDir = wantPrimary;
        }
      }
    }

    const state = {
      player_x: posX,
      player_y: posY,
      slot,
      enemy_distance: Math.round(Math.min(255, closestEnemyDist)),
      powerup_active: hasItem,
      powerup_type: hasItem ? itemType : -1,
      defend_eagle: eagleThreat,
      aligned: alignedShoot,
    };

    const questions = {
      command: {
        type: "choice",
        instructions: "Tactical tank maneuver in Battle City",
        criteria: {
          EAT_BONUS: "rush towards bonus item or power-up drop",
          HUNT: "engage closest enemy tank directly",
          DEFEND: "guard the base eagle from incoming tanks",
          EVADE: "dodge enemy artillery shells",
        },
      },
    };

    const reflexHint: ReflexHint = {
      autofireB: true,
      direction: nav.currentDir,
    };

    return { state, questions, reflexHint };
  },
  mapDecisionToBitmask(data: any) {
    const cmd = data?.answers?.command?.choice || "HUNT";
    return {
      actionLabel: cmd,
      autofireB: true,
      mask: NES_BIT_B,
    };
  },
};

// ─────────────────────────────────────────────────────────────
// 6. GENERIC FALLBACK PROFILE
// ─────────────────────────────────────────────────────────────
export const GenericProfile: GameProfile = {
  id: "generic",
  title: "Generic NES Game",
  matches() {
    return true;
  },
  extractState(_ram: Uint8Array, frameCount: number) {
    // Pure fallback: does NOT trigger title screen or spam START
    const state = { frame_cycle: frameCount % 60 };
    const questions = {
      action: {
        type: "choice",
        instructions: "General control action",
        criteria: {
          RIGHT: "move forward right",
          LEFT: "move back left",
          ATTACK: "press attack fire",
        },
      },
    };
    return { state, questions, reflexHint: { autofireB: true, direction: "RIGHT" } };
  },
  mapDecisionToBitmask(data: any) {
    const action = data?.answers?.action?.choice || "RIGHT";
    const direction: Direction = action === "LEFT" ? "LEFT" : "RIGHT";

    return {
      actionLabel: action,
      direction,
      autofireB: true,
      mask: direction === "LEFT" ? NES_BIT_LEFT : NES_BIT_RIGHT,
    };
  },
};

export const ALL_GAME_PROFILES: GameProfile[] = [
  MarioProfile,
  ContraProfile,
  SuperContraProfile,
  JackalProfile,
  BattleCityProfile,
  GenericProfile,
];

export function findGameProfile(
  romName: string,
  romData?: Uint8Array | null,
): GameProfile {
  for (const p of ALL_GAME_PROFILES) {
    if (p.id !== "generic" && p.matches(romName, romData)) {
      return p;
    }
  }
  return GenericProfile;
}
