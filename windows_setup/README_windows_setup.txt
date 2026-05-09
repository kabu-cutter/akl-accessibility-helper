AKL Accessibility Helper Windows Setup
Version 1.2.0

Run these files from this folder:

01_install_native_host.cmd
  Registers the Chrome Native Messaging Host.

02_test_osk_direct.cmd
  Starts osk.exe directly without Chrome.

03_uninstall_native_host.cmd
  Removes the Native Messaging Host registration.

After 01_install_native_host.cmd succeeds, restart Chrome completely.
Then open the extension popup and click Check Windows Native Host.
After the check succeeds, right click a normal web page and choose:
Launch Windows On-Screen Keyboard

CMD files are ASCII-only.
