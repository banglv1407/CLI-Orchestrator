// Local NES emulator engine — owns JSNES NES class timing, canvas rendering,
// Web Audio routing, and deterministic frame stepping.
//
// ACCURATE COLOR & PIXEL RENDERING ENGINE:
// 1. COLORS: Exactly matches official jsnes-web Screen.setBuffer():
//    buf32[i] = 0xff000000 | buffer[i] (No bit shifts).
// 2. PIXEL CRISPNESS: Keeps the visible canvas backing store at the native
//    256x240 resolution and writes frames 1:1 with putImageData. Display zoom
//    is CSS-only, matching the official JSNES Screen adapter and avoiding a
//    second resampling pass that can move sprite edges between output pixels.

import { NES } from "jsnes";
import type { ButtonKey } from "jsnes";
import { BIT_TO_JSNES_BUTTON, ALL_NES_BITS } from "./nes-input";

const NES_FRAMERATE = 60;
const FRAME_INTERVAL = 1000 / NES_FRAMERATE;
export const NES_NATIVE_WIDTH = 256;
export const NES_NATIVE_HEIGHT = 240;
const PIXEL_COUNT = NES_NATIVE_WIDTH * NES_NATIVE_HEIGHT; // 61440
const SAMPLE_RATE = 44100;
const AUDIO_BUFFER_SIZE = 4096;
const RING_BUFFER_CAPACITY = SAMPLE_RATE * 2;

export interface NesEmulatorEvents {
  onFrame?: () => void;
  onStatus?: (status: string) => void;
}

export class NesEmulator {
  private nes: NES | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private imageData: ImageData;
  private buf: ArrayBuffer;
  private buf8: Uint8ClampedArray;
  private buf32: Uint32Array;

  private rafId: number | null = null;

  // Audio ring buffer
  private audioCtx: AudioContext | null = null;
  private scriptNode: ScriptProcessorNode | null = null;
  private ringBuffer: Float32Array;
  private writeCursor = 0;
  private readCursor = 0;
  private samplesAvailable = 0;

  private paused = false;
  private manualMode = false;
  private events: NesEmulatorEvents;
  private lastFrameTime = 0;
  private accumulator = 0;

  constructor(canvas: HTMLCanvasElement, events: NesEmulatorEvents = {}) {
    this.canvas = canvas;
    this.events = events;

    // The backing store is always the native NES framebuffer. Resolution
    // controls change only the element's CSS size.
    canvas.width = NES_NATIVE_WIDTH;
    canvas.height = NES_NATIVE_HEIGHT;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;

    this.imageData = ctx.createImageData(NES_NATIVE_WIDTH, NES_NATIVE_HEIGHT);
    this.buf = new ArrayBuffer(this.imageData.data.length);
    this.buf8 = new Uint8ClampedArray(this.buf);
    this.buf32 = new Uint32Array(this.buf);

    for (let i = 0; i < this.buf32.length; i++) {
      this.buf32[i] = 0xff000000;
    }

    this.ringBuffer = new Float32Array(RING_BUFFER_CAPACITY);
  }

  loadRom(bytes: Uint8Array): void {
    this.teardownAudio();
    this.writeCursor = 0;
    this.readCursor = 0;
    this.samplesAvailable = 0;

    this.nes = new NES({
      onFrame: (buffer: Uint32Array) => this.render(buffer),
      onAudioSample: (left: number, right: number) =>
        this.pushAudioSample((left + right) * 0.5),
      onStatusUpdate: (s: string) => this.events.onStatus?.(s),
      emulateSound: true,
      sampleRate: SAMPLE_RATE,
    });

    if (this.nes && (this.nes as any).ppu) {
      (this.nes as any).ppu.clipToTvSize = true;
    }

    this.nes.loadROM(bytes);
  }

  private render(buffer: Uint32Array): void {
    // 1. Direct copy matching official jsnes-web Screen.setBuffer()
    const len = Math.min(buffer.length, PIXEL_COUNT);
    const buf32 = this.buf32;

    for (let i = 0; i < len; i++) {
      buf32[i] = 0xff000000 | buffer[i];
    }

    // Write the native framebuffer directly. CSS image-rendering handles the
    // single nearest-neighbor display scale.
    this.imageData.data.set(this.buf8);
    this.ctx.putImageData(this.imageData, 0, 0);

    this.events.onFrame?.();
  }

