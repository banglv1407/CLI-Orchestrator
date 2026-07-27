# Validation

## Proof Strategy

Prove state transitions, visual bounds, cleanup, click compatibility, hidden
window recovery, and stable memory under repeated move and preview cycles.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Scheduler bounds, non-repeat, transition cancellation, viewport clamp |
| Integration | Registry switching, asset failure fallback, preview/live isolation |
| E2E | Select each pet, preview every move, click live pet to open AI |
| Platform | Windows 100/125/150% scaling |
| Performance | Ten-minute soak, 30 pet switches, 20 preview cycles |
| Logs/Audit | One bounded diagnostic per broken clip |

## Fixtures

- Built-in legacy sprites.
- Generic local pet pack with every supported move kind.

## Commands

```text
npm.cmd run build
cargo test --manifest-path src-tauri/Cargo.toml
scripts/runtime-memory-soak.ps1
```

## Acceptance Evidence

- `npm.cmd run build` passed on 2026-07-27 with the registry, animation
  scheduler, bounded effects, Settings controls, and 320x220 preview stage.
- `git diff --check` passed.
- The completed three-pet pack was installed into the real Windows CLX pet
  directory and the debug Tauri application started with a responsive `CLX`
  window.
- Manual click-compatibility, per-move preview review, display scaling, and the
  ten-minute interaction soak remain manual-only proof.
- On 2026-07-28 Settings gained per-pet Size (20-160px) and Speed
  (0.5x-2.0x) sliders plus Reset. Overrides persist in local storage and
  trigger the same registry event used by the live renderer, so preview and
  overlay receive one synchronized tuned pet definition.
- Frontend production build, debug Tauri no-bundle build, diff check, and
  responsive Windows startup passed after the tuning UI was added.
