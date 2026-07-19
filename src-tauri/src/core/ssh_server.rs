use crate::terminal::session_manager::SessionManager;
use russh::{
    keys::{decode_secret_key, parse_public_key_base64, PublicKey},
    server::{Auth, Handler, Session},
    ChannelId,
};
use std::collections::HashMap;
use std::sync::{Arc, Mutex as StdMutex};
use tauri::AppHandle;

#[derive(Debug, Clone)]
enum UserState {
    Menu,
    Attached {
        session_id: String,
        channel_id: ChannelId,
    },
}

struct SshHandler {
    app_handle: AppHandle,
    session_manager: Arc<SessionManager>,
    state: Arc<StdMutex<UserState>>,
    // Active session selection mapping: "1" -> "Aider-..."
    session_map: Arc<StdMutex<HashMap<String, String>>>,
    logs: Arc<StdMutex<Vec<String>>>,
    client_ip: String,
    session_handle: Arc<StdMutex<Option<russh::server::Handle>>>,
    client_cols: Arc<StdMutex<u16>>,
    client_rows: Arc<StdMutex<u16>>,
    config: Arc<SshServerConfig>,
}

impl SshHandler {
    fn new(
        app_handle: AppHandle,
        session_manager: Arc<SessionManager>,
        logs: Arc<StdMutex<Vec<String>>>,
        client_ip: String,
        config: Arc<SshServerConfig>,
    ) -> Self {
        Self {
            app_handle,
            session_manager,
            state: Arc::new(StdMutex::new(UserState::Menu)),
            session_map: Arc::new(StdMutex::new(HashMap::new())),
            logs,
            client_ip,
            session_handle: Arc::new(StdMutex::new(None)),
            client_cols: Arc::new(StdMutex::new(80)),
            client_rows: Arc::new(StdMutex::new(24)),
            config,
        }
    }

    fn add_log(&self, msg: &str) {
        let timestamp = chrono::Local::now().format("%H:%M:%S").to_string();
        let formatted = format!("[{}] [{}] {}", timestamp, self.client_ip, msg);
        if let Ok(mut logs) = self.logs.lock() {
            logs.push(formatted);
            if logs.len() > 100 {
                logs.remove(0); // limit to last 100 log lines
            }
        }
    }

    fn attach_to_session(&self, session_id: String, channel: ChannelId) {
        let (tx, mut rx) = tokio::sync::mpsc::unbounded_channel::<String>();
        self.session_manager.add_listener(session_id.clone(), tx);

        let state_ref = self.state.clone();
        let session_handle_ref = self.session_handle.clone();

        let session_id_for_listener = session_id.clone();
        tokio::spawn(async move {
            while let Some(chunk) = rx.recv().await {
                let current_state = state_ref.lock().unwrap().clone();
                if let UserState::Attached {
                    session_id: cur_id,
                    channel_id: cur_chan,
                } = current_state
                {
                    if cur_id == session_id_for_listener && cur_chan == channel {
                        let handle_opt = session_handle_ref.lock().unwrap().clone();
                        if let Some(handle) = handle_opt {
                            // Normalize line endings and strip mouse-tracking-enable
                            // sequences so the SSH client can select/copy text.
                            let normalized = String::from_utf8_lossy(&strip_mouse_tracking(
                                chunk.replace("\r\n", "\n").replace("\n", "\r\n").as_bytes(),
                            ))
                            .to_string();
                            let _ = handle.data(channel, normalized).await;
                        }
                        continue;
                    }
                }
                break;
            }
        });

        // Trigger immediate resize of the PTY session to match client dimensions
        let cols = *self.client_cols.lock().unwrap();
        let rows = *self.client_rows.lock().unwrap();
        let session_mgr = self.session_manager.clone();
        tokio::spawn(async move {
            let _ = session_mgr.resize_session(&session_id, rows, cols).await;
        });
    }

