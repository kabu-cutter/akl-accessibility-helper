# Changelog

## v1.1.9 - Git-ready package

- Added `.gitignore`.
- Added `README.md`.
- Added `CHANGELOG.md`.
- Added `VERSION`.
- Added `docs/setup_windows.md`.
- Added `docs/git_start.md`.
- Updated manifest version to `1.1.9`.

## v1.1.8 - Two-folder Windows OSK package

- Separated user-run files into `windows_setup/`.
- Separated Native Messaging host files into `native_host_windows/`.
- Kept CMD files ASCII-only.
- Right-click menu launches Windows On-Screen Keyboard after native host registration.

## v1.1.7 - Native host registration fix

- Fixed PowerShell path escaping issue.
- Avoided fragile generated PowerShell.
- Used a bundled `.ps1` installer.

## v1.1.6 - ASCII CMD package

- Removed Japanese text and Unicode symbols from `.cmd` files.
- Removed `chcp 65001`.
- Kept `pause` so results remain visible.

## v1.1.5 - Windows accessibility keyboard target

- Replaced AKL Helper launch/restart actions with Windows On-Screen Keyboard launch.

## v1.1.4 - Right-click launch version

- Added a right-click menu launch action.
- Changed test-page navigation to reuse the active tab when possible.
