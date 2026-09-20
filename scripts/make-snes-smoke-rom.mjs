// Generates a minimal valid SNES LoROM homebrew for the save-state smoke test.
// Layout: 64KB file, header at $00:FFC0, reset/NMI/IRQ vectors at $00:FFFA..,
// 6502 code at $00:8000 (file offset 0x8000, bank 0x80).
//
// For the EJS headless smoke test: copy the output to public/snes/smoke.rom,
// serve public/ (python -m http.server), open a page that mounts EJS exactly
// like src/lib/snes-emulator.ts loadRomAsync, then verify getState() ->
// loadState() round-trips and the core keeps ticking. Remove the copy from
// public/ afterwards — the ROM must never ship in the app bundle.
import { writeFileSync } from "node:fs";

const size = 0x10000;
const rom = new Uint8Array(size);

// Code at $00:8000: SEI; CLD; LDA #$0A; STA $2100 (INIDISP on); loop LDA $00; ADC #1; STA $00
const code = [
  0x78, // SEI
  0xd8, // CLD
  0xa9, 0x0a, // LDA #$0A
  0x8d, 0x00, 0x21, // STA $2100
  0xa5, 0x00, // LDA $00
  0x18, // CLC
  0x69, 0x01, 0x00, // ADC #$0001
  0x85, 0x00, // STA $00
  0x4c, 0x07, 0x80, // JMP $8007
];
rom.set(code, 0x8000);

// Vectors (LoROM: reads at $00:FFFA/$00:FFFC/$00:FFFE)
rom[0xfffa] = 0x00; rom[0xfffb] = 0x80; // NMI  -> $008000
rom[0xfffc] = 0x00; rom[0xfffd] = 0x80; // RESET-> $008000
rom[0xfffe] = 0x00; rom[0xffff] = 0x80; // IRQ  -> $008000

// Header at $00:FFC0
const title = "CLX SAVESTATE SMOKE";
for (let i = 0; i < title.length; i++) rom[0xffc0 + i] = title.charCodeAt(i);
rom[0xffc0 + 0x15] = 0x20; // map mode: LoROM
rom[0xffc0 + 0x16] = 0x00; // cart type
rom[0xffc0 + 0x17] = 0x06; // rom size: 2^6 = 64KB
rom[0xffc0 + 0x18] = 0x00; // ram size
rom[0xffc0 + 0x19] = 0x01; // region
rom[0xffc0 + 0x1a] = 0x33; // developer
rom[0xffc0 + 0x1b] = 0x00; // version

// Checksum over all bytes except the 4 checksum fields (0xFFDC-0xFFDF)
let sum = 0;
for (let i = 0; i < size; i++) {
  if (i >= 0xffdc && i <= 0xffdf) continue;
  sum = (sum + rom[i]) & 0xffff;
}
const checksum = (0xffff - sum) & 0xffff;
const complement = checksum ^ 0xffff;
rom[0xffdc] = (complement >> 8) & 0xff;
rom[0xffdd] = complement & 0xff;
rom[0xffde] = (checksum >> 8) & 0xff;
rom[0xffdf] = checksum & 0xff;

// Write to a temp location by default; copy into public/snes/ only for the
// smoke test, and delete it afterwards (never ships in the app bundle).
const outPath = process.env.SMOKE_ROM_OUT ?? "C:/Windows/Temp/smoke.rom";
writeFileSync(outPath, rom);
console.log(
  `wrote ${outPath} (${rom.length} bytes) checksum=${checksum.toString(16)} complement=${complement.toString(16)}`,
);