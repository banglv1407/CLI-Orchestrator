# US-044 Local JSNES workspace and dual-ROM boundary

## Status

in_progress

Both host and guest explicitly choose a local `.nes` file. Each side renders
its own 256x240 canvas and audio. The emulator supports normal solo timing plus
manual deterministic `stepFrame(P1, P2)` for online lockstep.

Only SHA-256 leaves the local ROM boundary, inside an authenticated room. ROM
bytes, names, paths, and emulator snapshots never reach the service. Desktop
same-ROM/different-ROM acceptance remains pending.

## SNES header recognition correction (2026-09-16)

### Lane and product contract

Normal: bounded correction to existing ROM detection with stronger regression
proof. See `docs/product/nes-multiplayer.md`, ROM Boundary.

### Problem

SNES detection checks the last eight bytes of the file instead of the cartridge
header. Valid padded dumps, including the reported Vietnamese `.smc`, end in
zeroes and are rejected before Snes9x receives them.

### Acceptance criteria

- Read the internal LoROM, HiROM, ExLoROM, or ExHiROM header, with or without a
  512-byte copier prefix, independently of trailing padding.
- Recognize standard mapping modes and common coprocessor modes. Check a
  plausible reset vector and ROM/RAM size fields; a translation may retain its
  old checksum, title encoding, and declared ROM size after expansion.
- Reject empty, oversized, truncated, and unrelated data; arbitrary nonzero
  trailing bytes alone must not identify a SNES ROM.
- Preserve NES detection, original ROM bytes, metadata, and SHA-256 identity.
  Never modify the selected file or commit the user's ROM as a fixture.

### Validation

- Synthetic unit coverage for mapped headers, copier prefixes, padded tails,
  translated/expanded headers, invalid input, and NES regressions.
- An opt-in local-ROM test exercises `open_rom` and verifies the returned
  bytes and hash against the selected file.
- A local browser smoke uses the bundled Snes9x core with the reported ROM.
  Full desktop and two-machine netplay acceptance remain separate gates.

### Evidence

- Before the fix, the reported local ROM failed `open_rom` with exactly
  `Not a valid NES/SNES ROM (unrecognized header)`. Four synthetic regressions
  also failed against the old detector (padded layouts, coprocessors, patched
  headers, and garbage with nonzero trailing bytes).
- After the fix, an isolated host compiling the unchanged production
  `nes_rom.rs` passed all 12 tests, including the opt-in local-ROM read/byte/hash
  check. Temporary host: `.temp/snes-rom-validation/Cargo.toml`.
- The existing `SnesEmulator` adapter and bundled core loaded the original
  4,194,816-byte file in local headless Chromium. Core log: `FIREEMBLEM4`,
  `HiROM`, `Checksum OK`; `started=true`, `paused=false`. Screenshot
  `.temp/snes-rom-validation/snes-boot.png` shows the opening animation.
  Headless screen-dimension/wake-lock warnings did not prevent rendering.
- Native desktop target: focused `cargo test --no-default-features --bin clx
  core::nes_rom::tests` PASS (11 passed, 1 opt-in ignored). The opt-in test was
  then run against the reported file on the same target: PASS (1/1).
  `AWS_LC_SYS_PREBUILT_NASM=1` resolved the initial missing-NASM build failure;
  10 existing OAuth dead-code warnings remain.
- `npm.cmd run build`: PASS (133 modules); existing Browserslist, mixed-import,
  and chunk-size warnings remain.
