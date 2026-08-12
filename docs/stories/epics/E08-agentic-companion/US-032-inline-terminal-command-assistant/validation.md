# US-032 validation

## Automated evidence

- `npm.cmd run build`: passed.
- `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`:
  passed.
- `cargo test --manifest-path src-tauri/Cargo.toml --no-default-features
  terminal_command`: passed 14 focused tests.
- `cargo test --manifest-path src-tauri/Cargo.toml --no-default-features`:
  passed 83 tests; 1 saved-live-provider test remained intentionally ignored.
- Scoped `git diff --check` for US-032-owned files: passed.

Automated Rust coverage includes Ubuntu/RHEL-family mapping, context bounds and
redaction, cmd acceptance/rejection, PowerShell AST acceptance/rejection,
Windows Bash fallback mapping, local risk classification, saved Proxy backend
order while `enabled=false`, and Proxy privacy placeholder behavior.

`npm.cmd run validate:quick` was attempted as required by the Harness workflow,
but this checkout has no `validate:quick` package script. Repository-wide
`cargo fmt --check` was not used as proof because the checkout contains
unrelated dirty Rust files; the scoped diff check above is the formatting gate.

## Manual desktop matrix

- [ ] Windows Bash: uncertain detection defaults correctly and local `bash -n`
      validates the generated command.
- [ ] cmd: popup anchor, generated syntax, Copy, empty-prompt Insert, no Enter.
- [ ] PowerShell: same checks plus AST rejection/repair.
- [ ] WSL Ubuntu/Debian: distro/package-manager detection and `bash -n`.
- [ ] WSL RHEL-family: distro/package-manager detection and `bash -n`.
- [ ] SSH Ubuntu/Debian: real saved profile probe and remote `bash -n`.
- [ ] SSH RHEL-family: real saved profile probe and remote `bash -n`.
- [ ] Codex/OpenCode and alternate screen: shortcut remains disabled.
- [ ] Non-empty or unrecognized prompt: Copy remains available; Insert is
      disabled and click-time guard does not send input.
- [ ] Close/session/view switch during generation: no late result is rendered.
- [ ] Proxy routing: with the service stopped, backend 1 is called directly;
      after its configured retries fail, backend 2 succeeds; the service stays
      stopped and attempt log bodies contain only the redaction placeholder.

Real SSH/WSL fixture coverage remains a release gate; automated compilation
does not substitute for those checks.
