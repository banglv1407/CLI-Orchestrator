// Save/load state robustness tests for the NES (JSNES) and SNES (EmulatorJS)
// emulators:
//
// 1. JSNES round-trip: serialize -> restore into a fresh instance -> frames
//    must remain byte-identical (determinism + no hang).
// 2. NesEmulator.deserialize: rejects garbage/incomplete envelopes (the guard
//    that stops a corrupt state file from freezing the emulator loop).
// 3. SnesEmulator serialize/serializeAsync/deserialize: base64 round-trip on
//    the real core payload shape, plus envelope/size validation (the guard
//    that stops a truncated state from reaching the WASM core).
//
// Run: node --test scripts/savestate-roundtrip.test.mjs

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as jsnes from "jsnes";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

// ── Minimal but VALID NES test ROM (mapper 0, 16 KB PRG + 8 KB CHR) ─────────
function makeTestNesRom() {
  const prg = new Uint8Array(16384);
  const code = [
    0x78, 0xd8, 0xa2, 0xff, 0x9a, // SEI CLD LDX#FF TXS
    0xad, 0x02, 0x20, 0x10, 0xfb, // wait: LDA $2002 / BPL wait
    0xa9, 0x3f, 0x8d, 0x06, 0x20, // LDA#3F STA $2006
    0xa9, 0x00, 0x8d, 0x06, 0x20, // LDA#00 STA $2006
    0xa5, 0x10, 0x8d, 0x07, 0x20, // LDA $10 STA $2007
    0xe6, 0x10, 0x4c, 0x05, 0xc0, // INC $10 JMP wait
  ];
  prg.set(code, 0);
  for (const v of [0xfffa, 0xfffc, 0xfffe]) {
    prg[v] = 0x00;
    prg[v + 1] = 0xc0; // vectors -> $C000 (bank mirrored at $C000)
  }
  const chr = new Uint8Array(8192);
  const rom = new Uint8Array(16 + prg.length + chr.length);
  rom.set([0x4e, 0x45, 0x53, 0x1a, 0x01, 0x01, 0x01, 0, 0, 0, 0, 0, 0, 0, 0], 0);
  rom.set(prg, 16);
  rom.set(chr, 16 + prg.length);
  return rom;
}

