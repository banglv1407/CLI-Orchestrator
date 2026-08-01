#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_state;
mod builtin_llm;
mod commands;
mod companion;
mod core;
mod runners;
mod terminal;

use app_state::AppState;
use companion::commands::{
    companion_cancel, companion_clear_history, companion_get_catalog, companion_get_config,
    companion_get_help, companion_get_history, companion_get_safe_context, companion_help_search,
    companion_import_legacy, companion_save_config, companion_send,
    companion_set_actions_enabled,
};
use companion::terminal_command::{
    terminal_command_cancel, terminal_command_detect_environment, terminal_command_suggest,
};
use commands::{
    api_proxy::{api_proxy_abort, api_proxy_request, api_proxy_stream},
    builtin_llm_commands::{
        builtin_llm_generate, builtin_llm_get_config, builtin_llm_load, builtin_llm_save_config,
        builtin_llm_status, builtin_llm_unload,
    },
    cli_commands::{
        backend_logs_path, create_directory, create_file_content, create_rdp_session,
        create_ssh_session, create_terminal_session, delete_cli, delete_file_or_dir,
        delete_ssh_file_or_dir, detect_installed_clis, download_ssh_file, get_git_diff,
        get_git_status, get_remote_system_stats, get_ssh_server_config, get_ssh_server_status,
        list_all_files_recursive, list_clis, list_directory_files, list_project_tags,
        list_sessions, list_ssh_directory_files, list_ssh_files_recursive,
        load_ssh_connections, open_backend_logs_folder, open_workspace_folder, pick_file,
        pick_folder, read_file_content, read_ssh_file_content, resize_cli, reveal_in_file_manager,
        ripgrep_search, save_cli_tag, save_project_tag, save_ssh_connections,
        save_ssh_server_config, send_cli_input, send_llm_chat, start_ssh_server, stop_cli,
        stop_ssh_server, upload_ssh_file, upsert_cli, write_file_content, write_ssh_file_content,
    },
    dashboard_commands::{
        dashboard_delete_monitor, dashboard_discover_log_sources, dashboard_get_all_connections,
        dashboard_get_process_logs, dashboard_get_resource_usage, dashboard_get_target_connections,
        dashboard_kill_port, dashboard_kill_processes, dashboard_list_monitors,
        dashboard_probe_monitors, dashboard_probe_port, dashboard_probe_ports,
        dashboard_start_log_stream, dashboard_stop_log_stream, dashboard_test_monitor,
        dashboard_upsert_monitor,
    },
    notepad_commands::{get_notepad, save_notepad},
    pet_commands::{pet_install_pack, pet_list_packs, pet_load_asset},
    proxy_commands::{
        proxy_add_backend, proxy_get_config, proxy_get_logs, proxy_get_recent_logs, proxy_get_usage, proxy_remove_backend,
        proxy_reset_usage, proxy_save_config, proxy_start, proxy_status, proxy_stop,
    },
    quickapps_commands::{
        delete_quickapp, launch_quickapp, list_quickapps, reextract_icons, upsert_quickapp,
    },
    rtk_commands::rtk_get_status,
    system_commands::get_system_logs,
};
use tauri::{Emitter, Manager};

