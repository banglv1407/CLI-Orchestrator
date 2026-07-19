# Validation Plan

## Automated Tests

1. **Rust Unit Tests**:
   - Test domain/URL allowance matching helper.
   - Test config defaults: verify that ChatGPT, Claude, and Gemini profiles are populated with correct URLs and partitions when file is absent.

2. **Frontend Compilation**:
   - Run `npm run build` to verify React components and state compile correctly.

## Manual Verification

1. Verify that clicking "Open" on ChatGPT profile spawns a separate window loading chatgpt.com.
2. Verify that trying to navigate to a disallowed URL (e.g. google.com inside ChatGPT window) is successfully blocked.
3. Verify that cookies are segregated (e.g. logging into ChatGPT does not affect the session in Claude).

## Acceptance Evidence

1. React frontend compiles cleanly with TypeScript using `npm run build`:
   ```text
   vite v6.4.1 building for production...
   ✓ 57 modules transformed.
   dist/assets/index-DWPsf8Lt.css   56.33 kB │ gzip: 11.08 kB
   dist/assets/index-WNKFPR01.js   830.32 kB │ gzip: 218.29 kB
   ✓ built in 2.49s
   ```

2. Cargo unit and integration tests compile and pass cleanly:
   ```text
   running 34 tests
   test core::web_ai_config::tests::test_is_url_allowed ... ok
   test result: ok. 33 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.19s
   ```
   All URL/domain filter match logic fully tested and verified.

3. Secure Web AI child webview spawning, local data directory segregation, on_navigation rules filtering, settings advanced profile editor fields, clear data command, and mythical pet auto-routing wired successfully.
