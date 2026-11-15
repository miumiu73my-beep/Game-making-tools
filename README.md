# Game-making-tools — PWA

Scriptable専用の原本 .js を残し、iPhone・iPadのSafariで使えるPWAを追加しました。元コードは削除・上書きしていません。

## 公開・インストール
GitHubリポジトリの **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save** からGitHub Pagesを有効化します。

公開URL: https://miumiu73my-beep.github.io/Game-making-tools/

SafariでURLを開いて **共有 → ホーム画面に追加**。初回読み込みが完了するとService Workerによってツール画面がオフラインでも開けます。ファイルは原則端末内で処理されます。

## ブラウザ版
- グリッドペイント: 既存HTMLをそのまま使い、PWAメタ情報を付与
- 色塗る君 ver2: Scriptable内のHTML/CSS/JS本体を抽出。ブラウザのダウンロード/JSONファイル選択で操作
- 骨組みくん: Scriptable内の骨格エディタを抽出。保存をダウンロード、読込をファイル選択へ変更（PNG+TXTの同時保存はZIP）
- 立ち絵ドット変換: 元のブラウザ変換エンジンを抽出し、複数ファイル選択・PNG/まとめZIP保存を追加
- PNG背景透過: 元の背景推定・透過エンジンを抽出。個別PNG/まとめZIPに対応
- JSくん: 元のシナリオ解析関数を再利用し、JSON/JS/ZIP保存
- リソースくん: 元の参照抽出・重複/欠番判定関数を再利用し、TXT/JSONレポート保存
- まとめてリネーム保存: ブラウザの権限制約に合わせ、ファイル名を変更したコピーをZIPで保存

## 注意
- **ブラウザからiCloud Driveの任意フォルダへの自動保存・同名上書きはできません。** 保存リンク/ZIPを使い、ファイルアプリで必要な場所に移動してください。
- iOSでは複数ファイルの自動ダウンロードが制限されることがあります。個別保存かZIPを推奨します。
- Safariとホーム画面PWAは保存領域が異なる場合があります。重要なプロジェクトはJSONなどに書き出してバックアップしてください。
- HEICなどの画像変換はSafariがその画像を表示できる場合に限ります。
- 純正Scriptable版とブラウザ版ではファイル選択・保存方法が異なります。
- このリポジトリは静的配信（ビルド・Node.js・Codespaces不要）で使用できます。

## 検証
コード配置とPWA構成を確認済み。実機のSafariで全機能を操作するE2Eテストは未実施です。各ツールで画像・セーブの読み書きを確認してください。

## 更新方法
Webファイルを変更するときは `sw.js` のCACHE名を新しいバージョンに変更し、Service Workerの旧キャッシュを更新してください。

## 2026-11 PWA整備
- 8本すべてのブラウザHTMLをオフライン用にキャッシュします。Scriptable原本の .js は未変更です。
- ツール画面に一覧への戻り導線を用意しました（元からあるページは重複させません）。
- 各ページからPWAを登録でき、iOSのホーム画面起動に対応します。
- 静的構成チェックをGitHub Actions（`PWA static checks`）で自動実行します。ローカルなら `node scripts/check-pwa.mjs` です。
- GitHub Pagesが無効な場合は上記のSettings → Pagesで有効化してください。実機でのファイル書き出し・読み込み検証は別途必要です。
