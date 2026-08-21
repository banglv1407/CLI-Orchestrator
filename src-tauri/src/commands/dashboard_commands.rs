//! Dashboard commands — resource monitoring, port management, and process log discovery.

use std::collections::{HashMap, HashSet, VecDeque};
use std::process::Stdio;
use std::sync::Arc;
use std::time::Duration;

use base64::Engine;
use futures_util::{stream, StreamExt};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, State};
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::sync::mpsc;
use zeroize::Zeroize;

use crate::app_state::AppState;
use crate::core::monitoring::{
    normalize_and_validate, CommandOutput, LogSourceConfig, MonitorConfig, MonitorManager,
    MonitorSaveResult, MonitorSecrets, SshRouteSession,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcessLogInfo {
    /// Human-readable service description (e.g. "Next.js", "Rust/Cargo")
    pub service_name: String,
    /// Full path to the discovered log file
    pub log_path: String,
    /// Last N lines of the log file
    pub log_content: String,
    /// Total size of log file in bytes
    pub log_size_bytes: u64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResourceUsage {
    pub memory_bytes: u64,
    pub memory_mb: f64,
    pub memory_percent: f64,
    pub child_count: u32,
    pub tree_memory_bytes: u64,
    pub tree_memory_mb: f64,
    pub tree_private_bytes: u64,
    pub ui_memory_bytes: u64,
    pub ui_memory_mb: f64,
    pub ui_private_bytes: u64,
    pub process_count: u32,
    pub webview_count: u32,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcessDetail {
    /// Full path to the executable.
    pub exe_path: Option<String>,
    /// Working set in bytes.
    pub memory_bytes: u64,
    /// Working set in MB.
    pub memory_mb: f64,
    /// CPU time in seconds (kernel + user) since process start.
    /// For relative load, divide by uptime_seconds.
    pub cpu_time_seconds: f64,
    /// Seconds since process started.
    pub uptime_seconds: u64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PortInfo {
    pub port: u16,
    pub listening: bool,
    pub pid: Option<u32>,
    pub process_name: Option<String>,
    pub detail: Option<ProcessDetail>,
}

// ── CREATE_NO_WINDOW helper ────────────────────────────────────────

#[cfg(target_os = "windows")]
fn cmd_no_window(cmd: &mut std::process::Command) -> &mut std::process::Command {
    use std::os::windows::process::CommandExt;
    cmd.creation_flags(0x08000000)
}

#[cfg(not(target_os = "windows"))]
fn cmd_no_window(cmd: &mut std::process::Command) -> &mut std::process::Command {
    cmd
}

// ── Process memory (current process) ───────────────────────────────

#[cfg(target_os = "windows")]
fn get_process_memory() -> ResourceUsage {
    use std::mem;
    use windows_sys::Win32::System::ProcessStatus::{
        GetProcessMemoryInfo, PROCESS_MEMORY_COUNTERS,
    };
    use windows_sys::Win32::System::SystemInformation::{GlobalMemoryStatusEx, MEMORYSTATUSEX};
    use windows_sys::Win32::System::Threading::GetCurrentProcess;

    let h = unsafe { GetCurrentProcess() };
    let mut pmc: PROCESS_MEMORY_COUNTERS = unsafe { mem::zeroed() };
    pmc.cb = mem::size_of::<PROCESS_MEMORY_COUNTERS>() as u32;
    let ws = if unsafe { GetProcessMemoryInfo(h, &mut pmc, pmc.cb) } != 0 {
        pmc.WorkingSetSize as u64
    } else {
        0
    };

    let mut memex: MEMORYSTATUSEX = unsafe { mem::zeroed() };
    memex.dwLength = mem::size_of::<MEMORYSTATUSEX>() as u32;
    let total_phys = if unsafe { GlobalMemoryStatusEx(&mut memex) } != 0 {
        memex.ullTotalPhys
    } else {
        1
    };

    let (
        tree_memory_bytes,
        tree_private_bytes,
        ui_memory_bytes,
        ui_private_bytes,
        process_count,
        webview_count,
    ) = get_process_tree_stats(unsafe {
        windows_sys::Win32::System::Threading::GetCurrentProcessId()
    });
    ResourceUsage {
        memory_bytes: ws,
        memory_mb: ws as f64 / (1024.0 * 1024.0),
        memory_percent: if total_phys > 0 {
            ws as f64 / total_phys as f64 * 100.0
        } else {
            0.0
        },
        child_count: count_child_processes(),
        tree_memory_bytes,
        tree_memory_mb: tree_memory_bytes as f64 / (1024.0 * 1024.0),
        tree_private_bytes,
        ui_memory_bytes,
        ui_memory_mb: ui_memory_bytes as f64 / (1024.0 * 1024.0),
        ui_private_bytes,
        process_count,
        webview_count,
    }
}

#[cfg(target_os = "windows")]
fn get_process_tree_stats(root_pid: u32) -> (u64, u64, u64, u64, u32, u32) {
    use std::mem;
    use windows_sys::Win32::System::Diagnostics::ToolHelp::{
        CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W,
        TH32CS_SNAPPROCESS,
    };
    use windows_sys::Win32::System::ProcessStatus::{
        GetProcessMemoryInfo, PROCESS_MEMORY_COUNTERS, PROCESS_MEMORY_COUNTERS_EX,
    };
    use windows_sys::Win32::System::Threading::{
        OpenProcess, PROCESS_QUERY_LIMITED_INFORMATION, PROCESS_VM_READ,
    };

    let snapshot = unsafe { CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) };
    if snapshot as isize == -1 {
        return (0, 0, 0, 0, 0, 0);
    }
    let mut children: HashMap<u32, Vec<(u32, String)>> = HashMap::new();
    let mut root_name = String::new();
    let mut root_parent_pid = 0u32;
    let mut webview_roots = Vec::new();
    let mut entry: PROCESSENTRY32W = unsafe { mem::zeroed() };
    entry.dwSize = mem::size_of::<PROCESSENTRY32W>() as u32;
    if unsafe { Process32FirstW(snapshot, &mut entry) } != 0 {
        loop {
            let name_len = entry
                .szExeFile
                .iter()
                .position(|value| *value == 0)
                .unwrap_or(entry.szExeFile.len());
            let name = String::from_utf16_lossy(&entry.szExeFile[..name_len]);
            if entry.th32ProcessID == root_pid {
                root_name = name.clone();
                root_parent_pid = entry.th32ParentProcessID;
            }
            children
                .entry(entry.th32ParentProcessID)
                .or_default()
                .push((entry.th32ProcessID, name));
            if unsafe { Process32NextW(snapshot, &mut entry) } == 0 {
                break;
            }
        }
    }
    unsafe { windows_sys::Win32::Foundation::CloseHandle(snapshot) };

    if root_parent_pid != 0 {
        if let Some(siblings) = children.get(&root_parent_pid) {
            webview_roots.extend(
                siblings
                    .iter()
                    .filter(|(_, name)| name.eq_ignore_ascii_case("msedgewebview2.exe"))
                    .cloned(),
            );
        }
    }
    let mut queue = VecDeque::from([(root_pid, root_name, false)]);
    queue.extend(
        webview_roots
            .into_iter()
            .map(|(pid, name)| (pid, name, true)),
    );
    let mut visited = HashSet::new();
    let mut working_set = 0u64;
    let mut private_bytes = 0u64;
    let mut ui_working_set = 0u64;
    let mut ui_private_bytes = 0u64;
    let mut process_count = 0u32;
    let mut webview_count = 0u32;
    while let Some((pid, name, webview_owned)) = queue.pop_front() {
        if !visited.insert(pid) {
            continue;
        }
        process_count += 1;
        if name.eq_ignore_ascii_case("msedgewebview2.exe") {
            webview_count += 1;
        }
        let handle =
            unsafe { OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ, 0, pid) };
        if handle != 0 {
            let mut counters: PROCESS_MEMORY_COUNTERS_EX = unsafe { mem::zeroed() };
            counters.cb = mem::size_of::<PROCESS_MEMORY_COUNTERS_EX>() as u32;
            if unsafe {
                GetProcessMemoryInfo(
                    handle,
                    &mut counters as *mut PROCESS_MEMORY_COUNTERS_EX
                        as *mut PROCESS_MEMORY_COUNTERS,
                    counters.cb,
                )
            } != 0
            {
                working_set = working_set.saturating_add(counters.WorkingSetSize as u64);
                private_bytes = private_bytes.saturating_add(counters.PrivateUsage as u64);
                if pid == root_pid || webview_owned {
                    ui_working_set = ui_working_set.saturating_add(counters.WorkingSetSize as u64);
                    ui_private_bytes =
                        ui_private_bytes.saturating_add(counters.PrivateUsage as u64);
                }
            }
            unsafe { windows_sys::Win32::Foundation::CloseHandle(handle) };
        }
        if let Some(next) = children.remove(&pid) {
            queue.extend(
                next.into_iter()
                    .map(|(child_pid, child_name)| (child_pid, child_name, webview_owned)),
            );
        }
    }
    (
        working_set,
        private_bytes,
        ui_working_set,
        ui_private_bytes,
        process_count,
        webview_count,
    )
}

#[cfg(target_os = "windows")]
fn count_child_processes() -> u32 {
    use std::mem;
    use windows_sys::Win32::System::Diagnostics::ToolHelp::{
        CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W,
        TH32CS_SNAPPROCESS,
    };
    use windows_sys::Win32::System::Threading::GetCurrentProcessId;

    let parent_pid = unsafe { GetCurrentProcessId() };
    let snapshot = unsafe { CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) };
    if snapshot as isize == -1 {
        return 0;
    }
    let mut count: u32 = 0;
    let mut pe: PROCESSENTRY32W = unsafe { mem::zeroed() };
    pe.dwSize = mem::size_of::<PROCESSENTRY32W>() as u32;
    if unsafe { Process32FirstW(snapshot, &mut pe) } != 0 {
        loop {
            if pe.th32ParentProcessID == parent_pid {
                count += 1;
            }
            if unsafe { Process32NextW(snapshot, &mut pe) } == 0 {
                break;
            }
        }
    }
    unsafe { windows_sys::Win32::Foundation::CloseHandle(snapshot) };
    count
}

#[cfg(not(target_os = "windows"))]
fn get_process_memory() -> ResourceUsage {
    let mut memory_bytes: u64 = 0;
    if let Ok(status) = std::fs::read_to_string("/proc/self/status") {
        for line in status.lines() {
            if line.starts_with("VmRSS:") {
                memory_bytes = line
                    .split_whitespace()
                    .nth(1)
                    .and_then(|s| s.parse::<u64>().ok())
                    .unwrap_or(0)
                    * 1024;
                break;
            }
        }
    }
    ResourceUsage {
        memory_bytes,
        memory_mb: memory_bytes as f64 / (1024.0 * 1024.0),
        memory_percent: 0.0,
        child_count: 0,
        tree_memory_bytes: memory_bytes,
        tree_memory_mb: memory_bytes as f64 / (1024.0 * 1024.0),
        tree_private_bytes: 0,
        ui_memory_bytes: memory_bytes,
        ui_memory_mb: memory_bytes as f64 / (1024.0 * 1024.0),
        ui_private_bytes: 0,
        process_count: 1,
        webview_count: 0,
    }
}

// ── Rich process detail (per-PID) ──────────────────────────────────

#[cfg(target_os = "windows")]
fn process_detail_by_pid(pid: u32) -> Option<ProcessDetail> {
    use std::mem;
    use windows_sys::Win32::Foundation::FILETIME;
    use windows_sys::Win32::System::ProcessStatus::{
        GetProcessMemoryInfo, PROCESS_MEMORY_COUNTERS,
    };
    use windows_sys::Win32::System::SystemInformation::GetTickCount64;
    use windows_sys::Win32::System::Threading::{
        GetProcessTimes, OpenProcess, QueryFullProcessImageNameW, PROCESS_QUERY_INFORMATION,
        PROCESS_VM_READ,
    };

    let h = unsafe { OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 0, pid) };
    if h == 0 {
        return None;
    }

    // RAM
    let mut pmc: PROCESS_MEMORY_COUNTERS = unsafe { mem::zeroed() };
    pmc.cb = mem::size_of::<PROCESS_MEMORY_COUNTERS>() as u32;
    let mem_bytes = if unsafe { GetProcessMemoryInfo(h, &mut pmc, pmc.cb) } != 0 {
        pmc.WorkingSetSize as u64
    } else {
        0
    };

    // CPU time + uptime
    let mut create_time: FILETIME = unsafe { mem::zeroed() };
    let mut exit_time: FILETIME = unsafe { mem::zeroed() };
    let mut kernel_time: FILETIME = unsafe { mem::zeroed() };
    let mut user_time: FILETIME = unsafe { mem::zeroed() };
    let (cpu_s, uptime_s) = if unsafe {
        GetProcessTimes(
            h,
            &mut create_time,
            &mut exit_time,
            &mut kernel_time,
            &mut user_time,
        )
    } != 0
    {
        let k = ((kernel_time.dwLowDateTime as u64) | ((kernel_time.dwHighDateTime as u64) << 32))
            as f64
            / 10_000_000.0;
        let u = ((user_time.dwLowDateTime as u64) | ((user_time.dwHighDateTime as u64) << 32))
            as f64
            / 10_000_000.0;
        let cpu = k + u;
        // uptime = now_ms - create_time_ms
        let create_ms = ((create_time.dwLowDateTime as u64)
            | ((create_time.dwHighDateTime as u64) << 32))
            / 10_000;
        let now_ms = unsafe { GetTickCount64() };
        let uptime = if now_ms > create_ms {
            (now_ms - create_ms) / 1000
        } else {
            0
        };
        (cpu, uptime)
    } else {
        (0.0, 0u64)
    };

    // Exe path
    let exe_path = {
        let mut buf = [0u16; 520];
        let mut len = buf.len() as u32;
        if unsafe { QueryFullProcessImageNameW(h, 0, buf.as_mut_ptr(), &mut len) } != 0 {
            Some(String::from_utf16_lossy(&buf[..len as usize]))
        } else {
            None
        }
    };

    unsafe { windows_sys::Win32::Foundation::CloseHandle(h) };

    Some(ProcessDetail {
        exe_path,
        memory_bytes: mem_bytes,
        memory_mb: mem_bytes as f64 / (1024.0 * 1024.0),
        cpu_time_seconds: cpu_s,
        uptime_seconds: uptime_s,
    })
}

