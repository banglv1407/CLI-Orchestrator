//! Extracts an application icon from an executable and returns it as PNG
//! bytes. On Windows we use `ExtractIconExW` to grab an `HICON`, rasterize via
//! `GetIconInfo` + `GetDIBits`, and PNG-encode with the `image` crate.
//! On non-Windows or on error we return a 1x1 transparent PNG so the
//! frontend can still render the tile.

#![cfg(windows)]

use std::{
    fs,
    io::Cursor,
    path::{Path, PathBuf},
};

use image::{ImageBuffer, RgbaImage};
use windows_sys::Win32::Foundation::HWND;
use windows_sys::Win32::Graphics::Gdi::{
    BitBlt, CreateCompatibleDC, CreateDIBSection, DeleteDC, DeleteObject, GetDC, GetObjectW,
    ReleaseDC, SelectObject, BITMAPINFO, BITMAPINFOHEADER, DIB_RGB_COLORS, SRCCOPY,
};
use windows_sys::Win32::UI::Shell::ExtractIconExW;
use windows_sys::Win32::UI::WindowsAndMessaging::{DestroyIcon, DrawIconEx, GetIconInfo, ICONINFO};

#[derive(Debug, Clone)]
pub struct IconBytes(pub Vec<u8>);

const TRANSPARENT_PNG: &[u8] = &[
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    0x42, 0x60, 0x82,
];

pub fn extract_icon(target: &Path) -> IconBytes {
    if !target.exists() {
        return IconBytes(TRANSPARENT_PNG.to_vec());
    }
    if let Some(bytes) = extract_via_winapi(target) {
        return IconBytes(bytes);
    }
    IconBytes(TRANSPARENT_PNG.to_vec())
}

/// Returns the placeholder PNG bytes used when icon extraction fails.
pub fn transparent_png() -> &'static [u8] {
    TRANSPARENT_PNG
}

/// Persists icon PNG bytes to `cache_path`, creating parents if needed.
pub fn write_to_cache(cache_path: &Path, bytes: &[u8]) -> Result<(), std::io::Error> {
    if let Some(parent) = cache_path.parent() {
        fs::create_dir_all(parent)?;
    }
    fs::write(cache_path, bytes)
}

pub fn derive_icon_path(cache_dir: &Path, key: &str) -> PathBuf {
    cache_dir.join(format!("{key}.png"))
}

fn to_wide_null(s: &str) -> Vec<u16> {
    use std::os::windows::ffi::OsStrExt;
    let mut wide: Vec<u16> = std::ffi::OsStr::new(s).encode_wide().collect();
    wide.push(0);
    wide
}

fn extract_via_winapi(target: &Path) -> Option<Vec<u8>> {
    let path = target.to_string_lossy().into_owned();
    let wide = to_wide_null(&path);
    let mut large: isize = 0;
    let mut small: isize = 0;
    let count = unsafe { ExtractIconExW(wide.as_ptr(), 0, &mut large, &mut small, 1) };
    if count == 0 || large == 0 {
        return None;
    }
    let png = unsafe { hicon_to_png(large) };
    unsafe {
        DestroyIcon(large);
        if small != 0 {
            DestroyIcon(small);
        }
    }
    png
}

unsafe fn hicon_to_png(hicon: isize) -> Option<Vec<u8>> {
    let hwnd: HWND = 0;
    let screen = GetDC(hwnd);
    if screen == 0 {
        return None;
    }
    let mem_dc = CreateCompatibleDC(screen);
    if mem_dc == 0 {
        ReleaseDC(hwnd, screen);
        return None;
    }

    let mut info: ICONINFO = std::mem::zeroed();
    if GetIconInfo(hicon, &mut info) == 0 {
        DeleteDC(mem_dc);
        ReleaseDC(hwnd, screen);
        return None;
    }

    let mut width: i32 = 32;
    let mut height: i32 = 32;
    if info.hbmColor != 0 {
        let mut bm: windows_sys::Win32::Graphics::Gdi::BITMAP = std::mem::zeroed();
        let size = std::mem::size_of::<windows_sys::Win32::Graphics::Gdi::BITMAP>() as i32;
        let ret = GetObjectW(info.hbmColor, size, &mut bm as *mut _ as *mut _);
        if ret > 0 {
            if bm.bmWidth > 0 {
                width = bm.bmWidth;
            }
            if bm.bmHeight > 0 {
                height = bm.bmHeight;
            }
        }
    }

    let mut bmi = BITMAPINFO {
        bmiHeader: BITMAPINFOHEADER {
            biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
            biWidth: width,
            biHeight: height,
            biPlanes: 1,
            biBitCount: 32,
            biCompression: 0,
            biSizeImage: 0,
            biXPelsPerMeter: 0,
            biYPelsPerMeter: 0,
            biClrUsed: 0,
            biClrImportant: 0,
        },
        bmiColors: [windows_sys::Win32::Graphics::Gdi::RGBQUAD {
            rgbBlue: 0,
            rgbGreen: 0,
            rgbRed: 0,
            rgbReserved: 0,
        }; 1],
    };
    let mut bits: *mut core::ffi::c_void = std::ptr::null_mut();
    let color_bmp = CreateDIBSection(mem_dc, &mut bmi, DIB_RGB_COLORS, &mut bits, 0 as _, 0);
    if color_bmp == 0 || bits.is_null() {
        if info.hbmMask != 0 {
            DeleteObject(info.hbmMask);
        }
        if info.hbmColor != 0 {
            DeleteObject(info.hbmColor);
        }
        DeleteDC(mem_dc);
        ReleaseDC(hwnd, screen);
        return None;
    }

    let prev = SelectObject(mem_dc, color_bmp as isize);
    // DI_IMAGE = 0x0001
    let _ = DrawIconEx(mem_dc, 0, 0, hicon, 0, 0, 0, 0, 0x0001);
    SelectObject(mem_dc, prev as isize);
    let _ = BitBlt(mem_dc, 0, 0, width, height, screen, 0, 0, SRCCOPY);

    let pixel_count = (width * height) as usize;
    let mut buf = vec![0u8; pixel_count * 4];
    std::ptr::copy_nonoverlapping(bits as *const u8, buf.as_mut_ptr(), buf.len());

    DeleteObject(color_bmp);
    if info.hbmMask != 0 {
        DeleteObject(info.hbmMask);
    }
    if info.hbmColor != 0 {
        DeleteObject(info.hbmColor);
    }
    DeleteDC(mem_dc);
    ReleaseDC(hwnd, screen);

    for chunk in buf.chunks_exact_mut(4) {
        chunk.swap(0, 2);
    }
    let stride = width as usize * 4;
    let mut flipped = vec![0u8; buf.len()];
    for row in 0..height as usize {
        let src_start = row * stride;
        let dst_start = (height as usize - 1 - row) * stride;
        flipped[dst_start..dst_start + stride].copy_from_slice(&buf[src_start..src_start + stride]);
    }

    let img: RgbaImage = ImageBuffer::from_raw(width as u32, height as u32, flipped)?;
    let max_dim = width.max(height) as u32;
    let buffer = if max_dim > 128 {
        let scale = 128.0 / max_dim as f32;
        let new_w = ((width as f32) * scale).round().max(1.0) as u32;
        let new_h = ((height as f32) * scale).round().max(1.0) as u32;
        image::imageops::resize(&img, new_w, new_h, image::imageops::FilterType::Triangle)
    } else {
        img
    };

    let mut out = Vec::new();
    let mut cursor = Cursor::new(&mut out);
    buffer.write_to(&mut cursor, image::ImageFormat::Png).ok()?;
    Some(out)
}
