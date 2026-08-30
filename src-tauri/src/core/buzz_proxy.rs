// Buzz proxy hop — routes relay traffic through an SSH dynamic SOCKS5 tunnel
// or an HTTP CONNECT proxy. The hop is transparent to buzz.exe and the Nostr
// WebSocket client: they keep talking to the public relay URL, while the OS /
// reqwest layer carries the TCP stream through the configured proxy.
//
// SSH hop  : russh client -> channel_open_direct_tcpip per SOCKS5 CONNECT
// HTTP hop : consumed by the OS-level proxy settings / reqwest `proxy(...)`.

use futures_util::future::OptionFuture;
use russh::keys::PrivateKeyWithHashAlg;
use russh::client;
use std::sync::Arc;
use std::time::Duration;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};

const SSH_TIMEOUT: Duration = Duration::from_secs(10);

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BuzzProxyKind {
    None,
    Ssh,
    Http,
}

impl Default for BuzzProxyKind {
    fn default() -> Self {
        Self::None
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BuzzProxyConfig {
    pub kind: BuzzProxyKind,
    pub host: String,
    #[serde(default = "default_port")]
    pub port: u16,
    pub user: Option<String>,
    /// Password (auth_mode=password) or key passphrase (auth_mode=key).
    #[serde(default)]
    pub secret: Option<String>,
    #[serde(default = "default_auth_mode")]
    pub auth_mode: String,
    #[serde(default)]
    pub key_path: Option<String>,
    /// Local port bound by the SSH dynamic SOCKS5 listener. 0 = default 31080.
    #[serde(default)]
    pub local_port: u16,
}

fn default_port() -> u16 {
    22
}

fn default_auth_mode() -> String {
    "password".to_string()
}

impl Default for BuzzProxyConfig {
    fn default() -> Self {
        Self {
            kind: BuzzProxyKind::None,
            host: String::new(),
            port: default_port(),
            user: None,
            secret: None,
            auth_mode: default_auth_mode(),
            key_path: None,
            local_port: 0,
        }
    }
}

impl BuzzProxyConfig {
    pub fn is_enabled(&self) -> bool {
        self.kind != BuzzProxyKind::None && !self.host.trim().is_empty()
    }

    pub fn socks_bind_port(&self) -> u16 {
        if self.local_port == 0 {
            31080
        } else {
            self.local_port
        }
    }

    /// reqwest proxy for the HTTP CONNECT hop (SSH hop uses the SOCKS5
    /// listener started separately; pass its addr as an all-protocol socks5
    /// proxy). Returns None when no usable hop is configured.
    pub fn reqwest_proxy(&self, socks_addr: Option<String>) -> Result<Option<reqwest::Proxy>, String> {
        if !self.is_enabled() {
            return Ok(None);
        }
        let proxy = match self.kind {
            BuzzProxyKind::Ssh => reqwest::Proxy::all(
                socks_addr.unwrap_or_else(|| format!("socks5://127.0.0.1:{}", self.socks_bind_port())),
            )
            .map_err(|e| format!("Invalid SOCKS5 hop proxy: {e}"))?,
            BuzzProxyKind::Http => reqwest::Proxy::http(format!("http://{}:{}", self.host.trim(), self.port))
                .map_err(|e| format!("Invalid HTTP hop proxy: {e}"))?,
            BuzzProxyKind::None => return Ok(None),
        };
        Ok(Some(proxy))
    }
}

// ---------------------------------------------------------------------------
// russh plumbing (mirrors core/monitoring.rs patterns)
// ---------------------------------------------------------------------------

struct AcceptAnyServerKey;

impl client::Handler for AcceptAnyServerKey {
    type Error = russh::Error;

    async fn check_server_key(
        &mut self,
        _server_public_key: &russh::keys::PublicKey,
    ) -> Result<bool, Self::Error> {
        Ok(true)
    }
}

async fn ssh_authenticate(
    handle: &mut client::Handle<AcceptAnyServerKey>,
    proxy: &BuzzProxyConfig,
) -> Result<(), String> {
    let user = proxy
        .user
        .clone()
        .ok_or_else(|| "SSH hop user is missing".to_string())?;

    let result = if proxy.auth_mode == "password" {
        let password = proxy
            .secret
            .clone()
            .ok_or_else(|| "SSH hop password is missing".to_string())?;
        handle
            .authenticate_password(user, password)
            .await
            .map_err(|error| format!("SSH hop password auth failed: {error}"))?
    } else {
        let key_path = proxy
            .key_path
            .as_ref()
            .ok_or_else(|| "SSH hop private key path is missing".to_string())?;
        let key = russh::keys::load_secret_key(key_path, proxy.secret.as_deref())
            .map_err(|error| format!("Failed to load SSH hop private key: {error}"))?;
        let hash = handle
            .best_supported_rsa_hash()
            .await
            .map_err(|error| format!("SSH hop algorithm negotiation failed: {error}"))?
            .flatten();
        handle
            .authenticate_publickey(user, PrivateKeyWithHashAlg::new(Arc::new(key), hash))
            .await
            .map_err(|error| format!("SSH hop key auth failed: {error}"))?
    };

    if !result.success() {
        return Err(format!(
            "SSH hop authentication was rejected for {}@{}",
            proxy.user.as_deref().unwrap_or("?"),
            proxy.host
        ));
    }
    Ok(())
}

async fn ssh_connect(proxy: &BuzzProxyConfig) -> Result<client::Handle<AcceptAnyServerKey>, String> {
    let config = Arc::new(client::Config {
        inactivity_timeout: Some(Duration::from_secs(600)),
        keepalive_interval: Some(Duration::from_secs(30)),
        keepalive_max: 3,
        ..Default::default()
    });

    let mut handle = tokio::time::timeout(
        SSH_TIMEOUT,
        client::connect(config, (proxy.host.as_str(), proxy.port), AcceptAnyServerKey),
    )
    .await
    .map_err(|_| "SSH hop connection timed out".to_string())?
    .map_err(|error| format!("SSH hop connection failed: {error}"))?;

    ssh_authenticate(&mut handle, proxy).await?;
    Ok(handle)
}

// ---------------------------------------------------------------------------
// SOCKS5 dynamic forwarding (RFC 1928, no-auth + CONNECT only)
// ---------------------------------------------------------------------------

/// Run a long-lived dynamic SOCKS5 listener backed by the SSH hop. Each client
/// CONNECT is forwarded through `channel_open_direct_tcpip` on the SSH server.
pub async fn run_ssh_socks_listener(proxy: BuzzProxyConfig) -> Result<(), String> {
    let bind_port = proxy.socks_bind_port();
    let listener = TcpListener::bind(("127.0.0.1", bind_port))
        .await
        .map_err(|e| format!("Cannot bind SOCKS5 listener on 127.0.0.1:{bind_port}: {e}"))?;

    // Reconnect-capable handle shared by all client tasks.
    let handle: Arc<tokio::sync::Mutex<Option<client::Handle<AcceptAnyServerKey>>>> =
        Arc::new(tokio::sync::Mutex::new(None));

    loop {
        let (stream, _peer) = listener
            .accept()
            .await
            .map_err(|e| format!("SOCKS5 accept failed: {e}"))?;
        let handle = handle.clone();
        let proxy = proxy.clone();
        tokio::spawn(async move {
            if let Err(e) = serve_socks5_client(stream, handle, proxy).await {
                eprintln!("SOCKS5 client error: {e}");
            }
        });
    }
}

async fn get_or_connect_ssh(
    slot: &Arc<tokio::sync::Mutex<Option<client::Handle<AcceptAnyServerKey>>>>,
    proxy: &BuzzProxyConfig,
) -> Result<client::Handle<AcceptAnyServerKey>, String> {
    // Handles are not Clone: keep the slot empty and reconnect per burst of
    // clients. SSH servers accept repeated connections; simplicity wins here.
    let _ = slot;
    ssh_connect(proxy).await
}

async fn serve_socks5_client(
    mut client: TcpStream,
    ssh_slot: Arc<tokio::sync::Mutex<Option<client::Handle<AcceptAnyServerKey>>>>,
    proxy: BuzzProxyConfig,
) -> Result<(), String> {
    // --- Handshake: support 0x00 (no-auth) only ---
    let mut header = [0u8; 2];
    client
        .read_exact(&mut header)
        .await
        .map_err(|e| format!("socks header read failed: {e}"))?;
    if header[0] != 0x05 {
        return Err("not a SOCKS5 client".into());
    }
    let methods = header[1] as usize;
    let mut offered = vec![0u8; methods];
    client
        .read_exact(&mut offered)
        .await
        .map_err(|e| format!("socks methods read failed: {e}"))?;
    if !offered.contains(&0x00) {
        client
            .write_all(&[0x05, 0xFF])
            .await
            .map_err(|e| format!("socks reject write failed: {e}"))?;
        return Err("client offered no no-auth method".into());
    }
    client
        .write_all(&[0x05, 0x00])
        .await
        .map_err(|e| format!("socks method write failed: {e}"))?;

    // --- CONNECT request ---
    let mut req_head = [0u8; 4];
    client
        .read_exact(&mut req_head)
        .await
        .map_err(|e| format!("socks req read failed: {e}"))?;
    if req_head[1] != 0x01 {
        let _ = client.write_all(&[0x05, 0x07, 0x00, 0x01, 0, 0, 0, 0, 0, 0]).await;
        return Err("only CONNECT is supported".into());
    }

    let target_host = match req_head[3] {
        0x01 => {
            let mut ip = [0u8; 4];
            client
                .read_exact(&mut ip)
                .await
                .map_err(|e| format!("socks ipv4 read failed: {e}"))?;
            std::net::Ipv4Addr::from(ip).to_string()
        }
        0x03 => {
            let mut len = [0u8; 1];
            client
                .read_exact(&mut len)
                .await
                .map_err(|e| format!("socks len read failed: {e}"))?;
            let mut buf = vec![0u8; len[0] as usize];
            client
                .read_exact(&mut buf)
                .await
                .map_err(|e| format!("socks host read failed: {e}"))?;
            String::from_utf8(buf).map_err(|_| "socks host is not UTF-8".to_string())?
        }
        0x04 => {
            let mut ip = [0u8; 16];
            client
                .read_exact(&mut ip)
                .await
                .map_err(|e| format!("socks ipv6 read failed: {e}"))?;
            std::net::Ipv6Addr::from(ip).to_string()
        }
        _ => return Err("unsupported socks address type".into()),
    };

    let mut port_bytes = [0u8; 2];
    client
        .read_exact(&mut port_bytes)
        .await
        .map_err(|e| format!("socks port read failed: {e}"))?;
    let target_port = u16::from_be_bytes(port_bytes);

    // --- Forward through the SSH hop ---
    let reply_ok = [0x05, 0x00, 0x00, 0x01, 0, 0, 0, 0, 0, 0];
    let reply_fail = [0x05, 0x05, 0x00, 0x01, 0, 0, 0, 0, 0, 0];

    let ssh = match get_or_connect_ssh(&ssh_slot, &proxy).await {
        Ok(h) => h,
        Err(e) => {
            let _ = client.write_all(&reply_fail).await;
            return Err(e);
        }
    };

    let channel_result = tokio::time::timeout(
        SSH_TIMEOUT,
        ssh.channel_open_direct_tcpip(target_host.clone(), target_port as u32, "127.0.0.1", 0),
    )
    .await
    .map_err(|_| "SSH hop forwarding timed out".to_string())
    .and_then(|r| r.map_err(|error| format!("SSH hop forwarding failed: {error}")));

    let channel = match channel_result {
        Ok(ch) => ch,
        Err(e) => {
            // Drop the poisoned handle so the next client reconnects.
            *ssh_slot.lock().await = None;
            let _ = client.write_all(&reply_fail).await;
            return Err(e);
        }
    };

    let mut target = channel.into_stream();
    let _ = client.write_all(&reply_ok).await;

    // --- Bidirectional pump until either side closes ---
    let client_to_target = tokio::io::copy_bidirectional(&mut client, &mut target);
    let pump: OptionFuture<_> = Some(client_to_target).into();
    match pump.await {
        Some(Ok(_)) | None => {}
        Some(Err(e)) => return Err(format!("tunnel pump failed: {e}")),
    }
    Ok(())
}
