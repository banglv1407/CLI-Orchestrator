# Validation

## Proof Strategy

Kết hợp deterministic parser/unit proof, frontend/Rust build và manual Windows
smoke. Live Hermes prompt là acceptance gate cuối cùng nhưng không thay thế
fixture tests.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Hermes 0.18.2 session ready, assistant/reasoning chunks, tool update, completion, error, malformed/unknown và stale frame |
| Unit | Reveal target: file, directory, path có khoảng trắng, missing path |
| Integration | Agent generation lifecycle, runtime status và stdout/stderr không duplicate |
| Frontend | Agent Logs filter, highlight, count, Ctrl+F focus, Escape clear |
| Platform | Windows Explorer selects file, opens directory; Git target đúng; SSH không có Reveal |
| Live ACP | Current Hermes config: initialize, session/new <= 120s, prompt trả `CLX_HERMES_OK`, stream và stop sạch |

## Commands

```powershell
npm.cmd run build
cargo test --manifest-path src-tauri/Cargo.toml
npm.cmd run test:platform
npm.cmd run validate:quick
npm.cmd run tauri build
```

`validate:quick` phải được chạy nhưng pre-existing format/clippy debt, nếu còn,
phải được báo tách biệt với US-017.

## Manual Acceptance

1. Mở fresh-built CLX, vào Agent Orchestrator và bật Logs.
2. Nhấn `Ctrl+F`: chỉ search CLX xuất hiện, native WebView2 find không xuất hiện.
3. Query lọc case-insensitive, highlight mọi match, count đúng; `Escape` xóa.
4. Xác nhận terminal `Ctrl+F`, `Ctrl+P` và các app shortcut vẫn hoạt động.
5. Right-click nested local file ở Explorer và Git Changes: Explorer mở đúng
   parent và highlight file. Directory mở chính directory.
6. Trong SSH Explorer không có Reveal action.
7. Stop Hermes đang chạy bằng UI, chọn workspace/thread, rồi Start Hermes.
8. UI đi qua initializing/creating-session và đạt Ready trong 120 giây; nếu lỗi,
   hiện message cùng Retry/Stop, không chờ vô hạn.
9. Gửi prompt: `Reply with exactly CLX_HERMES_OK`.
10. Xác nhận text stream vào đúng thread và Agent mini terminal, turn kết thúc,
    sau đó Stop Agent không để process orphan.

## Acceptance Evidence

- Fresh binary path và build timestamp.
- Automated command results.
- Hermes version, handshake duration, normalized event sequence và prompt result.
- Manual results cho Agent Logs và Reveal.
- Không ghi API key, `.env` content hoặc raw sensitive prompt/log vào evidence.