function frameBufferHash(nes) {
  let hash = 0x811c9dc5;
  const buf = nes.ppu.buffer;
  for (let i = 0; i < buf.length; i++) {
    hash ^= buf[i] & 0xff;
    hash = Math.imul(hash, 0x01000193);
  }
  for (let i = 0; i < buf.length; i++) {
    hash ^= (buf[i] >> 8) & 0xff;
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function newJsnes() {
  return new jsnes.NES({
    onFrame() {},
    onAudioSample() {},
    sampleRate: 44100,
    emulateSound: true,
  });
}

// ── TS loader: transpile a src/lib module into a fresh vm context whose
//    `window` we control, so each emulator under test sees its own mock. ─────
function makeGlobals() {
  const window = Object.assign(new EventTarget(), {
    setTimeout,
    setInterval,
    clearInterval,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
  return {
    window,
    document: {
      createElement: () => ({ style: {}, remove() {}, querySelector: () => null }),
      body: { appendChild() {} },
    },
    Blob,
    URL,
    Uint8Array,
    Uint32Array,
    Uint8ClampedArray,
    ArrayBuffer,
    Float32Array,
    console,
    performance,
    navigator: { getGamepads: () => [] },
    localStorage: { getItem: () => null, setItem: () => {} },
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
    atob,
    btoa,
  };
}

const TS_MODULES = {
  nes: "../src/lib/nes-emulator.ts",
  snes: "../src/lib/snes-emulator.ts",
  input: "../src/lib/nes-input.ts",
};

function loadModule(kind, globals) {
  const file = new URL(TS_MODULES[kind], import.meta.url);
  const source = readFileSync(file, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const require = (name) => {
    if (name === "jsnes") return jsnes;
    if (name.endsWith("/nes-input")) return loadModule("input", globals);
    throw new Error(`Unexpected dependency: ${name}`);
  };
  const context = { ...globals, require, exports: {} };
  vm.runInNewContext(outputText, context, { filename: file.href });
  return context.exports;
}

function makeNesEmulator() {
  const globals = makeGlobals();
  globals.window._canvasCtx = {
    fillStyle: "",
    imageSmoothingEnabled: false,
    fillRect() {},
    putImageData() {},
    createImageData: () => ({ data: new Uint8ClampedArray(61440 * 4) }),
  };
  const canvas = { width: 256, height: 240, getContext: () => globals.window._canvasCtx };
  const { NesEmulator } = loadModule("nes", globals);
  return { NesEmulator, canvas };
}

function makeSnesEmulator(mockState) {
  const globals = makeGlobals();
  const captured = { state: null, pauses: 0, plays: 0 };
  globals.window._canvasCtx = { fillRect() {}, createImageData: () => ({ data: new Uint8ClampedArray(4) }) };
  globals.window.EJS_emulator = {
    started: true,
    paused: false,
    pause: () => {
      captured.pauses++;
      globals.window.EJS_emulator.paused = true;
    },
    play: () => {
      captured.plays++;
      globals.window.EJS_emulator.paused = false;
    },
    audioContext: null,
    gameManager: {
      getState: mockState,
      loadState: (bytes) => {
        captured.state = bytes;
      },
    },
    controls: {},
  };
  const canvas = { width: 256, height: 240, getContext: () => globals.window._canvasCtx };
  const { SnesEmulator } = loadModule("snes", globals);
  return { SnesEmulator, canvas, captured };
}

// ── JSNES round-trip ────────────────────────────────────────────────────────
test("NES: save -> restore into a fresh instance -> frames stay identical", () => {
  const rom = makeTestNesRom();
  const reference = newJsnes();
  reference.loadROM(rom);
  for (let i = 0; i < 300; i++) reference.frame();

  const runner = newJsnes();
  runner.loadROM(rom);
  for (let i = 0; i < 300; i++) runner.frame();

  const snapshot = JSON.stringify(runner.toJSON());
  const sizeKiB = snapshot.length / 1024;
  // A real snapshot is ~1.1 MB; reject pathological growth (e.g. rom data leaking in)
  assert.ok(sizeKiB < 4096, `snapshot unexpectedly large: ${sizeKiB.toFixed(0)} KiB`);

  runner.fromJSON(JSON.parse(snapshot));
  for (let i = 0; i < 120; i++) {
    reference.frame();
    runner.frame();
  }
  assert.equal(
    frameBufferHash(runner),
    frameBufferHash(reference),
    "restored instance diverged from the uninterrupted run",
  );
});

test("NES: deserialize rejects garbage and incomplete envelopes", () => {
  const { NesEmulator, canvas } = makeNesEmulator();
  const emu = new NesEmulator(canvas);
  emu.loadRom(makeTestNesRom());
  const nes = emu["nes"];
  assert.ok(nes);
  for (let i = 0; i < 30; i++) nes.frame();

  assert.equal(emu.deserialize("not json at all"), false);
  assert.equal(emu.deserialize(JSON.stringify({ cpu: {} })), false);
  assert.equal(emu.deserialize(JSON.stringify({ cpu: {}, mmap: [], ppu: {}, papu: {} })), false);
  assert.equal(emu.deserialize(JSON.stringify("stringy")), false);

  // A valid round-trip is still accepted and determinism holds
  const snap = emu.serialize();
  assert.equal(emu.deserialize(snap), true);
  nes.frame();
  const after = frameBufferHash(nes);
  const fresh = newJsnes();
  fresh.loadROM(makeTestNesRom());
  for (let i = 0; i < 31; i++) fresh.frame();
  assert.equal(after, frameBufferHash(fresh));
});

// ── SNES (EmulatorJS) serialize/deserialize ─────────────────────────────────
test("SNES: serialize/deserialize round-trip preserves bytes and pauses core on load", () => {
  const syncState = () => new Uint8Array(823432); // realistic snes9x state size
  const { SnesEmulator, canvas, captured } = makeSnesEmulator(syncState);
  const emu = new SnesEmulator(canvas);

  const snap = emu.serialize();
  assert.ok(snap.length > 1000, "serialize should produce a payload");
  assert.match(snap, /"clx-snes-state-v1"/);

  const ok = emu.deserialize(snap);
  assert.equal(ok, true);
  assert.ok(captured.state instanceof Uint8Array);
  assert.equal(captured.state.length, 823432, "byte-exact round-trip");
  assert.ok(captured.pauses >= 1, "core was paused before load");
  assert.ok(captured.plays >= 1, "core was resumed after load");
});

test("SNES: serializeAsync awaits a Promise-returning getState", async () => {
  const asyncState = () => Promise.resolve(new Uint8Array(200000));
  const { SnesEmulator, canvas } = makeSnesEmulator(asyncState);
  const emu = new SnesEmulator(canvas);
  const snap = await emu.serializeAsync();
  assert.match(snap, /clx-snes-state-v1/);
  assert.equal(JSON.parse(snap).d.length % 4, 0);
});

test("SNES: deserialize rejects truncated / foreign envelopes", () => {
  const syncState = () => new Uint8Array(823432);
  const { SnesEmulator, canvas, captured } = makeSnesEmulator(syncState);
  const emu = new SnesEmulator(canvas);

  assert.equal(emu.deserialize("garbage"), false);
  assert.equal(emu.deserialize(JSON.stringify({ t: "clx-nes-state-v1", d: "AAAA" })), false);
  assert.equal(emu.deserialize(JSON.stringify({ t: "clx-snes-state-v1", d: "aGVsbG8=" })), false);
  assert.equal(emu.deserialize(JSON.stringify({ t: "clx-snes-state-v1", d: "A".repeat(4096) })), false);
  assert.equal(emu.deserialize(JSON.stringify({ t: "other", d: "A".repeat(4096) })), false);
  assert.equal(captured.state, null, "loadState must never be called with garbage");
});