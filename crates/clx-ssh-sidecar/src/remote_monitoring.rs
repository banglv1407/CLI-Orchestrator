use russh::{client, keys::load_secret_key, keys::PrivateKeyWithHashAlg, ChannelMsg};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::Duration;

const SSH_TIMEOUT: Duration = Duration::from_secs(12);

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SshEndpointConfig {
    pub host: String,
    pub ssh_port: u16,
    pub user: String,
    pub auth_mode: String,
    pub key_path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitorConfig {
    pub id: String,
    pub name: String,
    pub target: Option<SshEndpointConfig>,
    pub jump: Option<SshEndpointConfig>,
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

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandOutput {
    pub stdout: String,
    pub stderr: String,
    pub exit_status: Option<u32>,
}

impl SshRouteSession {
    pub async fn connect(
        monitor: &MonitorConfig,
        target_secret: Option<String>,
        jump_secret: Option<String>,
    ) -> Result<Self, String> {
        let target = monitor
            .target
            .as_ref()
            .ok_or_else(|| "SSH target is missing".to_string())?;
        let config = Arc::new(client::Config {
            inactivity_timeout: Some(Duration::from_secs(30)),
            keepalive_interval: Some(Duration::from_secs(15)),
            keepalive_max: 2,
            ..Default::default()
        });

        if let Some(jump) = monitor.jump.as_ref() {
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
                    target.host.clone(),
                    target.ssh_port as u32,
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
            authenticate(&mut target_handle, target, target_secret).await?;
            Ok(Self {
                target: target_handle,
                _jump: Some(jump_handle),
            })
        } else {
            let mut target_handle = tokio::time::timeout(
                SSH_TIMEOUT,
                client::connect(
                    config,
                    (target.host.as_str(), target.ssh_port),
                    AcceptAnyServerKey,
                ),
            )
            .await
            .map_err(|_| "Target SSH connection timed out".to_string())?
            .map_err(|error| format!("Target SSH connection failed: {error}"))?;
            authenticate(&mut target_handle, target, target_secret).await?;
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
                .map_err(|error| format!("Failed to close SSH stdin: {error}"))?;
        }

        let mut stdout = Vec::new();
        let mut stderr = Vec::new();
        let mut exit_status = None;

        while let Some(msg) = channel.wait().await {
            match msg {
                ChannelMsg::Data { data } => stdout.extend_from_slice(&data),
                ChannelMsg::ExtendedData { data, ext: 1 } => stderr.extend_from_slice(&data),
                ChannelMsg::ExitStatus { exit_status: code } => exit_status = Some(code),
                ChannelMsg::Eof | ChannelMsg::Close => break,
                _ => {}
            }
        }

        Ok(CommandOutput {
            stdout: String::from_utf8_lossy(&stdout).to_string(),
            stderr: String::from_utf8_lossy(&stderr).to_string(),
            exit_status,
        })
    }
}

async fn authenticate(
    handle: &mut client::Handle<AcceptAnyServerKey>,
    endpoint: &SshEndpointConfig,
    secret: Option<String>,
) -> Result<(), String> {
    if endpoint.auth_mode == "key" {
        let key_path = endpoint
            .key_path
            .as_ref()
            .ok_or_else(|| format!("Key path missing for {}", endpoint.user))?;
        let key = load_secret_key(key_path, secret.as_deref())
            .map_err(|error| format!("Failed to load private key {key_path}: {error}"))?;
        let auth_result = handle
            .authenticate_publickey(
                endpoint.user.clone(),
                PrivateKeyWithHashAlg::new(Arc::new(key), None),
            )
            .await
            .map_err(|error| format!("SSH key authentication request failed: {error}"))?;
        if !auth_result.success() {
            return Err(format!(
                "SSH key authentication rejected for {}",
                endpoint.user
            ));
        }
    } else {
        let password = secret.ok_or_else(|| {
            format!("Password missing for SSH user {}", endpoint.user)
        })?;
        let auth_result = handle
            .authenticate_password(endpoint.user.clone(), password)
            .await
            .map_err(|error| format!("SSH password authentication request failed: {error}"))?;
        if !auth_result.success() {
            return Err(format!(
                "SSH password authentication rejected for {}",
                endpoint.user
            ));
        }
    }
    Ok(())
}
