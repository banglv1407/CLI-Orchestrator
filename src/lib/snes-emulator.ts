// Local SNES emulator engine — drives an EmulatorJS RetroArch snes9x WASM core
// behind the same surface the NES panel already understands (loadRom, start/
// pause/resume/reset, setPlayerInput two controllers, manual mode, serialize).
// The EJS render surface mounts as an overlay exactly above the panel canvas,
// so the workspace UI stays identical between NES and SNES.
//
// Input bits follow the shared controller layout in nes-input.ts: the low
// eight bits are the classic NES layout; SNES adds X/Y/L/R in bits 8-11.
//
// ponytail: EmulatorJS has no official frame-step API, so SNES netplay runs
// its core in realtime while the lockstep clock paces input exchange at 60 Hz;
// true frame-stepping needs a core with a public step function — upgrade path
// is pinning a patched snes9x wasm build in the clx.snes pack.

const SNES_FRAMERATE = 60;

/** Shared-controller bit -> RetroArch joypad id (libretro). */
export const BIT_TO_RETROARCH_BUTTON: Record<number, number> = {
  0x001: 4, // Up
  0x002: 5, // Down
  0x004: 6, // Left
  0x008: 7, // Right
  0x010: 8, // A (east on pad = RETRO A)
  0x020: 0, // B (south on pad = RETRO B)
  0x040: 2, // Select
  0x080: 3, // Start
  0x100: 9, // X (north)
  0x200: 1, // Y (west)
  0x400: 10, // L shoulder
  0x800: 11, // R shoulder
};

/** Upper bound for a plausible SNES state payload (real: ~823 KB). */
const SNES_STATE_MAX_BYTES = 8 * 1024 * 1024;
/** Floor for the DECODED size — snes9x states are always ~700 KB+, so
 *  anything smaller than 64 KB is garbage, not a legitimate state. */
const SNES_STATE_MIN_BYTES = 64 * 1024;

export interface SnesEmulatorEvents {
  onFrame?: () => void;
  onStatus?: (status: string) => void;
}

interface EjsEmulatorLike {
  started?: boolean;
  controls?: Record<number, Record<number, unknown>>;
  paused?: boolean;
  pause?: () => void;
  play?: () => void;
  audioContext?: { resume?: () => Promise<void> } | null;
  gameManager?: {
    restart?: () => void;
    simulateInput?: (player: number, index: number, value: number) => void;
    getState?: () => Uint8Array | Promise<Uint8Array>;
    loadState?: (data: Uint8Array) => void;
  } | null;
}

