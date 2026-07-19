# E06 — Agent Orchestrator: Multi-Agent ACP Platform

**Status:** Planning

**Goal:** Promote the agent layer from a single-vendor Open Interpreter integration to a general-purpose **Agent Orchestrator** that can front any ACP-compatible coding agent. The initial release supports **Open Interpreter** and **Hermes CLI** side-by-side. Each agent owns and manages its own configuration files; CLX reads agent config only in a read-only advisory role and communicates exclusively via the ACP stdio protocol for all runtime interaction.

---

## Confirmed Product Decisions

- **Agent configs are editable by CLX.** CLX reads AND writes agent config files. The Settings → Agents section exposes a structured form for key fields of each agent's config.yaml. Users can edit these fields directly in CLX without needing to use the agent's own CLI.
- **Config file locations:**
  - Open Interpreter: `~/.openinterpreter/config.yaml` (or `config.toml` for newer versions — CLX detects and handles both formats).
  - Hermes CLI: `~/.hermes/config.yaml`.
- **Editable config fields (per agent):**
  - Open Interpreter: `model`, `temperature`, `context_window`, `auto_run`, `sandbox_mode`, `custom_instructions`, `api_base`.
  - Hermes: `model`, `temperature`, `max_tokens`, `system_prompt`, `tools` (enabled list).
  - **API keys are NOT stored in config.yaml by either agent** — they go to separate `.env` files. CLX will NOT expose `.env` editing (security boundary).
- **ACP is the sole runtime interface.** All prompt delivery, response streaming, tool approval, and session control happen over the ACP stdio channel (`agent acp`). No scraping, no PTY injection.
- **Agent binary discovery:**
  - Open Interpreter: existing bundled runtime path (`~/.ai-cli-manager/openinterpreter/runtime/<version>/interpreter.exe`).
  - Hermes CLI: user provides absolute binary path in CLX Settings → Agents. CLX validates existence at save time.
- **Mini terminal receives agent text output.** When an agent session is active, extracted plain-text chunks from ACP `session/chunk` frames are written into a read-only virtual mini-terminal tab labelled "Agent 🤖". Tool execution output lines are also forwarded.
- **Sidebar rename — labels only.** No file or component renames.
  - `open-interpreter` tab → label **"Agent Orchestor"**, moved to position 0 (top of sidebar).
  - `cli-manager` tab → label **"Terminal Orchestor"**.
- **Agent selection UI.** Before or when starting an agent session, a dropdown/selector lets the user pick which installed agent to use. The last selection is persisted in `~/.ai-cli-manager/agent_settings.json`.
- **Existing `OpenInterpreterManager` is retained** as-is for install, status, and binary lifecycle. The new `AgentManager` wraps it for runtime dispatch without duplicating install logic.
- **Hermes is user-installed.** CLX does not download or update Hermes. CLX only validates binary existence and invokes `hermes acp`.
- **Proxy coupling retained.** Both agents receive `OPENAI_API_BASE` pointing to the CLX CliProxyAI proxy at startup. The `model` field shown in agent config is what the agent sends to the proxy; CLX routes it via the selected backend.
- **Windows x64 only** for this release, consistent with E05.

---

## Stories

| ID | Title | Status |
|---|---|---|
| US-012 | Agent Orchestrator Shell — sidebar rename, tab reorder, panel routing | Planned |
| US-013 | AgentManager Rust layer — unified ACP dispatch for OI + Hermes | Planned |
| US-014 | AgentOrchestratorPanel — agent picker, chat UI, ACP frame rendering | Planned |
| US-015 | Mini-terminal agent output integration | Planned |
| US-016 | Settings — Agents section (Hermes path, OI status, agent config.yaml reader) | Planned |

---

## US-012 — Agent Orchestrator Shell

### Overview
Rename sidebar labels and reorder tabs so "Agent Orchestor" appears at the top.

### Changes

**`src/components/CliSidebar.tsx`**
- Add `'agent-orchestrator'` to `SidebarTab` union type (keep `'open-interpreter'` for backward compat but hide it if `agent-orchestrator` is present).
- Default tab order: `['agent-orchestrator', 'cli-manager', 'explorer', 'quickapps', 'operator', 'apiclient', 'web-ai', 'settings']`.
- Migration: when loading old localStorage order, inject `'agent-orchestrator'` at position 0 and remove `'open-interpreter'` from order if present.
- Tab tooltip: `"Agent Orchestor"` (brain/robot SVG icon, `text-cyber-electric` active state).
- `cli-manager` tab tooltip: `"Terminal Orchestor"` (unchanged icon).
- `handleSetActiveTab('agent-orchestrator')` → dispatches `switch-main-view: 'agent-orchestrator'`.

**`src/pages/Dashboard.tsx`**
- Extend `activeMainView` union with `'agent-orchestrator'`.
- `switch-main-view` listener: map `'agent-orchestrator'` to `setActiveMainView('agent-orchestrator')`.

**`src/components/TerminalPanel.tsx`**
- Add `{activeMainView === 'agent-orchestrator' && <AgentOrchestratorPanel />}` overlay (mirrors existing open-interpreter pattern).

