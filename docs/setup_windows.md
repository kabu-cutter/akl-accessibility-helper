# Windows setup

Version: 1.2.0

## 1. Load the extension

Open Chrome and go to:

```text
chrome://extensions/
```

Enable Developer mode, then choose `Load unpacked` and select this folder.

## 2. Register the Native Host

Run:

```text
windows_setup/01_install_native_host.cmd
```

If the installer asks for the Extension ID, copy it from the extension popup or from `chrome://extensions/`.

## 3. Restart Chrome

Close all Chrome windows completely, then open Chrome again.

## 4. Check the host

Open the extension popup and click:

```text
Check Windows Native Host
```

Expected result:

```text
Native Host: OK
```

## 5. Launch the keyboard

Right click a normal web page and choose:

```text
Launch Windows On-Screen Keyboard
```

## Troubleshooting

If the host check fails:

1. Run `windows_setup/01_install_native_host.cmd` again.
2. Restart Chrome completely.
3. Try `Check Windows Native Host` again.
4. Check `AKL_Windows_NativeHost_Install_Log.txt` in the extension folder.
5. Check `%TEMP%/AKL_NativeHost_Log.txt` for native host logs.
