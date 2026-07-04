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
        activate_account, backend_logs_path, clear_account_cooldown, create_rdp_session,
        create_ssh_session, create_terminal_session, delete_account, delete_cli,
        detect_installed_clis, get_account_status, get_all_account_statuses, get_git_diff,
        get_git_status, list_account_cooldowns, list_accounts, list_all_files_recursive, list_clis,
        list_directory_files, list_project_tags, list_sessions, list_ssh_directory_files,
        list_ssh_files_recursive, load_ssh_connections, open_backend_logs_folder,
        open_workspace_folder, pick_file, pick_folder, read_file_content, read_ssh_file_content,
        resize_cli, save_account, save_cli_tag, save_project_tag, save_ssh_connections,
        send_cli_input, send_llm_chat, set_account_cooldown, stop_cli, switch_to_next_account,
        upsert_cli, write_file_content, write_ssh_file_content, ripgrep_search,
    },
    quickapps_commands::{
        delete_quickapp, launch_quickapp, list_quickapps, reextract_icons, upsert_quickapp,
    },
};
use tauri::Manager;

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
            list_ssh_directory_files,
            read_ssh_file_content,
            write_ssh_file_content,
            list_all_files_recursive,
            list_ssh_files_recursive,
            list_quickapps,
            upsert_quickapp,
            delete_quickapp,
            reextract_icons,
            launch_quickapp,
            ripgrep_search,
        ])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                if let Ok(Some(monitor)) = window.primary_monitor() {
                    let size = monitor.size();
                    let width = (size.width as f64 * 0.75) as u32;
                    let height = (size.height as f64 * 0.75) as u32;
                    let _ = window
                        .set_size(tauri::Size::Physical(tauri::PhysicalSize { width, height }));
                    let _ = window.center();
                }
            }

            let show =
                tauri::menu::MenuItem::with_id(app, "show", "Hiện ứng dụng", true, None::<&str>)?;
            let hide = tauri::menu::MenuItem::with_id(
                app,
                "hide",
                "Ẩn xuống khay hệ thống",
                true,
                None::<&str>,
            )?;
            let quit =
                tauri::menu::MenuItem::with_id(app, "quit", "Thoát hoàn toàn", true, None::<&str>)?;

            let tray_menu = tauri::menu::Menu::with_items(app, &[&show, &hide, &quit])?;

            let _tray = tauri::tray::TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
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
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::Click {
                        button: tauri::tray::MouseButton::Left,
                        ..
                    } = event
                    {
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

                use tauri_plugin_dialog::DialogExt;
                let w = window.clone();
                window.dialog()
                    .message("Bạn có muốn ẩn ứng dụng xuống khay hệ thống (minitray) không?\nChọn 'Yes' để ẩn xuống khay, 'No' để thoát hoàn toàn ứng dụng.")
                    .title("Thoát ứng dụng")
                    .kind(tauri_plugin_dialog::MessageDialogKind::Info)
                    .buttons(tauri_plugin_dialog::MessageDialogButtons::YesNo)
                    .show(move |result| {
                        if result {
                            let _ = w.hide();
                        } else {
                            w.app_handle().exit(0);
                        }
                    });
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running AI CLI Manager");
}
