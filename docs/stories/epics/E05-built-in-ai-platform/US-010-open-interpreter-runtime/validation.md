# Validation Plan

## Automated Tests

1. **Rust Unit Tests**:
   - Verify parsing of embedded `open-interpreter-manifest.json`.
   - Verify SHA-256 validator matches expected test hashes.
   - Verify that starting the process while already running is ignored.
   - Verify that sending a message writes to stdout stream correctly.

2. **Frontend Compilation**:
   - Run `npm run build` to verify TypeScript definitions.

## Acceptance Evidence

1. React frontend compiles cleanly with TypeScript using `npm run build`:
   ```text
   vite v6.4.1 building for production...
   ✓ 57 modules transformed.
   dist/assets/index-DWPsf8Lt.css   56.33 kB │ gzip: 11.08 kB
   dist/assets/index-WNKFPR01.js   830.32 kB │ gzip: 218.29 kB
   ✓ built in 2.40s
   ```

2. Cargo unit and integration tests compile and pass cleanly:
   ```text
   running 36 tests
   test core::open_interpreter::tests::test_manifest_parsing ... ok
   test core::open_interpreter::tests::test_sha256_verifier ... ok
   test result: ok. 35 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.19s
   ```
   Manifest embedded parsing and sha256 validators fully verify runtime.

3. Process spawning, oneshot kill channel logic, proxy auto-start, and tauri commands integrated successfully.
