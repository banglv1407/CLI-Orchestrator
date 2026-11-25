use std::path::{Path, PathBuf};
use std::process::Command;

fn editor_command(executable: &Path, target: &Path) -> Command {
    let mut command = Command::new(executable);
    // Pass the path as one argument; never interpolate it into a shell command.
    command.arg("--reuse-window").arg("--").arg(target);
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(0x08000000);
    }
    command
}

#[cfg(target_os = "windows")]
fn find_editor() -> Result<PathBuf, String> {
    let mut candidates = Vec::new();
    if let Some(local) = std::env::var_os("LOCALAPPDATA") {
        candidates.push(PathBuf::from(local).join("Programs/Microsoft VS Code/Code.exe"));
    }
    for variable in ["ProgramFiles", "ProgramFiles(x86)"] {
        if let Some(root) = std::env::var_os(variable) {
            candidates.push(PathBuf::from(root).join("Microsoft VS Code/Code.exe"));
        }
    }
    if let Some(paths) = std::env::var_os("PATH") {
        for bin in std::env::split_paths(&paths).filter(|p| p.is_absolute()) {
            candidates.push(bin.join("Code.exe"));
            // VS Code adds its bin folder (containing code.cmd) to PATH.
            if let Some(root) = bin.parent() {
                if bin
                    .file_name()
                    .is_some_and(|name| name.eq_ignore_ascii_case("bin"))
                {
                    candidates.push(root.join("Code.exe"));
                }
            }
        }
    }
    candidates.into_iter().find(|p| p.is_file()).ok_or_else(||
        "VS Code was not found. Install VS Code or add its bin folder to PATH, then restart CLX.".to_string())
}

pub fn open(path: &str) -> Result<(), String> {
    let target = Path::new(path)
        .canonicalize()
        .map_err(|e| format!("Cannot open path: {e}"))?;
    #[cfg(target_os = "windows")]
    let executable = find_editor()?;
    #[cfg(not(target_os = "windows"))]
    let executable = PathBuf::from("code");
    let mut child = editor_command(&executable, &target)
        .spawn()
        .map_err(|e| format!("Could not launch VS Code: {e}"))?;
    // Reap the launcher without blocking the UI or the running terminal.
    std::thread::spawn(move || {
        let _ = child.wait();
    });
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn paths_are_single_literal_arguments() {
        let target = Path::new("D:/Dự án & tools/$(never-run);draft.txt");
        let command = editor_command(Path::new("Code.exe"), target);
        let args: Vec<_> = command.get_args().collect();
        assert_eq!(
            args,
            vec![
                std::ffi::OsStr::new("--reuse-window"),
                std::ffi::OsStr::new("--"),
                target.as_os_str()
            ]
        );
        assert_eq!(command.get_program(), "Code.exe");
    }

    #[test]
    fn missing_path_is_reported_before_launch() {
        assert!(open("__clx_missing_editor_target_93b7__/file")
            .unwrap_err()
            .contains("Cannot open path"));
    }
}
