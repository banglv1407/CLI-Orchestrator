use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct NotepadContent {
    pub text: String,
    pub language: String,
}

fn notepad_path() -> Result<PathBuf, String> {
    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    Ok(home.join(".ai-cli-manager").join("notepad.json"))
}

#[tauri::command]
pub fn get_notepad() -> Result<NotepadContent, String> {
    let path = notepad_path()?;
    if path.exists() {
        let content = fs::read_to_string(&path).map_err(|e| format!("Failed to read notepad: {}", e))?;
        serde_json::from_str(&content).map_err(|e| format!("Failed to parse notepad: {}", e))
    } else {
        Ok(NotepadContent { text: String::new(), language: "markdown".to_string() })
    }
}

#[tauri::command]
pub fn save_notepad(content: NotepadContent) -> Result<(), String> {
    let path = notepad_path()?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Failed to create dir: {}", e))?;
    }
    let json = serde_json::to_string_pretty(&content).map_err(|e| format!("Failed to serialize: {}", e))?;
    fs::write(&path, json).map_err(|e| format!("Failed to write notepad: {}", e))
}
