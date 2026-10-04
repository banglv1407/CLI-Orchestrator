use tauri::{LogicalPosition, LogicalSize, State, WebviewWindow};

use crate::{app_state::AppState, core::system_log::SystemLogEntry};

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
pub struct AdjustWindowScaleResponse {
    pub success: bool,
    pub maximized: bool,
    pub applied_width: u32,
    pub applied_height: u32,
    pub message: String,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
pub struct WindowSizeInfo {
    pub width: u32,
    pub height: u32,
    pub is_maximized: bool,
    pub scale_factor: f64,
}

#[tauri::command]
pub async fn adjust_window_scale(
    window: WebviewWindow,
    zoom_percent: f64,
    base_width: Option<f64>,
    base_height: Option<f64>,
) -> Result<AdjustWindowScaleResponse, String> {
    let is_maximized = window.is_maximized().unwrap_or(false);
    if is_maximized {
        return Ok(AdjustWindowScaleResponse {
            success: true,
            maximized: true,
            applied_width: 0,
            applied_height: 0,
            message: "Window is maximized; layout scales within viewport".to_string(),
        });
    }

    let scale = (zoom_percent / 100.0).clamp(0.7, 2.5);
    let base_w = base_width.unwrap_or(1440.0).clamp(1024.0, 3840.0);
    let base_h = base_height.unwrap_or(900.0).clamp(640.0, 2160.0);

    let mut target_logical_w = (base_w * scale).round();
    let mut target_logical_h = (base_h * scale).round();

    // Query monitor work area to stay within desktop screen bounds
    let monitor = window
        .current_monitor()
        .ok()
        .flatten()
        .or_else(|| window.primary_monitor().ok().flatten());

    if let Some(mon) = monitor {
        let mon_scale = mon.scale_factor();
        let work_area = mon.work_area();
        let work_logical_w = work_area.size.width as f64 / mon_scale;
        let work_logical_h = work_area.size.height as f64 / mon_scale;
        let work_logical_x = work_area.position.x as f64 / mon_scale;
        let work_logical_y = work_area.position.y as f64 / mon_scale;

        // Margin to fit window borders and taskbar comfortably
        let max_w = (work_logical_w - 24.0).max(1024.0);
        let max_h = (work_logical_h - 24.0).max(640.0);

        if target_logical_w > max_w {
            target_logical_w = max_w;
        }
        if target_logical_h > max_h {
            target_logical_h = max_h;
        }

        // Reposition if expanding would push window off-screen
        if let Ok(outer_pos) = window.outer_position() {
            let cur_logical_x = outer_pos.x as f64 / mon_scale;
            let cur_logical_y = outer_pos.y as f64 / mon_scale;

            let mut new_x = cur_logical_x;
            let mut new_y = cur_logical_y;

            if new_x + target_logical_w > work_logical_x + work_logical_w {
                new_x = (work_logical_x + work_logical_w - target_logical_w).max(work_logical_x);
            }
            if new_y + target_logical_h > work_logical_y + work_logical_h {
                new_y = (work_logical_y + work_logical_h - target_logical_h).max(work_logical_y);
            }

            if (new_x - cur_logical_x).abs() > 1.0 || (new_y - cur_logical_y).abs() > 1.0 {
                let _ = window.set_position(LogicalPosition::new(new_x, new_y));
            }
        }
    }

    window
        .set_size(LogicalSize::new(target_logical_w, target_logical_h))
        .map_err(|e| format!("Failed to set window size: {e}"))?;

    Ok(AdjustWindowScaleResponse {
        success: true,
        maximized: false,
        applied_width: target_logical_w as u32,
        applied_height: target_logical_h as u32,
        message: format!("Window resized to {}x{}", target_logical_w as u32, target_logical_h as u32),
    })
}

#[tauri::command]
pub async fn get_window_size(
    window: WebviewWindow,
) -> Result<WindowSizeInfo, String> {
    let is_maximized = window.is_maximized().unwrap_or(false);
    let scale_factor = window.scale_factor().unwrap_or(1.0);
    let size = window.inner_size().map_err(|e| e.to_string())?;
    let logical_w = (size.width as f64 / scale_factor).round() as u32;
    let logical_h = (size.height as f64 / scale_factor).round() as u32;

    Ok(WindowSizeInfo {
        width: logical_w,
        height: logical_h,
        is_maximized,
        scale_factor,
    })
}

#[tauri::command]
pub async fn get_system_logs(
    state: State<'_, AppState>,
    limit: Option<usize>,
) -> Result<Vec<SystemLogEntry>, String> {
    Ok(state.logger.get_logs(limit.unwrap_or(200)).await)
}
