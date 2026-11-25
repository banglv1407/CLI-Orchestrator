use super::{proxy_hop::ProxyHop, web_browser};
use base64::Engine;
use std::{
    collections::HashMap,
    io,
    net::SocketAddr,
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc, Mutex,
    },
    time::Duration,
};
#[cfg(test)]
use tokio::io::AsyncReadExt;
use tokio::{
    io::{AsyncBufRead, AsyncBufReadExt, AsyncRead, AsyncWrite, AsyncWriteExt, BufReader},
    net::{TcpListener, TcpStream},
    task::JoinHandle,
};
use tokio_util::sync::CancellationToken;

pub(crate) trait Connection: AsyncRead + AsyncWrite + Unpin + Send {}
impl<T: AsyncRead + AsyncWrite + Unpin + Send> Connection for T {}
pub(crate) type Stream = Box<dyn Connection>;
const DEADLINE: Duration = Duration::from_secs(15);
fn failure(message: &'static str) -> io::Error {
    io::Error::other(message)
}

struct Connector {
    hop: ProxyHop,
    chain: super::web_browser_chain::ProxyChain,
}
impl Connector {
    async fn new_route(hops: Vec<ProxyHop>) -> Result<Self, String> {
        let hop = hops
            .last()
            .cloned()
            .ok_or("Could not configure the Web connection.")?;
        let chain = super::web_browser_chain::ProxyChain::new(hops).await?;
        Ok(Self { hop, chain })
    }
    async fn endpoint(&self) -> io::Result<Stream> {
        self.chain.endpoint(self.chain.hops.len() - 1).await
    }
    async fn origin(&self, target: &Target) -> io::Result<Stream> {
        self.chain
            .origin(&super::web_browser_chain::Endpoint {
                host: target.host.clone(),
                port: target.port,
            })
            .await
    }
}

struct ActiveRoute {
    id: uuid::Uuid,
    connector: Connector,
    cancel: CancellationToken,
    error: Mutex<Option<String>>,
    leases: AtomicUsize,
}

struct RelayServer {
    address: SocketAddr,
    active: Arc<Mutex<Option<Arc<ActiveRoute>>>>,
    cancel: CancellationToken,
    task: JoinHandle<()>,
}

impl Drop for RelayServer {
    fn drop(&mut self) {
        self.cancel.cancel();
        self.task.abort();
    }
}

pub struct BrowserRouteLease {
    server: Arc<RelayServer>,
    route: Arc<ActiveRoute>,
}
impl BrowserRouteLease {
    pub fn proxy_url(&self) -> tauri::Url {
        tauri::Url::parse(&format!("http://{}", self.server.address)).unwrap()
    }
    pub fn take_error(&self) -> Option<String> {
        self.route.error.lock().ok()?.take()
    }
    pub fn clear_error(&self) {
        if let Ok(mut error) = self.route.error.lock() {
            *error = None;
        }
    }
}
impl Drop for BrowserRouteLease {
    fn drop(&mut self) {
        if self.route.leases.fetch_sub(1, Ordering::AcqRel) != 1 {
            return;
        }
        self.route.cancel.cancel();
        if let Ok(mut active) = self.server.active.lock() {
            if active
                .as_ref()
                .is_some_and(|route| route.id == self.route.id)
            {
                *active = None;
            }
        }
    }
}

#[derive(Default)]
pub struct BrowserRelayPool {
    servers: HashMap<String, Arc<RelayServer>>,
}