export class SnesEmulator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private events: SnesEmulatorEvents;

  private container: HTMLDivElement | null = null;
  private romUrl: string | null = null;
  private started = false;
  private paused = false;
  private manualMode = false;

  private playerMasks: [number, number] = [0, 0];
  private appliedMasks: [number, number] = [-1, -1];

  constructor(canvas: HTMLCanvasElement, events: SnesEmulatorEvents = {}) {
    this.canvas = canvas;
    this.events = events;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    this.clearCanvas();
  }

  private get ejs(): EjsEmulatorLike | null {
    return (
      ((window as unknown as Record<string, unknown>)
        .EJS_emulator as EjsEmulatorLike) ?? null
    );
  }

  /**
   * Boot the snes9x core with this ROM. The EmulatorJS surface is mounted as
   * an overlay filling the canvas parent so gameplay appears exactly where
   * the NES picture would. Resolves once the core has started.
   */
  async loadRomAsync(
    bytes: Uint8Array,
    dataRoot = "/snes/data/",
  ): Promise<void> {
    // Mount into the game stage (canvas's grandparent) — the flex-centered
    // container — so EmulatorJS fills and centers like the NES canvas does.
    const stage = this.canvas.parentElement?.parentElement;
    if (!stage) throw new Error("SNES canvas has no stage container");

    this.teardownOverlay();
    const container = document.createElement("div");
    container.id = "clx-snes-ejs";
    container.style.cssText =
      "position:absolute;inset:8px;z-index:5;background:#000;display:flex;align-items:center;justify-content:center;";
    stage.appendChild(container);
    this.container = container;

    const w = window as unknown as Record<string, unknown>;
    w.EJS_player = "#clx-snes-ejs";
    w.EJS_core = "snes9x";
    w.EJS_pathtodata = dataRoot;
    // Revoke the previous ROM blob — EJS consumed it at first launch, a stale
    // object URL would hold up to 16 MiB of ROM memory per reload.
    if (this.romUrl) URL.revokeObjectURL(this.romUrl);
    this.romUrl = URL.createObjectURL(new Blob([bytes as BlobPart]));
    w.EJS_gameUrl = this.romUrl;
    w.EJS_startOnLoaded = true;
    w.EJS_alignStartButton = "center";
    // CLX already maps keyboard/gamepad input for solo and netplay. A second
    // mapping here bypasses remaps and makes A/S press X/Y while moving.
    w.EJS_defaultControls = { 0: {}, 1: {}, 2: {}, 3: {} };
    w.EJS_onGameStart = () => {
      // EmulatorJS restores its saved controls during startGame, after reading
      // the defaults. Clear that restored mapping too, without touching CLX's.
      const emu = this.ejs;
      if (emu) emu.controls = { 0: {}, 1: {}, 2: {}, 3: {} };
    };
    w.EJS_Buttons = {
      playPause: false,
      restart: false,
      mute: false,
      settings: false,
      fullscreen: false,
      saveState: false,
      loadState: false,
      screenRecord: false,
      gamepad: false,
      cheat: false,
      volume: false,
      saveSavFiles: false,
      loadSavFiles: false,
      exitEmulation: false,
    };
    w.EJS_ready = () => {
      window.setTimeout(() => {
        container
          .querySelector(".ejs_start_button")
          ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }, 50);
    };

    await new Promise<void>((resolve, reject) => {
      const loader = document.createElement("script");
      loader.src = `${dataRoot}loader.js`;
      loader.onerror = () =>
        reject(new Error("SNES runtime failed to download"));
      document.body.appendChild(loader);

      const deadline = Date.now() + 30000;
      const poll = window.setInterval(() => {
        const emu = this.ejs;
        if (emu?.started && emu.gameManager) {
          window.clearInterval(poll);
          resolve();
        } else if (Date.now() > deadline) {
          window.clearInterval(poll);
          reject(new Error("SNES core boot timed out"));
        }
      }, 250);
    });

    this.started = true;
    this.paused = false;
    this.appliedMasks = [-1, -1];
    this.applyInputs();
    this.events.onStatus?.("SNES core ready");
  }

  /** True once the core is live; the panel gates run/pause on this. */
  get ready(): boolean {
    return this.started;
  }

  setPlayerInput(player: number, mask: number): void {
    if (player === 1) this.playerMasks[0] = mask & 0xfff;
    else if (player === 2) this.playerMasks[1] = mask & 0xfff;
    this.applyInputs();
  }

  private applyInputs(): void {
    if (!this.started) return;
    const gm = this.ejs?.gameManager;
    if (!gm?.simulateInput) return;
    for (const p of [0, 1] as const) {
      const mask = this.playerMasks[p];
      if (mask === this.appliedMasks[p]) continue;
      for (const [bit, raId] of Object.entries(BIT_TO_RETROARCH_BUTTON)) {
        try {
          gm.simulateInput(p, raId, (mask & Number(bit)) !== 0 ? 1 : 0);
        } catch {
          /* core not booted yet */
        }
      }
      this.appliedMasks[p] = mask;
    }
  }

  start(): void {
    void this.resume();
  }

  pause(): void {
    if (!this.started || this.paused) return;
    this.paused = true;
    try {
      this.ejs?.pause?.();
    } catch {
      /* noop */
    }
  }

  async resume(): Promise<void> {
    if (!this.started || !this.paused) return;
    this.paused = false;
    try {
      this.ejs?.play?.();
      await this.ejs?.audioContext?.resume?.();
    } catch {
      /* noop */
    }
  }

  reset(): void {
    try {
      this.ejs?.gameManager?.restart?.();
    } catch {
      /* noop */
    }
  }

  startManual(): void {
    this.manualMode = true;
    this.paused = false;
    this.events.onFrame?.();
  }

  /**
   * Lockstep hook. The snes9x core advances in realtime, so this applies the
   * agreed inputs immediately; the netplay clock keeps exchange pacing.
   */
  stepFrame(player1Mask: number, player2Mask: number): void {
    if (!this.started || this.paused) return;
    this.playerMasks[0] = player1Mask & 0xfff;
    this.playerMasks[1] = player2Mask & 0xfff;
    this.appliedMasks = [-1, -1];
    this.applyInputs();
    this.events.onFrame?.();
  }

  /**
   * Sync snapshot used by the netplay hash. EmulatorJS getState() is
   * synchronous on 4.2.3; a Promise-returning core is skipped this tick.
   */
  serialize(): string {
    try {
      const raw = this.ejs?.gameManager?.getState?.();
      if (!raw) return "";
      const state = raw instanceof Uint8Array ? raw : null;
      if (!state) return ""; // pending promise — skip this tick
      return this.stateToBase64(state);
    } catch {
      return "";
    }
  }

  /**
   * Async save used by the UI. Some cores return a Promise from getState() —
   * await it before handing the snapshot to the backend, and never let a
   * failure masquerade as a successful save.
   */
  async serializeAsync(): Promise<string> {
    try {
      const raw = this.ejs?.gameManager?.getState?.();
      if (!raw) return "";
      const state = raw instanceof Uint8Array ? raw : await raw;
      if (!(state instanceof Uint8Array) || state.length === 0) return "";
      return this.stateToBase64(state);
    } catch {
      return "";
    }
  }

  private stateToBase64(state: Uint8Array): string {
    let bin = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < state.length; i += CHUNK) {
      bin += String.fromCharCode(...state.subarray(i, i + CHUNK));
    }
    return JSON.stringify({ t: "clx-snes-state-v1", d: btoa(bin) });
  }

  /**
   * Restore a previously saved snapshot. Returns true on success. The
   * envelope and payload size are validated BEFORE the bytes reach the WASM
   * core — a truncated/garbage state fed to loadState can hang the core,
   * which on the desktop WebView reads as a frozen machine.
   */
  deserialize(snapshot: string): boolean {
    try {
      const parsed = JSON.parse(snapshot) as { t?: string; d?: string };
      if (parsed.t !== "clx-snes-state-v1" || !parsed.d) return false;
      if (
        (parsed.d.length * 3) / 4 < SNES_STATE_MIN_BYTES ||
        parsed.d.length % 4 !== 0 ||
        parsed.d.length > SNES_STATE_MAX_BYTES
      ) {
        this.events.onStatus?.(
          "SNES save state rejected: unexpected payload size",
        );
        return false;
      }
      const ejs = this.ejs;
      const gm = ejs?.gameManager as
        | { loadState?: (data: Uint8Array) => void }
        | undefined;
      if (!gm?.loadState) return false;
      const bin = atob(parsed.d);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

      // Load into a paused core, then resume exactly as before. Matches the
      // EmulatorJS convention and avoids mid-frame races with the WASM loop.
      const wasPaused = ejs?.paused ?? true;
      if (!wasPaused) {
        try {
          ejs?.pause?.();
        } catch {
          /* noop */
        }
      }
      try {
        gm.loadState(bytes);
      } finally {
        if (!wasPaused) {
          try {
            ejs?.play?.();
            void ejs?.audioContext?.resume?.();
          } catch {
            /* noop */
          }
        }
      }
      return true;
    } catch {
      this.events.onStatus?.("SNES save state restore failed");
      return false;
    }
  }

  stop(): void {
    this.paused = true;
    this.started = false;
    this.manualMode = false;
    try {
      this.ejs?.pause?.();
    } catch {
      /* noop */
    }
    this.teardownOverlay();
    if (this.romUrl) {
      URL.revokeObjectURL(this.romUrl);
      this.romUrl = null;
    }
    delete (window as unknown as Record<string, unknown>).EJS_emulator;
    this.clearCanvas();
  }

  private teardownOverlay(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }

  private clearCanvas(): void {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
