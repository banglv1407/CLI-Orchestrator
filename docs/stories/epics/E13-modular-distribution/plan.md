# E13 — CLX Modular Offline Installer

Status: In progress; US-049 implements and validates the Phase 1-3 Quick Apps vertical slice
Target: Windows x64, per-user  
Date: 2026-08-17

## Summary

CLX will move from one executable containing every feature to:

- A mandatory CLX Core installed per-user through NSIS.
- One offline setup containing every first-party feature pack but extracting
  only the components selected by the user.
- Core-only as the default for a fresh installation.
- Setup rerun as the supported way to add or remove pack files.
- Runtime enable/disable controls inside CLX for packs already installed.
- A CommunityEntitlementProvider in V1 that grants every installed first-party
  pack while preserving the real entitlement boundary for a future licensing
  service.
- WebView2 as an external prerequisite; the installer will not download or
  embed the runtime.

An offline all-in-one setup does not reduce the setup download size because it
still carries every compressed pack. It reduces installed footprint and ensures
unselected modules consume no runtime resources.

Tauri supports a custom NSIS installer template, and NSIS supports a Components
page backed by separate sections. Tauri recursively embeds the current
frontendDist into the application binary, so optional UI must be removed from
the Core frontend bundle before installer checkboxes can provide real modular
installation.

References:

- https://v2.tauri.app/distribute/windows-installer/
- https://v2.tauri.app/reference/config/
- https://nsis.sourceforge.io/Docs/Chapter2.html

## Locked Product Decisions

- Distribution: one offline all-in-one setup.
- Platform: Windows x64 only.
- Install scope: per-user under LocalAppData.
- Fresh-install preset: Core only.
- Maintenance: rerun setup to add or remove pack files.
- Runtime packaging: signed full-UI pack plus optional backend sidecar.
- Catalog: individual technical modules; commercial bundles map to multiple
  entitlement IDs instead of producing different binaries.
- Publisher policy: only CLX-signed first-party packs in V1.
- Licensing V1: contract-first Community grant, with no production licensing
  backend yet.
- Local LLM: a separate add-on that requires AI Companion.
- WebView2: prerequisite, not bundled and not downloaded.

## Core and Module Catalog

CLX Core contains:

- Terminal PTY and local session management.
- CLI Manager and project registry.
- Local Explorer, Git surfaces, file viewer and editor.
- Local Dashboard monitoring.
- Notepad, Settings and System Logs.
- Module Manager, module verifier, entitlement broker and capability broker.
- A generic Windows credential broker used by signed modules.

| Pack ID | Responsibility | Relationship |
| --- | --- | --- |
| clx.quickapps | Quick Apps UI, registry, icon extraction and launcher | Independent |
| clx.api-client | API Client UI and request, stream and cancel runtime | Independent |
| clx.buzz | Buzz workspace, live subscriptions and Buzz binaries | Uses the Core credential broker |
| clx.nes | JSNES, ROM boundary and netplay client | Independent from Buzz; uses the same credential broker |
| clx.pet | Pet engine, overlay, built-in sprites and local-pack importer | Fresh background/overlay state is off |
| clx.ai-companion | Companion chat, history, approvals and capability tools | Proxy, SSH and Quick Apps are optional capabilities |
| clx.cli-proxy | OpenAI-compatible proxy, routing, usage and logs | Independent |
| clx.ssh | SSH terminal, remote files, transfer and remote monitoring | Registers remote transports with Core |
| clx.local-llm | Candle, tokenizers and local inference runtime | Requires clx.ai-companion |

NES must remain purchasable and usable without Buzz. AI Companion must call an
OpenAI-compatible endpoint directly when CliProxyAI is absent and expose only
the tools whose provider modules are installed, enabled and entitled.

The Pet pack includes the current engine, bundled assets and local import
support. Premium pet content packs and their own entitlements are a later
initiative.

## Public Contracts

### ModuleManifestV1

Each pack manifest includes:

- Schema version, module ID, version, publisher and Windows x64 target.
- Required Core version range and host API version.
- UI contributions such as main panel, Settings section, sidebar badge,
  command-palette action or overlay.
- Optional sidecar entrypoint and protocol version.
- Requested capabilities and required module dependencies.
- Entitlement ID and background activation policy.
- File paths, sizes and SHA-256 hashes.
- License and NOTICE entries.
- Ed25519 signature metadata and key ID.

### Runtime State

ModuleSnapshot exposes:

- notInstalled
- disabled
- locked
- ready
- running
- incompatible
- tampered
- failed

The snapshot also includes module version, installed size, entitlement result,
integrity result and the most recent typed error.

### Entitlements

EntitlementProvider returns one of:

- granted
- denied
- expired
- unavailable

V1 ships CommunityEntitlementProvider, which grants installed CLX-signed packs.
Automated tests must also run a deterministic provider covering locked, expired
and unavailable states so a later account or licensing provider can replace the
Community provider without changing module APIs.

