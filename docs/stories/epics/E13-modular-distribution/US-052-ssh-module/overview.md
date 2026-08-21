# US-052 Overview — SSH module

Status: Not started

Extract SSH terminal, remote files, remote monitoring, file transfer, and
server management into `clx.ssh`. SSH registers remote transports with Core
(the only module with a Core transport hook).

Scope:
- `core/ssh_server.rs` (~720 LOC)
- `commands/cli_commands.rs` SSH-related functions (start/stop_ssh_server, etc.)
- `src/components/RemoteSshPanel.tsx` (~306 LOC)
- `src/components/SshConnectionModal.tsx` (~520 LOC)
- `src/components/SshFileTransferDialog.tsx` (~132 LOC)

Companion SSH tools (ssh.connect, rdp.open, ssh.transfer) already route
through module RPC.
