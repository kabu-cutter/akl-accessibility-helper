# AKL Accessibility Helper v1.1.9

Chrome の通常右クリックメニューから、Windows のスクリーンキーボード（`osk.exe`）を起動するための Chrome 拡張です。

この版は Git 管理しやすいように、`.gitignore`、`CHANGELOG.md`、`VERSION`、`docs/` を追加した整理版です。

## フォルダ構成

```text
akl-accessibility-helper/
├─ manifest.json
├─ background.js
├─ popup.html
├─ popup.js
├─ style.css
├─ windows_setup/
│  ├─ 01_install_native_host.cmd
│  ├─ 01_install_native_host.ps1
│  ├─ 02_test_osk_direct.cmd
│  ├─ 03_uninstall_native_host.cmd
│  └─ 03_uninstall_native_host.ps1
├─ native_host_windows/
│  ├─ akl_osk_host.cmd
│  ├─ akl_osk_host.ps1
│  └─ com.akl.accessibility_keyboard.example.json
├─ docs/
│  ├─ setup_windows.md
│  └─ git_start.md
├─ CHANGELOG.md
├─ VERSION
└─ .gitignore
```

## 初回セットアップ

1. ZIP を展開します。
2. Chrome で `chrome://extensions/` を開きます。
3. デベロッパーモードを ON にします。
4. 「パッケージ化されていない拡張機能を読み込む」で、このフォルダを選びます。
5. `windows_setup/01_install_native_host.cmd` を実行します。
6. Chrome を完全終了して再起動します。
7. 通常のWebページで右クリックし、`Launch Windows On-Screen Keyboard` を選びます。

`chrome://` ページ上では右クリックメニューやスクリプト実行が制限されるため、通常のWebページで試してください。

## Git 管理

詳しくは `docs/git_start.md` を見てください。
