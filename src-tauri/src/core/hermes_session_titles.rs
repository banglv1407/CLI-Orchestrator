use std::{collections::HashMap, fs, path::PathBuf, time::Duration};

use rusqlite::{Connection, OpenFlags, OptionalExtension};
use serde::Serialize;

use super::execution_engine::ResolvedCommand;

#[derive(Debug, Clone)]
pub struct HermesTitleTarget {
    pub session_id: String,
    pub root_pid: Option<u32>,
    pub home: PathBuf,
    pub is_hermes: bool,
    pub resume_id: Option<String>,
    pub breadcrumb_file: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TerminalAgentSessionTitle {
    pub session_id: String,
    pub agent: String,
    pub agent_session_id: Option<String>,
    pub title: Option<String>,
}

impl HermesTitleTarget {
    pub fn new(session_id: String, cli_name: &str, command: &ResolvedCommand) -> Self {
        let executable = command.command.rsplit(['/', '\\']).next().unwrap_or("");
        let is_hermes = cli_name.eq_ignore_ascii_case("hm")
            || cli_name.eq_ignore_ascii_case("hermes")
            || matches!(
                executable.to_ascii_lowercase().as_str(),
                "hermes" | "hermes.cmd" | "hermes.exe"
            );
        let home = command
            .env
            .iter()
            .find(|(key, _)| key.eq_ignore_ascii_case("HERMES_HOME"))
            .map(|(_, value)| value.clone())
            .or_else(|| std::env::var("HERMES_HOME").ok())
            .filter(|value| !value.trim().is_empty())
            .map(|value| {
                let value = value.trim();
                let path = if value == "~" {
                    dirs::home_dir().unwrap_or_default()
                } else if let Some(tail) = value
                    .strip_prefix("~/")
                    .or_else(|| value.strip_prefix("~\\"))
                {
                    dirs::home_dir().unwrap_or_default().join(tail)
                } else {
                    PathBuf::from(value)
                };
                if path.is_absolute() {
                    path
                } else {
                    command
                        .cwd
                        .clone()
                        .or_else(|| std::env::current_dir().ok())
                        .unwrap_or_default()
                        .join(path)
                }
            })
            .unwrap_or_else(default_hermes_home);
        let resume_id = if is_hermes {
            resume_argument(&command.args)
        } else {
            None
        };
        let breadcrumb_file = terminal_breadcrumb_file(command);
        Self {
            session_id,
            root_pid: None,
            home,
            is_hermes,
            resume_id,
            breadcrumb_file,
        }
    }
}

pub fn assign_terminal_identity(session_id: &str, command: &mut ResolvedCommand) {
    if cfg!(windows) {
        // ConPTY has no Unix tty path. Give each local terminal its own normal
        // emulator identity; Hermes also uses this to scope its /new breadcrumb.
        command
            .env
            .retain(|key, _| !key.eq_ignore_ascii_case("TERM_SESSION_ID"));
        command.env.insert(
            "TERM_SESSION_ID".into(),
            format!(
                "clx-{}",
                session_id.rsplit('-').next().unwrap_or(session_id)
            ),
        );
    }
}

fn terminal_breadcrumb_file(command: &ResolvedCommand) -> Option<String> {
    if !cfg!(windows) {
        return None;
    }
    for key in [
        "ZELLIJ_PANE_ID",
        "TMUX_PANE",
        "KITTY_WINDOW_ID",
        "WEZTERM_PANE",
        "TERM_SESSION_ID",
        "WT_SESSION",
    ] {
        let value = command
            .env
            .iter()
            .find(|(name, _)| name.eq_ignore_ascii_case(key))
            .map(|(_, value)| value.clone())
            .or_else(|| std::env::var(key).ok());
        if let Some(value) = value.filter(|value| !value.is_empty()) {
            // Higher-priority inherited multiplexer IDs may be shared by all
            // CLX PTYs. Use a breadcrumb only for the identity CLX assigned.
            if key != "TERM_SESSION_ID" || !value.starts_with("clx-") {
                return None;
            }
            let safe: String = value
                .trim()
                .trim_matches('/')
                .chars()
                .map(|c| {
                    if c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-') {
                        c
                    } else {
                        '-'
                    }
                })
                .take(120)
                .collect();
            return Some(format!("term_session_id-{safe}"));
        }
    }
    None
}

