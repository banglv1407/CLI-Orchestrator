const PREFIX: &str = "dpapi:v1:";

pub(crate) fn protect(secret: &str) -> Result<String, String> {
    if secret.is_empty() {
        return Ok(String::new());
    }
    #[cfg(windows)]
    {
        use base64::Engine;
        let protected = crypt(secret.as_bytes(), true)?;
        Ok(format!(
            "{PREFIX}{}",
            base64::engine::general_purpose::STANDARD.encode(protected)
        ))
    }
    #[cfg(not(windows))]
    {
        Err("Secure browser credential storage is unavailable on this platform.".into())
    }
}

pub(crate) fn unlock(secret: &str) -> Result<String, String> {
    let Some(encoded) = secret.strip_prefix(PREFIX) else {
        return Ok(secret.to_owned());
    };
    #[cfg(windows)]
    {
        use base64::Engine;
        let bytes = base64::engine::general_purpose::STANDARD
            .decode(encoded)
            .map_err(|_| "Could not unlock saved browser credentials.")?;
        String::from_utf8(crypt(&bytes, false)?)
            .map_err(|_| "Could not unlock saved browser credentials.".into())
    }
    #[cfg(not(windows))]
    {
        let _ = encoded;
        Err("Secure browser credential storage is unavailable on this platform.".into())
    }
}

#[cfg(windows)]
fn crypt(bytes: &[u8], encrypt: bool) -> Result<Vec<u8>, String> {
    use windows_sys::Win32::{
        Foundation::LocalFree,
        Security::Cryptography::{
            CryptProtectData, CryptUnprotectData, CRYPTPROTECT_UI_FORBIDDEN, CRYPT_INTEGER_BLOB,
        },
    };
    let input = CRYPT_INTEGER_BLOB {
        cbData: bytes
            .len()
            .try_into()
            .map_err(|_| "Could not protect browser credentials.")?,
        pbData: bytes.as_ptr() as *mut u8,
    };
    let mut output: CRYPT_INTEGER_BLOB = unsafe { std::mem::zeroed() };
    let success = unsafe {
        if encrypt {
            CryptProtectData(
                &input,
                std::ptr::null(),
                std::ptr::null(),
                std::ptr::null(),
                std::ptr::null(),
                CRYPTPROTECT_UI_FORBIDDEN,
                &mut output,
            )
        } else {
            CryptUnprotectData(
                &input,
                std::ptr::null_mut(),
                std::ptr::null(),
                std::ptr::null(),
                std::ptr::null(),
                CRYPTPROTECT_UI_FORBIDDEN,
                &mut output,
            )
        }
    };
    if success == 0 {
        return Err(if encrypt {
            "Could not protect browser credentials."
        } else {
            "Could not unlock saved browser credentials."
        }
        .into());
    }
    let result =
        unsafe { std::slice::from_raw_parts(output.pbData, output.cbData as usize).to_vec() };
    unsafe {
        LocalFree(output.pbData as *mut _);
    }
    Ok(result)
}