---

## US-013 — AgentManager Rust Layer

### Overview
New `AgentManager` in `src-tauri/src/core/agent_manager.rs` that can start/stop/send to any ACP-compatible agent binary. It reuses `OpenInterpreterManager`'s binary path; it does NOT duplicate install logic.

### Key Design

```rust
pub struct AgentSettings {
    pub active_agent_id: String,   // "open-interpreter" | "hermes"
    pub hermes_binary_path: String,
}

pub struct AgentInfo {
    pub id: String,
    pub name: String,
    pub installed: bool,
    pub binary_path: Option<String>,
    pub status: String,  // "not_installed"|"not_configured"|"not_found"|"stopped"|"running"|"installing:N"|"error:..."
    pub config_summary: Option<AgentConfigSummary>,
}

pub struct AgentConfigSummary {
    pub model: Option<String>,       // read from agent's config.yaml, advisory only
    pub workspace: Option<String>,
}
```

**`start(agent_id, app, proxy_port, oi_manager)`:**
1. Resolve binary path from OI manager (for `"open-interpreter"`) or settings (for `"hermes"`).
2. Spawn `<binary> acp` with `OPENAI_API_BASE`, `CREATE_NO_WINDOW`.
3. stdout reader emits:
   - `agent-frame` (raw JSON-RPC line) → consumed by panel chat.
   - `agent-terminal-output` (extracted text) → consumed by mini terminal.
4. stderr → `agent-log` events.
5. Crash watcher → `agent-status-changed: "stopped"` + `agent-crashed-warning`.

**Config.yaml reader (read-only):**
```rust
pub async fn read_agent_config_summary(agent_id: &str, binary_path: &str) -> AgentConfigSummary {
    // Open Interpreter: read ~/.config/open-interpreter/config.yaml OR ~/.openinterpreter/config.yaml
    // Hermes: read ~/.config/hermes/config.yaml OR derive from binary dir
    // Parse YAML, extract "model" and "workspace" fields only
    // Never write; return empty summary on any parse error
}
```

**New Tauri commands in `src-tauri/src/commands/agent_commands.rs`:**
```
agent_list_agents()           → Vec<AgentInfo>
agent_get_settings()          → AgentSettings
agent_save_settings(settings) → ()
agent_start(agent_id)         → ()   // auto-starts proxy if stopped
agent_stop()                  → ()
agent_send(message)           → ()
```

**`app_state.rs`:** Add `pub agent_manager: Arc<AgentManager>`.

**`main.rs`:** Register all 6 new commands.

---

## US-014 — AgentOrchestratorPanel

### Overview
New React panel replacing the `open-interpreter` view. Reuses the ACP frame parsing logic from `OpenInterpreterPanel.tsx` but adds agent selection and is agent-agnostic.

### Key UI Blocks

```
┌─ Left rail (w-52) ──────────────────────┐  ┌─ Main area ───────────────────────────┐
│ Agent: [Open Interpreter ▼]             │  │ [Model: gpt-4o ▾] [Perm: ask ▾] [Logs]│
│ Status: ● Running                       │  ├────────────────────────────────────────┤
│ ─────────────────────────────────────   │  │ Messages feed                          │
│ Workspace: /path/to/project   [Pick]    │  │  user: ...                             │
│ ─────────────────────────────────────   │  │  assistant: streaming text...          │
│ [Thread 1]  ✕                           │  │  [Tool: running shell cmd...]          │
│ [Thread 2]  ✕                           │  │  [Approval card: Allow / Deny]         │
│ [+ New Thread]                          │  ├────────────────────────────────────────┤
│ ─────────────────────────────────────   │  │ > Enter prompt...           [▶ Send]   │
│ [▶ Start]  [■ Stop]                     │  └────────────────────────────────────────┘
│ Config: model claude-3-opus (advisory)  │
└─────────────────────────────────────────┘
```

**Events listened:**
- `agent-frame` → `handleAcpFrame()` (same JSON-RPC dispatch as current OI panel).
- `agent-status-changed` → `setStatus()`.
- `agent-crashed-warning` → alert.
- `agent-log` → internal logs array.

**Agent config summary** (read from `agent_list_agents()`) displayed as advisory footnote under agent selector — not editable.

---

## US-015 — Mini-Terminal Agent Output

### Overview
When `activeMainView === 'agent-orchestrator'`, a virtual mini-terminal tab "Agent 🤖" appears in the mini terminal strip. `agent-terminal-output` events are written directly into that session's xterm.js instance.

### Implementation

**`src/components/TerminalPanel.tsx`**

```typescript
// Virtual agent session is created in useEffect when activeMainView === 'agent-orchestrator'
const AGENT_MINI_SESSION_ID = '__agent_output__';

useEffect(() => {
  if (activeMainView !== 'agent-orchestrator') return;
  // Mount a read-only xterm instance for agent output
  // unlisten = listen<string>('agent-terminal-output', (e) => {
  //   agentTermRef.current?.write(e.payload);
  // });
  return () => unlisten();
}, [activeMainView]);
```

