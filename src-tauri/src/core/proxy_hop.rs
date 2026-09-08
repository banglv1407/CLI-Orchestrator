use reqwest::{Client, Url};

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::io::{AsyncReadExt, AsyncWriteExt};

    fn hop(kind: &str, port: u16) -> ProxyHop {
        ProxyHop {
            kind: kind.into(),
            host: "127.0.0.1".into(),
            port,
            username: String::new(),
            secret: String::new(),
            key_path: String::new(),
            auth_mode: "password".into(),
            host_key: String::new(),
        }
    }
    async fn headers(stream: &mut (impl tokio::io::AsyncRead + Unpin)) -> String {
        let mut bytes = Vec::new();
        while !bytes.ends_with(b"\r\n\r\n") {
            bytes.push(stream.read_u8().await.unwrap());
            assert!(bytes.len() < 16384);
        }
        String::from_utf8(bytes).unwrap()
    }
    async fn response(stream: &mut (impl tokio::io::AsyncWrite + Unpin)) {
        stream
            .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: close\r\n\r\nok")
            .await
            .unwrap();
    }
    #[test]
    fn validation_and_redaction() {
        let mut value = hop("http", 8080);
        value.username = "user".into();
        value.secret = "private-p@ss".into();
        assert!(!format!("{value:?}").contains(&value.secret));
        value.host = "example.test/path".into();
        assert!(value.validate().is_err());
        value.host = "127.0.0.1".into();
        value.kind = "socks4".into();
        assert!(value.validate().is_err());
        value.kind = "ssh".into();
        assert!(value.validate().is_err());
        value.host_key = format!("SHA256:{}", "a".repeat(43));
        assert!(value.validate().is_ok());
    }
    #[tokio::test]
    async fn http_proxy_receives_absolute_target_and_proxy_auth() {
        let listener = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let mut value = hop("http", listener.local_addr().unwrap().port());
        value.username = "user".into();
        value.secret = "pass".into();
        let task = tokio::spawn(async move {
            let (mut stream, _) = listener.accept().await.unwrap();
            let head = headers(&mut stream).await.to_lowercase();
            assert!(head.starts_with("post http://unresolvable.invalid/v1/chat/completions "));
            assert!(head.contains("proxy-authorization: basic dxnlcjpwyxnz"));
            response(&mut stream).await;
        });
        let target = "http://unresolvable.invalid/v1/chat/completions";
        let transport = transport(Some(&value), target).await.unwrap();
        assert_eq!(
            transport
                .post(target)
                .send()
                .await
                .unwrap()
                .text()
                .await
                .unwrap(),
            "ok"
        );
        task.await.unwrap();
    }
    #[tokio::test]
    async fn socks5_remote_dns_and_authentication() {
        let listener = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let mut value = hop("socks5", listener.local_addr().unwrap().port());
        value.username = "u".into();
        value.secret = "p".into();
        let task = tokio::spawn(async move {
            let (mut stream, _) = listener.accept().await.unwrap();
            assert_eq!(stream.read_u8().await.unwrap(), 5);
            let n = stream.read_u8().await.unwrap();
            let mut methods = vec![0; n as usize];
            stream.read_exact(&mut methods).await.unwrap();
            assert!(methods.contains(&2));
            stream.write_all(&[5, 2]).await.unwrap();
            assert_eq!(stream.read_u8().await.unwrap(), 1);
            let n = stream.read_u8().await.unwrap();
            let mut user = vec![0; n as usize];
            stream.read_exact(&mut user).await.unwrap();
            assert_eq!(user, b"u");
            let n = stream.read_u8().await.unwrap();
            let mut pass = vec![0; n as usize];
            stream.read_exact(&mut pass).await.unwrap();
            assert_eq!(pass, b"p");
            stream.write_all(&[1, 0]).await.unwrap();
            let mut connect = [0; 4];
            stream.read_exact(&mut connect).await.unwrap();
            assert_eq!(connect, [5, 1, 0, 3]);
            let n = stream.read_u8().await.unwrap();
            let mut host = vec![0; n as usize];
            stream.read_exact(&mut host).await.unwrap();
            assert_eq!(host, b"unresolvable.invalid");
            assert_eq!(stream.read_u16().await.unwrap(), 80);
            stream
                .write_all(&[5, 0, 0, 1, 127, 0, 0, 1, 0, 80])
                .await
                .unwrap();
            let head = headers(&mut stream).await;
            assert!(!head.to_lowercase().contains("proxy-authorization"));
            response(&mut stream).await;
        });
        let target = "http://unresolvable.invalid/v1/chat/completions";
        let transport = transport(Some(&value), target).await.unwrap();
        assert_eq!(
            transport
                .post(target)
                .send()
                .await
                .unwrap()
                .text()
                .await
                .unwrap(),
            "ok"
        );
        task.await.unwrap();
    }
    #[tokio::test]
    async fn socks4_connects_and_relays() {
        let listener = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let value = hop("socks4", listener.local_addr().unwrap().port());
        let task = tokio::spawn(async move {
            let (mut stream, _) = listener.accept().await.unwrap();
            let mut connect = [0; 8];
            stream.read_exact(&mut connect).await.unwrap();
            assert_eq!(connect, [4, 1, 0, 80, 127, 0, 0, 1]);
            assert_eq!(stream.read_u8().await.unwrap(), 0);
            stream
                .write_all(&[0, 90, 0, 80, 127, 0, 0, 1])
                .await
                .unwrap();
            headers(&mut stream).await;
            response(&mut stream).await;
        });
        let target = "http://127.0.0.1/v1/chat/completions";
        let transport = transport(Some(&value), target).await.unwrap();
        assert_eq!(
            transport
                .post(target)
                .send()
                .await
                .unwrap()
                .text()
                .await
                .unwrap(),
            "ok"
        );
        task.await.unwrap();
    }

    #[derive(Clone)]
    struct SshFixture;

    #[tokio::test]
    async fn direct_works_and_failed_hop_never_bypasses_proxy() {
        let listener = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let target = format!(
            "http://{}/v1/chat/completions",
            listener.local_addr().unwrap()
        );
        let direct = transport(None, &target).await.unwrap();
        let request = direct.post(&target).send();
        let serve = async {
            let (mut socket, _) = listener.accept().await.unwrap();
            headers(&mut socket).await;
            response(&mut socket).await;
        };
        let (result, _) = tokio::join!(request, serve);
        assert_eq!(result.unwrap().text().await.unwrap(), "ok");

        let closed = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let value = hop("http", closed.local_addr().unwrap().port());
        drop(closed);
        let routed = transport(Some(&value), &target).await.unwrap();
        assert!(routed.post(&target).send().await.is_err());
        assert!(
            tokio::time::timeout(Duration::from_millis(100), listener.accept())
                .await
                .is_err()
        );
    }

    #[tokio::test]
    async fn https_uses_connect_and_does_not_ignore_tls_failures() {
        let listener = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let value = hop("http", listener.local_addr().unwrap().port());
        let task = tokio::spawn(async move {
            let (mut socket, _) = listener.accept().await.unwrap();
            let head = headers(&mut socket).await;
            assert!(head.starts_with("CONNECT provider.invalid:443 "));
            socket
                .write_all(b"HTTP/1.1 200 Connection established\r\n\r\n")
                .await
                .unwrap();
            // Receive TLS ClientHello, then close: the client must report TLS failure.
            assert_eq!(socket.read_u8().await.unwrap(), 0x16);
        });
        let target = "https://provider.invalid/v1/chat/completions";
        let client = transport(Some(&value), target).await.unwrap();
        assert!(client.post(target).send().await.is_err());
        task.await.unwrap();
    }

    impl russh::server::Server for SshFixture {
        type Handler = Self;
        fn new_client(&mut self, _: Option<std::net::SocketAddr>) -> Self {
            self.clone()
        }
    }
    impl russh::server::Handler for SshFixture {
        type Error = russh::Error;
        async fn auth_password(
            &mut self,
            user: &str,
            password: &str,
        ) -> Result<russh::server::Auth, Self::Error> {
            Ok(if user == "user" && password == "pass" {
                russh::server::Auth::Accept
            } else {
                russh::server::Auth::reject()
            })
        }
        async fn auth_publickey(
            &mut self,
            _: &str,
            _: &russh::keys::PublicKey,
        ) -> Result<russh::server::Auth, Self::Error> {
            Ok(russh::server::Auth::Accept)
        }
        async fn channel_open_direct_tcpip(
            &mut self,
            channel: russh::Channel<russh::server::Msg>,
            host: &str,
            port: u32,
            _: &str,
            _: u32,
            reply: russh::server::ChannelOpenHandle,
            _: &mut russh::server::Session,
        ) -> Result<(), Self::Error> {
            assert_eq!(host, "provider.invalid");
            assert_eq!(port, 8081);
            reply.accept().await;
            tokio::spawn(async move {
                let mut stream = channel.into_stream();
                let head = headers(&mut stream).await;
                assert!(head.to_lowercase().contains("host: provider.invalid:8081"));
                stream.write_all(b"HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nTransfer-Encoding: chunked\r\n\r\n9\r\ndata: a\n\n\r\n").await.unwrap();
                tokio::time::sleep(Duration::from_millis(150)).await;
                let _ = stream
                    .write_all(b"e\r\ndata: [DONE]\n\n\r\n0\r\n\r\n")
                    .await;
            });
            Ok(())
        }
    }
    #[tokio::test]
    async fn ssh_password_key_streaming_pinning_and_cleanup() {
        use russh::server::Server;
        let key =
            russh::keys::PrivateKey::random(&mut rand::rng(), russh::keys::Algorithm::Ed25519)
                .unwrap();
        let fingerprint = key
            .public_key()
            .fingerprint(russh::keys::HashAlg::Sha256)
            .to_string();
        let config = Arc::new(russh::server::Config {
            keys: vec![key.clone()],
            auth_rejection_time: Duration::ZERO,
            ..Default::default()
        });
        let listener = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let mut value = hop("ssh", listener.local_addr().unwrap().port());
        value.username = "user".into();
        value.secret = "pass".into();
        value.host_key = fingerprint;
        let task = tokio::spawn(async move {
            SshFixture.run_on_socket(config, &listener).await.unwrap();
        });
        let target = "http://provider.invalid:8081/v1/chat/completions";
        let file = std::env::temp_dir().join(format!("clx-hop-key-{}", uuid::Uuid::new_v4()));
        key.write_openssh_file(&file, russh::keys::ssh_key::LineEnding::LF)
            .unwrap();
        for mode in ["password", "key"] {
            value.auth_mode = mode.into();
            if mode == "key" {
                value.secret.clear();
                value.key_path = file.to_string_lossy().into();
            }
            let transport = transport(Some(&value), target).await.unwrap();
            let local = transport.local_port.unwrap();
            let mut response = transport.post(target).send().await.unwrap();
            assert_eq!(
                response.chunk().await.unwrap().unwrap().as_ref(),
                b"data: a\n\n"
            );
            assert!(response.text().await.unwrap().contains("[DONE]"));
            drop(transport);
            tokio::task::yield_now().await;
            assert!(tokio::net::TcpStream::connect(("127.0.0.1", local))
                .await
                .is_err());
        }
        std::fs::remove_file(file).unwrap();
        value.host_key = format!("SHA256:{}", "a".repeat(43));
        assert!(transport(Some(&value), target).await.is_err());
        task.abort();
    }
}

