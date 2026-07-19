# 0011 Open Interpreter React Client UI

Date: 2026-07-16

## Status

Accepted

## Context

We need to build a full-featured agent user interface for Open Interpreter inside the CLI Orchestrator application. The interface needs to support workspace-grouped thread histories, real-time message stream inputs, collapsible reasoning blocks, tool status, permission/approval prompts, model/permission config changes, and run/install triggers.

## Decision

We implemented the following design elements for the Open Interpreter Client:
1. **Workspace-based LocalStorage Threads**:
   - Thread list, message histories, and active selections are stored in `localStorage` and grouped by selected workspace path.
   - Allows users to retrieve complete conversation state across restarts.
2. **Real-time JSON-RPC 2.0 Parser**:
   - Hooks into Rust stdout broadcast events and parses standard JSON-RPC 2.0 payloads.
   - Automatically maps `session/update` delta chunks into either assistant content stream or reasoning fields depending on the chunk type metadata.
   - Displays tool running indicators for active system commands.
3. **Dual-Trigger Action Approvals**:
   - For `session/request_permission` events, the UI suspends input fields and presents approval cards.
   - Offers "Allow Once" (responds to the current request), "Allow for Session" (safelists matching future queries), and "Deny" actions, immediately writing response payloads back to the stdin stream.
4. **Dynamic Backend Configuration Routing**:
   - Lists available proxy models dynamically using `proxyGetConfig()`.
   - Modifying model selections or permission options while the agent is idle automatically restarts the ACP subprocess to load the new settings instantly.

## Alternatives Considered

1. **Creating separate backend thread directories**: Rejected. Storing session histories directly in React state and saving them to browser storage is lightweight, fast, and does not require complex disk operations.

## Consequences

Positive:
- Robust conversational interface: streams assistant answers and thinking steps with modern aesthetics.
- Seamless proxy support: token usage is correctly logged on proxy backend models.
- Clean permission gates: safe command execution flow meets sandboxing goals.
