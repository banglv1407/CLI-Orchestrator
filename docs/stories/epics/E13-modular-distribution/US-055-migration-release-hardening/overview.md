# US-055 Overview — Migration and Release Hardening (Phase 5)

Status: Not started

Complete E13 with portable migration, upgrade/rollback, security/performance
proof, and full feature regression across all 9 module packs.

Scope (from E13 plan Phase 5):
1. Migration detection for existing portable application.
2. Complete install, modify, upgrade, repair and uninstall behavior.
3. Security, size, performance and full feature regression proof.
4. Update product docs, Harness matrix evidence and release documentation.

Includes:
- Authenticode signing for setup and all executables.
- App/sidecar running guards (require clean shutdown before binary replace).
- Upgrade and downgrade rejection.
- Core-only 30-minute idle soak (no optional process or network activity).
- Full installer matrix (every individual pack, full install, add/remove).
- `cargo test --workspace` green.
