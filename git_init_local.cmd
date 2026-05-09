@echo off
setlocal
cls

echo ============================================================
echo AKL Accessibility Helper - Local Git Init
echo ============================================================
echo.

git --version >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Git was not found.
  echo Install Git for Windows first.
  echo.
  pause
  exit /b 1
)

if not exist manifest.json (
  echo [ERROR] manifest.json was not found.
  echo Run this file from the extension root folder.
  echo.
  pause
  exit /b 1
)

git init
if errorlevel 1 goto fail

git add .
if errorlevel 1 goto fail

git commit -m "Initial commit: AKL Accessibility Helper v1.2.0"
if errorlevel 1 goto fail

git tag v1.2.0
if errorlevel 1 goto fail

echo.
echo Git init completed.
git status
echo.
pause
exit /b 0

:fail
echo.
echo Git init failed.
echo If this is your first commit, set user.name and user.email.
echo.
pause
exit /b 1
