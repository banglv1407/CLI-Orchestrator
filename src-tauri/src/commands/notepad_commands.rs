use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};

const NOTEPAD_SCHEMA_VERSION: u32 = 2;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NotepadTab {
    pub id: String,
    pub title: String,
    pub text: String,
    pub language: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NotepadState {
    pub schema_version: u32,
    pub active_tab_id: String,
    pub tabs: Vec<NotepadTab>,
}

#[derive(Debug, Deserialize)]
struct LegacyNotepadContent {
    text: String,
    language: String,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum StoredNotepad {
    Versioned(NotepadState),
    Legacy(LegacyNotepadContent),
}

fn default_notepad() -> NotepadState {
    NotepadState {
        schema_version: NOTEPAD_SCHEMA_VERSION,
        active_tab_id: "note-1".to_string(),
        tabs: vec![NotepadTab {
            id: "note-1".to_string(),
            title: "Note 1".to_string(),
            text: String::new(),
            language: "markdown".to_string(),
        }],
    }
}

fn notepad_path() -> Result<PathBuf, String> {
    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    Ok(home.join(".ai-cli-manager").join("notepad.json"))
}

fn validate_notepad(content: &NotepadState) -> Result<(), String> {
    if content.schema_version != NOTEPAD_SCHEMA_VERSION {
        return Err(format!(
            "Unsupported notepad schema version {}",
            content.schema_version
        ));
    }
    if content.tabs.is_empty() {
        return Err("Notepad must contain at least one tab".to_string());
    }

    let mut ids = HashSet::with_capacity(content.tabs.len());
    for tab in &content.tabs {
        if tab.id.trim().is_empty() {
            return Err("Notepad tab id cannot be empty".to_string());
        }
        if !ids.insert(tab.id.as_str()) {
            return Err(format!("Duplicate notepad tab id '{}'", tab.id));
        }
        if tab.title.trim().is_empty() {
            return Err(format!("Notepad tab '{}' must have a title", tab.id));
        }
        if tab.language.trim().is_empty() {
            return Err(format!("Notepad tab '{}' must have a language", tab.id));
        }
    }

    if !ids.contains(content.active_tab_id.as_str()) {
        return Err(format!(
            "Active notepad tab '{}' does not exist",
            content.active_tab_id
        ));
    }
    Ok(())
}

fn parse_notepad(raw: &str) -> Result<NotepadState, String> {
    let stored: StoredNotepad =
        serde_json::from_str(raw).map_err(|error| format!("Failed to parse notepad: {error}"))?;
    let state = match stored {
        StoredNotepad::Versioned(state) => state,
        StoredNotepad::Legacy(legacy) => NotepadState {
            schema_version: NOTEPAD_SCHEMA_VERSION,
            active_tab_id: "note-1".to_string(),
            tabs: vec![NotepadTab {
                id: "note-1".to_string(),
                title: "Note 1".to_string(),
                text: legacy.text,
                language: if legacy.language.trim().is_empty() {
                    "markdown".to_string()
                } else {
                    legacy.language
                },
            }],
        },
    };
    validate_notepad(&state)?;
    Ok(state)
}

fn load_notepad(path: &Path) -> Result<NotepadState, String> {
    if !path.exists() {
        return Ok(default_notepad());
    }
    let raw =
        fs::read_to_string(path).map_err(|error| format!("Failed to read notepad: {error}"))?;
    parse_notepad(&raw)
}

fn save_notepad_at(path: &Path, content: &NotepadState) -> Result<(), String> {
    validate_notepad(content)?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|error| format!("Failed to create notepad directory: {error}"))?;
    }

    if path.exists() {
        let raw = fs::read_to_string(path)
            .map_err(|error| format!("Failed to validate existing notepad: {error}"))?;
        parse_notepad(&raw).map_err(|error| {
            format!("Existing notepad is invalid and was not overwritten: {error}")
        })?;
    }

    let json = serde_json::to_string_pretty(content)
        .map_err(|error| format!("Failed to serialize notepad: {error}"))?;
    let file_name = path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("notepad.json");
    let staging = path.with_file_name(format!(
        "{file_name}.stage-{}",
        uuid::Uuid::new_v4().simple()
    ));
    let backup = path.with_file_name(format!("{file_name}.bak"));

    let write_result = (|| -> Result<(), String> {
        let mut file = File::create(&staging)
            .map_err(|error| format!("Failed to create staged notepad: {error}"))?;
        file.write_all(json.as_bytes())
            .map_err(|error| format!("Failed to write staged notepad: {error}"))?;
        file.sync_all()
            .map_err(|error| format!("Failed to flush staged notepad: {error}"))?;
        Ok(())
    })();
    if let Err(error) = write_result {
        let _ = fs::remove_file(&staging);
        return Err(error);
    }

    let had_existing = path.exists();
    if had_existing {
        if backup.exists() {
            if let Err(error) = fs::remove_file(&backup) {
                let _ = fs::remove_file(&staging);
                return Err(format!("Failed to replace notepad backup: {error}"));
            }
        }
        if let Err(error) = fs::rename(path, &backup) {
            let _ = fs::remove_file(&staging);
            return Err(format!("Failed to back up existing notepad: {error}"));
        }
    }

    if let Err(error) = fs::rename(&staging, path) {
        let _ = fs::remove_file(&staging);
        if had_existing {
            let _ = fs::rename(&backup, path);
        }
        return Err(format!("Failed to install updated notepad: {error}"));
    }

    Ok(())
}

