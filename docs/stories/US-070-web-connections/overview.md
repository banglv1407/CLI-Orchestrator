# US-070: Immediate web navigation and connection choices

Enter/Go must open a website immediately, including before a content view exists.
Direct browsing is the default and needs no proxy settings. The optional route
editor supports HTTP/HTTPS, SOCKS4/5 and SSH password/private-key authentication.
Reuse the existing SSH fingerprint discovery and exact-pin transport contract.

Use Windows WebView2 (Edge/Chromium) within the Tauri desktop app. Add multiple
managed tabs, named connection profiles with quick selection and saved browsing
history with reopen, individual deletion and clear-all. Saving a profile must not
contact its website. Settings and history survive a trusted frontend restart.

Affected contract: `docs/product/web-browser.md`. Preserve old HTTP settings and
cookies, native content isolation, localization and unrelated worktree changes.
