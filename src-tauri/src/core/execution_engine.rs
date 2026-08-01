use std::{collections::HashMap, fs, path::Path, path::PathBuf};

use crate::core::cli_registry::CliDefinition;

#[derive(Debug, Clone)]
pub struct ResolvedCommand {
    pub command: String,
    pub args: Vec<String>,
    pub env: HashMap<String, String>,
    pub cwd: Option<PathBuf>,
}

pub struct ExecutionEngine;

impl ExecutionEngine {
    pub fn resolve_command(
        cli: &CliDefinition,
        prompt: &str,
        working_dir: Option<String>,
    ) -> ResolvedCommand {
        let mut parts = cli.command.split_whitespace();
        let base_command = parts.next().unwrap_or("").to_string();
        let extra_args: Vec<String> = parts.map(|s| s.to_string()).collect();

        let mut used_placeholder = false;
        let prompt_value = prompt.trim();

        let mut args = Vec::with_capacity(cli.args.len() + extra_args.len());
        args.extend(extra_args);

        for arg in &cli.args {
            if arg.contains("{prompt}") {
                used_placeholder = true;
                let replaced = arg.replace("{prompt}", prompt_value);
                if prompt_value.is_empty() && replaced.trim().is_empty() {
                    continue;
                }
                args.push(replaced);
            } else {
                args.push(arg.clone());
            }
        }

        if !prompt_value.is_empty() && !used_placeholder {
            args.push(prompt_value.to_string());
        }

        let (base_command, args) = if cli.enable_rtk && crate::core::rtk_sanitizer::RtkSanitizer::is_rtk_installed() {
            let mut rtk_args = vec![base_command];
            rtk_args.extend(args);
            ("rtk".to_string(), rtk_args)
        } else {
            (base_command, args)
        };

        let (command, args) = platform_prepare_command(cli.mode.clone(), base_command, args);

        ResolvedCommand {
            command,
            args,
            env: cli.env.clone(),
            cwd: working_dir.map(PathBuf::from),
        }
    }
}

#[cfg(target_os = "windows")]
fn platform_prepare_command(
    mode: crate::core::cli_registry::CliMode,
    command: String,
    args: Vec<String>,
) -> (String, Vec<String>) {
    if let Some((shim_command, shim_args)) = try_resolve_windows_node_shim(&command, &args) {
        return (shim_command, shim_args);
    }

    if !should_wrap_windows_command(&command) {
        return (command, args);
    }

    // For interactive sessions, keep the shell open after starting npm-style wrappers.
    // This prevents immediate PTY teardown when the wrapped process exits quickly.
    let shell_flag = match mode {
        crate::core::cli_registry::CliMode::Interactive => "/K",
    };

    let mut wrapped = vec!["/D".to_string(), shell_flag.to_string(), command];
    wrapped.extend(args);
    ("cmd.exe".to_string(), wrapped)
}

#[cfg(not(target_os = "windows"))]
fn platform_prepare_command(
    _: crate::core::cli_registry::CliMode,
    command: String,
    args: Vec<String>,
) -> (String, Vec<String>) {
    (command, args)
}

#[cfg(target_os = "windows")]
fn should_wrap_windows_command(command: &str) -> bool {
    let normalized = command.trim().to_ascii_lowercase();
    if normalized == "cmd"
        || normalized.ends_with("cmd.exe")
        || normalized.ends_with("powershell.exe")
        || normalized.ends_with("pwsh.exe")
    {
        return false;
    }

    if let Some(ext) = Path::new(command)
        .extension()
        .and_then(|value| value.to_str())
    {
        let ext = ext.to_ascii_lowercase();
        return ext == "cmd" || ext == "bat";
    }

    if let Ok(resolved) = which::which(command) {
        if let Some(ext) = resolved.extension().and_then(|value| value.to_str()) {
            let ext = ext.to_ascii_lowercase();
            return ext == "cmd" || ext == "bat";
        }
    }

    false
}

#[cfg(target_os = "windows")]
fn try_resolve_windows_node_shim(command: &str, args: &[String]) -> Option<(String, Vec<String>)> {
    let shim_path = find_windows_cmd_shim(command)?;
    let script_path = parse_npm_cmd_shim_target(&shim_path)?;

    let shim_dir = shim_path.parent()?;
    let bundled_node = shim_dir.join("node.exe");
    let node_command = if bundled_node.is_file() {
        bundled_node.to_string_lossy().to_string()
    } else {
        "node".to_string()
    };

    let mut shim_args = Vec::with_capacity(args.len() + 1);
    shim_args.push(script_path.to_string_lossy().to_string());
    shim_args.extend(args.iter().cloned());
    Some((node_command, shim_args))
}