    async fn print_menu(&self, channel: ChannelId, session: &mut Session) {
        let mut menu = String::new();
        menu.push_str("\r\n\x1b[2J\x1b[H"); // Clear screen and home cursor
        menu.push_str("\x1b[1;36m=== CLX COLLABORATIVE SSH INTERFACE ===\x1b[0m\r\n\n");
        menu.push_str("Active interactive sessions:\r\n");

        let sessions = self.session_manager.list_sessions().await;
        let mut map = self.session_map.lock().unwrap();
        map.clear();

        if sessions.is_empty() {
            menu.push_str("  (No active sessions running on this machine)\r\n");
        } else {
            for (idx, s) in sessions.iter().enumerate() {
                let key = (idx + 1).to_string();
                map.insert(key.clone(), s.id.clone());
                menu.push_str(&format!(
                    "  \x1b[1;32m[{}]\x1b[0m {} (ID: {})\r\n",
                    key,
                    s.cli_name,
                    &s.id[..std::cmp::min(8, s.id.len())]
                ));
            }
        }

        menu.push_str("\r\nOptions:\r\n");
        menu.push_str("  \x1b[1;33m[c]\x1b[0m Create a new CLI shell session\r\n");
        menu.push_str("  \x1b[1;33m[r]\x1b[0m Refresh active sessions list\r\n");
        menu.push_str("  \x1b[1;31m[q]\x1b[0m Close connection\r\n\n");
        menu.push_str("Enter your choice: ");

        let _ = session.data(channel, menu);
    }
}

impl Drop for SshHandler {
    fn drop(&mut self) {
        self.add_log("Connection closed/disconnected");
    }
}

fn parse_ssh_pubkey(key_str: &str) -> Option<PublicKey> {
    let parts: Vec<&str> = key_str.split_whitespace().collect();
    if parts.len() >= 2 {
        parse_public_key_base64(parts[1]).ok()
    } else {
        parse_public_key_base64(key_str).ok()
    }
}

/// Strip mouse-tracking-enable escape sequences from the data stream so
/// the SSH client can always select/copy text with the mouse locally.
/// Without this, TUI apps that emit \x1b[?1000h (etc.) will cause the
/// client to enter mouse-reporting mode, where every mouse drag is sent
/// as input instead of triggering client-side text selection.
fn strip_mouse_tracking(data: &[u8]) -> Vec<u8> {
    // These are the DECSET sequences that enable mouse tracking.
    // We replace the `h` (set/enable) with `l` (reset/disable).
    const ENABLE: &[(&[u8], &[u8])] = &[
        (b"\x1b[?1000h", b"\x1b[?1000l"), // basic press/release
        (b"\x1b[?1002h", b"\x1b[?1002l"), // button-event
        (b"\x1b[?1003h", b"\x1b[?1003l"), // any-event
        (b"\x1b[?1006h", b"\x1b[?1006l"), // SGR extended
    ];
    let mut out = Vec::with_capacity(data.len());
    let mut i = 0;
    while i < data.len() {
        let mut matched = false;
        for &(pat, repl) in ENABLE {
            if data[i..].starts_with(pat) {
                out.extend_from_slice(repl);
                i += pat.len();
                matched = true;
                break;
            }
        }
        if !matched {
            out.push(data[i]);
            i += 1;
        }
    }
    out
}

impl Handler for SshHandler {
    type Error = russh::Error;

    async fn auth_password(&mut self, user: &str, pass: &str) -> Result<Auth, Self::Error> {
        let success = if let Some(ref configured_pass) = self.config.password {
            user == self.config.username && !configured_pass.is_empty() && pass == configured_pass
        } else {
            false
        };

        if success {
            self.add_log(&format!("User '{}' authenticated successfully", user));
            Ok(Auth::Accept)
        } else {
            self.add_log(&format!(
                "Failed authentication attempt for user '{}'",
                user
            ));
            Ok(Auth::Reject {
                proceed_with_methods: None,
                partial_success: false,
            })
        }
    }

