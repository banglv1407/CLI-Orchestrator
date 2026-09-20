import type { NesConnectionBundleV1 } from "./nes";
import type { NesControllerInput } from "./nes-input";

type SignalType =
  | "rom_ready"
  | "input"
  | "state_hash"
  | "pause"
  | "resume"
  | "reset"
  | "reaction"
  | "peer_left"
  | "end"
  | "error";

interface SignalEnvelope {
  v: 1;
  type: SignalType;
  room_id: string;
  seq: number;
  payload: Record<string, unknown>;
}

export const NES_REACTIONS = [
  { id: "thumbs_up", emoji: "👍", label: "Thumbs up" },
  { id: "clap", emoji: "👏", label: "Clap" },
  { id: "laugh", emoji: "😂", label: "Laugh" },
  { id: "wow", emoji: "😮", label: "Wow" },
  { id: "cry", emoji: "😭", label: "Cry" },
  { id: "fire", emoji: "🔥", label: "Fire" },
  { id: "heart", emoji: "❤️", label: "Heart" },
  { id: "gamepad", emoji: "🎮", label: "Gamepad" },
] as const;

export type NesReactionId = (typeof NES_REACTIONS)[number]["id"];

function isNesReactionId(value: string): value is NesReactionId {
  return NES_REACTIONS.some((reaction) => reaction.id === value);
}

export type NesNetplayStatus =
  | "connecting"
  | "waiting"
  | "matching-rom"
  | "synced"
  | "paused"
  | "peer-left"
  | "failed";

export interface NesNetplayOptions {
  bundle: NesConnectionBundleV1;
  /** The shared emulator surface — implemented by both NesEmulator and SnesEmulator. */
  emulator: {
    startManual: () => void;
    stepFrame: (player1Mask: number, player2Mask: number) => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    serialize: () => string;
    stop: () => void;
  };
  localInput: NesControllerInput;
  romSha256: string;
  onStatus?: (status: NesNetplayStatus, detail?: string) => void;
}

const FRAME_INTERVAL_MS = 1000 / 60;
const INPUT_BUFFER_FRAMES = 3;
const STATE_HASH_INTERVAL = 300;

function normalizeMask(mask: number): number {
  // 12-bit shared-controller mask: opposing d-pad bits cancel; the SNES
  // face/shoulder extension bits (8-11) pass through untouched.
  let value = mask & 0xfff;
  if ((value & 0x03) === 0x03) value &= ~0x03;
  if ((value & 0x0c) === 0x0c) value &= ~0x0c;
  return value;
}

