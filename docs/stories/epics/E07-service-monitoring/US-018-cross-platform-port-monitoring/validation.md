# Validation

## Proof Strategy

Use deterministic parser and command-boundary tests, in-process SSH fixtures for
direct and jump routes, real local listener tests, UI state tests, and platform
smokes on Ubuntu, Red Hat-family, and Windows OpenSSH targets.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Exact TCP matching, IPv4/IPv6 dedupe, process identity, source ranking, migration, secret redaction |
| Integration | Direct/jump auth, log streaming/cancel, stale PID rejection, normal/force kill, sudo stdin |
| E2E | Create each monitor type, open/pause/resume logs, confirm selected/all kill |
| Platform | Local Windows, Ubuntu direct, Red Hat via jump, Windows OpenSSH via jump |
| Performance | Grouped polling and bounded 5,000-line/2 MiB viewer buffer |
| Logs/Audit | No SSH, key-passphrase, or sudo secrets in app/system logs |

## Fixtures

- Local ephemeral TCP listener and rotating log file.
- In-process target and forwarding SSH servers with distinct credentials.
- Linux and PowerShell command-output fixtures.

## Commands

```text
npm.cmd run build
cargo test --manifest-path src-tauri/Cargo.toml
npm.cmd run test:integration
npm.cmd run test:platform
```

## Acceptance Evidence

Implementation completed on 2026-07-19.

- `npm.cmd run build`: PASS (`tsc` plus Vite production build, 59 modules).
- `cargo check --manifest-path src-tauri/Cargo.toml`: PASS.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS (42 passed, 1
  live-provider test ignored by its existing test annotation).
- `cargo test --manifest-path src-tauri/Cargo.toml monitoring -- --nocapture`:
  PASS (9 monitoring-focused tests).
- Focused `rustfmt --check` for the two monitoring backend modules: PASS.
- Secret serialization, exact port matching, IPv4/IPv6 PID dedupe, typed
  identifier validation, numeric kill commands, required process start identity,
  and duplicate PID rejection are covered by unit tests.

Not executed in this workspace:

- Direct/jump smoke tests against real Ubuntu, Red Hat-family, and Windows
  OpenSSH hosts require external hosts and credentials that were not provided.
- Manual Tauri E2E interaction was not run.
- The repository's existing `npm.cmd run test:integration` command fails because
  no Cargo test target matches the literal `'*'` pattern. The referenced
  `scripts/platform-smoke-check.cjs` file also does not exist. These validation
  harness gaps are outside US-018 and are not counted as proof.