fn breadcrumb_session_id(target: &HermesTitleTarget) -> Option<String> {
    let file = target.breadcrumb_file.as_ref()?;
    let text = fs::read_to_string(target.home.join("terminal-sessions").join(file)).ok()?;
    let value: serde_json::Value =
        serde_json::from_str(text.trim_start_matches('\u{feff}')).ok()?;
    let id = value.get("session_id")?.as_str()?.trim();
    (!id.is_empty()).then(|| id.to_string())
}

pub fn default_hermes_home() -> PathBuf {
    let home = dirs::home_dir().unwrap_or_default();
    let suffix = std::env::var("HERMES_DATA_DIR_SUFFIX").unwrap_or_default();
    if cfg!(windows) {
        std::env::var("LOCALAPPDATA")
            .ok()
            .filter(|value| !value.trim().is_empty())
            .map(PathBuf::from)
            .unwrap_or_else(|| home.join("AppData/Local"))
            .join(format!("hermes{suffix}"))
    } else {
        home.join(format!(".hermes{suffix}"))
    }
}

fn resume_argument(args: &[String]) -> Option<String> {
    args.iter().enumerate().find_map(|(index, arg)| {
        let value = if matches!(arg.as_str(), "--resume" | "-r") {
            args.get(index + 1).map(String::as_str)
        } else {
            arg.strip_prefix("--resume=")
        }?;
        let value = value.trim();
        (!value.is_empty() && !value.starts_with('-')).then(|| value.to_string())
    })
}

#[derive(Debug)]
struct ActiveSession {
    pid: u32,
    session_id: String,
}

fn active_sessions(home: &PathBuf) -> Vec<ActiveSession> {
    let Ok(text) = fs::read_to_string(home.join("runtime/active_sessions.json")) else {
        return Vec::new();
    };
    parse_active_sessions(&text)
}

fn parse_active_sessions(text: &str) -> Vec<ActiveSession> {
    let Ok(value) = serde_json::from_str::<serde_json::Value>(text.trim_start_matches('\u{feff}'))
    else {
        return Vec::new();
    };
    let Some(entries) = value.get("entries").unwrap_or(&value).as_array() else {
        return Vec::new();
    };
    entries
        .iter()
        .filter_map(|entry| {
            if !matches!(entry.get("surface")?.as_str()?, "cli" | "tui" | "desktop") {
                return None;
            }
            let pid = entry
                .get("pid")?
                .as_u64()
                .and_then(|pid| u32::try_from(pid).ok())?;
            let session_id = entry.get("session_id")?.as_str()?.trim();
            (pid != 0 && !session_id.is_empty()).then(|| ActiveSession {
                pid,
                session_id: session_id.to_string(),
            })
        })
        .collect()
}

fn descendant_distance(pid: u32, root: u32, parents: &HashMap<u32, u32>) -> Option<usize> {
    // Requiring a live snapshot entry also excludes stale registry PIDs.
    if !parents.contains_key(&pid) || !parents.contains_key(&root) {
        return None;
    }
    let mut current = pid;
    for distance in 0..64 {
        if current == root {
            return Some(distance);
        }
        let parent = *parents.get(&current)?;
        if parent == 0 || parent == current {
            return None;
        }
        current = parent;
    }
    None
}

fn owned_session_id(
    root: u32,
    entries: &[ActiveSession],
    parents: &HashMap<u32, u32>,
) -> Result<Option<String>, ()> {
    let mut matches: Vec<_> = entries
        .iter()
        .filter_map(|entry| {
            descendant_distance(entry.pid, root, parents)
                .map(|distance| (distance, entry.session_id.as_str()))
        })
        .collect();
    matches.sort_unstable();
    let Some(&(distance, session_id)) = matches.first() else {
        return Ok(None);
    };
    if matches
        .iter()
        .any(|(other_distance, other_id)| *other_distance == distance && *other_id != session_id)
    {
        return Err(());
    }
    Ok(Some(session_id.to_string()))
}

fn read_title(conn: &Connection, id: &str) -> Option<String> {
    conn.query_row("SELECT title FROM sessions WHERE id = ?1", [id], |row| {
        row.get::<_, Option<String>>(0)
    })
    .optional()
    .ok()
    .flatten()
    .flatten()
    .map(|title| title.trim().to_string())
    .filter(|title| !title.is_empty())
}