use russh::{client, keys::PrivateKeyWithHashAlg};
use serde::{Deserialize, Serialize};
use std::{sync::Arc, time::Duration};
use tokio::{net::TcpListener, task::JoinHandle};

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProxyHop {
    pub kind: String,
    pub host: String,
    pub port: u16,
    #[serde(default)]
    pub username: String,
    #[serde(default)]
    pub secret: String,
    #[serde(default)]
    pub key_path: String,
    #[serde(default)]
    pub auth_mode: String,
    #[serde(default)]
    pub host_key: String,
}

impl std::fmt::Debug for ProxyHop {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("ProxyHop")
            .field("kind", &self.kind)
            .finish_non_exhaustive()
    }
}

impl ProxyHop {
    pub fn validate(&self) -> Result<(), String> {
        if !["http", "https", "socks4", "socks5", "ssh"].contains(&self.kind.as_str()) {
            return Err("Unsupported hop type".into());
        }
        if self.port == 0
            || self.host.trim().is_empty()
            || self
                .host
                .chars()
                .any(|c| c.is_whitespace() || "/@?#".contains(c) || c == char::from(92))
        {
            return Err("Hop requires a hostname/IP and a port from 1 to 65535".into());
        }
        if self.kind == "ssh" {
            if self.username.is_empty() {
                return Err("SSH username is required".into());
            }
            match self.auth_mode.as_str() {
                "password" if !self.secret.is_empty() => {}
                "key" if !self.key_path.is_empty() => {}
                _ => return Err("SSH requires a password or private key path".into()),
            }
            if !self.host_key.starts_with("SHA256:") || self.host_key.len() != 50 {
                return Err(
                    "SSH server SHA256 fingerprint is required (from your server administrator)"
                        .into(),
                );
            }
        } else if self.kind == "socks4" && (!self.username.is_empty() || !self.secret.is_empty()) {
            return Err(
                "SOCKS4 credentials are not supported; use SOCKS5 for authentication".into(),
            );
        } else if !self.secret.is_empty() && self.username.is_empty() {
            return Err("Proxy password requires a username".into());
        }
        Ok(())
    }

