# CLI Orchestrator

A powerful, high-performance desktop application for managing and orchestrating multiple AI CLI tools. Unlike simple wrappers, CLI Orchestrator provides a full pseudo-terminal (PTY) environment, allowing you to interact with tools like `aider`, `claude-code`, and `gemini-cli` in a unified, multi-tabbed interface.

![Dashboard Screen](Screen1.png)

## 🚀 Key Features

- **Multi-Session Interactive Terminal**: Run multiple interactive CLI sessions simultaneously using a robust XTerm.js-powered UI and a Rust-based PTY backend.
- **Dynamic CLI Registration**: Add any CLI tool by simply defining a JSON configuration.
- **Smart Directory Management**: Save and quickly select working directories for your projects. Tags are automatically associated with paths for seamless context switching.
- **Execution Modes**:
  - **Interactive**: Full REPL support with terminal emulation.
  - **Streaming**: Real-time output streaming for non-interactive long-running tasks.
  - **One-shot**: Quick command execution with result capture.
- **Premium Aesthetics**: Choose between **Cyberpunk** and **Kawaii** themes, featuring a reactive **Anime Assistant** that reflects the current system state.

## 🛠 Tech Stack

### Backend (Rust)
- **Tauri**: Lightweight cross-platform desktop framework.
- **Tokio**: Asynchronous runtime for high-concurrency I/O.
- **Portable-PTY**: Low-level pseudo-terminal interface for interactive process management.
- **Serde**: High-performance serialization for CLI configuration and state.

### Frontend (React)
- **TypeScript**: Type-safe development.
- **Tailwind CSS**: Modern, utility-first styling.
- **XTerm.js**: Industry-standard terminal rendering.
- **Framer Motion**: Smooth animations and transitions.

## 🏗 Architecture

### Process Management
The application utilizes a distributed architecture where the Rust backend manages child processes through PTYs. Input/Output is bridged via Tauri's asynchronous event system:
- **Input**: Captured via XTerm.js and sent to the PTY's `stdin` via IPC.
- **Output**: Captured from PTY `stdout/stderr` and emitted as realtime events (`cli-output`) to the frontend.

### Configuration
CLI definitions are stored as JSON files in `~/.ai-cli-manager/clis/`.
Example configuration:
```json
{
  "name": "claude",
  "command": "claude",
  "args": ["-p", "{prompt}"],
  "mode": "interactive"
}
```

## 🚥 Getting Started

### Prerequisites
- **Node.js**: v18+ 
- **Rust**: Latest stable toolchain via [rustup](https://rustup.rs/)
- **WebView2** (Windows) or appropriate WebKit libraries (Linux)

### Installation & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development Mode**:
   ```bash
   npm run tauri dev
   ```

3. **Build for Production**:
   ```bash
   npm run tauri build
   ```

## 📂 Project Structure

- `src/`: React frontend components and hooks.
- `src-tauri/`: Rust backend logic, commands, and core engine.
- `~/.ai-cli-manager/`: 
  - `clis/`: CLI configuration files.
  - `logs/`: Runtime session logs.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

