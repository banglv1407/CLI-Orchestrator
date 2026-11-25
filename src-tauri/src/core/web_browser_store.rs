use super::web_browser::{self, WebBrowserConfig};
use serde::{Deserialize, Serialize};
use std::{fs, path::Path};

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BrowserSettings {
    pub version: u8,
    pub current: WebBrowserConfig,
    pub profiles: Vec<WebConnectionProfile>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct WebConnectionProfile {
    pub id: String,
    pub name: String,
    pub config: WebBrowserConfig,
}

pub fn load_settings(root: &Path) -> Result<BrowserSettings, String> {
    let path = root.join("web-browser.json");
    if !path.exists() {
        return Ok(BrowserSettings {
            version: 2,
            ..Default::default()
        });
    }
    let raw = fs::read(&path).map_err(|_| "Could not read Web settings.")?;
    let value: serde_json::Value =
        serde_json::from_slice(&raw).map_err(|_| "Could not read Web settings.")?;
    if value.get("current").is_some() {
        let mut settings: BrowserSettings =
            serde_json::from_value(value).map_err(|_| "Could not read Web settings.")?;
        if settings.version != 2 {
            return Err("Unsupported Web settings version.".into());
        }
        web_browser::unlock_config(&mut settings.current)?;
        settings.current = settings.current.validated()?;
        for profile in &mut settings.profiles {
            validate_name(&profile.name)?;
            web_browser::unlock_config(&mut profile.config)?;
            profile.config = profile.config.validated()?;
        }
        return Ok(settings);
    }
    let mut current = web_browser::load_config(root)?;
    let profiles = if current.hop.is_some() {
        current.profile_id = Some("legacy-http".into());
        vec![WebConnectionProfile {
            id: "legacy-http".into(),
            name: "HTTP".into(),
            config: current.clone(),
        }]
    } else {
        Vec::new()
    };
    Ok(BrowserSettings {
        version: 2,
        current,
        profiles,
    })
}

pub fn save_settings(root: &Path, settings: &BrowserSettings) -> Result<(), String> {
    let mut stored = settings.clone();
    stored.version = 2;
    web_browser::protect_config(&mut stored.current)?;
    for profile in &mut stored.profiles {
        web_browser::protect_config(&mut profile.config)?;
    }
    atomic_json(root, "web-browser.json", &stored)
}

pub fn save_current(root: &Path, config: &WebBrowserConfig) -> Result<WebBrowserConfig, String> {
    let mut settings = load_settings(root)?;
    let current = config.validated()?;
    settings.current = current.clone();
    save_settings(root, &settings)?;
    Ok(current)
}

fn validate_name(name: &str) -> Result<(), String> {
    if name.trim().is_empty() || name.chars().count() > 80 || name.chars().any(char::is_control) {
        return Err("Enter a profile name of 1 to 80 characters.".into());
    }
    Ok(())
}

pub fn upsert_profile(
    root: &Path,
    id: Option<&str>,
    name: &str,
    config: &WebBrowserConfig,
) -> Result<BrowserSettings, String> {
    let name = name.trim();
    validate_name(name)?;
    let mut settings = load_settings(root)?;
    let mut config = config.validated()?;
    let existing = id.and_then(|id| {
        settings
            .profiles
            .iter()
            .position(|profile| profile.id == id)
    });
    if settings
        .profiles
        .iter()
        .enumerate()
        .any(|(index, profile)| {
            Some(index) != existing && profile.name.to_lowercase() == name.to_lowercase()
        })
    {
        return Err("A connection profile with this name already exists.".into());
    }
    let id = existing
        .map(|index| settings.profiles[index].id.clone())
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    config.route_id = match existing {
        Some(index) if settings.profiles[index].config.route_hops() == config.route_hops() => {
            settings.profiles[index].config.route_id.clone()
        }
        _ => Some(uuid::Uuid::new_v4().to_string()),
    };
    config.profile_id = Some(id.clone());
    let profile = WebConnectionProfile {
        id,
        name: name.into(),
        config: config.clone(),
    };
    if let Some(index) = existing {
        settings.profiles[index] = profile;
    } else {
        settings.profiles.push(profile);
    }
    settings.current = config;
    save_settings(root, &settings)?;
    Ok(settings)
}

pub fn delete_profile(root: &Path, id: &str) -> Result<BrowserSettings, String> {
    let mut settings = load_settings(root)?;
    settings.profiles.retain(|profile| profile.id != id);
    if settings.current.profile_id.as_deref() == Some(id) {
        settings.current.profile_id = None;
        settings.current.route_id = Some(uuid::Uuid::new_v4().to_string());
    }
    save_settings(root, &settings)?;
    Ok(settings)
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct WebHistoryEntry {
    pub id: String,
    pub url: String,
    pub title: String,
    pub visited_at: i64,
    pub profile_id: Option<String>,
    pub route_key: String,
    pub connection_kind: String,
}

pub fn load_history(root: &Path) -> Result<Vec<WebHistoryEntry>, String> {
    let path = root.join("web-browser-history.json");
    if !path.exists() {
        return Ok(Vec::new());
    }
    let raw = fs::read(path).map_err(|_| "Could not read browsing history.")?;
    let history: Vec<WebHistoryEntry> =
        serde_json::from_slice(&raw).map_err(|_| "Could not read browsing history.")?;
    Ok(history
        .into_iter()
        .filter(|entry| web_browser::website_url(&entry.url).is_ok())
        .take(1000)
        .collect())
}

pub fn record_history(
    root: &Path,
    mut entry: WebHistoryEntry,
    create: bool,
) -> Result<Vec<WebHistoryEntry>, String> {
    entry.url = web_browser::website_url(&entry.url)?.to_string();
    entry.title = entry
        .title
        .chars()
        .map(|ch| if ch.is_control() { ' ' } else { ch })
        .take(512)
        .collect();
    let mut history = load_history(root)?;
    if let Some(previous) = history.iter_mut().find(|previous| previous.id == entry.id) {
        if !entry.title.is_empty() {
            previous.title = entry.title;
        }
    } else if create {
        history.insert(0, entry);
        history.truncate(1000);
    } else {
        return Ok(history);
    }
    atomic_json(root, "web-browser-history.json", &history)?;
    Ok(history)
}

pub fn remove_history(root: &Path, id: Option<&str>) -> Result<Vec<WebHistoryEntry>, String> {
    let history = if let Some(id) = id {
        load_history(root)?
            .into_iter()
            .filter(|entry| entry.id != id)
            .collect()
    } else {
        Vec::new()
    };
    atomic_json(root, "web-browser-history.json", &history)?;
    Ok(history)
}

fn atomic_json(root: &Path, name: &'static str, value: &impl Serialize) -> Result<(), String> {
    fs::create_dir_all(root).map_err(|_| "Could not save Web data.")?;
    let temporary = root.join(format!("{name}-{}.tmp", uuid::Uuid::new_v4()));
    let result: Result<(), String> = (|| {
        let bytes = serde_json::to_vec_pretty(value).map_err(|_| "Could not save Web data.")?;
        fs::write(&temporary, bytes).map_err(|_| "Could not save Web data.")?;
        fs::OpenOptions::new()
            .write(true)
            .open(&temporary)
            .and_then(|file| file.sync_all())
            .map_err(|_| "Could not save Web data.")?;
        fs::rename(&temporary, root.join(name)).map_err(|_| "Could not save Web data.".to_string())
    })();
    if result.is_err() {
        let _ = fs::remove_file(&temporary);
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;
    fn root() -> std::path::PathBuf {
        Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../.temp/web-browser-store-tests")
            .join(uuid::Uuid::new_v4().to_string())
    }
    #[test]
    fn named_profiles_persist_update_and_delete_without_changing_the_connection() {
        let root = root();
        let config = WebBrowserConfig {
            url: "http://site.test/".into(),
            ..Default::default()
        };
        let first = upsert_profile(&root, None, "Office", &config).unwrap();
        let id = first.profiles[0].id.clone();
        let route = first.current.route_key().unwrap();
        let mut changed = first.current.clone();
        changed.url = "http://second.test/".into();
        let renamed = upsert_profile(&root, Some(&id), "Office renamed", &changed).unwrap();
        assert_eq!(renamed.current.route_key().unwrap(), route);
        assert_eq!(
            load_settings(&root).unwrap().profiles[0].name,
            "Office renamed"
        );
        assert!(upsert_profile(&root, None, "office renamed", &changed).is_err());
        let last = delete_profile(&root, &id).unwrap();
        assert!(last.profiles.is_empty());
        assert!(last.current.profile_id.is_none());
        assert_eq!(last.current.hop, changed.hop);
        fs::remove_file(root.join("web-browser.json")).unwrap();
        fs::remove_dir(root).unwrap();
    }
    #[cfg(windows)]
    #[test]
    fn credential_updates_rotate_the_route_and_secrets_never_appear_on_disk() {
        use super::super::proxy_hop::ProxyHop;
        let root = root();
        let config = WebBrowserConfig {
            url: String::new(),
            hop: Some(ProxyHop {
                kind: "socks5".into(),
                host: "localhost".into(),
                port: 1080,
                username: "user".into(),
                secret: "fixture-private-secret".into(),
                key_path: String::new(),
                auth_mode: "password".into(),
                host_key: String::new(),
            }),
            ..Default::default()
        };
        let first = upsert_profile(&root, None, "Private", &config).unwrap();
        let id = first.profiles[0].id.clone();
        let mut changed = first.current.clone();
        changed.hop.as_mut().unwrap().secret = "fixture-revised-secret".into();
        let next = upsert_profile(&root, Some(&id), "Private", &changed).unwrap();
        assert_ne!(
            first.current.route_key().unwrap(),
            next.current.route_key().unwrap()
        );
        assert_eq!(load_settings(&root).unwrap().current, next.current);
        let raw = fs::read_to_string(root.join("web-browser.json")).unwrap();
        assert!(raw.contains("dpapi:v1:"));
        assert!(!raw.contains("fixture-private-secret"));
        assert!(!raw.contains("fixture-revised-secret"));
        fs::remove_file(root.join("web-browser.json")).unwrap();
        fs::remove_dir(root).unwrap();
    }
    #[test]
    fn legacy_http_cookie_route_survives_named_profile_migration() {
        let root = root();
        fs::create_dir_all(&root).unwrap();
        fs::write(
            root.join("web-browser.json"),
            r#"{"url":"http://site.test/","proxyHost":"127.0.0.1","proxyPort":9090}"#,
        )
        .unwrap();
        let legacy = web_browser::load_config(&root)
            .unwrap()
            .route_key()
            .unwrap();
        let migrated = load_settings(&root).unwrap();
        assert_eq!(migrated.profiles.len(), 1);
        assert_eq!(legacy, migrated.current.route_key().unwrap());
        save_settings(&root, &migrated).unwrap();
        assert_eq!(
            legacy,
            load_settings(&root).unwrap().current.route_key().unwrap()
        );
        let renamed =
            upsert_profile(&root, Some("legacy-http"), "My proxy", &migrated.current).unwrap();
        assert_eq!(legacy, renamed.current.route_key().unwrap());
        fs::remove_file(root.join("web-browser.json")).unwrap();
        fs::remove_dir(root).unwrap();
    }
    fn visit(id: &str) -> WebHistoryEntry {
        WebHistoryEntry {
            id: id.into(),
            url: "http://site.test/".into(),
            title: "Test".into(),
            visited_at: 1,
            profile_id: None,
            route_key: "route".into(),
            connection_kind: "direct".into(),
        }
    }

    #[cfg(windows)]
    #[test]
    fn chain_profiles_protect_all_secrets_and_revise_when_an_upstream_credential_changes() {
        use super::super::proxy_hop::ProxyHop;
        let root = root();
        let first = ProxyHop {
            kind: "http".into(),
            host: "first.test".into(),
            port: 9090,
            username: "user".into(),
            secret: "private-first-hop".into(),
            key_path: String::new(),
            auth_mode: "password".into(),
            host_key: String::new(),
        };
        let mut second = first.clone();
        second.kind = "socks5".into();
        second.host = "second.test".into();
        second.secret = "private-second-hop".into();
        let config = WebBrowserConfig {
            hops: vec![first, second],
            ..Default::default()
        };
        let settings = upsert_profile(&root, None, "Office chain", &config).unwrap();
        let raw = fs::read_to_string(root.join("web-browser.json")).unwrap();
        assert!(!raw.contains("private-first-hop"));
        assert!(!raw.contains("private-second-hop"));
        assert_eq!(raw.matches("dpapi:v1:").count(), 4);
        let loaded = load_settings(&root).unwrap();
        assert_eq!(loaded.current, settings.current);
        let mut changed = loaded.current.clone();
        changed.hops[0].secret = "changed-password".into();
        let revised = upsert_profile(
            &root,
            Some(&loaded.profiles[0].id),
            "Office chain",
            &changed,
        )
        .unwrap();
        assert_ne!(
            settings.current.route_key().unwrap(),
            revised.current.route_key().unwrap()
        );
        fs::remove_file(root.join("web-browser.json")).unwrap();
        fs::remove_dir(root).unwrap();
    }
    #[test]
    fn history_reopens_persists_and_deleted_visits_are_not_recreated_by_title_updates() {
        let root = root();
        record_history(&root, visit("1"), true).unwrap();
        record_history(&root, visit("2"), true).unwrap();
        assert_eq!(load_history(&root).unwrap()[0].id, "2");
        let mut updated = visit("1");
        updated.title = "Updated\nTitle".into();
        record_history(&root, updated, false).unwrap();
        assert_eq!(load_history(&root).unwrap()[1].title, "Updated Title");
        remove_history(&root, Some("1")).unwrap();
        record_history(&root, visit("1"), false).unwrap();
        assert_eq!(load_history(&root).unwrap().len(), 1);
        remove_history(&root, None).unwrap();
        record_history(&root, visit("2"), false).unwrap();
        assert!(load_history(&root).unwrap().is_empty());
        assert!(record_history(
            &root,
            WebHistoryEntry {
                url: "file:///secret".into(),
                ..visit("bad")
            },
            true
        )
        .is_err());
        fs::remove_file(root.join("web-browser-history.json")).unwrap();
        fs::remove_dir(root).unwrap();
    }
}
