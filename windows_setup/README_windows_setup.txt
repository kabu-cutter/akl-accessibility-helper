AKL Accessibility Keyboard - Windows setup

Folder layout:

1. windows_setup
   Run files for the user.
   Use 01_install_native_host.cmd once.
   Use 02_test_osk_direct.cmd to test osk.exe directly.
   Use 03_uninstall_native_host.cmd only when removing the native host registration.

2. native_host_windows
   Internal files used by Chrome Native Messaging.
   Do not move, rename, or run these files manually.

Setup:

1. Load this folder as an unpacked Chrome extension.
2. Open the extension popup.
3. Click Copy Extension ID only if the installer asks for it.
4. Run windows_setup\01_install_native_host.cmd once.
5. Restart Chrome completely.
6. Open a normal web page.
7. Right click and choose:
   Launch Windows On-Screen Keyboard

Expected result:

After native host registration succeeds and Chrome is restarted, the normal page right-click menu launches the Windows On-Screen Keyboard in one step.

Notes:

- CMD files use ASCII only.
- The installer writes this log file:
  AKL_Windows_NativeHost_Install_Log.txt
- The right-click menu cannot run on chrome:// pages.
