# 0010 Open Interpreter Runtime and ACP Subprocess Manager

Date: 2026-07-16

## Status

Accepted

## Context

We need to bundle Open Interpreter release `rust-v0.0.25` for Windows x64 and manage its execution inside the CLI Orchestrator application. The binary must run in a secure, isolated workspace context, use the local proxy server (`CliProxyAI`) for its LLM requests, communicate via the Agent Client Protocol (ACP), and allow asynchronous stdin/stdout/stderr frame parsing, crash recovery, and shutdown.

## Decision

We implemented the following design elements for the Open Interpreter integration:
1. **Manifest and Native Rust Zstd Extractor**:
   - Manifest `open-interpreter-manifest.json` is embedded as an application resource containing version, artifact filename, SHA-256 hash, and download URL.
   - Incorporated `tar` and `zstd` crates to support native extraction of the `.tar.zst` payload in Rust without invoking external shell scripts.
2. **Oneshot Process Cancellation & Multiplexing**:
   - To avoid borrow checker moves and deadlocks while waiting on a process, the watcher thread owns the `tokio::process::Child` handle.
   - Communicates explicit stops through a `tokio::sync::oneshot::Sender<()>` channel. A `tokio::select!` block multiplexes the process wait exit and the cancellation trigger.
3. **Local API Proxy Connection**:
   - On start, the manager automatically verifies if the proxy server (`CliProxyAI`) is running. If not, it boots it and retrieves its dynamic port.
   - Configures the subprocess environment (`OPENAI_API_BASE` and `OPENAI_API_KEY`) to target the local proxy server port, ensuring all LLM traffic goes through local routing and token tracking.
4. **Lifecycle & Crash Watcher**:
   - On unexpected exit, it automatically restarts the process once. If it crashes a second consecutive time, it registers the status as `InterpreterStatus::Error` and disables restarts until manual user retry.

## Alternatives Considered

1. **Invoking system 7z or tar for Zstd archives**: Rejected. Relies on external binaries that may not exist on clean Windows machines. Natively compiling `zstd` and `tar` in Rust ensures zero-dependency execution.
2. **Synchronous subprocess blocking**: Rejected. Locks up the Tauri main thread. Thread-safe Tokio async commands ensure optimal CPU and UI responsiveness.

## Consequences

Positive:
- Standard-compliant ACP integration: frame parsing matches the expected `interpreter acp` specification.
- Resilient runtime: crash watcher prevents the application from entering infinite restart loops.
- Integrated proxies: Open Interpreter requests are accurately registered in the durable proxy usage tracking DB.
