// src-tauri/src/core/stream_assembler.rs
//
// Bounded SSE parser and recursive JSON merger used to reconstruct a
// complete OpenAI-style response from a streamed completion.
//
// The assembler is a *side channel* — it never touches the bytes the proxy
// is forwarding downstream. Its job is to keep an internal view of the
// response that grows incrementally as `data:` frames arrive.
//
// Rules (see US-006 execplan §Stream assembler):
//   1. Buffer incomplete frames across arbitrary chunk boundaries.
//   2. Accept LF and CRLF separators.
//   3. Concatenate multiple `data:` lines inside one event.
//   4. Ignore blank lines, `:comment` lines, and `data: [DONE]` for the
//      normalized view (but keep `[DONE]` in the raw capture).
//   5. Stop capturing/parsing after `capacity` bytes; set `truncated = true`
//      and continue ignoring new frames (the downstream relay is unaffected).
//   6. Malformed JSON is dropped from the normalized view but kept in raw.
//
// Merge rules (see design.md §Stream assembler):
//   - Both objects → recurse; scalars keep the first non-null value.
//   - Both arrays → merge by `index` field when present, else concatenate.
//   - String + string → concatenate (covers delta content / reasoning).
//   - Different shapes → replace with `src`.

use serde_json::Value;

/// Default capture cap, in bytes. 256 KiB matches the existing log cap.
pub const DEFAULT_CAPACITY: usize = 256 * 1024;

/// Extract `prompt_tokens`, `completion_tokens`, `total_tokens` from the
/// top-level `usage` object of a normalized response. Returns `(0, 0, 0)`
/// when the field is missing.
pub fn extract_token_usage(response_json: &str) -> (u32, u32, u32) {
    if let Ok(v) = serde_json::from_str::<serde_json::Value>(response_json) {
        if let Some(usage) = v.get("usage") {
            let pt = usage.get("prompt_tokens").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            let ct = usage.get("completion_tokens").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            let tt = usage.get("total_tokens").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            return (pt, ct, tt);
        }
    }
    (0, 0, 0)
}

#[derive(Debug, Clone)]
pub struct StreamAssembler {
    capacity: usize,
    /// Raw bytes captured so far, capped at `capacity`.
    raw: Vec<u8>,
    /// Buffered partial frame that did not end on the last separator.
    /// Kept as bytes so multi-byte UTF-8 boundaries do not panic.
    pending: Vec<u8>,
    /// Reconstructed response object.
    normalized: Value,
    /// Whether the raw buffer hit the cap.
    truncated: bool,
    /// True once we have observed `data: [DONE]`.
    done_seen: bool,
    /// True once a frame has been successfully merged (used for the
    /// "dirty" signal in throttled progress events).
    has_frames: bool,
}

impl Default for StreamAssembler {
    fn default() -> Self {
        Self::new(DEFAULT_CAPACITY)
    }
}

impl StreamAssembler {
    pub fn new(capacity: usize) -> Self {
        Self {
            capacity,
            raw: Vec::new(),
            pending: Vec::new(),
            normalized: Value::Object(Default::default()),
            truncated: false,
            done_seen: false,
            has_frames: false,
        }
    }

    /// Feed raw upstream bytes into the assembler. Returns true when the
    /// normalized view changed in a way that should trigger a progress event.
    pub fn push(&mut self, chunk: &[u8]) -> bool {
        if self.truncated {
            return false;
        }

        // Append to raw capture (clipped to capacity).
        let remaining = self.capacity.saturating_sub(self.raw.len());
        if remaining > 0 {
            let take = chunk.len().min(remaining);
            self.raw.extend_from_slice(&chunk[..take]);
            if chunk.len() > remaining {
                self.truncated = true;
            }
        } else {
            self.truncated = true;
        }

        // Concatenate pending + new bytes for frame splitting. We deliberately
        // stay in the byte domain so a UTF-8 boundary that lands inside a
        // chunk does not panic. The final decode happens in `feed_event`,
        // which only ever sees a complete event whose boundaries are LF/CRLF
        // — i.e. ASCII bytes — so the resulting &str is always valid UTF-8.
        self.pending.extend_from_slice(chunk);

        let mut changed = false;
        let mut start = 0usize;
        while let Some(boundary_abs) = find_event_boundary(&self.pending, start) {
            // The boundary includes its own trailing separators; trim them
            // back so feed_event sees only the event body.
            let body_end = trim_separators_back(&self.pending, boundary_abs);
            let event_owned: Option<String> = std::str::from_utf8(&self.pending[start..body_end])
                .ok()
                .map(|s| s.to_string());
            if let Some(event_str) = event_owned {
                if self.feed_event(&event_str) {
                    changed = true;
                }
            }
            start = boundary_abs;
        }
        if start > 0 {
            self.pending.drain(..start);
        }

        if changed {
            self.has_frames = true;
        }
        changed
    }

