# Web browser

CLX provides a Web view using Microsoft Edge/Chromium WebView2 within Tauri on
Windows. Each tab is a native content view that loads documents, styles, scripts,
images, fetch/XHR, WebSockets and downloads through its selected connection.
This is separate from CliProxyAI and the OS proxy.

- Open Web from the activity bar or `Ctrl+P > View: Web`.
- Enter a website address and press Enter or Go to open/navigate immediately.
  Direct access is the default and requires no proxy setup. Connection settings
  is optional. Saving a profile or restarting CLX never visits a URL automatically.
- Add/select/close tabs independently (up to 32). New tabs inherit the selected
  connection; only the active native surface is visible. Back, forward, reload,
  stop and address controls operate on that tab. Open tabs are not session-restored.
- Connection settings supports Direct, HTTP, HTTPS (TLS to proxy), SOCKS4 (no
  credentials, remote DNS via SOCKS4a), SOCKS5 (remote DNS, optional user/password)
  and SSH (username/password or private key with optional passphrase). SSH requires
  an exact SHA256 server fingerprint, with a discovery/copy control for review.
  Private keys can be chosen from disk; their contents are never copied into the
  settings. HTTP(S) proxy credentials use Basic authentication. SOCKS4 does not
  support IPv6 destinations. HTTPS sites through HTTP(S) proxies require CONNECT.
- Add proxy hop builds an ordered route of up to eight mixed HTTP/HTTPS, SOCKS4/5
  and SSH hops. Reorder or remove individual hops. Route order is CLX -> hop 1 ->
  hop 2 -> ... -> website. Intermediate HTTP proxies need CONNECT permission to
  the next endpoint. SOCKS and SSH resolve downstream hostnames remotely; only
  the first hop is reached directly. Every HTTPS endpoint verifies TLS and every
  SSH uses its own pinned server key. Downstream fingerprint discovery traverses
  the configured prefix. Failure never skips a link or selects Direct.
- Save, rename/update or delete named connections; select them quickly in the
  toolbar. A connection may be saved without a website address. Settings and the
  last selected URL persist in `~/.ai-cli-manager/web-browser.json`. Windows DPAPI
  protects saved passwords and key passphrases for the current Windows account.
  Changing a route takes effect on the next Enter/Go. Deleting a saved connection
  does not reroute a live tab or silently select Direct.
  Named profiles save the entire ordered chain and protect every hop's secret.
- Cookies and cache use native profiles isolated by connection identity, separate
  from the CLX shell. Legacy HTTP settings/cookies migrate. Renaming retains the
  profile; endpoint/authentication edits get a new route revision. Tabs sharing
  the same profile can share site cookies. TLS certificate checks remain enabled.
- History stores up to 1000 successful navigations in
  `~/.ai-cli-manager/web-browser-history.json`. Search/open records, delete a
  single record or clear all. Title/polling updates do not restore deleted records.
  Reopen uses its saved named connection; a removed or unavailable anonymous
  connection requires explicit selection. Clearing history does not clear cookies.
- Content never receives CLX command permissions. App schemes, local app origins
  and external application protocols cannot be opened by the content view.
- New-window links open in a new managed tab using the source tab's live route.
- Switching views or opening CLX overlays hides the native content surface.
  Tabs also remain available in an empty terminal workspace. Closing a tab releases
  its view; the last SSH
  tab on a route cancels that route's upstream work. Native errors remain visible;
  proxy failure never selects a direct route.
- Mini web placement in the toolbar is Hidden (default), Right, Bottom or Both.
  Web has its own right column and bottom row, separated from terminal previews.
  Both areas reference the same tab set. Clicking a card opens the tab in the main
  area; closing it releases only that web tab. Adding a tab inherits the current
  connection. These actions never select a terminal broadcast group or stop a PTY.
  Each web area can be hidden independently. Preview/Title only is shared between
  the two web areas and remains independent of terminal display choices. Placement
  and display persist in `clx-web-mini-panels`; open tab lists remain session-only.
  Native previews are scaled snapshots of the selected visible website, refreshed
  periodically while preview mode is enabled. They remain in memory and introduce
  no duplicate browsing session or iframe. Hidden/new tabs use the last preview or
  a title/URL placeholder; snapshots are not a separate interactive website.
- English, Vietnamese and Korean cover all CLX-owned browser controls. Website
  content keeps its own language.

The example IPs from the request are illustrative and must not be contacted.
Acceptance uses local website/proxy fixtures; real corporate proxy, identity
provider and external-website compatibility requires a separate live check.
