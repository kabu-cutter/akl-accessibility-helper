# Windows セットアップ手順

## 目的

Chrome の右クリックメニューから Windows のスクリーンキーボードを起動できるようにします。

## 手順

1. Chrome で `chrome://extensions/` を開く。
2. デベロッパーモードを ON にする。
3. 「パッケージ化されていない拡張機能を読み込む」を押す。
4. この拡張フォルダを選ぶ。
5. `windows_setup/01_install_native_host.cmd` を実行する。
6. 登録成功が表示されたら Chrome を完全終了して再起動する。
7. 通常のWebページで右クリックする。
8. `Launch Windows On-Screen Keyboard` を選ぶ。

## フォルダの役割

```text
windows_setup/
  ユーザーが実行するファイル

native_host_windows/
  Chrome Native Messaging が使う内部ファイル
```

## 直接テスト

Chrome を使わずに Windows スクリーンキーボードだけ試す場合：

```text
windows_setup/02_test_osk_direct.cmd
```

## 登録解除

Native Host 登録を削除する場合：

```text
windows_setup/03_uninstall_native_host.cmd
```

## 注意

- `.cmd` ファイルは文字化け対策として ASCII のみで作っています。
- `chrome://extensions/` などの Chrome 内部ページでは右クリックメニューをテストしないでください。
- 通常のWebページでテストしてください。
