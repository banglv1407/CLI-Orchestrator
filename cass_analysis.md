# CASS & Cass-Memory System Analysis

## Overview

Two related projects by Dicklesworthstone that create a complete memory system for AI coding agents:

1. **coding_agent_session_search (CASS)** - Unified search engine for coding agent session history
2. **cass_memory_system** - Procedural memory layer that transforms sessions into actionable rules

---

## Project 1: coding_agent_session_search (CASS)

### Purpose
Unified TUI and CLI to index and search local coding agent session history across 11+ providers.

### Supported Agents
Codex, Claude Code, Gemini CLI, Cline, OpenCode, Amp, Cursor, ChatGPT, Aider, Pi-Agent, Factory (Droid)

### Key Technical Features

#### 1. Instant Search (<60ms Latency)
- **Search-as-you-type**: Results update with every keystroke
- **Edge N-Gram Indexing**: Pre-computes prefix matches during indexing
- **Smart Tokenization**: Handles `snake_case`, hyphenated terms, code symbols (`c++`, `foo.bar`)
- **Zero-Stall Updates**: Background indexer commits atomically

#### 2. Optional Semantic Search (Local, No Network)
- **MiniLM model** via FastEmbed for local ML inference
- **Hash embedder fallback** (FNV-1a) when ML model not installed
- **FSVI vector index format**: Memory-mappable, supports quantization (f32/f16)
- **Three search modes**:
  - **Lexical**: BM25 full-text (exact term matching)
  - **Semantic**: Vector similarity (conceptual queries)
  - **Hybrid**: Reciprocal Rank Fusion (balanced precision/recall)

#### 3. Advanced Search Features
- Wildcard patterns: `foo*`, `*foo`, `*foo*`
- Auto-fuzzy fallback when exact searches sparse
- Query history deduplication
- Match quality ranking (exact > wildcard > fuzzy)

#### 4. Rich Terminal UI (TUI)
- Three-pane layout: filter bar, results, details
- Powered by **FrankenTUI** (Elm-architecture TUI framework)
- Syntax highlighting, markdown rendering
- Analytics dashboard with 7 views
- Macro recording, asciicast export

#### 5. Universal Connectors
Ingests from all major agents, normalizes to unified schema:
- **Codex**: `~/.codex/sessions` (Rollout JSONL)
- **Claude Code**: `~/.claude/projects` (Session JSONL)
- **Cursor**: SQLite `state.vscdb`
- **Aider**: Markdown history files
- **Gemini CLI**: Chat JSON
- And more...

#### 6. Remote Sources (Multi-Machine Search)
- SSH/rsync to sync session data from multiple machines
- Interactive setup wizard (`cass sources setup`)
- Path mappings for cross-platform compatibility

### Technical Stack
- **Language**: Rust
- **Search Engine**: Tantivy (BM25)
- **Vector Search**: Custom FSVI format
- **UI Framework**: FrankenTUI

---

## Project 2: cass_memory_system

### Purpose
Procedural memory for AI coding agents - transforms scattered session history into persistent, cross-agent memory.

### Three-Layer Cognitive Architecture

```
+-----------------------------------------+
| EPISODIC MEMORY (CASS)                  |
| Raw session logs - the "ground truth"   |
+----------------+------------------------+
                 | cass search
                 v
+-----------------------------------------+
| WORKING MEMORY (Diary)                  |
| Structured session summaries            |
| accomplishments | decisions | challenges |
+----------------+------------------------+
                 | reflect + curate
                 v
+-----------------------------------------+
| PROCEDURAL MEMORY (Playbook)            |
| Distilled rules with confidence tracking|
| Rules | Anti-patterns | Feedback | Decay |
+-----------------------------------------+
```

### Key Technical Features

#### 1. Cross-Agent Learning
- Sessions from all AI coding agents feed unified knowledge base
- Pattern discovered in Cursor automatically helps Claude Code
- No manual knowledge transfer required

#### 2. Confidence Decay System
- **90-day half-life**: Confidence halves without revalidation
- **4x harmful multiplier**: One mistake counts 4x as much as success
- **Maturity progression**: `candidate` -> `established` -> `proven`

#### 3. Anti-Pattern Learning
- Bad rules become warnings when marked harmful multiple times
- Automatically inverted into anti-patterns

#### 4. Scientific Validation
- Rules validated against CASS history before acceptance
- Evidence gate checks for historical support

#### 5. Graceful Degradation
- Works even when components missing:
  - No CASS: Playbook-only scoring
  - No playbook: Empty playbook, commands work
  - No LLM: Deterministic reflection
  - Offline: Cached playbook + local diary

#### 6. Agent-Native Onboarding
- Zero-cost approach using your existing AI agent
- Gap analysis identifies underrepresented categories
- Progress tracking persists across sessions

### Technical Stack
- **Language**: TypeScript/Bun
- **Integration**: CASS for episodic memory
- **Protocol**: MCP Server support
- **CLI**: JSON output for machine readability

### CLI Commands (Agent Workflow)
```bash
# Get context before starting task
cm context "implement auth" --json

# Self-documentation
cm quickstart --json

# System health
cm doctor --json

# Feedback on rules
cm mark b-8f3a2c --helpful
cm mark b-x7k9p1 --harmful --reason "Caused regression"

# Record outcome
cm outcome success b-8f3a2c,b-xyz789 --summary "Fixed auth bug"
```

---

## Key Insights for CLI-Orchestrator

### Potential Applications

1. **Session Indexing**: Use CASS to index CLI tool interactions
2. **Cross-Tool Memory**: Enable agents to learn from each other's CLI sessions
3. **Semantic Search**: Implement vector search for natural language queries
4. **Rule Extraction**: Apply playbook system for best practice capture

### Architecture Pattern to Adopt

1. **Unified Schema**: Normalize different CLI tool outputs to common format
2. **Layered Memory**: Episodic -> Working -> Procedural
3. **Confidence Tracking**: Implement decay system for rule reliability
4. **Graceful Degradation**: Design for operation with missing components

### Technical Implementation Notes

- Use Tantivy/BM25 for full-text search
- Consider FSVI or similar for vector embeddings
- Implement atomic index commits for zero-stall updates
- Design JSON-first CLI output for agent integration