#[cfg(target_os = "windows")]
fn find_windows_cmd_shim(command: &str) -> Option<PathBuf> {
    let command_path = PathBuf::from(command);
    if let Some(ext) = command_path.extension().and_then(|value| value.to_str()) {
        if ext.eq_ignore_ascii_case("cmd") && command_path.is_file() {
            return Some(command_path);
        }
    }

    let resolved = which::which(command).ok()?;
    if resolved
        .extension()
        .and_then(|value| value.to_str())
        .map(|value| value.eq_ignore_ascii_case("cmd"))
        .unwrap_or(false)
    {
        return Some(resolved);
    }

    if resolved
        .extension()
        .and_then(|value| value.to_str())
        .map(|value| value.eq_ignore_ascii_case("ps1"))
        .unwrap_or(false)
    {
        let cmd_candidate = resolved.with_extension("cmd");
        if cmd_candidate.is_file() {
            return Some(cmd_candidate);
        }
    }

    None
}

#[cfg(target_os = "windows")]
fn parse_npm_cmd_shim_target(path: &Path) -> Option<PathBuf> {
    let script = fs::read_to_string(path).ok()?;
    let marker = "\"%dp0%\\";
    let start = script.rfind(marker)? + marker.len();
    let after_marker = &script[start..];
    let end = after_marker.find("\" %*")?;
    let relative_target = after_marker[..end].trim();
    if relative_target.is_empty() {
        return None;
    }

    let normalized = relative_target.replace('\\', std::path::MAIN_SEPARATOR_STR);
    let base_dir = path.parent()?;
    let target_path = base_dir.join(normalized);
    if target_path.is_file() {
        return Some(target_path);
    }

    None
}

#[cfg(test)]
mod tests {
    use std::{
        collections::HashMap,
        fs,
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::ExecutionEngine;
    use crate::core::cli_registry::{CliDefinition, CliMode};

    fn cli_with_args(args: Vec<&str>) -> CliDefinition {
        CliDefinition {
            name: "test".to_string(),
            command: "cmd.exe".to_string(),
            args: args.into_iter().map(ToString::to_string).collect(),
            mode: CliMode::Interactive,
            env: HashMap::new(),
            default_working_dir: None,
            saved_directories: Vec::new(),
            enable_rtk: false,
            group: None,
        }
    }

    #[test]
    fn resolve_command_skips_empty_placeholder_arg() {
        let cli = cli_with_args(vec!["code", "{prompt}"]);
        let resolved = ExecutionEngine::resolve_command(&cli, "", None);
        assert_eq!(resolved.args, vec!["code".to_string()]);
    }

    #[test]
    fn resolve_command_keeps_nonempty_placeholder_arg() {
        let cli = cli_with_args(vec!["{prompt}"]);
        let resolved = ExecutionEngine::resolve_command(&cli, "hello", None);
        assert_eq!(resolved.args, vec!["hello".to_string()]);
    }

    #[test]
    fn resolve_command_keeps_nonempty_embedded_placeholder() {
        let cli = cli_with_args(vec!["--message={prompt}"]);
        let resolved = ExecutionEngine::resolve_command(&cli, "", None);
        assert_eq!(resolved.args, vec!["--message=".to_string()]);
    }

    #[test]
    fn resolve_command_appends_prompt_if_no_placeholder() {
        let cli = cli_with_args(vec!["code"]);
        let resolved = ExecutionEngine::resolve_command(&cli, "hello", None);
        assert_eq!(resolved.args, vec!["code".to_string(), "hello".to_string()]);
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn parse_npm_cmd_shim_target_extracts_script_path() {
        let unique = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("system clock before unix epoch")
            .as_nanos();
        let temp_dir = std::env::temp_dir().join(format!("ai-cli-manager-shim-test-{unique}"));
        fs::create_dir_all(&temp_dir).expect("failed to create temp dir");

        let script_target = temp_dir
            .join("node_modules")
            .join("acme-cli")
            .join("bin")
            .join("entry.js");
        fs::create_dir_all(script_target.parent().expect("missing script parent"))
            .expect("failed to create script parent");
        fs::write(&script_target, "console.log('ok');").expect("failed to write fake entry script");

        let shim_path = temp_dir.join("acme.cmd");
        fs::write(
            &shim_path,
            r#"@ECHO off
endLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "%dp0%\node_modules\acme-cli\bin\entry.js" %*
"#,
        )
        .expect("failed to write fake shim");

        let parsed =
            super::parse_npm_cmd_shim_target(&shim_path).expect("expected shim parser output");
        assert_eq!(parsed, script_target);

        let _ = fs::remove_dir_all(&temp_dir);
    }

    #[test]
    fn resolve_command_splits_multi_word_command() {
        let cli = CliDefinition {
            name: "aider".to_string(),
            command: "npx aider --model gemini/gemini-1.5-pro".to_string(),
            args: vec!["--git".to_string()],
            mode: CliMode::Interactive,
            env: HashMap::new(),
            default_working_dir: None,
            saved_directories: Vec::new(),
            enable_rtk: false,
            group: None,
        };
        let resolved = ExecutionEngine::resolve_command(&cli, "write tests", None);

        let actual_args = if resolved.command == "cmd.exe" {
            &resolved.args[3..]
        } else {
            &resolved.args[..]
        };

        assert_eq!(actual_args[0], "aider".to_string());
        assert_eq!(actual_args[1], "--model".to_string());
        assert_eq!(actual_args[2], "gemini/gemini-1.5-pro".to_string());
        assert_eq!(actual_args[3], "--git".to_string());
        assert_eq!(actual_args[4], "write tests".to_string());
    }
}
