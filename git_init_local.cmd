@echo off
setlocal
cls

echo ============================================================
echo AKL Accessibility Helper
echo Local Git Init Helper
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

if not exist ".git" (
  git init
)

git add .
git commit -m "Initial commit: AKL Accessibility Helper v1.1.9"
git tag v1.1.9

echo.
echo Done.
echo.
git status
echo.
pause
exit /b 0
