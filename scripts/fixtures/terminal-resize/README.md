# Native ConPTY resize captures

Captured on 2026-10-13, Windows build 26300, using the installed
`portable-pty 0.8.1` backend used by CLX. An isolated PowerShell process prints
60 lines exactly once and then waits for input:

```powershell
for ($fixtureIndex = 1; $fixtureIndex -le 60; $fixtureIndex++) {
    [Console]::WriteLine(('FIXTURE_{0:D3} ' -f $fixtureIndex) + ('abcdefghijklmnopqrst' * 5))
}
[Console]::Write('CAPTURE_READY> ')
while ($true) { [Console]::ReadLine() | Out-Null }
```

Each JSON stage records the native grid size and raw output chunks emitted
after that resize. No additional output or commands were sent during resize.
The height, width, and mixed sequences reproduced overwritten history and
duplicated lines in the previous renderer. Tests replay their exact bytes
using the installed xterm and the production `ConptyResizeAddon`, checking
every character and marker after every resize.

The captures are deterministic regression inputs; they do not replace live
Windows agent smoke testing. The isolated capture utility is retained under
`.temp/terminal-resize-investigation/capture/` in the investigation workspace.