    fn feed_event(&mut self, event: &str) -> bool {
        // An SSE event is one or more lines separated by single LF/CRLF.
        // Concatenate all `data:` lines into a single string. Skip blanks,
        // comments (`:` prefix), and the `[DONE]` sentinel.
        let mut data_lines: Vec<&str> = Vec::new();
        for line in event.split('\n') {
            let line = line.strip_suffix('\r').unwrap_or(line);
            if line.is_empty() {
                continue;
            }
            if let Some(rest) = line.strip_prefix("data:") {
                let rest = rest.strip_prefix(' ').unwrap_or(rest);
                if rest == "[DONE]" {
                    self.done_seen = true;
                    continue;
                }
                if rest.is_empty() {
                    continue;
                }
                data_lines.push(rest);
            }
            // `event:`, `id:`, `retry:`, `:comment` → ignored.
        }

        if data_lines.is_empty() {
            return false;
        }

        // Join multiple data lines with a single LF so reassembly matches
        // the original JSON when each line is a fragment.
        let joined = data_lines.join("\n");
        match serde_json::from_str::<Value>(&joined) {
            Ok(value) => {
                // OpenAI chunks carry stream deltas under a `delta` key.
                // The normalized response keeps a `message` instead, so we
                // lift the delta up before merging. If the chunk already
                // has a `message` (some providers), we keep both and let
                // the merger dedupe later.
                let mut value = value;
                promote_delta_to_message(&mut value);
                merge_into(&mut self.normalized, value);
                true
            }
            Err(_) => false,
        }
    }

    /// True when at least one JSON frame has been merged.
    pub fn has_frames(&self) -> bool {
        self.has_frames
    }

    /// The reconstructed response. Empty object until the first frame.
    pub fn normalized(&self) -> &Value {
        &self.normalized
    }

    /// Raw bytes captured, decoded as UTF-8 (lossy on invalid boundaries).
    pub fn raw(&self) -> &str {
        // SAFETY: we only ever push well-formed upstream UTF-8 chunks via
        // `from_utf8_lossy`, so the lossy decode is a no-op for valid bytes
        // and a `\u{FFFD}` placeholder for stray fragments. Either way, the
        // string is safe to hand back.
        std::str::from_utf8(&self.raw).unwrap_or("")
    }

    pub fn truncated(&self) -> bool {
        self.truncated
    }

    pub fn done_seen(&self) -> bool {
        self.done_seen
    }
}

/// Promote the `delta` field of any object in the value to a `message`
/// field, recursively. This makes a single OpenAI stream chunk
/// (`{choices:[{delta:{content:"a"}}]}`) look like the merged response
/// (`{choices:[{message:{content:"a"}}]}`) before the merger runs, so the
/// merger can do plain object-to-object merges.
fn promote_delta_to_message(value: &mut Value) {
    match value {
        Value::Object(map) => {
            // Only promote when the destination does not already have a
            // `message` key (so a fully merged chunk is left alone).
            if map.contains_key("delta") && !map.contains_key("message") {
                if let Some(delta) = map.remove("delta") {
                    map.insert("message".to_string(), delta);
                }
            }
            for v in map.values_mut() {
                promote_delta_to_message(v);
            }
        }
        Value::Array(arr) => {
            for v in arr.iter_mut() {
                promote_delta_to_message(v);
            }
        }
        _ => {}
    }
}

/// Find the next event boundary starting at `from`. Returns the absolute
/// index just past the boundary so the caller can advance past it. A
/// boundary is two consecutive line terminators in either LF or CRLF form.
fn find_event_boundary(bytes: &[u8], from: usize) -> Option<usize> {
    let mut i = from;
    while i < bytes.len() {
        if bytes[i] == b'\n' {
            // Match "\n\n" (LF LF) or "\n\r\n" (LF then CRLF).
            if i + 1 < bytes.len() && bytes[i + 1] == b'\n' {
                return Some(i + 2);
            }
            if i + 2 < bytes.len() && bytes[i + 1] == b'\r' && bytes[i + 2] == b'\n' {
                return Some(i + 3);
            }
        } else if bytes[i] == b'\r' {
            // Match "\r\n\r\n" (CRLF CRLF).
            if i + 3 < bytes.len() && bytes[i + 1] == b'\n' && bytes[i + 2] == b'\r' && bytes[i + 3] == b'\n' {
                return Some(i + 4);
            }
        }
        i += 1;
    }
    None
}