impl BrowserRelayPool {
    #[cfg(test)]
    pub async fn acquire(
        &mut self,
        key: String,
        hop: ProxyHop,
    ) -> Result<BrowserRouteLease, String> {
        self.acquire_route(key, vec![hop]).await
    }
    pub async fn acquire_route(
        &mut self,
        key: String,
        hops: Vec<ProxyHop>,
    ) -> Result<BrowserRouteLease, String> {
        if let Some(server) = self.servers.get(&key) {
            let route = server.active.lock().ok().and_then(|active| active.clone());
            if let Some(route) = route
                .filter(|route| !route.cancel.is_cancelled() && route.connector.chain.hops == hops)
            {
                route.leases.fetch_add(1, Ordering::Relaxed);
                return Ok(BrowserRouteLease {
                    server: server.clone(),
                    route,
                });
            }
        }
        let connector = Connector::new_route(hops).await?;
        let server = match self.servers.get(&key) {
            Some(server) => server.clone(),
            None => {
                let listener = TcpListener::bind(("127.0.0.1", 0))
                    .await
                    .map_err(|_| "Could not start the Web connection adapter.")?;
                let address = listener
                    .local_addr()
                    .map_err(|_| "Could not start the Web connection adapter.")?;
                let active = Arc::new(Mutex::new(None::<Arc<ActiveRoute>>));
                let accepted_active = active.clone();
                let cancel = CancellationToken::new();
                let listener_cancel = cancel.clone();
                let task = tokio::spawn(async move {
                    let mut workers = tokio::task::JoinSet::new();
                    let permits = Arc::new(tokio::sync::Semaphore::new(128));
                    loop {
                        tokio::select! {
                            _ = listener_cancel.cancelled() => break,
                            _ = workers.join_next(), if !workers.is_empty() => {},
                            accepted = listener.accept() => {
                                let Ok((socket, _)) = accepted else { break };
                                let route = accepted_active.lock().ok().and_then(|active| active.clone());
                                let permits = permits.clone();
                                workers.spawn(async move {
                                    let Some(route) = route else { let _ = reject(socket, 503).await; return; };
                                    tokio::select! {
                                        _ = route.cancel.cancelled() => {},
                                        _ = async {
                                            let Ok(_permit) = permits.acquire_owned().await else { return; };
                                            let mut socket = BufReader::new(socket);
                                            if let Err(error) = forward(&mut socket, &route.connector).await {
                                                if error.kind() != io::ErrorKind::UnexpectedEof {
                                                    if let Ok(mut last) = route.error.lock() { *last = Some(error.to_string()); }
                                                }
                                                let _ = reject(&mut socket, 502).await;
                                            }
                                        } => {},
                                    }
                                });
                            }
                        }
                    }
                });
                let server = Arc::new(RelayServer {
                    address,
                    active,
                    cancel,
                    task,
                });
                self.servers.insert(key, server.clone());
                server
            }
        };
        let route = Arc::new(ActiveRoute {
            id: uuid::Uuid::new_v4(),
            connector,
            cancel: CancellationToken::new(),
            error: Mutex::new(None),
            leases: AtomicUsize::new(1),
        });
        if let Ok(mut active) = server.active.lock() {
            if let Some(previous) = active.replace(route.clone()) {
                previous.cancel.cancel();
            }
        } else {
            return Err("Could not start the Web connection adapter.".into());
        }
        Ok(BrowserRouteLease { server, route })
    }
}

async fn reject(mut socket: impl AsyncWrite + Unpin, status: u16) -> io::Result<()> {
    socket.write_all(format!("HTTP/1.1 {status} Connection unavailable\r\nContent-Length: 0\r\nConnection: close\r\n\r\n").as_bytes()).await
}

pub(crate) async fn read_head(reader: &mut (impl AsyncBufRead + Unpin)) -> io::Result<Vec<u8>> {
    tokio::time::timeout(DEADLINE, async {
        let mut head = Vec::new();
        loop {
            if head.len() >= 65536 {
                return Err(failure("Proxy request headers are too large"));
            }
            let bytes = reader.fill_buf().await?;
            if bytes.is_empty() {
                return Err(io::ErrorKind::UnexpectedEof.into());
            }
            let count = bytes
                .iter()
                .position(|byte| *byte == b'\n')
                .map_or(bytes.len(), |index| index + 1)
                .min(65536 - head.len());
            head.extend_from_slice(&bytes[..count]);
            reader.consume(count);
            if head.ends_with(b"\r\n\r\n") {
                return Ok(head);
            }
        }
    })
    .await
    .map_err(|_| failure("Proxy request headers timed out"))?
}

