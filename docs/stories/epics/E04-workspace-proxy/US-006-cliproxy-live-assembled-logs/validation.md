# US-006 — Validation

## Unit (Rust)

Run: `cargo test --manifest-path src-tauri/Cargo.toml --lib core::stream_assembler`

| Test | Asserts |
| --- | --- |
| `parses_lf_separated_frames` | LF separator yields one JSON object per event |
| `parses_crlf_separated_frames` | CRLF separator is accepted |
| `splits_inside_data_prefix` | chunk boundary inside `data: {` is reassembled |
| `splits_inside_utf8_payload` | multi-byte UTF-8 split across chunks survives |
| `joins_multi_data_line_event` | multiple `data:` lines per event concatenate |
| `retains_done_marker_in_raw` | `data: [DONE]` is kept in raw, excluded from normalized |
| `merges_delta_content_in_order` | `choices[0].delta.content` concatenates `"Hel" + "lo"` |
| `merges_delta_reasoning_variants` | `reasoning_content`, `reasoning_text`, `reasoning_details` merge |
| `merges_tool_calls_by_index` | `tool_calls[].function.arguments` concatenate by index |
| `preserves_top_level_metadata` | first non-null `id`, `object`, `created`, `model` win |
| `merges_multiple_choices_by_index` | two choices merge independently |
| `replaces_finish_reason_and_usage` | first non-null `finish_reason` and latest `usage` win |
| `retains_unknown_fields_in_other` | provider-specific keys surface under "other" |
| `truncates_at_256_kib` | capture stops at the cap, `truncated = true`, raw clipped |
| `malformed_frame_does_not_break_assembly` | bad JSON line is dropped, next good line still merges |

Plus the existing `core::proxy_server::tests::joins_openai_chat_completion_urls_without_duplicate_v1`
must keep passing (sanity check the existing code path is unchanged).

## Integration (Rust)

Run: `cargo test --manifest-path src-tauri/Cargo.toml --lib core::proxy_server::tests`

| Test | Asserts |
| --- | --- |
| `streams_upstream_chunks_without_buffering_completion` (existing) | unchanged: byte-identical downstream SSE, `[DONE]` at the end, log entry still created |
| `live_log_updates_off_matches_existing_log` | OFF path produces a log entry whose `responseJson` and final normalized content match the existing 100% capture |
| `live_log_updates_on_emits_start_progress_done` | ON path emits exactly one `start`, ≤ 5 `progress` per second on a burst, one `done` with `phase = completed` |
| `live_log_updates_on_normalizes_streamed_chunks` | first downstream chunk is the upstream `data: {"delta":{"content":"Hel"}}`; after `[DONE]`, the final log's `normalizedResponseJson.choices[0].message.content === "Hello"` |
| `burst_chunks_do_not_exceed_five_progress_per_second` | a stream of 50 small chunks produces ≤ 5 `progress` events in 1 second |
| `downstream_disconnect_finalizes_failed_log` | mid-stream sender drop → final entry has `phase = failed`, `success = false`, `errorMsg` set; no further events after |
| `upstream_stream_error_finalizes_failed_log` | mock upstream returns an error partway through → `phase = failed`, no retry into the same response |
| `unknown_progress_id_triggers_log_refresh` | receiving a `Progress` whose id is not in the in-memory map triggers exactly one `get_logs` call |
| `truncated_response_is_marked` | a stream that exceeds 256 KiB produces a final entry with `responseTruncated = true` and the Raw UI shows the warning |

The existing `streams_with_saved_proxy_config` integration test is `#[ignore]`
d. To prove the live path with the saved config, this story extends it to:
- run with `CLX_PROXY_CONFIG` pointing to the current config
- assert ≥ 2 chunks, `[DONE]` present, no credential in any chunk
- assert the final log has non-empty `normalizedResponseJson`
- assert downstream bytes are byte-identical to upstream SSE

## Frontend

| Check | Command / Outcome |
| --- | --- |
| TypeScript build | `bun run build` (tsc + vite) — must pass with zero errors |
| Frontend unit sanity | `npx tsc --noEmit` |
| `git diff --check` | clean (no trailing whitespace, no merge conflict markers) |
| Visual smoke | Manual Tauri run with a real backend; Detailed Logs shows: (1) `LIVE` badge on in-flight row, (2) Content + Reasoning grow on each progress, (3) Raw section collapsed by default with Copy button, (4) sidebar shows no streaming row, (5) toggle ON/OFF round-trips via `proxySaveConfig` and survives app restart |

## Platform (Windows Tauri)

`scripts/harness story verify US-006 --cmd "cargo test --manifest-path src-tauri/Cargo.toml --lib core::stream_assembler core::proxy_server"` must print `pass` after the implementation lands. Listener cleanup and tab-switch behavior are exercised in the manual Windows smoke described in `validation.md` of the upstream execplan.

## Evidence rules

- Each unit/integration test name appears in the command output of the test
  run that is pasted into the trace.
- Manual Tauri smoke is described in plain text; the trace lists the exact
  observations that match the acceptance criteria.
- Any pre-existing formatting or clippy debt in `src-tauri/` is reported
  under `errors` in the trace, never silently fixed.
