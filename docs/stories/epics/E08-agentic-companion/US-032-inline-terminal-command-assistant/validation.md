# US-032 validation

## Automated evidence

- `npm.cmd run build`: passed.
- `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`:
  passed.
- `cargo test --manifest-path src-tauri/Cargo.toml --no-default-features
  terminal_command`: passed 10 focused tests.
- `cargo test --manifest-path src-tauri/Cargo.toml --no-default-features`:
  passed 74 tests; 1 saved-live-provider test remained intentionally ignored.
- `git diff --check`: passed.

Automated Rust coverage includes Ubuntu/RHEL-family mapping, context bounds and
redaction, cmd acceptance/rejection, PowerShell AST acceptance/rejection,
Windows Bash fallback mapping, local risk classification, and Proxy privacy
marker behavior.

`npm.cmd run validate:quick` was attempted as required by the Harness workflow,
but this checkout has no `validate:quick` package script. Repository-wide
`cargo fmt --check` also reports pre-existing formatting drift across unrelated
dirty files; feature-owned new Rust files were formatted directly without
rewriting the user's existing worktree changes.

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
- [ ] Proxy fallback: proxy is not started automatically and marked log bodies
      contain only the redaction placeholder.

Real SSH/WSL fixture coverage remains a release gate; automated compilation
does not substitute for those checks.
