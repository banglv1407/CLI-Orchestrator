use std::{
    fs,
    path::{Path, PathBuf},
};

use super::proxy_hop::ProxyHop;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tauri::Url;

pub const CONTENT_LABEL_PREFIX: &str = "clx-web-content-";

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", from = "WebBrowserConfigInput")]
pub struct WebBrowserConfig {
    pub url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub profile_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub route_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hop: Option<ProxyHop>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub hops: Vec<ProxyHop>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct WebBrowserConfigInput {
    url: String,
    #[serde(default)]
    profile_id: Option<String>,
    #[serde(default)]
    route_id: Option<String>,
    #[serde(default)]
    hop: Option<ProxyHop>,
    #[serde(default)]
    hops: Vec<ProxyHop>,
    #[serde(default)]
    proxy_host: Option<String>,
    #[serde(default)]
    proxy_port: Option<u16>,
}

impl From<WebBrowserConfigInput> for WebBrowserConfig {
    fn from(input: WebBrowserConfigInput) -> Self {
        let hop = input.hop.or_else(|| {
            input
                .proxy_host
                .filter(|host| !host.trim().is_empty())
                .map(|host| ProxyHop {
                    kind: "http".into(),
                    host,
                    port: input.proxy_port.unwrap_or(9090),
                    username: String::new(),
                    secret: String::new(),
                    key_path: String::new(),
                    auth_mode: "password".into(),
                    host_key: String::new(),
                })
        });
        Self {
            url: input.url,
            hop,
            hops: input.hops,
            profile_id: input.profile_id,
            route_id: input.route_id,
        }
    }
}

pub fn website_url(input: &str) -> Result<Url, String> {
    let input = input.trim();
    if input.is_empty() || input.len() > 8192 || input.chars().any(char::is_control) {
        return Err("Enter a valid HTTP or HTTPS website URL.".into());
    }
    let value = if input.contains("://") {
        input.to_owned()
    } else {
        format!("http://{input}")
    };
    let url = Url::parse(&value).map_err(|_| "Enter a valid HTTP or HTTPS website URL.")?;
    if !navigation_allowed(&url) || !url.username().is_empty() || url.password().is_some() {
        return Err("Enter a valid HTTP or HTTPS website URL.".into());
    }
    Ok(url)
}

pub fn navigation_allowed(url: &Url) -> bool {
    matches!(url.scheme(), "http" | "https")
        && url.host_str().is_some()
        && !matches!(
            url.host_str(),
            Some("tauri.localhost" | "asset.localhost" | "clx-module.localhost" | "ipc.localhost")
        )
}

impl WebBrowserConfig {
    pub fn proxy_url(&self) -> Result<Url, String> {
        let hop = self
            .hop
            .as_ref()
            .ok_or("Direct browsing has no proxy endpoint.")?;
        let host = hop.host.trim();
        if host.is_empty()
            || host.len() > 253
            || hop.port == 0
            || host
                .chars()
                .any(|c| c.is_whitespace() || c.is_control() || "/\\@?#\"'<>=".contains(c))
        {
            return Err("Enter a proxy hostname or IP and a port from 1 to 65535.".into());
        }
        let url = Url::parse(&format!("{}://{host}:{}", hop.kind, hop.port))
            .map_err(|_| "Enter a proxy hostname or IP and a port from 1 to 65535.")?;
        if url.host_str().is_none() || url.port_or_known_default() != Some(hop.port) {
            return Err("Enter a proxy hostname or IP and a port from 1 to 65535.".into());
        }
        Ok(url)
    }

    pub fn validated(&self) -> Result<Self, String> {
        if self.hop.is_some() && !self.hops.is_empty() {
            return Err("Choose one connection or an ordered proxy chain.".into());
        }
        let mut route = self.route_hops();
        if route.len() > 8 {
            return Err("A proxy chain can contain at most 8 hops.".into());
        }
        for value in &mut route {
            value.validate()?;
            let proxy = Self {
                hop: Some(value.clone()),
                ..Default::default()
            }
            .proxy_url()?;
            value.host = proxy.host_str().unwrap().to_string();
            if value.secret.len() > 16384 || value.username.chars().any(char::is_control) {
                return Err("Invalid connection credentials.".into());
            }
            if value.kind == "socks5" && (value.username.len() > 255 || value.secret.len() > 255) {
                return Err("SOCKS5 username and password must be at most 255 bytes.".into());
            }
            if matches!(value.kind.as_str(), "http" | "https") && value.username.contains(':') {
                return Err("HTTP proxy usernames cannot contain a colon.".into());
            }
        }
        let (hop, hops) = if route.len() <= 1 {
            (route.pop(), Vec::new())
        } else {
            (None, route)
        };
        let url = if self.url.trim().is_empty() {
            String::new()
        } else {
            website_url(&self.url)?.to_string()
        };
        Ok(Self {
            url,
            hop,
            hops,
            profile_id: self.profile_id.clone(),
            route_id: self.route_id.clone(),
        })
    }

