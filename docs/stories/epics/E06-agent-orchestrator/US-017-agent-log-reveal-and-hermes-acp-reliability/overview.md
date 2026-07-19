# US-017 — Agent Log, Reveal, and Hermes ACP Reliability

## Current Behavior

- `Ctrl+F` trong Agent Orchestrator Logs có thể mở thanh tìm kiếm native của
  WebView2 thay vì chỉ dùng giao diện CLX.
- Context menu toàn cục dùng `workingDir` của session, nên `Reveal in Explorer`
  không biết file hoặc directory vừa được right-click.
- Hermes CLI có thể spawn thành công nhưng Agent Orchestrator ở trạng thái
  `starting` quá lâu hoặc không hiển thị stream. Phần ACP hiện tại chưa đọc đúng
  toàn bộ wire shape của Hermes 0.18.2 và không có timeout/retry hữu hạn.
- Binary `clx.exe` đang được dùng có thể cũ hơn source hiện tại; validation phải
  chạy từ binary vừa build, không dựa vào bản Desktop cũ.

## Target Behavior

- Agent Logs có search CLX dạng lọc + highlight, không hiện native WebView2 find.
- Reveal mở đúng item local: file được highlight, directory được mở trực tiếp.
- Hermes dùng ACP stdio chuẩn, chuyển trạng thái theo response thực, stream đúng
  thread và không thể kẹt `starting` vô hạn.
- Có automated proof cho ACP frame normalization và Windows smoke với Hermes
  thật bằng cấu hình hiện tại.

## Affected Users

- Người dùng Windows x64 dùng Agent Orchestrator, Explorer, Git Changes và
  Hermes CLI.

## Affected Product Docs

- `docs/product/workspace.md`
- `docs/stories/epics/E06-agent-orchestrator/plan.md`

## Non-Goals

- Không thêm native Reveal cho macOS/Linux.
- Không thêm search UI mới cho System Logs hoặc CliProxyAI Logs.
- Không đọc, ghi hoặc hiển thị file `.env` của Hermes.
- Không tải, cập nhật hoặc thay đổi cấu hình provider của Hermes.
- Không tự ghi đè `Desktop\\clx.exe` và không force-kill process Hermes của user.

