# E08 — AI Companion App-aware Action Helper Plan

## Status

Planned. This is a docs-only initiative. Implementation has not started.

## Goal

Turn the existing AI Companion from a chat-only terminal assistant into an
app-aware helper that can:

- Explain every feature that exists in the running CLX build.
- Answer questions using current app state without leaking sensitive context.
- Perform a bounded set of CLX actions through typed, validated tools.
- Show progress, approvals, verified results, and failures inside the existing
  Companion sidebar.

The initial release targets Windows x64 and preserves the existing direct
OpenAI-compatible Companion endpoint. It does not route Companion traffic
through CliProxyAI automatically, because Companion must remain available when
the proxy is stopped or misconfigured.

## Current State

The current Companion implementation in `src/components/CliSidebar.tsx`:

- Stores one global chat history and endpoint configuration in localStorage.
- Sends the most recent ten messages to `send_llm_chat`.
- Has no app capability catalog, live app context, function calling, approval
  boundary, structured tool history, cancellation, or post-action verification.
- Buffers the current `stream` response inside the Rust command instead of
  rendering model and tool deltas as a structured Companion run.
- Falls back to the built-in local LLM for text generation only.

The running source tree currently exposes CLI/session, workspace, SSH/RDP,
Quick Apps, API Client, CliProxyAI, Web AI, system logs, notepad, dashboard
monitoring, Settings, and local LLM behavior. Some story and Harness records
claim Open Interpreter or Agent Orchestrator behavior that is not present in
this checkout. Runtime capability registration is therefore the source of
truth; planned documentation may be described only as planned or unavailable.

## Harness Classification

- Input type: `new_initiative`.
- Risk lane: `high_risk`.
- Risk flags: external systems, audit/security, public contracts, existing
  behavior, weak proof, multi-domain, and local data model.
- Proposed epic: `E08-agentic-companion`.
- Proposed stories:
  - US-020 — Code-backed capability catalog and safe app context.
  - US-021 — Companion model runtime, streaming, persistence, and redaction.
  - US-022 — Core action tools and approval enforcement.
  - US-023 — Sidebar tool UX, migration, and Windows acceptance proof.

When implementation is selected, create the high-risk story packets and record
the Harness intake before changing source. This docs-only turn must not update
Harness state.

## Confirmed Product Decisions

- Windows x64 is the v1 platform and release gate.
- The existing Companion sidebar is enhanced; no separate main-area Companion
  view is added.
- One global Companion conversation is retained.
- Companion uses its independently configured OpenAI-compatible endpoint.
- App Actions require one-time consent and remain toggleable in Settings.
- Read-only help remains available when App Actions are disabled.
- Models without standard tool/function calling and the built-in local LLM are
  Q&A-only. A model must never claim an action succeeded without a tool result.
- Runtime code and registered capabilities are authoritative. Planned docs are
  clearly labeled and never exposed as executable features.
- Each sensitive step is approved separately. A multi-step request can continue
  automatically only after the preceding approved step succeeds.
- Credentials may be entered in chat. They are sent to the configured model
  endpoint, but must be redacted from local history, audit records, UI cards,
  events, and logs after they are identified.
- The safe automatic context contains the active view, selected session and
  workspace, configured CLI/project names, proxy status, and backend display
  names. It excludes terminal output, file contents, logs, headers, API keys,
  passwords, and private-key contents.
- Companion may start, focus, or connect an existing configured target after an
  explicit natural-language request without an extra confirmation.
- Config writes, config deletion, proxy/session stop, and other interruptive
  actions require an approval card.
- Companion does not send arbitrary input into PTYs in v1.

## Scope

### Knowledge coverage

The catalog must cover every user-facing feature in the running app, including
features that are not executable Companion tools in v1:

- Activity bar, Settings navigation, Command Palette, and mythical pet.
- CLI profiles, terminal sessions, workspace tags, Explorer, Git status/diff,
  file editor, and terminal helper behavior.
- Operator SSH/RDP profiles and the remote SSH server.
- Quick Apps, API Client, CliProxyAI, Web AI, system logs, and notepad.
- Dashboard resource, port, process, monitor, and log functionality.
- Cloud Companion configuration and built-in local LLM behavior.

Each feature entry describes what the feature does, where to open it, current
availability, important limits, related backend commands, and whether it is
knowledge-only, read-tool, action-tool, or unavailable.

### Executable tools in v1

#### App and navigation

- `app.search_help`
- `app.get_context`
- `app.open_view`
- `app.open_settings`

