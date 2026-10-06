use crate::ui_language::UiLanguage;
use std::{path::PathBuf, sync::Mutex};
use tauri::{menu::MenuItem, State, Wry};

pub struct NativeLanguageState {
    pub language: Mutex<UiLanguage>,
    pub show: MenuItem<Wry>,
    pub hide: MenuItem<Wry>,
    pub quit: MenuItem<Wry>,
    pub preference_path: PathBuf,
}

#[tauri::command]
pub fn set_ui_language(
    language: String,
    state: State<'_, NativeLanguageState>,
) -> Result<(), String> {
    let language = UiLanguage::parse(&language).ok_or("Unsupported interface language")?;
    let copy = language.copy();
    state
        .show
        .set_text(copy.show)
        .map_err(|error| error.to_string())?;
    state
        .hide
        .set_text(copy.hide)
        .map_err(|error| error.to_string())?;
    state
        .quit
        .set_text(copy.quit)
        .map_err(|error| error.to_string())?;
    *state.language.lock().map_err(|error| error.to_string())? = language;
    std::fs::write(&state.preference_path, language.code()).map_err(|error| error.to_string())
}
