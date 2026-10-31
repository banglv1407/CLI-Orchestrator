use russh::{
    client,
    keys::{decode_secret_key, ssh_key::Fingerprint, HashAlg, PrivateKey},
    Disconnect,
};
use std::{
    fs::{self, OpenOptions},
    io::{ErrorKind, Write},
    path::Path,
    sync::{Arc, Mutex},
    time::Duration,
};

const PROBE_TIMEOUT: Duration = Duration::from_secs(10);
static HOST_KEY_LOCK: Mutex<()> = Mutex::new(());

pub fn is_sha256_fingerprint(value: &str) -> bool {
    value
        .parse::<Fingerprint>()
        .is_ok_and(|fingerprint| fingerprint.is_sha256())
}

pub(crate) fn validate_address(host: &str, port: u16) -> Result<&str, String> {
    let host = host.trim();
    let host = host
        .strip_prefix('[')
        .and_then(|host| host.strip_suffix(']'))
        .unwrap_or(host);
    if port == 0
        || host.is_empty()
        || host.len() > 253
        || host
            .chars()
            .any(|c| c.is_control() || c.is_whitespace() || "/@?#\\".contains(c))
        || (host.contains(':') && host.parse::<std::net::Ipv6Addr>().is_err())
    {
        return Err("Enter a valid SSH host and port.".into());
    }
    Ok(host)
}

struct ProbeKey(Arc<Mutex<Option<String>>>);

impl client::Handler for ProbeKey {
    type Error = russh::Error;

    async fn check_server_key(
        &mut self,
        key: &russh::keys::PublicKey,
    ) -> Result<bool, Self::Error> {
        if let Ok(mut fingerprint) = self.0.lock() {
            *fingerprint = Some(key.fingerprint(HashAlg::Sha256).to_string());
        }
        // Only this credential-free discovery connection accepts an unknown key.
        // The actual tunnel continues to require its saved exact fingerprint.
        Ok(true)
    }
}

pub async fn probe_ssh_fingerprint(host: &str, port: u16) -> Result<String, String> {
    probe_with_timeout(host, port, PROBE_TIMEOUT).await
}

async fn probe_with_timeout(host: &str, port: u16, timeout: Duration) -> Result<String, String> {
    let host = validate_address(host, port)?;
    let fingerprint = Arc::new(Mutex::new(None));
    let config = Arc::new(client::Config {
        inactivity_timeout: Some(timeout + Duration::from_secs(1)),
        ..Default::default()
    });
    let connection = tokio::time::timeout(
        timeout,
        client::connect(config, (host, port), ProbeKey(fingerprint.clone())),
    )
    .await
    .map_err(|_| "SSH fingerprint lookup timed out. Check the host and port.")?
    .map_err(|_| "Cannot read the SSH fingerprint. Check the host, port and SSH service.")?;

    let result = fingerprint
        .lock()
        .map_err(|_| "Cannot read the SSH fingerprint.")?
        .clone()
        .ok_or("Cannot read the SSH fingerprint.")?;
    // No authentication or channel requests are made by this connection.
    let _ = tokio::time::timeout(
        Duration::from_millis(500),
        connection.disconnect(Disconnect::ByApplication, "", "en"),
    )
    .await;
    Ok(result)
}

fn read_host_key(path: &Path) -> Result<PrivateKey, String> {
    let pem = fs::read_to_string(path).map_err(|_| "Cannot read the SSH server host key.")?;
    decode_secret_key(&pem, None).map_err(|_| "Cannot decode the SSH server host key.".into())
}

/// Shared by server startup and fingerprint display. Never replaces an existing key.
pub fn load_or_create_host_key(root_dir: &Path) -> Result<PrivateKey, String> {
    let _guard = HOST_KEY_LOCK
        .lock()
        .map_err(|_| "Cannot access the SSH server host key.")?;
    let path = root_dir.join("ssh_host_key.pem");
    match fs::metadata(&path) {
        Ok(_) => return read_host_key(&path),
        Err(error) if error.kind() == ErrorKind::NotFound => {}
        Err(_) => return Err("Cannot read the SSH server host key.".into()),
    }

    let key = PrivateKey::random(&mut rand::rng(), russh::keys::Algorithm::Ed25519)
        .map_err(|_| "Cannot generate the SSH server host key.")?;
    let pem = key
        .to_openssh(russh::keys::ssh_key::LineEnding::LF)
        .map_err(|_| "Cannot encode the SSH server host key.")?;
    fs::create_dir_all(root_dir).map_err(|_| "Cannot create the SSH server key directory.")?;
    let mut options = OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt;
        options.mode(0o600);
    }
    let mut file = match options.open(&path) {
        Ok(file) => file,
        // Another process may have created the key after the metadata check.
        Err(error) if error.kind() == ErrorKind::AlreadyExists => return read_host_key(&path),
        Err(_) => return Err("Cannot save the SSH server host key.".into()),
    };
    file.write_all(pem.as_bytes())
        .map_err(|_| "Cannot save the SSH server host key.")?;
    Ok(key)
}