#### CliProxyAI

- `proxy.get_status`
- `proxy.list_backends`
- `proxy.start`
- `proxy.stop`
- `proxy.upsert_backend`
- `proxy.delete_backend`

#### CLI profiles and terminal sessions

- `cli.list_profiles`
- `cli.list_workspaces`
- `cli.upsert_profile`
- `cli.delete_profile`
- `session.list`
- `session.start`
- `session.focus`
- `session.stop`

#### SSH/RDP Operator profiles

- `remote.list_profiles`
- `remote.upsert_profile`
- `remote.delete_profile`
- `remote.connect`

#### Quick Apps

- `quickapp.list`
- `quickapp.upsert`
- `quickapp.delete`
- `quickapp.launch`

### Explicit non-goals for v1

- No raw shell, arbitrary Tauri command, or generic filesystem tool.
- No Companion-generated PTY input or remote command execution.
- No file create/write/delete, Git mutation, or SSH file mutation.
- No process/port kill, monitor mutation, live-log control, or sudo handling.
- No Web AI DOM automation, cookie access, credential extraction, or prompt
  injection into remote WebViews.
- No multi-thread conversation UI or workspace-specific chat history.
- No model-provider routing change for the Companion endpoint.
- No macOS or Linux platform acceptance requirement.
- No credential vault work in this initiative.

For an out-of-scope action, Companion explains the feature and may navigate to
the correct UI, but must say that it cannot perform the action itself.

## Architecture

### 1. Shared capability catalog

Add one checked-in catalog consumed by both Rust and React. Each entry contains:

```text
featureId
title
aliases[]
summary
help
availability
viewId/settingsSection
backendCommands[]
toolExposure
limitations[]
```

The catalog is curated product knowledge, not a runtime source-code scraper.
Runtime probes merge dynamic availability and safe inventory summaries into
the static descriptions.

Add a catalog audit that reads the `tauri::generate_handler!` registration,
sidebar view IDs, Settings section IDs, and Command Palette entries. The audit
fails when an item is absent from the catalog or references an unregistered
tool. Low-level commands remain non-tool unless explicitly classified.

The model receives a compact feature index on each turn. A local token/alias
retriever selects the most relevant detailed entries for the current question;
it must not require embeddings, a remote vector database, or source scanning.

### 2. Companion runtime

Add a `CompanionManager` to Rust `AppState`. It owns:

- Model requests and direct endpoint configuration.
- Standard OpenAI-compatible Chat Completions tool definitions.
- Incremental SSE parsing for assistant content and fragmented tool calls.
- The tool loop, cancellation token, active run, and pending approval.
- Capability retrieval and safe context construction.
- SQLite conversation persistence and redaction.

Runtime invariants:

- Only one active run and one pending approval exist at a time.
- Limit each user turn to eight total tool calls.
- Mutations execute serially; the model cannot request parallel config writes.
- A pending approval pauses the tool loop.
- Approval uses a runtime-issued run ID and action ID. Unknown, expired,
  duplicated, or cross-run approvals are rejected.
- Denial is returned to the model as `denied_by_user` so it can explain the
  outcome without retrying the same action automatically.
- Cancellation stops the model request and any not-yet-started tool. It cannot
  claim to roll back an action that already completed.
- Every successful action re-queries its authoritative state before emitting a
  final result.
- Tool errors are typed and sanitized; provider credentials and raw config
  payloads are never included in error text.

The immutable system policy is prepended ahead of the user-custom system
prompt. The custom prompt can change tone and response style but cannot change
tool schemas, risk levels, approval policy, context filtering, or action limits.

### 3. Model compatibility

Send standard `tools` and `tool_choice: auto` only after App Actions consent.
If the endpoint explicitly rejects tool parameters, retry the turn once without
tools, mark that model/endpoint Q&A-only for the current app run, and show a
visible badge.

If a model returns plain text describing an action instead of a valid tool call,
render the text but do not execute anything. The system prompt must prohibit
phrases that imply completion without a verified tool result.

The built-in local LLM receives the compact knowledge catalog and safe context
for Q&A, but it does not receive executable tool schemas in v1.

### 4. Application service boundary

Do not have the Companion invoke frontend callbacks or arbitrary registered
Tauri commands. Move the shared business behavior for the selected domains
behind typed Rust services, then make both the existing UI commands and the
Companion tool handlers call those services.

Required service behavior:

- Start and stop operations are idempotent at the Companion layer.
- Upserts use stable IDs. New backend and remote IDs are generated server-side.
- Updates preserve an existing secret when the replacement field is omitted.
- Clearing a secret requires an explicit typed operation; an empty string must
  not silently erase it.
- CLI working directories are canonicalized and must exist before session
  creation.
- Backend URLs, ports, weights, retry counts, headers, CLI commands, args,
  environment maps, SSH/RDP fields, and Quick App paths are validated using the
  same rules for UI and Companion callers.
- Deletion identifies one exact stable target and does not support wildcard,
  bulk, or fuzzy deletion.

### 5. Entity resolution

The model lists current entities before invoking an action that references a
user-provided name. Resolution order is:

1. Stable ID supplied by a previous read tool.
2. Exact case-sensitive display-name match.
3. Unique case-insensitive normalized match.
4. Unique alias, project-tag, or saved-directory match.

If zero or multiple candidates remain, ask a follow-up question. Fuzzy matching
may rank choices for display but must not authorize a mutation or launch.

The request “open CLI HM at happy-platform” must resolve both the CLI profile
and workspace/project tag before calling `session.start`. The backend validates
the directory again and returns the created session ID, which the UI then
focuses through a typed UI effect.

### 6. Action policy

Actions that execute immediately after a clear user request:

- Read tools and help search.
- Open/focus a view, Settings section, or existing session.
- Start CliProxyAI when it has a valid backend configuration.
- Start a configured CLI in a resolved workspace.
- Connect an existing SSH/RDP profile.
- Launch an existing Quick App.

Actions requiring an individual approval card:

- Add or edit a CLI profile, backend, SSH/RDP profile, or Quick App.
- Delete any CLI profile, backend, SSH/RDP profile, or Quick App.
- Stop CliProxyAI or a terminal session.

An approval card displays the operation, exact target, non-secret diff, risk
reason, and expected post-condition. Secret fields display only `••••`. There
is no batch approval and no undo promise for deletion.

For “add backend then start proxy,” the backend write pauses for approval. If
approved and verified, the run continues and starts the proxy automatically.
If the write fails or is denied, the start step is not attempted.

## Persistence and Secret Handling

### Companion database

Create `~/.ai-cli-manager/companion.db` using the existing SQLite dependency.
The schema supports one default conversation while remaining forward-compatible
with future multiple conversations:

- `conversation`: ID, title, created/updated timestamps.
- `message`: ID, conversation ID, run ID, role, redacted content, status,
  timestamp.
- `tool_run`: action ID, run ID, tool ID, redacted arguments, risk, approval
  state, redacted result, timestamps.

History remains until the user chooses Clear. Clear removes messages and tool
runs for the default conversation but does not delete app configuration.

### Companion configuration

Store endpoint, model, stream preference, custom prompt, custom headers, and
App Actions consent under `~/.ai-cli-manager/companion.json`. Return masked
configuration DTOs to the UI:

- `apiKeyPresent` instead of the stored API-key value.
- Sensitive custom-header values masked by header name.
- Explicit replace/clear operations for secret fields.

This initiative does not add OS-vault storage. The Settings UI must state that
Companion credentials remain in the local configuration file under the same
trust model as the existing app configuration.

### Legacy migration

On first upgraded launch, React reads the old `ai-cli-llm-config` and
`ai-cli-llm-history` values and calls one typed import command. Rust:

1. Validates the endpoint configuration.
2. Builds a redaction set from known Companion, proxy, and SSH secret values.
3. Redacts exact known values and recognized credential patterns.
4. Commits the config/history migration transactionally.
5. Returns success so React can remove the legacy localStorage keys.

If migration fails, leave the legacy keys untouched and show a recoverable
error. Redaction of arbitrary text cannot guarantee that the remote provider
did not see a secret or that an unknown secret pattern was recognized; the UI
must state this limitation honestly.

### Runtime secret rules

- Tool schemas mark sensitive fields explicitly.
- A user message is held in memory until the turn determines whether sensitive
  tool arguments were extracted; the stored form is redacted before commit.
- Identified secret values are removed from later model context, system logs,
  tool results, approval cards, frontend events, and error messages.
- Secret-bearing values are retained only as long as necessary for the current
  request and persistence operation, then cleared from runtime buffers where
  practical.
- The consent screen explicitly says that credentials typed into chat are sent
  to the configured model provider before local redaction.

## Public Interfaces

### Tauri commands

