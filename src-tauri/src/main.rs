#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_state;
mod commands;
mod core;
mod runners;
mod terminal;

use app_state::AppState;
use commands::{
    cass_commands::{cass_index_logs, cass_search, cass_stats},
    cli_commands::{
        activate_account, backend_logs_path, clear_account_cooldown, create_terminal_session,
        delete_account, delete_cli, detect_installed_clis, get_account_status, get_all_account_statuses,
        list_account_cooldowns, list_accounts, list_clis, list_project_tags, list_sessions,
        open_backend_logs_folder, pick_folder, save_account, save_cli_tag, save_project_tag,
        send_cli_input, set_account_cooldown, stop_cli, switch_to_next_account, upsert_cli,
        resize_cli, list_directory_files,
    },
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
            list_accounts,
            save_account,
            activate_account,
            delete_account,
            get_account_status,
            switch_to_next_account,
            set_account_cooldown,
            clear_account_cooldown,
            list_account_cooldowns,
            get_all_account_statuses,
            list_directory_files,
            cass_index_logs,
            cass_stats,
            cass_search,
        ])
        .run(tauri::generate_context!())
        .expect("error while running AI CLI Manager");
}
