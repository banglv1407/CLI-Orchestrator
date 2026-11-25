# Design

The trusted React shell owns configuration, navigation controls and native
viewport bounds. Rust owns validation, durable configuration and the content
WebView lifecycle. Only the main trusted shell may call browser commands.
Remote content is denied access to all custom CLX commands independently of its
current origin. Native navigation blocks application schemes/origins.
The tracked Tauri configuration selects an inline capability scoped only to the
`main` WebView. Window-wide permissions would also authorize local-origin frames
inside a content child, so the browser receives no built-in event/window/dialog
permissions even if a frame loads an application origin.

Use a native child WebView rather than an iframe or HTML-response rewriting.
Preserve website origins, cookies, redirects and browser networking. On Windows,
each proxy endpoint uses a distinct data directory and explicit proxy arguments;
Wry's custom arguments replace its generated arguments, so include the proxy
explicitly. Disable implicit loopback bypass for the content view only.

Serialize native operations. Session IDs prevent late cleanup or state events
from affecting a subsequently opened browser. Bounds come from the actual React
viewport in physical pixels and follow resizing, scaling and visibility.
Window-only operations use `tauri::Window`; `WebviewWindow` extraction becomes
invalid once a child is attached. Nonmodal pet surfaces do not suspend the native
browser. A trusted-shell reload releases any outstanding content session.

Native test launchers use CLX_WEBVIEW_DATA_DIR for the trusted shell only, through
the native builder API, and CLX_WEB_BROWSER_DATA_DIR for isolated browser data.
The global WEBVIEW2_USER_DATA_FOLDER override would force distinct routes into
one environment and is deliberately absent in the integration launcher.

Configuration uses a separate JSON file; browser profiles are endpoint-scoped.
No migration or deletion of existing user data is needed. No website contents,
credentials or response bodies are recorded in application logs.