    pub fn native_proxy(&self) -> Result<Option<Url>, String> {
        if !self.hops.is_empty() {
            return Ok(None);
        }
        match &self.hop {
            Some(hop)
                if matches!(hop.kind.as_str(), "http" | "socks5")
                    && hop.username.is_empty()
                    && hop.secret.is_empty() =>
            {
                self.proxy_url().map(Some)
            }
            _ => Ok(None),
        }
    }

    pub fn route_key(&self) -> Result<String, String> {
        let normalized = self.validated()?;
        if !normalized.hops.is_empty() {
            let identities: Vec<_> = normalized
                .hops
                .iter()
                .map(|hop| {
                    serde_json::json!([
                        hop.kind,
                        hop.host,
                        hop.port,
                        hop.username,
                        if hop.kind == "ssh" {
                            &hop.auth_mode
                        } else {
                            ""
                        },
                        if hop.kind == "ssh" && hop.auth_mode == "key" {
                            &hop.key_path
                        } else {
                            ""
                        },
                        if hop.kind == "ssh" { &hop.host_key } else { "" }
                    ])
                })
                .collect();
            let identity = serde_json::to_vec(&serde_json::json!([
                "chain",
                identities,
                normalized.profile_id,
                normalized.route_id
            ]))
            .map_err(|_| "Could not read Web settings.")?;
            return Ok(format!("{:x}", Sha256::digest(identity)));
        }
        let identity = match normalized.hop {
            None if normalized.route_id.is_none() && normalized.profile_id.is_none() => {
                "direct".to_string()
            }
            Some(ref hop)
                if hop.kind == "http"
                    && hop.username.is_empty()
                    && normalized.route_id.is_none()
                    && normalized
                        .profile_id
                        .as_deref()
                        .is_none_or(|id| id == "legacy-http") =>
            {
                Self {
                    hop: Some(hop.clone()),
                    ..Default::default()
                }
                .proxy_url()?
                .origin()
                .ascii_serialization()
            }
            Some(hop) => serde_json::to_string(&serde_json::json!([
                hop.kind,
                hop.host,
                hop.port,
                hop.username,
                if hop.kind == "ssh" {
                    hop.auth_mode.as_str()
                } else {
                    ""
                },
                if hop.kind == "ssh" && hop.auth_mode == "key" {
                    hop.key_path.as_str()
                } else {
                    ""
                },
                if hop.kind == "ssh" {
                    hop.host_key.as_str()
                } else {
                    ""
                },
                normalized.profile_id,
                normalized.route_id
            ]))
            .map_err(|_| "Could not read Web settings.")?,
            None => serde_json::to_string(&serde_json::json!([
                "direct",
                normalized.profile_id,
                normalized.route_id
            ]))
            .map_err(|_| "Could not read Web settings.")?,
        };
        Ok(format!("{:x}", Sha256::digest(identity.as_bytes())))
    }

    pub fn profile_directory(&self, root: &Path) -> Result<PathBuf, String> {
        let key = self.route_key()?;
        Ok(root.join("web-browser").join("profiles").join(key))
    }

