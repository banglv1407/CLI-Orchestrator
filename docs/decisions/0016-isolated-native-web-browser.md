# 0016 Isolated native Web browser

Date: 2026-11-10
Status: Accepted by user instruction to implement the discussed WebView direction.

Use a native child WebView for complete websites through a configured HTTP proxy.
The trusted shell keeps controls and configuration; untrusted content receives no
custom-command access. Use endpoint-scoped profiles so proxy arguments cannot
change CLX's own networking. A failed route must never silently become direct.

An iframe is unsuitable for sites that prohibit framing and cannot independently
set browser proxy networking. Fetching and rewriting HTML does not preserve the
full site's origin, script, cookie, WebSocket and navigation behavior.

Track implementation and native fixture proof as US-069.

2026-11-11 extension (US-070): the same isolated child-view architecture supports
multiple tabs, Direct and named HTTP/HTTPS/SOCKS/SSH routes. Use an application
loopback HTTP/CONNECT adapter when native proxy options cannot carry the protocol
or its authentication. Reuse pinned SSH transport; reserve stable adapter ports
for WebView2 environment reuse and reference-count shared tab leases. Protect
saved secrets with Windows DPAPI and keep navigation history in a separate file.
Remote content still has no CLX permissions. This remains Windows-native
acceptance; other OS runtimes require their own checks.
