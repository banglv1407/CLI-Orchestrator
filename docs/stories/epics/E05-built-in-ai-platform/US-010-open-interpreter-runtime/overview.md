# Overview

## Current Behavior

- No Open Interpreter binary is bundled or managed.
- There is no runtime installer, SHA-256 verifier, or manifest file.
- There is no app-wide `OpenInterpreterManager` inside the Rust `AppState`.

## Target Behavior

- **Distribution & Bundling**: Pinned Open Interpreter release `rust-v0.0.25` for Windows x64 using artifact `open-interpreter-package-x86_64-pc-windows-msvc.tar.zst` with SHA-256: `e0e264dd95d4a025c7bc4c567bcab15bb940042c320fccac3f46a25ffad5884e`.
- **Runtime Installation**: On first use, verify the bundled archive's hash and extract it to `~/.ai-cli-manager/openinterpreter/runtime/<version>`. Verify binary execution and ACP initialization via a smoke check before activation.
- **ACP Process Manager**: Add `OpenInterpreterManager` to `AppState` to handle child process lifecycle, protocol framing on stdout (JSON RPC frame parsing), logs on stderr, crash recovery, and shutdown.
- **Provider Connection**: Automatically construct provider configurations pointing to the local `CliProxyAI` server port (`http://127.0.0.1:<proxy-port>/v1`).

## Affected Product Docs

- `docs/stories/epics/E05-built-in-ai-platform/plan.md`