    #[cfg(target_os = "windows")]
    pub fn browser_arguments(&self, proxy: Option<&Url>) -> Result<String, String> {
        // Wry replaces its generated arguments when custom arguments are set.
        // Include the proxy explicitly, with no DIRECT fallback or loopback bypass.
        let defaults = "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection";
        if self.hop.is_none() && self.hops.is_empty() {
            return Ok(format!("{defaults} --no-proxy-server"));
        }
        let proxy = proxy.ok_or("Could not configure the Web connection.")?;
        let endpoint = proxy.as_str().trim_end_matches('/');
        Ok(format!("{defaults} --proxy-server={endpoint} --proxy-bypass-list=<-loopback> --force-webrtc-ip-handling-policy=disable_non_proxied_udp"))
    }
}

impl WebBrowserConfig {
    pub fn route_hops(&self) -> Vec<ProxyHop> {
        if self.hops.is_empty() {
            self.hop.iter().cloned().collect()
        } else {
            self.hops.clone()
        }
    }
}

pub(crate) fn protect_config(config: &mut WebBrowserConfig) -> Result<(), String> {
    for hop in config.hop.iter_mut().chain(config.hops.iter_mut()) {
        hop.secret = super::web_browser_secrets::protect(&hop.secret)?;
    }
    Ok(())
}

pub(crate) fn unlock_config(config: &mut WebBrowserConfig) -> Result<(), String> {
    for hop in config.hop.iter_mut().chain(config.hops.iter_mut()) {
        hop.secret = super::web_browser_secrets::unlock(&hop.secret)?;
    }
    Ok(())
}

pub fn load_config(root: &Path) -> Result<WebBrowserConfig, String> {
    let path = root.join("web-browser.json");
    if !path.exists() {
        return Ok(WebBrowserConfig::default());
    }
    let raw = fs::read(&path).map_err(|_| "Could not read Web settings.")?;
    let mut config: WebBrowserConfig =
        serde_json::from_slice(&raw).map_err(|_| "Could not read Web settings.")?;
    unlock_config(&mut config)?;
    config.validated()
}

pub fn save_config(root: &Path, config: &WebBrowserConfig) -> Result<WebBrowserConfig, String> {
    let config = config.validated()?;
    fs::create_dir_all(root).map_err(|_| "Could not save Web settings.")?;
    let destination = root.join("web-browser.json");
    let temporary = root.join(format!("web-browser-{}.tmp", uuid::Uuid::new_v4()));
    let result = (|| {
        let mut stored = config.clone();
        protect_config(&mut stored)?;
        let raw = serde_json::to_vec_pretty(&stored).map_err(|_| "Could not save Web settings.")?;
        fs::write(&temporary, raw).map_err(|_| "Could not save Web settings.")?;
        fs::OpenOptions::new()
            .write(true)
            .open(&temporary)
            .and_then(|file| file.sync_all())
            .map_err(|_| "Could not save Web settings.")?;
        fs::rename(&temporary, &destination).map_err(|_| "Could not save Web settings.")?;
        Ok(config)
    })();
    if result.is_err() {
        let _ = fs::remove_file(&temporary);
    }
    result
}

#[derive(Clone, Copy, Debug, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BrowserBounds {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

impl BrowserBounds {
    pub fn validate(self) -> Result<Self, String> {
        if [self.x, self.y, self.width, self.height]
            .iter()
            .any(|n| !n.is_finite())
            || self.x < 0.0
            || self.y < 0.0
            || self.width < 1.0
            || self.height < 1.0
            || self.x + self.width > 65536.0
            || self.y + self.height > 65536.0
        {
            return Err("The Web viewport is not visible.".into());
        }
        Ok(self)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn config() -> WebBrowserConfig {
        WebBrowserConfig {
            url: "http://intranet.test:8080/app".into(),
            profile_id: None,
            route_id: None,
            hops: Vec::new(),
            hop: Some(ProxyHop {
                kind: "http".into(),
                host: "127.0.0.1".into(),
                port: 9090,
                username: String::new(),
                secret: String::new(),
                key_path: String::new(),
                auth_mode: "password".into(),
                host_key: String::new(),
            }),
        }
    }

    #[test]
    fn full_website_urls_preserve_origins_and_paths() {
        assert_eq!(
            website_url(" intranet.test:8080/app?q=1#tab ")
                .unwrap()
                .as_str(),
            "http://intranet.test:8080/app?q=1#tab"
        );
        assert_eq!(
            website_url("https://site.test/app").unwrap().scheme(),
            "https"
        );
    }

    #[test]
    fn chains_are_ordered_validate_every_hop_and_preserve_single_route_identity() {
        let original = config();
        let mut one = original.clone();
        one.hops = vec![one.hop.take().unwrap()];
        assert_eq!(one.validated().unwrap(), original);
        assert_eq!(one.route_key().unwrap(), original.route_key().unwrap());
        let mut chain = one.clone();
        let mut next = chain.hops[0].clone();
        next.kind = "socks5".into();
        next.port = 1080;
        chain.hops.push(next);
        assert!(chain.native_proxy().unwrap().is_none());
        let key = chain.route_key().unwrap();
        chain.hops.reverse();
        assert_ne!(key, chain.route_key().unwrap());
        chain.hops[1].port = 0;
        assert!(chain.validated().is_err());
        let mut too_many = one;
        too_many.hops = vec![original.hop.clone().unwrap(); 9];
        assert!(too_many.validated().is_err());
        too_many.hops.truncate(2);
        too_many.hop = original.hop;
        assert!(too_many.validated().is_err());
    }

    #[test]
    fn unsafe_schemes_origins_credentials_and_control_characters_are_rejected() {
        for value in [
            "",
            "file:///C:/secret",
            "javascript://alert(1)",
            "tauri://localhost",
            "http://tauri.localhost/",
            "http://asset.localhost/",
            "http://user:secret@host/",
        ] {
            assert!(website_url(value).is_err(), "{value}");
        }
        assert!(website_url("http://ho\nst/").is_err());
    }

    #[test]
    fn proxy_hosts_cannot_inject_browser_arguments_or_credentials() {
        for host in [
            "",
            "http://proxy",
            "proxy:8080",
            "user:pass@proxy",
            "proxy --no-proxy-server",
            "proxy\"",
            "proxy/path",
            "proxy?x",
        ] {
            let mut value = config();
            value.hop.as_mut().unwrap().host = host.into();
            assert!(value.proxy_url().is_err(), "{host}");
        }
        let mut value = config();
        value.hop.as_mut().unwrap().port = 0;
        assert!(value.proxy_url().is_err());
        value.hop.as_mut().unwrap().port = 80;
        value.hop.as_mut().unwrap().host = "proxy.test".into();
        assert_eq!(value.proxy_url().unwrap().as_str(), "http://proxy.test/");
        value.hop.as_mut().unwrap().host = "[::1]".into();
        assert!(value.proxy_url().is_ok());
    }

    #[test]
    fn profiles_follow_routes_and_are_separate_from_the_shell() {
        let value = config();
        let root = Path::new("profile-fixture");
        let first = value.profile_directory(root).unwrap();
        let mut changed_url = value.clone();
        changed_url.url = "http://another.test/".into();
        assert_eq!(first, changed_url.profile_directory(root).unwrap());
        changed_url.hop.as_mut().unwrap().port += 1;
        assert_ne!(first, changed_url.profile_directory(root).unwrap());
        assert!(first.starts_with(root.join("web-browser/profiles")));
    }

    #[test]
    fn validated_settings_roundtrip_and_invalid_save_preserves_previous_file() {
        let root = Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../.temp/web-browser-rust")
            .join(uuid::Uuid::new_v4().to_string());
        assert_eq!(load_config(&root).unwrap(), WebBrowserConfig::default());
        let valid = config();
        save_config(&root, &valid).unwrap();
        assert_eq!(load_config(&root).unwrap(), valid);
        let mut changed = valid.clone();
        changed.url = "https://another.test/".into();
        save_config(&root, &changed).unwrap();
        let mut bad = valid;
        bad.hop.as_mut().unwrap().port = 0;
        assert!(save_config(&root, &bad).is_err());
        assert_eq!(load_config(&root).unwrap(), changed);
        fs::remove_dir_all(&root).unwrap();
    }

    #[test]
    fn invalid_or_invisible_bounds_are_rejected() {
        let valid = BrowserBounds {
            x: 100.0,
            y: 140.0,
            width: 900.0,
            height: 600.0,
        };
        assert!(valid.validate().is_ok());
        for width in [0.0, -1.0, f64::NAN, f64::INFINITY, 70000.0] {
            assert!(BrowserBounds { width, ..valid }.validate().is_err());
        }
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn windows_arguments_use_only_the_explicit_proxy() {
        let config = config();
        let arguments = config
            .browser_arguments(config.native_proxy().unwrap().as_ref())
            .unwrap();
        assert!(arguments.contains("--proxy-server=http://127.0.0.1:9090"));
        assert!(arguments.contains("--proxy-bypass-list=<-loopback>"));
        assert!(!arguments.contains("direct://"));
        assert!(!arguments.contains("--ignore-certificate-errors"));
    }

    #[test]
    fn direct_is_default_and_legacy_http_settings_migrate() {
        let direct = WebBrowserConfig::default();
        assert!(direct.validated().is_ok());
        assert!(direct.hop.is_none());
        let old: WebBrowserConfig = serde_json::from_str(
            r#"{"url":"http://site.test/","proxyHost":"127.0.0.1","proxyPort":9090}"#,
        )
        .unwrap();
        assert_eq!(old.hop.as_ref().unwrap().kind, "http");
        assert_eq!(old.hop.as_ref().unwrap().port, 9090);
        assert!(!serde_json::to_string(&old).unwrap().contains("proxyHost"));
    }

    #[cfg(windows)]
    #[test]
    fn credentials_are_protected_on_disk_and_do_not_change_profile_identity() {
        let root = Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../.temp/web-browser-rust")
            .join(uuid::Uuid::new_v4().to_string());
        let mut value = config();
        value.hop.as_mut().unwrap().username = "fixture-user".into();
        value.hop.as_mut().unwrap().secret = "fixture-private-password".into();
        save_config(&root, &value).unwrap();
        let raw = fs::read_to_string(root.join("web-browser.json")).unwrap();
        assert!(!raw.contains("fixture-private-password"));
        assert!(raw.contains("dpapi:v1:"));
        assert_eq!(load_config(&root).unwrap(), value);
        let key = value.route_key().unwrap();
        value.hop.as_mut().unwrap().secret = "changed-password".into();
        assert_eq!(key, value.route_key().unwrap());
        fs::remove_file(root.join("web-browser.json")).unwrap();
        fs::remove_dir(root).unwrap();
    }
}
