// Laya System 1 Decision Engine integration for NES emulation in CLX.
// Uses game profiles for automatic ROM detection and hybrid 60 FPS reflex + strategic policy.

import {
  NES_BIT_A,
  NES_BIT_B,
  NES_BIT_DOWN,
  NES_BIT_LEFT,
  NES_BIT_RIGHT,
  NES_BIT_SELECT,
  NES_BIT_START,
  NES_BIT_UP,
} from "./nes-input";
import {
  ALL_GAME_PROFILES,
  Direction,
  findGameProfile,
  GameProfile,
  GenericProfile,
} from "./nes-game-profiles";

export interface LayaBotStatus {
  enabled: boolean;
  serverOnline: boolean;
  isThinking: boolean;
  latencyMs: number;
  lastAction: string;
  lastJumpProb: number;
  currentMask: number;
  currentMaskP2?: number;
  apiUrl: string;
  profileId: string;
  profileTitle: string;
  targetPlayer: 1 | 2 | 3;
}

export class NesLayaBot {
  private baseUrl = "http://127.0.0.1:8000";
  private enabled = false;
  private isThinking = false;
  private serverOnline = false;
  private latencyMs = 0;
  private lastAction = "IDLE";
  private lastJumpProb = 0;
  private targetPlayer: 1 | 2 | 3 = 1;

  private currentProfile: GameProfile = GenericProfile;
  private currentMaskP1 = 0;
  private currentMaskP2 = 0;

  // Laya Strategic Policy state (updated asynchronously)
  private strategicDirection: Direction = "RIGHT";
  private strategicShouldJump = false;
  private strategicHoldSprintB = false;
  private strategicAutofireB = false;

  // Per-Button Timing Engine (60 FPS tick)
  private jumpState: "IDLE" | "PRESSING" | "COOLDOWN" = "IDLE";
  private jumpFramesLeft = 0;
  private duckFramesLeft = 0;
  private stuckFrames = 0;
  private retreatFrames = 0;
  private lastObservedPos = -1;
  private frameCount = 0;

  public onStatusChange?: (status: LayaBotStatus) => void;

  constructor(initialUrl?: string) {
    if (initialUrl) {
      this.setBaseUrl(initialUrl);
    } else {
      const stored = localStorage.getItem("clx-laya-url");
      if (stored) this.setBaseUrl(stored);
    }

    const savedTarget = localStorage.getItem("clx-laya-target-player");
    if (savedTarget === "2") {
      this.targetPlayer = 2;
    } else if (savedTarget === "3") {
      this.targetPlayer = 3;
    } else {
      this.targetPlayer = 1;
    }
  }

  public getTargetPlayer(): 1 | 2 | 3 {
    return this.targetPlayer;
  }

  public setTargetPlayer(player: 1 | 2 | 3): void {
    this.targetPlayer = player;
    localStorage.setItem("clx-laya-target-player", String(player));
    this.emitStatus();
  }

  public setRom(romName: string, romData?: Uint8Array | null): void {
    const profile = findGameProfile(romName, romData);
    this.currentProfile = profile;
    this.resetTimingState();
    this.lastAction = `LOADED: ${profile.title}`;
    this.emitStatus();
  }

  public getProfile(): GameProfile {
    return this.currentProfile;
  }

  public setProfile(profileId: string): void {
    const found = ALL_GAME_PROFILES.find((p) => p.id === profileId);
    if (found) {
      this.currentProfile = found;
      this.resetTimingState();
      this.lastAction = `SET: ${found.title}`;
      this.emitStatus();
    }
  }

  public getAllProfiles(): GameProfile[] {
    return ALL_GAME_PROFILES;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    let clean = url.trim();
    if (clean.endsWith("/")) clean = clean.slice(0, -1);
    this.baseUrl = clean;
    localStorage.setItem("clx-laya-url", clean);
    void this.checkHealth();
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean): void {
    this.enabled = val;
    if (!val) {
      this.resetTimingState();
      this.lastAction = "IDLE";
    }
    this.emitStatus();
  }

  public getButtonMask(player: 1 | 2 = 1): number {
    if (!this.enabled) return 0;
    return player === 1 ? this.currentMaskP1 : this.currentMaskP2;
  }

  public getStatus(): LayaBotStatus {
    return {
      enabled: this.enabled,
      serverOnline: this.serverOnline,
      isThinking: this.isThinking,
      latencyMs: this.latencyMs,
      lastAction: this.lastAction,
      lastJumpProb: this.lastJumpProb,
      currentMask: this.currentMaskP1,
      currentMaskP2: this.currentMaskP2,
      apiUrl: this.baseUrl,
      profileId: this.currentProfile.id,
      profileTitle: this.currentProfile.title,
      targetPlayer: this.targetPlayer,
    };
  }

