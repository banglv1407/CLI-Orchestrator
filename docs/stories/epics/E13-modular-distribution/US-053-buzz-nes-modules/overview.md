# US-053 Overview — Buzz and NES modules

Status: Not started

Extract Buzz workspace and NES multiplayer into `clx.buzz` and `clx.nes`.
Both share the same identity vault (Windows Credential Manager) but must be
independently installable — NES purchasable without Buzz per E13 plan.

Buzz scope:
- `core/buzz_manager.rs`, `buzz_identity.rs`, `buzz_live.rs`, `buzz_types.rs`
  (~1,013 LOC)
- `commands/buzz_commands.rs` (~199 LOC)
- `src/components/BuzzWorkspacePanel.tsx` (~1,526 LOC)
- `src/components/BuzzNesSettings.tsx` (~341 LOC) — shared settings, needs split
- `src/lib/buzz.ts` (~158 LOC)

NES scope:
- `core/nes_client.rs`, `nes_identity.rs`, `nes_rom.rs`, `nes_types.rs` (~470 LOC)
- `commands/nes_commands.rs` (~111 LOC)
- `crates/nes-protocol/`, `crates/nes-session/` — already separate crates
- `src/components/NesWorkspacePanel.tsx` (~921 LOC)
- `src/components/NesKeyConfigModal.tsx` (~234 LOC)
- `src/lib/nes.ts`, `nes-emulator.ts`, `nes-input.ts` (~644 LOC)

Identity vault must be a shared Core service (credential broker) since both
modules and potentially future modules use it.
