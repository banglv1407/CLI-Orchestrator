@echo off
setlocal EnableExtensions

cd /d "%~dp0"

set "_CL_="
set "CL="
set "AWS_LC_SYS_PREBUILT_NASM=1"
set "TMP=%SystemRoot%\Temp"
set "TEMP=%SystemRoot%\Temp"
if exist "%LOCALAPPDATA%\Temp" set "TMP=%LOCALAPPDATA%\Temp"
if exist "%LOCALAPPDATA%\Temp" set "TEMP=%LOCALAPPDATA%\Temp"

if exist "C:\Windows\Temp\nasm_extract\nasm-2.16.01\nasm.exe" set "PATH=C:\Windows\Temp\nasm_extract\nasm-2.16.01;%PATH%"

if defined VSCMD_VER goto :run_build

set "VCVARS="
set "VSWHERE=%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"
if exist "%VSWHERE%" for /f "usebackq delims=" %%I in (`"%VSWHERE%" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`) do if exist "%%I\VC\Auxiliary\Build\vcvars64.bat" set "VCVARS=%%I\VC\Auxiliary\Build\vcvars64.bat"
if not defined VCVARS if exist "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat" set "VCVARS=C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"

if defined VCVARS goto :init_msvc
echo [ERROR] Visual Studio C++ Build Tools (vcvars64.bat) not found.
exit /b 1

:init_msvc
call "%VCVARS%" >nul
if errorlevel 1 exit /b 1
set "TMP=%SystemRoot%\Temp"
set "TEMP=%SystemRoot%\Temp"
if exist "%LOCALAPPDATA%\Temp" set "TMP=%LOCALAPPDATA%\Temp"
if exist "%LOCALAPPDATA%\Temp" set "TEMP=%LOCALAPPDATA%\Temp"
cd /d "%~dp0"

:run_build
call npm.cmd run build:production -- --no-bundle --ci %*
if errorlevel 1 goto :build_failed

echo.
echo [OK] Portable executable ready in: %~dp0src-tauri\target\release\
dir /b /o-d "%~dp0src-tauri\target\release\CLX*.exe" 2>nul
exit /b 0

:build_failed
echo [ERROR] Portable build failed with exit code %ERRORLEVEL%.
exit /b %ERRORLEVEL%