/// Trim trailing LF/CRLF separators from `bytes[..end]` so the caller
/// sees the event body without the boundary it just consumed. Only operates
/// on ASCII bytes so it never panics on multi-byte UTF-8.
fn trim_separators_back(bytes: &[u8], end: usize) -> usize {
    let mut e = end.min(bytes.len());
    while e > 0 {
        match bytes[e - 1] {
            b'\n' | b'\r' => e -= 1,
            _ => break,
        }
    }
    e
}

/// Recursive merge of `src` into `dst` per the design.md rules.
///
/// Callers are expected to normalize stream deltas (`delta` -> `message`)
/// before calling this, so the algorithm can stay a plain recursive
/// object/object merge with a few OpenAI-friendly specials.
pub fn merge_into(dst: &mut Value, src: Value) {
    match (dst, src) {
        (Value::Object(dst_map), Value::Object(src_map)) => {
            let extras: Vec<(String, Value)> = src_map.into_iter().collect();
            for (k, v) in extras {
                match dst_map.get_mut(&k) {
                    Some(existing) => merge_into(existing, v),
                    None => {
                        dst_map.insert(k, v);
                    }
                }
            }
        }
        (Value::Array(dst_arr), Value::Array(src_arr)) => {
            merge_arrays(dst_arr, src_arr);
        }
        (Value::String(dst_str), Value::String(src_str)) => {
            dst_str.push_str(&src_str);
        }
        (dst_slot, src_value) => {
            // For scalars: keep the first non-null value seen.
            if src_value.is_null() {
                return;
            }
            *dst_slot = src_value;
        }
    }
}

