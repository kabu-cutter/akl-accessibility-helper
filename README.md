# AKL Accessibility Helper

Version: 1.2.0

Chrome extension for launching the Windows On-Screen Keyboard from the right-click menu.

This package uses Chrome Native Messaging because a Chrome extension cannot directly start a Windows executable by itself.

## Main features

- Right-click menu: `Launch Windows On-Screen Keyboard`
- Popup button to register the right-click menu
- Popup button to check the Windows Native Host
- Popup button to launch the keyboard as a test
- Two-folder Windows layout:
  - `windows_setup` for user-run setup files
  - `native_host_windows` for internal host files

## Windows setup

1. Load this folder in Chrome from `chrome://extensions/`.
2. Enable Developer mode.
3. Choose `Load unpacked`.
4. Select this extension folder.
5. Run `windows_setup/01_install_native_host.cmd`.
6. Restart Chrome completely.
7. Open the extension popup and click `Check Windows Native Host`.
8. Right click a normal web page and choose `Launch Windows On-Screen Keyboard`.

## Notes

- The `.cmd` files use ASCII text only.
- The Native Host is registered under the current Windows user.
- If the check fails, run `windows_setup/01_install_native_host.cmd` again and restart Chrome.