pub fn resolve_titles(targets: Vec<HermesTitleTarget>) -> Vec<TerminalAgentSessionTitle> {
    let mut homes = HashMap::new();
    for target in &targets {
        homes.entry(target.home.clone()).or_insert_with(|| {
            let entries = active_sessions(&target.home);
            let connection = Connection::open_with_flags(
                target.home.join("state.db"),
                OpenFlags::SQLITE_OPEN_READ_ONLY | OpenFlags::SQLITE_OPEN_NO_MUTEX,
            )
            .ok();
            if let Some(conn) = &connection {
                let _ = conn.busy_timeout(Duration::from_millis(25));
            }
            (entries, connection)
        });
    }
    let parents = process_parents();
    targets
        .into_iter()
        .filter_map(|target| {
            let (entries, connection) = homes.get(&target.home)?;
            let owner = target
                .root_pid
                .map(|pid| owned_session_id(pid, entries, &parents))
                .unwrap_or(Ok(None));
            // An ambiguous live owner must never be disguised by the original
            // resume ID: the process may have switched conversations since launch.
            let id = match owner {
                Ok(Some(owner_id)) => {
                    // The classic CLI lease can retain its launch ID after
                    // /new or /resume. Its per-terminal breadcrumb is refreshed
                    // at each switch; do not accept a nested agent's breadcrumb.
                    breadcrumb_session_id(&target)
                        .filter(|id| {
                            id == &owner_id
                                || !entries.iter().any(|entry| {
                                    &entry.session_id == id && parents.contains_key(&entry.pid)
                                })
                        })
                        .or(Some(owner_id))
                }
                Ok(None) if target.is_hermes => breadcrumb_session_id(&target).or(target.resume_id),
                Ok(None) => None,
                Err(()) => None,
            };
            if id.is_none() && !target.is_hermes {
                return None;
            }
            let title = id
                .as_deref()
                .and_then(|id| connection.as_ref().and_then(|conn| read_title(conn, id)));
            Some(TerminalAgentSessionTitle {
                session_id: target.session_id,
                agent: "hermes".into(),
                agent_session_id: id,
                title,
            })
        })
        .collect()
}

#[cfg(windows)]
fn process_parents() -> HashMap<u32, u32> {
    use windows_sys::Win32::{
        Foundation::{CloseHandle, INVALID_HANDLE_VALUE},
        System::Diagnostics::ToolHelp::{
            CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W,
            TH32CS_SNAPPROCESS,
        },
    };
    let mut parents = HashMap::new();
    let snapshot = unsafe { CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) };
    if snapshot == INVALID_HANDLE_VALUE {
        return parents;
    }
    let mut entry: PROCESSENTRY32W = unsafe { std::mem::zeroed() };
    entry.dwSize = std::mem::size_of::<PROCESSENTRY32W>() as u32;
    if unsafe { Process32FirstW(snapshot, &mut entry) } != 0 {
        loop {
            parents.insert(entry.th32ProcessID, entry.th32ParentProcessID);
            if unsafe { Process32NextW(snapshot, &mut entry) } == 0 {
                break;
            }
        }
    }
    unsafe {
        CloseHandle(snapshot);
    }
    parents
}

#[cfg(target_os = "linux")]
fn process_parents() -> HashMap<u32, u32> {
    let mut parents = HashMap::new();
    if let Ok(entries) = fs::read_dir("/proc") {
        for entry in entries.flatten() {
            let Some(pid) = entry
                .file_name()
                .to_str()
                .and_then(|name| name.parse::<u32>().ok())
            else {
                continue;
            };
            let Ok(stat) = fs::read_to_string(entry.path().join("stat")) else {
                continue;
            };
            let Some(tail) = stat.rsplit_once(')').map(|(_, tail)| tail) else {
                continue;
            };
            if let Some(parent) = tail
                .split_whitespace()
                .nth(1)
                .and_then(|value| value.parse::<u32>().ok())
            {
                parents.insert(pid, parent);
            }
        }
    }
    parents
}

