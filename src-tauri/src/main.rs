#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_state;
mod commands;
mod core;
mod runners;
mod terminal;

use tauri::Manager;
use app_state::AppState;
use commands::{
    cass_commands::{cass_index_logs, cass_search, cass_stats},
    cli_commands::{
        activate_account, backend_logs_path, clear_account_cooldown, create_terminal_session,
        delete_account, delete_cli, detect_installed_clis, get_account_status, get_all_account_statuses,
        list_account_cooldowns, list_accounts, list_clis, list_project_tags, list_sessions,
        open_backend_logs_folder, pick_folder, save_account, save_cli_tag, save_project_tag,
        send_cli_input, set_account_cooldown, stop_cli, switch_to_next_account, upsert_cli,
        resize_cli, list_directory_files, send_llm_chat,
        read_file_content, write_file_content, get_git_status, get_git_diff,
        pick_file, load_ssh_connections, save_ssh_connections, create_ssh_session, create_rdp_session, open_workspace_folder,
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
            read_file_content,
            write_file_content,
            get_git_status,
            get_git_diff,
            send_llm_chat,
            cass_index_logs,
            cass_stats,
            cass_search,
            pick_file,
            load_ssh_connections,
            save_ssh_connections,
            create_ssh_session,
            create_rdp_session,
            open_workspace_folder,
        ])
        .setup(|app| {
            let show = tauri::menu::MenuItem::with_id(app, "show", "Hiện ứng dụng", true, None::<&str>)?;
            let hide = tauri::menu::MenuItem::with_id(app, "hide", "Ẩn xuống khay hệ thống", true, None::<&str>)?;
            let quit = tauri::menu::MenuItem::with_id(app, "quit", "Thoát hoàn toàn", true, None::<&str>)?;
            
            let tray_menu = tauri::menu::Menu::with_items(app, &[&show, &hide, &quit])?;
            
            let _tray = tauri::tray::TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                         "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                        }
                        "hide" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.hide();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::Click { button: tauri::tray::MouseButton::Left, .. } = event {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let is_visible = window.is_visible().unwrap_or(false);
                            let is_focused = window.is_focused().unwrap_or(false);
                            let is_minimized = window.is_minimized().unwrap_or(false);
                            
                            if is_visible && is_focused && !is_minimized {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;
            
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running AI CLI Manager");
}