#[tauri::command]
pub fn get_notepad() -> Result<NotepadState, String> {
    load_notepad(&notepad_path()?)
}

#[tauri::command]
pub fn save_notepad(content: NotepadState) -> Result<(), String> {
    save_notepad_at(&notepad_path()?, &content)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn temp_notepad_path(name: &str) -> PathBuf {
        std::env::temp_dir()
            .join(format!(
                "clx-notepad-test-{}-{}",
                name,
                uuid::Uuid::new_v4().simple()
            ))
            .join("notepad.json")
    }

    #[test]
    fn migrates_legacy_content_without_changing_text() {
        let state =
            parse_notepad(r##"{"text":"# old note\nexact content","language":"markdown"}"##)
                .expect("legacy note should migrate");

        assert_eq!(state.schema_version, 2);
        assert_eq!(state.active_tab_id, "note-1");
        assert_eq!(state.tabs.len(), 1);
        assert_eq!(state.tabs[0].text, "# old note\nexact content");
        assert_eq!(state.tabs[0].language, "markdown");
    }

    #[test]
    fn rejects_duplicate_and_missing_active_tab_ids() {
        let mut state = default_notepad();
        state.tabs.push(state.tabs[0].clone());
        assert!(validate_notepad(&state)
            .expect_err("duplicates must fail")
            .contains("Duplicate"));

        let mut state = default_notepad();
        state.active_tab_id = "missing".to_string();
        assert!(validate_notepad(&state)
            .expect_err("missing active tab must fail")
            .contains("does not exist"));
    }

    #[test]
    fn saves_versioned_state_and_keeps_previous_backup() {
        let path = temp_notepad_path("backup");
        let parent = path.parent().expect("test path parent");
        fs::create_dir_all(parent).expect("create test directory");

        let first = default_notepad();
        save_notepad_at(&path, &first).expect("save first note");

        let mut second = first.clone();
        second.tabs[0].text = "updated".to_string();
        save_notepad_at(&path, &second).expect("save updated note");

        assert_eq!(load_notepad(&path).expect("load updated note"), second);
        let backup = path.with_file_name("notepad.json.bak");
        assert_eq!(load_notepad(&backup).expect("load backup"), first);

        let _ = fs::remove_dir_all(parent);
    }

    #[test]
    fn refuses_to_overwrite_malformed_existing_storage() {
        let path = temp_notepad_path("malformed");
        let parent = path.parent().expect("test path parent");
        fs::create_dir_all(parent).expect("create test directory");
        fs::write(&path, "{not-json").expect("write malformed fixture");

        let error = save_notepad_at(&path, &default_notepad())
            .expect_err("malformed storage must not be replaced");
        assert!(error.contains("was not overwritten"));
        assert_eq!(
            fs::read_to_string(&path).expect("malformed file remains"),
            "{not-json"
        );

        let _ = fs::remove_dir_all(parent);
    }
}