#[cfg(not(any(windows, target_os = "linux")))]
fn process_parents() -> HashMap<u32, u32> {
    // macOS and other Unix systems do not expose Linux /proc.
    let Ok(output) = std::process::Command::new("ps")
        .args(["-axo", "pid=,ppid="])
        .output()
    else {
        return HashMap::new();
    };
    String::from_utf8_lossy(&output.stdout)
        .lines()
        .filter_map(|line| {
            let mut fields = line.split_whitespace();
            Some((fields.next()?.parse().ok()?, fields.next()?.parse().ok()?))
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn simultaneous_terminals_and_nested_agents_keep_their_own_identity() {
        let parents = HashMap::from([(10, 1), (11, 10), (12, 11), (13, 12), (20, 1), (21, 20)]);
        let entries = vec![
            ActiveSession {
                pid: 12,
                session_id: "first".into(),
            },
            ActiveSession {
                pid: 13,
                session_id: "nested".into(),
            },
            ActiveSession {
                pid: 21,
                session_id: "second".into(),
            },
        ];
        assert_eq!(
            owned_session_id(10, &entries, &parents).unwrap().as_deref(),
            Some("first")
        );
        assert_eq!(
            owned_session_id(20, &entries, &parents).unwrap().as_deref(),
            Some("second")
        );
        assert_eq!(owned_session_id(99, &entries, &parents), Ok(None));
    }

    #[test]
    fn ambiguous_owners_stale_pids_and_cycles_do_not_select_a_name() {
        let parents = HashMap::from([(10, 1), (11, 10), (12, 10), (30, 31), (31, 30)]);
        let entries = vec![
            ActiveSession {
                pid: 11,
                session_id: "first".into(),
            },
            ActiveSession {
                pid: 12,
                session_id: "second".into(),
            },
            ActiveSession {
                pid: 99,
                session_id: "stale".into(),
            },
        ];
        assert_eq!(owned_session_id(10, &entries, &parents), Err(()));
        assert_eq!(descendant_distance(30, 10, &parents), None);
    }

    #[test]
    fn registry_formats_exclude_gateway_and_invalid_owners() {
        let text = r#"{"entries":[{"pid":42,"surface":"cli","session_id":"current"},
          {"pid":43,"surface":"gateway","session_id":"unrelated"},
          {"pid":0,"surface":"cli","session_id":"invalid"},
          {"pid":44,"surface":"cli","session_id":"  "}]}"#;
        let entries = parse_active_sessions(text);
        assert_eq!(entries.len(), 1);
        assert_eq!(entries[0].session_id, "current");
        assert_eq!(
            parse_active_sessions(
                "\u{feff}[{\"pid\":42,\"surface\":\"tui\",\"session_id\":\"legacy\"}]"
            )[0]
            .session_id,
            "legacy"
        );
        assert!(parse_active_sessions("incomplete JSON").is_empty());
    }

    #[test]
    fn exact_session_row_supplies_name_and_live_rename_without_using_id_or_newest_row() {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch("CREATE TABLE sessions(id TEXT PRIMARY KEY, title TEXT); INSERT INTO sessions VALUES ('first','Tên hội thoại'),('second','Another name'),('empty','   ');").unwrap();
        assert_eq!(read_title(&conn, "first").as_deref(), Some("Tên hội thoại"));
        assert_eq!(read_title(&conn, "empty"), None);
        assert_eq!(read_title(&conn, "missing"), None);
        conn.execute(
            "UPDATE sessions SET title = ?1 WHERE id = ?2",
            ["Đổi tên 👩‍💻", "first"],
        )
        .unwrap();
        assert_eq!(read_title(&conn, "first").as_deref(), Some("Đổi tên 👩‍💻"));
        assert_eq!(read_title(&conn, "second").as_deref(), Some("Another name"));
    }

    #[test]
    fn resume_id_is_taken_from_the_provider_argument() {
        assert_eq!(
            resume_argument(&["--resume".into(), "20261011_123456_abcdef".into()]).as_deref(),
            Some("20261011_123456_abcdef")
        );
        assert_eq!(
            resume_argument(&["--resume=one".into()]).as_deref(),
            Some("one")
        );
        assert_eq!(
            resume_argument(&["-r".into(), "two".into()]).as_deref(),
            Some("two")
        );
        assert_eq!(resume_argument(&["--resume".into()]), None);
        assert_eq!(resume_argument(&["--title".into(), "name".into()]), None);
    }

    #[test]
    fn configured_home_and_alias_executable_are_kept_separate_from_the_session_name() {
        let mut command = ResolvedCommand {
            command: "C:\\tools\\hermes.cmd".into(),
            args: vec!["--resume".into(), "original-id".into()],
            env: HashMap::from([("HERMES_HOME".into(), "relative-profile".into())]),
            cwd: Some(std::env::temp_dir()),
        };
        let target = HermesTitleTarget::new("pty-alias".into(), "Custom alias", &command);
        assert!(target.is_hermes);
        assert_eq!(target.home, std::env::temp_dir().join("relative-profile"));
        assert_eq!(target.resume_id.as_deref(), Some("original-id"));
        assert_eq!(target.session_id, "pty-alias");
        assign_terminal_identity(
            "long-custom-name-11111111111111111111111111111111",
            &mut command,
        );
        if cfg!(windows) {
            assert_eq!(
                command.env.get("TERM_SESSION_ID").map(String::as_str),
                Some("clx-11111111111111111111111111111111")
            );
            assign_terminal_identity("same-name-22222222222222222222222222222222", &mut command);
            assert_eq!(
                command.env.get("TERM_SESSION_ID").map(String::as_str),
                Some("clx-22222222222222222222222222222222")
            );
        }
    }

    #[test]
    fn native_process_snapshot_contains_this_test_process() {
        assert!(process_parents().contains_key(&std::process::id()));
    }

    #[test]
    #[ignore = "requires an installed Hermes with at least one live CLI session"]
    fn installed_hermes_owners_resolve_their_current_names_read_only() {
        let home = std::env::var("CLX_HERMES_SMOKE_HOME")
            .map(PathBuf::from)
            .unwrap_or_else(|_| default_hermes_home());
        let parents = process_parents();
        let entries = active_sessions(&home);
        let entries: Vec<_> = entries
            .iter()
            .filter(|entry| parents.contains_key(&entry.pid))
            .collect();
        assert!(!entries.is_empty(), "no live Hermes CLI registry entries");
        let targets: Vec<_> = entries
            .iter()
            .map(|entry| {
                let parent = *parents.get(&entry.pid).unwrap();
                let root = if owned_session_id(parent, &active_sessions(&home), &parents)
                    .ok()
                    .flatten()
                    .as_deref()
                    == Some(&entry.session_id)
                {
                    parent
                } else {
                    entry.pid
                };
                HermesTitleTarget {
                    session_id: format!("smoke-{}", entry.pid),
                    root_pid: Some(root),
                    home: home.clone(),
                    is_hermes: false,
                    resume_id: None,
                    breadcrumb_file: None,
                }
            })
            .collect();
        let titles = resolve_titles(targets);
        assert_eq!(titles.len(), entries.len());
        let conn =
            Connection::open_with_flags(home.join("state.db"), OpenFlags::SQLITE_OPEN_READ_ONLY)
                .unwrap();
        for entry in &entries {
            let title = titles
                .iter()
                .find(|title| title.session_id == format!("smoke-{}", entry.pid))
                .unwrap();
            assert!(
                title.agent_session_id.as_deref() == Some(&entry.session_id),
                "session identity mismatch"
            );
            assert!(
                title.title == read_title(&conn, &entry.session_id),
                "current name mismatch"
            );
        }
        println!(
            "Verified {} live Hermes owners against exact read-only title rows.",
            entries.len()
        );
    }

    #[test]
    fn fresh_resume_and_manual_shell_follow_the_live_session_switch() {
        let home = std::env::temp_dir().join(format!(
            "clx-hermes-titles-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir_all(home.join("runtime")).unwrap();
        let conn = Connection::open(home.join("state.db")).unwrap();
        conn.execute_batch("CREATE TABLE sessions(id TEXT PRIMARY KEY, title TEXT); INSERT INTO sessions VALUES ('original','Original name'),('current','Current name'),('new',NULL);").unwrap();
        let target = |id: &str, is_hermes, resume_id| HermesTitleTarget {
            session_id: id.into(),
            root_pid: Some(std::process::id()),
            home: home.clone(),
            is_hermes,
            resume_id,
            breadcrumb_file: None,
        };
        let targets = || {
            vec![
                target("fresh", true, None),
                target("resume", true, Some("original".into())),
                target("shell", false, None),
            ]
        };
        let initial = resolve_titles(targets());
        assert_eq!(initial.len(), 2);
        assert_eq!(
            initial
                .iter()
                .find(|title| title.session_id == "resume")
                .unwrap()
                .title
                .as_deref(),
            Some("Original name")
        );
        let publish = |id| {
            fs::write(home.join("runtime/active_sessions.json"),
            serde_json::json!({"entries": [{"pid": std::process::id(), "surface": "cli", "session_id": id}]}).to_string()).unwrap()
        };
        publish("current");
        let current = resolve_titles(targets());
        assert_eq!(current.len(), 3);
        assert!(current
            .iter()
            .all(|title| title.agent_session_id.as_deref() == Some("current")
                && title.title.as_deref() == Some("Current name")));
        conn.execute(
            "UPDATE sessions SET title = ?1 WHERE id = 'current'",
            ["Renamed conversation"],
        )
        .unwrap();
        assert!(resolve_titles(targets())
            .iter()
            .all(|title| title.title.as_deref() == Some("Renamed conversation")));
        publish("new");
        assert!(
            resolve_titles(targets())
                .iter()
                .all(|title| title.agent_session_id.as_deref() == Some("new")
                    && title.title.is_none())
        );
        drop(conn);
        fs::remove_file(home.join("state.db")).unwrap();
        fs::remove_file(home.join("runtime/active_sessions.json")).unwrap();
        fs::remove_dir(home.join("runtime")).unwrap();
        fs::remove_dir(home).unwrap();
    }

    #[test]
    fn terminal_breadcrumb_tracks_switches_even_when_the_cli_lease_keeps_its_initial_id() {
        let home = std::env::temp_dir().join(format!(
            "clx-hermes-crumb-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir_all(home.join("runtime")).unwrap();
        fs::create_dir_all(home.join("terminal-sessions")).unwrap();
        let conn = Connection::open(home.join("state.db")).unwrap();
        conn.execute_batch("CREATE TABLE sessions(id TEXT PRIMARY KEY, title TEXT); INSERT INTO sessions VALUES ('original','Original name'),('switched','Current name'),('unrelated','Other name'),('untitled',NULL);").unwrap();
        let other_pid = *process_parents().get(&std::process::id()).unwrap();
        fs::write(
            home.join("runtime/active_sessions.json"),
            serde_json::json!({"entries": [
                {"pid": std::process::id(), "surface": "cli", "session_id": "original"},
                    {"pid": other_pid, "surface": "cli", "session_id": "unrelated"}
            ]})
            .to_string(),
        )
        .unwrap();
        let file = "term_session_id-clx-fixture";
        let target = HermesTitleTarget {
            session_id: "shell-pty".into(),
            root_pid: Some(std::process::id()),
            home: home.clone(),
            is_hermes: false,
            resume_id: None,
            breadcrumb_file: Some(file.into()),
        };
        let publish = |id| {
            fs::write(
                home.join("terminal-sessions").join(file),
                serde_json::json!({"session_id": id}).to_string(),
            )
            .unwrap()
        };
        publish("switched");
        let current = resolve_titles(vec![target.clone()]);
        assert_eq!(current[0].agent_session_id.as_deref(), Some("switched"));
        assert_eq!(current[0].title.as_deref(), Some("Current name"));
        publish("unrelated");
        assert_eq!(
            resolve_titles(vec![target.clone()])[0].title.as_deref(),
            Some("Original name")
        );
        fs::write(
            home.join("runtime/active_sessions.json"),
            serde_json::json!({"entries": [
                {"pid": std::process::id(), "surface": "cli", "session_id": "original"},
                {"pid": u32::MAX, "surface": "cli", "session_id": "unrelated"}
            ]})
            .to_string(),
        )
        .unwrap();
        assert_eq!(
            resolve_titles(vec![target.clone()])[0].title.as_deref(),
            Some("Other name"),
            "an exited lease must not prevent a current resume"
        );
        publish("untitled");
        let current = resolve_titles(vec![target.clone()]);
        assert_eq!(current[0].agent_session_id.as_deref(), Some("untitled"));
        assert_eq!(current[0].title, None);
        let mut exited = target;
        exited.root_pid = None;
        assert!(
            resolve_titles(vec![exited]).is_empty(),
            "a shell must not keep the exited Hermes name"
        );
        drop(conn);
        fs::remove_file(home.join("state.db")).unwrap();
        fs::remove_file(home.join("runtime/active_sessions.json")).unwrap();
        fs::remove_file(home.join("terminal-sessions").join(file)).unwrap();
        fs::remove_dir(home.join("runtime")).unwrap();
        fs::remove_dir(home.join("terminal-sessions")).unwrap();
        fs::remove_dir(home).unwrap();
    }
}