    async fn auth_publickey_offered(
        &mut self,
        user: &str,
        public_key: &PublicKey,
    ) -> Result<Auth, Self::Error> {
        let client_key_str = public_key.to_string();
        self.add_log(&format!(
            "Public key offered by user '{}': {}",
            user, client_key_str
        ));
        if user != self.config.username {
            self.add_log(&format!(
                "Rejected public key offer: username '{}' does not match configured '{}'",
                user, self.config.username
            ));
            return Ok(Auth::Reject {
                proceed_with_methods: None,
                partial_success: false,
            });
        }

        for key_str in &self.config.public_keys {
            if let Some(parsed_key) = parse_ssh_pubkey(key_str) {
                if client_key_str == parsed_key.to_string() {
                    self.add_log(&format!("Accepted public key offer for user '{}'", user));
                    return Ok(Auth::Accept);
                }
            }
        }

        self.add_log(&format!(
            "Rejected public key offer for user '{}': key not authorized",
            user
        ));
        Ok(Auth::Reject {
            proceed_with_methods: None,
            partial_success: false,
        })
    }

    async fn auth_publickey(
        &mut self,
        user: &str,
        public_key: &PublicKey,
    ) -> Result<Auth, Self::Error> {
        let client_key_str = public_key.to_string();
        if user != self.config.username {
            self.add_log(&format!(
                "Failed public key auth attempt: invalid user '{}'",
                user
            ));
            return Ok(Auth::Reject {
                proceed_with_methods: None,
                partial_success: false,
            });
        }

        for key_str in &self.config.public_keys {
            if let Some(parsed_key) = parse_ssh_pubkey(key_str) {
                if client_key_str == parsed_key.to_string() {
                    self.add_log(&format!(
                        "User '{}' authenticated successfully via public key",
                        user
                    ));
                    return Ok(Auth::Accept);
                }
            }
        }

        self.add_log(&format!(
            "Failed public key auth attempt for user '{}'",
            user
        ));
        Ok(Auth::Reject {
            proceed_with_methods: None,
            partial_success: false,
        })
    }

    async fn channel_open_session(
        &mut self,
        _channel: russh::Channel<russh::server::Msg>,
        reply: russh::server::ChannelOpenHandle,
        _session: &mut Session,
    ) -> Result<(), Self::Error> {
        reply.accept().await;
        Ok(())
    }

    async fn pty_request(
        &mut self,
        channel: ChannelId,
        _term: &str,
        col_width: u32,
        row_height: u32,
        _pix_width: u32,
        _pix_height: u32,
        _modes: &[(russh::Pty, u32)],
        session: &mut Session,
    ) -> Result<(), Self::Error> {
        *self.client_cols.lock().unwrap() = col_width as u16;
        *self.client_rows.lock().unwrap() = row_height as u16;
        let _ = session.channel_success(channel);
        Ok(())
    }

    async fn window_change_request(
        &mut self,
        _channel: ChannelId,
        col_width: u32,
        row_height: u32,
        _pix_width: u32,
        _pix_height: u32,
        _session: &mut Session,
    ) -> Result<(), Self::Error> {
        let cols = col_width as u16;
        let rows = row_height as u16;
        *self.client_cols.lock().unwrap() = cols;
        *self.client_rows.lock().unwrap() = rows;

        // If currently attached, trigger an interactive resize on the server session
        let current_state = self.state.lock().unwrap().clone();
        if let UserState::Attached { session_id, .. } = current_state {
            let session_mgr = self.session_manager.clone();
            tokio::spawn(async move {
                let _ = session_mgr.resize_session(&session_id, rows, cols).await;
            });
        }
        Ok(())
    }

    async fn shell_request(
        &mut self,
        channel: ChannelId,
        session: &mut Session,
    ) -> Result<(), Self::Error> {
        session.request_success();
        self.add_log("Shell session requested and started");
        *self.session_handle.lock().unwrap() = Some(session.handle());
        self.print_menu(channel, session).await;
        Ok(())
    }

