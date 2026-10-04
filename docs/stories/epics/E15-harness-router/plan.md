# E15 — Harness Router: Unified Agent Harness Hub

**Status:** Implementation complete (US-050 → US-055, all six stories merged) — verify in app before declaring done. 2026-09-21: cargo check clean, 113/113 tests pass, tsc + vite build green, TEST_MATRIX rows added.

**Goal:** Promote CLX's agent layer into a **Harness Hub** modeled on the
HarnessRouter Community Edition runner: multiple agent harnesses (Hermes CLI,
Claude Code, more later) driven through ONE uniform interface — harness
registry + config, per-session workspace, live progress stream (text deltas +
tool events), cancellation, file/artifact output, and structured failure.
Scope is **M2** (internal Hub + stream normalization), NOT an HTTP server.

---

## Background & Motivation

CLX already runs CLI agents (hermes, claude-code, aider, codex, ...) inside
xterm terminals via `ExecutionEngine` + `cli_registry`. But each CLI is
integrated one-off: there is no uniform session model (chain/resume), no event
stream parsing, no per-session workspace, no artifact tracking, and cancel does
not produce a structured result.

HarnessRouter CE (Apache-2.0, github.com/HarnessRouter/harnessrouter) solves
exactly this problem for products. Its `runner/server.py` is the reference
pattern we copy:
- `_build_<backend>` builds the CLI command + config + env per harness.
- every backend's output is normalized (`*_to_claude`) into ONE event
  vocabulary.
- sessions run in per-session workspaces; cancel = process-group kill.
- the Unified Harness Protocol (UHP 2026-09-12, OpenAI Responses-compatible)
  defines the shared event vocabulary + failure taxonomy we adopt internally:
  `text delta`, `tool_use` / `tool_result`, `reasoning summary`,
  `result.subtype` (success | error_max_turns | incomplete | error).

This epic reuses existing CLX building blocks — `ExecutionEngine`,
`stream_assembler` (already parses `data:` lines), `CliProxyAI` (model
routing), TerminalPanel session UI conventions — so no new infrastructure is
built from scratch.

---

## Confirmed Product Decisions

(Defaults chosen 2026-09-21 with Boss; see Assumptions. Confirm at kick-off.)

1. **Scope (M2):** Harness Hub internal + CLI stream normalization. NO local
   HTTP/UHP server in this epic (that is M3, a later epic).
2. **Placement:** New epic `E15-harness-router`. `E06-agent-orchestrator`
   stays untouched (it is the ACP-based direction; E15 is CLI-stream based).
3. **Connector:** CLI stream normalization — capture CLI stdout in a
   machine-readable mode (`claude --output-format stream-json`,
   `hermes --json ...`), parse into unified events. Not ACP stdio.
4. **First harnesses:** Hermes CLI + Claude Code. Registry entries already
   exist in `core/cli_registry.rs`. (aider/codex/qwen/gemini entries already
   present — trivial to add later.)
5. **Execution rhythm:** Sequential, story by story, build + verify between
   each. Smallest spike first (single Hermes harness) if proof is needed.
6. **Storage:** `~/.ai-cli-manager/harness/` — `registry.json`, per-session
   metadata, `workspaces/<sid>/` for real session working dirs.
7. **Model routing:** via CliProxyAI (`OPENAI_API_BASE` at spawn) like E06
   intended. Agent `.env` / API keys are NEVER read/written (E06 security
   boundary preserved).

---

## Architecture (Target)

### Rust — Core modules (small; no sidecar needed for M2)

**`core/harness_registry.rs`** — `HarnessSpec` registry:
```rust
pub struct HarnessSpec {
    pub id: String,             // "hermes" | "claude-code" | ...
    pub name: String,           // display name
    pub cli: String,            // resolved via cli_registry / binary path
    pub stream: StreamMode,     // ClaudeStreamJson | HermesJson | PlainEst
    pub config_path: Option<PathBuf>,  // advisory config.yaml
}
```
List from `cli_registry` + explicit specs. `harness_list() -> Vec<HarnessInfo>`
(installed, status).

**`core/harness_manager.rs`** — `HarnessManager`:
- `launch(spec, workspace_dir, model)` — spawn via `ExecutionEngine`
  (`SpawnConfig { command, args, cwd, env }`, inject `OPENAI_API_BASE` from
  proxy config), attach stdout reader.
- `send_prompt(sid, text)` — stdin writer (CLI non-interactive input).
- `cancel(sid)` — kill process tree; emit structured result.
- session store (in-memory + persisted metadata in `harness/sessions/`):
  `{ sid, harness, workspace, status: running|completed|failed|cancelled|incomplete,
     result, error }`.
- Events out via Tauri `emit` (`harness-event { sid, ev }`, snake_case flat —
  follow companion event contract conventions).

**`core/harness_stream.rs`** — `StreamNormalizer`:
- Incremental parse of stdout by `StreamMode` (reuse `stream_assembler`
  boundary-splitting pattern).
