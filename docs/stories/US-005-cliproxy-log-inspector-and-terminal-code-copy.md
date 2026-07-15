# US-005 — CliProxyAI Log Inspector và Terminal Copy as Code

## Status

planned

## Lane

normal

Risk flags: `existing_behavior`, `weak_proof`, `multi_domain`.

Đây là thay đổi frontend có phạm vi giới hạn. Story không thay đổi auth, dữ
liệu lưu trữ, provider, Rust backend hoặc public API.

## Product Contract

- Proxy Logs hiển thị log mới nhất trước và phân trang cố định 10 log/trang.
- Khi người dùng chọn một log, detail phải xuất hiện ngay dưới row đó thay vì
  cuối bảng.
- Request và Response phải cho phép bôi đen, Ctrl+C và copy bằng nút riêng.
- Chuột phải trong Proxy Logs không được mở nhầm context menu của terminal.
- Ctrl+C trong terminal tiếp tục copy chính xác selection hiện tại.
- Terminal có thêm `Copy as code` và `Ctrl+Shift+C` để nối lại visual wrap của
  Codex/OpenCode TUI khi paste vào editor.
- Newline thật và indentation không được tự động xóa hoặc nối tùy tiện.

### Ngoài phạm vi

- Không thêm server-side pagination hoặc thay đổi giới hạn 100 proxy log.
- Không thay đổi `ProxyLogEntry`, Tauri commands, Rust structs, IPC hoặc dữ
  liệu lưu trữ.
- Không tự động loại markdown fence, prompt hoặc ký tự trang trí khỏi terminal
  selection.
- Không thay đổi phần Request Logs summary nhỏ trong CliProxyAI sidebar.

## Relevant Product Docs

- `docs/product/proxy.md`
- `docs/product/terminal.md`

## Current State

- `LogsTab` trong `src/components/ProxyPanel.tsx` render detail sau toàn bộ
  `<table>`, nên detail của row đầu vẫn nằm ở cuối danh sách.
- Container chính trong `src/components/TerminalPanel.tsx` dùng `select-none`;
  Request/Response của proxy log chưa ghi đè bằng `select-text`.
- Handler `onContextMenu` của terminal đang bao quanh cả các sub-view, nên có
  thể chặn context menu native khi người dùng đang ở Proxy Logs.
- Ctrl+C hiện lấy thẳng `terminal.getSelection()` và ghi plain text vào
  clipboard. xterm đã nối soft-wrap, nhưng TUI có thể tự vẽ hard-wrap vào
  buffer.
- Baseline trước implementation: worktree sạch và `npm.cmd run build` pass.

## Implementation Guide

### 1. Khởi tạo Harness

Trước khi sửa source, đọc lại các tài liệu bắt buộc trong `AGENTS.md`, sau đó
ghi intake và story:

```bash
./scripts/harness intake \
  --type change_request \
  --summary "Improve CliProxyAI log inspection and terminal code copying" \
  --lane normal \
  --flags "existing_behavior,weak_proof,multi_domain" \
  --docs "docs/product/proxy.md,docs/product/terminal.md" \
  --story US-005

./scripts/harness story add \
  --id US-005 \
  --title "CliProxyAI log inspector and terminal code copy" \
  --lane normal \
  --contract "docs/product/proxy.md,docs/product/terminal.md"

./scripts/harness story update --id US-005 --status in_progress
```

Trên Windows hiện tại, nếu entrypoint không chạy trực tiếp, dùng Git Bash:

```powershell
& 'C:\Program Files\Git\usr\bin\bash.exe' -lc './scripts/harness <arguments>'
```

Không sửa trực tiếp `harness.db` hoặc `docs/TEST_MATRIX.md`.

### 2. Proxy Logs: inline detail và pagination

Thực hiện trong `src/components/ProxyPanel.tsx`:

1. Thêm hằng `LOGS_PER_PAGE = 10`.
2. Trong `LogsTab`, quản lý các state:
   - `page`, bắt đầu từ `1`;
   - `expandedId`;
   - trạng thái copy dạng `request:<id>` hoặc `response:<id>`.