function stateHash(snapshot: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < snapshot.length; index++) {
    hash ^= snapshot.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Input-only lockstep. Both peers load the ROM locally, exchange only its
 * SHA-256, and advance a frame only after both controller masks are present.
 */
export class NesNetplaySession {
  private readonly options: NesNetplayOptions;
  private ws: WebSocket | null = null;
  private signalSeq = 0;
  private frameTimer: number | null = null;
  private currentFrame = 1;
  private nextInputFrame = 1;
  private epoch = 1;
  private localInputs = new Map<number, number>();
  private remoteInputs = new Map<number, number>();
  private localStateHashes = new Map<number, string>();
  private remoteStateHashes = new Map<number, string>();
  private romMatched = false;
  private paused = false;
  private stopped = false;
  private lastReactionAt = 0;
  public onReaction?: (reactionId: NesReactionId, sender: "host" | "guest") => void;
  public onAutoSave?: (reason: string) => void;

  constructor(options: NesNetplayOptions) {
    this.options = options;
  }

  start(): Promise<void> {
    this.options.onStatus?.("connecting");
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.options.bundle.signal_url);
      this.ws = ws;
      // Allow host and guest to wait indefinitely for connections
      ws.onopen = () => {
        ws.send(JSON.stringify({
          ticket: this.options.bundle.ticket,
          room_id: this.options.bundle.room.room_id,
        }));
        this.send("rom_ready", { sha256: this.options.romSha256 });
        this.options.onStatus?.("matching-rom", "Waiting for the other player's local ROM hash");
        resolve();
      };
      ws.onerror = () => {
        reject(new Error("Room WebSocket connection failed"));
      };
      ws.onmessage = (event) => this.handleMessage(String(event.data));
      ws.onclose = () => {
        if (!this.stopped) this.fail("Room WebSocket disconnected");
      };
    });
  }

  private send(type: SignalType, payload: Record<string, unknown>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const envelope: SignalEnvelope = {
      v: 1,
      type,
      room_id: this.options.bundle.room.room_id,
      seq: ++this.signalSeq,
      payload,
    };
    this.ws.send(JSON.stringify(envelope));
  }

  private handleMessage(raw: string): void {
    let envelope: SignalEnvelope;
    try {
      envelope = JSON.parse(raw) as SignalEnvelope;
    } catch {
      return;
    }
    if (envelope.room_id !== this.options.bundle.room.room_id) return;

    if (envelope.type === "rom_ready") {
      const remoteHash = String(envelope.payload.sha256 ?? "");
      if (remoteHash !== this.options.romSha256) {
        this.send("error", { message: "ROM hash mismatch" });
        this.fail("ROM mismatch: both players must select the exact same ROM");
        return;
      }
      if (!this.romMatched) {
        // The host may have announced its hash before the guest subscribed to
        // the room broadcast, so acknowledge the first peer hash explicitly.
        this.send("rom_ready", { sha256: this.options.romSha256 });
        this.romMatched = true;
        this.options.emulator.startManual();
        this.startInputClock();
        this.options.onStatus?.("synced", "ROM matched; input-only lockstep active");
      }
      return;
    }

    if (envelope.type === "input") {
      const epoch = Number(envelope.payload.epoch);
      const frame = Number(envelope.payload.frame);
      const mask = Number(envelope.payload.mask);
      if (epoch !== this.epoch || !Number.isSafeInteger(frame) || frame < this.currentFrame) return;
      if (frame > this.currentFrame + INPUT_BUFFER_FRAMES + 2) return;
      if (!Number.isInteger(mask) || mask < 0 || mask > 0xfff) return;
      this.remoteInputs.set(frame, normalizeMask(mask));
      this.advanceReadyFrames();
      return;
    }

    if (envelope.type === "state_hash") {
      const epoch = Number(envelope.payload.epoch);
      const frame = Number(envelope.payload.frame);
      const hash = String(envelope.payload.hash ?? "");
      if (epoch !== this.epoch || !/^[0-9a-f]{8}$/.test(hash)) return;
      this.remoteStateHashes.set(frame, hash);
      this.compareStateHash(frame);
      return;
    }

    if (envelope.type === "reaction") {
      const reactionId = String(envelope.payload.emoji_id ?? "");
      if (!isNesReactionId(reactionId)) return;
      const sender = this.options.bundle.role === "host" ? "guest" : "host";
      this.onReaction?.(reactionId, sender);
      return;
    }

    if (envelope.type === "pause") {
      this.applyPause(true);
    } else if (envelope.type === "resume") {
      this.applyPause(false);
    } else if (envelope.type === "reset") {
      const epoch = Number(envelope.payload.epoch);
      if (Number.isSafeInteger(epoch) && epoch > this.epoch) this.applyReset(epoch);
    } else if (envelope.type === "peer_left" || envelope.type === "end") {
      this.options.emulator.pause();
      this.onAutoSave?.("peer_left");
      this.options.onStatus?.("peer-left", "The other player left the room");
      this.stopInputClock();
    } else if (envelope.type === "error") {
      this.fail(String(envelope.payload.message ?? "Peer reported a synchronization error"));
    }
  }

  private startInputClock(): void {
    if (this.frameTimer !== null) return;
    const capture = () => {
      if (!this.romMatched || this.paused || this.stopped) return;
      if (this.nextInputFrame > this.currentFrame + INPUT_BUFFER_FRAMES - 1) return;
      const frame = this.nextInputFrame++;
      const mask = normalizeMask(this.options.localInput.readBitmask());
      this.localInputs.set(frame, mask);
      this.send("input", { epoch: this.epoch, frame, mask });
      this.advanceReadyFrames();
    };
    capture();
    this.frameTimer = window.setInterval(capture, FRAME_INTERVAL_MS);
  }

  private advanceReadyFrames(): void {
    while (!this.paused) {
      const local = this.localInputs.get(this.currentFrame);
      const remote = this.remoteInputs.get(this.currentFrame);
      if (local === undefined || remote === undefined) break;
      const player1 = this.options.bundle.role === "host" ? local : remote;
      const player2 = this.options.bundle.role === "guest" ? local : remote;
      const completedFrame = this.currentFrame;
      this.options.emulator.stepFrame(player1, player2);
      this.localInputs.delete(completedFrame);
      this.remoteInputs.delete(completedFrame);
      this.currentFrame++;

      if (completedFrame % STATE_HASH_INTERVAL === 0) {
        const hash = stateHash(this.options.emulator.serialize());
        this.localStateHashes.set(completedFrame, hash);
        this.send("state_hash", { epoch: this.epoch, frame: completedFrame, hash });
        this.compareStateHash(completedFrame);
      }
    }
  }

  private compareStateHash(frame: number): void {
    const local = this.localStateHashes.get(frame);
    const remote = this.remoteStateHashes.get(frame);
    if (!local || !remote) return;
    this.localStateHashes.delete(frame);
    this.remoteStateHashes.delete(frame);
    if (local !== remote) {
      this.send("error", { message: `State mismatch at frame ${frame}` });
      this.fail(`Emulator state diverged at frame ${frame}`);
    }
  }

  sendReaction(reactionId: NesReactionId): boolean {
    if (!this.romMatched || this.stopped || !this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    const now = Date.now();
    if (now - this.lastReactionAt < 800) return false;
    this.lastReactionAt = now;
    this.send("reaction", { emoji_id: reactionId });
    return true;
  }

  setPaused(paused: boolean): void {
    if (!this.romMatched || this.stopped) return;
    this.send(paused ? "pause" : "resume", { epoch: this.epoch });
    this.applyPause(paused);
  }

  private applyPause(paused: boolean): void {
    this.paused = paused;
    if (paused) {
      this.options.emulator.pause();
      this.options.onStatus?.("paused", "Lockstep paused for both players");
    } else {
      this.options.emulator.resume();
      this.options.onStatus?.("synced", "Input-only lockstep active");
      this.advanceReadyFrames();
    }
  }

  reset(): void {
    if (!this.romMatched || this.stopped) return;
    const epoch = this.epoch + 1;
    this.send("reset", { epoch });
    this.applyReset(epoch);
  }

  private applyReset(epoch: number): void {
    this.epoch = epoch;
    this.currentFrame = 1;
    this.nextInputFrame = 1;
    this.localInputs.clear();
    this.remoteInputs.clear();
    this.localStateHashes.clear();
    this.remoteStateHashes.clear();
    this.options.emulator.reset();
  }

  private stopInputClock(): void {
    if (this.frameTimer !== null) window.clearInterval(this.frameTimer);
    this.frameTimer = null;
  }

  private fail(detail: string): void {
    this.paused = true;
    this.stopInputClock();
    this.options.emulator.pause();
    this.onAutoSave?.("disconnect_fail");
    this.options.onStatus?.("failed", detail);
  }

  stop(): void {
    this.stopped = true;
    this.stopInputClock();
    this.ws?.close();
    this.ws = null;
    this.localInputs.clear();
    this.remoteInputs.clear();
  }
}