```text
companion_get_config
companion_save_config
companion_get_history
companion_clear_history
companion_get_catalog
companion_send
companion_cancel
companion_set_actions_enabled
companion_decide_action
companion_import_legacy
```

`companion_send` returns a run ID immediately. Streaming and tool progress are
delivered as events rather than buffering the entire answer in the command.

### Event contract

Use one typed `companion-run-event` union:

```text
assistant_delta
tool_started
approval_required
tool_result
ui_effect
warning
error
done
```

Every event contains `runId`, a monotonically increasing sequence number, and
the variant payload. Tool-related variants also contain `actionId`.

### Shared frontend types

```text
CompanionMessage
CompanionRunEvent
CompanionToolCall
PendingAction
ToolRisk
SafeAppContext
CompanionUiEffect
CompanionConfigView
CompanionConfigUpdate
```

`CompanionUiEffect` uses catalog IDs, not arbitrary event names. The frontend
validates the target before switching views, selecting a Settings section, or
focusing a session.

## Sidebar UX

Keep the current resizable AI Companion sidebar and replace the plain message
array with structured message blocks:

- Incrementally rendered assistant text.
- Tool-start and verified-result cards.
- Masked approval cards with Approve and Deny.
- Cancel button for the active run.
- Provider/model and `Tools enabled` or `Q&A only` badges.
- Clear-history action covering messages and tool records.
- Recoverable error blocks that do not destroy the preceding history.

App Actions default to disabled after upgrade. The first request that would
need a tool opens a consent card explaining safe context, provider exposure,
approval categories, and credential handling. On consent, persist
`actionsEnabled=true` and retry the user request once. Settings exposes the
same toggle and policy summary.

The UI must not optimistically display an action as successful. A card moves
from proposed to running to verified only from backend events.

## Implementation Sequence

### US-020 — Capability catalog and safe context

- Add the shared catalog and runtime availability projection.
- Map current views, Settings sections, Command Palette entries, and Tauri
  commands.
- Add the coverage audit and alias/help retrieval.
- Add safe-context builders and tests proving excluded data is absent.

Exit criterion: Companion can accurately answer where every current feature is,
what it does, and whether it is available, without executing actions.

### US-021 — Runtime, streaming, persistence, and redaction

- Add `CompanionManager`, public commands/events, and the direct model client.
- Implement streaming assistant/tool deltas, cancellation, Q&A fallback, and
  immutable policy layering.
- Add SQLite history, backend configuration, migration, and redaction.

Exit criterion: one global Companion thread streams reliably, survives restart,
and stores only redacted structured records.

### US-022 — Core tools and approvals

- Extract shared services for proxy, CLI/session, SSH/RDP, and Quick Apps.
- Register the exact v1 tool set and risk classes.
- Add entity resolution, typed validation, pending approvals, idempotency, and
  post-condition verification.

Exit criterion: all four representative action flows work against deterministic
test state, and no unregistered/raw command path exists.

### US-023 — Sidebar UX and Windows acceptance

- Replace the legacy Companion message renderer and localStorage ownership.
- Add consent, status badges, approval/result cards, cancel, migration, and UI
  effects.
- Run security, integration, and packaged Windows smoke validation.

Exit criterion: the packaged Windows app passes all acceptance scenarios and
the Harness story evidence is current.

## Likely Code Surfaces

The implementation should primarily touch:

- `src-tauri/src/app_state.rs`, `src-tauri/src/main.rs`, and a new Companion
  runtime/service module under `src-tauri/src/`.
- `src/components/CliSidebar.tsx`, `src/pages/Dashboard.tsx`, and Companion
  Settings state.
- The shared catalog, frontend types/client wrappers, product contract, story
  packets, decision record, and validation audit.

Preserve unrelated work, including the currently untracked
`src/lib/contextMenu.ts` file.

## Validation Plan

### Catalog and knowledge

- Every registered Tauri command maps to one feature and exposure class.
- Every sidebar view, Settings section, and Command Palette destination maps to
  a valid catalog feature.
- Vietnamese and English aliases retrieve the expected feature details.
- A feature without runtime registration is described as planned/unavailable.
- The safe context never contains terminal text, file content, log content,
  API keys, passwords, private-key data, or sensitive headers.

### Model runtime

Use a deterministic mock OpenAI-compatible server to cover:

- Non-stream and streamed text.
- Tool calls fragmented across SSE frames.
- Multiple sequential read/action calls.
- Explicit rejection of `tools` followed by one Q&A-only retry.
- A model returning action-like prose without a tool call.
- Cancellation before and during a streamed response.
- Eight-call loop limit.
- Provider errors, malformed JSON, truncated SSE, and disconnects.
- Prompt injection attempting to call an unregistered tool, skip approval,
  reveal secrets, or execute raw shell input.

### Persistence and security

- Legacy config/history migrate once and legacy keys are removed only after a
  successful transaction.
- Known secret values and sensitive tool fields never appear in SQLite, system
  logs, frontend events, approval cards, or tool results.
- Blank secret updates preserve existing values; explicit clear works.
- Stale, duplicate, forged, or cross-run approvals are rejected.
- Denied actions do not mutate state and are not automatically retried.
- Clearing history does not remove Companion or app configuration.

### Tool services

- Tests use a temporary app-data root and never read or write the operator's
  real `~/.ai-cli-manager` files.
- Start proxy is idempotent and fails clearly when no backend exists.
- Backend upsert/delete preserves stable IDs and verifies final configuration.
- CLI/project resolution handles exact, unique normalized, missing, and
  ambiguous cases.
- Session start validates the working directory and returns a focusable ID.
- SSH/RDP and Quick App upsert/delete target one stable ID.
- Stop and delete tools cannot run without the matching approval.

### Acceptance scenarios

1. “Start LLM proxy” starts a valid stopped proxy without an extra approval and
   reports the verified port/status.
2. “Open CLI HM at happy-platform” resolves both configured entities, creates
   the session in the intended directory, and focuses it.
3. Adding an SSH host through chat produces a masked approval, saves one profile,
   and verifies it through a read tool.
4. Adding a proxy backend and then starting the proxy pauses only for the
   backend write; start continues automatically after verification.
5. Editing or deleting each core profile type requires an exact-target approval.
6. A non-tool-capable model answers app questions but never executes or claims
   execution.
7. An out-of-scope file, terminal-input, kill, or monitor request explains the
   limitation and opens the relevant UI when possible.
8. Restarting the app restores the redacted global thread and structured tool
   cards.

### Commands and platform proof

- `npx.cmd tsc --noEmit`
- `npm.cmd run build`
- Focused Rust Companion/service tests.
- `cargo test --manifest-path src-tauri/Cargo.toml`
- Catalog coverage audit.
- Packaged Windows x64 smoke with the operator-selected Companion endpoint.

Current planning baseline on 2026-07-20:

- `npx.cmd tsc --noEmit` passed.
- A combined frontend build and Rust test probe timed out during compilation;
  neither command may be reported as passed or failed from that probe.
- `validate:quick` references validation scripts absent from this checkout, so
  implementation must run the direct checks above and record that pre-existing
  Harness friction separately instead of silently widening E08.

## Acceptance Criteria

- Companion correctly describes every feature registered by the running app and
  never presents planned-only behavior as available.
- Safe dynamic context makes questions about the selected CLI, workspace, proxy,
  and configured entity names answerable without sending terminal/file/log data.
- The four representative action flows complete through typed tools and show
  backend-verified results.
- All configuration changes, deletions, and stop actions require the configured
  approval boundary; low-risk reads/navigation/starts remain efficient.
- No tool can execute arbitrary shell, Tauri, filesystem, terminal, process, or
  monitor operations.
- Credential entry shows an explicit provider-exposure warning and local
  persisted/audit/UI output is redacted.
- Non-tool models and the built-in LLM remain useful for Q&A without gaining
  action privileges.
- Existing Companion configuration/history migrate without silent loss, and
  failure leaves legacy data recoverable.
- Windows x64 packaged-app proof, product contract, story packets, decision
  record, Harness matrix, and trace evidence are complete before E08 is marked
  implemented.

## Stop Conditions

Pause for a new product or security decision if implementation would require:

- Sending terminal output, file contents, logs, cookies, or additional secrets
  to the model automatically.
- Adding raw shell, generic Tauri invocation, PTY input, filesystem mutation,
  process control, monitor control, or remote-command tools.
- Allowing custom prompts, model output, or frontend events to bypass Rust
  validation or approval enforcement.
- Storing new Companion credentials in an OS vault or changing existing proxy
  or SSH credential storage policy.
- Giving remote Web AI content access to Companion or Tauri IPC.
- Making Companion depend on CliProxyAI availability.
- Supporting multiple conversations, workspace-specific history, Linux, or
  macOS in v1.
- Treating planned Open Interpreter or Agent Orchestrator documentation as an
  available runtime capability without matching registered code.