  start(): void {
    if (!this.nes) return;
    this.manualMode = false;
    this.paused = false;
    this.lastFrameTime = performance.now();
    this.accumulator = 0;
    this.startAudio();

    const loop = (now: number) => {
      if (this.paused || !this.nes) return;

      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;
      this.accumulator += Math.min(delta, 100);

      let framesThisTick = 0;
      while (this.accumulator >= FRAME_INTERVAL && framesThisTick < 2) {
        this.nes!.frame();
        this.accumulator -= FRAME_INTERVAL;
        framesThisTick++;
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  pause(): void {
    this.paused = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.audioCtx && this.audioCtx.state === "running") {
      void this.audioCtx.suspend();
    }
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.lastFrameTime = performance.now();
    this.accumulator = 0;

    if (this.audioCtx && this.audioCtx.state === "suspended") {
      void this.audioCtx.resume();
    }

    if (this.manualMode) return;

    if (this.rafId === null && this.nes) {
      const loop = (now: number) => {
        if (this.paused || !this.nes) return;

        const delta = now - this.lastFrameTime;
        this.lastFrameTime = now;
        this.accumulator += Math.min(delta, 100);

        let framesThisTick = 0;
        while (this.accumulator >= FRAME_INTERVAL && framesThisTick < 2) {
          this.nes!.frame();
          this.accumulator -= FRAME_INTERVAL;
          framesThisTick++;
        }

        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    }
  }

  reset(): void {
    this.writeCursor = 0;
    this.readCursor = 0;
    this.samplesAvailable = 0;
    this.accumulator = 0;
    this.nes?.reset();
  }

  getRam(): Uint8Array | null {
    if (!this.nes) return null;
    return (this.nes as any).cpu?.mem || null;
  }

  setPlayerInput(player: 1 | 2, bitmask: number): void {
    if (!this.nes) return;
    for (const bit of ALL_NES_BITS) {
      const button = BIT_TO_JSNES_BUTTON[bit] as ButtonKey;
      if (bitmask & bit) {
        this.nes.buttonDown(player, button);
      } else {
        this.nes.buttonUp(player, button);
      }
    }
  }

  /** Start local deterministic stepping; no requestAnimationFrame loop runs. */
  startManual(): void {
    if (!this.nes) return;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.manualMode = true;
    this.paused = false;
    this.startAudio();
  }

  /** Apply both players' inputs and advance exactly one emulated frame. */
  stepFrame(player1Mask: number, player2Mask: number): void {
    if (!this.nes || !this.manualMode || this.paused) return;
    this.setPlayerInput(1, player1Mask);
    this.setPlayerInput(2, player2Mask);
    this.nes.frame();
  }

  serialize(): string {
    if (!this.nes) return "";
    return JSON.stringify(this.nes.toJSON());
  }

  /**
   * Restore a previously saved snapshot. Returns true on success. The payload
   * is verified to be a JSNES toJSON() envelope BEFORE it reaches fromJSON —
   * a truncated or foreign snapshot must never be fed to the emulator core.
   */
  deserialize(snapshot: string): boolean {
    if (!this.nes) return false;
    try {
      const parsed = JSON.parse(snapshot) as Record<string, unknown>;
      if (!parsed || typeof parsed !== "object") return false;
      for (const key of ["cpu", "mmap", "ppu", "papu"]) {
        const part = parsed[key];
        if (!part || typeof part !== "object" || Array.isArray(part)) return false;
      }
      this.nes.fromJSON(parsed as unknown as Parameters<typeof this.nes.fromJSON>[0]);
      return true;
    } catch {
      return false;
    }
  }

  private startAudio(): void {
    if (this.audioCtx) {
      if (this.audioCtx.state === "suspended") {
        void this.audioCtx.resume();
      }
      return;
    }

    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.audioCtx = new AudioCtxClass({ sampleRate: SAMPLE_RATE });

      this.scriptNode = this.audioCtx.createScriptProcessor(
        AUDIO_BUFFER_SIZE,
        0,
        2,
      );
      this.scriptNode.onaudioprocess = (e) => {
        const out = e.outputBuffer;
        const leftChannel = out.getChannelData(0);
        const rightChannel = out.getChannelData(1);
        const length = leftChannel.length;

        const maxLagSamples = Math.floor(SAMPLE_RATE * 0.15);
        if (this.samplesAvailable > maxLagSamples) {
          const drop = this.samplesAvailable - maxLagSamples;
          this.readCursor = (this.readCursor + drop) % RING_BUFFER_CAPACITY;
          this.samplesAvailable -= drop;
        }

        for (let i = 0; i < length; i++) {
          if (this.samplesAvailable > 0) {
            const sample = this.ringBuffer[this.readCursor];
            leftChannel[i] = sample;
            rightChannel[i] = sample;
            this.readCursor = (this.readCursor + 1) % RING_BUFFER_CAPACITY;
            this.samplesAvailable--;
          } else {
            leftChannel[i] = 0;
            rightChannel[i] = 0;
          }
        }
      };

      this.scriptNode.connect(this.audioCtx.destination);
    } catch (err) {
      console.warn("Web Audio initialization failed:", err);
      this.audioCtx = null;
      this.scriptNode = null;
    }
  }

  private pushAudioSample(sample: number): void {
    this.ringBuffer[this.writeCursor] = sample;
    this.writeCursor = (this.writeCursor + 1) % RING_BUFFER_CAPACITY;
    if (this.samplesAvailable < RING_BUFFER_CAPACITY) {
      this.samplesAvailable++;
    } else {
      this.readCursor = (this.readCursor + 1) % RING_BUFFER_CAPACITY;
    }
  }

  stop(): void {
    this.pause();
    this.teardownAudio();
    this.clearCanvas();
    this.nes = null;
  }

  private teardownAudio(): void {
    if (this.scriptNode) {
      this.scriptNode.disconnect();
      this.scriptNode = null;
    }
    if (this.audioCtx) {
      void this.audioCtx.close().catch(() => undefined);
      this.audioCtx = null;
    }
  }

  private clearCanvas(): void {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
