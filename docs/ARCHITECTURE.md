# Architecture

CLX is a Windows-first Tauri 2 desktop application with a React/Vite frontend,
a Rust Core process, local and SSH terminal/file capabilities, and optional
native services. The repository is a Cargo workspace rooted at `Cargo.toml`;
the desktop application lives in `src-tauri` and the Core frontend lives in
`src`.

## Current Modular Boundary

E13 introduces signed, versioned first-party modules without adding online
downloads or third-party trust. Core owns discovery, verification,
entitlement, capability checks, contribution slots, and sidecar lifecycle.
Optional code lives under `modules/<module-id>` and its shared/runtime crates
live under `crates/`.

```text
NSIS Setup
  -> CLX Core (required)
  -> modules/<module-id>/<version> (optional signed packs)

CLX Core
  -> clx-module-contracts (manifest, state, entitlement types)
  -> clx-module-host (verify, authorize, load UI, supervise sidecars)
  -> clx-module:// verified local UI assets
  -> JSON-RPC 2.0 / Content-Length / stdio
       -> clx-quickapps-sidecar (first extracted pilot)
       -> clx-api-client-sidecar (HTTP request and bounded stream polling)
```

Core accepts only a pinned Ed25519 publisher key, checks the signed file
inventory before activation, and resolves the newest valid compatible version.
If an interrupted upgrade leaves a newer invalid pack, the last verified
version remains usable. Module enabled state and user data remain under the
existing `.ai-cli-manager` data root; installer add/remove operations affect
pack code only.

The Core Tauri surface for optional features is generic:
`module_catalog`, `module_set_enabled`, `module_call`, and `module_restart`.
The Core frontend must not statically import optional UI bundles. Signed UI is
served through the traversal-safe `clx-module` protocol only after integrity,
compatibility, entitlement, and enabled-state checks pass. Sidecars receive a
per-launch token, are started by exact verified path, and stop on disable,
restart, protocol failure, or application exit.

Production distribution is current-user Windows x64 NSIS. Core is mandatory,
fresh installs select no optional modules, and rerunning Setup is the supported
file-level add/remove path. WebView2 110.0.1531.0 or newer is an external
prerequisite; Setup does not download or embed it.

## General Boundary Guidance

The remaining sections retain the repository's general layering guidance and
apply to Core and future module extractions.

## Discovery Before Shape

Before proposing implementation shape, identify:

- Product surfaces: browser, mobile, desktop, CLI, API, worker, or service.
- Runtime stack: language, framework, database, queues, providers, and hosting.
- Core domains: the product concepts that deserve stable names and contracts.
- Boundary inputs: user input, API requests, webhooks, jobs, files, credentials,
  provider payloads, and environment configuration.
- Validation ladder: the smallest checks that can prove the selected stack.

Record stack choices in `docs/decisions/` when they meaningfully constrain
future work.

## Default Layering

```text
domain
  <- application
      <- infrastructure
          <- interface
              <- app surfaces
```

## Candidate Structure

```text
app/
  domain/
    entities/
    value-objects/
    repositories/
    services/

  application/
    commands/
    queries/
    handlers/

  infrastructure/
    database/
    logging/
    notifications/

  interface/
    controllers/
    dto/
    presenters/
    routes/
    middlewares/

surfaces/
  browser/
  mobile/
  desktop/
  cli/
```

This is a thinking template, not a scaffold. Create real folders only when a
story enters implementation and the selected stack needs them.

## Dependency Rule

Inner layers must not depend on outer layers.

| Layer | May depend on | Must not depend on |
| --- | --- | --- |
| domain | nothing project-external except tiny pure utilities | framework, database, UI, provider, process/env |
| application | domain | framework, UI, provider, database concrete clients |
| infrastructure | domain, application | interface controllers or UI |
| interface | all backend layers | UI state or platform shell assumptions |
| app surfaces | API contracts and app-facing clients | domain internals directly |

## Parse-First Boundary Rule

Unknown data must be parsed at boundaries before it enters inner code.

Boundaries include:

- HTTP request bodies, params, and query strings.
- Session payloads and identity claims.
- Environment variables.
- Database rows returned from external clients.
- Platform shell payloads.
- Deep links, tokens, and signed URLs.
- Provider webhooks, events, and async payloads.

Target flow:

```text
unknown input
  -> parser
  -> typed DTO or command
  -> application use case
  -> domain object/value object
```

Inner layers should work with meaningful product types such as `UserId`,
`AccountId`, `WorkspaceId`, `Role`, `DateRange`, or domain-specific IDs,
rather than repeatedly validating raw strings.

## Command/Query Boundary

If the product has both reads and writes, keep command/query separation clear at
the code level even when the storage layer is simple:

- Commands mutate state and own audit side effects.
- Queries read state and format for consumers.
- Shared domain rules live in domain/application, not controllers.

## Observability Contract

The future server should emit one canonical JSON log line per request with:

- timestamp
- level
- request_id
- user_id when known
- action
- duration_ms
- status_code
- message

Audit logs are product records. Application logs are operational records. Do not
use one as a substitute for the other.
