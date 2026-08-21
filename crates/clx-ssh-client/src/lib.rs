pub use russh::{client, Channel, ChannelMsg};
use russh::keys::{load_secret_key, PrivateKeyWithHashAlg};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::Duration;
use zeroize::Zeroize;

const SSH_TIMEOUT: Duration = Duration::from_secs(12);

/// Minimal hop descriptor shared between monitoring.rs types and this crate.
/// The caller maps their own config struct into this before calling connect.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SshHop {
    pub host: String,
    pub ssh_port: u16,
    pub user: String,
    pub auth_mode: String,
    pub key_path: Option<String>,
}

#[derive(Clone)]
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

pub struct SshRouteSession {
    target: client::Handle<AcceptAnyServerKey>,
    _jump: Option<client::Handle<AcceptAnyServerKey>>,
}

#[derive(Debug)]
pub struct CommandOutput {
    pub stdout: String,
    pub stderr: String,
    pub exit_status: Option<u32>,
}

impl SshRouteSession {
    pub async fn connect(
        target_hop: &SshHop,
        jump_hop: Option<&SshHop>,
        target_secret: Option<String>,
        jump_secret: Option<String>,
    ) -> Result<Self, String> {
        let config = Arc::new(client::Config {
            inactivity_timeout: Some(Duration::from_secs(30)),
            keepalive_interval: Some(Duration::from_secs(15)),
            keepalive_max: 2,
            ..Default::default()
        });

        if let Some(jump) = jump_hop {
            let mut jump_handle = tokio::time::timeout(
                SSH_TIMEOUT,
                client::connect(
                    config.clone(),
                    (jump.host.as_str(), jump.ssh_port),
                    AcceptAnyServerKey,
                ),
            )
            .await
            .map_err(|_| "Jump-host SSH connection timed out".to_string())?
            .map_err(|error| format!("Jump-host SSH connection failed: {error}"))?;
            authenticate(&mut jump_handle, jump, jump_secret).await?;

            let channel = tokio::time::timeout(
                SSH_TIMEOUT,
                jump_handle.channel_open_direct_tcpip(
                    target_hop.host.clone(),
                    target_hop.ssh_port as u32,
                    "127.0.0.1",
                    0,
                ),
            )
            .await
            .map_err(|_| "Jump-host forwarding timed out".to_string())?
            .map_err(|error| format!("Jump-host forwarding failed: {error}"))?;

            let mut target_handle = tokio::time::timeout(
                SSH_TIMEOUT,
                client::connect_stream(config, channel.into_stream(), AcceptAnyServerKey),
            )
            .await
            .map_err(|_| "Target SSH handshake through jump host timed out".to_string())?
            .map_err(|error| format!("Target SSH handshake through jump host failed: {error}"))?;
            authenticate(&mut target_handle, target_hop, target_secret).await?;
            Ok(Self {
                target: target_handle,
                _jump: Some(jump_handle),
            })
        } else {
            let mut target_handle = tokio::time::timeout(
                SSH_TIMEOUT,
                client::connect(
                    config,
                    (target_hop.host.as_str(), target_hop.ssh_port),
                    AcceptAnyServerKey,
                ),
            )
            .await
            .map_err(|_| "Target SSH connection timed out".to_string())?
            .map_err(|error| format!("Target SSH connection failed: {error}"))?;
            authenticate(&mut target_handle, target_hop, target_secret).await?;
            Ok(Self {
                target: target_handle,
                _jump: None,
            })
        }
    }

    pub async fn exec_capture(
        &self,
        command: &str,
        stdin: Option<&[u8]>,
    ) -> Result<CommandOutput, String> {
        let mut channel = self
            .target
            .channel_open_session()
            .await
            .map_err(|error| format!("Failed to open SSH command channel: {error}"))?;
        channel
            .exec(true, command.as_bytes().to_vec())
            .await
            .map_err(|error| format!("Failed to start SSH command: {error}"))?;
        if let Some(input) = stdin {
            channel
                .data_bytes(input.to_vec())
                .await
                .map_err(|error| format!("Failed to send SSH command input: {error}"))?;
            channel
                .eof()
                .await
                .map_err(|error| format!("Failed to close SSH command input: {error}"))?;
        }

        let mut stdout = Vec::new();
        let mut stderr = Vec::new();
        let mut exit_status = None;
        while let Some(message) = channel.wait().await {
            match message {
                ChannelMsg::Data { data } => stdout.extend_from_slice(&data),
                ChannelMsg::ExtendedData { data, .. } => stderr.extend_from_slice(&data),
                ChannelMsg::ExitStatus {
                    exit_status: status,
                } => exit_status = Some(status),
                _ => {}
            }
        }
        Ok(CommandOutput {
            stdout: String::from_utf8_lossy(&stdout).to_string(),
            stderr: String::from_utf8_lossy(&stderr).to_string(),
            exit_status,
        })
    }

    pub async fn open_exec_channel(
        &self,
        command: &str,
        stdin: Option<&[u8]>,
    ) -> Result<Channel<client::Msg>, String> {
        let channel = self
            .target
            .channel_open_session()
            .await
            .map_err(|error| format!("Failed to open SSH log channel: {error}"))?;
        channel
            .exec(true, command.as_bytes().to_vec())
            .await
            .map_err(|error| format!("Failed to start SSH log command: {error}"))?;
        if let Some(input) = stdin {
            channel
                .data_bytes(input.to_vec())
                .await
                .map_err(|error| format!("Failed to send SSH log command input: {error}"))?;
        }
        Ok(channel)
    }
}

async fn authenticate(
    handle: &mut client::Handle<AcceptAnyServerKey>,
    hop: &SshHop,
    mut secret: Option<String>,
) -> Result<(), String> {
    let result = if hop.auth_mode == "password" {
        let password = secret
            .as_deref()
            .ok_or_else(|| "SSH password is not available in the credential vault".to_string())?;
        handle
            .authenticate_password(hop.user.clone(), password.to_string())
            .await
            .map_err(|error| format!("SSH password authentication failed: {error}"))?
    } else {
        let key_path = hop
            .key_path
            .as_ref()
            .ok_or_else(|| "SSH private key path is missing".to_string())?;
        let key = load_secret_key(key_path, secret.as_deref())
            .map_err(|error| format!("Failed to load SSH private key: {error}"))?;
        let hash = handle
            .best_supported_rsa_hash()
            .await
            .map_err(|error| format!("Failed to negotiate SSH key algorithm: {error}"))?
            .flatten();
        handle
            .authenticate_publickey(
                hop.user.clone(),
                PrivateKeyWithHashAlg::new(Arc::new(key), hash),
            )
            .await
            .map_err(|error| format!("SSH key authentication failed: {error}"))?
    };
    if let Some(secret) = secret.as_mut() {
        secret.zeroize();
    }
    if !result.success() {
        return Err(format!(
            "SSH authentication was rejected for {}@{}",
            hop.user, hop.host
        ));
    }
    Ok(())
}