- Tab is read-only (no stdin connection).
- Tab shows `● Agent` with animated green pulse when `status === 'running'`.
- Tab disappears when `activeMainView` leaves `'agent-orchestrator'`.

---

## US-016 — Settings Agents Section

### Overview
New `'agents'` section in `SettingsPanel.tsx` for agent binary management and **config.yaml editing**. API keys (`.env` files) are explicitly excluded.

### Rust side — new commands

```rust
// agent_commands.rs
agent_read_config(agent_id)           → AgentConfig    // reads config.yaml
agent_write_config(agent_id, config)  → ()             // writes config.yaml (not .env)
```

`AgentConfig` is a serde struct with optional fields matching each agent's YAML schema. Unknown fields are preserved via `serde_yaml::Value` passthrough so CLX never silently drops settings it doesn't know about.

**Config paths resolved at runtime:**
- OI: `~/.openinterpreter/config.yaml` (fallback: `~/.interpreter/config.yaml`)
- Hermes: `~/.hermes/config.yaml`

### UI

```
Agents Settings
─────────────────────────────────────────────────────
Open Interpreter
  Status: Installed ✅  |  Version: rust-v0.0.25
  [Reinstall]  [Clear Runtime]

  Config (~/. openinterpreter/config.yaml)
  ┌─────────────────────────────────────────────┐
  │ Model:            [gpt-4o              ]     │
  │ Temperature:      [0.0        ]              │
  │ Context Window:   [8096       ]              │
  │ Sandbox Mode:     [workspace-write ▼  ]      │
  │ Auto Run:         [○ off  ● on         ]     │
  │ Custom Instructions:                         │
  │ [                                      ]     │
  └─────────────────────────────────────────────┘
  [Save Config]   ⚠ API keys managed in ~/.openinterpreter/.env

─────────────────────────────────────────────────────
Hermes CLI
  Binary path: [________________________] [Browse]
  [Validate]    ✅ Found  /  ❌ Not found

  Config (~/.hermes/config.yaml)
  ┌─────────────────────────────────────────────┐
  │ Model:            [hermes-3-llama-70b  ]     │
  │ Temperature:      [0.7        ]              │
  │ Max Tokens:       [4096       ]              │
  │ System Prompt:                               │
  │ [                                      ]     │
  └─────────────────────────────────────────────┘
  [Save Config]   ⚠ API keys managed in ~/.hermes/.env
```

**Rules:**
- Config is loaded into the form on section open; user edits in-place; clicks "Save Config" to write.
- If config.yaml doesn't exist yet → CLX creates it with only the fields the user filled in.
- Unknown fields (advanced settings CLX doesn't expose) are preserved on round-trip via raw YAML passthrough.
- "Save Config" applies immediately; agent must be restarted for changes to take effect (banner shown).
- `.env` files: never read, never written, never shown. A static note directs users to manage API keys with the agent's own CLI.

---

## Validation Plan

### Automated Tests

```bash
cargo test --manifest-path src-tauri/Cargo.toml
npm run build
```

### Manual Verification

1. **Sidebar order:** "Agent Orchestor" icon is first in sidebar (top), uses brain icon, `cyber-electric` active color.
2. **Label rename:** CLI Manager tooltip → "Terminal Orchestor". Agent tab tooltip → "Agent Orchestor".
3. **Agent picker:** Panel shows dropdown with "Open Interpreter" and "Hermes CLI". Status badges reflect actual install state.
4. **OI ACP:** Start OI → send prompt → streaming text arrives in chat, tool cards appear, approval cards work.
5. **Hermes ACP:** Configure valid `hermes.exe` path → Start Hermes → `hermes acp` launches, streaming works.
6. **Config read:** Settings → Agents → Open Interpreter config form loads current values from `~/.openinterpreter/config.yaml`.
7. **Config write:** Edit `model` field → Save Config → re-open → new value persisted in config.yaml. Unknown fields preserved.
8. **Config create:** Delete config.yaml → open Settings → fill fields → Save → file created with only filled fields.
9. **Restart banner:** Saving config while agent running shows "Restart agent for changes to take effect" notice.
10. **Mini terminal:** With agent running → "Agent 🤖" tab appears in mini terminal strip → text output streams in.
11. **No .env access:** `.env` files never read, written, or shown in any UI.
12. **Settings → Agents:** Section renders; Hermes path can be browsed, saved, and validated; Hermes config.yaml editable.
13. **Old sidebar order migration:** Clear localStorage, reload → agent-orchestrator appears at top.

---

## Dependencies

**Rust:** Add `serde_yaml = "0.9"` to `src-tauri/Cargo.toml` for YAML read/write support.

---

## Stop Conditions

Pause for human decision if implementation would require:
- Reading or writing `.env` files for any agent (API keys — security boundary).
- Auto-detecting or downloading Hermes CLI.
- Supporting any agent that does not expose an ACP stdio interface.
- Supporting platforms other than Windows x64 in this release.
- Allowing the bundled Open Interpreter runtime to self-update.
