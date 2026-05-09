@echo off
setlocal
cls

echo ============================================================
echo AKL Accessibility Keyboard
echo Native Host Installer
echo ============================================================
echo.

set "EXT_DIR=%~dp0.."
set "PS1=%~dp001_install_native_host.ps1"

if not exist "%EXT_DIR%\manifest.json" (
  echo [ERROR] manifest.json was not found.
  echo This CMD file must stay in the windows_setup folder.
  echo.
  pause
  exit /b 1
)

if not exist "%PS1%" (
  echo [ERROR] 01_install_native_host.ps1 was not found.
  echo.
  pause
  exit /b 1
)

echo Extension folder:
echo %EXT_DIR%
echo.
echo Starting registration...
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -ExtensionDir "%EXT_DIR%"
set "RESULT=%ERRORLEVEL%"

echo.
if "%RESULT%"=="0" (
  echo ============================================================
  echo Registration completed.
  echo Restart Chrome completely.
  echo Then right click a normal web page and choose:
  echo Launch Windows On-Screen Keyboard
  echo ============================================================
) else (
  echo ============================================================
  echo Registration failed.
  echo Check this log file:
  echo AKL_Windows_NativeHost_Install_Log.txt
  echo ============================================================
)
echo.
pause
exit /b %RESULT%
