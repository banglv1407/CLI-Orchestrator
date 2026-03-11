# Superset - Complete Feature Specification

This document lists **ALL functions and features** you need to implement to build a Superset-like application.

---

## Table of Contents

1. [Core Features](#1-core-features)
2. [Workspace Management](#2-workspace-management)
3. [Terminal Features](#3-terminal-features)
4. [Agent Management](#4-agent-management)
5. [Git Integration](#5-git-integration)
6. [Diff Viewer](#6-diff-viewer)
7. [Keyboard Shortcuts](#7-keyboard-shortcuts)
8. [Settings & Configuration](#8-settings--configuration)
9. [Notifications](#9-notifications)
10. [IDE Integration](#10-ide-integration)
11. [UI Components](#11-ui-components)
12. [Electron Features](#12-electron-features)

---

## 1. Core Features

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1.1 | **Parallel Agent Execution** | Run 10+ coding agents simultaneously | 🔴 Critical |
| 1.2 | **Worktree Isolation** | Each task gets isolated git worktree + branch | 🔴 Critical |
| 1.3 | **Multi-tab Terminal** | Multiple terminal tabs per workspace | 🔴 Critical |
| 1.4 | **Pane Splitting** | Split terminal horizontally/vertically | 🔴 Critical |
| 1.5 | **Real-time Agent Monitoring** | Track agent status and activity | 🔴 Critical |
| 1.6 | **Change Detection** | Detect file changes made by agents | 🔴 Critical |
| 1.7 | **Quick Context Switching** | Jump between workspaces instantly | 🟠 High |
| 1.8 | **Universal Agent Support** | Support any CLI-based coding agent | 🟠 High |

---

## 2. Workspace Management

### 2.1 Workspace CRUD Operations

| # | Function | Description | API/Method |
|---|----------|-------------|------------|
| 2.1.1 | `createWorkspace(name, branch?)` | Create new workspace with git worktree | `git worktree add -b <branch> <path>` |
| 2.1.2 | `deleteWorkspace(path)` | Remove workspace and cleanup | `git worktree remove <path>` |
| 2.1.3 | `listWorkspaces()` | Get all active workspaces | `git worktree list` |
| 2.1.4 | `getWorkspaceInfo(path)` | Get workspace details (branch, path, status) | `git branch --show-current` |
| 2.1.5 | `switchWorkspace(id)` | Activate/focus a workspace | Internal state management |
| 2.1.6 | `renameWorkspace(id, newName)` | Change workspace display name | Internal state + file update |

### 2.2 Setup/Teardown System

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 2.2.1 | `runSetupScripts(workspace)` | Execute setup commands on workspace creation | Run `.superset/setup.sh` |
| 2.2.2 | `runTeardownScripts(workspace)` | Execute cleanup on workspace deletion | Run `.superset/teardown.sh` |
| 2.2.3 | `parseConfigFile()` | Read `.superset/config.json` | JSON parse |
| 2.2.4 | `injectEnvVariables()` | Pass SUPERSET_* env vars to scripts | Process env injection |

### 2.3 Workspace Presets

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 2.3.1 | `createPreset(name, config)` | Save workspace template | Store in config file |
| 2.3.2 | `loadPreset(name)` | Apply preset to new workspace | Execute preset commands |
| 2.3.3 | `deletePreset(name)` | Remove saved preset | Delete from config |
| 2.3.4 | `listPresets()` | Show all available presets | Read config file |

### 2.4 Project Management

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 2.4.1 | `openProjectDialog()` | File picker to select project root | Electron dialog |
| 2.4.2 | `setRootPath(path)` | Set the main repository path | State management |
| 2.4.3 | `getRootPath()` | Get current root path | State getter |
| 2.4.4 | `validateProject(path)` | Check if path is valid git repo | `git rev-parse --git-dir` |

---

## 3. Terminal Features

### 3.1 PTY Management

| # | Function | Description | Library |
|---|----------|-------------|---------|
| 3.1.1 | `createPTY(shell, cwd, env)` | Spawn new PTY instance | `node-pty` |
| 3.1.2 | `killPTY(pid)` | Terminate PTY process | `node-pty` |
| 3.1.3 | `resizePTY(pid, cols, rows)` | Resize terminal | `node-pty` |
| 3.1.4 | `writePTY(pid, data)` | Send input to terminal | `node-pty` |
| 3.1.5 | `onPTYData(pid, callback)` | Listen to terminal output | `node-pty` |
| 3.1.6 | `listPTYs()` | Get all active PTY instances | Internal tracking |

### 3.2 Tab Management

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 3.2.1 | `createTab(workspaceId, shell?)` | Add new terminal tab | Create PTY + UI tab |
| 3.2.2 | `closeTab(tabId)` | Remove terminal tab | Kill PTY + remove UI |
| 3.2.3 | `switchTab(tabId)` | Focus different tab | State management |
| 3.2.4 | `renameTab(tabId, name)` | Custom tab name | State + UI update |
| 3.2.5 | `duplicateTab(tabId)` | Clone existing tab | Copy PTY config |
| 3.2.6 | `getNextTabId()` | Navigate to next tab | State navigation |
| 3.2.7 | `getPreviousTabId()` | Navigate to previous tab | State navigation |

### 3.3 Pane Splitting

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 3.3.1 | `splitPaneRight(tabId)` | Create vertical split | Flexbox layout + new PTY |
| 3.3.2 | `splitPaneDown(tabId)` | Create horizontal split | Flexbox layout + new PTY |
| 3.3.3 | `closePane(paneId)` | Remove split pane | Kill PTY + remove UI |
| 3.3.4 | `focusPane(paneId)` | Focus specific pane | State management |
| 3.3.5 | `resizePane(paneId, size)` | Adjust pane dimensions | CSS grid/flex update |
| 3.3.6 | `getPaneLayout()` | Get current layout tree | State getter |
| 3.3.7 | `setPaneLayout(layout)` | Set layout configuration | State setter |

### 3.4 Terminal Operations

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 3.4.1 | `clearTerminal(paneId)` | Clear terminal buffer | `clear` command or xterm API |
| 3.4.2 | `findInTerminal(query)` | Search terminal output | xterm find addon |
| 3.4.3 | `copyFromTerminal(paneId)` | Copy selected text | Clipboard API |
| 3.4.4 | `pasteToTerminal(paneId, text)` | Paste to terminal | PTY write |
| 3.4.5 | `selectText(paneId, range)` | Select text range | xterm selection API |
| 3.4.6 | `getTerminalBuffer(paneId)` | Get scrollback buffer | xterm buffer API |

### 3.5 Terminal UI (xterm.js)

| # | Component | Description | Props |
|---|-----------|-------------|-------|
| 3.5.1 | `<Terminal />` | Main terminal component | `pty`, `theme`, `options` |
| 3.5.2 | `<TerminalTabs />` | Tab bar for terminals | `tabs`, `activeTab`, `onSelect` |
| 3.5.3 | `<TerminalPane />` | Split pane container | `layout`, `panes` |
| 3.5.4 | `<TerminalToolbar />` | Terminal actions toolbar | `onClear`, `onSplit`, `onClose` |

---

## 4. Agent Management

### 4.1 Agent Configuration

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 4.1.1 | `registerAgent(name, config)` | Add new agent type | Config file + state |
| 4.1.2 | `getAgentConfig(name)` | Get agent configuration | Config lookup |
| 4.1.3 | `updateAgentConfig(name, config)` | Modify agent settings | Config update |
| 4.1.4 | `deleteAgent(name)` | Remove agent type | Config delete |
| 4.1.5 | `listAgents()` | Get all registered agents | Config read |
| 4.1.6 | `validateAgentConfig(config)` | Validate agent configuration | Schema validation |

### 4.2 Agent Launcher

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 4.2.1 | `launchAgent(agentName, workspaceId, prompt?)` | Start agent in workspace | Spawn process in PTY |
| 4.2.2 | `stopAgent(agentId)` | Terminate running agent | Kill PTY process |
| 4.2.3 | `restartAgent(agentId)` | Restart agent | Stop + launch |
| 4.2.4 | `getAgentStatus(agentId)` | Get agent running state | Process check |
| 4.2.5 | `getAgentLogs(agentId)` | Get agent output history | Buffer read |
| 4.2.6 | `pauseAgent(agentId)` | Pause agent execution | SIGSTOP signal |
| 4.2.7 | `resumeAgent(agentId)` | Resume paused agent | SIGCONT signal |

### 4.3 Agent Monitoring

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 4.3.1 | `trackAgentActivity(agentId)` | Monitor agent progress | Parse terminal output |
| 4.3.2 | `detectAgentCompletion(agentId)` | Detect when agent finishes | Pattern matching |
| 4.3.3 | `detectAgentNeedsInput(agentId)` | Detect when agent waits for input | Pattern matching |
| 4.3.4 | `getAgentMetrics(agentId)` | Get performance metrics | Timing + resource tracking |
| 4.3.5 | `subscribeAgentStatus(agentId, callback)` | Listen to status changes | Event emitter |
| 4.3.6 | `getActiveAgents()` | List all running agents | State filter |

### 4.4 Pre-configured Agents

| Agent | Command | Args | Config Location |
|-------|---------|------|-----------------|
| Claude Code | `claude` | `-p "{{prompt}}"` | `~/.claude/config.json` |
| Codex CLI | `codex` | `--prompt "{{prompt}}"` | `~/.codex/config` |
| Cursor Agent | `cursor-agent` | `{{prompt}}` | `~/.cursor/config` |
| Gemini CLI | `gemini` | `-p "{{prompt}}"` | `~/.gemini/config` |
| GitHub Copilot | `copilot` | `{{prompt}}` | `~/.config/github-copilot` |
| OpenCode | `opencode` | `{{prompt}}` | `~/.opencode/config` |

---

## 5. Git Integration

### 5.1 Worktree Operations

| # | Function | Description | Git Command |
|---|----------|-------------|-------------|
| 5.1.1 | `createWorktree(path, branch)` | Create new worktree | `git worktree add -b <branch> <path>` |
| 5.1.2 | `removeWorktree(path)` | Delete worktree | `git worktree remove <path>` |
| 5.1.3 | `listWorktrees()` | Get all worktrees | `git worktree list --porcelain` |
| 5.1.4 | `pruneWorktrees()` | Clean stale worktrees | `git worktree prune` |
| 5.1.5 | `getWorktreeInfo(path)` | Get worktree details | `git worktree list` |
| 5.1.6 | `validateWorktree(path)` | Check worktree validity | `git rev-parse` |

### 5.2 Branch Operations

| # | Function | Description | Git Command |
|---|----------|-------------|-------------|
| 5.2.1 | `createBranch(name, base?)` | Create new branch | `git checkout -b <name> <base>` |
| 5.2.2 | `deleteBranch(name)` | Delete branch | `git branch -D <name>` |
| 5.2.3 | `renameBranch(oldName, newName)` | Rename branch | `git branch -m <old> <new>` |
| 5.2.4 | `checkoutBranch(name)` | Switch branch | `git checkout <name>` |
| 5.2.5 | `getCurrentBranch(path)` | Get current branch | `git branch --show-current` |
| 5.2.6 | `listBranches(path)` | List all branches | `git branch` |
| 5.2.7 | `getBranchStatus(branch)` | Get branch vs main status | `git rev-list --left-right` |

### 5.3 Diff Operations

| # | Function | Description | Git Command |
|---|----------|-------------|-------------|
| 5.3.1 | `getDiff(path)` | Get all changes in worktree | `git diff HEAD` |
| 5.3.2 | `getStagedDiff(path)` | Get staged changes | `git diff --cached` |
| 5.3.3 | `getFileDiff(path, file)` | Get diff for specific file | `git diff HEAD -- <file>` |
| 5.3.4 | `getDiffStats(path)` | Get change statistics | `git diff --stat` |
| 5.3.5 | `parseDiffOutput(diff)` | Parse git diff to structured data | Custom parser |
| 5.3.6 | `getChangedFiles(path)` | List all changed files | `git diff --name-only` |

### 5.4 Commit Operations

| # | Function | Description | Git Command |
|---|----------|-------------|-------------|
| 5.4.1 | `stageFile(path, file)` | Stage specific file | `git add <file>` |
| 5.4.2 | `stageAll(path)` | Stage all changes | `git add -A` |
| 5.4.3 | `unstageFile(path, file)` | Unstage file | `git restore --staged <file>` |
| 5.4.4 | `commit(path, message)` | Create commit | `git commit -m "<msg>"` |
| 5.4.5 | `amendCommit(path, message)` | Amend last commit | `git commit --amend` |
| 5.4.6 | `getCommitHistory(path, limit?)` | Get recent commits | `git log -n <limit>` |

### 5.5 Merge Operations

| # | Function | Description | Git Command |
|---|----------|-------------|-------------|
| 5.5.1 | `mergeBranch(target, source)` | Merge source into target | `git checkout <target> && git merge <source>` |
| 5.5.2 | `squashMerge(target, source)` | Squash merge | `git merge --squash <source>` |
| 5.5.3 | `abortMerge(path)` | Abort merge conflict | `git merge --abort` |
| 5.5.4 | `resolveConflict(path, file, content)` | Resolve merge conflict | Write file + stage |
| 5.5.5 | `getMergeConflicts(path)` | List conflict files | `git diff --name-only --diff-filter=U` |

### 5.6 Git Utilities

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 5.6.1 | `initRepo(path)` | Initialize git repo | `git init` |
| 5.6.2 | `cloneRepo(url, path)` | Clone remote repo | `git clone <url> <path>` |
| 5.6.3 | `isGitRepo(path)` | Check if valid git repo | `git rev-parse --git-dir` |
| 5.6.4 | `getRepoRoot(path)` | Get repository root | `git rev-parse --show-toplevel` |
| 5.6.5 | `getGitStatus(path)` | Get working directory status | `git status --porcelain` |
| 5.6.6 | `getGitConfig(path)` | Get git configuration | `git config --list` |

---

## 6. Diff Viewer

### 6.1 Diff Display

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 6.1.1 | `showDiff(file, oldContent, newContent)` | Display file diff | Monaco diff editor |
| 6.1.2 | `showInlineDiff(file)` | Inline diff in file view | Monaco editor decorations |
| 6.1.3 | `showSideBySideDiff(file)` | Side-by-side comparison | Monaco original/modified |
| 6.1.4 | `highlightChanges(diff)` | Syntax highlight diff | Prism/highlight.js |
| 6.1.5 | `collapseUnchangedRegions()` | Hide unchanged code | Custom folding |
| 6.1.6 | `expandAllRegions()` | Show full file | Remove folding |

### 6.2 Diff Navigation

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 6.2.1 | `nextChange()` | Jump to next change | Find next hunk |
| 6.2.2 | `previousChange()` | Jump to previous change | Find previous hunk |
| 6.2.3 | `goToChange(index)` | Jump to specific change | Index-based navigation |
| 6.2.4 | `listChanges()` | List all changes with line numbers | Parse diff hunks |
| 6.2.5 | `getChangeCount()` | Get total number of changes | Count hunks |

### 6.3 Diff Actions

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 6.3.1 | `acceptChange(hunk)` | Accept specific change | Apply hunk to file |
| 6.3.2 | `rejectChange(hunk)` | Reject specific change | Revert hunk |
| 6.3.3 | `acceptAllChanges()` | Accept all changes | Apply all hunks |
| 6.3.4 | `rejectAllChanges()` | Reject all changes | Revert all hunks |
| 6.3.5 | `editChange(hunk, newContent)` | Manually edit change | Open editor |
| 6.3.6 | `stageChange(hunk)` | Stage specific change | `git add -p` |

### 6.4 Diff Viewer UI

| # | Component | Description | Props |
|---|-----------|-------------|-------|
| 6.4.1 | `<DiffViewer />` | Main diff viewer component | `file`, `oldContent`, `newContent` |
| 6.4.2 | `<DiffToolbar />` | Diff actions toolbar | `onAccept`, `onReject`, `onStage` |
| 6.4.3 | `<DiffNavigation />` | Change navigation | `changes`, `currentIndex`, `onNavigate` |
| 6.4.4 | `<ChangeList />` | List of all changes | `changes`, `onSelect` |
| 6.4.5 | `<ChangesPanel />` | Side panel showing all changes | `files`, `selectedFile`, `onSelect` |

---

## 7. Keyboard Shortcuts

### 7.1 Shortcut System

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 7.1.1 | `registerShortcut(keys, action)` | Register new shortcut | Global shortcut registry |
| 7.1.2 | `unregisterShortcut(keys)` | Remove shortcut | Remove from registry |
| 7.1.3 | `triggerShortcut(keys)` | Manually trigger shortcut | Lookup + execute |
| 7.1.4 | `getShortcutForAction(action)` | Get keys for action | Registry lookup |
| 7.1.5 | `updateShortcut(action, newKeys)` | Change shortcut binding | Registry update |
| 7.1.6 | `exportShortcuts()` | Export all shortcuts | JSON export |
| 7.1.7 | `importShortcuts(config)` | Import shortcut config | JSON import |

### 7.2 Default Shortcuts

#### Workspace Shortcuts
| Keys | Action | Handler Function |
|------|--------|------------------|
| `⌘1-9` | Switch to workspace 1-9 | `switchWorkspace(index)` |
| `⌘⌥↑` | Previous workspace | `switchWorkspace(previous)` |
| `⌘⌥↓` | Next workspace | `switchWorkspace(next)` |
| `⌘N` | New workspace | `createWorkspace()` |
| `⌘⇧N` | Quick create workspace | `quickCreateWorkspace()` |
| `⌘⇧O` | Open project | `openProjectDialog()` |
| `⌘B` | Toggle workspaces sidebar | `toggleSidebar()` |

#### Terminal Shortcuts
| Keys | Action | Handler Function |
|------|--------|------------------|
| `⌘T` | New tab | `createTab()` |
| `⌘W` | Close pane/terminal | `closeTab()` |
| `⌘D` | Split right | `splitPaneRight()` |
| `⌘⇧D` | Split down | `splitPaneDown()` |
| `⌘K` | Clear terminal | `clearTerminal()` |
| `⌘F` | Find in terminal | `findInTerminal()` |
| `⌘⌥←` | Previous tab | `switchTab(previous)` |
| `⌘⌥→` | Next tab | `switchTab(next)` |
| `Ctrl+1-9` | Open preset 1-9 | `openPreset(index)` |

#### Layout Shortcuts
| Keys | Action | Handler Function |
|------|--------|------------------|
| `⌘L` | Toggle changes panel | `toggleChangesPanel()` |
| `⌘O` | Open in external app | `openInExternalApp()` |
| `⌘⇧C` | Copy path | `copyPath()` |
| `⌘/` | Open keyboard shortcuts | `showShortcutsModal()` |

#### Editor Shortcuts
| Keys | Action | Handler Function |
|------|--------|------------------|
| `⌘S` | Save file | `saveFile()` |
| `⌘⇧S` | Save all files | `saveAllFiles()` |
| `⌘P` | Quick open file | `quickOpenFile()` |
| `⌘⇧F` | Find in files | `searchInFiles()` |

### 7.3 Shortcut Configuration

```json
{
  "shortcuts": {
    "workspace.switch.1": "Cmd+1",
    "workspace.switch.2": "Cmd+2",
    "workspace.new": "Cmd+N",
    "terminal.newTab": "Cmd+T",
    "terminal.splitRight": "Cmd+D",
    "terminal.splitDown": "Cmd+Shift+D",
    "terminal.clear": "Cmd+K",
    "diff.togglePanel": "Cmd+L",
    "help.shortcuts": "Cmd+/"
  }
}
```

---

## 8. Settings & Configuration

### 8.1 Application Settings

| # | Setting | Type | Default | Description |
|---|---------|------|---------|-------------|
| 8.1.1 | `theme` | enum | `system` | Light/Dark/System theme |
| 8.1.2 | `fontSize` | number | `14` | Terminal font size |
| 8.1.3 | `fontFamily` | string | `Menlo` | Terminal font family |
| 8.1.4 | `lineHeight` | number | `1.5` | Terminal line height |
| 8.1.5 | `cursorStyle` | enum | `block` | Block/Underline/Line cursor |
| 8.1.6 | `cursorBlink` | boolean | `true` | Blinking cursor |
| 8.1.7 | `scrollbackLines` | number | `10000` | Terminal scrollback |
| 8.1.8 | `defaultShell` | string | `bash` | Default shell path |
| 8.1.9 | `workspaceRoot` | string | `~` | Default workspace location |
| 8.1.10 | `autoSave` | boolean | `true` | Auto-save files |
| 8.1.11 | `confirmClose` | boolean | `true` | Confirm before closing |
| 8.1.12 | `notifications` | object | `{}` | Notification preferences |

### 8.2 Settings Management

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 8.2.1 | `getSettings()` | Get all settings | Read config file |
| 8.2.2 | `getSetting(key)` | Get specific setting | Config lookup |
| 8.2.3 | `setSetting(key, value)` | Update setting | Config write + notify |
| 8.2.4 | `resetSettings()` | Reset to defaults | Delete config |
| 8.2.5 | `exportSettings()` | Export settings | JSON export |
| 8.2.6 | `importSettings(config)` | Import settings | JSON import + validate |

### 8.3 Settings UI

| # | Component | Description | Props |
|---|-----------|-------------|-------|
| 8.3.1 | `<SettingsModal />` | Main settings dialog | `isOpen`, `onClose` |
| 8.3.2 | `<SettingsSidebar />` | Settings categories | `activeCategory`, `onSelect` |
| 8.3.3 | `<GeneralSettings />` | General settings panel | `settings`, `onChange` |
| 8.3.4 | `<TerminalSettings />` | Terminal settings panel | `settings`, `onChange` |
| 8.3.5 | `<KeyboardShortcutsSettings />` | Shortcuts configuration | `shortcuts`, `onChange` |
| 8.3.6 | `<AgentSettings />` | Agent configuration | `agents`, `onChange` |

---

## 9. Notifications

### 9.1 Notification Types

| Type | Trigger | Display |
|------|---------|---------|
| `agent.complete` | Agent finishes task | Toast + badge |
| `agent.input_needed` | Agent waits for input | Toast + highlight |
| `agent.error` | Agent crashes/errors | Toast + error panel |
| `workspace.ready` | Workspace setup complete | Toast |
| `workspace.error` | Setup/teardown failed | Toast + details |
| `git.conflict` | Merge conflict detected | Toast + conflict panel |
| `update.available` | New app version | Toast + update dialog |

### 9.2 Notification System

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 9.1.1 | `showNotification(type, title, body)` | Display notification | Electron Notification |
| 9.1.2 | `dismissNotification(id)` | Close notification | Remove from queue |
| 9.1.3 | `dismissAllNotifications()` | Clear all notifications | Clear queue |
| 9.1.4 | `getNotificationHistory()` | Get past notifications | State array |
| 9.1.5 | `subscribeNotifications(callback)` | Listen for notifications | Event emitter |
| 9.1.6 | `setNotificationPreferences(prefs)` | Configure notification settings | Config update |

### 9.3 Notification UI

| # | Component | Description | Props |
|---|-----------|-------------|-------|
| 9.3.1 | `<NotificationCenter />` | Notification list | `notifications`, `onDismiss` |
| 9.3.2 | `<Toast />` | Single toast notification | `type`, `title`, `body`, `onDismiss` |
| 9.3.3 | `<NotificationBadge />` | Unread count badge | `count` |
| 9.3.4 | `<NotificationPanel />` | Full notification panel | `isOpen`, `onClose` |

---

## 10. IDE Integration

### 10.1 External Editor Support

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 10.1.1 | `openInVSCode(path)` | Open in VS Code | `code <path>` |
| 10.1.2 | `openInWebStorm(path)` | Open in WebStorm | `wstorm <path>` |
| 10.1.3 | `openInCursor(path)` | Open in Cursor | `cursor <path>` |
| 10.1.4 | `openInZed(path)` | Open in Zed | `zed <path>` |
| 10.1.5 | `openInCustom(path, command)` | Open with custom command | Spawn process |
| 10.1.6 | `detectInstalledEditors()` | Find available editors | Check PATH |

### 10.2 File Operations

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 10.2.1 | `openFile(path)` | Open file in internal editor | Monaco editor |
| 10.2.2 | `saveFile(path, content)` | Save file | Write file |
| 10.2.3 | `deleteFile(path)` | Delete file | `fs.unlink` |
| 10.2.4 | `renameFile(oldPath, newPath)` | Rename/move file | `fs.rename` |
| 10.2.5 | `createFile(path, content?)` | Create new file | `fs.writeFile` |
| 10.2.6 | `copyPath(path)` | Copy file path to clipboard | Clipboard API |

### 10.3 Quick Open

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 10.3.1 | `quickOpenFile()` | Open file picker (⌘P) | Fuzzy search + dialog |
| 10.3.2 | `searchFiles(query, root)` | Search files by name | Fuzzy match |
| 10.3.3 | `searchInFiles(query, root)` | Search file contents | `ripgrep` integration |
| 10.3.4 | `getRecentFiles()` | Get recently opened files | State tracking |
| 10.3.5 | `clearRecentFiles()` | Clear recent files list | State reset |

---

## 11. UI Components

### 11.1 Main Layout

| # | Component | Description | State |
|---|-----------|-------------|-------|
| 11.1.1 | `<App />` | Root application component | `workspaces`, `activeWorkspace` |
| 11.1.2 | `<AppLayout />` | Main layout container | `sidebarOpen`, `panelOpen` |
| 11.1.3 | `<TitleBar />` | Custom title bar (macOS) | `appName`, `windowControls` |
| 11.1.4 | `<MenuBar />` | Application menu bar | `menus` |
| 11.1.5 | `<StatusBar />` | Bottom status bar | `agentStatus`, `gitStatus` |

### 11.2 Workspace UI

| # | Component | Description | Props |
|---|-----------|-------------|-------|
| 11.2.1 | `<WorkspaceSidebar />` | Workspace list sidebar | `workspaces`, `activeId`, `onSelect` |
| 11.2.2 | `<WorkspaceItem />` | Single workspace item | `workspace`, `isActive`, `onClick` |
| 11.2.3 | `<WorkspaceHeader />` | Sidebar header with actions | `onNewWorkspace`, `onOpenProject` |
| 11.2.4 | `<WorkspaceContextMenu />` | Right-click menu | `workspace`, `actions` |

### 11.3 Terminal UI

| # | Component | Description | Props |
|---|-----------|-------------|-------|
| 11.3.1 | `<TerminalArea />` | Main terminal container | `workspace`, `layout` |
| 11.3.2 | `<TerminalTabs />` | Tab bar component | `tabs`, `activeTab`, `onTabClick` |
| 11.3.3 | `<TerminalPane />` | Split pane container | `layout`, `children` |
| 11.3.4 | `<TerminalInstance />` | Single terminal (xterm.js) | `pty`, `theme`, `options` |
| 11.3.5 | `<TerminalContextMenu />` | Right-click menu | `actions` |

### 11.4 Diff UI

| # | Component | Description | Props |
|---|-----------|-------------|-------|
| 11.4.1 | `<ChangesPanel />` | Side panel with file list | `files`, `selectedFile`, `onSelect` |
| 11.4.2 | `<DiffViewer />` | Main diff viewer | `file`, `diff` |
| 11.4.3 | `<FileDiff />` | Single file diff | `file`, `hunks`, `onAction` |
| 11.4.4 | `<DiffHunk />` | Single change hunk | `hunk`, `onAccept`, `onReject` |
| 11.4.5 | `<DiffToolbar />` | Diff actions toolbar | `onAcceptAll`, `onRejectAll` |

### 11.5 Modal/Dialog UI

| # | Component | Description | Props |
|---|-----------|-------------|-------|
| 11.5.1 | `<Modal />` | Generic modal container | `isOpen`, `onClose`, `title`, `children` |
| 11.5.2 | `<NewWorkspaceModal />` | Create workspace dialog | `onCreate`, `onCancel` |
| 11.5.3 | `<SettingsModal />` | Settings dialog | `isOpen`, `onClose` |
| 11.5.4 | `<ShortcutsModal />` | Keyboard shortcuts reference | `isOpen`, `onClose` |
| 11.5.5 | `<ConfirmDialog />` | Confirmation dialog | `isOpen`, `onConfirm`, `onCancel`, `message` |
| 11.5.6 | `<ProgressDialog />` | Progress indicator | `isOpen`, `progress`, `message` |

---

## 12. Electron Features

### 12.1 Main Process

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 12.1.1 | `createMainWindow()` | Create main application window | `new BrowserWindow()` |
| 12.1.2 | `createTray()` | Create system tray icon | `new Tray()` |
| 12.1.3 | `registerGlobalShortcuts()` | Register global shortcuts | `globalShortcut.register()` |
| 12.1.4 | `setupIPC()` | Setup IPC handlers | `ipcMain.handle()` |
| 12.1.5 | `setupAppMenu()` | Create application menu | `Menu.setApplicationMenu()` |
| 12.1.6 | `handleAppEvents()` | Handle app lifecycle | `app.on()` |

### 12.2 IPC Handlers

| # | Channel | Direction | Description |
|---|---------|-----------|-------------|
| 12.2.1 | `git:worktree:create` | Renderer→Main | Create git worktree |
| 12.2.2 | `git:worktree:remove` | Renderer→Main | Remove worktree |
| 12.2.3 | `git:worktree:list` | Renderer→Main | List worktrees |
| 12.2.4 | `git:branch:create` | Renderer→Main | Create branch |
| 12.2.5 | `git:diff:get` | Renderer→Main | Get diff |
| 12.2.6 | `git:commit:create` | Renderer→Main | Create commit |
| 12.2.7 | `pty:spawn` | Renderer→Main | Spawn PTY process |
| 12.2.8 | `pty:write` | Renderer→Main | Write to PTY |
| 12.2.9 | `pty:resize` | Renderer→Main | Resize PTY |
| 12.2.10 | `pty:kill` | Renderer→Main | Kill PTY |
| 12.2.11 | `pty:data` | Main→Renderer | PTY output event |
| 12.2.12 | `fs:read` | Renderer→Main | Read file |
| 12.2.13 | `fs:write` | Renderer→Main | Write file |
| 12.2.14 | `fs:delete` | Renderer→Main | Delete file |
| 12.2.15 | `dialog:open` | Renderer→Main | Open file dialog |
| 12.2.16 | `dialog:save` | Renderer→Main | Save file dialog |
| 12.2.17 | `notification:show` | Renderer→Main | Show notification |
| 12.2.18 | `clipboard:write` | Renderer→Main | Write to clipboard |
| 12.2.19 | `shell:open` | Renderer→Main | Open in external app |
| 12.2.20 | `settings:get` | Renderer→Main | Get settings |
| 12.2.21 | `settings:set` | Renderer→Main | Update settings |
| 12.2.22 | `window:minimize` | Renderer→Main | Minimize window |
| 12.2.23 | `window:maximize` | Renderer→Main | Maximize window |
| 12.2.24 | `window:close` | Renderer→Main | Close window |

### 12.3 Preload Script

```typescript
// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Git
  gitWorktree: {
    create: (path: string, branch: string) => ipcRenderer.invoke('git:worktree:create', path, branch),
    remove: (path: string) => ipcRenderer.invoke('git:worktree:remove', path),
    list: () => ipcRenderer.invoke('git:worktree:list'),
  },
  // PTY
  pty: {
    spawn: (shell: string, cwd: string, env: any) => ipcRenderer.invoke('pty:spawn', shell, cwd, env),
    write: (pid: number, data: string) => ipcRenderer.invoke('pty:write', pid, data),
    resize: (pid: number, cols: number, rows: number) => ipcRenderer.invoke('pty:resize', pid, cols, rows),
    kill: (pid: number) => ipcRenderer.invoke('pty:kill', pid),
    onData: (pid: number, callback: (data: string) => void) => {
      ipcRenderer.on(`pty:data:${pid}`, (_, data) => callback(data));
    },
  },
  // File System
  fs: {
    read: (path: string) => ipcRenderer.invoke('fs:read', path),
    write: (path: string, content: string) => ipcRenderer.invoke('fs:write', path, content),
    delete: (path: string) => ipcRenderer.invoke('fs:delete', path),
  },
  // Dialogs
  dialog: {
    open: (options: any) => ipcRenderer.invoke('dialog:open', options),
    save: (options: any) => ipcRenderer.invoke('dialog:save', options),
  },
  // Notifications
  notification: {
    show: (title: string, body: string) => ipcRenderer.invoke('notification:show', title, body),
  },
  // Settings
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    set: (key: string, value: any) => ipcRenderer.invoke('settings:set', key, value),
  },
  // Window
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },
});
```

### 12.4 Window Management

| # | Function | Description | Implementation |
|---|----------|-------------|----------------|
| 12.4.1 | `createWindow()` | Create new window | `BrowserWindow` options |
| 12.4.2 | `closeWindow(id)` | Close specific window | `win.close()` |
| 12.4.3 | `focusWindow(id)` | Focus window | `win.focus()` |
| 12.4.4 | `minimizeWindow(id)` | Minimize window | `win.minimize()` |
| 12.4.5 | `maximizeWindow(id)` | Maximize window | `win.maximize()` |
| 12.4.6 | `setWindowSize(id, width, height)` | Resize window | `win.setSize()` |
| 12.4.7 | `getWindowBounds(id)` | Get window position/size | `win.getBounds()` |
| 12.4.8 | `setWindowBounds(id, bounds)` | Set window position/size | `win.setBounds()` |

---

## Implementation Priority Matrix

### 🔴 Critical (Must Have - Phase 1)
- Git worktree creation/deletion
- PTY spawning and management
- Basic terminal display (xterm.js)
- Workspace list and switching
- Basic Electron window management
- IPC communication setup

### 🟠 High Priority (Phase 2)
- Tab management
- Pane splitting
- Agent configuration and launching
- Diff viewer
- Setup/teardown scripts
- Notifications

### 🟡 Medium Priority (Phase 3)
- Keyboard shortcuts system
- Settings UI
- External editor integration
- Quick open file
- Search in files
- Workspace presets

### 🟢 Nice to Have (Phase 4)
- Custom themes
- Advanced diff actions
- Merge conflict resolution
- Notification history
- Export/import settings
- System tray integration

---

## Total Function Count Summary

| Category | Function Count |
|----------|----------------|
| Workspace Management | 16 |
| Terminal Features | 26 |
| Agent Management | 19 |
| Git Integration | 31 |
| Diff Viewer | 18 |
| Keyboard Shortcuts | 7 |
| Settings | 12 |
| Notifications | 10 |
| IDE Integration | 14 |
| UI Components | 30+ |
| Electron Features | 30+ |
| **TOTAL** | **200+** |

---

## Quick Start Implementation Order

1. **Week 1-2:** Electron app + basic window + IPC
2. **Week 3-4:** Git worktree + PTY terminal
3. **Week 5-6:** Workspace management + tabs
4. **Week 7-8:** Agent configuration + launching
5. **Week 9-10:** Diff viewer + changes panel
6. **Week 11-12:** Settings + shortcuts + polish