    fn proxy_url(&self) -> Result<Url, String> {
        self.validate()?;
        let scheme = if self.kind == "socks5" {
            "socks5h"
        } else {
            &self.kind
        };
        let mut url = Url::parse(&format!("{scheme}://localhost")).map_err(|_| "Invalid hop")?;
        url.set_host(Some(self.host.trim()))
            .map_err(|_| "Invalid hop host")?;
        url.set_port(Some(self.port))
            .map_err(|_| "Invalid hop port")?;
        url.set_username(&self.username)
            .map_err(|_| "Invalid hop username")?;
        if !self.secret.is_empty() {
            url.set_password(Some(&self.secret))
                .map_err(|_| "Invalid hop password")?;
        }
        Ok(url)
    }
}

/// Owns the forwarding task for the full response lifetime, including SSE.
/// Dropping/cancelling a request closes its listener and every accepted channel.
pub struct Transport {
    pub client: Client,
    tunnel: Option<JoinHandle<()>>,
    #[cfg(test)]
    local_port: Option<u16>,
}
impl Transport {
    pub fn post(&self, target: &str) -> reqwest::RequestBuilder {
        self.client.post(target)
    }
}

async fn forward_ssh_http(
    mut socket: tokio::net::TcpStream,
    ssh: Arc<client::Handle<PinnedKey>>,
    host: String,
    port: u16,
) -> Result<(), ()> {
    use tokio::io::{AsyncReadExt, AsyncWriteExt};
    let head = tokio::time::timeout(Duration::from_secs(15), async {
        let mut bytes = Vec::new();
        while !bytes.ends_with(b"\r\n\r\n") {
            if bytes.len() >= 16384 {
                return Err(());
            }
            bytes.push(socket.read_u8().await.map_err(|_| ())?);
        }
        String::from_utf8(bytes).map_err(|_| ())
    })
    .await
    .map_err(|_| ())??;
    let (first, rest) = head.split_once("\r\n").ok_or(())?;
    let parts: Vec<_> = first.split_whitespace().collect();
    if parts.len() != 3 {
        return Err(());
    }
    let connect = parts[0] == "CONNECT";
    let target = Url::parse(&if connect {
        format!("https://{}", parts[1])
    } else {
        parts[1].to_string()
    })
    .map_err(|_| ())?;
    if target.host_str() != Some(host.as_str()) || target.port_or_known_default() != Some(port) {
        socket
            .write_all(b"HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\n\r\n")
            .await
            .map_err(|_| ())?;
        return Err(());
    }
    let channel = tokio::time::timeout(
        Duration::from_secs(30),
        ssh.channel_open_direct_tcpip(host, port as u32, "127.0.0.1", 0),
    )
    .await
    .map_err(|_| ())?
    .map_err(|_| ())?;
    let mut stream = channel.into_stream();
    if connect {
        socket
            .write_all(b"HTTP/1.1 200 Connection established\r\n\r\n")
            .await
            .map_err(|_| ())?;
    } else {
        let path = match target.query() {
            Some(query) => format!("{}?{query}", target.path()),
            None => target.path().to_string(),
        };
        let forwarded = format!("{} {} {}\r\n{}", parts[0], path, parts[2], rest);
        stream
            .write_all(forwarded.as_bytes())
            .await
            .map_err(|_| ())?;
    }
    tokio::io::copy_bidirectional(&mut socket, &mut stream)
        .await
        .map_err(|_| ())?;
    Ok(())
}

