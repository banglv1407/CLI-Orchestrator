# Execution plan

## Phase 1 - Instrument and control ownership

- Add native/document visibility lifecycle handling.
- Add process-tree and UI-lag diagnostics.
- Make Dashboard and Web AI ownership explicit at tab/tray/exit boundaries.

## Phase 2 - Bound repeated work

- Change Dashboard to a non-overlapping 10-second completion loop.
- Aggregate connection history and avoid cloning full proxy bodies.
- Batch monitor-log events and window frontend rendering.

## Phase 3 - Cancellation

- Serialize Web AI launch/close and coalesce resize traffic.
- Make Companion network operations abortable and bounded.
- Add shutdown cleanup with a two-second maximum grace period.

## Phase 4 - Proof

- Run frontend build and focused Rust checks/tests.
- Run Dashboard, high-volume log, Web AI cycle, tray, Companion-cancel, and exit smoke checks.
- Record measured results in `validation.md` and Harness.
- Open `US-025` only if targeted gates fail for causes outside these surfaces.