#[cfg(not(target_os = "windows"))]
fn process_detail_by_pid(pid: u32) -> Option<ProcessDetail> {
    let status = std::fs::read_to_string(format!("/proc/{}/status", pid)).ok()?;
    let mem_bytes: u64 = status
        .lines()
        .find(|l| l.starts_with("VmRSS:"))
        .and_then(|l| l.split_whitespace().nth(1))
        .and_then(|s| s.parse::<u64>().ok())
        .unwrap_or(0)
        * 1024;

    let exe_path = std::fs::read_link(format!("/proc/{}/exe", pid))
        .ok()
        .and_then(|p| p.to_str().map(|s| s.to_string()));

    // uptime from /proc/{pid}/stat starttime (jiffies since boot)
    let stat = std::fs::read_to_string(format!("/proc/{}/stat", pid)).ok()?;
    let fields: Vec<&str> = stat.split_whitespace().collect();
    let starttime: u64 = fields.get(21).and_then(|s| s.parse().ok()).unwrap_or(0);
    let clk_tck = 100u64; // typical
    let uptime_seconds = {
        let proc_uptime = std::fs::read_to_string("/proc/uptime")
            .ok()
            .and_then(|s| s.split_whitespace().next()?.parse::<f64>().ok())
            .unwrap_or(0.0);
        (proc_uptime as u64).saturating_sub(starttime / clk_tck)
    };

    // CPU time from /proc/{pid}/stat fields 13+14 (utime + stime in jiffies)
    let cpu_s = fields
        .get(13)
        .and_then(|s| s.parse::<u64>().ok())
        .unwrap_or(0)
        + fields
            .get(14)
            .and_then(|s| s.parse::<u64>().ok())
            .unwrap_or(0);
    let cpu_time_seconds = cpu_s as f64 / clk_tck as f64;

    Some(ProcessDetail {
        exe_path,
        memory_bytes: mem_bytes,
        memory_mb: mem_bytes as f64 / (1024.0 * 1024.0),
        cpu_time_seconds,
        uptime_seconds,
    })
}

// ── Port probing (batch) ─────────────────────────────────────────────

fn probe_ports_batch(ports: &[u16]) -> Vec<PortInfo> {
    if ports.is_empty() {
        return Vec::new();
    }

    let netstat_out = {
        let mut cmd = std::process::Command::new("netstat");
        cmd.args(["-ano", "-p", "TCP"]);
        cmd.stdout(std::process::Stdio::piped());
        cmd.stderr(std::process::Stdio::null());
        cmd_no_window(&mut cmd);
        cmd.output()
            .ok()
            .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
    };
    let stdout = netstat_out.unwrap_or_default();
    let mut results: Vec<PortInfo> = Vec::with_capacity(ports.len());

    for &port in ports {
        let mut found = false;
        for line in stdout.lines() {
            if line.contains(&format!(":{}", port)) && line.contains("LISTENING") {
                let pid_str = line.split_whitespace().last().unwrap_or("");
                let pid: Option<u32> = pid_str.parse().ok();
                let name = pid.and_then(|p| process_name_by_pid(p));
                let detail = pid.and_then(|p| process_detail_by_pid(p));
                results.push(PortInfo {
                    port,
                    listening: true,
                    pid,
                    process_name: name,
                    detail,
                });
                found = true;
                break;
            }
        }
        if !found {
            results.push(PortInfo {
                port,
                listening: false,
                pid: None,
                process_name: None,
                detail: None,
            });
        }
    }

    results
}

fn probe_port(port: u16) -> PortInfo {
    probe_ports_batch(&[port])
        .into_iter()
        .next()
        .unwrap_or(PortInfo {
            port,
            listening: false,
            pid: None,
            process_name: None,
            detail: None,
        })
}

// ── Kill ───────────────────────────────────────────────────────────

fn kill_by_pid(pid: u32) -> bool {
    #[cfg(target_os = "windows")]
    {
        use windows_sys::Win32::System::Threading::{
            OpenProcess, TerminateProcess, PROCESS_TERMINATE,
        };
        let h = unsafe { OpenProcess(PROCESS_TERMINATE, 0, pid) };
        if h == 0 {
            return false;
        }
        let ok = unsafe { TerminateProcess(h, 1) } != 0;
        unsafe { windows_sys::Win32::Foundation::CloseHandle(h) };
        ok
    }
    #[cfg(not(target_os = "windows"))]
    {
        let mut cmd = std::process::Command::new("kill");
        cmd.arg(pid.to_string());
        cmd_no_window(&mut cmd);
        cmd.status().map(|s| s.success()).unwrap_or(false)
    }
}

fn process_name_by_pid(pid: u32) -> Option<String> {
    #[cfg(target_os = "windows")]
    {
        use windows_sys::Win32::System::Threading::{
            OpenProcess, QueryFullProcessImageNameW, PROCESS_QUERY_LIMITED_INFORMATION,
        };
        let h = unsafe { OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, 0, pid) };
        if h == 0 {
            return None;
        }
        let mut buf = [0u16; 260];
        let mut len = buf.len() as u32;
        let ok = unsafe { QueryFullProcessImageNameW(h, 0, buf.as_mut_ptr(), &mut len) } != 0;
        unsafe { windows_sys::Win32::Foundation::CloseHandle(h) };
        if ok {
            let wide = String::from_utf16_lossy(&buf[..len as usize]);
            std::path::Path::new(&wide)
                .file_name()
                .and_then(|n| n.to_str())
                .map(|s| s.to_string())
        } else {
            None
        }
    }
    #[cfg(not(target_os = "windows"))]
    {
        std::fs::read_to_string(format!("/proc/{}/comm", pid))
            .ok()
            .map(|s| s.trim().to_string())
    }
}

// ── Process log discovery ───────────────────────────────────────────

/// Given a PID, find the most likely log file by detecting the service type
/// and scanning common log locations around the project root.
fn discover_process_logs(pid: u32) -> Option<ProcessLogInfo> {
    #[cfg(target_os = "windows")]
    {
        // Get command line via WMI (PowerShell)
        let cmdline = {
            let ps = format!(
                "Get-CimInstance Win32_Process -Filter 'ProcessId={pid}' | Select-Object -ExpandProperty CommandLine"
            );
            let mut cmd = std::process::Command::new("powershell.exe");
            cmd.args(["-NoProfile", "-Command", &ps]);
            cmd.stdout(std::process::Stdio::piped());
            cmd.stderr(std::process::Stdio::null());
            cmd_no_window(&mut cmd);
            cmd.output().ok().and_then(|o| {
                let s = String::from_utf8_lossy(&o.stdout).trim().to_string();
                if s.is_empty() {
                    None
                } else {
                    Some(s)
                }
            })
        };

        let cmdline = cmdline?;

        // Infer project root from the command line
        // Strategy: extract the first absolute path segment (e.g., D:\project\src\...)
        let project_root = infer_project_root(&cmdline)?;

        // Detect service type & log paths
        let (service_name, log_path) =
            if cmdline.contains("next") || cmdline.contains("start-server") {
                // Next.js: .next/dev/logs/*.log
                let candidate = project_root.join(".next").join("dev").join("logs");
                let log_file = find_largest_log(&candidate)?;
                ("Next.js".to_string(), log_file)
            } else if cmdline.contains("cargo")
                || cmdline.contains("target\\debug")
                || cmdline.contains("target/release")
            {
                // Rust: look for .log files near the binary
                let candidate = project_root.join("target");
                find_largest_log(&candidate)
                    .or_else(|| find_largest_log(&project_root.join("logs")))
                    .map(|p| ("Rust/Cargo".to_string(), p))?
            } else if cmdline.contains("python")
                || cmdline.contains("python3")
                || cmdline.contains(".py")
            {
                let candidate = project_root.join("logs");
                find_largest_log(&candidate)
                    .or_else(|| find_largest_log(&project_root))
                    .map(|p| ("Python".to_string(), p))?
            } else if cmdline.contains("node") {
                // Generic Node: look for .log files at project root
                let candidate = project_root.join("logs");
                find_largest_log(&candidate)
                    .or_else(|| find_largest_log(&project_root))
                    .map(|p| ("Node.js".to_string(), p))?
            } else {
                // Generic: any .log at project root
                find_largest_log(&project_root).map(|p| ("Unknown".to_string(), p))?
            };

        // Read tail of log file (last ~100 lines, max 50KB)
        let log_content = tail_file(&log_path, 100, 50_000)?;
        let log_size_bytes = std::fs::metadata(&log_path)
            .ok()
            .map(|m| m.len())
            .unwrap_or(0);

        Some(ProcessLogInfo {
            service_name,
            log_path: log_path.display().to_string(),
            log_content,
            log_size_bytes,
        })
    }

    #[cfg(not(target_os = "windows"))]
    {
        // Unix: read from /proc/PID/cmdline
        let cmdline = std::fs::read_to_string(format!("/proc/{}/cmdline", pid)).ok()?;
        let cmdline = cmdline.replace('\0', " ");

        let project_root = infer_project_root(&cmdline)?;

        let candidate = std::path::PathBuf::from(&project_root).join("logs");
        let log_file = find_largest_log(&candidate)
            .or_else(|| find_largest_log(&std::path::PathBuf::from(&project_root)))?;

        let log_path = log_file.display().to_string();
        let log_content = tail_file(&log_file, 100, 50_000)?;
        let log_size_bytes = std::fs::metadata(&log_file)
            .ok()
            .map(|m| m.len())
            .unwrap_or(0);

        Some(ProcessLogInfo {
            service_name: "Unix Process".to_string(),
            log_path,
            log_content,
            log_size_bytes,
        })
    }
}

