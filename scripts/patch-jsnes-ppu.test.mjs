import assert from "node:assert/strict";
import test from "node:test";
import {
  JSNES_PPU_BROKEN_LINE,
  JSNES_PPU_FIXED_LINE,
  patchJsnesPpuSource,
} from "./patch-jsnes-ppu.mjs";

test("corrects the odd 8x16 sprite tile lookup", () => {
  const input = `before\n${JSNES_PPU_BROKEN_LINE}\nafter\n`;
  const result = patchJsnesPpuSource(input);

  assert.equal(result.status, "patched");
  assert.equal(result.source, `before\n${JSNES_PPU_FIXED_LINE}\nafter\n`);
});

test("is idempotent after the dependency is patched", () => {
  const input = `before\n${JSNES_PPU_FIXED_LINE}\nafter\n`;
  const result = patchJsnesPpuSource(input);

  assert.equal(result.status, "already-patched");
  assert.equal(result.source, input);
});

test("refuses to patch an unknown JSNES source layout", () => {
  assert.throws(
    () => patchJsnesPpuSource("different upstream implementation"),
    /Refusing to patch an unknown dependency layout/,
  );
});
