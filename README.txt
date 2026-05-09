AKL Accessibility Helper v1.1.8

This package launches Windows On-Screen Keyboard from the normal Chrome right-click menu.

Main folders:

- windows_setup
  User-run setup files.

- native_host_windows
  Internal native host files for Chrome Native Messaging.

First setup:

1. Load this folder in chrome://extensions/ as an unpacked extension.
2. Run windows_setup\01_install_native_host.cmd once.
3. Restart Chrome completely.
4. Open a normal web page.
5. Right click and choose:
   Launch Windows On-Screen Keyboard

Do not test on chrome:// pages. Use a normal web page.
