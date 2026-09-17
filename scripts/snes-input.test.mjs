import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as jsnes from "jsnes";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Match Vite's ESM entrypoint; JSNES also ships a separate CommonJS bundle.
const require = (name) => {
  if (name === "jsnes") return jsnes;
  throw new Error(`Unexpected test dependency: ${name}`);
};
const runtime = { window: {} };
vm.runInNewContext(readFileSync(new URL("../public/snes/data/src/emulator.js", import.meta.url), "utf8"), runtime);
const contract = {};
runtime.window.EmulatorJS.prototype.initControlVars.call(contract);
const controls = contract.defaultControllers[0];
const buttonId = (key) => Number(Object.keys(controls).find((id) => controls[id].value === key));

function loadTs(path, globals) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const context = { ...globals, require, exports: {} };
  vm.runInNewContext(outputText, context, { filename: path });
  return context.exports;
}

async function setup({ start = true } = {}) {
  const calls = [];
  const window = Object.assign(new EventTarget(), { setTimeout, setInterval, clearInterval });
  const core = {
    started: false,
    // Simulate legacy EmulatorJS bindings being restored during startup.
    controls: structuredClone(contract.defaultControllers),
    gameManager: { simulateInput: (...args) => calls.push(args) },
  };
  window.EJS_emulator = core;
  const startCore = () => { core.started = true; window.EJS_onGameStart?.(); };
  const canvas = {
    width: 256, height: 240,
    getContext: () => ({ fillRect() {} }),
    parentElement: { parentElement: { appendChild() {} } },
  };
  const document = {
    createElement: () => ({ style: {}, remove() {}, querySelector: () => null }),
    body: { appendChild() { if (start) startCore(); } },
  };
  const globals = { window, document, Blob, URL, Uint8Array, console,
    navigator: { getGamepads: () => [] }, localStorage: { getItem: () => null } };
  const { SnesEmulator } = loadTs("../src/lib/snes-emulator.ts", globals);
  const { NesControllerInput, DEFAULT_KEY_MAPPING } = loadTs("../src/lib/nes-input.ts", globals);
  const engine = new SnesEmulator(canvas);
  const input = new NesControllerInput("host");
  const detach = input.attach();
  const loading = engine.loadRomAsync(new Uint8Array([0]));
  if (start) await loading;
  const key = (type, value) => {
    const event = new Event(type);
    Object.defineProperty(event, "key", { value });
    window.dispatchEvent(event);
    engine.setPlayerInput(1, input.readBitmask());
  };
  const active = (player = 0) => {
    const state = new Map();
    for (const [p, id, value] of calls) if (p === player) state.set(id, value);
    return [...state].filter(([, value]) => value === 1).map(([id]) => id).sort((a, b) => a - b);
  };
  return { window, core, engine, input, defaults: DEFAULT_KEY_MAPPING, calls, key, active,
    loading, startCore, dispose: () => { detach(); engine.stop(); } };
}

for (const [label, keys, nativeKey] of [
  ["up", ["w", "W", "ArrowUp"], "up arrow"],
  ["down", ["s", "S", "ArrowDown"], "down arrow"],
  ["left", ["a", "A", "ArrowLeft"], "left arrow"],
  ["right", ["d", "D", "ArrowRight"], "right arrow"],
]) {
  test(`${label}: WASD and arrows reach the bundled D-pad button and release it`, async () => {
    const h = await setup();
    try {
      for (const key of keys) {
        h.key("keydown", key);
        assert.deepEqual(h.active(), [buttonId(nativeKey)]);
        h.key("keyup", key);
        assert.deepEqual(h.active(), []);
      }
    } finally { h.dispose(); }
  });
}

test("custom direction replaces defaults and multiple aliases release independently", async () => {
  const h = await setup();
  try {
    h.input.setMapping({ ...h.defaults, up: ["t", "g"] });
    h.key("keydown", "w"); assert.deepEqual(h.active(), []);
    h.key("keydown", "ArrowUp"); assert.deepEqual(h.active(), []);
    h.key("keydown", "t"); h.key("keydown", "g");
    h.key("keyup", "t"); assert.deepEqual(h.active(), [buttonId("up arrow")]);
    h.key("keyup", "g"); assert.deepEqual(h.active(), []);
  } finally { h.dispose(); }
});

test("startup clears EmulatorJS defaults and restored controls without changing CLX mappings", async () => {
  const h = await setup();
  try {
    assert.equal(Object.values(h.window.EJS_defaultControls ?? {}).length, 4);
    for (const bindings of Object.values(h.core.controls)) assert.equal(Object.keys(bindings).length, 0);
    assert.ok(h.input.getMapping().up.includes("w"));
  } finally { h.dispose(); }
});

test("the core receives no early inputs and receives a held key when it starts", async () => {
  const h = await setup({ start: false });
  try {
    h.key("keydown", "w");
    assert.deepEqual(h.calls, []);
    h.startCore(); await h.loading;
    assert.deepEqual(h.active(), [buttonId("up arrow")]);
  } finally { h.startCore(); await h.loading; h.dispose(); }
});

test("face, shoulder, select/start buttons and the second controller retain their contract", async () => {
  const h = await setup();
  try {
    for (const [key, nativeKey] of [["z", "z"], ["x", "x"], ["Shift", "v"], ["Enter", "enter"],
      ["l", "a"], ["o", "s"], ["q", "q"], ["e", "e"]]) {
      h.key("keydown", key); assert.deepEqual(h.active(), [buttonId(nativeKey)]);
      h.key("keyup", key); assert.deepEqual(h.active(), []);
    }
    h.engine.setPlayerInput(2, 1);
    assert.deepEqual(h.active(0), []);
    assert.deepEqual(h.active(1), [buttonId("up arrow")]);
    h.engine.setPlayerInput(2, 0); assert.deepEqual(h.active(1), []);
  } finally { h.dispose(); }
});
