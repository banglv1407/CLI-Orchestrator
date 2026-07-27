use std::process::Command;

pub struct RtkSanitizer;

impl RtkSanitizer {
    /// Checks if `rtk` CLI is available on the system PATH
    pub fn is_rtk_installed() -> bool {
        Command::new("rtk")
            .arg("--version")
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
    }

    /// Gets RTK gain statistics (`rtk gain`) if installed
    pub fn get_rtk_gain() -> Option<String> {
        let output = Command::new("rtk").arg("gain").output().ok()?;
        if output.status.success() {
            String::from_utf8(output.stdout).ok()
        } else {
            None
        }
    }

    /// Sanitizes text content by applying RTK-style token compression rules.
    pub fn sanitize_text(text: &str) -> String {
        if text.trim().is_empty() {
            return text.to_string();
        }

        let lines: Vec<&str> = text.lines().collect();
        let mut result = Vec::with_capacity(lines.len());
        let mut repeat_count = 1;
        let mut last_line: Option<&str> = None;
        let mut in_passing_test_block = false;
        let mut passed_test_count = 0;

        for line in lines {
            let trimmed = line.trim();

            // 1. Collapse passing test lines (e.g. "test ... ok" or "PASSED ...")
            if (trimmed.starts_with("test ") && trimmed.ends_with("... ok"))
                || (trimmed.starts_with("PASSED ") || trimmed.ends_with(" PASSED"))
                || (trimmed.contains(" ... ok") && !trimmed.contains("FAILED"))
            {
                passed_test_count += 1;
                in_passing_test_block = true;
                continue;
            } else if in_passing_test_block {
                result.push(format!("[RTK: {passed_test_count} passing tests collapsed]"));
                passed_test_count = 0;
                in_passing_test_block = false;
            }

            // 2. Collapse repeated identical log lines
            if let Some(prev) = last_line {
                if prev == line && !trimmed.is_empty() {
                    repeat_count += 1;
                    continue;
                } else if repeat_count > 1 {
                    result.push(format!("[RTK: repeated x{repeat_count}]"));
                    repeat_count = 1;
                }
            }

            last_line = Some(line);

            // 3. Truncate excessively long lines (e.g., >400 chars)
            if line.len() > 400 {
                let trunc = format!("{}... [RTK: truncated {} chars]", &line[..350], line.len() - 350);
                result.push(trunc);
            } else {
                result.push(line.to_string());
            }
        }

        if in_passing_test_block && passed_test_count > 0 {
            result.push(format!("[RTK: {passed_test_count} passing tests collapsed]"));
        }
        if repeat_count > 1 {
            result.push(format!("[RTK: repeated x{repeat_count}]"));
        }

        result.join("\n")
    }

    /// Sanitizes an entire serde_json Value representing a chat message content
    pub fn sanitize_message_content(content: &serde_json::Value) -> serde_json::Value {
        match content {
            serde_json::Value::String(s) => serde_json::Value::String(Self::sanitize_text(s)),
            serde_json::Value::Array(arr) => serde_json::Value::Array(
                arr.iter()
                    .map(|item| {
                        if let Some(type_str) = item.get("type").and_then(|v| v.as_str()) {
                            if type_str == "text" {
                                if let Some(text) = item.get("text").and_then(|v| v.as_str()) {
                                    let mut new_item = item.clone();
                                    if let serde_json::Value::Object(ref mut map) = new_item {
                                        map.insert(
                                            "text".to_string(),
                                            serde_json::Value::String(Self::sanitize_text(text)),
                                        );
                                    }
                                    return new_item;
                                }
                            }
                        }
                        item.clone()
                    })
                    .collect(),
            ),
            other => other.clone(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_sanitize_text_collapses_passing_tests() {
        let input = "test test_alpha ... ok\ntest test_beta ... ok\ntest test_gamma ... ok\nFAILED test_delta";
        let output = RtkSanitizer::sanitize_text(input);
        assert!(output.contains("[RTK: 3 passing tests collapsed]"));
        assert!(output.contains("FAILED test_delta"));
    }

    #[test]
    fn test_sanitize_text_collapses_repeated_logs() {
        let input = "Connection timeout\nConnection timeout\nConnection timeout\nDone";
        let output = RtkSanitizer::sanitize_text(input);
        assert!(output.contains("[RTK: repeated x3]"));
        assert!(output.contains("Done"));
    }

    #[test]
    fn test_sanitize_text_truncates_long_lines() {
        let long_line = "A".repeat(500);
        let output = RtkSanitizer::sanitize_text(&long_line);
        assert!(output.contains("[RTK: truncated 150 chars]"));
    }

    #[test]
    fn test_sanitize_message_content_json() {
        let content = json!("test foo ... ok\ntest bar ... ok");
        let sanitized = RtkSanitizer::sanitize_message_content(&content);
        assert_eq!(sanitized, json!("[RTK: 2 passing tests collapsed]"));
    }
}
