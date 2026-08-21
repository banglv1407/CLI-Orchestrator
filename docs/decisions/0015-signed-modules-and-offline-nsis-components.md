# ADR 0015: Signed modules and offline NSIS components

- Status: Accepted
- Date: 2026-08-17
- Initiative: E13
- Story: US-049

## Context

CLX currently statically links optional Rust dependencies and imports optional
React features into one Tauri frontend. Installer checkboxes alone cannot make
that executable modular because `frontendDist` is recursively embedded in the
application binary. CLX also needs a real future licensing seam without adding
an account service to V1.

## Decision

CLX Core is a stable per-user Windows x64 Tauri application. First-party packs
are separately built signed payloads installed under
`$INSTDIR/modules/<module-id>/<version>`. Core accepts only manifests signed by
a pinned CLX Ed25519 publisher key, verifies compatibility and every declared
file hash, asks an `EntitlementProvider`, and checks requested capabilities
before loading UI or starting an optional sidecar.

Optional UI is a signed ESM bundle registered through versioned host contracts;
Core has no static import of optional feature components. Optional native code
runs out of process over bounded JSON-RPC 2.0 stdio framing. Feature-specific
Tauri commands are replaced by generic module catalog, state, call, and restart
operations as each feature is extracted.

V1 uses `CommunityEntitlementProvider`, which grants verified installed
first-party packs. Deterministic denied, expired, and unavailable providers are
mandatory test fixtures, so licensing can change later without changing module
APIs.

Distribution is one offline NSIS setup with a mandatory Core section and
optional component sections. Fresh setup selects Core only; setup rerun is the
file-level add/remove path. Runtime enablement remains separate and never
deletes user data. WebView2 is an external minimum-version prerequisite and is
not downloaded or embedded.

## Consequences

- Setup size still contains every pack, but Core-only installed footprint and
  runtime ownership become measurable.
- Release builds require two signing systems: Authenticode for setup/native
  executables and Ed25519 for pack manifests. Private keys stay outside the
  repository.
- Host SDK and manifest compatibility become public contracts that need version
  negotiation and deterministic fixtures.
- Module UI cannot assume arbitrary Core imports; it must use declared host
  contributions and generic RPC.
- Extraction is incremental. Until a feature's story is complete, it remains in
  the legacy monolith and is not represented as modular proof.

