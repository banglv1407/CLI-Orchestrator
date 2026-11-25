# Execution plan

## Goal and scope

Implement the approved Web view, saved HTTP proxy settings, complete native web
rendering, navigation and lifecycle. Preserve unrelated worktree changes and all
existing user data. Test only local fixtures.

## Risk classification

High risk: untrusted web content, native shell isolation, cross-platform APIs,
public commands and existing navigation. User explicitly approved the native
WebView direction; no further direction decision is pending.

## Phases

1. Inspect live Tauri/Wry APIs, app navigation and existing verification helpers.
2. Implement validated configuration and an isolated native browser lifecycle.
3. Add accessible localized controls and activity-bar/command-palette navigation.
4. Run focused validation and build the Windows portable application.
5. Exercise a packaged native WebView with a local proxy/website fixture.
6. Record actual evidence and remaining external-platform boundaries.

## Stop conditions

Resolve security or isolation failures before claiming acceptance. Do not weaken
TLS checks or fall back to direct networking to make a proxy fixture pass.
