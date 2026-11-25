param(
    [Parameter(Mandatory = $true)][int]$ProcessId,
    [Parameter(Mandatory = $true)][string]$OutputPath
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class WebBrowserWindowCapture {
    [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
    [StructLayout(LayoutKind.Sequential)] public struct POINT { public int X, Y; }
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr window, out RECT rect);
    [DllImport("user32.dll")] public static extern bool ClientToScreen(IntPtr window, ref POINT point);
    [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr window, IntPtr deviceContext, uint flags);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr window, out uint processId);
}
'@
[void][WebBrowserWindowCapture]::SetProcessDPIAware()
$nativeProcess = Get-Process -Id $ProcessId
$nativeWindow = $nativeProcess.MainWindowHandle
if ($nativeWindow -eq [IntPtr]::Zero) { throw 'The test application has no visible window.' }
$nativeOwner = [uint32]0
[void][WebBrowserWindowCapture]::GetWindowThreadProcessId($nativeWindow, [ref]$nativeOwner)
if ($nativeOwner -ne $ProcessId) { throw 'The window does not belong to the test application.' }
$nativeRectangle = New-Object WebBrowserWindowCapture+RECT
$nativeOrigin = New-Object WebBrowserWindowCapture+POINT
if (-not [WebBrowserWindowCapture]::GetClientRect($nativeWindow, [ref]$nativeRectangle)) { throw 'Could not read the test window bounds.' }
if (-not [WebBrowserWindowCapture]::ClientToScreen($nativeWindow, [ref]$nativeOrigin)) { throw 'Could not locate the test window.' }
$nativeBitmap = $null
$nativeGraphics = $null
try {
    $nativeBitmap = New-Object System.Drawing.Bitmap(($nativeRectangle.Right - $nativeRectangle.Left), ($nativeRectangle.Bottom - $nativeRectangle.Top))
    $nativeGraphics = [System.Drawing.Graphics]::FromImage($nativeBitmap)
    $nativeDeviceContext = $nativeGraphics.GetHdc()
    try {
        if (-not [WebBrowserWindowCapture]::PrintWindow($nativeWindow, $nativeDeviceContext, 3)) { throw 'The test window could not be captured.' }
    } finally { $nativeGraphics.ReleaseHdc($nativeDeviceContext) }
    $nativeBitmap.Save([System.IO.Path]::GetFullPath($OutputPath), [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
    if ($nativeGraphics) { $nativeGraphics.Dispose() }
    if ($nativeBitmap) { $nativeBitmap.Dispose() }
}
