Unicode true
Name "CLX module section smoke"
OutFile "..\\target\\nsis-module-smoke.exe"
InstallDir "$TEMP\\clx-nsis-smoke"

!include "LogicLib.nsh"
!include "Sections.nsh"
!include "FileFunc.nsh"
!include "StrFunc.nsh"
${StrLoc}

!macro CheckIfAppIsRunning executable display_name
!macroend

!include "..\\src-tauri\\windows\\modules.nsh"

Function .onInit
  !insertmacro CLX_MODULE_INIT
FunctionEnd

Section "CLX Core (required)" SEC_CORE
  SectionIn RO
SectionEnd

!insertmacro CLX_MODULE_SECTIONS

Section "Uninstall"
  !insertmacro CLX_MODULE_UNINSTALL
SectionEnd
