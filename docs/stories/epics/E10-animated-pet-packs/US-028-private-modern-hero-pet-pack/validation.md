# Validation

## Proof Strategy

Combine human approval with deterministic frame geometry and alpha checks.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Frame dimensions, alpha corners, sheet/frame count |
| Integration | Manifest loads every final sheet |
| E2E | Preview and live rendering of every clip |
| Platform | Three themes and Windows display scaling |
| Performance | Active-pet sheets remain within cache limit |
| Logs/Audit | Prompt set and local output paths reported |

## Fixtures

- Approved master anchors and Goku animation contact sheet.

## Commands

```text
npm.cmd run build
cargo test --manifest-path src-tauri/Cargo.toml pet_commands
```

## Acceptance Evidence

- Two Goku Ultra Instinct and two Naruto Seventh Hokage master candidates were
  generated with the built-in image generator, copied only into the ignored
  local-pack directory, and converted to transparent PNGs.
- All four transparent candidates are 1254x1254 ARGB PNGs with transparent
  corner pixels.
- Both Spider-Man generation attempts were rejected by the image-generation
  moderation layer. No fallback model, substituted character, or final
  animation frames were produced for that character without approval.
- After the user asked to continue, Goku A and Naruto A became the default
  master selections. Five four-frame Goku clips were generated with Goku A as
  the identity anchor: idle, travel, blink, Instant Transmission, and
  Kamehameha.
- Every Goku strip is a 512x128 RGBA PNG composed of four 128x128 frames. Each
  strip is below 71 KiB and has transparent corner pixels.
- `npm.cmd run build` and `git diff --check` passed after the Goku gate-2 pack
  was assembled.
- The user approved `GATE-2-GOKU-CONTACT.png` by asking to continue. Five
  four-frame Naruto clips were then generated from Naruto A: idle, travel,
  blink, Shadow Clone Jutsu, and Rasengan.
- All ten Goku/Naruto strips match their declared 512x128 geometry, are RGBA,
  remain below 71 KiB each, and have transparent corner pixels.
- The two-pet `anime-heroes-modern` manifest now references both completed
  characters and their two special moves. `npm.cmd run build` and
  `git diff --check` passed after the Naruto pack was assembled.
- The user approved gate 3 and authorized finishing the work. The built-in
  generator also rejected an explicitly original Web Ranger request, so the
  third character was drawn deterministically with Pillow instead of silently
  switching image models.
- Web Ranger supplies idle, travel, blink, Web Shot, and Web Zip clips and is
  explicitly not represented as Spider-Man.
- All 15 final sheets across three pets match their declared 512x128 geometry,
  have transparent corners, and total 728,039 bytes.
- The real pack passed backend install/list/load smoke, a 5/5 focused Rust test
  run, `cargo check`, frontend production build, debug Tauri build, and
  responsive Windows application startup.
- On 2026-07-28 all three local pets were reduced from `displaySize: 96` to
  `32`, exactly one third of the prior runtime draw scale. A
  `speedMultiplier: 1.3` contract now increases travel velocity, frame
  playback, preview playback, and special-move timing by 30% while built-in
  pets remain at `1.0`.
- The updated installed pack was replaced through the backend smoke utility,
  returned three pets with `32 / 1.3`, loaded all 15 sheets, passed 5/5 focused
  Rust tests, frontend build, debug Tauri build, and responsive startup.
