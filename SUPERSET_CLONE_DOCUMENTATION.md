# Superset Clone - Implementation Documentation

## Overview

This document provides a comprehensive analysis of the [Superset](https://github.com/superset-sh/superset) project to guide the implementation of a similar application.

---

## 1. Project Purpose

**Superset** is a desktop application that serves as an "IDE for the AI Agents Era." It enables developers to:
- Run multiple CLI-based AI coding agents simultaneously (Claude Code, Codex CLI, Cursor Agent, etc.)
- Isolate each agent using Git worktrees
- Monitor agent activity and review changes
- Switch between tasks efficiently without context-switching overhead

---

## 2. Technology Stack

| Component | Technology |
|-----------|------------|
| **Runtime** | Bun v1.0+ |
| **Desktop Framework** | Electron |
| **Primary Language** | TypeScript (94.3%) |
| **Monorepo Tool** | Turborepo |
| **Package Manager** | Bun |
| **Version Control** | Git 2.20+ (with worktrees) |
| **Reverse Proxy** | Caddy (for ElectricSQL streams) |
| **CLI Tool** | GitHub CLI (`gh`) |
| **Linting/Formatting** | Biome |
| **API Layer** | tRPC |
| **Database** | PostgreSQL (with ElectricSQL for sync) |

---

## 3. Monorepo Architecture

### Directory Structure

```
superset/
├── .github/                    # GitHub workflows and configurations
├── .superset/                  # Superset-specific configurations
│   ├── lib/                    # Setup/teardown library functions
│   ├── config.json             # Workspace lifecycle config
│   ├── setup.sh                # Environment setup script
│   └── teardown.sh             # Environment teardown script
├── apps/                       # Application code
│   ├── admin/                  # Admin dashboard
│   ├── api/                    # Backend API server
│   ├── desktop/                # Electron desktop app (MAIN APP)
│   ├── docs/                   # Documentation site (Next.js + Fumadocs)
│   ├── electric-proxy/         # ElectricSQL proxy service
│   ├── marketing/              # Marketing website
│   ├── mobile/                 # Mobile application
│   ├── streams/                # Streaming service
│   └── web/                    # Web application
├── packages/                   # Shared packages
│   ├── agent/                  # AI agent orchestration
│   ├── auth/                   # Authentication services
│   ├── chat-mastra/            # Chat integration with Mastra
│   ├── chat/                   # Core chat functionality
│   ├── db/                     # Database utilities
│   ├── desktop-mcp/            # Desktop MCP integration
│   ├── email/                  # Email services
│   ├── local-db/               # Local database storage
│   ├── mcp/                    # Model Context Protocol core
│   ├── scripts/                # Build/deployment scripts
│   ├── shared/                 # Shared utilities and types
│   ├── trpc/                   # tRPC API layer
│   └── ui/                     # UI components library
├── tooling/                    # Development tooling
│   └── typescript/             # TypeScript configurations
├── scripts/                    # Repository scripts
├── patches/                    # NPM package patches
└── docs/                       # Documentation source
```

### Key Configuration Files

#### `package.json` (Root)
```json
{
  "name": "@superset/repo",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "packageManager": "bun@1.3.6",
  "workspaces": ["packages/*", "apps/*", "tooling/*"],
  "scripts": {
    "dev": "turbo run dev dev:caddy --filter=@superset/api --filter=@superset/web --filter=@superset/desktop --filter=electric-proxy",
    "dev:all": "turbo dev",
    "build": "turbo build --filter=@superset/desktop",
    "test": "turbo test",
    "lint": "./scripts/lint.sh",
    "typecheck": "turbo typecheck",
    "db:push": "bun run --cwd packages/db push",
    "db:migrate": "bun run --cwd packages/db migrate"
  }
}
```

#### `turbo.jsonc`
Defines build pipeline, caching strategy, and environment variables for the monorepo.

#### `bunfig.toml`
```toml
[install]
linker = "isolated"  # Prevents dependency hoisting issues
```

---

## 4. Core Features Implementation

### 4.1 Git Worktree Management

**Purpose:** Isolate each AI agent's work in separate branches/directories.

**Implementation Approach:**
```bash
# Create worktree for new workspace
git worktree add -b <branch-name> <path-to-worktree>

# Remove worktree when done
git worktree remove <path-to-worktree>
```

**Key Files to Implement:**
- `apps/desktop/src/lib/git/worktree.ts` - Worktree CRUD operations
- `apps/desktop/src/lib/git/branch.ts` - Branch management
- `apps/desktop/src/lib/git/diff.ts` - Change detection

**Workflow:**
1. User creates new workspace → Create git worktree on new branch
2. Run setup scripts (`.superset/setup.sh`)
3. Agent runs in isolated worktree
4. Monitor changes via git diff
5. User reviews and merges changes

### 4.2 Terminal Engine

**Purpose:** Run multiple CLI agents in isolated terminal tabs/panes.

**Implementation Approach:**
- Use `node-pty` or similar PTY library for terminal emulation
- Each agent gets its own PTY instance
- Support for multiple tabs/panes per workspace

**Key Files to Implement:**
- `apps/desktop/src/components/Terminal/Terminal.tsx` - Terminal UI component
- `apps/desktop/src/lib/terminal/pty-manager.ts` - PTY instance management
- `apps/desktop/src/lib/terminal/agent-launcher.ts` - Agent process launcher

### 4.3 Agent Configuration

**Purpose:** Support multiple CLI agents (Claude Code, Codex CLI, etc.)

**Implementation Approach:**
```json
{
  "agents": {
    "claude-code": {
      "command": "claude",
      "args": ["-p", "{{prompt}}"],
      "env": {}
    },
    "codex-cli": {
      "command": "codex",
      "args": ["--prompt", "{{prompt}}"],
      "env": {}
    }
  }
}
```

**Key Files to Implement:**
- `packages/agent/src/config.ts` - Agent configuration schema
- `packages/agent/src/launcher.ts` - Agent process launcher
- `packages/agent/src/types.ts` - Agent types and interfaces

### 4.4 Workspace Management

**Purpose:** Manage multiple isolated workspaces with their own setup/teardown.

**Configuration (`.superset/config.json`):**
```json
{
  "setup": ["./.superset/setup.sh"],
  "teardown": ["./.superset/teardown.sh"]
}
```

**Key Files to Implement:**
- `apps/desktop/src/lib/workspace/manager.ts` - Workspace CRUD
- `apps/desktop/src/lib/workspace/setup.ts` - Setup script execution
- `apps/desktop/src/lib/workspace/teardown.ts` - Cleanup operations

### 4.5 Diff Viewer

**Purpose:** Review and edit agent changes before merging.

**Key Files to Implement:**
- `apps/desktop/src/components/DiffViewer/DiffViewer.tsx` - Diff UI
- `apps/desktop/src/lib/git/diff-parser.ts` - Parse git diff output
- `apps/desktop/src/components/Editor/Editor.tsx` - Inline code editor

### 4.6 Electron Main Process

**Purpose:** Desktop app window management, IPC, and native features.

**Key Files to Implement:**
- `apps/desktop/electron/main.ts` - Electron main entry point
- `apps/desktop/electron/preload.ts` - Preload script for IPC
- `apps/desktop/electron/window-manager.ts` - Window creation/management
- `apps/desktop/electron/ipc-handlers.ts` - IPC communication handlers

---

## 5. Setup Scripts Implementation

### `.superset/setup.sh`
```bash
#!/usr/bin/env bash
set -uo pipefail

SUPERSET_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SUPERSET_SCRIPT_DIR/lib/common.sh"
source "$SUPERSET_SCRIPT_DIR/lib/setup/args.sh"
source "$SUPERSET_SCRIPT_DIR/lib/setup/steps.sh"
source "$SUPERSET_SCRIPT_DIR/lib/setup/main.sh"

setup_main "$@"
```

### `.superset/teardown.sh`
```bash
#!/usr/bin/env bash
set -uo pipefail

SUPERSET_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SUPERSET_SCRIPT_DIR/lib/common.sh"
source "$SUPERSET_SCRIPT_DIR/lib/teardown/args.sh"
source "$SUPERSET_SCRIPT_DIR/lib/teardown/steps.sh"
source "$SUPERSET_SCRIPT_DIR/lib/teardown/main.sh"

teardown_main "$@"
```

### Library Structure (`.superset/lib/`)
```
.superset/lib/
├── common.sh           # Shared utilities
├── setup/
│   ├── args.sh        # Argument parsing for setup
│   ├── steps.sh       # Setup steps implementation
│   └── main.sh        # Main setup entry point
└── teardown/
    ├── args.sh        # Argument parsing for teardown
    ├── steps.sh       # Teardown steps implementation
    └── main.sh        # Main teardown entry point
```

---

## 6. Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL=
DATABASE_URL_UNPOOLED=

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WEB_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
NEXT_PUBLIC_ELECTRIC_URL=http://localhost:3003

# Analytics
POSTHOG_API_KEY=
POSTHOG_PROJECT_ID=

# Storage
BLOB_READ_WRITE_TOKEN=
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

### Caddy Configuration (`Caddyfile`)
Required for ElectricSQL streams in development:
```caddyfile
localhost:3003 {
    reverse_proxy electric-proxy
}
```

---

## 7. Development Workflow

### Initial Setup
```bash
# Clone repository
git clone https://github.com/superset-sh/superset.git
cd superset

# Copy environment files
cp .env.example .env
cp Caddyfile.example Caddyfile

# Install dependencies
bun install

# Run postinstall scripts
bun run postinstall

# Start development
bun run dev
```

### Development Commands
```bash
# Start all services
bun run dev:all

# Start core services only
bun run dev

# Start docs
bun run dev:docs

# Build desktop app
bun run build

# Run tests
bun run test

# Type check
bun run typecheck

# Lint
bun run lint
```

---

## 8. Key Implementation Files to Create

### Desktop App (`apps/desktop/`)
```
apps/desktop/
├── electron/
│   ├── main.ts              # Main process entry
│   ├── preload.ts           # Preload script
│   ├── window-manager.ts    # Window management
│   └── ipc-handlers.ts      # IPC handlers
├── src/
│   ├── components/
│   │   ├── Terminal/
│   │   ├── DiffViewer/
│   │   ├── Workspace/
│   │   └── Editor/
│   ├── lib/
│   │   ├── git/
│   │   │   ├── worktree.ts
│   │   │   ├── branch.ts
│   │   │   └── diff.ts
│   │   ├── terminal/
│   │   │   ├── pty-manager.ts
│   │   │   └── agent-launcher.ts
│   │   ├── workspace/
│   │   │   ├── manager.ts
│   │   │   ├── setup.ts
│   │   │   └── teardown.ts
│   │   └── agent/
│   │       ├── config.ts
│   │       └── launcher.ts
│   ├── hooks/
│   │   ├── useWorkspace.ts
│   │   ├── useAgent.ts
│   │   └── useTerminal.ts
│   └── App.tsx
├── package.json
└── vite.config.ts
```

### Shared Packages (`packages/`)
```
packages/
├── agent/
│   ├── src/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── config.ts
│   │   └── launcher.ts
│   └── package.json
├── shared/
│   ├── src/
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   └── package.json
└── ui/
    ├── src/
    │   ├── components/
    │   └── index.ts
    └── package.json
```

---

## 9. Dependencies to Install

### Desktop App Dependencies
```json
{
  "dependencies": {
    "electron": "^latest",
    "node-pty": "^latest",
    "xterm": "^latest",
    "xterm-addon-fit": "^latest",
    "diff": "^latest",
    "simple-git": "^latest"
  },
  "devDependencies": {
    "electron-builder": "^latest",
    "vite-plugin-electron": "^latest",
    "@types/node-pty": "^latest"
  }
}
```

### Root Dependencies
```json
{
  "devDependencies": {
    "turbo": "^2.8.7",
    "@biomejs/biome": "^2.4.2",
    "typescript": "^latest"
  }
}
```

---

## 10. Implementation Roadmap

### Phase 1: Foundation
- [ ] Set up monorepo with Turborepo
- [ ] Configure Bun as package manager
- [ ] Create basic package structure
- [ ] Set up TypeScript configuration

### Phase 2: Core Desktop App
- [ ] Initialize Electron app
- [ ] Implement window management
- [ ] Set up IPC communication
- [ ] Create basic UI layout

### Phase 3: Git Integration
- [ ] Implement git worktree management
- [ ] Create branch management utilities
- [ ] Build diff detection and parsing
- [ ] Add change monitoring

### Phase 4: Terminal Engine
- [ ] Integrate node-pty
- [ ] Build terminal UI component
- [ ] Implement multi-tab/pane support
- [ ] Add terminal state management

### Phase 5: Agent Integration
- [ ] Create agent configuration system
- [ ] Implement agent launcher
- [ ] Add agent monitoring
- [ ] Support multiple agent types

### Phase 6: Workspace Management
- [ ] Build workspace CRUD operations
- [ ] Implement setup/teardown scripts
- [ ] Add workspace persistence
- [ ] Create workspace switching UI

### Phase 7: Diff Viewer & Editor
- [ ] Build diff viewer component
- [ ] Implement inline code editor
- [ ] Add change review workflow
- [ ] Create merge/approve actions

### Phase 8: Polish & Production
- [ ] Add keyboard shortcuts
- [ ] Implement notifications
- [ ] Add settings/preferences
- [ ] Build release pipeline
- [ ] Write documentation

---

## 11. Important Considerations

### Platform Support
- **Primary:** macOS (Git worktrees work best on Unix-like systems)
- **Secondary:** Linux (should work with minimal changes)
- **Tertiary:** Windows (requires WSL or git-for-windows adjustments)

### Security
- Never expose API keys in client-side code
- Use environment variables for sensitive data
- Implement proper IPC validation in Electron
- Sanitize all user inputs

### Performance
- Use isolated linker in Bun to prevent dependency conflicts
- Cache build outputs with Turborepo
- Lazy load Electron modules
- Optimize terminal rendering for large outputs

### Testing
- Unit tests for git operations
- Integration tests for agent launching
- E2E tests for workspace workflows
- Manual testing for terminal emulation

---

## 12. Resources

- **Original Project:** https://github.com/superset-sh/superset
- **Electron Docs:** https://www.electronjs.org/docs
- **Turborepo Docs:** https://turbo.build/repo/docs
- **Bun Docs:** https://bun.sh/docs
- **Git Worktree Docs:** https://git-scm.com/docs/git-worktree
- **node-pty:** https://github.com/microsoft/node-pty
- **xterm.js:** https://xtermjs.org/

---

## 13. License

Original project uses **Apache 2.0 License**. Ensure compliance when implementing similar functionality.