Entitlement is enforced by Core before:

- Mounting module UI.
- Starting a sidecar.
- Dispatching a module RPC call.
- Granting a requested Core capability.

Hiding a sidebar icon is never treated as licensing enforcement.

### UI and Sidecar Protocols

- Optional UI is built as a separate signed ESM bundle and loaded only after
  manifest, compatibility, signature and entitlement checks pass.
- Modules register contributions through ClxUiModuleV1 and a versioned host SDK.
- Module files are served through a traversal-safe clx-module protocol.
- Core frontend code must not statically import optional feature components.
- Sidecars use bidirectional JSON-RPC 2.0 over stdio with Content-Length framing.
- Stdout is protocol-only; stderr is the bounded operational log stream.
- Sidecars are launched using an exact verified absolute path, never PATH
  discovery.
- Sidecars receive a short-lived launch/capability token and are stopped on
  disable, app exit or protocol failure.
- Malformed frames, oversized payloads, crash loops and capability violations
  isolate the module without crashing Core.

The Core Tauri invoke surface is reduced to generic module operations such as:

- module_catalog
- module_set_enabled
- module_call
- module_restart

Feature-specific commands are removed from the Core handler as their modules
are extracted.

## Security Boundary

- Only manifests signed by a pinned CLX publisher key are accepted.
- Pack signing uses an Ed25519 release key held outside the repository.
- Setup and native executables are Authenticode-signed.
- Pack hashes are checked before UI load and sidecar start.
- The current null CSP is replaced with an explicit policy that blocks remote
  scripts and limits module assets to verified local origins.
- Core capabilities are allowlisted per manifest and checked for every request.
- Credentials are returned only through scoped broker calls and never persisted
  in manifests, command-line arguments or logs.
- Module protocol buffers, queues, event rates and file-transfer chunks are
  bounded.
- A tampered or incompatible module fails closed and presents a repair message.

This boundary improves commercial enforcement and tamper resistance but is not
presented as unbreakable desktop DRM.

## Installer Design

Enable Tauri bundling with NSIS as the only production target and use a custom
installer template. The build orchestrator stages Core and all signed packs,
then generates a modules.nsh include containing component sections, file lists,
sizes and dependency rules.

Installer behavior:

- Core is mandatory and cannot be deselected.
- All nine add-ons appear as optional component sections.
- Fresh installs select Core only.
- Selecting Local LLM automatically selects and locks AI Companion.
- Component selection is independent from entitlement.
- Installed pack payloads live under:
  $INSTDIR\modules\<module-id>\<version>
- Enabled state and user data remain under the existing
  ~/.ai-cli-manager data root.
- Installed packs are available in Module Manager and enabled as UI
  capabilities, but background work remains off until explicitly configured.
- Buzz background live mode, Pet overlay, Proxy autostart and Local LLM loading
  are off for fresh installations.
- The app may enable or disable an installed pack immediately but does not
  install or delete its files.
- Module Manager directs the user to rerun CLX Setup for file-level changes.

Upgrade and recovery:

- A newer setup preselects the modules already installed.
- Detecting an existing portable CLX data root defaults migration to the Full
  preset so current behavior is preserved; the user may explicitly deselect
  modules before continuing.
- Setup requires CLX and module sidecars to close cleanly before replacing
  binaries.
- New versions are staged and verified before becoming active.
- An interrupted or invalid upgrade retains the last usable version.
- Removing a module or uninstalling CLX preserves module data by default.
- Deleting user data requires a separate explicit confirmation.

Release identity:

- Keep product name CLX and binary name clx.exe stable.
- Remove the MMDD suffix from executable and product names because it breaks
  normal installer upgrade identity.
- Show build date in About/build metadata instead.
- Use synchronized SemVer across package, Cargo and Tauri configuration.
- Name setup artifacts CLX_<version>_x64-setup.exe.

WebView2 policy:

- Use webviewInstallMode skip.
- Preflight WebView2 version 110.0.1531.0 or newer.
- If absent or too old, stop installation with a clear prerequisite message
  and official installation guidance.
- Do not download WebView2 and do not include its offline runtime.

## Implementation Sequence

### Phase 1 — Contract and Baseline

- Create the high-risk Harness initiative and architecture decision.
- Record current executable, frontend bundle, installed footprint, startup
  process tree, network activity and 30-minute idle behavior.
- Add the module manifest, catalog, state and entitlement contracts.
- Establish the Cargo workspace and shared Rust/TypeScript module SDKs.

### Phase 2 — Module Host and Quick Apps Pilot

- Implement pack discovery, signature verification, compatibility checks and
  the state machine.
- Implement the Community entitlement provider and capability broker.
- Implement the UI loader, host contribution slots and sidecar supervisor.
- Extract Quick Apps end to end and prove that Core no longer contains its UI,
  commands or native dependencies.

### Phase 3 — Installer Vertical Slice

