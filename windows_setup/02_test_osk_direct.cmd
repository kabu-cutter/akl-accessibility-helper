@echo off
setlocal
cls

echo ============================================================
echo AKL Accessibility Keyboard
echo Direct OSK Test
echo ============================================================
echo.

set "OSK1=%WINDIR%\System32\osk.exe"
set "OSK2=%WINDIR%\Sysnative\osk.exe"

if exist "%OSK1%" (
  start "" "%OSK1%"
  echo [OK] Launch request sent:
  echo %OSK1%
  echo.
  pause
  exit /b 0
)

if exist "%OSK2%" (
  start "" "%OSK2%"
  echo [OK] Launch request sent:
  echo %OSK2%
  echo.
  pause
  exit /b 0
)

echo [INFO] Trying osk.exe from PATH...
start "" osk.exe
if errorlevel 1 (
  echo [ERROR] Failed to start osk.exe.
  echo.
  pause
  exit /b 1
)

echo [OK] Launch request sent.
echo.
pause
exit /b 0
