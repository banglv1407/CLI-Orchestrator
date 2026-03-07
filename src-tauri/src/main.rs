#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_state;
mod commands;
mod core;
mod runners;
mod terminal;

use app_state::AppState;
use commands::cli_commands::{
    backend_logs_path, create_terminal_session, delete_cli, detect_installed_clis, list_clis,
    list_project_tags, list_sessions, open_backend_logs_folder, pick_folder, save_cli_tag,
    save_project_tag,
    send_cli_input, stop_cli, upsert_cli, resize_cli,
};

fn main() {
    let state = match AppState::new() {
        Ok(state) => state,
        Err(error) => {
            eprintln!("failed to initialize app state: {}", error);
            std::process::exit(1);
        }
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            list_clis,
            upsert_cli,
            delete_cli,
            detect_installed_clis,
            create_terminal_session,
            send_cli_input,
            stop_cli,
            resize_cli,
            list_sessions,
            list_project_tags,
            save_project_tag,
            save_cli_tag,
            backend_logs_path,
            open_backend_logs_folder,
            pick_folder,
        ])
        .run(tauri::generate_context!())
        .expect("error while running AI CLI Manager");
}
