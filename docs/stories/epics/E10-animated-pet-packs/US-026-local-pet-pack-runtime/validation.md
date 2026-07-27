# Validation

## Proof Strategy

Prove that valid packs load, invalid or malicious packs fail closed, and
built-in pets remain usable after every failure.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Schema, IDs, duplicate pets, traversal, symlink, size and geometry limits |
| Integration | Install, list, load asset, confirmed replace, rollback |
| E2E | Import from Settings and select a local pet |
| Platform | Windows folder selection and app-data installation |
| Performance | Lazy loading and bounded decoded cache |
| Logs/Audit | Errors exclude binary data and secret paths |

## Fixtures

- Tiny valid two-clip PNG pack.
- Unsupported version, missing asset, escaping path, and malformed sheet packs.

## Commands

```text
cargo test --manifest-path src-tauri/Cargo.toml pet_commands
npm.cmd run build
```

## Acceptance Evidence

- `npm.cmd run build` passed on 2026-07-27 after the Tauri wrappers and Settings
  import flow were wired.
- `rustfmt --check --edition 2021 src-tauri/src/commands/pet_commands.rs`
  passed.
- `cargo test --manifest-path src-tauri/Cargo.toml --no-default-features --lib
  pet_commands` passed 5/5 tests, including traversal and geometry rejection,
  replacement, deterministic install/list/load, and the real three-pet pack.
- The real pack was installed through `pet_install_pack` into the Windows CLX
  pet directory; `pet_list_packs` returned three pets and `pet_load_asset`
  loaded all 15 declared animation sheets.
- `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`
  passed, as did a debug Tauri no-bundle build.
- The full binary test target remains blocked only by pre-existing RTK,
  Ponytail, and reasoning test initializers outside the pet module.
