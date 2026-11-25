# Design

An absent hop means Direct; legacy proxyHost/proxyPort settings migrate to HTTP.
Enter and Go share one open/navigate path and never redirect into Settings.

HTTP without credentials and SOCKS5 without credentials use native proxy support.
SSH, SOCKS4, HTTPS proxy and authenticated proxy routes use a loopback HTTP/CONNECT
adapter. It preserves website origins, streams bodies and supports multiple
destination hosts. SSH uses the existing exact fingerprint check and password or
private-key/passphrase authentication. A failed route never falls back to Direct.

Native WebView2 profiles require stable proxy arguments. Adapter listeners retain
their loopback addresses per logical route during the app lifetime; closing a
browser cancels upstream work and disables forwarding while retaining the local
port reservation. Reopening the route reuses that address. Profile keys include
connection identity but exclude passwords; listener ports are not profile keys.

One native view per tab (up to 32); only the selected one is visible. SSH tabs
share a pinned SSH handle through reference-counted route leases. Closing the
last lease cancels upstream work. Native setup/authentication is cancellable and
does not hold the tab/session lock. Monotonic viewport revisions prevent stale
cleanup from hiding a newly selected tab. Popups create managed tabs on their
source's live connection.

Version-2 settings hold the current connection and named profiles. Legacy HTTP
settings become a named HTTP profile while retaining the old cookie route key.
Each profile has a stable ID; credential/endpoint edits rotate a route revision
without including secrets in native profile paths. Renaming retains cookies.
Deleting a saved profile preserves the live/draft route, with no silent Direct
fallback. History stores up to 1000 successful navigations separately. A visit
ID combines native session and navigation sequence. Title updates cannot recreate
deleted entries; clearing marks existing navigations recorded. Reopen resolves
the named connection or checks the exact anonymous route, never merely its type.

Document success comes from main-frame WebView2 navigation completion, including
HTTP 502/503/504 handling. Adapter errors may enrich an existing document error;
subresource/background failures cannot mark a loaded document failed or prevent
its history entry. A native fixture explicitly blocks an optional image while
checking a successful SSH page/history, and separately rejects main forwarding.

Windows DPAPI protects saved passwords and key passphrases. The UI reuses the
existing ProxyHopEditor and fingerprint field. Website content keeps no native
permissions, and no credentials enter logs, status text or route profile names.
