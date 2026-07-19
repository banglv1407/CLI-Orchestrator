# E05 — Built-in AI Platform Plan

## Status

Completed. All user stories (US-007 to US-011) fully implemented and verified.

## Goal

Extend CLI Orchestrator with durable per-backend proxy usage, a category-based
Settings experience, secure in-app Web AI profiles, and a bundled Open
Interpreter agent client on Windows x64.

Implementation is split into five Harness stories, in this order:

1. **US-007 — Settings Navigation:** Settings left rail and routed main content.
2. **US-008 — Proxy Usage and Model Routing:** durable token totals, reset, and
   backend-aware model routing.
3. **US-009 — Secure Web AI:** isolated child WebView profiles and pet routing.
4. **US-010 — Open Interpreter Runtime:** bundled runtime, ACP manager, and
   sandbox integration.
5. **US-011 — Open Interpreter Client:** full agent UI, workspace threads, and
   approval flow.

Each story must use the Harness high-risk workflow, with its own product
contract or decision record, trace, validation plan, and acceptance evidence.

The Open Interpreter integration targets the current Rust project, not the old
Python codebase. CLX will communicate through `interpreter acp`, allowing CLX
to own the UI while Open Interpreter owns agent sessions, tools, providers, and
sandbox behavior.

References:

- [Open Interpreter README](https://github.com/openinterpreter/openinterpreter/blob/main/README.md)
- [Open Interpreter ACP documentation](https://github.com/openinterpreter/openinterpreter/blob/main/docs/acp.md)

## Confirmed Product Decisions

- Phase one supports Windows x64 only.
- Settings categories live in a rail inside the Settings view; the global
  sidebar retains one Settings icon.
- Open Interpreter is a separate activity item in the main area.
- Web AI is opened from the mythical pet or Command Palette, without a separate
  global activity icon.
- Native AI Companion remains accessible from the Command Palette only.
- Web AI v1 uses custom URLs and browser-managed sessions. It does not provide
  presets, a password vault, raw-cookie access, or DOM automation.
- Web AI allows all HTTPS navigation, plus HTTP for localhost and 127.0.0.1.
- Token totals are persistent and exact-first. Missing provider usage is shown
  explicitly instead of estimated.
- Token reset is per backend and requires confirmation.
- Open Interpreter is bundled with CLX releases and cannot self-update.
- Open Interpreter sends model traffic through CliProxyAI.
- Open Interpreter threads are grouped by workspace.
- Its default permission mode is `workspace-write` with approval, while tool
  shell network access is disabled.
- The Open Interpreter UI is a full ACP client rather than a simple chat box.
- The selected proxy backend is tried first for Open Interpreter requests, then
  existing proxy fallback behavior applies.

## US-007 — Settings Navigation

### Settings shell

- Keep one Settings icon in the global sidebar.
- Render a category rail on the left and the active category in the main
  content pane.
- Use these stable section IDs:

  ```text
  appearance
  mythical-pet
  ai-companion
  local-llm
  open-interpreter
  web-ai
  navigation
  ```

- Split the existing monolithic Settings panel into a shell and section
  components while preserving all current storage keys and behavior.
- Persist the last selected section in localStorage.
- On narrow windows, replace the rail with a select or drawer without changing
  section IDs or routing.
- Provide a typed `openSettings(section)` navigation entrypoint for the Command
  Palette, empty states, and other panels.

### Existing feature migration

- The AI Companion configuration modal becomes a shortcut to
  `ai-companion`; it no longer owns a second configuration form.
- Add Command Palette actions for AI Companion, Open Interpreter, Web AI, and
  each Settings section.
- Add Open Interpreter to the configurable primary sidebar order.
- When loading an old sidebar order, append the new item without changing the
  user's existing order or the pinned-group invariant.

## US-008 — Proxy Usage and Model Routing

### Stable backend identity

- Add a stable UUID `id` to `ProxyBackend` in Rust and TypeScript.
- On first load of a legacy `proxy.json`, assign IDs to missing backends and
  save the migrated configuration once.
- Renaming a backend preserves its ID and usage. Deleting and recreating a
  backend creates a new ID and starts at zero.

### Durable usage store

- Store aggregates in `~/.ai-cli-manager/proxy-usage.db` using the existing
  SQLite stack rather than deriving them from the capped in-memory proxy logs.
- Use one row per backend ID with atomic increment and reset operations.
- The public DTO is:

  ```text
  ProxyBackendUsage {
    backendId,
    promptTokens,
    completionTokens,
    totalTokens,
    reportedRequests,
    unreportedRequests,
    resetAt,
    updatedAt
  }
  ```

- Add Tauri commands `proxy_get_usage` and `proxy_reset_usage`.
- A request that is in flight during reset and completes afterward belongs to
  the new reset epoch.
- Emit `proxy-usage-updated` after committing an aggregate. The Proxy UI also
  refreshes usage when opened so a missed event cannot leave stale totals.

### Exact-first accounting

- For non-streaming responses, count only valid provider-reported `usage`.
- For streaming requests, add `stream_options.include_usage=true` only when the
  caller did not specify it.
- If a backend rejects the auto-injected option, retry that backend exactly
  once without it and cache the compatibility result for the current app run.
- Never override an explicit caller value and never double count a compatibility
  retry.
- Parse streaming usage independently of the 256 KiB raw-log preview cap so
  final usage remains visible on large streams.
- Persist only the final valid cumulative usage object for a response.
- A successful response without usage increments `unreportedRequests`; it does
  not produce an estimate. Failed upstream responses do not increment the
  missing-usage count.

### Proxy UI

- Each backend card shows prompt, completion, and total tokens; reported and
  unreported request counts; and the last reset time.
- Add a per-backend Reset button with a confirmation dialog.
- Clearly label totals as incomplete whenever `unreportedRequests > 0`.
- Do not add a global reset in v1.

### Backend-aware model routing

- Add `GET /v1/models` to the public proxy contract.
- Publish every configured backend as model ID `clx:<backend-uuid>` without
  exposing its API key or headers.
- When a request uses a synthetic model, try that backend first and then the
  remaining backends in current configured order using existing retry/fallback
  rules.
- Rewrite the upstream model to the selected backend's real `model` value.
- Requests using ordinary model strings retain current behavior.
- Attribute usage to the backend that actually served the response, including
  fallback responses.

## US-009 — Secure Web AI

### Profile configuration

- Store a versioned `web-ai.json` under `~/.ai-cli-manager`.
- Persist profile ID, display name, start URL, and default profile ID only.
- Do not store cookies, tokens, passwords, or WebView data inside the JSON
  configuration.
- Settings supports create, edit, delete, select-default, and Clear site data.

### Main-area WebView

- Use a Tauri child WebView attached to the existing native main window.
- React tracks the Web AI main-area rectangle using `ResizeObserver`; Rust owns
  WebView creation, resize, hide, navigation, and destruction.
- Give each profile its own WebView2 user-data directory so the browser engine
  can persist cookies and site storage across app restarts.
- CLX must not expose commands for reading, exporting, or modifying raw cookies.
- Hide the mythical pet while the native WebView overlays the main content.

References:

- [WebView2 user-data folders](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/user-data-folder)
- [Tauri child WebView API](https://docs.rs/tauri/latest/tauri/window/struct.Window.html#method.add_child)

### Entry and navigation behavior

- Clicking the pet opens the default Web AI profile.
- If no profile exists, show an empty state that opens Settings → Web AI.
- The Command Palette provides a second entry when the pet is disabled.
- Provide Back, Forward, Reload, Home, editable address, Open in system browser,
  and Clear site data controls.
- Allow all `https://` URLs and `http://localhost` or `http://127.0.0.1`.
- Block `file:`, `javascript:`, `data:`, external plain HTTP, and downloads in
  v1.
- Redirect allowed popup URLs into the same profile WebView.
- Deny camera, microphone, location, and notification permissions by default.
- Always display the current origin so cross-site navigation is visible.

### Authentication boundary

- Users log in manually inside the WebView.
- Browser-managed cookies and site storage are the only persistent web-session
  mechanism in v1.
- CLX does not implement credential capture, password autofill, cookie import,
  cookie export, DOM injection, scraping, or automatic prompt submission.
- Some providers may block embedded OAuth. Provide Open in system browser as a
  fallback, but do not claim that the system-browser session will be copied
  back into CLX.

Reference: [RFC 8252 embedded user-agent guidance](https://www.rfc-editor.org/rfc/rfc8252#section-8.12).

### Tauri isolation

- Enable the Tauri feature required for child WebViews.
- Scope capabilities to `webviews: ["main"]`, not the entire native window.
- Register all custom commands in the Tauri application manifest and grant
  them only to the trusted local main WebView.
- Remote Web AI WebViews receive zero Tauri IPC permissions, no initialization
  script, and no production devtools.
- Add an automated security test proving a remote child WebView cannot invoke
  application, dialog, filesystem, or custom commands.

Reference: [Tauri capabilities](https://v2.tauri.app/security/capabilities/).

## US-010 — Open Interpreter Runtime

### Pinned distribution

- Pin Open Interpreter release `rust-v0.0.25` for Windows x64.
- Use artifact
  `open-interpreter-package-x86_64-pc-windows-msvc.tar.zst` with SHA-256:

  ```text
  e0e264dd95d4a025c7bc4c567bcab15bb940042c320fccac3f46a25ffad5884e
  ```

- Commit a small runtime manifest containing version, source URL, checksum, and
  license metadata. Do not commit the approximately 196 MB archive to Git.
- Release builds download or reuse a cache of the pinned archive, verify the
  checksum, and include it in Tauri resources.
- Include Apache-2.0 LICENSE, NOTICE, and attribution in the CLX distribution.

Reference: [Open Interpreter rust-v0.0.25 release](https://github.com/openinterpreter/openinterpreter/releases/tag/rust-v0.0.25).

### Runtime installation

- On first use, verify the bundled archive again and extract it into
  `~/.ai-cli-manager/openinterpreter/runtime/<version>`.
- Run a version and ACP initialization smoke check before making the new runtime
  active.
- Activate with an atomic version pointer and retain the previous valid runtime
  for rollback.
- Set `INTERPRETER_HOME` to
  `~/.ai-cli-manager/openinterpreter/home`.
- Disable Open Interpreter's own startup update check. Runtime updates occur
  only through a new CLX release.

### ACP process manager

- Add one app-wide `OpenInterpreterManager` to Rust `AppState`.
- Launch `interpreter acp` and use the ACP protocol version compatible with the
  pinned runtime, initially `agent-client-protocol = 0.12.1`.
- Keep stdout exclusively for protocol framing and capture stderr separately
  for operational logs.
- Manage session routing, pending permission requests, cancellation, runtime
  health, and child shutdown on app exit.
- On crash, restart automatically once and reload the active session. A second
  consecutive crash enters an explicit error state until the user retries.

### Provider connection

- Generate an isolated Open Interpreter provider configuration with:

  ```text
  base_url = http://127.0.0.1:<proxy-port>/v1
  wire_api = chat
  api_key = local-placeholder
  ```

- Provider credentials remain exclusively in CliProxyAI configuration.
- Entering Open Interpreter automatically starts CliProxyAI if it is stopped.
- If no proxy backend is configured, disable prompt submission and link to the
  relevant settings.
- If the proxy port or model configuration changes during an active turn,
  finish the turn, show restart pending, and restart the ACP process before the
  next prompt.

## US-011 — Open Interpreter Client

### Public application interface

Expose typed Tauri commands for:

- Runtime status, start, stop, and retry.
- Session list, create, load, and close.
- Prompt send and cancellation.
- Model and permission-mode changes.
- Responses to permission requests.

Expose typed events for:

- Runtime and session status.
- Assistant message deltas.
- Reasoning deltas.
- Tool progress and completion.
- Permission requests.
- Process crash and restart state.

### Workspace sessions

- Group threads by canonical workspace path.
- A new thread uses the active terminal/session `workingDir`.
- If no working directory is active, require folder selection before creating
  the thread.
- Support list, create, load, rename if ACP permits it, and close within the
  current workspace.

### Full ACP interface

- Add a separate Open Interpreter activity item and main-area client.
- Render workspace/thread navigation, streaming assistant text, reasoning,
  tool progress, approval cards, cancellation, model selection, permission
  selection, and runtime/proxy health.
- Display proxy models as `backend name — backend model`, while sending the
  synthetic `clx:<uuid>` ID.
- Usage automatically contributes to the aggregate for the backend that
  ultimately served the request.

### Permissions

- Default new sessions to `workspace-write`.
- Keep `read-only` available.
- Require a separate confirmation before enabling `full-access`.
- Disable network access for shell/tool processes while allowing the Open
  Interpreter process to reach the local proxy.
- Approval cards provide Allow once, Allow for session, and Deny.
- Session-level approvals are scoped to the active session and are cleared when
  the manager or app restarts.

## Validation Plan

### Proxy usage

- Legacy proxy configuration receives stable IDs exactly once.
- Rename preserves usage; delete and recreate starts at zero.
- Non-stream and stream responses increment exact provider usage.
- Usage appearing after more than 256 KiB of streamed log data is still stored.
- Explicit `stream_options` values are preserved.
- Auto-injected usage rejection triggers only one compatibility retry and does
  not double count.
- Successful responses without usage increment only `unreportedRequests`.
- Concurrent increments and reset operations are atomic.
- Aggregate state survives application restart.
- `/v1/models`, selected-primary routing, fallback order, and upstream model
  rewriting behave as specified.
- No credential appears in model, usage, log, event, or error output.

### Settings

- Every section renders, routes, and restores correctly.
- Modal and Command Palette deep links open the requested section.
- Existing theme, pet, AI Companion, local LLM, and sidebar-order settings retain
  their current stored values and behavior.
- New sidebar-order migration does not move existing user items or pinned items.

### Web AI

- Profile configuration and browser sessions survive app restart.
- Clear site data removes only the selected profile's browser data.
- Resize, view switching, and destruction never leave a WebView over unrelated
  CLX content.
- URL and permission policy is enforced for direct navigation and popups.
- Pet, Command Palette, and no-profile empty-state flows behave correctly.
- A remote WebView cannot invoke any Tauri command.
- Perform a manual login/restart smoke test on at least one operator-selected
  reachable Web AI site and record any embedded-login limitation.

### Open Interpreter

- A bad archive checksum is rejected without replacing the active runtime.
- Extraction is atomic and rollback preserves the previous runtime.
- ACP initialize, session list/create/load/close, streaming, reasoning, tool
  events, approvals, and cancellation work with the pinned runtime.
- Workspace paths are canonical and session lists remain workspace-scoped.
- Process crash recovery is bounded to one automatic restart.
- `workspace-write`, tool network denial, session approvals, and full-access
  confirmation are enforced.
- Model selection routes through the chosen primary backend and normal proxy
  fallback.
- No configured backend produces a clear setup path instead of a broken chat.

### End-to-end and release gates

- Run bundled Open Interpreter → ACP → CliProxyAI → deterministic mock provider,
  covering streaming, a tool approval, backend fallback, and token accounting.
- Run `npm.cmd run build`.
- Run focused Rust tests and
  `cargo test --manifest-path src-tauri/Cargo.toml` where repository state allows.
- Run Harness audit, trace, and story validation for every story.
- Build and smoke-test the packaged Windows x64 application, including offline
  first runtime extraction and bundled license material.
- A minimal live request through the current saved proxy configuration is an
  optional, explicit network/cost-approved release smoke test. It must never
  print credentials.
- Report pre-existing formatting, clippy, or validation debt honestly rather
  than claiming this initiative fixed or caused it without evidence.

## Acceptance Criteria

- Every configured proxy backend shows persistent, resettable token totals and
  a visible missing-usage count when the provider does not report usage.
- Existing OpenAI-compatible streaming remains incremental and behaviorally
  compatible while usage tracking is observational.
- Settings uses the category rail and all existing settings continue working.
- The pet opens the configured Web AI site, whose browser session persists
  without exposing raw credentials or Tauri IPC to remote content.
- The packaged Windows application can install and run the pinned Open
  Interpreter runtime without a separate user installation.
- Open Interpreter supports workspace threads, streaming ACP output, tool
  progress, approvals, cancellation, permissions, and backend/model selection.
- Open Interpreter traffic flows through CliProxyAI and contributes to the
  correct backend's usage totals.
- Product contracts, security decisions, Harness traces, deterministic tests,
  and Windows package evidence are complete before the initiative is marked
  implemented.

## Stop Conditions

Pause for a new product or security decision if implementation would require:

- Reading, exporting, or injecting website cookies or credentials.
- Giving a remote Web AI page any Tauri IPC capability.
- Adding DOM automation or provider-specific web scraping.
- Estimating unreported token usage.
- Changing existing proxy fallback semantics beyond selected-backend ordering.
- Supporting platforms other than Windows x64 in the initial release.
- Integrating the legacy Python Open Interpreter project.
- Allowing the bundled Open Interpreter runtime to self-update.
