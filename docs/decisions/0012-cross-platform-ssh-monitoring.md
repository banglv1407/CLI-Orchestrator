# 0012 Cross-Platform SSH Monitoring

Date: 2026-07-19

## Status

Accepted

## Context

The existing Dashboard tracks only local numeric ports, uses Windows-shaped
netstat parsing, guesses a nearby log file, and kills a discovered PID without
revalidating its identity. The requested feature adds direct and jump-host SSH,
Linux and Windows targets, live logs, credentials, and remote process control.

## Decision

- Model monitoring as versioned target-aware records instead of a local array
  of port numbers.
- Use native `russh` client sessions. A jump route authenticates to the jump,
  opens `direct-tcpip`, and authenticates independently to the final target.
- Keep Linux and Windows probe/log/kill adapters behind one typed command
  boundary and return structured status instead of parsing in React.
- Store SSH secrets in an OS credential vault with session-only fallback.
- Revalidate PID plus process start token before normal or force termination.
- Accept SSH server keys without verification, as explicitly selected, and
  expose that state in the UI.

## Alternatives Considered

1. Reuse the system `ssh` executable and askpass scripts. Rejected because two
   independent hop credentials and cancellation are unreliable.
2. Install an agent on every target. Rejected because the feature must work
   with existing OpenSSH hosts.
3. Reuse Operator SSH profiles. Rejected because monitor-specific credentials
   and routes were explicitly requested.

## Consequences

Positive:

- Direct and one-hop routes share the same typed behavior.
- Secret values do not enter the persisted monitor JSON.
- Process control has a stale-identity guard.

Tradeoffs:

- Remote targets need OpenSSH plus a supported shell/tool fallback.
- Disabling host-key verification exposes routes to man-in-the-middle attacks.
- Some services have no recoverable historical stdout; manual log sources stay
  necessary.

## Follow-Up

- Track UDP and multi-jump routes as later stories.