3. Đặt mọi hook/effect trước nhánh return khi `logs.length === 0`.
4. Tính dữ liệu theo thứ tự:
   - `orderedLogs = [...logs].reverse()`;
   - `pageCount = Math.max(1, Math.ceil(orderedLogs.length / 10))`;
   - clamp `page` khi số log thay đổi;
   - slice đúng 10 row thành `pageLogs`.
5. Khi chuyển trang, cập nhật page và đóng `expandedId`.
6. Render mỗi entry bằng một `Fragment` gồm row summary và, khi được mở, một
   row detail ngay kế tiếp với `<td colSpan={6}>`.
7. Click lại row đang mở sẽ đóng; click row khác sẽ chuyển detail. Không toggle
   nếu event bắt nguồn từ button hoặc người dùng đang có text selection.
8. Dùng layout một cột cho detail ở cửa sổ hẹp và hai cột ở cửa sổ rộng.
9. Thêm Previous/Next cùng `Page X / Y`; disable ở trang đầu/cuối.

Polling vẫn lấy tối đa 100 log từ backend. Nếu polling làm page hiện tại vượt
`pageCount`, clamp về page cuối hợp lệ. Nếu expanded log không còn thuộc page
hiện tại thì đóng detail.

### 3. Proxy Logs: selection và copy

- Thêm `select-text` trực tiếp vào vùng Request và Response để ghi đè
  `select-none` được kế thừa từ terminal layout.
- Giữ `whitespace-pre-wrap`, font monospace và scroll độc lập.
- Dùng cùng một hàm `formatJson()` cho nội dung hiển thị và clipboard:
  - JSON hợp lệ được format bằng hai khoảng trắng;
  - dữ liệu không phải JSON được giữ nguyên;
  - nếu response rỗng ở log lỗi, dùng `errorMsg`.
- Mỗi panel Request/Response có nút Copy riêng:
  - gọi `navigator.clipboard.writeText(displayedText)`;
  - gọi `stopPropagation()`;
  - hiện `Copied` khoảng 1,5 giây;
  - hiện `Copy failed` nếu clipboard reject.
- Không trim nội dung trước khi copy.

### 4. Giới hạn terminal context menu đúng surface

Trong `src/components/TerminalPanel.tsx`, chỉ gọi `handleContextMenu` khi đồng
thời thỏa mãn:

- `activeMainView === 'terminal'`;
- không mở file;
- có `visibleSessionId`.

Với `proxy`, `logs`, `settings`, `remote` và các sub-view khác, không gọi
`preventDefault`; để WebView xử lý selection/context menu bình thường. Không
xóa `select-none` khỏi toàn container vì các control terminal khác đang dựa
vào nó.

### 5. Terminal Copy as Code

Tạo helper nội bộ `src/lib/terminalClipboard.ts`:

```ts
export type TerminalCopyMode = 'exact' | 'code';

export function getTerminalSelectionText(
  terminal: Terminal,
  mode: TerminalCopyMode,
): string;

export async function copyTerminalSelection(
  terminal: Terminal,
  mode: TerminalCopyMode,
): Promise<boolean>;
```

#### Mode `exact`

- Trả nguyên `terminal.getSelection()`.
- Không trim, không đổi line ending và không suy đoán visual wrap.

#### Mode `code`

- Trả chuỗi rỗng nếu terminal không có selection.
- Dùng `getSelectionPosition()` và `terminal.buffer.active`; không truy cập
  private fields của xterm.
- Tái tạo selection theo đúng start/end column của xterm v6 đang cài trong
  repo.
- Không thêm newline giữa hai buffer row khi row hiện tại có
  `isWrapped === true`.
- Với hard-wrap do TUI tự vẽ, chỉ nối khi ký tự có nghĩa cuối cùng của row
  trước thực sự chiếm mép phải terminal.
- Khoảng trắng hoặc box-drawing trong dải `U+2500–U+257F` ở mép phải không
  được xem là bằng chứng continuation.
- Các trường hợp còn lại phải giữ newline.
- Không `trimStart`, `trimEnd`, strip markdown hoặc thay đổi indentation.
- Chỉ mode `code` chuẩn hóa line ending thành `\n`.

