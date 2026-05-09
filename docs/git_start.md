# Git 管理の始め方

## Git をインストールしたあと

拡張フォルダを開いて、コマンドプロンプトまたは PowerShell で以下を実行します。

```cmd
git init
git add .
git commit -m "Initial commit: AKL Accessibility Helper v1.1.9"
git tag v1.1.9
```

## GitHub に上げる場合

GitHubで空のリポジトリを作成してから、以下を実行します。

```cmd
git remote add origin https://github.com/YOUR_NAME/akl-accessibility-helper.git
git branch -M main
git push -u origin main
git push origin v1.1.9
```

`YOUR_NAME` は自分の GitHub ユーザー名に置き換えてください。

## ZIPをGitに入れない理由

配布用ZIPは生成物なので、Gitには入れない方が管理しやすいです。
このパッケージでは `.gitignore` に `*.zip` と `releases/` を入れています。

## 今後のバージョン例

```text
1.1.9  Git管理用整理
1.2.0  設定画面追加
1.2.1  小さな不具合修正
2.0.0  大きな仕様変更
```