    async fn data(
        &mut self,
        channel: ChannelId,
        data: &[u8],
        session: &mut Session,
    ) -> Result<(), Self::Error> {
        let current_state = self.state.lock().unwrap().clone();

        match current_state {
            UserState::Menu => {
                let input = String::from_utf8_lossy(data).trim().to_string();
                if input == "q" {
                    self.add_log("Quit SSH connection requested");
                    let _ = session.data(channel, "\r\nGoodbye!\r\n");
                    let _ = session.close(channel);
                } else if input == "r" {
                    self.print_menu(channel, session).await;
                } else if input == "c" {
                    self.add_log("Created and attached to a new terminal session");
                    let _ = session.data(channel, "\r\nCreating new shell session...\r\n");

                    let app = self.app_handle.clone();
                    let session_manager = self.session_manager.clone();
                    let channel_handle = session.handle();
                    let state_ref = self.state.clone();

                    let self_logs = self.logs.clone();
                    let self_ip = self.client_ip.clone();
                    let self_handle = self.session_handle.clone();

                    let client_cols = *self.client_cols.lock().unwrap();
                    let client_rows = *self.client_rows.lock().unwrap();

                    tokio::spawn(async move {
                        let cmd = crate::core::execution_engine::ResolvedCommand {
                            command: if cfg!(target_os = "windows") {
                                "powershell.exe".to_string()
                            } else {
                                "bash".to_string()
                            },
                            args: vec![],
                            cwd: None,
                            env: std::collections::HashMap::new(),
                        };
                        match session_manager
                            .create_session(app, "shell".to_string(), None, None, cmd)
                            .await
                        {
                            Ok(sess_info) => {
                                *state_ref.lock().unwrap() = UserState::Attached {
                                    session_id: sess_info.id.clone(),
                                    channel_id: channel,
                                };

                                // Resize session immediately to client dimensions
                                let _ = session_manager
                                    .resize_session(&sess_info.id, client_rows, client_cols)
                                    .await;

                                // Create native channel output forwarder
                                let sess_id_clone = sess_info.id.clone();
                                let (tx, mut rx) = tokio::sync::mpsc::unbounded_channel::<String>();
                                session_manager.add_listener(sess_id_clone.clone(), tx);

                                tokio::spawn(async move {
                                    while let Some(chunk) = rx.recv().await {
                                        let current_state = state_ref.lock().unwrap().clone();
                                        if let UserState::Attached {
                                            session_id: cur_id,
                                            channel_id: cur_chan,
                                        } = current_state
                                        {
                                            if cur_id == sess_id_clone && cur_chan == channel {
                                                let handle_opt =
                                                    self_handle.lock().unwrap().clone();
                                                if let Some(handle) = handle_opt {
                                                    let normalized = String::from_utf8_lossy(
                                                        &strip_mouse_tracking(
                                                            chunk
                                                                .replace("\r\n", "\n")
                                                                .replace("\n", "\r\n")
                                                                .as_bytes(),
                                                        ),
                                                    )
                                                    .to_string();
                                                    let _ = handle.data(channel, normalized).await;
                                                }
                                                continue;
                                            }
                                        }
                                        break;
                                    }
                                });

                                let attach_msg = format!("\x1b[2J\x1b[H\x1b[1;32mAttached to new session: {}\x1b[0m\r\n(Press Ctrl+X or Ctrl+Q to detach and return to menu)\r\n\n", sess_info.id);
                                let _ = channel_handle.data(channel, attach_msg).await;
                            }
                            Err(e) => {
                                let timestamp = chrono::Local::now().format("%H:%M:%S").to_string();
                                let formatted = format!(
                                    "[{}] [{}] Failed to create SSH session: {}",
                                    timestamp, self_ip, e
                                );
                                if let Ok(mut logs) = self_logs.lock() {
                                    logs.push(formatted);
                                }
                                let err_msg = format!("\r\nFailed to create session: {}\r\n", e);
                                let _ = channel_handle.data(channel, err_msg).await;
                            }
                        }
                    });
                } else {
                    let target_id = self.session_map.lock().unwrap().get(&input).cloned();
                    if let Some(id) = target_id {
                        self.add_log(&format!("Attached to session: {}", id));
                        *self.state.lock().unwrap() = UserState::Attached {
                            session_id: id.clone(),
                            channel_id: channel,
                        };

                        // Register native listener for output and trigger resize
                        self.attach_to_session(id.clone(), channel);

                        let attach_msg = format!("\x1b[2J\x1b[H\x1b[1;32mAttached to session: {}\x1b[0m\r\n(Press Ctrl+X or Ctrl+Q to detach and return to menu)\r\n\n", id);
                        let _ = session.data(channel, attach_msg);
                    } else {
                        let _ = session.data(channel, "\r\nInvalid choice. Try again.\r\nChoice: ");
                    }
                }
            }
            UserState::Attached {
                session_id,
                channel_id: _,
            } => {
                // If user presses Ctrl+X (byte value 24) or Ctrl+Q (byte value 17), detach and return to menu
                if data.len() == 1 && (data[0] == 24 || data[0] == 17) {
                    self.add_log("Detached from session");
                    *self.state.lock().unwrap() = UserState::Menu;
                    self.print_menu(channel, session).await;
                    return Ok(());
                }

                // Forward keystrokes directly to the PTY
                let input_str = String::from_utf8_lossy(data).to_string();
                let _ = self
                    .session_manager
                    .send_input(&session_id, &input_str)
                    .await;
            }
        }

        Ok(())
    }
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SshServerConfig {
    pub username: String,
    pub password: Option<String>,
    pub public_keys: Vec<String>,
}

impl Default for SshServerConfig {
    fn default() -> Self {
        Self {
            username: "admin".to_string(),
            password: Some("admin".to_string()),
            public_keys: Vec::new(),
        }
    }
}

// Global server control handle
pub struct SshServerManager {
    abort_handle: Option<tokio::task::AbortHandle>,
    port: u16,
    running: bool,
    logs: Arc<StdMutex<Vec<String>>>,
    active_connections: Arc<StdMutex<Vec<tokio::task::AbortHandle>>>,
}

impl SshServerManager {
    pub fn new() -> Self {
        Self {
            abort_handle: None,
            port: 2222,
            running: false,
            logs: Arc::new(StdMutex::new(Vec::new())),
            active_connections: Arc::new(StdMutex::new(Vec::new())),
        }
    }

