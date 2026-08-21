# US-049 Design — Module host, Quick Apps pilot, and installer slice

## Domain Model

`ModuleManifestV1` is the signed pack contract. It names the module, target,
Core and host API compatibility, UI contributions, optional sidecar, requested
capabilities, dependencies, entitlement, activation policy, immutable file
inventory, notices, and publisher signature.

`ModuleSnapshot` is the only UI-facing state projection. Its state is one of
`notInstalled`, `disabled`, `locked`, `ready`, `running`, `incompatible`,
`tampered`, or `failed`, and it carries typed entitlement, integrity, and error
results.

An `EntitlementProvider` returns `granted`, `denied`, `expired`, or
`unavailable`. Community V1 grants an installed first-party pack only after the
publisher and file checks succeed. A deterministic provider drives all four
states in tests.

## Application Flow

1. Core locates `$INSTDIR/modules/<module-id>/<version>/manifest.json`.
2. The boundary parser rejects oversized, unknown-version, malformed,
   traversal, duplicate, wrong-target, or unsupported manifests.
3. Core verifies the pinned Ed25519 publisher signature and every declared
   file size/SHA-256 hash before considering entitlement.
4. Dependency and compatibility checks produce a snapshot without executing
   module code.
5. `module_set_enabled` persists only enabled state under the existing CLX data
   root. It does not install or delete pack files.
6. UI and sidecars activate only after the snapshot reaches `ready`.
7. Generic `module_call` rechecks state, capability, method, and bounds before
   dispatch. Protocol failure isolates the pack.

## Interface Contract

Core Tauri commands introduced by this story:

- `module_catalog() -> ModuleSnapshot[]`
- `module_set_enabled(moduleId, enabled) -> ModuleSnapshot`
- `module_call(moduleId, method, params) -> JSON`
- `module_restart(moduleId) -> ModuleSnapshot`

Quick Apps methods are namespaced behind `clx.quickapps` and bounded. The Core
invoke surface does not expose feature-specific Quick Apps command names after
pilot extraction.

The UI pack exports `register(host: ClxUiHostV1)` from a signed ESM entrypoint.
It registers declared contribution IDs only. The host owns navigation slots,
error boundaries, teardown, and the generic RPC bridge.

The optional native pack process uses JSON-RPC 2.0 over stdio with
`Content-Length` framing. Stdout is protocol-only; stderr is bounded logs. Core
starts an exact verified absolute path with a short-lived token and bounded
message/queue/restart limits.

## Data Model

No user-data migration occurs. Existing Quick Apps JSON remains under
`~/.ai-cli-manager/quickapps`, and icon cache remains under the existing data
root. Core adds a versioned module preference file containing enabled states;
it is written atomically and preserves unknown future fields by schema version.

Installed code lives outside the data root at
`$INSTDIR/modules/<module-id>/<version>`. Removing a pack never removes its user
data.

## UI / Platform Impact

- Windows x64, current-user NSIS is the only production bundle target.
- Core-only is selected on fresh installs.
- Quick Apps appears as an optional Components-page section.
- The Core frontend owns generic contribution slots and Module Manager status.
- A missing/disabled/locked Quick Apps pack contributes no tab, component,
  timer, process, or network work.
- WebView2 is skipped by Tauri bundling and preflighted as an external minimum
  prerequisite.

## Observability

Module logs carry module ID, version, lifecycle action, typed outcome, and a
redacted error code. Manifest contents, launch tokens, credentials, RPC bodies,
and user Quick Apps arguments are not emitted. Sidecar stderr and crash restart
history are bounded.

## Alternatives Considered

1. Installer checkbox only: rejected because Tauri embeds the static frontend
   graph in Core, so it would not reduce Core or runtime ownership.
2. Hide icons as licensing: rejected because UI visibility is not an
   entitlement boundary.
3. In-process Quick Apps implementation behind generic commands: rejected as
   the final pilot shape because it retains feature code/dependencies in Core.
4. Online module downloads: rejected by E13's offline all-in-one decision.

