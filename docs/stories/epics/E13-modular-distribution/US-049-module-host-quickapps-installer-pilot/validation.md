# US-049 Validation — Module host, Quick Apps pilot, and installer slice

## Proof Strategy

Automated proof exercises fail-closed contracts before code activation, builds
Core and Quick Apps separately, and verifies the absence of legacy static
boundaries. The produced NSIS artifact is exercised through silent per-user
fixtures for component selection, prerequisite rejection, Unicode paths, and
data-preserving removal.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Manifest/path/compatibility/dependency/state/entitlement/framing rules |
| Integration | Signed discovery, tampering, persistence, capability denial, sidecar containment |
| E2E | Core catalog and Quick Apps CRUD/icon/launch through generic calls |
| Platform | Core-only, add/remove/retain pack, Unicode path, WebView2, uninstall |
| Performance | Core-only process/network absence and 30-minute idle budget |
| Logs/Audit | Typed lifecycle errors and secret/RPC/argument redaction |

## Fixtures

- Deterministic non-production Ed25519 publisher seed.
- Valid Quick Apps pack and invalid signature/hash/path/target/dependency variants.
- Granted, denied, expired, and unavailable entitlement providers.
- Malformed, oversized, crashing, hanging, and noisy sidecar fixtures.
- Isolated per-user install roots, including a mixed-script path.

## Commands

```text
cargo test --workspace
npm.cmd run build
npm.cmd run build:modules
npm.cmd run verify:core-boundaries
npm.cmd run build:production
```

## Acceptance Evidence

Recorded on 2026-08-18:

| Proof | Result |
| --- | --- |
| Module contracts, host, capability, framing, and sidecar tests | PASS: 13 focused tests |
| Core and Quick Apps frontend builds | PASS: 124 and 36 modules transformed |
| Static Core/Quick Apps boundary check | PASS: no static panel or legacy commands |
| Signed release-mode validation pack | PASS: 3 payload files, 1,523,817 bytes |
| Host-to-sidecar JSON-RPC smoke | PASS: isolated root and valid list response |
| Generated NSIS component macro compile | PASS |
| Missing production signing key gate | PASS: packaging stops |
| Full Tauri adapter compile | PASS: `cargo check -p clx` with NASM 3.02 |
| Production NSIS build | PASS: `CLX_0.1.0_x64-setup.exe` produced |
| Core-only silent install | PASS: Quick Apps absent |
| Setup rerun add/remove/retain | PASS: pack selection and preselection correct |
| Installed pack and sidecar | PASS: hashes verified and JSON-RPC smoke passed |
| Mixed-script installation path | PASS |
| WebView2 missing/old rejection | PASS: exit 1603 and no install directory |
| Uninstall preservation | PASS: program/registry removed; user data unchanged |
| `cargo fmt --all -- --check` | PASS |
| `git diff --check` | PASS |

The validation Core executable is 34,838,016 bytes, the setup is 8,953,767
bytes, and the staged Quick Apps directory including its manifest is 1,525,137
bytes. A deterministic non-production seed was supplied only through the build
process environment; these measurements are not a production-signed baseline.

The installed WebView2 runtime for positive cases was 151.0.4129.86, above the
locked minimum 110.0.1531.0. Automation can select components with
`/CLXMODULES=none`, `/CLXMODULES=all`, or exact comma-separated module IDs.
The fail-only `/CLXTESTWEBVIEW2=missing|old` hook can force rejection but cannot
bypass the real prerequisite check.

The three focused E13 crates pass all 13 tests. A separate
`cargo test --workspace` attempt reached unrelated application dependencies but
stopped with Windows `os error 112` after drive D ran out of space while
creating debug metadata. The generated `target/debug` cache was then removed,
recovering 4.6 GiB; this environment-capacity failure is not counted as a test
pass.

Still pending and not claimed complete:

- Production release-key and Authenticode evidence.
- Upgrade/downgrade, interrupted-upgrade/rollback, repair, offline clean-profile,
  app-running, and sidecar-running installer cases.
- Interactive desktop Quick Apps CRUD/icon/launch regression.
- Process/network baseline and 30-minute Core-only idle soak.
- Extraction and validation of the remaining eight E13 modules.