    pub fn start(
        &mut self,
        app_handle: AppHandle,
        session_manager: Arc<SessionManager>,
        port: u16,
        config: SshServerConfig,
        root_dir: std::path::PathBuf,
    ) -> Result<(), String> {
        if self.running {
            return Err("SSH Server is already running".to_string());
        }

        self.port = port;

        // Clear old logs and write started log
        {
            let mut logs_guard = self.logs.lock().unwrap();
            logs_guard.clear();
            let timestamp = chrono::Local::now().format("%H:%M:%S").to_string();
            logs_guard.push(format!(
                "[{}] [system] SSH Server started on port {}",
                timestamp, port
            ));
        }

        let host_key_path = root_dir.join("ssh_host_key.pem");
        let keypair = if host_key_path.exists() {
            let pem_data = std::fs::read_to_string(&host_key_path)
                .map_err(|e| format!("Failed to read host key file: {}", e))?;
            decode_secret_key(&pem_data, None)
                .map_err(|e| format!("Failed to decode host key: {}", e))?
        } else {
            let mut rng = rand::rng();
            let generated =
                russh::keys::PrivateKey::random(&mut rng, russh::keys::Algorithm::Ed25519)
                    .map_err(|e| format!("Failed to generate host key: {}", e))?;
            let openssh_pem = generated
                .to_openssh(russh_keys::ssh_key::LineEnding::LF)
                .map_err(|e| format!("Failed to serialize host key to OpenSSH PEM: {}", e))?;
            let _ = std::fs::create_dir_all(&root_dir);
            std::fs::write(&host_key_path, openssh_pem)
                .map_err(|e| format!("Failed to write host key file: {}", e))?;
            generated
        };

        let mut config_server = russh::server::Config::default();
        config_server.keys.push(keypair);

        // Also enable publickey authentication method, password method is on by default in Config::default()
        // russh handles the available auth methods based on handler responses or defaults.

        let config_server = Arc::new(config_server);
        let config_arc = Arc::new(config);

        let logs_clone = self.logs.clone();
        let active_connections_clone = self.active_connections.clone();

        let task = tokio::spawn(async move {
            if let Ok(listener) = tokio::net::TcpListener::bind(("0.0.0.0", port)).await {
                // Log ready
                {
                    let mut logs = logs_clone.lock().unwrap();
                    let ts = chrono::Local::now().format("%H:%M:%S").to_string();
                    logs.push(format!(
                        "[{}] [system] Listening for incoming network connections...",
                        ts
                    ));
                }

                while let Ok((stream, addr)) = listener.accept().await {
                    let config_server_clone = config_server.clone();
                    let config_arc_clone = config_arc.clone();
                    let client_ip = addr.ip().to_string();

                    // Log connection accepted
                    {
                        let mut logs = logs_clone.lock().unwrap();
                        let ts = chrono::Local::now().format("%H:%M:%S").to_string();
                        logs.push(format!(
                            "[{}] [{}] Connection accepted from network",
                            ts, client_ip
                        ));
                    }

                    let handler = SshHandler::new(
                        app_handle.clone(),
                        session_manager.clone(),
                        logs_clone.clone(),
                        client_ip,
                        config_arc_clone,
                    );

                    let conn_task = tokio::spawn(async move {
                        let _ =
                            russh::server::run_stream(config_server_clone, stream, handler).await;
                    });

                    // Track active connection handle
                    active_connections_clone
                        .lock()
                        .unwrap()
                        .push(conn_task.abort_handle());
                }
            }
        });

        self.abort_handle = Some(task.abort_handle());
        self.running = true;
        Ok(())
    }