struct Target {
    host: String,
    port: u16,
    url: tauri::Url,
    connect: bool,
    method: String,
    version: String,
}
fn target(head: &[u8]) -> io::Result<Target> {
    let line = head
        .split(|byte| *byte == b'\n')
        .next()
        .ok_or_else(|| failure("Invalid proxy request"))?;
    let line = std::str::from_utf8(line).map_err(|_| failure("Invalid proxy request"))?;
    let parts: Vec<_> = line.split_whitespace().collect();
    if parts.len() != 3
        || !matches!(parts[2], "HTTP/1.0" | "HTTP/1.1")
        || parts[0].len() > 32
        || !parts[0]
            .bytes()
            .all(|byte| byte.is_ascii_uppercase() || byte == b'-')
    {
        return Err(failure("Invalid proxy request"));
    }
    let connect = parts[0] == "CONNECT";
    let url = tauri::Url::parse(&if connect {
        format!("https://{}", parts[1])
    } else {
        parts[1].to_string()
    })
    .map_err(|_| failure("Invalid proxy destination"))?;
    if !web_browser::navigation_allowed(&url)
        || !url.username().is_empty()
        || url.password().is_some()
    {
        return Err(failure("Invalid proxy destination"));
    }
    let port = url
        .port_or_known_default()
        .ok_or_else(|| failure("Invalid proxy destination port"))?;
    let host = url.host_str().unwrap().trim_matches(['[', ']']).to_string();
    Ok(Target {
        host,
        port,
        url,
        connect,
        method: parts[0].to_string(),
        version: parts[2].to_string(),
    })
}

fn request_head(head: &[u8], target: &Target, hop: &ProxyHop, proxy: bool) -> Vec<u8> {
    let destination = if target.connect {
        format!("{}:{}", target.url.host_str().unwrap(), target.port)
    } else if proxy {
        target.url.as_str().to_string()
    } else {
        format!(
            "{}{}",
            target.url.path(),
            target
                .url
                .query()
                .map_or(String::new(), |query| format!("?{query}"))
        )
    };
    let mut result =
        format!("{} {} {}\r\n", target.method, destination, target.version).into_bytes();
    let lines: Vec<_> = head
        .split(|byte| *byte == b'\n')
        .skip(1)
        .map(|line| line.strip_suffix(b"\r").unwrap_or(line))
        .filter(|line| !line.is_empty())
        .collect();
    let upgrade = lines.iter().any(|line| {
        line.split(|byte| *byte == b':')
            .next()
            .is_some_and(|name| name.eq_ignore_ascii_case(b"upgrade"))
    });
    for line in lines {
        let name = line.split(|byte| *byte == b':').next().unwrap_or_default();
        if name.eq_ignore_ascii_case(b"proxy-authorization")
            || name.eq_ignore_ascii_case(b"proxy-connection")
            || (!upgrade && name.eq_ignore_ascii_case(b"connection"))
        {
            continue;
        }
        result.extend_from_slice(line);
        result.extend_from_slice(b"\r\n");
    }
    if proxy && !hop.username.is_empty() {
        let authorization = base64::engine::general_purpose::STANDARD
            .encode(format!("{}:{}", hop.username, hop.secret));
        result.extend_from_slice(
            format!("Proxy-Authorization: Basic {authorization}\r\n").as_bytes(),
        );
    }
    if !target.connect && !upgrade {
        result.extend_from_slice(b"Connection: close\r\n");
    }
    result.extend_from_slice(b"\r\n");
    result
}