  private resetTimingState(): void {
    this.currentMaskP1 = 0;
    this.currentMaskP2 = 0;
    this.currentProfile.resetState?.();
    this.strategicDirection = "RIGHT";
    this.strategicShouldJump = false;
    this.strategicHoldSprintB = false;
    this.strategicAutofireB = false;
    this.jumpState = "IDLE";
    this.jumpFramesLeft = 0;
    this.duckFramesLeft = 0;
    this.stuckFrames = 0;
    this.retreatFrames = 0;
    this.lastObservedPos = -1;
  }

  private emitStatus(): void {
    this.onStatusChange?.(this.getStatus());
  }

  public async checkHealth(): Promise<boolean> {
    const candidates = [this.baseUrl, "http://127.0.0.1:8001", "http://127.0.0.1:8000"];
    const unique = Array.from(new Set(candidates));

    for (const url of unique) {
      try {
        const res = await fetch(`${url}/health`, {
          method: "GET",
          signal: AbortSignal.timeout(800),
        });
        const data = await res.json();
        if (data.status === "ok") {
          // Check if this endpoint has /logs (new service)
          try {
            const logRes = await fetch(`${url}/logs?json=1`, {
              method: "GET",
              signal: AbortSignal.timeout(500),
            });
            if (logRes.ok) {
              this.baseUrl = url;
              this.serverOnline = true;
              this.emitStatus();
              return true;
            }
          } catch {}

          this.baseUrl = url;
          this.serverOnline = true;
          this.emitStatus();
          return true;
        }
      } catch {}
    }

    this.serverOnline = false;
    this.emitStatus();
    return false;
  }

  /**
   * Main per-frame update loop called from emulator tick (~60fps).
   * Runs local reflex loop instantly (0ms) and queries Laya for tactical policy.
   */
  public updateState(ram: Uint8Array | null): void {
    if (!this.enabled || !ram) return;

    this.frameCount++;

    if (this.targetPlayer === 1) {
      this.currentMaskP1 = this.computeSlotMask(0, ram);
      this.currentMaskP2 = 0;
    } else if (this.targetPlayer === 2) {
      this.currentMaskP1 = 0;
      this.currentMaskP2 = this.computeSlotMask(1, ram);
    } else {
      // Dual Auto: Controls both Player 1 and Player 2 simultaneously!
      this.currentMaskP1 = this.computeSlotMask(0, ram);
      this.currentMaskP2 = this.computeSlotMask(1, ram);
    }
  }