pub fn server_fingerprint(root_dir: &Path) -> Result<String, String> {
    Ok(load_or_create_host_key(root_dir)?
        .public_key()
        .fingerprint(HashAlg::Sha256)
        .to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use russh::server::{Auth, Server};
    use std::sync::atomic::{AtomicUsize, Ordering};
    use tokio::net::TcpListener;

    #[derive(Clone)]
    struct Fixture(Arc<AtomicUsize>);
    impl Server for Fixture {
        type Handler = Self;
        fn new_client(&mut self, _: Option<std::net::SocketAddr>) -> Self {
            self.clone()
        }
    }
    impl russh::server::Handler for Fixture {
        type Error = russh::Error;
        async fn auth_none(&mut self, _: &str) -> Result<Auth, Self::Error> {
            self.0.fetch_add(1, Ordering::SeqCst);
            Ok(Auth::reject())
        }
        async fn auth_password(&mut self, _: &str, _: &str) -> Result<Auth, Self::Error> {
            self.0.fetch_add(1, Ordering::SeqCst);
            Ok(Auth::reject())
        }
        async fn auth_publickey(
            &mut self,
            _: &str,
            _: &russh::keys::PublicKey,
        ) -> Result<Auth, Self::Error> {
            self.0.fetch_add(1, Ordering::SeqCst);
            Ok(Auth::reject())
        }
    }

    #[test]
    fn validates_canonical_sha256_and_addresses() {
        let valid = format!("SHA256:{}", "A".repeat(43));
        assert!(is_sha256_fingerprint(&valid));
        for invalid in [
            format!("SHA256:{}", "!".repeat(43)),
            format!("SHA256:{}", "a".repeat(43)),
            format!("{valid}="),
            "MD5:aa:bb".into(),
            String::new(),
        ] {
            assert!(!is_sha256_fingerprint(&invalid));
        }
        for host in ["localhost", "127.0.0.1", "::1", "[::1]"] {
            assert!(validate_address(host, 22).is_ok());
        }
        for host in ["", "bad host", "ssh://host", "user@host", "host:22", "a\0b"] {
            assert!(validate_address(host, 22).is_err());
        }
        assert!(validate_address("localhost", 0).is_err());
    }

    #[tokio::test]
    async fn reads_real_key_without_any_authentication() {
        let key = PrivateKey::random(&mut rand::rng(), russh::keys::Algorithm::Ed25519).unwrap();
        let expected = key.public_key().fingerprint(HashAlg::Sha256).to_string();
        let config = Arc::new(russh::server::Config {
            keys: vec![key],
            ..Default::default()
        });
        let listener = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let port = listener.local_addr().unwrap().port();
        let auth_requests = Arc::new(AtomicUsize::new(0));
        let mut fixture = Fixture(auth_requests.clone());
        let task = tokio::spawn(async move {
            fixture.run_on_socket(config, &listener).await.unwrap();
        });
        assert_eq!(
            probe_ssh_fingerprint("127.0.0.1", port).await.unwrap(),
            expected
        );
        assert_eq!(auth_requests.load(Ordering::SeqCst), 0);
        task.abort();
    }

    #[tokio::test]
    async fn reports_refused_non_ssh_and_stalled_connections() {
        use tokio::io::AsyncWriteExt;
        let listener = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let port = listener.local_addr().unwrap().port();
        drop(listener);
        assert!(probe_ssh_fingerprint("127.0.0.1", port)
            .await
            .unwrap_err()
            .starts_with("Cannot read"));

        let listener = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let port = listener.local_addr().unwrap().port();
        let task = tokio::spawn(async move {
            let (mut socket, _) = listener.accept().await.unwrap();
            socket
                .write_all(b"HTTP/1.1 400 Bad Request\r\n\r\n")
                .await
                .unwrap();
        });
        assert!(probe_ssh_fingerprint("127.0.0.1", port).await.is_err());
        task.await.unwrap();

        let listener = TcpListener::bind(("127.0.0.1", 0)).await.unwrap();
        let port = listener.local_addr().unwrap().port();
        let task = tokio::spawn(async move {
            let (_socket, _) = listener.accept().await.unwrap();
            std::future::pending::<()>().await;
        });
        assert!(
            probe_with_timeout("127.0.0.1", port, Duration::from_millis(80))
                .await
                .unwrap_err()
                .contains("timed out")
        );
        task.abort();
    }

    #[test]
    fn local_identity_is_stable_and_invalid_keys_are_preserved() {
        let root =
            std::env::temp_dir().join(format!("clx-ssh-fingerprint-{}", uuid::Uuid::new_v4()));
        let first = server_fingerprint(&root).unwrap();
        let path = root.join("ssh_host_key.pem");
        let bytes = fs::read(&path).unwrap();
        assert!(is_sha256_fingerprint(&first));
        assert_eq!(server_fingerprint(&root).unwrap(), first);
        assert_eq!(
            load_or_create_host_key(&root)
                .unwrap()
                .public_key()
                .fingerprint(HashAlg::Sha256)
                .to_string(),
            first
        );
        assert_eq!(fs::read(&path).unwrap(), bytes);
        fs::write(&path, b"invalid key").unwrap();
        assert!(server_fingerprint(&root).is_err());
        assert_eq!(fs::read(&path).unwrap(), b"invalid key");
        fs::remove_file(&path).unwrap();
        fs::remove_dir(&root).unwrap();
    }

    #[test]
    fn concurrent_local_requests_keep_the_same_identity() {
        let root =
            std::env::temp_dir().join(format!("clx-ssh-fingerprint-{}", uuid::Uuid::new_v4()));
        let threads: Vec<_> = (0..4)
            .map(|_| {
                let root = root.clone();
                std::thread::spawn(move || server_fingerprint(&root).unwrap())
            })
            .collect();
        let fingerprints: Vec<_> = threads
            .into_iter()
            .map(|thread| thread.join().unwrap())
            .collect();
        assert!(fingerprints.iter().all(|value| value == &fingerprints[0]));
        fs::remove_file(root.join("ssh_host_key.pem")).unwrap();
        fs::remove_dir(root).unwrap();
    }
}