impl Drop for Transport {
    fn drop(&mut self) {
        if let Some(task) = &self.tunnel {
            task.abort();
        }
    }
}

struct PinnedKey(String);
impl client::Handler for PinnedKey {
    type Error = russh::Error;
    async fn check_server_key(
        &mut self,
        key: &russh::keys::PublicKey,
    ) -> Result<bool, Self::Error> {
        Ok(key
            .fingerprint(russh::keys::ssh_key::HashAlg::Sha256)
            .to_string()
            == self.0)
    }
}

pub async fn transport(hop: Option<&ProxyHop>, target: &str) -> Result<Transport, String> {
    let mut builder = Client::builder()
        .no_proxy()
        .redirect(reqwest::redirect::Policy::none())
        .connect_timeout(Duration::from_secs(30))
        .timeout(Duration::from_secs(300));
    let mut tunnel = None;
    if let Some(hop) = hop {
        hop.validate()?;
        if hop.kind != "ssh" {
            builder = builder.proxy(
                reqwest::Proxy::all(hop.proxy_url()?.as_str())
                    .map_err(|_| "Invalid outbound proxy configuration")?,
            );
        } else {
            let target = Url::parse(target).map_err(|_| "Invalid upstream URL")?;
            if !["http", "https"].contains(&target.scheme()) {
                return Err("SSH upstream must use HTTP or HTTPS".into());
            }
            let host = target
                .host_str()
                .ok_or("Missing upstream host")?
                .to_string();
            let port = target
                .port_or_known_default()
                .ok_or("Missing upstream port")?;
            let ssh_config = Arc::new(client::Config {
                keepalive_interval: Some(Duration::from_secs(20)),
                keepalive_max: 3,
                ..Default::default()
            });
            let connect = async {
                let mut ssh = client::connect(
                    ssh_config,
                    (hop.host.as_str(), hop.port),
                    PinnedKey(hop.host_key.clone()),
                )
                .await
                .map_err(|_| "SSH connection or server fingerprint verification failed")?;
                let auth = if hop.auth_mode == "password" {
                    ssh.authenticate_password(&hop.username, &hop.secret).await
                } else {
                    let key = russh::keys::load_secret_key(
                        &hop.key_path,
                        if hop.secret.is_empty() {
                            None
                        } else {
                            Some(hop.secret.as_str())
                        },
                    )
                    .map_err(|_| "Cannot load SSH key (check path and passphrase)")?;
                    let hash = ssh
                        .best_supported_rsa_hash()
                        .await
                        .map_err(|_| "SSH algorithm negotiation failed")?
                        .flatten();
                    ssh.authenticate_publickey(
                        &hop.username,
                        PrivateKeyWithHashAlg::new(Arc::new(key), hash),
                    )
                    .await
                }
                .map_err(|_| "SSH authentication failed")?;
                if !auth.success() {
                    return Err("SSH authentication rejected");
                }
                Ok(ssh)
            };
            let ssh = tokio::time::timeout(Duration::from_secs(30), connect)
                .await
                .map_err(|_| "SSH connection/authentication timed out")??;
            let listener = TcpListener::bind(("127.0.0.1", 0))
                .await
                .map_err(|_| "Cannot bind SSH loopback tunnel")?;
            let address = listener
                .local_addr()
                .map_err(|_| "Cannot read tunnel address")?;
            builder = builder.proxy(
                reqwest::Proxy::all(format!("http://{address}"))
                    .map_err(|_| "Cannot configure SSH loopback transport")?,
            );
            let ssh = Arc::new(ssh);
            let task = tokio::spawn(async move {
                let mut channels = tokio::task::JoinSet::new();
                loop {
                    tokio::select! {
                        accepted = listener.accept() => {
                            let Ok((socket, _)) = accepted else { break };
                            let ssh = ssh.clone();
                            let host = host.clone();
                            channels.spawn(async move {
                                let _ = forward_ssh_http(socket, ssh, host, port).await;
                            });
                        }
                        _ = channels.join_next(), if !channels.is_empty() => {}
                    }
                }
            });
            tunnel = Some(task);
            let client = match builder.build() {
                Ok(client) => client,
                Err(_) => {
                    if let Some(task) = &tunnel {
                        task.abort();
                    }
                    return Err("Cannot build SSH HTTP transport".into());
                }
            };
            return Ok(Transport {
                client,
                tunnel,
                #[cfg(test)]
                local_port: Some(address.port()),
            });
        }
    }
    Ok(Transport {
        client: builder
            .build()
            .map_err(|_| "Cannot build upstream transport")?,
        tunnel,
        #[cfg(test)]
        local_port: None,
    })
}
