# Test Matrix

This file maps product behavior to proof.

No product behavior has been defined or implemented yet. Do not mark a row
implemented until tests or validation evidence exist.

## Status Values

| Status | Meaning |
| --- | --- |
| planned | Accepted as intended behavior, not implemented |
| in_progress | Actively being built |
| implemented | Implemented and proof exists |
| changed | Contract changed after earlier implementation |
| retired | No longer part of the product contract |

## Matrix

| Story | Contract | Unit | Integration | E2E | Platform | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E15/S1 | Harness registry lists installed harnesses (hermes, claude-code) | yes (built_in_specs_are_valid, list_harnesses_returns_all) | no | no | yes (list_harnesses) | implemented | cargo test 2026-09-21 |
| E15/S2 | Launch harness into fresh workspace; status tracked; cancel kills process tree | no | yes (exit-code path emits result event) | no | yes (harness_launch/cancel via taskkill) | implemented | cargo check + manual plan 2026-09-21 |
| E15/S3 | Stream normalization: claude stream-json -> text_delta/tool_use/tool_result/reasoning/result; raw fallback | yes (6 parser tests) | no | no | yes | implemented | cargo test 2026-09-21 |
| E15/S4 | Harness Hub UI: picker, live stream, cancel, files strip | no | no | no | yes (npm build + tsc) | implemented | tsc/npm build 2026-09-21 |
| E15/S5 | Artifact/workspace file listing + artifact events | yes (metadata helpers) | no | no | yes (harness_session_files) | implemented | cargo test 2026-09-21 |
| E15/S6 | Structured errors: harness_not_found / not_installed / spawn_failed / workspace_failed / exit_code | yes (result parser + taxonomy) | no | no | yes | implemented | cargo test 2026-09-21 |

## Evidence Rules

- Unit proof covers pure domain and application rules.
- Integration proof covers backend enforcement, data integrity, provider
  behavior, jobs, or service contracts.
- E2E proof covers user-visible browser flows.
- Platform proof covers only shell, deployment, mobile, desktop, or runtime
  behavior that cannot be proven in lower layers.
- A story can be implemented without every proof column if the story packet
  explains why.