- Enable Tauri NSIS bundling and stable release identity.
- Add the custom Components page and generated Quick Apps section.
- Prove Core-only, Core plus Quick Apps, add, remove, upgrade and rollback.
- Add Authenticode and pack-signing release gates.

Implementation status (2026-08-18): the Quick Apps vertical slice now builds a
release-mode signed pack and a working NSIS setup. Core-only and Core + Quick
Apps installs, setup rerun add/remove/retain behavior, Unicode paths, WebView2
fail-fast checks, installed sidecar operation, and data-preserving uninstall
have executable evidence. Production Authenticode, upgrade/rollback, app/sidecar
running guards, desktop interaction regression, and the runtime soak remain
open before Phase 3 can be declared release-complete.

### Phase 4 — Remaining Module Extraction

Extract and validate in this order:

1. API Client and CliProxyAI.
2. AI Companion and Local LLM.
3. SSH transport, remote files and remote monitoring.
4. Buzz and NES while preserving their shared identity behavior.
5. Pet settings, local packs and full-window overlay contribution.

Every extraction removes static frontend imports, Rust command registration,
AppState initialization and dependencies that are no longer required by Core.

Checkpoint status (2026-08-19): Phase 4 COMPLETE. All 9 module packs are now
independently signed and bundled:
  1. clx.quickapps  (sidecar + UI)
  2. clx.api-client (sidecar + UI)
  3. clx.cli-proxy  (sidecar + UI)
  4. clx.ai-companion (sidecar + UI)
  5. clx.local-llm  (sidecar + UI)
  6. clx.ssh         (sidecar + UI)
  7. clx.buzz        (sidecar + UI)
  8. clx.nes         (sidecar + UI)
  9. clx.pet         (UI only — lightweight filesystem logic stays in Core)

Core has been stripped of: candle-core, candle-transformers, tokenizers, russh,
russh-keys, tokio-tungstenite, nes-protocol, k256, all companion/builtin_llm/
buzz/nes backend modules, and SSH server manager. SSH client logic is isolated
in the shared clx-ssh-client crate for remote monitoring probes.

Next: Phase 5 — Migration and Release Hardening.

### Phase 5 — Migration and Release Hardening

- Add migration detection for the existing portable application.
- Complete install, modify, upgrade, repair and uninstall behavior.
- Run security, size, performance and full feature regression proof.
- Update product docs, Harness matrix evidence and release documentation.

## Validation and Acceptance

### Contract and Security

- Manifest parsing, dependency resolution and version compatibility.
- Correct signature and hash acceptance.
- Unknown publisher, modified file, traversal and wrong architecture rejection.
- Entitlement granted, denied, expired and unavailable behavior.
- Unauthorized capability and direct sidecar launch rejection.
- JSON-RPC framing, bounded queues, malformed messages and crash containment.
- Secret and log redaction.

### Installer Matrix

- Core-only fresh installation.
- Every individual pack with Core.
- Full installation.
- Local LLM dependency selection.
- Rerun setup to add or remove packs.
- Upgrade and downgrade rejection.
- Existing portable data migration.
- App-running and sidecar-running cases.
- Unicode user and installation paths.
- Complete installation with network disabled and WebView2 already present.
- Missing WebView2 prerequisite failure.
- Uninstall with user data preserved and confirmed data deletion.

### Feature Regression

- Quick Apps launch and icon handling.
- API Client request, streaming and cancellation.
- CliProxyAI SSE, routing, config, usage and logs.
- AI Companion streaming, history, approvals and capability discovery.
- Local LLM explicit load, inference and unload.
- SSH terminal, file operations, transfer and monitoring.
- Buzz channels, DMs, unread state and live subscription.
- NES local play, ROM boundary and netplay.
- Pet import, validation, tuning, overlay and disabled-state cleanup.

### Size and Runtime Proof

- Report Core executable size, each pack size, Core-only installed footprint,
  Full footprint and final setup size.
- Core build contains no optional UI bundles or optional Cargo dependencies.
- An absent or disabled module loads no UI, starts no child process and owns no
  timer, poll, websocket or network request.
- Sidecars start only on demand unless the user explicitly enables a declared
  background capability.
- Core-only 30-minute idle soak after warm-up has no optional process or
  network activity, total UI-owned RAM growth below 30 MiB and slope below
  1 MiB per minute.

Release validation adds:

- cargo test --workspace
- Core and per-module frontend builds.
- Pack signature and manifest verification.
- Offline NSIS install, modify, upgrade and uninstall smoke.
- Harness matrix and release evidence updates.

## Explicit Non-Goals

- Real account, checkout, trial, activation, device limits or revocation service.
- Third-party pack installation, trust store or marketplace.
- Online module downloads or an in-app package installer.
- Cross-platform installers or Windows ARM64.
- Automatic application updates.
- Bundling ROMs, local LLM model weights, Buzz relay, NES session service or
  coturn deployment.
- Premium pet-content entitlements.
- Shipping a production portable edition alongside the installer.
