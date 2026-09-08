# Validation

## Proof Strategy

Test real local network fixtures, existing proxy SSE behavior and compilation.

## Test Plan

| Layer | Cases |
| --- | --- |
| Transport | Direct; failed proxy never bypasses; HTTP auth; HTTPS CONNECT/TLS failure; SOCKS4; SOCKS5 remote DNS/auth; SSH password/key, streaming, pinning and cleanup |
| Compatibility | Existing URL/body/log/SSE tests and legacy deserialization |
| UI | Add/edit/duplicate/reload; collapsed chat open; repeated open; settings deep link |
| Platform | Windows build and loopback; real remote proxy/SSH remain manual |

## Commands

This host lacks NASM; set AWS_LC_SYS_PREBUILT_NASM=1 for the dependency's
supported prebuilt assembler objects.

- cargo test --manifest-path src-tauri/Cargo.toml --no-default-features --lib proxy_hop
- cargo test --manifest-path src-tauri/Cargo.toml --no-default-features --bin clx core::proxy_server
- cargo check --manifest-path src-tauri/Cargo.toml --no-default-features --bin clx
- npm.cmd run build
- npm.cmd run build:production -- --no-bundle
- git diff --check

## Acceptance Evidence

- Transport fixtures: 7 PASS.
- Existing proxy tests: 6 PASS; 1 live saved-provider test ignored.
- Rust binary check: PASS, existing unused OAuth warnings.
- Frontend tsc/Vite build: PASS, 131 modules.
- Production executable: PASS, src-tauri/target/release/CLX (0907).exe
  (40,162,304 bytes), full default features, no installer bundle.
- git diff --check: PASS.
- Interactive desktop and real remote endpoints: not exercised.
- No real provider credentials/traffic used in fixtures.
