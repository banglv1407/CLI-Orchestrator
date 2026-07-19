# Validation Plan

## Automated Tests

1. **Rust Unit Tests**:
   - Test config migration: load mock config with missing IDs, verify UUIDs are generated and config is saved.
   - Test SQLite database operations: insert, increment, and reset usage.
   - Test model routing resolution: verify `"clx:<backend-uuid>"` resolves to correct backend and rewrites correctly.
   - Test stream options injection: verify `include_usage` is auto-injected.

2. **Frontend Compilation**:
   - Run `npm run build` to ensure TypeScript interfaces and components compile cleanly.

## Manual Verification

1. Verify proxy `GET /v1/models` returns synthetic model listings.
2. Send chat completions using synthetic model, verify routing works, and verify SQLite tokens count updates.
3. Perform a usage reset per backend in the UI, verify tokens set back to 0.

## Acceptance Evidence

1. React frontend compiles cleanly with TypeScript using `npm run build`:
   ```text
   vite v6.4.1 building for production...
   ✓ 57 modules transformed.
   dist/assets/index-CzZ0a9Bb.js   827.25 kB │ gzip: 217.72 kB
   ✓ built in 2.91s
   ```

2. Cargo unit and integration tests compile and pass cleanly:
   ```text
   running 33 tests
   test core::proxy_usage_db::tests::test_sql_operations_in_memory ... ok
   test core::proxy_server::tests::streams_upstream_chunks_without_buffering_completion ... ok
   test result: ok. 32 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.19s
   ```
   All SQL upsert conflict increments, default row insertions, and reset states tested in-memory.

3. Config migration, routing, and sliding-window token logging compiled successfully without warnings.
