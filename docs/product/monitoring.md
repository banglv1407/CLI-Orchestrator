# Service Monitoring

The Dashboard Port Monitor tracks TCP listeners on the local machine or on a
remote machine reached directly over SSH or through one SSH jump host.

## Monitor Contract

- A monitor identifies one TCP port on one final target. A jump host only
  transports the SSH connection; probes and actions run on the final target.
- Targets may be local, Linux-family SSH hosts, or Windows hosts running
  OpenSSH Server and PowerShell.
- Connection failures, permission failures, unsupported targets, and a closed
  port are separate states. Stale data must be visibly marked.
- Multiple listener processes are preserved after duplicate IPv4/IPv6 rows for
  the same process have been removed.

## Log Contract

- Automatic discovery may use systemd, Docker/Podman, process stdout/stderr,
  Windows Event Log, or bounded file discovery.
- An ambiguous source must be presented for selection rather than silently
  treated as the service log.
- Manual sources support files, systemd units, containers, Windows Event Log,
  and an explicitly enabled expert follow command.
- Live logs are memory-bounded, cancellable, pausable, and are not persisted by
  CLX.

## Process Control Contract

- A kill request includes the PID and process start token observed during the
  confirmation step. The backend revalidates that identity against the port
  immediately before acting.
- Normal stop is attempted before force kill. Force kill is a separate action.
- When several processes own a port, the default action targets selected PIDs;
  killing all requires a separate confirmation.
- Sudo credentials are never stored. Windows SSH accounts must already have
  the required process permissions.

## Credential Contract

- Target and optional jump credentials belong to the monitor and do not reuse
  Operator profiles.
- Passwords and private-key passphrases are write-only secrets stored in the
  operating-system credential vault. If the vault is unavailable, secrets are
  session-only and never written as plaintext.
- Host-key verification is disabled by explicit product choice. The UI must
  label these SSH routes as unverified.

