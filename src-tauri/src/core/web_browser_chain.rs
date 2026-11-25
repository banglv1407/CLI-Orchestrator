use super::{
    proxy_hop::{self, PinnedKey, ProxyHop},
    web_browser_relay::{read_head, Stream},
};
use base64::Engine;
use std::{collections::HashMap, io, net::IpAddr, sync::Arc, time::Duration};
use tokio::{
    io::{AsyncReadExt, AsyncWriteExt, BufReader},
    net::TcpStream,
};

pub(crate) struct Endpoint {
    pub host: String,
    pub port: u16,
}
pub(crate) struct ProxyChain {
    pub hops: Vec<ProxyHop>,
    ssh: HashMap<usize, Arc<russh::client::Handle<PinnedKey>>>,
    tls: Option<tokio_native_tls::TlsConnector>,
}
impl Drop for ProxyChain {
    fn drop(&mut self) {
        let mut handles: Vec<_> = self.ssh.drain().collect();
        handles.sort_by_key(|(index, _)| std::cmp::Reverse(*index));
        if let Ok(runtime) = tokio::runtime::Handle::try_current() {
            runtime.spawn(async move {
                for (_, handle) in handles {
                    let _ = tokio::time::timeout(
                        Duration::from_millis(500),
                        handle.disconnect(russh::Disconnect::ByApplication, "", "en"),
                    )
                    .await;
                }
            });
        }
    }
}
fn failure(message: &'static str) -> io::Error {
    io::Error::other(message)
}
impl ProxyChain {
    pub async fn new(hops: Vec<ProxyHop>) -> Result<Self, String> {
        if hops.len() > 8 {
            return Err("A proxy chain can contain at most 8 hops.".into());
        }
        for hop in &hops {
            hop.validate()?;
        }
        let tls = if hops.iter().any(|hop| hop.kind == "https") {
            Some(tokio_native_tls::TlsConnector::from(
                native_tls::TlsConnector::new()
                    .map_err(|_| "Could not configure the Web connection.")?,
            ))
        } else {
            None
        };
        let mut route = Self {
            hops,
            ssh: HashMap::new(),
            tls,
        };
        for index in 0..route.hops.len() {
            if route.hops[index].kind != "ssh" {
                continue;
            }
            let stream = tokio::time::timeout(Duration::from_secs(15), route.endpoint(index))
                .await
                .map_err(|_| "Web connection timed out")?
                .map_err(|error| format!("Proxy hop {} failed: {error}", index + 1))?;
            let ssh = proxy_hop::connect_ssh_stream(&route.hops[index], stream)
                .await
                .map_err(|error| format!("Proxy hop {} failed: {error}", index + 1))?;
            route.ssh.insert(index, Arc::new(ssh));
        }
        Ok(route)
    }
    pub async fn endpoint(&self, index: usize) -> io::Result<Stream> {
        let hop = &self.hops[index];
        let stream = self
            .through(
                &Endpoint {
                    host: hop.host.trim_matches(['[', ']']).into(),
                    port: hop.port,
                },
                index,
            )
            .await?;
        self.tls_endpoint(stream, hop).await
    }
    pub async fn origin(&self, target: &Endpoint) -> io::Result<Stream> {
        self.through(target, self.hops.len()).await
    }
    async fn tls_endpoint(&self, stream: Stream, hop: &ProxyHop) -> io::Result<Stream> {
        if hop.kind != "https" {
            return Ok(stream);
        }
        let tls = self
            .tls
            .as_ref()
            .ok_or_else(|| failure("Could not configure the Web connection."))?;
        let secured = tls
            .connect(hop.host.trim_matches(['[', ']']), stream)
            .await
            .map_err(|_| failure("HTTPS proxy TLS verification or connection failed"))?;
        Ok(Box::new(secured))
    }
    async fn through(&self, target: &Endpoint, end: usize) -> io::Result<Stream> {
        let last_ssh = (0..end).rev().find(|index| self.hops[*index].kind == "ssh");
        let start = last_ssh.map_or(0, |index| index + 1);
        let destination = if start < end {
            Endpoint {
                host: self.hops[start].host.trim_matches(['[', ']']).into(),
                port: self.hops[start].port,
            }
        } else {
            Endpoint {
                host: target.host.clone(),
                port: target.port,
            }
        };
        let mut stream: Stream = if let Some(index) = last_ssh {
            let ssh = self
                .ssh
                .get(&index)
                .ok_or_else(|| failure("SSH connection is unavailable"))?;
            Box::new(
                ssh.channel_open_direct_tcpip(
                    &destination.host,
                    destination.port as u32,
                    "127.0.0.1",
                    0,
                )
                .await
                .map_err(|_| failure("SSH forwarding to the website failed"))?
                .into_stream(),
            )
        } else {
            let socket = TcpStream::connect((destination.host.as_str(), destination.port)).await?;
            socket.set_nodelay(true)?;
            Box::new(socket)
        };
        for index in start..end {
            let hop = &self.hops[index];
            stream = self.tls_endpoint(stream, hop).await?;
            let next = if index + 1 < end {
                Endpoint {
                    host: self.hops[index + 1].host.trim_matches(['[', ']']).into(),
                    port: self.hops[index + 1].port,
                }
            } else {
                Endpoint {
                    host: target.host.clone(),
                    port: target.port,
                }
            };
            stream = tunnel(stream, hop, &next).await.map_err(|error| {
                io::Error::other(format!("Proxy hop {} failed: {error}", index + 1))
            })?;
        }
        Ok(stream)
    }
}
async fn tunnel(mut stream: Stream, hop: &ProxyHop, target: &Endpoint) -> io::Result<Stream> {
    if matches!(hop.kind.as_str(), "http" | "https") {
        let host = if target.host.contains(':') {
            format!("[{}]", target.host)
        } else {
            target.host.clone()
        };
        let authority = format!("{host}:{}", target.port);
        let mut head = format!("CONNECT {authority} HTTP/1.1\r\nHost: {authority}\r\n");
        if !hop.username.is_empty() {
            head.push_str(&format!(
                "Proxy-Authorization: Basic {}\r\n",
                base64::engine::general_purpose::STANDARD
                    .encode(format!("{}:{}", hop.username, hop.secret))
            ));
        }
        head.push_str("\r\n");
        stream.write_all(head.as_bytes()).await?;
        let mut reader = BufReader::new(stream);
        let reply = read_head(&mut reader).await?;
        let status = reply.split(|byte| *byte == b' ').nth(1).unwrap_or_default();
        if status != b"200" {
            return Err(failure("HTTP proxy rejected the tunnel"));
        }
        return Ok(Box::new(reader));
    }
    match hop.kind.as_str() {
        "socks5" => {
            let authenticated = !hop.username.is_empty();
            stream
                .write_all(&[5, 1, if authenticated { 2 } else { 0 }])
                .await?;
            let mut response = [0; 2];
            stream.read_exact(&mut response).await?;
            if response != [5, if authenticated { 2 } else { 0 }] {
                return Err(failure("SOCKS5 authentication method rejected"));
            }
            if authenticated {
                let user = hop.username.as_bytes();
                let password = hop.secret.as_bytes();
                if user.len() > 255 || password.len() > 255 {
                    return Err(failure("SOCKS5 credentials are too long"));
                }
                let mut auth = vec![1, user.len() as u8];
                auth.extend_from_slice(user);
                auth.push(password.len() as u8);
                auth.extend_from_slice(password);
                stream.write_all(&auth).await?;
                stream.read_exact(&mut response).await?;
                if response != [1, 0] {
                    return Err(failure("SOCKS5 authentication rejected"));
                }
            }
            let mut request = vec![5, 1, 0];
            match target.host.parse::<IpAddr>() {
                Ok(IpAddr::V4(ip)) => {
                    request.push(1);
                    request.extend_from_slice(&ip.octets());
                }
                Ok(IpAddr::V6(ip)) => {
                    request.push(4);
                    request.extend_from_slice(&ip.octets());
                }
                Err(_) => {
                    let host = target.host.as_bytes();
                    if host.len() > 255 {
                        return Err(failure("SOCKS5 destination hostname is too long"));
                    }
                    request.extend_from_slice(&[3, host.len() as u8]);
                    request.extend_from_slice(host);
                }
            }
            request.extend_from_slice(&target.port.to_be_bytes());
            stream.write_all(&request).await?;
            let mut reply = [0; 4];
            stream.read_exact(&mut reply).await?;
            if reply[0] != 5 || reply[1] != 0 {
                return Err(failure("SOCKS5 forwarding to the website failed"));
            }
            let length = match reply[3] {
                1 => 4,
                4 => 16,
                3 => stream.read_u8().await? as usize,
                _ => return Err(failure("Invalid SOCKS5 response")),
            };
            let mut address = vec![0; length + 2];
            stream.read_exact(&mut address).await?;
        }
        "socks4" => {
            let mut request = vec![4, 1];
            request.extend_from_slice(&target.port.to_be_bytes());
            match target.host.parse::<IpAddr>() {
                Ok(IpAddr::V4(ip)) => {
                    request.extend_from_slice(&ip.octets());
                    request.push(0);
                }
                Ok(IpAddr::V6(_)) => {
                    return Err(failure("SOCKS4 does not support IPv6 destinations"))
                }
                Err(_) => {
                    request.extend_from_slice(&[0, 0, 0, 1, 0]);
                    request.extend_from_slice(target.host.as_bytes());
                    request.push(0);
                }
            }
            stream.write_all(&request).await?;
            let mut reply = [0; 8];
            stream.read_exact(&mut reply).await?;
            if reply[1] != 90 {
                return Err(failure("SOCKS4 forwarding to the website failed"));
            }
        }
        _ => return Err(failure("Unsupported Web connection")),
    }
    Ok(stream)
}
