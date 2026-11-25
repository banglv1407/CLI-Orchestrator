# Validation

## Proof strategy

- Rust: reject invalid/unsafe URLs, proxy endpoints and bounds; preserve settings
  on invalid saves; isolate proxy profiles and reject untrusted command callers.
- Frontend: settings/URL validation, navigation lifecycle, sidebar persistence,
  translations and production build.
- Native Windows: render HTML/CSS/JavaScript/image; use fetch and WebSockets;
  preserve cookies, follow redirects and navigate through a local forward proxy;
  prove unreachable fixture hostnames work only through that proxy; prove remote
  content cannot invoke CLX commands and failed proxy does not connect directly.
- Inspect English, Vietnamese and Korean controls and native viewport resizing.
- Build/artifact evidence is separate from native content acceptance. External
  corporate proxies, real identity providers and other OSes remain unverified.

## Evidence

Baseline localization audit: 1587 messages passed before this change.

- Focused Rust configuration/security/persistence tests: 7 passed.
- Website/proxy/bounds and sidebar migration tests: 10 passed.
- Existing interface-language tests: 10 passed; terminal shortcut tests: 4 passed.
- Localization audit: 1635 complete messages passed. English, Vietnamese and
  Korean native settings screenshots were visually inspected.
- Production TypeScript/Vite build passed.
- Current native development binary: 14 local integration cases passed, including
  full HTML/CSS/JS/image/dynamic-import/fetch/WebSocket loading, preserved origins,
  cookies and form POST, back/forward/redirect/popup navigation, actual native
  visibility alongside the pet, hiding for Settings, native window resizing,
  on-disk configuration, rejected custom/built-in IPC, blocked app origins and
  failure without a direct loopback bypass. Report:
  `.temp/web-browser-native/c1e9bb21-a1b6-4445-970e-6108bd8b25c8/report.json`.
- Windows PrintWindow captured the owned test window and its real content surface;
  CDP child-surface screenshots are unsupported in this runtime. DevTools gestures
  explicitly mark user activation and wait for document completion.
- Existing desktop process 15872 was preserved throughout the native run.

Final optimized portable artifact: `src-tauri/target/release/CLX (1110).exe`,
42,523,648 bytes, version 0.2.3, Windows x64 PE32+ GUI. SHA-256:
`4E290DC2DB879C7E17AC937161576CA5067F7232B787344210C5C20AD0CF5225`.
All 151 recorded Rust/frontend/config source hashes remained unchanged across the
production build. Artifact report: `.temp/web-browser-release-artifact.json`.

The final optimized portable EXE passed the same 14 real native integration
cases, including its embedded production frontend. Report:
`.temp/web-browser-native/f0eb727f-be67-4c1f-93a3-648d6250caa4/report.json`.
Native content and localized UI captures are in that report directory. The test
application and its child processes were closed; the existing CLX desktop
instance remained running.

External proxies, corporate identity providers, HTTPS certificate infrastructure,
download-destination behavior, non-Windows platforms and physical keyboard input
are not certified by these local fixtures. No illustrative IP was contacted.
