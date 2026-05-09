# Changelog

## v1.2.1
- Fixed Service Worker registration failure caused by invalid newline characters in JavaScript string literals.
- Fixed `background.js` and `popup.js` syntax errors.
- Replaced Windows path text in JavaScript UI messages with forward slashes to avoid escape-character issues.
- Kept Windows CMD files ASCII-only.

## v1.2.0

- Added stronger Native Host check from the popup.
- Added diagnostics command in the Windows Native Host.
- Added popup status area for extension version, extension ID, and host status.
- Added `Copy last diagnostics` button.
- Improved right-click launch error message.
- Kept `.cmd` files ASCII-only.

## v1.1.9

- Added Git-ready files: `.gitignore`, `README.md`, `CHANGELOG.md`, `VERSION`, and docs.
- Added local Git initialization helper.

## v1.1.8

- Split Windows files into two folders: `windows_setup` and `native_host_windows`.
- Kept user-run files separate from internal native host files.

## v1.1.7

- Fixed PowerShell path escaping.
- Switched to a bundled installer script instead of generating complex PowerShell from CMD.

## v1.1.6

- Changed CMD files to ASCII-only.
- Removed Japanese and Unicode characters from CMD output.

## v1.1.5

- Replaced AKL helper restart action with Windows On-Screen Keyboard launch action.
- Added Native Messaging Host setup.

## v1.1.4

- Added right-click menu launch flow.
- Used same-tab navigation for the test page.
