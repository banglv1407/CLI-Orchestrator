# Exec Plan

## Goal

Đảm bảo Agent Logs chỉ dùng search UI của CLX, Reveal mở đúng file/folder và
Hermes ACP có lifecycle hữu hạn, observable và stream đúng chuẩn 0.18.2.

## Scope

In scope:

- Main WebView2 accelerator behavior và Agent Logs search.
- Explorer/Git Changes Reveal cho local Windows paths.
- Agent ACP normalization, runtime status, session state machine và Hermes
  end-to-end validation.
- Product docs, Harness intake/story/matrix/trace và validation evidence.

Out of scope:

- System Logs/CliProxyAI search redesign.
- Remote SSH Reveal.
- Provider, API key, `.env`, Hermes installer/update hoặc multi-platform shell.
- Copy/deploy binary vào Desktop.

## Risk Classification

Lane: **high-risk**.

Risk flags:

- External systems/provider behavior.
- Existing behavior.
- Windows platform shell.
- Weak ACP/UI proof.
- Multi-domain change.

Hard gate: external provider behavior.

## Work Phases

1. **Harness and preservation**
   - Ghi change-request intake và story `US-017` ở lane high-risk.
   - Chụp `git status`; không reset, unstage hoặc ghi đè staged/uncommitted work.
   - Giữ và harden phần Hermes patch hiện có thay vì triển khai lại từ đầu.

2. **Native search boundary**
   - Cấu hình main WebView2 không chạy browser-specific accelerators.
   - Scope lại terminal shortcut theo active view.
   - Thêm Agent Logs filter/highlight/count và keyboard behavior đã khóa.

3. **Reveal target plumbing**
   - Thêm backend command và TypeScript wrapper.
   - Thêm local Reveal action vào Explorer/Git context menu, chặn bubbling và
     loại SSH target.
   - Hiển thị success/error feedback.

4. **ACP normalization and lifecycle**
   - Thêm typed normalizer tại Rust boundary, raw-log fallback và unit fixtures.
   - Chuyển frontend sang `agent-acp-event` và state machine hữu hạn.
   - Correlate agent/request/session/thread, queue prompt một lần và xử lý stale
     generation.
   - Tách Hermes-specific process args khỏi Open Interpreter.

5. **Verification**
   - Chạy automated build/tests trước.
   - Build binary mới và thực hiện Windows UI smoke.
   - Stop agent đang chạy bằng UI trước live test; không force-kill.
   - Chạy Hermes initialize -> session/new -> prompt ngắn qua config hiện tại,
     rồi Stop Agent sạch.

6. **Harness closeout**
   - Cập nhật product contract và E06 plan cho wire shape thực tế.
   - Ghi story proof flags, evidence và trace.
   - Nếu `scripts/harness` vẫn lỗi do Windows wrapper/ELF mismatch, dùng SQLite
     fallback tương đương và ghi harness friction.

## Stop Conditions

Pause để xin xác nhận nếu:

- Cần đọc/ghi `.env` hoặc đổi Hermes/provider config.
- Cần force-kill process của user hoặc ghi đè Desktop binary.
- Cần làm yếu validation, bỏ raw ACP compatibility hoặc mở rộng ngoài Windows.
- Working-tree overlap không thể bảo toàn thay đổi hiện có.