Heuristic phải bảo thủ: chấp nhận không nối một hard-wrap thiếu bằng chứng còn
hơn nối nhầm hai dòng source thật.

### 6. Wiring phím tắt và context menu

Trong `TerminalPanel.tsx`:

- Xử lý `Ctrl+Shift+C` trước nhánh Ctrl+C hiện tại.
- So sánh phím bằng `event.key.toLowerCase()`.
- Chỉ ghi clipboard ở `keydown`; chặn `keyup` tương ứng để tránh copy hai lần.
- Ctrl+C có selection gọi mode `exact`.
- Ctrl+C không có selection tiếp tục đi vào PTY để gửi interrupt.
- Ctrl+Shift+C có selection gọi mode `code`.
- Ctrl+Shift+C không có selection không được ghi clipboard rỗng.
- Khi context menu terminal có selection, thêm:
  - `Copy` dùng mode `exact`;
  - `Copy as code` dùng mode `code`;
  - giữ action Explain hiện tại.
- Không dùng `selectedText.trim()` cho clipboard. Chỉ được trim khi kiểm tra
  hoặc tạo payload cho Explain.

## Public Interfaces

- Không có thay đổi public API, IPC, schema hoặc backend command.
- `TerminalCopyMode`, `getTerminalSelectionText()` và
  `copyTerminalSelection()` chỉ là interface nội bộ frontend.
- Không cần ADR vì implementation không thay đổi hướng kiến trúc.

## Acceptance Criteria

- [ ] Với 23 log, danh sách có ba trang 10/10/3 row và log mới nhất đứng đầu.
- [ ] Detail xuất hiện ngay dưới đúng row ở đầu, giữa và cuối trang.
- [ ] Chuyển trang đóng detail; page luôn hợp lệ khi polling cập nhật logs.
- [ ] Bôi đen Request/Response không làm row đóng.
- [ ] Ctrl+C và các nút Copy trả đúng pretty JSON hoặc raw/error text.
- [ ] Chuột phải trong Proxy Logs không mở menu Refresh/Stop của terminal.
- [ ] Ctrl+C terminal có selection giữ nguyên output hiện tại.
- [ ] Ctrl+C không có selection vẫn interrupt CLI.
- [ ] Ctrl+Shift+C nối soft-wrap và hard-wrap có bằng chứng ở mép terminal.
- [ ] Hai dòng code thật, dòng trống, Unicode và indentation vẫn được giữ.
- [ ] Paste `Copy as code` vào VS Code/Notepad++ không còn newline do visual
      wrap.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | TypeScript/Vite production build passes |
| Integration | Không yêu cầu; backend và IPC không đổi |
| E2E | Manual Proxy Logs và terminal clipboard scenarios |
| Platform | Manual Windows Tauri smoke với Codex hoặc OpenCode |
| Release | `validate:quick` được chạy và mọi blocker có sẵn được ghi rõ |

Chạy:

```powershell
npm.cmd run build
npm.cmd run validate:quick
git --git-dir=.git --work-tree=. diff --check
```

`validate:quick` phải được thử, nhưng không sửa formatting Rust hoặc các script
Harness thiếu nằm ngoài story. Không claim một check pass nếu command chưa chạy
hoặc bị chặn.

## Harness Delta

Sau khi implementation và validation hoàn tất:

```bash
./scripts/harness story update \
  --id US-005 \
  --status implemented \
  --unit 1 \
  --integration 0 \
  --e2e 0 \
  --platform <1-if-Tauri-smoke-passed-otherwise-0> \
  --evidence "npm build passed; manual log pagination/selection and terminal clipboard results"

./scripts/harness query matrix
```

Ghi Standard trace theo `docs/TRACE_SPEC.md`, gồm intake ID, `US-005`, files
read/changed, validation, errors và harness friction. Chỉ đánh dấu
`implemented` khi build pass và acceptance chính đã được kiểm tra; nếu chưa
chạy được Tauri smoke thì platform proof phải là `0`.

## Evidence

Chưa có implementation evidence. Baseline tại thời điểm lập kế hoạch:

- `npm.cmd run build`: passed.
- Worktree: clean.
- Harness matrix: chưa có `US-005`.