/// Extract the project root directory from a command line string.
/// On Windows, looks for the first drive-qualified path segment like `D:\xxx\yyy`
fn infer_project_root(cmdline: &str) -> Option<std::path::PathBuf> {
    // Simple heuristic: find "X:\" and take the next 2 path segments
    if let Some(drive_end) = cmdline.find(":\\") {
        let start = drive_end.saturating_sub(1); // include the drive letter
        let after_drive = &cmdline[drive_end + 2..];
        // Take up to 3 segments after the drive
        let segments: Vec<&str> = after_drive.split('\\').filter(|s| !s.is_empty()).collect();
        let take = std::cmp::min(2, segments.len()); // at least drive + 1 dir
        if take > 0 {
            let root_end =
                drive_end + 2 + segments[..take].iter().fold(0, |acc, s| acc + s.len() + 1) - 1;
            let root = &cmdline[start..std::cmp::min(start + root_end, cmdline.len())];
            let path = std::path::PathBuf::from(root);
            if path.exists() {
                return Some(path);
            }
            // Try just the drive root
            let drive_root = std::path::PathBuf::from(&cmdline[start..drive_end + 3]);
            if drive_root.exists() {
                return Some(drive_root);
            }
        }
    }
    None
}

/// Scan a directory for the largest .log file (likely the main log).
fn find_largest_log(dir: &std::path::Path) -> Option<std::path::PathBuf> {
    if !dir.is_dir() {
        return None;
    }
    let mut best: Option<(std::path::PathBuf, u64)> = None;
    if let Ok(entries) = std::fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().map(|e| e == "log").unwrap_or(false) {
                if let Ok(meta) = path.metadata() {
                    let sz = meta.len();
                    if best.as_ref().map(|(_, s)| sz > *s).unwrap_or(true) {
                        best = Some((path, sz));
                    }
                }
            }
        }
    }
    // Also recurse one level (e.g., .next/dev/logs/)
    if best.is_none() {
        if let Ok(entries) = std::fs::read_dir(dir) {
            for entry in entries.flatten() {
                if let Ok(ft) = entry.file_type() {
                    if ft.is_dir() {
                        if let Some(found) = find_largest_log(&entry.path()) {
                            let sz = std::fs::metadata(&found).ok().map(|m| m.len()).unwrap_or(0);
                            best = Some((found, sz));
                            break;
                        }
                    }
                }
            }
        }
    }
    best.map(|(p, _)| p)
}

/// Read the last `max_lines` from a file, capped at `max_bytes`.
fn tail_file(path: &std::path::Path, max_lines: usize, max_bytes: usize) -> Option<String> {
    use std::io::{Read, Seek, SeekFrom};
    let mut f = std::fs::File::open(path).ok()?;
    let file_size = f.metadata().ok()?.len();

    if file_size == 0 {
        return Some(String::new());
    }

    // Read last chunk of file
    let read_start = if file_size > max_bytes as u64 {
        file_size - max_bytes as u64
    } else {
        0
    };
    f.seek(SeekFrom::Start(read_start)).ok()?;
    let mut buf = Vec::new();
    f.take(max_bytes as u64).read_to_end(&mut buf).ok()?;

    let text = String::from_utf8_lossy(&buf);
    // Skip partial first line if we started mid-file
    let lines: Vec<&str> = text.lines().collect();
    let skip_first = read_start > 0;
    let start_idx = if skip_first && lines.len() > 1 { 1 } else { 0 };
    let tail_lines: Vec<&str> = lines[start_idx..]
        .iter()
        .rev()
        .take(max_lines)
        .rev()
        .copied()
        .collect();

    Some(tail_lines.join("\n"))
}

// ── Tauri commands ──────────────────────────────────────────────────

#[tauri::command]
pub async fn dashboard_get_resource_usage() -> Result<ResourceUsage, String> {
    tokio::task::spawn_blocking(get_process_memory)
        .await
        .map_err(|error| format!("resource sampler failed: {error}"))
}

#[tauri::command]
pub async fn dashboard_probe_ports(ports: Vec<u16>) -> Result<Vec<PortInfo>, String> {
    tokio::task::spawn_blocking(move || probe_ports_batch(&ports))
        .await
        .map_err(|error| format!("port probe failed: {error}"))
}

#[tauri::command]
pub async fn dashboard_probe_port(port: u16) -> Result<PortInfo, String> {
    tokio::task::spawn_blocking(move || probe_port(port))
        .await
        .map_err(|error| format!("port probe failed: {error}"))
}

#[tauri::command]
pub fn dashboard_kill_port(port: u16) -> Result<bool, String> {
    let info = probe_port(port);
    if let Some(pid) = info.pid {
        if kill_by_pid(pid) {
            Ok(true)
        } else {
            Err(format!(
                "Failed to kill process PID {} on port {}",
                pid, port
            ))
        }
    } else {
        Err(format!("No process found listening on port {}", port))
    }
}

#[tauri::command]
pub fn dashboard_get_process_logs(pid: u32) -> Result<ProcessLogInfo, String> {
    discover_process_logs(pid).ok_or_else(|| format!("No log file found for PID {}", pid))
}

