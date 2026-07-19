# Design

## Agent Logs Search

- Tắt browser accelerator native trên **main WebView2** bằng
  `ICoreWebView2Settings3::SetAreBrowserAcceleratorKeysEnabled(false)`. Nếu API
  không khả dụng, ghi warning nhưng không làm app startup thất bại. Webview riêng
  của Web AI không bị thay đổi.
- Handler terminal chỉ nhận `Ctrl+F` khi terminal đang thật sự visible.
- Khi Agent Orchestrator active, `Ctrl+F` mở Logs và focus search input của CLX.
- Query là literal, case-insensitive, không hỗ trợ regex. Chỉ giữ các dòng khớp,
  highlight mọi occurrence bằng React node an toàn và hiện match count.
- `Escape` xóa query. Retention vẫn là 300 dòng.
- Mỗi stdout ACP frame chỉ xuất hiện một lần; stderr có source label riêng.

## Reveal in Explorer

- Thêm `reveal_in_file_manager(path)` thay vì thay đổi semantics của
  `open_workspace_folder`.
- Context menu của Explorer node và Git Changes gọi command mới bằng chính
  `target.path`, đồng thời `stopPropagation()` để menu toàn cục không mở chồng.
- Windows behavior:
  - Existing file: gọi Explorer với `/select,` và canonical file path.
  - Existing directory: mở directory đó.
  - Missing path: trả lỗi rõ ràng.
- SSH target không hiển thị Reveal. Background workspace menu tiếp tục mở root.
- Thành công/thất bại được báo qua assistant feedback, không dùng browser alert.

## ACP Runtime Contract

Rust giữ raw `agent-frame` để debug và phát thêm `agent-acp-event` đã normalize:

```text
initialized
sessionReady
messageChunk        role = assistant | reasoning
toolUpdate
permissionRequest
turnFinished
protocolError
```

Mọi event dùng camelCase và kèm `agentId`; event có session/request phải kèm
`sessionId` hoặc `requestId` tương ứng. Parser hỗ trợ:

- Standard Hermes 0.18.2 `session/update`:
  `params.update.sessionUpdate` và `params.update.content.text`.
- `result.sessionId` cùng Hermes provenance metadata fallback.
- Prompt response `result.stopReason`.
- Legacy `session/chunk`/`params.delta` để không làm hỏng agent cũ.
- Malformed hoặc unknown frame chỉ vào raw log, không crash UI.

`agent-terminal-output` được tạo từ normalized message/tool events, không parse
raw JSON lần thứ hai.

## Session State Machine

```text
idle -> starting -> initializing -> creating-session -> ready
ready -> prompting -> ready
any active state -> error | stopping -> stopped
```

- `initialize` phải nhận response trong 10 giây; timeout chuyển `error`, không
  giả lập initialized.
- `session/new` có watchdog 120 giây. UI hiện elapsed time và Retry/Stop thay vì
  chờ vô hạn.
- Retry dừng generation cũ, start generation mới và bỏ qua stale frames bằng
  generation + agent ID + request ID.
- Request ID và session ID được map về thread sở hữu. Switching UI thread không
  được chuyển stream sang thread khác.
- Chỉ một prompt được queue trong lúc session chưa ready; khi `sessionReady`
  đến, prompt được flush đúng một lần.
- Agent selector bị khóa trong khi process chạy; muốn đổi agent phải Stop trước.
- Status label lấy tên agent đang chọn, không hard-code Hermes.

## Process Launch

- Hermes: `hermes acp --accept-hooks`, `HERMES_ACCEPT_HOOKS=1`,
  `PYTHONUNBUFFERED=1` và proxy environment hiện có.
- Open Interpreter: chỉ dùng ACP args mà runtime này hỗ trợ; không truyền
  `--accept-hooks` hoặc Hermes-specific env.
- Agent manager lưu active agent runtime để `agent_list_agents` báo đúng
  `running/stopped/error` và `agent_stop` emit đúng agent ID.

## Public/Internal Interface Changes

- Tauri command mới:
  `reveal_in_file_manager(path: String) -> Result<(), String>`.
- Tauri event mới: `agent-acp-event` với discriminated payload nêu trên.
- Giữ `agent-frame`, `agent-log`, `agent-terminal-output` để tương thích.
- Không có database migration hoặc thay đổi persistent agent settings.

