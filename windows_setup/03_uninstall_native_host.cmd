@echo off
setlocal
cls

echo ============================================================
echo AKL Accessibility Keyboard
echo Native Host Uninstaller
echo ============================================================
echo.

set "PS1=%~dp003_uninstall_native_host.ps1"
if not exist "%PS1%" (
  echo [ERROR] 03_uninstall_native_host.ps1 was not found.
  echo.
  pause
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%"
set "RESULT=%ERRORLEVEL%"
echo.
pause
exit /b %RESULT%