async fn forward(socket: &mut BufReader<TcpStream>, connector: &Connector) -> io::Result<()> {
    let head = read_head(socket).await?;
    let target = target(&head)?;
    let proxy = matches!(connector.hop.kind.as_str(), "http" | "https");
    let stream = tokio::time::timeout(DEADLINE, async {
        if proxy {
            connector.endpoint().await
        } else {
            connector.origin(&target).await
        }
    })
    .await
    .map_err(|_| failure("Web connection timed out"))??;
    let mut upstream = BufReader::new(stream);
    if proxy {
        upstream
            .write_all(&request_head(&head, &target, &connector.hop, true))
            .await?;
        if target.connect {
            let reply = read_head(&mut upstream).await?;
            let status = reply.split(|byte| *byte == b' ').nth(1).unwrap_or_default();
            if status != b"200" {
                return Err(failure("HTTP proxy rejected the tunnel"));
            }
            socket
                .write_all(b"HTTP/1.1 200 Connection established\r\n\r\n")
                .await?;
        }
    } else if target.connect {
        socket
            .write_all(b"HTTP/1.1 200 Connection established\r\n\r\n")
            .await?;
    } else {
        upstream
            .write_all(&request_head(&head, &target, &connector.hop, false))
            .await?;
    }
    tokio::io::copy_bidirectional(socket, &mut upstream).await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
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
    async fn zero_terminated(socket: &mut TcpStream) -> Vec<u8> {
        let mut text = vec![];
        loop {
            let byte = socket.read_u8().await.unwrap();
            if byte == 0 {
                return text;
            }
            text.push(byte)
        }
    }
    #[tokio::test]
    async fn socks_remote_dns_streaming_shared_leases_and_stable_reopen() {
        for kind in ["socks4", "socks5"] {
            let fixture = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
            let mut connection = hop(kind, fixture.local_addr().unwrap().port());
            if kind == "socks5" {
                connection.username = "user".into();
                connection.secret = "pass".into();
            }
            let worker = tokio::spawn(async move {
                for _ in 0..3 {
                    let (mut socket, _) = fixture.accept().await.unwrap();
                    if kind == "socks5" {
                        let mut greeting = [0; 3];
                        socket.read_exact(&mut greeting).await.unwrap();
                        assert_eq!(greeting, [5, 1, 2]);
                        socket.write_all(&[5, 2]).await.unwrap();
                        assert_eq!(socket.read_u8().await.unwrap(), 1);
                        let n = socket.read_u8().await.unwrap();
                        let mut user = vec![0; n as usize];
                        socket.read_exact(&mut user).await.unwrap();
                        assert_eq!(user, b"user");
                        let n = socket.read_u8().await.unwrap();
                        let mut pass = vec![0; n as usize];
                        socket.read_exact(&mut pass).await.unwrap();
                        assert_eq!(pass, b"pass");
                        socket.write_all(&[1, 0]).await.unwrap();
                        let mut head = [0; 4];
                        socket.read_exact(&mut head).await.unwrap();
                        assert_eq!(head, [5, 1, 0, 3]);
                        let n = socket.read_u8().await.unwrap();
                        let mut host = vec![0; n as usize];
                        socket.read_exact(&mut host).await.unwrap();
                        assert_eq!(host, b"unresolvable.test");
                        assert_eq!(socket.read_u16().await.unwrap(), 8080);
                        socket
                            .write_all(&[5, 0, 0, 1, 127, 0, 0, 1, 0, 1])
                            .await
                            .unwrap();
                    } else {
                        let mut head = [0; 8];
                        socket.read_exact(&mut head).await.unwrap();
                        assert_eq!(head, [4, 1, 0x1f, 0x90, 0, 0, 0, 1]);
                        assert!(zero_terminated(&mut socket).await.is_empty());
                        assert_eq!(zero_terminated(&mut socket).await, b"unresolvable.test");
                        socket
                            .write_all(&[0, 90, 0, 0, 127, 0, 0, 1])
                            .await
                            .unwrap();
                    }
                    let mut socket = BufReader::new(socket);
                    let head = read_head(&mut socket).await.unwrap();
                    assert!(head.starts_with(b"POST /stream?q=1 HTTP/1.1\r\n"));
                    assert!(!String::from_utf8_lossy(&head)
                        .to_lowercase()
                        .contains("proxy-authorization"));
                    let mut body = [0; 4];
                    socket.read_exact(&mut body).await.unwrap();
                    assert_eq!(&body, b"body");
                    socket.write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 6\r\nConnection: close\r\n\r\nfirst-").await.unwrap();
                }
            });
            let mut pool = BrowserRelayPool::default();
            let first = pool.acquire(kind.into(), connection.clone()).await.unwrap();
            let address = first.server.address;
            let second = pool.acquire(kind.into(), connection.clone()).await.unwrap();
            drop(first);
            for _ in 0..2 {
                let mut socket = TcpStream::connect(address).await.unwrap();
                socket.write_all(b"POST http://unresolvable.test:8080/stream?q=1 HTTP/1.1\r\nHost: unresolvable.test:8080\r\nProxy-Authorization: Basic private\r\nContent-Length: 4\r\n\r\nbody").await.unwrap();
                let mut output = vec![];
                socket.read_to_end(&mut output).await.unwrap();
                assert!(output.ends_with(b"first-"));
            }
            drop(second);
            let mut closed = TcpStream::connect(address).await.unwrap();
            let mut output = vec![];
            closed.read_to_end(&mut output).await.unwrap();
            assert!(output.starts_with(b"HTTP/1.1 503"));
            let reopened = pool.acquire(kind.into(), connection).await.unwrap();
            assert_eq!(address, reopened.server.address);
            let mut socket = TcpStream::connect(address).await.unwrap();
            socket.write_all(b"POST http://unresolvable.test:8080/stream?q=1 HTTP/1.1\r\nHost: unresolvable.test:8080\r\nContent-Length: 4\r\n\r\nbody").await.unwrap();
            let mut output = vec![];
            socket.read_to_end(&mut output).await.unwrap();
            assert!(output.ends_with(b"first-"));
            worker.await.unwrap();
        }
    }
    #[tokio::test]
    async fn http_authentication_connect_preserves_buffered_tunnel_bytes() {
        let fixture = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let mut connection = hop("http", fixture.local_addr().unwrap().port());
        connection.username = "user".into();
        connection.secret = "pass".into();
        let worker = tokio::spawn(async move {
            let (socket, _) = fixture.accept().await.unwrap();
            let mut socket = BufReader::new(socket);
            let head = read_head(&mut socket).await.unwrap();
            let text = String::from_utf8(head).unwrap();
            assert!(text.starts_with("CONNECT site.test:443 HTTP/1.1"));
            assert!(text.contains("Proxy-Authorization: Basic dXNlcjpwYXNz"));
            socket
                .write_all(b"HTTP/1.1 200 OK\r\n\r\nserver-bytes")
                .await
                .unwrap();
            let mut bytes = [0; 12];
            socket.read_exact(&mut bytes).await.unwrap();
            assert_eq!(&bytes, b"client-bytes");
        });
        let mut pool = BrowserRelayPool::default();
        let route = pool.acquire("http-auth".into(), connection).await.unwrap();
        let socket = TcpStream::connect(route.server.address).await.unwrap();
        let mut socket = BufReader::new(socket);
        socket
            .write_all(b"CONNECT site.test:443 HTTP/1.1\r\nHost: site.test:443\r\n\r\nclient-bytes")
            .await
            .unwrap();
        assert!(read_head(&mut socket)
            .await
            .unwrap()
            .starts_with(b"HTTP/1.1 200"));
        let mut bytes = [0; 12];
        socket.read_exact(&mut bytes).await.unwrap();
        assert_eq!(&bytes, b"server-bytes");
        worker.await.unwrap();
    }
}