- `rustfmt --edition 2021 --check src-tauri/src/core/nes_rom.rs`: PASS.
- `git diff --check`: PASS.
- Header layout was cross-checked against the primary
  [Snes9x implementation](https://github.com/snes9xgit/snes9x/blob/master/memmap.cpp)
  (`ScoreLoROM`, `ScoreHiROM`, extended offsets, and copier-header handling).
- Full desktop launch, long gameplay, audio, and two-machine netplay were not
  exercised by the browser smoke. Production artifacts were subsequently rebuilt
  as recorded below; the installed application was not replaced automatically.

### Re-run the focused tests

```powershell
# This host lacks NASM; aws-lc-sys supports its bundled prebuilt objects.
$env:AWS_LC_SYS_PREBUILT_NASM = '1'
cargo test --manifest-path src-tauri/Cargo.toml --no-default-features --bin clx core::nes_rom::tests

# Use a caller-selected local file; never add it as a repository fixture.
$env:CLX_TEST_ROM = '<path to local SNES ROM>'
cargo test --manifest-path src-tauri/Cargo.toml --no-default-features --bin clx core::nes_rom::tests::opens_local_snes_rom_without_changing_bytes -- --ignored
```

### Production rebuild (2026-09-16)

- User-requested `npm.cmd run build:production`: PASS with default features and
  `AWS_LC_SYS_PREBUILT_NASM=1`; optimized Rust compilation and NSIS bundle both
  completed successfully.
- Application: `src-tauri/target/release/CLX (0916).exe`.
- Installer: `src-tauri/target/release/bundle/nsis/CLX (0916)_0.1.0_x64-setup.exe`.
- Executable product name is `CLX (0916)`, version `0.1.0`. Both output files
  were verified; sizes and SHA-256 are in
  `.temp/clx-production-rebuild/artifacts.json`, and the full build output is in
  `.temp/clx-production-rebuild/build.log`.
- This produces the requested build; installer execution and desktop gameplay
  on the new production binary were not performed.

## SNES keyboard mapping correction (2026-09-16)

### Scope and acceptance

Normal lane, existing behavior and weak-proof flags. The SNES adapter sends
D-pad masks to IDs 13-16 instead of the bundled EmulatorJS D-pad IDs 4-7.
EmulatorJS's separate default keyboard handler makes arrows work and maps A/S
to face buttons, bypassing the CLX controller configuration.

- WASD, arrows, and saved custom directions reach the same four SNES directions.
- CLX owns keyboard/gamepad bindings; bundled or previously saved EmulatorJS
  bindings must not add extra buttons or bypass a remap.
- Key release, simultaneous bindings for one direction, host/guest controller
  ports, and the other eight SNES buttons remain correct.
- Hold input until the core has started, then apply its current state.
- Prove the adapter against the bundled EmulatorJS controller contract and
  exercise keyboard events with the actual bundled Snes9x core and local ROM.
- Rebuild production artifacts after validation for the current app iteration.

### Evidence

- `npm.cmd run test:snes-input`: PASS (8/8). Tests use the bundled EmulatorJS
  controller table as the expected contract and exercise CLX's actual input
  class and SNES adapter. The old code failed the direction, custom mapping,
  duplicate binding, startup gating, and second-controller checks.
- Browser integration with the minified production EmulatorJS and actual
  Snes9x WASM core: PASS (24 keyboard cases plus releases). The reported local
  ROM booted; focused keyboard events produced exactly D-pad IDs 4/5/6/7 for
  WASD/arrows, and correct face-button IDs. A saved T/G/F/H remap took effect
  with the removed WASD/arrows producing no inputs.
- Seeded legacy EmulatorJS A/S/arrow bindings were cleared after startup.
  Results and game screenshot are under `.temp/snes-input-validation/`.
  The test blocked external HTTPS, so the optional update check logged a fetch
  failure; headless wake-lock denial did not affect input or rendering.
- Physical gamepad, two-machine netplay, and desktop manual gameplay are not
  established by this browser check.
- `npm.cmd run build:production`: PASS with default features and
  `AWS_LC_SYS_PREBUILT_NASM=1`; frontend (133 modules), optimized Rust binary,
  and NSIS bundle all completed. Existing warnings remain unchanged.
- Updated application: `src-tauri/target/release/CLX (0916).exe`; updated
  installer: `src-tauri/target/release/bundle/nsis/CLX (0916)_0.1.0_x64-setup.exe`.
  Final sizes, timestamps, and SHA-256 are recorded in
  `.temp/snes-input-validation/artifacts.json`; build log is beside it.
- The user's running Desktop executable was left running; these artifacts
  must be opened or installed after closing the older app.
- `git diff --check`: PASS.