    pub fn stop(&mut self) {
        // Abort main server listener task
        if let Some(handle) = self.abort_handle.take() {
            handle.abort();
        }

        // Abort all active client connection tasks (kicking all sessions)
        if let Ok(mut conns) = self.active_connections.lock() {
            let conn_count = conns.len();
            for handle in conns.drain(..) {
                handle.abort();
            }
            if conn_count > 0 {
                let timestamp = chrono::Local::now().format("%H:%M:%S").to_string();
                let mut logs = self.logs.lock().unwrap();
                logs.push(format!(
                    "[{}] [system] Disconnected {} active remote session(s)",
                    timestamp, conn_count
                ));
            }
        }

        self.running = false;

        let timestamp = chrono::Local::now().format("%H:%M:%S").to_string();
        let mut logs = self.logs.lock().unwrap();
        logs.push(format!("[{}] [system] SSH Server stopped", timestamp));
    }

    pub fn status(&self) -> (bool, u16, Vec<String>) {
        let logs_copy = self.logs.lock().unwrap().clone();
        (self.running, self.port, logs_copy)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_pubkey() {
        let raw_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAFQLoDASJm1+tu5qs/5pwCJs6o4fbBjGcYZHCTImVik user@host";
        let parsed = parse_ssh_pubkey(raw_key);
        assert!(parsed.is_some(), "Should parse successfully");

        let raw_key_2 =
            "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAFQLoDASJm1+tu5qs/5pwCJs6o4fbBjGcYZHCTImVik";
        let parsed_2 = parse_ssh_pubkey(raw_key_2);
        assert!(
            parsed_2.is_some(),
            "Should parse successfully without comment"
        );

        assert_eq!(parsed.unwrap(), parsed_2.unwrap(), "Keys should be equal");
    }
}
