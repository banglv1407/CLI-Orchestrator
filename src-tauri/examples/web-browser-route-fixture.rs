//! Loopback-only SSH forwarder for native browser validation. No shell support.
use russh::{
    keys::{ssh_key::LineEnding, Algorithm, HashAlg, PrivateKey, PublicKey},
    server::{self, Server},
};
use std::{collections::HashMap, path::PathBuf, sync::Arc, time::Duration};
use tokio::net::{TcpListener, TcpStream};

#[derive(Clone)]
struct Fixture {
    public_key: PublicKey,
    destination_port: u32,
    destinations: Arc<HashMap<String, u16>>,
}
impl server::Server for Fixture {
    type Handler = Self;
    fn new_client(&mut self, _: Option<std::net::SocketAddr>) -> Self {
        self.clone()
    }
}
impl server::Handler for Fixture {
    type Error = russh::Error;
    async fn auth_password(
        &mut self,
        user: &str,
        password: &str,
    ) -> Result<server::Auth, Self::Error> {
        Ok(if user == "fixture" && password == "fixture-password" {
            server::Auth::Accept
        } else {
            server::Auth::reject()
        })
    }
    async fn auth_publickey(
        &mut self,
        user: &str,
        key: &PublicKey,
    ) -> Result<server::Auth, Self::Error> {
        Ok(if user == "fixture" && key == &self.public_key {
            server::Auth::Accept
        } else {
            server::Auth::reject()
        })
    }
    async fn channel_open_direct_tcpip(
        &mut self,
        channel: russh::Channel<server::Msg>,
        host: &str,
        port: u32,
        _: &str,
        _: u32,
        reply: server::ChannelOpenHandle,
        _: &mut server::Session,
    ) -> Result<(), Self::Error> {
        let mapped = self.destinations.get(&format!("{host}:{port}")).copied();
        if mapped.is_none()
            && (!matches!(
                host,
                "clx-web-fixture.test" | "assets.clx-web-fixture.test" | "127.0.0.1"
            ) || port != self.destination_port)
        {
            return Ok(());
        }
        let Ok(mut socket) = TcpStream::connect(("127.0.0.1", mapped.unwrap_or(port as u16))).await
        else {
            return Ok(());
        };
        reply.accept().await;
        tokio::spawn(async move {
            let _ = tokio::io::copy_bidirectional(&mut channel.into_stream(), &mut socket).await;
        });
        Ok(())
    }
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let root = PathBuf::from(
        std::env::args_os()
            .nth(1)
            .ok_or("fixture directory required")?,
    );
    let destination_port: u32 = std::env::args()
        .nth(2)
        .ok_or("fixture destination port required")?
        .parse()?;
    std::fs::create_dir_all(&root)?;
    let destinations = Arc::new(serde_json::from_str::<HashMap<String, u16>>(
        &std::env::args().nth(3).unwrap_or_else(|| "{}".into()),
    )?);
    let server_key = PrivateKey::random(&mut rand::rng(), Algorithm::Ed25519)?;
    let fingerprint = server_key
        .public_key()
        .fingerprint(HashAlg::Sha256)
        .to_string();
    let client_key = PrivateKey::random(&mut rand::rng(), Algorithm::Ed25519)?;
    let key_path = root.join("fixture_ed25519");
    client_key.write_openssh_file(&key_path, LineEnding::LF)?;
    let encrypted_path = root.join("fixture_ed25519_encrypted");
    client_key
        .encrypt(&mut rand::rng(), "fixture-passphrase")?
        .write_openssh_file(&encrypted_path, LineEnding::LF)?;
    let listener = TcpListener::bind(("127.0.0.1", 0)).await?;
    println!(
        "{}",
        serde_json::json!({"port":listener.local_addr()?.port(),"fingerprint":fingerprint,"keyPath":key_path,"encryptedKeyPath":encrypted_path})
    );
    let config = Arc::new(server::Config {
        keys: vec![server_key],
        auth_rejection_time: Duration::ZERO,
        ..Default::default()
    });
    Fixture {
        public_key: client_key.public_key().clone(),
        destination_port,
        destinations,
    }
    .run_on_socket(config, &listener)
    .await?;
    Ok(())
}