// ── Target-aware monitoring (US-018) ──────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ProcessIdentity {
    pub pid: u32,
    pub start_token: String,
    pub process_name: String,
    pub exe_path: Option<String>,
    pub command_line: Option<String>,
    pub working_dir: Option<String>,
    pub memory_bytes: u64,
    pub memory_mb: f64,
    pub cpu_time_seconds: f64,
    pub uptime_seconds: u64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitorSnapshot {
    pub monitor_id: String,
    pub service_port: u16,
    pub status: String,
    pub target_os: String,
    pub unverified_ssh: bool,
    pub listeners: Vec<ProcessIdentity>,
    pub error: Option<String>,
    pub last_checked_at: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitorTestResult {
    pub ok: bool,
    pub target_os: String,
    pub message: String,
    pub unverified_ssh: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LogSourceCandidate {
    pub id: String,
    pub label: String,
    pub confidence: u8,
    pub reason: String,
    pub requires_elevation: bool,
    pub source: LogSourceConfig,
}

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LogStreamRequest {
    pub monitor_id: String,
    pub source: LogSourceConfig,
    #[serde(default)]
    pub sudo_password: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LogStreamStarted {
    pub stream_id: String,
    pub source: LogSourceConfig,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct LogLineEvent {
    sequence: u64,
    stream: String,
    text: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct LogBatchEvent {
    stream_id: String,
    monitor_id: String,
    lines: Vec<LogLineEvent>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct LogStateEvent {
    stream_id: String,
    monitor_id: String,
    state: String,
    message: Option<String>,
    attempt: u8,
}

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KillProcessesRequest {
    pub monitor_id: String,
    pub processes: Vec<ProcessIdentity>,
    pub mode: String,
    #[serde(default)]
    pub sudo_password: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct KillProcessesResult {
    pub requested: Vec<u32>,
    pub stopped: Vec<u32>,
    pub still_listening: Vec<u32>,
    pub force_available: bool,
}

#[tauri::command]
pub async fn dashboard_list_monitors(
    state: State<'_, AppState>,
) -> Result<Vec<MonitorConfig>, String> {
    Ok(state.monitoring.list().await)
}

#[tauri::command]
pub async fn dashboard_upsert_monitor(
    state: State<'_, AppState>,
    monitor: MonitorConfig,
    secrets: Option<MonitorSecrets>,
) -> Result<MonitorSaveResult, String> {
    state
        .monitoring
        .upsert(monitor, secrets.unwrap_or_default())
        .await
}

#[tauri::command]
pub async fn dashboard_delete_monitor(
    state: State<'_, AppState>,
    monitor_id: String,
) -> Result<(), String> {
    state.monitoring.delete(&monitor_id).await
}

#[tauri::command]
pub async fn dashboard_test_monitor(
    state: State<'_, AppState>,
    mut monitor: MonitorConfig,
    secrets: Option<MonitorSecrets>,
) -> Result<MonitorTestResult, String> {
    normalize_and_validate(&mut monitor)?;
    if monitor.target_type == "local" {
        return Ok(MonitorTestResult {
            ok: true,
            target_os: local_os().to_string(),
            message: "Local monitoring is available".to_string(),
            unverified_ssh: false,
        });
    }
    let secrets = secrets.unwrap_or_default();
    let target_secret = secrets
        .target_secret
        .clone()
        .or_else(|| state.monitoring.secret(&monitor.id, "target"));
    let jump_secret = secrets
        .jump_secret
        .clone()
        .or_else(|| state.monitoring.secret(&monitor.id, "jump"));
    let route = SshRouteSession::connect(&monitor, target_secret, jump_secret).await?;
    let os = detect_remote_os(&route, &monitor.target_os).await?;
    Ok(MonitorTestResult {
        ok: true,
        target_os: os,
        message: "SSH route and target authentication succeeded".to_string(),
        unverified_ssh: true,
    })
}

#[tauri::command]
pub async fn dashboard_probe_monitors(
    state: State<'_, AppState>,
    monitor_ids: Option<Vec<String>>,
) -> Result<Vec<MonitorSnapshot>, String> {
    let selected: HashSet<String> = monitor_ids.unwrap_or_default().into_iter().collect();
    let monitors: Vec<MonitorConfig> = state
        .monitoring
        .list()
        .await
        .into_iter()
        .filter(|monitor| selected.is_empty() || selected.contains(&monitor.id))
        .collect();
    let (local_windows, remaining): (Vec<_>, Vec<_>) = monitors.into_iter().partition(|monitor| {
        monitor.target_type == "local"
            && local_os() == "windows"
            && (monitor.target_os == "auto" || monitor.target_os == "windows")
    });
    let manager = state.monitoring.clone();
    let mut snapshots = if local_windows.is_empty() {
        Vec::new()
    } else {
        probe_local_windows_monitors(local_windows).await
    };
    snapshots.extend(
        stream::iter(remaining)
            .map(|monitor| probe_monitor(manager.clone(), monitor))
            .buffer_unordered(4)
            .collect::<Vec<_>>()
            .await,
    );
    Ok(snapshots)
}

async fn probe_local_windows_monitors(monitors: Vec<MonitorConfig>) -> Vec<MonitorSnapshot> {
    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct WindowsBatchProbe {
        port: u16,
        listening: bool,
        #[serde(default)]
        listeners: Vec<ProcessIdentity>,
    }

    let ports = monitors
        .iter()
        .map(|monitor| monitor.service_port)
        .collect::<Vec<_>>();
    let result = run_local_capture("windows", &windows_probe_batch_script(&ports), None)
        .await
        .and_then(|output| {
            if output.exit_status != Some(0) {
                return Err(format!(
                    "Windows port batch probe failed: {}",
                    output.stderr.trim()
                ));
            }
            serde_json::from_str::<Vec<WindowsBatchProbe>>(output.stdout.trim())
                .map_err(|error| format!("Failed to parse Windows port batch probe: {error}"))
        });
    let checked_at = chrono::Utc::now().to_rfc3339();
    match result {
        Ok(probes) => {
            let mut by_port = probes
                .into_iter()
                .map(|probe| (probe.port, probe))
                .collect::<HashMap<_, _>>();
            monitors
                .into_iter()
                .map(|monitor| {
                    let probe = by_port.remove(&monitor.service_port);
                    let listening = probe.as_ref().map(|value| value.listening).unwrap_or(false);
                    let listeners = probe
                        .map(|value| dedupe_listeners(value.listeners))
                        .unwrap_or_default();
                    MonitorSnapshot {
                        monitor_id: monitor.id,
                        service_port: monitor.service_port,
                        status: if listening {
                            "listening"
                        } else {
                            "notListening"
                        }
                        .to_string(),
                        target_os: "windows".to_string(),
                        unverified_ssh: false,
                        listeners,
                        error: None,
                        last_checked_at: checked_at.clone(),
                    }
                })
                .collect()
        }
        Err(error) => monitors
            .into_iter()
            .map(|monitor| MonitorSnapshot {
                monitor_id: monitor.id,
                service_port: monitor.service_port,
                status: "unreachable".to_string(),
                target_os: "windows".to_string(),
                unverified_ssh: false,
                listeners: Vec::new(),
                error: Some(sanitize_monitor_error(&error)),
                last_checked_at: checked_at.clone(),
            })
            .collect(),
    }
}

async fn probe_monitor(manager: Arc<MonitorManager>, monitor: MonitorConfig) -> MonitorSnapshot {
    let checked_at = chrono::Utc::now().to_rfc3339();
    match probe_monitor_inner(&manager, &monitor).await {
        Ok((os, listening, listeners)) => MonitorSnapshot {
            monitor_id: monitor.id,
            service_port: monitor.service_port,
            status: if listening {
                "listening".to_string()
            } else {
                "notListening".to_string()
            },
            target_os: os,
            unverified_ssh: monitor.target_type == "ssh",
            listeners,
            error: None,
            last_checked_at: checked_at,
        },
        Err(error) => {
            let lower = error.to_ascii_lowercase();
            let status = if lower.contains("permission") || lower.contains("access is denied") {
                "permissionDenied"
            } else if lower.contains("unsupported") {
                "unsupported"
            } else {
                "unreachable"
            };
            MonitorSnapshot {
                monitor_id: monitor.id,
                service_port: monitor.service_port,
                status: status.to_string(),
                target_os: monitor.target_os,
                unverified_ssh: monitor.target_type == "ssh",
                listeners: Vec::new(),
                error: Some(sanitize_monitor_error(&error)),
                last_checked_at: checked_at,
            }
        }
    }
}

async fn probe_monitor_inner(
    manager: &MonitorManager,
    monitor: &MonitorConfig,
) -> Result<(String, bool, Vec<ProcessIdentity>), String> {
    if monitor.target_type == "local" {
        let os = if monitor.target_os == "auto" {
            local_os().to_string()
        } else {
            monitor.target_os.clone()
        };
        let output = run_probe_command_local(&os, monitor.service_port).await?;
        return parse_probe_output(&os, monitor.service_port, &output);
    }

    let route = SshRouteSession::connect(
        monitor,
        manager.secret(&monitor.id, "target"),
        manager.secret(&monitor.id, "jump"),
    )
    .await?;
    let os = if monitor.target_os != "auto" {
        monitor.target_os.clone()
    } else if let Some(cached) = manager.cached_os(&monitor.id).await {
        cached
    } else {
        let detected = detect_remote_os(&route, "auto").await?;
        manager.cache_os(&monitor.id, &detected).await;
        detected
    };
    let output = run_probe_command_remote(&route, &os, monitor.service_port).await?;
    parse_probe_output(&os, monitor.service_port, &output)
}

fn local_os() -> &'static str {
    #[cfg(target_os = "windows")]
    {
        "windows"
    }
    #[cfg(not(target_os = "windows"))]
    {
        "linux"
    }
}

async fn detect_remote_os(route: &SshRouteSession, requested: &str) -> Result<String, String> {
    if requested == "linux" || requested == "windows" {
        return Ok(requested.to_string());
    }
    let unix = route
        .exec_capture("sh -lc 'printf CLX_LINUX'", None)
        .await?;
    if unix.exit_status == Some(0) && unix.stdout.contains("CLX_LINUX") {
        return Ok("linux".to_string());
    }
    let script = "[Console]::Out.Write('CLX_WINDOWS')";
    let windows = route
        .exec_capture(&powershell_command(script), None)
        .await?;
    if windows.exit_status == Some(0) && windows.stdout.contains("CLX_WINDOWS") {
        return Ok("windows".to_string());
    }
    Err("Unsupported SSH target: neither POSIX sh nor Windows PowerShell is available".to_string())
}

fn windows_probe_script(port: u16) -> String {
    format!(
        r#"$ErrorActionPreference='SilentlyContinue'
$portNumber={port}
$ids=@()
if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {{
  $ids=@(Get-NetTCPConnection -State Listen -LocalPort $portNumber | ForEach-Object {{ [int]$_.OwningProcess }})
}}
if ($ids.Count -eq 0) {{
  $ids=@(netstat -ano -p tcp | ForEach-Object {{
    $parts=($_.Trim() -split '\s+')
    if ($parts.Count -ge 5 -and $parts[3] -eq 'LISTENING' -and $parts[1] -match (':'+$portNumber+'$')) {{ [int]$parts[4] }}
  }})
}}
$ids=@($ids | Sort-Object -Unique)
$items=@(foreach($processId in $ids) {{
  $p=Get-Process -Id $processId
  $c=Get-CimInstance Win32_Process -Filter ('ProcessId='+$processId)
  $start=''
  $uptime=0
  if ($p -and $p.StartTime) {{ $start=$p.StartTime.ToUniversalTime().Ticks.ToString(); $uptime=[math]::Max(0,[int]((Get-Date)-$p.StartTime).TotalSeconds) }}
  [pscustomobject]@{{
    pid=[int]$processId
    startToken=$start
    processName=if($p){{$p.ProcessName}}else{{'unknown'}}
    exePath=if($c){{$c.ExecutablePath}}else{{$null}}
    commandLine=if($c){{$c.CommandLine}}else{{$null}}
    workingDir=$null
    memoryBytes=if($p){{[uint64]$p.WorkingSet64}}else{{0}}
    memoryMb=if($p){{[double]$p.WorkingSet64/1MB}}else{{0}}
    cpuTimeSeconds=if($p){{[double]$p.CPU}}else{{0}}
    uptimeSeconds=[uint64]$uptime
  }}
}})
[pscustomobject]@{{port=$portNumber;listening=($ids.Count -gt 0);listeners=@($items)}} | ConvertTo-Json -Depth 5 -Compress"#
    )
}

fn windows_probe_batch_script(ports: &[u16]) -> String {
    let port_list = ports
        .iter()
        .map(u16::to_string)
        .collect::<Vec<_>>()
        .join(",");
    format!(
        r#"$ErrorActionPreference='SilentlyContinue'
$ports=@({port_list})
$owners=@{{}}
foreach($portNumber in $ports) {{ $owners[$portNumber]=@() }}
if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {{
  Get-NetTCPConnection -State Listen | ForEach-Object {{
    $portNumber=[int]$_.LocalPort
    if ($ports -contains $portNumber) {{ $owners[$portNumber]=@($owners[$portNumber])+[int]$_.OwningProcess }}
  }}
}} else {{
  netstat -ano -p tcp | ForEach-Object {{
    $parts=($_.Trim() -split '\s+')
    if ($parts.Count -ge 5 -and $parts[3] -eq 'LISTENING') {{
      $endpoint=$parts[1]
      foreach($portNumber in $ports) {{
        if ($endpoint -match (':'+$portNumber+'$')) {{ $owners[$portNumber]=@($owners[$portNumber])+[int]$parts[4] }}
      }}
    }}
  }}
}}
$allIds=@($owners.Values | ForEach-Object {{ $_ }} | Sort-Object -Unique)
$metadata=@{{}}
foreach($processId in $allIds) {{
  $p=Get-Process -Id $processId
  $c=Get-CimInstance Win32_Process -Filter ('ProcessId='+$processId)
  $start=''
  $uptime=0
  if ($p -and $p.StartTime) {{ $start=$p.StartTime.ToUniversalTime().Ticks.ToString(); $uptime=[math]::Max(0,[int]((Get-Date)-$p.StartTime).TotalSeconds) }}
  $metadata[$processId]=[pscustomobject]@{{
    pid=[int]$processId
    startToken=$start
    processName=if($p){{$p.ProcessName}}else{{'unknown'}}
    exePath=if($c){{$c.ExecutablePath}}else{{$null}}
    commandLine=if($c){{$c.CommandLine}}else{{$null}}
    workingDir=$null
    memoryBytes=if($p){{[uint64]$p.WorkingSet64}}else{{0}}
    memoryMb=if($p){{[double]$p.WorkingSet64/1MB}}else{{0}}
    cpuTimeSeconds=if($p){{[double]$p.CPU}}else{{0}}
    uptimeSeconds=[uint64]$uptime
  }}
}}
$results=@(foreach($portNumber in $ports) {{
  $ids=@($owners[$portNumber] | Sort-Object -Unique)
  $items=@(foreach($processId in $ids) {{ $metadata[$processId] }})
  [pscustomobject]@{{port=[int]$portNumber;listening=($ids.Count -gt 0);listeners=@($items)}}
}})
ConvertTo-Json -InputObject @($results) -Depth 5 -Compress"#
    )
}

fn linux_listener_command() -> &'static str {
    "LC_ALL=C sh -lc 'if command -v ss >/dev/null 2>&1; then ss -H -ltnp; elif command -v lsof >/dev/null 2>&1; then lsof -nP -iTCP -sTCP:LISTEN -Fpn; elif command -v netstat >/dev/null 2>&1; then netstat -lntp; else exit 127; fi'"
}

fn linux_metadata_command(pids: &[u32]) -> String {
    let pid_list = pids
        .iter()
        .map(u32::to_string)
        .collect::<Vec<_>>()
        .join(" ");
    format!(
        "LC_ALL=C sh -lc 'clk=$(getconf CLK_TCK 2>/dev/null || printf 100); for p in {pid_list}; do [ -r /proc/$p/stat ] || continue; raw=$(cat /proc/$p/stat); rest=${{raw#*) }}; start=$(printf %s \"$rest\" | awk \"{{print \\$20}}\"); ticks=$(printf %s \"$rest\" | awk \"{{print \\$12+\\$13}}\"); name=$(cat /proc/$p/comm 2>/dev/null | tr \"\\t\\r\\n\" \"   \" ); exe=$(readlink /proc/$p/exe 2>/dev/null | tr \"\\t\\r\\n\" \"   \" ); cwd=$(readlink /proc/$p/cwd 2>/dev/null | tr \"\\t\\r\\n\" \"   \" ); cmd=$(tr \"\\000\\t\\r\\n\" \"    \" </proc/$p/cmdline 2>/dev/null); rss=$(awk \"/VmRSS:/ {{print \\$2*1024}}\" /proc/$p/status 2>/dev/null); up=$(ps -o etimes= -p $p 2>/dev/null | tr -d \" \" ); cpu=$(awk -v t=$ticks -v c=$clk \"BEGIN {{ if(c>0) printf \\\"%.3f\\\", t/c; else print 0 }}\"); printf \"CLXPROC\\t%s\\t%s\\t%s\\t%s\\t%s\\t%s\\t%s\\t%s\\t%s\\n\" \"$p\" \"$start\" \"$name\" \"$exe\" \"$cmd\" \"$cwd\" \"${{rss:-0}}\" \"$cpu\" \"${{up:-0}}\"; done'"
    )
}

async fn run_probe_command_local(os: &str, port: u16) -> Result<CommandOutput, String> {
    if os == "windows" {
        run_local_capture(os, &windows_probe_script(port), None).await
    } else {
        let listeners = run_local_capture(os, linux_listener_command(), None).await?;
        finish_linux_probe_local(port, listeners).await
    }
}

async fn run_probe_command_remote(
    route: &SshRouteSession,
    os: &str,
    port: u16,
) -> Result<CommandOutput, String> {
    if os == "windows" {
        route
            .exec_capture(&powershell_command(&windows_probe_script(port)), None)
            .await
    } else {
        let listeners = route.exec_capture(linux_listener_command(), None).await?;
        finish_linux_probe_remote(route, port, listeners).await
    }
}

async fn finish_linux_probe_local(
    port: u16,
    mut listeners: CommandOutput,
) -> Result<CommandOutput, String> {
    let (is_listening, pids) = linux_listener_pids(port, &listeners.stdout);
    if !is_listening || pids.is_empty() {
        listeners.stderr = format!("CLXLISTENING={}\n{}", is_listening, listeners.stderr);
        return Ok(listeners);
    }
    let metadata = run_local_capture("linux", &linux_metadata_command(&pids), None).await?;
    listeners.stdout.push('\n');
    listeners.stdout.push_str(&metadata.stdout);
    listeners.stderr = format!("CLXLISTENING=true\n{}{}", listeners.stderr, metadata.stderr);
    Ok(listeners)
}

async fn finish_linux_probe_remote(
    route: &SshRouteSession,
    port: u16,
    mut listeners: CommandOutput,
) -> Result<CommandOutput, String> {
    let (is_listening, pids) = linux_listener_pids(port, &listeners.stdout);
    if !is_listening || pids.is_empty() {
        listeners.stderr = format!("CLXLISTENING={}\n{}", is_listening, listeners.stderr);
        return Ok(listeners);
    }
    let metadata = route
        .exec_capture(&linux_metadata_command(&pids), None)
        .await?;
    listeners.stdout.push('\n');
    listeners.stdout.push_str(&metadata.stdout);
    listeners.stderr = format!("CLXLISTENING=true\n{}{}", listeners.stderr, metadata.stderr);
    Ok(listeners)
}

fn linux_listener_pids(port: u16, output: &str) -> (bool, Vec<u32>) {
    let mut listening = false;
    let mut pids = HashSet::new();
    let mut lsof_pid = None;
    for line in output.lines() {
        if let Some(value) = line.strip_prefix('p') {
            lsof_pid = value.parse::<u32>().ok();
            continue;
        }
        if let Some(endpoint) = line.strip_prefix('n') {
            if endpoint_port(endpoint) == Some(port) {
                listening = true;
                if let Some(pid) = lsof_pid {
                    pids.insert(pid);
                }
            }
            continue;
        }
        let fields: Vec<&str> = line.split_whitespace().collect();
        let local = if fields.first() == Some(&"LISTEN") {
            fields.get(3).copied()
        } else if fields.first().is_some_and(|value| value.starts_with("tcp")) {
            fields.get(3).copied()
        } else {
            None
        };
        let Some(local) = local else { continue };
        if endpoint_port(local) != Some(port) {
            continue;
        }
        listening = true;
        if let Some(index) = line.find("pid=") {
            let digits: String = line[index + 4..]
                .chars()
                .take_while(|value| value.is_ascii_digit())
                .collect();
            if let Ok(pid) = digits.parse::<u32>() {
                pids.insert(pid);
            }
        } else {
            for field in fields.iter().rev() {
                if let Some((pid, _)) = field.split_once('/') {
                    if let Ok(pid) = pid.parse::<u32>() {
                        pids.insert(pid);
                        break;
                    }
                }
            }
        }
    }
    let mut pids: Vec<u32> = pids.into_iter().collect();
    pids.sort_unstable();
    (listening, pids)
}

fn endpoint_port(endpoint: &str) -> Option<u16> {
    endpoint
        .trim_end_matches(']')
        .rsplit_once(':')
        .and_then(|(_, value)| value.parse::<u16>().ok())
}

fn parse_probe_output(
    os: &str,
    port: u16,
    output: &CommandOutput,
) -> Result<(String, bool, Vec<ProcessIdentity>), String> {
    if os == "windows" {
        if output.exit_status != Some(0) {
            return Err(format!(
                "Windows port probe failed: {}",
                output.stderr.trim()
            ));
        }
        #[derive(Deserialize)]
        #[serde(rename_all = "camelCase")]
        struct WindowsProbe {
            listening: bool,
            #[serde(default)]
            listeners: Vec<ProcessIdentity>,
        }
        let parsed: WindowsProbe = serde_json::from_str(output.stdout.trim())
            .map_err(|error| format!("Failed to parse Windows port probe: {error}"))?;
        return Ok((
            "windows".to_string(),
            parsed.listening,
            dedupe_listeners(parsed.listeners),
        ));
    }

    if output.exit_status == Some(127) {
        return Err("Unsupported Linux target: ss, lsof, and netstat are unavailable".to_string());
    }
    let listening = output
        .stderr
        .lines()
        .any(|line| line == "CLXLISTENING=true")
        || linux_listener_pids(port, &output.stdout).0;
    let mut listeners = Vec::new();
    for line in output
        .stdout
        .lines()
        .filter(|line| line.starts_with("CLXPROC\t"))
    {
        let fields: Vec<&str> = line.split('\t').collect();
        if fields.len() < 10 {
            continue;
        }
        let pid = fields[1].parse::<u32>().unwrap_or(0);
        if pid == 0 {
            continue;
        }
        let memory_bytes = fields[7].parse::<u64>().unwrap_or(0);
        listeners.push(ProcessIdentity {
            pid,
            start_token: fields[2].to_string(),
            process_name: fields[3].to_string(),
            exe_path: nonempty(fields[4]),
            command_line: nonempty(fields[5]),
            working_dir: nonempty(fields[6]),
            memory_bytes,
            memory_mb: memory_bytes as f64 / (1024.0 * 1024.0),
            cpu_time_seconds: fields[8].parse::<f64>().unwrap_or(0.0),
            uptime_seconds: fields[9].parse::<u64>().unwrap_or(0),
        });
    }
    Ok(("linux".to_string(), listening, dedupe_listeners(listeners)))
}

fn nonempty(value: &str) -> Option<String> {
    let value = value.trim();
    (!value.is_empty()).then(|| value.to_string())
}

fn dedupe_listeners(listeners: Vec<ProcessIdentity>) -> Vec<ProcessIdentity> {
    let mut seen = HashSet::new();
    listeners
        .into_iter()
        .filter(|listener| seen.insert((listener.pid, listener.start_token.clone())))
        .collect()
}

fn powershell_command(script: &str) -> String {
    let utf16: Vec<u8> = script.encode_utf16().flat_map(u16::to_le_bytes).collect();
    let encoded = base64::engine::general_purpose::STANDARD.encode(utf16);
    format!("powershell.exe -NoLogo -NoProfile -NonInteractive -EncodedCommand {encoded}")
}

async fn run_local_capture(
    os: &str,
    command: &str,
    stdin: Option<&[u8]>,
) -> Result<CommandOutput, String> {
    let mut process = if os == "windows" {
        let mut process = tokio::process::Command::new("powershell.exe");
        let utf16: Vec<u8> = command.encode_utf16().flat_map(u16::to_le_bytes).collect();
        let encoded = base64::engine::general_purpose::STANDARD.encode(utf16);
        process.args([
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-EncodedCommand",
            &encoded,
        ]);
        #[cfg(target_os = "windows")]
        {
            use std::os::windows::process::CommandExt;
            process.as_std_mut().creation_flags(0x08000000);
        }
        process
    } else {
        let mut process = tokio::process::Command::new("sh");
        process.args(["-lc", command]);
        process
    };
    process.stdout(Stdio::piped()).stderr(Stdio::piped());
    if stdin.is_some() {
        process.stdin(Stdio::piped());
    }
    let mut child = process
        .spawn()
        .map_err(|error| format!("Failed to run local monitoring command: {error}"))?;
    if let Some(input) = stdin {
        if let Some(mut writer) = child.stdin.take() {
            writer
                .write_all(input)
                .await
                .map_err(|error| format!("Failed to send local command input: {error}"))?;
        }
    }
    let output = tokio::time::timeout(Duration::from_secs(10), child.wait_with_output())
        .await
        .map_err(|_| "Local monitoring command timed out".to_string())?
        .map_err(|error| format!("Failed to read local monitoring command: {error}"))?;
    Ok(CommandOutput {
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
        exit_status: output.status.code().map(|value| value as u32),
    })
}

fn sanitize_monitor_error(error: &str) -> String {
    let trimmed = error.trim();
    let mut chars = trimmed.chars();
    let prefix: String = chars.by_ref().take(500).collect();
    if chars.next().is_some() {
        format!("{prefix}…")
    } else {
        prefix
    }
}

#[tauri::command]
pub async fn dashboard_discover_log_sources(
    state: State<'_, AppState>,
    monitor_id: String,
    pid: u32,
) -> Result<Vec<LogSourceCandidate>, String> {
    let monitor = state
        .monitoring
        .get(&monitor_id)
        .await
        .ok_or_else(|| format!("Monitor '{monitor_id}' was not found"))?;
    discover_log_sources(state.monitoring.clone(), &monitor, pid).await
}

async fn discover_log_sources(
    manager: Arc<MonitorManager>,
    monitor: &MonitorConfig,
    pid: u32,
) -> Result<Vec<LogSourceCandidate>, String> {
    if monitor.log_source.kind != "auto" {
        return Ok(vec![LogSourceCandidate {
            id: "configured".to_string(),
            label: "Configured log source".to_string(),
            confidence: 100,
            reason: "Saved on this monitor".to_string(),
            requires_elevation: false,
            source: monitor.log_source.clone(),
        }]);
    }

    let (os, output) = if monitor.target_type == "local" {
        let os = if monitor.target_os == "auto" {
            local_os().to_string()
        } else {
            monitor.target_os.clone()
        };
        let command = log_discovery_command(&os, pid, monitor.service_port);
        let output = run_local_capture(&os, &command, None).await?;
        (os, output)
    } else {
        let route = SshRouteSession::connect(
            monitor,
            manager.secret(&monitor.id, "target"),
            manager.secret(&monitor.id, "jump"),
        )
        .await?;
        let os = if monitor.target_os == "auto" {
            detect_remote_os(&route, "auto").await?
        } else {
            monitor.target_os.clone()
        };
        let command = if os == "windows" {
            powershell_command(&log_discovery_command(&os, pid, monitor.service_port))
        } else {
            log_discovery_command(&os, pid, monitor.service_port)
        };
        let output = route.exec_capture(&command, None).await?;
        (os, output)
    };
    parse_log_candidates(&os, &output.stdout)
}

fn log_discovery_command(os: &str, pid: u32, port: u16) -> String {
    if os == "windows" {
        return format!(
            r#"$processId={pid}
$service=Get-CimInstance Win32_Service -Filter ('ProcessId='+$processId) -ErrorAction SilentlyContinue | Select-Object -First 1
if($service){{"CLXSOURCE`tservice`t$($service.Name)"}}
$proc=Get-CimInstance Win32_Process -Filter ('ProcessId='+$processId) -ErrorAction SilentlyContinue
if($proc -and $proc.ExecutablePath){{
  $dir=Split-Path -Parent $proc.ExecutablePath
  Get-ChildItem -LiteralPath $dir -Filter *.log -File -Recurse -Depth 2 -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTimeUtc -Descending | Select-Object -First 5 | ForEach-Object {{"CLXSOURCE`tfile`t$($_.FullName)"}}
}}"#
        );
    }
    format!(
        "LC_ALL=C sh -lc 'unit=$(grep -o \"[^/]*[.]service\" /proc/{pid}/cgroup 2>/dev/null | tail -n 1); [ -n \"$unit\" ] && printf \"CLXSOURCE\\tservice\\t%s\\n\" \"$unit\"; for fd in 1 2; do path=$(readlink /proc/{pid}/fd/$fd 2>/dev/null); [ -f \"$path\" ] && printf \"CLXSOURCE\\tfile\\t%s\\n\" \"$path\"; done; cwd=$(readlink /proc/{pid}/cwd 2>/dev/null); [ -n \"$cwd\" ] && find \"$cwd/logs\" \"$cwd\" -maxdepth 2 -type f -name \"*.log\" -printf \"%T@\\t%p\\n\" 2>/dev/null | sort -nr | head -n 5 | cut -f2- | sed \"s/^/CLXSOURCE\\tfile\\t/\"; for engine in docker podman; do command -v $engine >/dev/null 2>&1 || continue; $engine ps --format \"{{{{.ID}}}}\\t{{{{.Names}}}}\\t{{{{.Ports}}}}\" 2>/dev/null | grep -E \"(^|[^0-9]){port}->\" | head -n 2 | while IFS= read -r row; do printf \"CLXSOURCE\\tcontainer\\t%s\\t%s\\n\" \"$engine\" \"$row\"; done; done'"
    )
}

fn parse_log_candidates(os: &str, output: &str) -> Result<Vec<LogSourceCandidate>, String> {
    let mut candidates = Vec::new();
    let mut seen = HashSet::new();
    for line in output.lines() {
        let fields: Vec<&str> = line.split('\t').collect();
        if fields.first() != Some(&"CLXSOURCE") || fields.len() < 3 {
            continue;
        }
        match fields[1] {
            "service" if os == "linux" => {
                let unit = fields[2].trim();
                if !safe_identifier(unit) || !seen.insert(format!("systemd:{unit}")) {
                    continue;
                }
                candidates.push(LogSourceCandidate {
                    id: format!("systemd:{unit}"),
                    label: format!("systemd · {unit}"),
                    confidence: 95,
                    reason: "Process cgroup maps to this systemd unit".to_string(),
                    requires_elevation: false,
                    source: LogSourceConfig {
                        kind: "systemd".to_string(),
                        unit: Some(unit.to_string()),
                        ..Default::default()
                    },
                });
            }
            "service" if os == "windows" => {
                let provider = fields[2].trim();
                if !seen.insert(format!("event:{provider}")) {
                    continue;
                }
                candidates.push(LogSourceCandidate {
                    id: format!("event:{provider}"),
                    label: format!("Windows Event Log · {provider}"),
                    confidence: 80,
                    reason: "Listener PID maps to this Windows service".to_string(),
                    requires_elevation: false,
                    source: LogSourceConfig {
                        kind: "windowsEvent".to_string(),
                        log_name: Some("Application".to_string()),
                        provider: Some(provider.to_string()),
                        ..Default::default()
                    },
                });
            }
            "file" => {
                let path = fields[2].trim();
                if path.is_empty() || !seen.insert(format!("file:{path}")) {
                    continue;
                }
                candidates.push(LogSourceCandidate {
                    id: format!("file:{path}"),
                    label: path.to_string(),
                    confidence: if candidates.is_empty() { 90 } else { 65 },
                    reason: "Readable process output or recently modified log file".to_string(),
                    requires_elevation: false,
                    source: LogSourceConfig {
                        kind: "file".to_string(),
                        path: Some(path.to_string()),
                        ..Default::default()
                    },
                });
            }
            "container" if fields.len() >= 5 => {
                let engine = fields[2].trim();
                let id = fields[3].trim();
                let name = fields[4].trim();
                if !safe_identifier(engine)
                    || !safe_identifier(id)
                    || !seen.insert(format!("{engine}:{id}"))
                {
                    continue;
                }
                candidates.push(LogSourceCandidate {
                    id: format!("{engine}:{id}"),
                    label: format!("{engine} · {name}"),
                    confidence: 98,
                    reason: "Container publishes the monitored TCP port".to_string(),
                    requires_elevation: false,
                    source: LogSourceConfig {
                        kind: "container".to_string(),
                        engine: Some(engine.to_string()),
                        container: Some(id.to_string()),
                        ..Default::default()
                    },
                });
            }
            _ => {}
        }
    }
    candidates.sort_by(|left, right| right.confidence.cmp(&left.confidence));
    Ok(candidates)
}

fn safe_identifier(value: &str) -> bool {
    !value.is_empty()
        && value
            .chars()
            .all(|character| character.is_ascii_alphanumeric() || "._@:-".contains(character))
}

fn posix_quote(value: &str) -> String {
    format!("'{}'", value.replace('\'', "'\"'\"'"))
}

fn powershell_quote(value: &str) -> String {
    format!("'{}'", value.replace('\'', "''"))
}

fn log_follow_command(os: &str, source: &LogSourceConfig) -> Result<String, String> {
    match source.kind.as_str() {
        "file" => {
            let path = source
                .path
                .as_deref()
                .ok_or_else(|| "Log path is missing".to_string())?;
            if os == "windows" {
                Ok(format!(
                    "Get-Content -LiteralPath {} -Tail 200 -Wait -ErrorAction Stop",
                    powershell_quote(path)
                ))
            } else {
                Ok(format!("tail -n 200 -F -- {}", posix_quote(path)))
            }
        }
        "systemd" if os == "linux" => {
            let unit = source
                .unit
                .as_deref()
                .ok_or_else(|| "systemd unit is missing".to_string())?;
            if !safe_identifier(unit) {
                return Err("systemd unit contains unsupported characters".to_string());
            }
            Ok(format!(
                "journalctl -u {} -n 200 -f --no-pager -o short-iso",
                posix_quote(unit)
            ))
        }
        "container" if os == "linux" => {
            let engine = source
                .engine
                .as_deref()
                .ok_or_else(|| "Container engine is missing".to_string())?;
            let container = source
                .container
                .as_deref()
                .ok_or_else(|| "Container ID is missing".to_string())?;
            if !matches!(engine, "docker" | "podman") || !safe_identifier(container) {
                return Err("Invalid container log source".to_string());
            }
            Ok(format!(
                "{engine} logs --tail 200 -f --timestamps {}",
                posix_quote(container)
            ))
        }
        "windowsEvent" if os == "windows" => {
            let log_name = source.log_name.as_deref().unwrap_or("Application");
            let provider_filter = source
                .provider
                .as_deref()
                .map(|provider| {
                    format!(
                        " | Where-Object {{$_.ProviderName -eq {}}}",
                        powershell_quote(provider)
                    )
                })
                .unwrap_or_default();
            Ok(format!(
                "$last=0; while($true){{$events=@(Get-WinEvent -LogName {} -MaxEvents 200 -ErrorAction SilentlyContinue{} | Sort-Object RecordId); foreach($event in $events){{if($event.RecordId -gt $last){{$last=$event.RecordId; '[{{0:o}}] [{{1}}] {{2}}' -f $event.TimeCreated,$event.LevelDisplayName,$event.Message}}}}; Start-Sleep -Seconds 2}}",
                powershell_quote(log_name), provider_filter
            ))
        }
        "custom" => source
            .command
            .as_ref()
            .filter(|command| !command.trim().is_empty())
            .cloned()
            .ok_or_else(|| "Custom follow command is missing".to_string()),
        _ => Err(format!(
            "Log source '{}' is not supported on {os}",
            source.kind
        )),
    }
}

#[tauri::command]
pub async fn dashboard_start_log_stream(
    app: AppHandle,
    state: State<'_, AppState>,
    mut request: LogStreamRequest,
) -> Result<LogStreamStarted, String> {
    let monitor = state
        .monitoring
        .get(&request.monitor_id)
        .await
        .ok_or_else(|| format!("Monitor '{}' was not found", request.monitor_id))?;
    let os = if monitor.target_os == "auto" {
        if monitor.target_type == "local" {
            local_os().to_string()
        } else if let Some(cached) = state.monitoring.cached_os(&monitor.id).await {
            cached
        } else {
            let route = SshRouteSession::connect(
                &monitor,
                state.monitoring.secret(&monitor.id, "target"),
                state.monitoring.secret(&monitor.id, "jump"),
            )
            .await?;
            let detected = detect_remote_os(&route, "auto").await?;
            state.monitoring.cache_os(&monitor.id, &detected).await;
            detected
        }
    } else {
        monitor.target_os.clone()
    };

    if request.source.kind == "auto" {
        let snapshot = probe_monitor_inner(&state.monitoring, &monitor).await?;
        let pid = snapshot
            .2
            .first()
            .map(|listener| listener.pid)
            .ok_or_else(|| {
                "No listener PID is available for automatic log discovery".to_string()
            })?;
        let candidates = discover_log_sources(state.monitoring.clone(), &monitor, pid).await?;
        let high_confidence: Vec<&LogSourceCandidate> = candidates
            .iter()
            .filter(|candidate| candidate.confidence >= 90)
            .collect();
        if high_confidence.len() != 1 {
            return Err(
                "Automatic log discovery is ambiguous; select a log source first".to_string(),
            );
        }
        request.source = high_confidence[0].source.clone();
    }

    let base_command = log_follow_command(&os, &request.source)?;
    let (command, mut stdin) = with_optional_sudo(&os, &base_command, request.sudo_password.take());
    let stream_id = uuid::Uuid::new_v4().to_string();
    let token = state
        .monitoring
        .register_stream(stream_id.clone(), &monitor.id)
        .await;
    let manager = state.monitoring.clone();
    let task_stream_id = stream_id.clone();
    let task_monitor_id = monitor.id.clone();
    let is_custom = request.source.kind == "custom";

    tauri::async_runtime::spawn(async move {
        let cleanup_manager = manager.clone();
        let (log_sender, log_receiver) = mpsc::unbounded_channel();
        let emit_task = tauri::async_runtime::spawn(emit_log_batches(
            app.clone(),
            task_stream_id.clone(),
            task_monitor_id.clone(),
            log_receiver,
        ));
        let _ = emit_log_state(
            &app,
            &task_stream_id,
            &task_monitor_id,
            "connecting",
            None,
            0,
        );
        if monitor.target_type == "local" {
            stream_local_logs(
                app,
                task_stream_id.clone(),
                task_monitor_id.clone(),
                os,
                command,
                stdin.take(),
                token,
                log_sender.clone(),
            )
            .await;
        } else {
            stream_remote_logs(
                app,
                manager,
                monitor,
                task_stream_id.clone(),
                task_monitor_id.clone(),
                os,
                command,
                stdin.take(),
                is_custom,
                token,
                log_sender.clone(),
            )
            .await;
        }
        drop(log_sender);
        let _ = emit_task.await;
        cleanup_manager.stop_stream(&task_stream_id).await;
    });

    Ok(LogStreamStarted {
        stream_id,
        source: request.source,
    })
}

fn with_optional_sudo(
    os: &str,
    command: &str,
    sudo_password: Option<String>,
) -> (String, Option<Vec<u8>>) {
    if os != "linux" {
        return (command.to_string(), None);
    }
    if let Some(mut password) = sudo_password {
        if !password.is_empty() {
            let input = format!("{password}\n").into_bytes();
            password.zeroize();
            return (
                format!("sudo -S -p '' sh -lc {}", posix_quote(command)),
                Some(input),
            );
        }
        password.zeroize();
    }
    (command.to_string(), None)
}

async fn stream_local_logs(
    app: AppHandle,
    stream_id: String,
    monitor_id: String,
    os: String,
    command: String,
    stdin: Option<Vec<u8>>,
    token: tokio_util::sync::CancellationToken,
    log_sender: mpsc::UnboundedSender<LogLineEvent>,
) {
    let mut process = if os == "windows" {
        let mut process = tokio::process::Command::new("powershell.exe");
        let utf16: Vec<u8> = command.encode_utf16().flat_map(u16::to_le_bytes).collect();
        let encoded = base64::engine::general_purpose::STANDARD.encode(utf16);
        process.args([
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-EncodedCommand",
            &encoded,
        ]);
        #[cfg(target_os = "windows")]
        {
            use std::os::windows::process::CommandExt;
            process.as_std_mut().creation_flags(0x08000000);
        }
        process
    } else {
        let mut process = tokio::process::Command::new("sh");
        process.args(["-lc", &command]);
        process
    };
    process.stdout(Stdio::piped()).stderr(Stdio::piped());
    if stdin.is_some() {
        process.stdin(Stdio::piped());
    }
    let mut child = match process.spawn() {
        Ok(child) => child,
        Err(error) => {
            let _ = emit_log_state(
                &app,
                &stream_id,
                &monitor_id,
                "error",
                Some(error.to_string()),
                0,
            );
            return;
        }
    };
    if let Some(mut input) = stdin {
        if let Some(mut writer) = child.stdin.take() {
            let _ = writer.write_all(&input).await;
        }
        input.zeroize();
    }
    let stdout = child.stdout.take();
    let stderr = child.stderr.take();
    let _ = emit_log_state(&app, &stream_id, &monitor_id, "following", None, 0);
    let mut stdout_lines = stdout.map(|value| BufReader::new(value).lines());
    let mut stderr_lines = stderr.map(|value| BufReader::new(value).lines());
    let mut sequence = 0u64;
    loop {
        tokio::select! {
            _ = token.cancelled() => {
                let _ = child.kill().await;
                let _ = emit_log_state(&app, &stream_id, &monitor_id, "stopped", None, 0);
                break;
            }
            line = async {
                if let Some(lines) = stdout_lines.as_mut() { lines.next_line().await } else { std::future::pending().await }
            } => {
                match line {
                    Ok(Some(line)) => { sequence += 1; queue_log_line(&log_sender, sequence, "stdout", line); }
                    Ok(None) => { stdout_lines = None; }
                    Err(error) => { let _ = emit_log_state(&app, &stream_id, &monitor_id, "error", Some(error.to_string()), 0); break; }
                }
            }
            line = async {
                if let Some(lines) = stderr_lines.as_mut() { lines.next_line().await } else { std::future::pending().await }
            } => {
                match line {
                    Ok(Some(line)) => { sequence += 1; queue_log_line(&log_sender, sequence, "stderr", line); }
                    Ok(None) => { stderr_lines = None; }
                    Err(error) => { let _ = emit_log_state(&app, &stream_id, &monitor_id, "error", Some(error.to_string()), 0); break; }
                }
            }
            status = child.wait() => {
                let message = status.ok().map(|value| format!("Log command exited with {value}"));
                let _ = emit_log_state(&app, &stream_id, &monitor_id, "ended", message, 0);
                break;
            }
        }
    }
}

#[allow(clippy::too_many_arguments)]
async fn stream_remote_logs(
    app: AppHandle,
    manager: Arc<MonitorManager>,
    monitor: MonitorConfig,
    stream_id: String,
    monitor_id: String,
    _os: String,
    command: String,
    mut stdin: Option<Vec<u8>>,
    is_custom: bool,
    token: tokio_util::sync::CancellationToken,
    log_sender: mpsc::UnboundedSender<LogLineEvent>,
) {
    let delays = [1u64, 2, 5, 10, 30];
    let mut sequence = 0u64;
    let requires_sudo = stdin.is_some();
    for (index, delay) in delays.iter().enumerate() {
        if token.is_cancelled() {
            break;
        }
        let attempt = index as u8 + 1;
        let _ = emit_log_state(&app, &stream_id, &monitor_id, "connecting", None, attempt);
        let route = match SshRouteSession::connect(
            &monitor,
            manager.secret(&monitor.id, "target"),
            manager.secret(&monitor.id, "jump"),
        )
        .await
        {
            Ok(route) => route,
            Err(error) => {
                let _ = emit_log_state(
                    &app,
                    &stream_id,
                    &monitor_id,
                    "reconnecting",
                    Some(sanitize_monitor_error(&error)),
                    attempt,
                );
                tokio::select! { _ = token.cancelled() => break, _ = tokio::time::sleep(Duration::from_secs(*delay)) => {} }
                continue;
            }
        };
        let input = stdin.as_deref();
        let mut channel = match route.open_exec_channel(&command, input).await {
            Ok(channel) => channel,
            Err(error) => {
                let _ = emit_log_state(
                    &app,
                    &stream_id,
                    &monitor_id,
                    "reconnecting",
                    Some(sanitize_monitor_error(&error)),
                    attempt,
                );
                tokio::select! { _ = token.cancelled() => break, _ = tokio::time::sleep(Duration::from_secs(*delay)) => {} }
                continue;
            }
        };
        if let Some(input) = stdin.as_mut() {
            input.zeroize();
        }
        stdin = None;
        let _ = emit_log_state(&app, &stream_id, &monitor_id, "following", None, attempt);
        let mut ended_cleanly = false;
        loop {
            tokio::select! {
                _ = token.cancelled() => {
                    let _ = channel.close().await;
                    let _ = emit_log_state(&app, &stream_id, &monitor_id, "stopped", None, attempt);
                    return;
                }
                message = channel.wait() => {
                    match message {
                        Some(clx_ssh_client::ChannelMsg::Data { data }) => {
                            for line in String::from_utf8_lossy(&data).lines() {
                                sequence += 1;
                                queue_log_line(&log_sender, sequence, "stdout", line.to_string());
                            }
                        }
                        Some(clx_ssh_client::ChannelMsg::ExtendedData { data, .. }) => {
                            for line in String::from_utf8_lossy(&data).lines() {
                                sequence += 1;
                                queue_log_line(&log_sender, sequence, "stderr", line.to_string());
                            }
                        }
                        Some(clx_ssh_client::ChannelMsg::ExitStatus { exit_status }) => ended_cleanly = exit_status == 0,
                        None => break,
                        _ => {}
                    }
                }
            }
        }
        if is_custom || ended_cleanly {
            let _ = emit_log_state(&app, &stream_id, &monitor_id, "ended", None, attempt);
            return;
        }
        if requires_sudo {
            let _ = emit_log_state(
                &app,
                &stream_id,
                &monitor_id,
                "needsElevation",
                Some(
                    "SSH stream disconnected; enter the sudo password again to reconnect"
                        .to_string(),
                ),
                attempt,
            );
            return;
        }
        sequence += 1;
        queue_log_line(
            &log_sender,
            sequence,
            "system",
            "── SSH log stream disconnected; reconnecting ──".to_string(),
        );
        tokio::select! { _ = token.cancelled() => break, _ = tokio::time::sleep(Duration::from_secs(*delay)) => {} }
    }
    let _ = emit_log_state(
        &app,
        &stream_id,
        &monitor_id,
        "error",
        Some("Reconnect limit reached".to_string()),
        5,
    );
}

fn queue_log_line(
    sender: &mpsc::UnboundedSender<LogLineEvent>,
    sequence: u64,
    stream: &str,
    text: String,
) {
    let _ = sender.send(LogLineEvent {
        sequence,
        stream: stream.to_string(),
        text,
    });
}

async fn emit_log_batches(
    app: AppHandle,
    stream_id: String,
    monitor_id: String,
    mut receiver: mpsc::UnboundedReceiver<LogLineEvent>,
) {
    const MAX_BATCH_LINES: usize = 100;
    const MAX_BATCH_BYTES: usize = 64 * 1024;
    let mut interval = tokio::time::interval(Duration::from_millis(100));
    interval.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Skip);
    let mut lines = Vec::with_capacity(MAX_BATCH_LINES);
    let mut bytes = 0usize;
    loop {
        let should_stop = tokio::select! {
            _ = interval.tick() => false,
            line = receiver.recv() => {
                match line {
                    Some(line) => {
                        bytes = bytes.saturating_add(line.text.len());
                        lines.push(line);
                        false
                    }
                    None => true,
                }
            }
        };
        if !lines.is_empty()
            && (should_stop || lines.len() >= MAX_BATCH_LINES || bytes >= MAX_BATCH_BYTES)
        {
            let batch = std::mem::take(&mut lines);
            bytes = 0;
            let _ = app.emit(
                "dashboard-log-batch",
                LogBatchEvent {
                    stream_id: stream_id.clone(),
                    monitor_id: monitor_id.clone(),
                    lines: batch,
                },
            );
        }
        if should_stop {
            break;
        }
    }
}

fn emit_log_state(
    app: &AppHandle,
    stream_id: &str,
    monitor_id: &str,
    state: &str,
    message: Option<String>,
    attempt: u8,
) -> Result<(), String> {
    app.emit(
        "dashboard-log-state",
        LogStateEvent {
            stream_id: stream_id.to_string(),
            monitor_id: monitor_id.to_string(),
            state: state.to_string(),
            message,
            attempt,
        },
    )
    .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn dashboard_stop_log_stream(
    state: State<'_, AppState>,
    stream_id: String,
) -> Result<(), String> {
    state.monitoring.stop_stream(&stream_id).await;
    Ok(())
}

#[tauri::command]
pub async fn dashboard_kill_processes(
    state: State<'_, AppState>,
    mut request: KillProcessesRequest,
) -> Result<KillProcessesResult, String> {
    if request.processes.is_empty() {
        return Err("Select at least one listener process".to_string());
    }
    if !matches!(request.mode.as_str(), "normal" | "force") {
        return Err("Kill mode must be normal or force".to_string());
    }
    let monitor = state
        .monitoring
        .get(&request.monitor_id)
        .await
        .ok_or_else(|| format!("Monitor '{}' was not found", request.monitor_id))?;
    validate_kill_selection(&request.processes)?;
    let (_, _, current) = probe_monitor_inner(&state.monitoring, &monitor).await?;
    for requested in &request.processes {
        if !current
            .iter()
            .any(|value| value.pid == requested.pid && value.start_token == requested.start_token)
        {
            return Err(format!(
                "Process PID {} changed after confirmation; refresh before killing",
                requested.pid
            ));
        }
    }
    let pids: Vec<u32> = request.processes.iter().map(|value| value.pid).collect();
    let os = if monitor.target_os == "auto" {
        if monitor.target_type == "local" {
            local_os().to_string()
        } else {
            state
                .monitoring
                .cached_os(&monitor.id)
                .await
                .unwrap_or_else(|| "linux".to_string())
        }
    } else {
        monitor.target_os.clone()
    };
    let base_command = kill_command(&os, &pids, &request.mode)?;
    let (command, mut input) = with_optional_sudo(&os, &base_command, request.sudo_password.take());
    let output = if monitor.target_type == "local" {
        run_local_capture(&os, &command, input.as_deref()).await?
    } else {
        let route = SshRouteSession::connect(
            &monitor,
            state.monitoring.secret(&monitor.id, "target"),
            state.monitoring.secret(&monitor.id, "jump"),
        )
        .await?;
        route
            .exec_capture(
                &if os == "windows" {
                    powershell_command(&command)
                } else {
                    command
                },
                input.as_deref(),
            )
            .await?
    };
    if let Some(value) = input.as_mut() {
        value.zeroize();
    }
    if output.exit_status != Some(0) {
        return Err(format!(
            "Process stop failed: {}",
            sanitize_monitor_error(&output.stderr)
        ));
    }
    tokio::time::sleep(Duration::from_millis(700)).await;
    let (_, _, remaining) = probe_monitor_inner(&state.monitoring, &monitor).await?;
    let remaining_ids: HashSet<u32> = remaining.into_iter().map(|value| value.pid).collect();
    let stopped = pids
        .iter()
        .copied()
        .filter(|pid| !remaining_ids.contains(pid))
        .collect();
    let still_listening = pids
        .iter()
        .copied()
        .filter(|pid| remaining_ids.contains(pid))
        .collect::<Vec<_>>();
    Ok(KillProcessesResult {
        requested: pids,
        stopped,
        force_available: request.mode == "normal" && !still_listening.is_empty(),
        still_listening,
    })
}

fn validate_kill_selection(processes: &[ProcessIdentity]) -> Result<(), String> {
    let mut selected_pids = HashSet::new();
    for requested in processes {
        if requested.start_token.trim().is_empty() {
            return Err(format!(
                "Process PID {} has no stable start identity and cannot be killed safely",
                requested.pid
            ));
        }
        if !selected_pids.insert(requested.pid) {
            return Err(format!(
                "Process PID {} was selected more than once",
                requested.pid
            ));
        }
    }
    Ok(())
}

fn kill_command(os: &str, pids: &[u32], mode: &str) -> Result<String, String> {
    if pids.is_empty() {
        return Err("No PIDs were selected".to_string());
    }
    if os == "windows" {
        let ids = pids
            .iter()
            .map(u32::to_string)
            .collect::<Vec<_>>()
            .join(",");
        return Ok(format!(
            "Stop-Process -Id @({ids}){} -ErrorAction Stop",
            if mode == "force" { " -Force" } else { "" }
        ));
    }
    let ids = pids
        .iter()
        .map(u32::to_string)
        .collect::<Vec<_>>()
        .join(" ");
    Ok(format!(
        "kill {} -- {ids}",
        if mode == "force" { "-KILL" } else { "-TERM" }
    ))
}

// ── Target connection monitor ────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TcpConnection {
    pub protocol: String,
    pub local_addr: String,
    pub local_port: u16,
    pub remote_addr: String,
    pub remote_port: u16,
    pub state: String,
    pub pid: Option<u32>,
    pub process_name: Option<String>,
}

/// Parse `netstat -ano -p TCP` and return all TCP connections.
fn parse_all_tcp_connections() -> Vec<TcpConnection> {
    let output = {
        let mut cmd = std::process::Command::new("netstat");
        cmd.args(["-ano", "-p", "TCP"]);
        cmd.stdout(std::process::Stdio::piped());
        cmd.stderr(std::process::Stdio::null());
        cmd_no_window(&mut cmd);
        cmd.output()
            .ok()
            .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
    };
    let stdout = output.unwrap_or_default();
    let mut connections: Vec<TcpConnection> = Vec::new();

    for line in stdout.lines().skip(4) {
        let fields: Vec<&str> = line.split_whitespace().collect();
        if fields.len() < 5 {
            continue;
        }

        // Parse local address (e.g., "192.168.1.5:49876" or "[::1]:49876")
        let local = fields[1];
        let (local_ip, local_port) = parse_socket_addr(local);

        // Parse remote address
        let remote = fields[2];
        let (remote_ip, remote_port) = parse_socket_addr(remote);

        let state = fields[3].to_string();
        let pid: Option<u32> = fields.get(4).and_then(|s| s.parse().ok());

        let process_name = pid.and_then(|p| process_name_by_pid(p));

        connections.push(TcpConnection {
            protocol: fields[0].to_string(),
            local_addr: local_ip.to_string(),
            local_port,
            remote_addr: remote_ip.to_string(),
            remote_port,
            state,
            pid,
            process_name,
        });
    }

    connections
}

fn parse_socket_addr(addr: &str) -> (&str, u16) {
    // Handle IPv6 format "[::1]:port"
    if addr.starts_with('[') {
        if let Some(bracket_end) = addr.find(']') {
            let ip = &addr[1..bracket_end];
            let port_str = &addr[bracket_end + 1..]; // includes the colon
            let port = port_str.trim_start_matches(':').parse::<u16>().unwrap_or(0);
            return (ip, port);
        }
    }
    // Standard IPv4 format "x.x.x.x:port"
    if let Some(last_colon) = addr.rfind(':') {
        let ip = &addr[..last_colon];
        let port = addr[last_colon + 1..].parse::<u16>().unwrap_or(0);
        return (ip, port);
    }
    (addr, 0)
}

/// Resolve a domain to IP addresses using `nslookup` (Windows) or `getent`/`host` (*nix).
fn resolve_domain_to_ips(target: &str) -> Vec<String> {
    // If it's already an IP, return it directly
    if target.chars().all(|c| c.is_ascii_digit() || c == '.') && target.split('.').count() == 4 {
        return vec![target.to_string()];
    }

    // Try nslookup (Windows)
    let output = {
        let mut cmd = std::process::Command::new("nslookup");
        cmd.arg(target);
        cmd.stdout(std::process::Stdio::piped());
        cmd.stderr(std::process::Stdio::null());
        cmd_no_window(&mut cmd);
        cmd.output()
            .ok()
            .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
    };
    let stdout = output.unwrap_or_default();

    let mut ips: Vec<String> = Vec::new();
    for line in stdout.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("Address:") || trimmed.starts_with("Addresses:") {
            let parts: Vec<&str> = trimmed.split_whitespace().collect();
            for part in &parts[1..] {
                let addr = part.trim_end_matches(',');
                // Skip localhost-like addresses from nslookup header
                if addr.chars().all(|c| c.is_ascii_digit() || c == '.') && !addr.starts_with("127.")
                {
                    ips.push(addr.to_string());
                }
            }
        }
    }

    if ips.is_empty() {
        // Fallback: if nslookup gave nothing, try the target as-is
        ips.push(target.to_string());
    }

    ips
}

#[tauri::command]
pub async fn dashboard_get_target_connections(
    target: String,
) -> Result<Vec<TcpConnection>, String> {
    tokio::task::spawn_blocking(move || {
        let ips = resolve_domain_to_ips(&target);
        let all = parse_all_tcp_connections();
        all.into_iter()
            .filter(|conn| {
                ips.iter()
                    .any(|ip| conn.remote_addr == *ip || conn.local_addr == *ip)
            })
            .collect()
    })
    .await
    .map_err(|error| format!("target connection scan failed: {error}"))
}

#[tauri::command]
pub async fn dashboard_get_all_connections() -> Result<Vec<TcpConnection>, String> {
    tokio::task::spawn_blocking(parse_all_tcp_connections)
        .await
        .map_err(|error| format!("connection scan failed: {error}"))
}

#[cfg(test)]
mod target_monitoring_tests {
    use super::*;

    #[cfg(target_os = "windows")]
    #[test]
    fn resource_usage_includes_current_process_tree() {
        let usage = get_process_memory();
        assert!(usage.memory_bytes > 0);
        assert!(usage.tree_memory_bytes >= usage.memory_bytes);
        assert!(usage.process_count >= 1);
    }

    #[cfg(target_os = "windows")]
    #[tokio::test]
    async fn windows_batch_probe_returns_one_result_per_port() {
        let output = run_local_capture("windows", &windows_probe_batch_script(&[9, 10]), None)
            .await
            .unwrap();
        assert_eq!(output.exit_status, Some(0), "{}", output.stderr);
        let parsed: serde_json::Value = serde_json::from_str(output.stdout.trim()).unwrap();
        let results = parsed.as_array().expect("batch probe must return an array");
        assert_eq!(results.len(), 2);
        assert_eq!(results[0]["port"], 9);
        assert_eq!(results[1]["port"], 10);
    }

    fn identity(pid: u32, start_token: &str) -> ProcessIdentity {
        ProcessIdentity {
            pid,
            start_token: start_token.to_string(),
            process_name: "test".to_string(),
            exe_path: None,
            command_line: None,
            working_dir: None,
            memory_bytes: 0,
            memory_mb: 0.0,
            cpu_time_seconds: 0.0,
            uptime_seconds: 0,
        }
    }

    #[test]
    fn exact_endpoint_port_does_not_confuse_80_and_8080() {
        assert_eq!(endpoint_port("0.0.0.0:80"), Some(80));
        assert_eq!(endpoint_port("[::]:8080"), Some(8080));
        assert_ne!(endpoint_port("127.0.0.1:8080"), Some(80));
    }

    #[test]
    fn dedupes_ipv4_ipv6_rows_for_same_process() {
        let output = "LISTEN 0 128 0.0.0.0:8081 0.0.0.0:* users:((\"node\",pid=42,fd=1))\nLISTEN 0 128 [::]:8081 [::]:* users:((\"node\",pid=42,fd=2))";
        assert_eq!(linux_listener_pids(8081, output), (true, vec![42]));
    }

    #[test]
    fn typed_identifiers_reject_shell_metacharacters() {
        assert!(safe_identifier("api.service"));
        assert!(!safe_identifier("api.service;reboot"));
    }

    #[test]
    fn kill_command_only_contains_validated_numeric_pids() {
        assert_eq!(
            kill_command("linux", &[12, 34], "normal").unwrap(),
            "kill -TERM -- 12 34"
        );
    }

    #[test]
    fn kill_requires_a_stable_start_identity() {
        assert!(validate_kill_selection(&[identity(42, "")]).is_err());
        assert!(validate_kill_selection(&[identity(42, "start-1")]).is_ok());
    }

    #[test]
    fn kill_rejects_duplicate_pids() {
        let selected = [identity(42, "start-1"), identity(42, "start-1")];
        assert!(validate_kill_selection(&selected).is_err());
    }
}