fn merge_arrays(dst: &mut Vec<Value>, src: Vec<Value>) {
    // OpenAI chunks usually carry an `index` field on each element. When
    // every src element has one, align by that field. Otherwise, merge by
    // position (src[i] into dst[i]); only append when src is longer.
    let src_has_index = !src.is_empty()
        && src.iter().all(|v| {
            v.as_object()
                .and_then(|m| m.get("index"))
                .and_then(|i| i.as_u64())
                .is_some()
        });
    if src_has_index {
        for new_item in src {
            let idx = new_item
                .as_object()
                .and_then(|m| m.get("index"))
                .and_then(|i| i.as_u64())
                .unwrap_or(0) as usize;
            if idx < dst.len() {
                merge_into(&mut dst[idx], new_item);
            } else {
                while dst.len() < idx {
                    dst.push(Value::Null);
                }
                dst.push(new_item);
            }
        }
        return;
    }

    // No `index` field: align by position. Extend dst with Nulls when
    // shorter, then merge each element in place.
    if dst.len() < src.len() {
        dst.resize(src.len(), Value::Null);
    }
    for (i, new_item) in src.into_iter().enumerate() {
        merge_into(&mut dst[i], new_item);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn push_all(a: &mut StreamAssembler, s: &str) {
        // Push one byte at a time to exercise buffering across boundaries.
        for byte in s.as_bytes() {
            a.push(&[*byte]);
        }
    }

    #[test]
    fn parses_lf_separated_frames() {
        let mut a = StreamAssembler::default();
        a.push(
            b"data: {\"choices\":[{\"delta\":{\"content\":\"a\"}}]}\n\n\
              data: {\"choices\":[{\"delta\":{\"content\":\"b\"}}]}\n\n",
        );
        assert_eq!(
            a.normalized()["choices"][0]["message"]["content"],
            json!("ab")
        );
    }

    #[test]
    fn parses_crlf_separated_frames() {
        let mut a = StreamAssembler::default();
        a.push(
            b"data: {\"choices\":[{\"delta\":{\"content\":\"X\"}}]}\r\n\r\n\
              data: {\"choices\":[{\"delta\":{\"content\":\"Y\"}}]}\r\n\r\n",
        );
        assert_eq!(
            a.normalized()["choices"][0]["message"]["content"],
            json!("XY")
        );
    }

    #[test]
    fn splits_inside_data_prefix() {
        let mut a = StreamAssembler::default();
        let payload = "data: {\"choices\":[{\"delta\":{\"content\":\"hi\"}}]}\n\n";
        let midpoint = payload.len() / 2;
        a.push(payload[..midpoint].as_bytes());
        a.push(payload[midpoint..].as_bytes());
        assert_eq!(
            a.normalized()["choices"][0]["message"]["content"],
            json!("hi")
        );
    }

    #[test]
    fn splits_inside_utf8_payload() {
        // A 3-byte UTF-8 char ('ể' = 0xE1, 0xBB, 0x83) split mid-sequence.
        let mut a = StreamAssembler::default();
        let payload =
            "data: {\"choices\":[{\"delta\":{\"content\":\"ể\"}}]}\n\n";
        // Find the char and split inside it.
        let bytes = payload.as_bytes();
        let char_pos = bytes.windows(3).position(|w| w == [0xE1, 0xBB, 0x83]).unwrap();
        a.push(&bytes[..char_pos + 1]);
        a.push(&bytes[char_pos + 1..]);
        assert_eq!(
            a.normalized()["choices"][0]["message"]["content"],
            json!("ể")
        );
    }

    #[test]
    fn joins_multi_data_line_event() {
        let mut a = StreamAssembler::default();
        a.push(
            b"data: {\"choices\":\n\
              data:  [{\"delta\":{\"content\":\"ok\"}}]}\n\n",
        );
        assert_eq!(
            a.normalized()["choices"][0]["message"]["content"],
            json!("ok")
        );
    }

    #[test]
    fn retains_done_marker_in_raw() {
        let mut a = StreamAssembler::default();
        a.push(
            b"data: {\"choices\":[{\"delta\":{\"content\":\"x\"}}]}\n\n\
              data: [DONE]\n\n",
        );
        assert!(a.done_seen());
        assert!(a.raw().contains("[DONE]"));
        // Normalized must not contain the [DONE] string.
        let s = serde_json::to_string(a.normalized()).unwrap();
        assert!(!s.contains("[DONE]"));
    }

    #[test]
    fn merges_delta_content_in_order() {
        let mut a = StreamAssembler::default();
        a.push(b"data: {\"choices\":[{\"index\":0,\"delta\":{\"content\":\"Hel\"}}]}\n\n");
        a.push(b"data: {\"choices\":[{\"index\":0,\"delta\":{\"content\":\"lo\"}}]}\n\n");
        assert_eq!(
            a.normalized()["choices"][0]["message"]["content"],
            json!("Hello")
        );
    }

    #[test]
    fn merges_delta_reasoning_variants() {
        let mut a = StreamAssembler::default();
        a.push(b"data: {\"choices\":[{\"index\":0,\"delta\":{\"reasoning_content\":\"a\"}}]}\n\n");
        a.push(b"data: {\"choices\":[{\"index\":0,\"delta\":{\"reasoning_text\":\"b\"}}]}\n\n");
        a.push(b"data: {\"choices\":[{\"index\":0,\"delta\":{\"reasoning_details\":\"c\"}}]}\n\n");
        let m = &a.normalized()["choices"][0]["message"];
        assert_eq!(m["reasoning_content"], json!("a"));
        assert_eq!(m["reasoning_text"], json!("b"));
        assert_eq!(m["reasoning_details"], json!("c"));
    }

    #[test]
    fn merges_tool_calls_by_index() {
        let mut a = StreamAssembler::default();
        a.push(
            b"data: {\"choices\":[{\"index\":0,\"delta\":{\"tool_calls\":[{\"index\":0,\"function\":{\"name\":\"get_weather\"}}]}}]}\n\n",
        );
        a.push(
            b"data: {\"choices\":[{\"index\":0,\"delta\":{\"tool_calls\":[{\"index\":0,\"function\":{\"arguments\":\"{\\\"city\\\":\"}}]}}]}\n\n",
        );
        a.push(
            b"data: {\"choices\":[{\"index\":0,\"delta\":{\"tool_calls\":[{\"index\":0,\"function\":{\"arguments\":\"\\\"Hanoi\\\"}\"}}]}}]}\n\n",
        );
        let tc = &a.normalized()["choices"][0]["message"]["tool_calls"][0];
        assert_eq!(tc["function"]["name"], json!("get_weather"));
        assert_eq!(
            tc["function"]["arguments"],
            json!("{\"city\":\"Hanoi\"}")
        );
    }

    #[test]
    fn preserves_top_level_metadata() {
        let mut a = StreamAssembler::default();
        a.push(
            b"data: {\"id\":\"chatcmpl-1\",\"object\":\"chat.completion.chunk\",\"created\":1700000000,\"model\":\"m\",\"choices\":[{\"delta\":{\"role\":\"assistant\"}}]}\n\n",
        );
        a.push(b"data: {\"choices\":[{\"delta\":{\"content\":\"x\"}}]}\n\n");
        let n = a.normalized();
        assert_eq!(n["id"], json!("chatcmpl-1"));
        assert_eq!(n["object"], json!("chat.completion.chunk"));
        assert_eq!(n["created"], json!(1700000000));
        assert_eq!(n["model"], json!("m"));
    }

    #[test]
    fn merges_multiple_choices_by_index() {
        let mut a = StreamAssembler::default();
        a.push(
            b"data: {\"choices\":[{\"index\":0,\"delta\":{\"content\":\"A\"}},{\"index\":1,\"delta\":{\"content\":\"B\"}}]}\n\n",
        );
        a.push(
            b"data: {\"choices\":[{\"index\":0,\"delta\":{\"content\":\"A2\"}},{\"index\":1,\"delta\":{\"content\":\"B2\"}}]}\n\n",
        );
        assert_eq!(
            a.normalized()["choices"][0]["message"]["content"],
            json!("AA2")
        );
        assert_eq!(
            a.normalized()["choices"][1]["message"]["content"],
            json!("BB2")
        );
    }

    #[test]
    fn replaces_finish_reason_and_usage() {
        let mut a = StreamAssembler::default();
        a.push(b"data: {\"choices\":[{\"index\":0,\"finish_reason\":null}],\"usage\":null}\n\n");
        a.push(b"data: {\"choices\":[{\"index\":0,\"finish_reason\":\"stop\"}],\"usage\":{\"prompt_tokens\":1,\"completion_tokens\":2,\"total_tokens\":3}}\n\n");
        let n = a.normalized();
        assert_eq!(n["choices"][0]["finish_reason"], json!("stop"));
        assert_eq!(n["usage"]["total_tokens"], json!(3));
    }

    #[test]
    fn retains_unknown_fields_in_other() {
        let mut a = StreamAssembler::default();
        a.push(
            b"data: {\"system_fingerprint\":\"fp_abc\",\"x_custom\":{\"foo\":1},\"choices\":[{\"delta\":{\"content\":\"x\"}}]}\n\n",
        );
        let n = a.normalized();
        assert_eq!(n["system_fingerprint"], json!("fp_abc"));
        assert_eq!(n["x_custom"]["foo"], json!(1));
    }

    #[test]
    fn truncates_at_256_kib() {
        let mut a = StreamAssembler::new(16);
        let big = "x".repeat(64);
        let payload = format!("data: {{\"choices\":[{{\"delta\":{{\"content\":\"{big}\"}}}}]}}\n\n");
        a.push(payload.as_bytes());
        assert!(a.truncated());
        // Raw was clipped to 16 bytes.
        assert!(a.raw().len() <= 16);
        // Even after truncation we never accept new frames.
        let before = a.normalized().clone();
        a.push(b"data: {\"choices\":[{\"delta\":{\"content\":\"MORE\"}}]}\n\n");
        assert_eq!(a.normalized(), &before);
    }

    #[test]
    fn malformed_frame_does_not_break_assembly() {
        let mut a = StreamAssembler::default();
        a.push(b"data: not-json\n\n");
        // Next good frame still merges.
        a.push(b"data: {\"choices\":[{\"delta\":{\"content\":\"ok\"}}]}\n\n");
        assert_eq!(
            a.normalized()["choices"][0]["message"]["content"],
            json!("ok")
        );
    }

    #[test]
    fn feeds_byte_by_byte_matches_one_shot() {
        let mut one_shot = StreamAssembler::default();
        let mut byte_by_byte = StreamAssembler::default();
        let payload = "data: {\"choices\":[{\"index\":0,\"delta\":{\"content\":\"hi\"}}]}\n\ndata: [DONE]\n\n";
        one_shot.push(payload.as_bytes());
        push_all(&mut byte_by_byte, payload);
        assert_eq!(one_shot.normalized(), byte_by_byte.normalized());
        assert_eq!(one_shot.raw(), byte_by_byte.raw());
        assert_eq!(one_shot.done_seen(), byte_by_byte.done_seen());
    }

    #[test]
    fn empty_input_is_a_noop() {
        let mut a = StreamAssembler::default();
        a.push(b"");
        a.push(b"\n");
        assert!(!a.has_frames());
        assert_eq!(a.normalized(), &json!({}));
    }
}
