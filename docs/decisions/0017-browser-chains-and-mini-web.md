# 0017 Ordered browser routes and shared mini web previews

Date: 2026-11-14
Status: Accepted by user instruction; the user explicitly selected preview/list
cards that activate web tabs in the main area.

Compose up to eight proxy/SSH hops in a byte-stream pipeline. Intermediate HTTP
uses CONNECT, HTTPS wraps a verified TLS stream, SOCKS4a/5 sends destination names
to the proxy, and SSH direct-tcpip channels provide the next transport. Establish
each downstream SSH through the preceding route and reuse its pinned authenticated
handle. The final HTTP proxy retains absolute-form HTTP forwarding, so only
intermediate HTTP proxies require CONNECT for ordinary HTTP websites.

Preserve legacy one-hop identities and cookie profiles. Ordered identities cover
all stages and their order, while secrets remain outside hashes and use Windows
DPAPI on disk. No route failure changes the chosen sequence or falls back Direct.

Use two optional mini web navigation areas alongside existing terminal panels.
They reference the existing tab set rather than opening duplicate native views.
Capture actual WebView2 content to in-memory scaled previews; refresh only the
selected visible page while previews are enabled. Title/URL placeholders cover
new or unavailable captures. A parent controller exposes tab selection/close/add
without exposing connection credentials. Keep the browser mounted across empty
terminal views. Terminal selection and group input remain owned by terminal cards.

Track implementation and local/native proof in US-071. External corporate chains,
SSO/HTTPS trust and non-Windows acceptance require separate real-environment checks.