  private computeSlotMask(slot: 0 | 1, ram: Uint8Array): number {
    const extracted = this.currentProfile.extractState(ram, this.frameCount, slot);
    if (!extracted) return 0;

    // In-title screen: do not fight or send inputs
    if (extracted.isTitleScreen) {
      // In Battle City title screen: if target is P2 or Dual (3), pulse SELECT then START to boot 2P mode
      if (this.currentProfile.id === "battle_city" && (this.targetPlayer === 2 || this.targetPlayer === 3)) {
        if (slot === 0) {
          const mod = this.frameCount % 90;
          if (mod >= 30 && mod <= 35) return NES_BIT_SELECT;
          if (mod >= 60 && mod <= 65) return NES_BIT_START;
        }
      }
      return 0;
    }

    const reflex = extracted.reflexHint;
    let mask = 0;

    // Battle City custom smooth lane navigator
    if (this.currentProfile.id === "battle_city") {
      const activeDir = reflex?.direction || "UP";
      if (activeDir === "RIGHT") mask |= NES_BIT_RIGHT;
      else if (activeDir === "LEFT") mask |= NES_BIT_LEFT;
      else if (activeDir === "UP") mask |= NES_BIT_UP;
      else if (activeDir === "DOWN") mask |= NES_BIT_DOWN;

      if (reflex?.autofireB && (this.frameCount % 4) < 2) {
        mask |= NES_BIT_B;
      }

      // Background telemetry for slot 0
      if (slot === 0 && !this.isThinking && extracted.state && Object.keys(extracted.state).length > 0) {
        this.dispatchPredict(extracted.state, extracted.questions, ram);
      }
      return mask;
    }

    // 2. Anti-stuck watchdog
    const currentPos =
      extracted.state?.player_y !== undefined && extracted.state?.player_x !== undefined
        ? extracted.state.player_x * 256 + extracted.state.player_y
        : (extracted.state?.player_x ??
          (ram[0x006d] !== undefined ? ram[0x006d] * 256 + ram[0x0086] : -1));

    let stuckJump = false;
    if (currentPos !== -1) {
      if (currentPos === this.lastObservedPos) {
        this.stuckFrames++;
        if (this.stuckFrames > 22 && this.jumpState === "IDLE") {
          stuckJump = true;
          this.stuckFrames = 0;
        } else if (this.stuckFrames > 45) {
          // If stuck for > 45 frames against a tall obstacle, back up slightly
          this.retreatFrames = 14;
          this.stuckFrames = 0;
        }
      } else {
        this.stuckFrames = 0;
        this.lastObservedPos = currentPos;
      }
    }

    // 3. Duck / Crouch reflex (Contra)
    if (reflex?.urgentDuck && this.duckFramesLeft === 0) {
      this.duckFramesLeft = 14;
    }

    // 4. Direction decision (Progression vs Evasion vs Retreat)
    let activeDir: Direction = "RIGHT";

    if (this.retreatFrames > 0) {
      this.retreatFrames--;
      activeDir = "LEFT";
    } else if (this.duckFramesLeft > 0) {
      this.duckFramesLeft--;
      activeDir = "DOWN";
    } else {
      activeDir = reflex?.direction || this.strategicDirection || "RIGHT";
    }

    if (activeDir === "RIGHT") mask |= NES_BIT_RIGHT;
    else if (activeDir === "LEFT") mask |= NES_BIT_LEFT;
    else if (activeDir === "UP") mask |= NES_BIT_UP;
    else if (activeDir === "DOWN") mask |= NES_BIT_DOWN;

    // 5. Button A State Machine (Jump / Missile)
    // Ensures clean 0 -> 1 edge trigger and clean release cooldown so jumps never get stuck
    const wantJump = reflex?.urgentJump || this.strategicShouldJump || stuckJump || reflex?.fireA;

    if (this.jumpState === "IDLE") {
      if (wantJump) {
        this.jumpState = "PRESSING";
        this.jumpFramesLeft = 14; // Hold A for 14 frames for full height
      }
    }

    if (this.jumpState === "PRESSING") {
      mask |= NES_BIT_A;
      this.jumpFramesLeft--;
      if (this.jumpFramesLeft <= 0) {
        this.jumpState = "COOLDOWN";
        this.jumpFramesLeft = 6; // Force release A for at least 6 frames (100ms)
      }
    } else if (this.jumpState === "COOLDOWN") {
      // Crucial: mask does NOT have NES_BIT_A
      this.jumpFramesLeft--;
      if (this.jumpFramesLeft <= 0) {
        this.jumpState = "IDLE";
      }
    }

    // 6. Button B (Sprint in Mario, 15Hz Autofire in Shooters)
    const holdSprint = reflex?.holdSprintB || this.strategicHoldSprintB;
    const autofire = reflex?.autofireB || this.strategicAutofireB;

    if (holdSprint) {
      mask |= NES_BIT_B;
    } else if (autofire) {
      // 15 Hz clean autofire: 2 frames ON, 2 frames OFF
      if ((this.frameCount % 4) < 2) {
        mask |= NES_BIT_B;
      }
    }

    // Non-blocking tactical policy dispatch to Laya for slot 0
    if (slot === 0 && !this.isThinking && extracted.state && Object.keys(extracted.state).length > 0) {
      this.dispatchPredict(extracted.state, extracted.questions, ram);
    }

    return mask;
  }

  private dispatchPredict(
    state: Record<string, any>,
    questions: Record<string, any>,
    ram: Uint8Array,
  ): void {
    this.isThinking = true;
    const startTime = performance.now();

    fetch(`${this.baseUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ state, questions }),
      signal: AbortSignal.timeout(1500),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        this.serverOnline = true;
        this.latencyMs = Math.round(performance.now() - startTime);

        const result = this.currentProfile.mapDecisionToBitmask(
          data,
          ram,
          this.frameCount,
        );

        this.lastAction = result.actionLabel;
        this.lastJumpProb = result.jumpProb ?? 0;
        this.strategicDirection = result.direction || "RIGHT";
        this.strategicShouldJump = !!result.shouldJump;
        this.strategicHoldSprintB = !!result.holdSprintB;
        this.strategicAutofireB = !!result.autofireB;

        this.emitStatus();
      })
      .catch(() => {
        this.serverOnline = false;
        this.emitStatus();
      })
      .finally(() => {
        this.isThinking = false;
      });
  }
}
