# US-049 Exec Plan — Module host, Quick Apps pilot, and installer slice

## Goal

Produce the first executable E13 vertical slice: versioned module contracts,
a fail-closed Core module host, a Quick Apps pilot pack, and an NSIS installer
component that can install Core with or without that pack.

## Scope

In scope:

- Rust and TypeScript `ModuleManifestV1`, runtime-state, entitlement, UI-host,
  capability, and sidecar protocol contracts.
- Windows x64 pack discovery, compatibility, signature/hash verification,
  entitlement enforcement, enabled-state persistence, and generic Core module
  commands.
- Community and deterministic test entitlement providers.
- Quick Apps as the first separately built UI/native pack.
- Stable release identity, NSIS-only per-user bundling, WebView2 prerequisite
  policy, and the generated Quick Apps component section.
- Automated unit/integration proof plus build-time checks proving the Core
  frontend does not statically import Quick Apps.

Out of scope:

- Extraction of API Client, Proxy, AI Companion, Local LLM, SSH, Buzz, NES, or
  Pet; these remain later E13 stories.
- Production release keys, Authenticode credentials, account licensing,
  third-party packs, downloads, or a marketplace.
- Claiming the full install/modify/upgrade/rollback matrix without Windows
  installer smoke fixtures.

## Risk Classification

Risk flags:

- Audit/security.
- Public contracts.
- Existing behavior.
- Platform shell and installer behavior.
- Weak proof around the current release path.
- Multi-domain frontend/backend/distribution change.

Hard gates:

- Signature, hash, entitlement, and capability checks must fail closed.
- No validation requirement from E13 may be removed or weakened.
- User data must not be deleted by module removal or uninstall defaults.

## Work Phases

1. Capture baseline and dependency/static-import seams.
2. Add shared contracts and deterministic security tests.
3. Add Core discovery, state machine, entitlement, and generic commands.
4. Build and integrate the Quick Apps pilot pack.
5. Add the NSIS component-generation and release configuration slice.
6. Run build/test/security checks and update Harness evidence.

## Stop Conditions

Pause for human confirmation if:

- A locked product decision in `../plan.md` must change.
- Implementing the pilot would delete or migrate existing Quick Apps data.
- A production signing private key or certificate would need to enter the repo.
- The installer cannot preserve the current per-user data root.
- Validation requirements need to be weakened.

