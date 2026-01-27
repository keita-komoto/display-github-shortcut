# GitHub Shortcut Badges

GitHub上の特定要素にショートカットバッジを表示します。OptionsでOS表記や代替ショートカット表示、バッジサイズを切り替えられ、ポップアップまたはグローバルホットキー（mac: ⌘+^+B / win・linux: Ctrl+Alt+B）で機能の ON/OFF をトグルできます。

## ビルドと読み込み

1. `pnpm install`
2. `./ci.sh`
3. Chromeの拡張機能ページで「デベロッパーモード」を有効化し、「パッケージ化されていない拡張機能を読み込む」で `apps/github-shortcut-badges/dist/` を選択

## トラブルシュート

- バッジが表示されない場合は、以下を確認してください
  - ポップアップのトグルがON（チェック付き）であることと
  - `dist/`を最新ビルドに更新していること
  - chrome://extensions/ で拡張機能が有効化されていること
  - chrome://extensions/ で更新ボタンを押していること（デベロッパーモード有効時のみ）
  - GitHubのページをリロードしていること
