# Design

Route order is CLX -> hop 1 -> hop 2 -> ... -> website. Intermediate HTTP(S)
proxies must permit CONNECT to the next endpoint; SOCKS uses remote DNS and SSH
uses direct-tcpip. Each HTTPS endpoint verifies TLS and each SSH authenticates
against its own exact pin. No failed link chooses Direct or skips a hop.

Legacy hop remains valid; a nonempty hops array is the ordered chain. Conflicting
representations are rejected. Existing one-hop route keys and cookies stay stable.
Prepared SSH handles are shared within a route; later streams use the nearest
upstream SSH handle and tunnel through subsequent proxies. Credential changes
rotate named route revisions; all stored secrets use Windows account protection.

Mini web cards reference the existing tabs, not duplicate native browsing
sessions. Visibility choices are hidden/right/bottom/both, persisted locally.
Cards in both areas activate/close the same tab and stay separate from terminal
selection, drag handling and group input. Preview images remain in memory and
come from the existing native page, with title/URL fallback while unavailable.
