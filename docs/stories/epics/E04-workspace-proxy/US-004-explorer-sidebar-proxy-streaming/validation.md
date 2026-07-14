# Validation

## Proof Strategy

Use Rust unit tests for path boundaries and an in-process mock OpenAI server for
incremental SSE relay. Use the frontend build for TypeScript/UI wiring, then run
a localhost smoke request through CliProxyAI with the existing saved backend.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Local root/outside/root-itself deletion rejection; remote path normalization |
| Integration | Streaming request reaches mock upstream with `stream: true`; chunks and `[DONE]` reach client |
| E2E | Context menu opens from Explorer and Git Diff; confirmation/cancel/error states |
| Platform | Windows build and local path handling; SSH command path quoting |
| Performance | First SSE chunk is forwarded before the second delayed chunk |
| Logs/Audit | Successful and failed streams create credential-free proxy log entries |

## Fixtures

- Temporary workspace containing a file and nested directory.
- Local mock OpenAI-compatible upstream emitting two delayed SSE chunks and
  `[DONE]`.
- Existing `~/.ai-cli-manager/proxy.json` for the final opt-in live smoke call.

## Commands

```text
npm.cmd run build
cargo test --manifest-path src-tauri/Cargo.toml
npm.cmd run validate:quick
```

## Acceptance Evidence

- `npm.cmd run build`: passed. TypeScript and the production Vite bundle build.
- `cargo test --manifest-path src-tauri/Cargo.toml`: passed with 13 tests; the
  live-provider test is ignored in the default deterministic suite.
- `cargo test ... streams_with_saved_proxy_config -- --ignored --nocapture`:
  passed against the two backends in the current saved config. The response was
  SSE, arrived in multiple chunks, ended with `[DONE]`, and did not expose an
  API key.
- The mock integration test verified that the configured model and
  `stream: true` reached upstream, compatible extension fields were preserved,
  and a delayed second chunk was not buffered into the first.
- Local deletion tests verified file deletion, recursive non-empty directory
  deletion, root preservation, and outside-root rejection. Remote tests verified
  root-boundary rejection and POSIX shell quoting.
- Vite development server returned HTTP 200 at `http://127.0.0.1:1407`.
- `npm.cmd run validate:quick`: blocked at its first `cargo fmt --check` step by
  pre-existing repository-wide Rust formatting differences. A separate clippy
  run reached 10 pre-existing warnings outside this story's changed behavior.
- Automated Tauri-window pointer E2E was not available; context-menu placement
  and the final desktop interaction still require a manual app smoke test.