- Emit unified events: `{type: "text_delta"|"tool_use"|"tool_result"|
  "reasoning"|"result"}`, mirroring UHP vocabulary; per-harness mapper
  (claude stream-json → events; hermes `--json` → events).

**`commands/harness_commands.rs`** — Tauri commands:
`harness_list_agents`, `harness_get_status`, `harness_launch(agent_id, model,
workspace?)`, `harness_send(sid, prompt)`, `harness_cancel(sid)`,
`harness_session_files(sid)`, `harness_config_read(agent_id)`,
`harness_config_write(agent_id, yaml)` (advisory; preserve unknown fields).

### Frontend

**`src/components/HarnessHubPanel.tsx`** — new main-area view, Activity Bar
tab **"Agent Hub"** (brain icon, follows the add-a-tab checklist: `SidebarTab`
union, `tabsOrder` localStorage guard, `tabsWithNoLeftArea`, `renderTabButton`
switch, `activeMainView` union, TerminalPanel overlay with visibility toggle):

```
┌─ Left rail ─────────────────   ┌─ Main ────────────────────────────────┐
│ Harness: [Hermes ─ ▼]          │ Header: model | status | Cancel | Logs │
│ ● status / ○ stoppe            ├────────────────────────────────────────┤
│ [Session 1]  ✕                 │ Messages feed:                        │
│ [Session 2]  ✕                 │   user / assistant text (streaming)   │
│ [+ New session]                │   [Tool card: name, args, running→ok] │
│ Config (advisory)              │   [result: success / incomplete / err]│
├────────────────────────────────┼────────────────────────────────────────┤
│ Prompt input + [Send]          │ Files strip: artifact chips + open    │
└────────────────────────────────┴────────────────────────────────────────┘
```
- Instant frame + per-section spinner (house style), silent event polling none
  (stream-driven), optimistic send.
- Files strip lists `harness_session_files` (detected produced files).

**`src/lib/harness.ts`** — typed wrappers over `invoke` (like `buzz.ts`).

### Files & Artifacts (M2)

- Workspace per session: `~/.ai-cli-manager/harness/workspaces/<sid>/`.
- Session root shown in header; a "🖥 Open in terminal" action spawns a
  terminal session in that workspace (reuse existing terminal launch).
- Artifact detection: snapshot dir at launch, diff on terminal state →
  candidate files (extension/size filter). No git required.

---

## Candidate Stories

| ID | Title | Scope |
|---|---|---|
| US-050 | Harness registry + manager (launch/stop/cancel via ExecutionEngine) | Rust |
| US-051 | Session model + workspace lifecycle + session store | Rust |
| US-052 | Stream normalizer: Claude stream-json + Hermes `--json` spike | Rust |
| US-053 | HarnessHubPanel UI — picker, session view, live progress, cancel | FE |
| US-054 | Artifact/file detection + files strip + open-in-terminal | FE+Rust |
| US-055 | Structured result/errors + TEST_MATRIX rows + docs | All |

Each story gets its own packet (docs/templates/story.md) at kick-off, with
acceptance criteria, validation ladder, and a trace.

---

## Validation

| Layer | Proof |
| --- | --- |
| Unit | stream normalizer mappers; session store; artifact filter |
| Integration | manager spawn/cancel via ExecutionEngine; cancellable kill-tree |
| E2E | launch Hermes → prompt → live events render → cancel → structured result; files appear in strip; open-in-terminal lands in workspace |
| Platform | Windows x64 (consistent with prior epics) |

Commands:
```
env -u TMP -u TEMP cmd.exe /c 'set "TMP=C:\Windows\Temp" && set "TEMP=C:\Windows\Temp" && C:\Windows\Temp\clx-build-env.bat cargo test -p clx 2>&1'
npm run build
```
Matrix rows + traces via `scripts/harness` (mind `HARNESS_DB="D:/CLI-Ochestor/harness.db"`).

---

## Dependencies

- Existing: `serde_json`, `tokio`, `ExecutionEngine`, `cli_registry`,
  `stream_assembler`, `CliProxyAI` proxy.
- Add: `serde_yaml` (config read/write, as E06 planned) — only if US-config
  is included.
- No new crates for M2 otherwise.

---

## Stop Conditions

Pause for human decision if implementation would require:
- Reading or writing any agent `.env` file (API keys — security boundary).
- Auto-downloading or updating Hermes / Claude Code.
- Driving an agent that exposes no machine-readable output mode.
- Adding a local HTTP/UHP server (M3) inside this epic.
- Mixing state with E06's ACP direction.
- Supporting platforms other than Windows x64.

---

## Assumptions

Decisions above are the recommended defaults from a clarify prompt that timed
out (2026-09-21). Confirm or change at kick-off: (1) scope M2 not M1/M3;
(2) new epic E15 not E06 rewrite; (3) CLI stream not ACP; (4) Hermes + Claude
Code first; (5) sequential rhythm.