fn cleanup_for_exit(app: &tauri::AppHandle) {
    let state = app.state::<AppState>();
    let companion = state.companion.clone();
    let monitoring = state.monitoring.clone();
    tauri::async_runtime::block_on(async move {
        let _ = companion.cancel("").await;
        monitoring.stop_all_streams().await;
    });
}

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
        .manage(state.api_proxy.clone())
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            companion_get_catalog,
            companion_help_search,
            companion_get_help,
            companion_get_safe_context,
            companion_send,
            companion_cancel,
            companion_get_config,
            companion_save_config,
            companion_get_history,
            companion_clear_history,
            companion_set_actions_enabled,
            companion_import_legacy,
            terminal_command_detect_environment,
            terminal_command_suggest,
            terminal_command_cancel,
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
            list_directory_files,
            read_file_content,
            write_file_content,
            delete_file_or_dir,
            get_git_status,
            get_git_diff,
            send_llm_chat,
            pick_file,
            load_ssh_connections,
            save_ssh_connections,
            create_ssh_session,
            create_rdp_session,
            open_workspace_folder,
            reveal_in_file_manager,
            list_ssh_directory_files,
            read_ssh_file_content,
            write_ssh_file_content,
            delete_ssh_file_or_dir,
            get_remote_system_stats,
            download_ssh_file,
            upload_ssh_file,
            list_all_files_recursive,
            list_ssh_files_recursive,
            list_quickapps,
            upsert_quickapp,
            delete_quickapp,
            reextract_icons,
            launch_quickapp,
            ripgrep_search,
            start_ssh_server,
            stop_ssh_server,
            get_ssh_server_status,
            get_ssh_server_config,
            save_ssh_server_config,
            api_proxy_request,
            api_proxy_stream,
            api_proxy_abort,
            proxy_status,
            proxy_start,
            proxy_stop,
            proxy_get_config,
            proxy_save_config,
            proxy_add_backend,
            proxy_remove_backend,
            proxy_get_logs,
            proxy_get_recent_logs,
            proxy_get_usage,
            proxy_reset_usage,
            rtk_get_status,
            get_system_logs,
            get_notepad,
            save_notepad,
            pet_list_packs,
            pet_install_pack,
            pet_load_asset,
            create_directory,
            create_file_content,
            builtin_llm_status,
            builtin_llm_load,
            builtin_llm_unload,
            builtin_llm_generate,
            builtin_llm_get_config,
            builtin_llm_save_config,
            dashboard_get_resource_usage,
            dashboard_probe_ports,
            dashboard_probe_port,
            dashboard_kill_port,
            dashboard_get_process_logs,
            dashboard_list_monitors,
            dashboard_test_monitor,
            dashboard_upsert_monitor,
            dashboard_delete_monitor,
            dashboard_probe_monitors,
            dashboard_discover_log_sources,
            dashboard_start_log_stream,
            dashboard_stop_log_stream,
            dashboard_kill_processes,
            dashboard_get_target_connections,
            dashboard_get_all_connections,
        ])
        .setup(|app| {
            // Initialize companion with app handle for event emission
            if let Some(state) = app.try_state::<AppState>() {
                state.companion.set_app_handle(app.handle().clone());
                // Inject service refs
                let mut ps = state.companion.proxy_server.blocking_write();
                *ps = Some(state.proxy_server.clone());
                drop(ps);
                let mut cr = state.companion.cli_registry.blocking_write();
                *cr = Some(state.registry.clone());
                drop(cr);
                let mut sm = state.companion.session_manager.blocking_write();
                *sm = Some(state.session_manager.clone());
                drop(sm);
                let mut qa = state.companion.quickapps.blocking_write();
                *qa = Some(state.quickapps.clone());
                drop(qa);
            }

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
                app, "hide", "Ẩn xuống khay hệ thống", true, None::<&str>,
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
                            let _ = window.emit("app-window-visibility", true);
                        }
                    }
                    "hide" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.emit("app-window-visibility", false);
                            let _ = window.hide();
                        }
                    }
                    "quit" => {
                        cleanup_for_exit(app);
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
                            if window.is_visible().unwrap_or(false) {
                                let _ = window.emit("app-window-visibility", false);
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                                let _ = window.emit("app-window-visibility", true);
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
                window
                    .dialog()
                    .message(
                        "Bạn có muốn ẩn ứng dụng xuống khay hệ thống (minitray) không?\nChọn 'Yes' để ẩn xuống khay, 'No' để thoát hoàn toàn ứng dụng.",
                    )
                    .title("Thoát ứng dụng")
                    .kind(tauri_plugin_dialog::MessageDialogKind::Info)
                    .buttons(tauri_plugin_dialog::MessageDialogButtons::YesNo)
                    .show(move |result| {
                        if result {
                            let _ = w.emit("app-window-visibility", false);
                            let _ = w.hide();
                        } else {
                            cleanup_for_exit(w.app_handle());
                            w.app_handle().exit(0);
                        }
                    });
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running AI CLI Manager");
}
