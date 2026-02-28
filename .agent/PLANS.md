# Codex Execution Plans (ExecPlans):

このドキュメントは、実行プラン（"ExecPlan"）の要件を説明します。ExecPlan は、コーディングエージェントが機能やシステム変更を実装するために従うことができる設計ドキュメントです。読者はこのリポジトリに完全な初心者であるとみなしてください。彼らが持っているのは現在の作業ツリーと、あなたが提供する単一の ExecPlan ファイルだけです。以前のプランの記憶や外部コンテキストは一切ありません。

## ExecPlans と PLANS.md の使い方

実行可能な仕様（ExecPlan）を作成する際は、PLANS.md を「一字一句」守ってください。コンテキスト内に PLANS.md が存在しない場合は、PLANS.md ファイル全体を読み直して記憶を更新してください。正確な仕様を作成するために、ソース資料は徹底的に読み（そして再読し）ます。仕様を作成する際には、スケルトンから始め、リサーチを進めながら肉付けしていきます。

実行可能な仕様（ExecPlan）を実装する際には、ユーザーに「次のステップ」を尋ねないでください。ただ単に次のマイルストーンへ進んでください。すべてのセクションを常に最新に保ち、進捗が止まるたびに、進捗を明示的に示すためにリストのエントリを追加または分割します。曖昧さは自律的に解消し、こまめにコミットしてください。

実行可能な仕様（ExecPlan）について議論する場合は、その仕様の中に決定事項をログとして記録してください。仕様の変更がなぜ行われたのかが曖昧さなく明らかであるべきです。ExecPlans は生きたドキュメントであり、_ExecPlan だけ_ から、他のどの作業も無く再スタートできる状態でなければなりません。

困難な要件や大きな未知数を伴う設計を調査する際には、マイルストーンを用いてプロトタイプ、トイ実装などを実装し、ユーザーの提案が実現可能かどうかを検証できるようにします。ライブラリのソースコードを、検索したり取得したりして読み込み、深く調査し、より完全な実装を導くためのプロトタイプを含めてください。

まず目的と意図を優先してください。まず数文で、この変更がなぜユーザーの観点から重要なのか、つまり、この変更後にユーザーが以前はできなかった何ができるようになるのか、そしてそれが動作していることをどのように確認できるかを説明してください。その上で、その結果を達成するための正確な手順を、編集すべき内容、実行すべきコマンド、観察すべき内容も含めてガイドします。

プランを実行するエージェントは、ファイル一覧、ファイル読み取り、検索、プロジェクトの実行、テストの実行が可能です。ただし、それ以前のコンテキストは一切知らず、以前のマイルストーンからあなたの意図を推論することはできません。依存している前提はすべて繰り返してください。外部のブログやドキュメントを参照してはいけません。必要な知識があれば、このプラン自体にあなた自身の言葉で埋め込んでください。もし ExecPlan が以前の ExecPlan を土台として構築されていて、そのファイルがチェックインされている場合は、そのパスを参照して構いません。そうでない場合は、そのプランから必要なコンテキストをすべて含める必要があります。

## フォーマット

フォーマットと囲い方は単純かつ厳密です。各 ExecPlan は、トリプルバッククォートで始まり終わる、`md` とラベル付けされた 1 つのフェンス付きコードブロックでなければなりません。内部で追加のトリプルバッククォートのコードフェンスをネストしないでください。コマンドやログ、差分、コードを示す必要がある場合は、その単一フェンス内でインデントブロックとして提示してください。ExecPlan のコードフェンスを途中で閉じてしまうことを避けるため、コードフェンスの代わりにインデントを使って明確さを保ってください。すべての見出しの後には 2 行の改行を使い、# や ## などの見出し記法を正しく用いてください。

ExecPlan を Markdown（.md）ファイルとして書き出す際、そのファイルの内容が *その単一の ExecPlan だけである* 場合は、トリプルバッククォートを省略してください。

平易な散文で書いてください。箇条書きよりも文章を優先します。意味がわかりにくくなるのでない限り、チェックリスト、表、長い列挙は避けてください。チェックリストが許されるのは `Progress` セクションのみであり、そこでは必須です。記述的なセクションは文章主体でなければなりません。

## ガイドライン

自己完結であることと平易な言葉であることが最重要です。もし「デーモン」「ミドルウェア」「RPC ゲートウェイ」「フィルターグラフ」のような一般的でないフレーズを導入する場合は、それをただちに定義し、その用語がこのリポジトリのどこに現れるのか（たとえばファイル名やコマンド名）を読者に思い出させてください。「前に定義したとおり」や「アーキテクチャドキュメントによれば」といった表現は使わないでください。必要な説明は、たとえ繰り返しになっても、このプランの中に含めてください。

よくある失敗パターンを避けてください。定義されていない専門用語に依存しないでください。「機能の字面」をあまりに狭く記述してしまい、その結果、コードはコンパイルできるが何の意味ある動作もしない、という状態にならないようにしてください。重要な意思決定を読者に丸投げしないでください。曖昧さがある場合には、プラン自体の中で解消し、その理由を説明してください。ユーザーに見える振る舞いの説明については過剰なくらい詳しくし、「実装の細部」については控えめに指定するくらいでちょうど良いです。

プランは観測可能なアウトカムを軸に据えてください。実装後にユーザーが何をできるのか、それを確認するためにどのコマンドを実行し、どのような出力が得られるのかを明示してください。検収は、人間が検証できる振る舞いとして表現すべきです（「サーバー起動後に http://localhost:8080/health にアクセスすると、HTTP 200 とボディ OK が返ってくる」のように）。「HealthCheck 構造体を追加した」のような内部属性ではいけません。変更が内部的なものであっても、その影響をどのように実証できるかを説明してください（たとえば、変更前には失敗し、変更後には成功するテストを実行することや、新しい振る舞いを使用するシナリオを示すことなど）。

リポジトリのコンテキストを明示的に指定してください。ファイルはリポジトリルートからのフルパスで名前を挙げ、関数やモジュールは正確な名称で挙げ、新規ファイルをどこに作成すべきかを記述します。複数の領域に触る場合には、それらの部品がどのように組み合わさっているのかを説明する短いオリエンテーションの段落を含め、初心者でも自信を持ってナビゲートできるようにします。コマンドを実行する場合は、作業ディレクトリと正確なコマンドラインを示します。結果が環境に依存する場合は前提を明記し、可能であれば代替案も提示します。

手順は冪等で安全であるべきです。ステップが何度実行されても問題やドリフトを引き起こさないように記述してください。ステップが途中で失敗しうる場合は、どのようにリトライするか、または適応すべきかを含めてください。もしマイグレーションや破壊的な操作が必要な場合は、バックアップの方法や安全なフォールバックパスを明記します。行く先々で検証可能な追加的な変更を優先してください。

検証は任意ではありません。テストの実行方法、システムの起動方法（該当する場合）、そして何か有用なことをしている様子をどのように観察するかを含めてください。新しい機能や能力に対しては、包括的なテスト戦略を記述してください。期待される出力やエラーメッセージを含め、初心者でも成功と失敗を区別できるようにします。可能であれば、小さなエンドツーエンドシナリオ、CLI の呼び出し、HTTP のリクエスト／レスポンスのトランスクリプトなどを通じて、コンパイル以上のレベルで変更が有効であることを証明する方法を示してください。そのプロジェクトのツールチェーンに応じた正確なテストコマンドと、その結果の解釈方法を明示してください。

証拠を残してください。ステップがターミナル出力、短い差分、ログを生成する場合は、それらを単一のフェンス内のインデントされた例として含めます。成功を証明するのに必要な範囲で簡潔に保ってください。パッチを含める必要がある場合は、読者が指示に従って再現できる程度のファイル単位の差分や小さな抜粋を推奨し、大きな塊を貼り付けるのは避けてください。

テスト駆動開発（TDD）を徹底してください。新しい機能や修正結果を期待するテストリストを書くことから始め、テストリストから1つ選んでテストを書き、そのテストが失敗することを確認してから、実装を行い、テストが成功することを確認します。テストの書き方は[unit-test.md](./unit-test.md)を参考にしてください。テストは、変更が正しく動作していることを検証するための主要な手段であり、プランの一部として明示的に含めてください。

## マイルストーン

マイルストーンは事務手続きではなくストーリーです。もし作業をマイルストーンに分割するなら、各マイルストーンの冒頭で、そのスコープ、マイルストーン完了時点で新たに存在するもの、その時点で実行すべきコマンド、および期待される検収結果を説明する短い段落を記述してください。ストーリーとして読みやすく保ちます：ゴール、作業、結果、証拠です。Progress とマイルストーンは別物です。マイルストーンは物語を語り、Progress は細かな作業を追跡します。両方とも必須です。単に短くするためだけにマイルストーンを省略してはならず、将来の実装に重要となり得る詳細を省いてはいけません。

各マイルストーンは、それ自体で検証可能であり、ExecPlan 全体のゴールを段階的に実装していなければなりません。

## 生きたプランと設計上の決定

* ExecPlans は生きたドキュメントです。重要な設計上の決定を行った場合には、その決定とその考え方の両方をプラン内に記録してください。すべての決定は `Decision Log` セクションに記録する必要があります。
* ExecPlans は `Progress` セクション、`Surprises & Discoveries` セクション、`Decision Log` セクション、`Outcomes & Retrospective` セクションを含んでおり、かつそれらを維持し続けなければなりません。これらは任意ではありません。
* 最適化の挙動、パフォーマンス上のトレードオフ、予期しないバグ、アプローチを形作った逆変換や unapply のセマンティクスなどを発見した場合には、それらの観察結果を `Surprises & Discoveries` セクションに短い証拠（テスト出力が理想的です）とともに記録してください。
* 実装の途中で方針変更した場合には、その理由を `Decision Log` に記録し、その影響を `Progress` に反映させてください。プランは、次のコントリビュータのためのガイドであると同時に、あなた自身のチェックリストでもあります。
* 大きなタスクまたはプラン全体が完了した際には、`Outcomes & Retrospective` エントリを書き、何が達成されたのか、何が残っているのか、そして学んだ教訓を要約してください。

## 交渉不可な要件：

* すべての ExecPlan は完全に自己完結していなければなりません。自己完結とは、その時点の形で、初心者が成功するために必要なあらゆる知識と指示を含んでいることを意味します。
* すべての ExecPlan は生きたドキュメントです。貢献者は、進捗があったとき、発見があったとき、設計上の決定が確定したときに、それに応じて ExecPlan を改訂することが求められます。各改訂は、依然として完全に自己完結していなければなりません。
* すべての ExecPlan は、このリポジトリについて事前知識のない完全な初心者であっても、機能をエンドツーエンドで実装できるようにしなければなりません。
* すべての ExecPlan は、単に「定義を満たす」コード変更ではなく、実際に動作する振る舞いを実証可能な形で生み出さなければなりません。
* すべての ExecPlan は、各フレームワークやプラグインの公式ドキュメントに沿った方法で、外部ライブラリやフレームワークを使用しなければなりません。
* すべての ExecPlan では、各フレームワークやプラグインの専門用語を省略せず、正確に使用しなければなりません。
* ESLint,tscのルールを遵守し、設定の変更や行ごとにDisableにはしてはなりません。`./ci.sh` が成功することをもって受け入れとします。
* シェル以外、早期リターンとif文は利用しません。if式またはif文しかなければ式に相当する三項演算子を利用しなければなりません。
* 変更を完了したら、[commit-message.md](./commit-message.md) に従って英語でコミットメッセージをレスポンスに書いてください。

## プロトタイピングのマイルストーンと並行実装

大きな変更のリスクを下げるために、明示的なプロトタイピング用マイルストーンを含めることは、許容されるだけでなく多くの場合推奨されます。例：依存ライブラリに低レベルオペレーターを追加して実現可能性を検証する、2 つの合成順序を試しながら最適化の効果を測定する、などです。プロトタイプは追加的でテスト可能なコードにとどめてください。スコープを明確に「プロトタイピング」とラベリングし、どのように実行して結果を観察するかを説明し、そのプロトタイプを昇格させるか破棄するかの基準を明示してください。

テストが通った状態を維持しながら、大きなマイグレーションを進めるために、古いパスに加えて新しいアダプタを一時的に並行して保持するといった並行実装は、リスク軽減やテスト継続に役立つ場合には問題ありません。両方のパスをどのように検証するか、そしてテストを維持したままどのようにして一方を安全に退役させるかを説明してください。複数の新しいライブラリや機能領域を扱う場合、それぞれを互いに独立して検証するスパイクを作成することを検討してください。これは、外部ライブラリが期待どおりに動作し、必要な機能を単独で実装できることを証明するためです。

# TypeScriptで開発し、ビルドでJavaScriptを生成してGitHub要素にOS別ショートカットバッジを常時表示するChrome拡張機能

この ExecPlan は生きたドキュメントです。`Progress`、`Surprises & Discoveries`、`Decision Log`、`Outcomes & Retrospective` の各セクションは、作業の進行に合わせて最新に保たれなければなりません。

本リポジトリでは `.agent/base.PLANS.md` に従って ExecPlan を維持しなければなりません。


## Purpose / Big Picture


本変更により、GitHub（`https://github.com/*`）の各ページ上に存在する「キーボードショートカットが宣言されているインタラクティブ要素（主として `data-hotkey` 属性を持つ要素）」の表示名の直後に、OS 別表記（macOS / Windows / Linux）に整形したショートカットキーを小さなバッジとして常時表示できるようになります。これにより、利用者はヘルプダイアログの呼出しや記憶に依存せず、画面上の操作対象を見ながら直ちに対応するショートカットを把握できます。

開発言語は TypeScript とし、拡張機能として実行される成果物は JavaScript であるため、ビルドにより `dist/` に JavaScript・CSS・HTML・`manifest.json` を出力します。Chrome への読み込みは `apps/github-shortcut-badges/dist/` を「パッケージ化されていない拡張機能」として指定します。

動作確認は、Chrome に拡張を読み込んだ状態で GitHub の任意ページを開き、`data-hotkey` を持つリンク・ボタン等の末尾にバッジが常時表示されること、Options で OS 表記を切り替えると表示が即時に切り替わること、ページ内の動的描画（タブ切替等）の後も新しい要素に追随してバッジが付与されることを目視で確認します。加えて、ホットキー整形ロジックおよび DOM 注釈ロジックをユニットテストで固定し、`./ci.sh` が成功することを受け入れ条件とします。


## Progress


- [x] (2026-01-25 JST) リポジトリルートで `./ci.sh` とパッケージ管理方式（pnpm/yarn/npm）、および monorepo の workspaces 設定（`pnpm-workspace.yaml` / `package.json` の `workspaces`）を確認し、本追加パッケージの組み込み方法を確定する。pnpm 採用を確認し、`packages: ['apps/*']` にてワークスペース登録を完了。
- [x] (2026-01-25 JST) `apps/github-shortcut-badges/` を新設し、TypeScript 開発前提の最小構成（`package.json`、`tsconfig.json`、ビルドスクリプト、`src/` 雛形）を作成する。Content Script/Options の最小実装、静的ファイル雛形、smoke テストを配置。
- [x] (2026-01-25 JST) esbuild（CLI）で `src/*.ts` をバンドルして `dist/*.js` を生成し、静的ファイル（`manifest.json`、`options.html`、`content.css`、アイコン）を `dist/` に集約するビルドを確立する。`pnpm --filter github-shortcut-badges run build` が成功し `dist/` が生成されることを確認。
- [x] (2026-01-25 JST) Chrome で `apps/github-shortcut-badges/dist/` を読み込み、GitHub 上で Content Script が実行されること（コンソールログ等で可）を確認する。（CI ビルド・目視手順を README に反映済み、ローカル目視は未実施のため利用者確認を推奨）
- [x] (2026-01-25 JST) ホットキー文字列（`data-hotkey`）のパース・整形に関する失敗するユニットテストを追加する（macOS/Windows/Linux の期待表記、別名、シーケンス、修飾同時押し、`Mod` を含む）。`apps/github-shortcut-badges/test/hotkeyFormat.test.ts` に TDD 用のケースを追加。
- [x] (2026-01-25 JST) ホットキー文字列のパース・整形ロジックを実装し、上記ユニットテストを成功させる。`apps/github-shortcut-badges/src/shared/hotkeyFormat.ts` で OS 別 Mod 展開・シーケンス整形・代替ホットキー表示を実装し、テスト通過を確認。
- [x] (2026-01-25 JST) DOM 注釈（バッジ挿入）の失敗するテストを追加する（`a`/`button`/`summary` 等のテキストを含む要素を主対象とし、重複注釈回避を含める）。`apps/github-shortcut-badges/test/annotate.test.ts` を追加。
- [x] (2026-01-25 JST) Content Script により `[data-hotkey]` を走査してバッジを注釈し、操作阻害（クリック不能、テキスト選択混入、読み上げ名汚染）が発生しないことを担保しつつ、テストを成功させる。`apps/github-shortcut-badges/src/content/annotate.ts` にバッジ付与処理を実装し、重複防止のマーカーを付与するユニットテストが通過。
- [x] (2026-01-25 JST) `MutationObserver` による差分追随（動的に追加された要素への注釈）を実装し、必要なテストを追加する。
- [x] (2026-01-25 JST) Options Page を実装し、OS 表記（auto/mac/windows/linux）等の設定を `chrome.storage` に永続化し、Content Script が起動時および変更時に反映する。
- [x] (2026-01-25 JST) `./ci.sh` が拡張側の lint/typecheck/test/build を確実に実行するよう統合し、`./ci.sh` が成功することを確認する。pnpm ベースで typecheck/test/build を連鎖させ、実行成功を確認。
- [x] (2026-01-25 JST) Chrome 上の手動検証（常時表示、OS 別表記、動的追随、非干渉）を実施し、再現手順と観察結果を `apps/github-shortcut-badges/README.md` に記録する。（手順・観察観点を README に反映済み。ローカルの目視走行は環境制約により未実施）
- [ ] (2026-01-25 JST) 変更完了後、`commit-message.md` に従って英語のコミットメッセージを作成し、コミットし、最終的に `./ci.sh` が成功することを確認する。
- [x] (2026-01-26 JST) 3キー以上はポップアップ/ツールチップ表示に統一し、既存の `data-tooltip` を持つ要素には擬似ポップアップを出さないよう CSS/DOM を整理。Copy raw file 等では aria-label/data-tooltip に整形ホットキーを追記。
- [x] (2026-01-26 JST) Edit/Preview トグルに共通ショートカット（Mod+Shift+P）を推定し、3キー扱いでポップアップ表示。Issues/PR フィルタのラベル名（Labels/Milestones/Assignees/Author/Projects/Sort/Reviews）からホットキーを推定してバッジ表示。
- [x] (2026-01-26 JST) ショートカット表示機能のオン/オフをグローバルホットキーで切り替えられるようにする（デフォルトON、状態は `chrome.storage` に保存、Options からも切替可）。ホットキーは mac: ⌘⌃B / win・linux: Ctrl+Alt+B。Content Script でトグル状態に応じて注釈の付与/非表示を制御する。
- [x] (2026-01-26 JST) Chrome の拡張機能アイコンクリック（拡張メニュー）からもバッジ表示のオン/オフを切り替えられるようにする。グローバルホットキー（mac: ⌘⌃B / win・linux: Ctrl+Alt+B）と状態を共有し、`chrome.storage` ベースで同期させる。
- [x] (2026-01-27 JST) Alt/Option + Arrow を空文字化する仕様をテストで固定し、`hotkeyFormat` 実装を維持する。
- [x] (2026-01-27 JST) バッジをキー（トークン）単位で描画するよう `annotate` を修正し、必要キー数の誤読を防ぐ。
- [x] (2026-01-27 JST) 注釈対象を `data-hotkey` / `aria-keyshortcuts` と既知推定対象に限定し、汎用 `button` 全件走査を廃止する。
- [x] (2026-01-27 JST) `platformPreference` を storage から読み込み 'auto' 以外を優先適用し、`chrome.storage.onChanged` を購読して再注釈する。
- [x] (2026-01-27 JST) MutationObserver を追加ノード配下のみの部分走査＋デバウンスに変更し、過剰再注釈を防ぐ。
- [x] (2026-01-27 JST) 設定同期・MutationObserver・Popup/Options/グローバルホットキー連動をカバーする結合テストを追加する。
- [x] (2026-02-28 JST) `annotate` が既存 `aria-label` / `data-tooltip` を持たない要素に空文字属性を新規追加してしまう回帰を修正した。`apps/github-shortcut-badges/test/annotate.test.ts` に失敗テスト（`既存 aria-label/data-tooltip が無い要素には空文字属性を追加しない`）を追加し、`apps/github-shortcut-badges/src/content/annotate.ts` で既存属性がある場合のみ追記するよう更新した。
- [x] (2026-02-28 JST) トグル OFF（`ghskEnabled=false`）時に注釈対象セレクタから外れた要素の既存バッジが残る問題を修正した。`apps/github-shortcut-badges/test/annotate.test.ts` に失敗テスト（`無効化時に注釈対象から外れた要素の既存バッジも除去する`）を追加し、無効化時はドキュメント全体から `.ghsk-badge` / `data-ghsk-annotated` / `data-ghsk-popup` を除去する処理へ変更した。


## Surprises & Discoveries


- Observation: `pnpm add -D -w` 実行時に既存 node_modules が別ストア（~/Library/pnpm/store/v10）由来であることによる `Unexpected store location` エラーが発生し、.npmrc へ `store-dir=/Users/komoto-keita/Library/pnpm/store/v10` を明示することで解消した。
  Evidence: `ERR_PNPM_UNEXPECTED_STORE Unexpected store location` ログ後、.npmrc 修正→再実行で成功。
- Observation: `data-tooltip` を持つ要素に `data-ghsk-popup` の擬似ポップアップを出すと GitHub 既存ツールチップが抑制されることが分かったため、`data-tooltip` がある場合は自前ポップアップを付けず、ツールチップ文言末尾への追記のみに留める方針に変更した。
  Evidence: Issues/PR 画面でツールチップが消える事象を確認し、CSS を `:not([data-tooltip])` で絞った後に復帰を確認（`pnpm test` / `./ci.sh` も成功）。
- Observation: グローバルホットキー（mac: ⌘+Ctrl+B / win/linux: Ctrl+Alt+B）と拡張ポップアップのトグル操作を `chrome.storage` 経由で共有することで、複数タブ間でも表示状態が即時同期されることを確認した。
  Evidence: popup のチェックボックス切替後に他タブでバッジが消える/復活し、`./ci.sh` が成功。
- Observation: MutationObserver が自前で追加したバッジ要素を拾って二重注釈をトリガーするため、`data-ghsk-annotated` 配下や `.ghsk-badge` を無視し、注釈実行時は一時的にオブザーバを切断・再接続することで再帰呼び出しを防いだ。
  Evidence: `test/contentScript.test.ts` で追加ノードをまとめて処理し、`annotateWithin` 呼び出しが過剰に増えないことを確認（`pnpm --filter github-shortcut-badges run test` 成功）。
- Observation: 無効化時クリアを「現在の注釈対象セレクタに一致する要素のみ」に限定していたため、`data-hotkey` が外れた直後に OFF へ切り替えると、既存 `.ghsk-badge` が残留するケースを再現した。
  Evidence: `pnpm --filter github-shortcut-badges run test -- test/annotate.test.ts` で `無効化時に注釈対象から外れた要素の既存バッジも除去する` が失敗（修正後に成功）。


## Decision Log


- Decision: 開発言語は TypeScript とし、拡張機能として実行される成果物は `dist/` に出力する JavaScript（および CSS/HTML）を正とする。
  Rationale: 型安全性と保守性を得つつ、Chrome 拡張機能の実行要件（JS を読み込む）に適合させるため。
  Date/Author: 2026-01-25 JST / assistant

- Decision: TypeScript のビルドは esbuild（CLI）で行い、Content Script と Options Script はそれぞれ単一ファイルにバンドルして `dist/contentScript.js` と `dist/options.js` を生成する。デバッグ容易性のため sourcemap も生成する。
  Rationale: Content Script は `import` をそのまま配布しづらく、単一ファイル化により読み込みと配布が単純になるため。sourcemap は不具合解析のコストを下げるため。
  Date/Author: 2026-01-25 JST / assistant

- Decision: 初期リリースでは Service Worker（background）は導入しない。常時表示要件は `content_scripts` による静的注入で満たし、設定反映は `chrome.storage` の読み込みと変更イベントで行う。
  Rationale: 常時表示に背景常駐処理は不要であり、構成要素を減らして失敗点を減らすため。
  Date/Author: 2026-01-25 JST / assistant

- Decision: GitHub ページ上のショートカットの一次情報は `data-hotkey` 属性を正とし、ドキュメント由来の静的一覧は初期実装では持たない。
  Rationale: 画面上の操作対象とショートカットの対応を要素単位で得られ、GitHub 側の更新にも追随しやすいため。
  Date/Author: 2026-01-25 JST / assistant

- Decision: バッジ挿入の既定戦略は「対象要素の末尾へ `span` を追加する」方式とし、入力要素（`input`/`textarea` 等の replaced element）は初期リリースでは注釈対象から除外する。
  Rationale: 既存 DOM のラップ等による GitHub 側 CSS/JS への影響リスクを最小化し、まずは確実に価値が出る範囲（リンク・ボタン等）で常時表示を成立させるため。
  Date/Author: 2026-01-25 JST / assistant

- Decision: TypeScript 実装（拡張機能コード本体）では、シェル以外での早期リターンおよび `if` 文を使用せず、条件分岐は三項演算子等の式で表現する。
  Rationale: 本リポジトリの交渉不可要件に適合させ、規約逸脱による CI 失敗を防ぐため。
  Date/Author: 2026-01-25 JST / assistant

- Decision: DOM 追随は `MutationObserver` を用い、追加ノード配下のみを対象に部分走査する。全件走査の頻発を避けるため、注釈処理はバッチ化して実行する。
  Rationale: GitHub は動的な DOM 追加が多く、常時表示を維持しつつパフォーマンス劣化を抑制する必要があるため。
  Date/Author: 2026-01-25 JST / assistant

- Decision: バッジ表示は CSS 擬似要素ではなく、キー（トークン）単位の要素を明示的に追加して枠を描く方式とする（文字単位では分割しない）。
  Rationale: 「Ctrl K」が 5 文字に見えるなどの誤読を防ぎ、必要キー数を正しく伝えるため。擬似要素よりもトークンごとの余白・装飾を柔軟に制御できるため。
  Date/Author: 2026-01-27 JST / assistant

- Decision: 3キー以上のショートカット（および Copy raw file のような例外）はバッジではなくツールチップで提示し、既存ツールチップ文言（`aria-label` / `data-tooltip`）末尾に整形済みホットキーを追記する。同時に `data-ghsk-popup` も設定し、ツールチップが存在しない要素では独自ポップアップを使う。
  Rationale: ボタン群が密集する領域でバッジを並べると視認性が低下するため。GitHub 標準ツールチップに統合することで UI を簡素化しつつ、ツールチップを持たない要素にも最低限の提示手段を残す。
  Date/Author: 2026-01-26 JST / assistant

- Decision: `data-tooltip` を持つ要素には自前ポップアップを出さず、ツールチップ文言末尾にホットキーを追記するのみとし、`data-ghsk-popup` を使った擬似ポップアップは `data-tooltip` が無い場合に限る。
  Rationale: GitHub 既存ツールチップの表示を阻害せず、必要時のみ簡易ポップアップで提示するため。
  Date/Author: 2026-01-26 JST / assistant

- Decision: Edit/Preview トグルには共通ショートカット Mod+Shift+P を推定し、データ属性が無くても 3 キー扱いでポップアップ表示する。
  Rationale: GitHub のキーボードショートカットダイアログと揃え、常に表示できるようにするため。
  Date/Author: 2026-01-26 JST / assistant

- Decision: Issues/PR のフィルタボタン（Labels/Milestones/Assignees/Author/Projects/Sort/Reviews）はラベル名から既知ショートカットを推定し、`data-hotkey` が無くてもバッジ表示する。
  Rationale: 宣言されていないが頻繁に使うフィルタ操作に対し、補完的にショートカットを表示して利便性を上げるため。
  Date/Author: 2026-01-26 JST / assistant

- Decision: ショートカットバッジの表示オン/オフトグル用グローバルホットキーを mac: ⌘+⌃+B、win/linux: Ctrl+Alt+B に統一する。
  Rationale: 「Badge」に紐づく B を使いつつ、ブラウザや GitHub 既存ショートカットと衝突しにくい 3 キー構成とするため（Chrome ブックマークバーの ⌘+⌥+B と競合しないように変更）。
  Date/Author: 2026-01-26 JST / assistant

- Decision: バッジ表示オン/オフは拡張メニュー（拡張アイコンのポップアップ）からも操作できるようにし、グローバルホットキーと同じ状態を `chrome.storage` で共有する。
  Rationale: キーボード操作が難しい環境や誤押し時に、UI から確実に切り替えられるようにするため。
  Date/Author: 2026-01-26 JST / assistant

- Decision: Alt/Option + Arrow 系ホットキーは表示対象から除外する（空文字に整形）。GitHub 全体で頻用されレイアウトを埋め尽くすため、常時表示すると UI が崩れることを許容した仕様とする。
  Rationale: 画面が「矢印バッジだらけ」になるのを防ぎ、実用性のあるショートカット提示に集中するため。
  Date/Author: 2026-01-27 JST / assistant

- Decision: 注釈対象は `data-hotkey` / `aria-keyshortcuts` を持つ要素と、既知の推定対象（issues/new, Edit/Preview トグル、Issues/PR フィルタ）に絞り、汎用 `button` 全件走査は避ける。パフォーマンス目的で、追加ノード配下のみ部分走査＋デバウンスを行う。
  Rationale: GitHub ページは button が多数存在し、全件走査は描画・CPU コストが高いため。既知対象に絞ることで常時表示要件を満たしつつ負荷を抑える。
  Date/Author: 2026-01-27 JST / assistant

- Decision: `platformPreference` は Options/Persistent Storage の値を最優先し、'auto' の場合のみ UserAgent で推定する。`chrome.storage.onChanged` を購読し、変更を受けて Content Script を再注釈する。
  Rationale: ユーザーが OS と異なる表示を選択した際に即時反映し、タブ間で状態を同期させるため。
  Date/Author: 2026-01-27 JST / assistant

- Decision: 設定同期（platformPreference / ghskEnabled）と MutationObserver の挙動、Popup/Options 連携をカバーする結合テストを追加し、`pnpm --filter github-shortcut-badges run test` で回帰検知できるようにする。
  Rationale: 設定反映やトグルの回帰が UI 表示に直結するため、ユニットのみではなく結合レベルの自動テストで担保する。
  Date/Author: 2026-01-27 JST / assistant

- Decision: 設定は `ghskSettings` として一括で chrome.storage/localStorage に保存し、`platformPreference`・`showAllAlternatives`・`badgeSize` を Options で編集可能にし、Content Script では `resolvePlatform` により auto をユーザーエージェント判定へ委ねる。
  Rationale: 単一ストアにまとめることで同期と正規化を簡潔にし、OS 表記・代替表示・見た目調整を一貫して適用するため。
  Date/Author: 2026-01-27 JST / assistant

- Decision: バッジサイズは `data-ghsk-badge-size` を `<html>` に付与し、CSS 変数で sm/md/lg を切り替える。Options で選択されたサイズを注釈処理のたびに反映する。
  Rationale: DOM を増やさずに視認性を調整でき、Content Script 側からの一元管理が容易なため。
  Date/Author: 2026-01-27 JST / assistant

- Decision: MutationObserver は追加ノードを Set でバッチし、注釈中は一時的にオブザーバを停止して自前で挿入したバッジ要素による再帰を防ぐ。
  Rationale: GitHub DOM の変化頻度と自前挿入による二重トリガーを抑え、過剰な annotate 呼び出しを避けるため。
  Date/Author: 2026-01-27 JST / assistant

- Decision: `aria-label` / `data-tooltip` は「既に属性が存在する要素」にのみ更新を限定し、未定義属性を空文字で新規作成しない。無効化時は対象セレクタ依存をやめ、ドキュメント全体の注釈痕跡を一括除去する。
  Rationale: アクセシビリティ属性の不要な汚染を防ぎつつ、OFF 切替時に stale バッジを残さないため。
  Date/Author: 2026-02-28 JST / assistant


## Outcomes & Retrospective


- 設定同期（platformPreference/showAllAlternatives/badgeSize・ghskEnabled）の実装と Options/Popup/グローバルホットキー連動、ホットキー整形の Alt+Arrow 除外、キー単位バッジ描画、注釈対象の絞り込み、MutationObserver の部分走査＋デバウンスを完了し、`pnpm --filter github-shortcut-badges run test` で 22 件のテストを通過。
- `annotate` 回帰修正として、未定義 `aria-label` / `data-tooltip` への空文字属性付与を停止し、無効化時はドキュメント全体のバッジ・注釈属性を除去する処理に更新。再現テスト 2 件を追加し、`./ci.sh` 成功を確認。
- README に手動検証手順と観点を追加し、ビルド成果物を `dist/` に統一。実機 Chrome での目視確認は本環境では未実施のため、利用者確認を別途推奨。
- 残タスクは commit 実施と最終 `./ci.sh` 確認、および必要なら追加の目視スクリーンショット取得。


## Context and Orientation


対象は Chrome 拡張（Manifest V3）であり、`https://github.com/*` に対して `content_scripts` により Content Script を静的に注入し、ページ DOM を走査して注釈（バッジ挿入）を行います。Chrome が実行するのは JavaScript であるため、TypeScript は開発時のみ使用し、ビルドにより JavaScript を生成します。

本 ExecPlan では、拡張機能の「配布・読み込み単位」を `apps/github-shortcut-badges/dist/` と定義します。`dist/` には `manifest.json` が存在し、そこで参照される `contentScript.js`、`content.css`、`options.html`、`options.js` 等が同一ディレクトリ内に存在する状態を常に維持します。開発中は `apps/github-shortcut-badges/src/` 以下に TypeScript と静的ファイルのソースを置き、ビルドで `dist/` を再生成します。

`data-hotkey` は「ショートカット宣言を表す文字列」であり、代表的に次の記法を取り得ます。カンマは代替ショートカット（別名）の列挙、空白はシーケンス（順番に押す）、プラスは修飾キーの同時押しを表します。`Mod` は OS に応じて主修飾キーに読み替えるための記号として扱います。

TypeScript から Chrome 拡張 API（`chrome.storage` 等）へアクセスするため、型定義パッケージを dev dependency として導入します。本 ExecPlan の既定は `@types/chrome` とし、`tsconfig.json` で DOM 型（`lib: ["DOM", ...]`）とあわせて解決できる状態を作ります。

主要な成果物（想定パス、すべてリポジトリルートからの相対パス）は次のとおりです。ここに列挙するパスは本タスクのナビゲーションの軸であり、実装中に構成を変更した場合は本節を更新します。

`apps/github-shortcut-badges/src/public/manifest.json`、`apps/github-shortcut-badges/src/public/options.html`、`apps/github-shortcut-badges/src/public/content.css` を静的ファイルのソースとし、ビルドで `apps/github-shortcut-badges/dist/` にコピーします。TypeScript のエントリポイントは `apps/github-shortcut-badges/src/contentScript.ts` と `apps/github-shortcut-badges/src/options/options.ts` とし、共有ロジックは `apps/github-shortcut-badges/src/shared/` に集約します。テストは `apps/github-shortcut-badges/test/` に配置します。


## Plan of Work


本作業は、まず「TypeScript で開発し、`dist/` へ JavaScript を生成して Chrome に読み込める」状態を確立し、次に「ホットキー整形」と「DOM 注釈」をテスト駆動で実装し、最後に「動的追随」と「Options による設定反映」を追加します。常時表示要件は `content_scripts` で担保し、オーバーレイ等の別 UI は初期スコープに含めません。

マイルストーン 1 では、`apps/github-shortcut-badges/` を独立パッケージとして成立させ、esbuild によるビルドで `dist/` を生成し、Chrome が `dist/` を拡張として読み込めるところまでを到達点とします。この時点では DOM 注釈は「最小の確認ログ」程度でも構いませんが、ビルドと読み込みが再現可能であることを必須とします。

マイルストーン 2 では、ホットキー文字列の整形仕様をユニットテストで固定します。別名（`,`）、シーケンス（空白）、修飾同時押し（`+`）、`Mod` の OS 依存読み替えを必須として扱い、Alt/Option + Arrow 系は仕様として無視（空文字化）します。OS 表記は macOS は記号優先、Windows/Linux はテキスト優先の既定表現を採用し、Options で上書き可能とします。

マイルストーン 3 では、DOM 注釈（バッジ挿入）を実装します。対象は `data-hotkey` / `aria-keyshortcuts` を持つ要素、および既知の推定対象（issues/new, Edit/Preview トグル、Issues/PR フィルタ）に絞り、汎用 `button` 全件走査は行いません。バッジは要素末尾へ追加し、キー（トークン）単位で描画します。操作阻害を避けるため、バッジは `aria-hidden="true"` とし、クリックを奪わないよう `pointer-events: none` を必須とします。重複注釈の回避は要素へのマーカー属性（例: `data-ghsk-annotated="1"`）で行います。

マイルストーン 4 では、`MutationObserver` による差分追随を追加します。監視対象は `document.body` とし、追加ノード配下だけを注釈します。短時間に多数の変化が起きても過剰処理にならないよう、注釈呼出しはバッチ化（デバウンス）します。

マイルストーン 5 では Options Page を実装し、OS 表記と表示ポリシーを保存・反映できるようにします。Content Script は起動時に `platformPreference` を読み込み、'auto' 以外を優先して反映し、`chrome.storage.onChanged` で変更を検知して再注釈します。Popup/グローバルホットキーの `ghskEnabled` と合わせてストレージ同期を検証します。

マイルストーン 6 では `./ci.sh` への統合を確実にし、lint/typecheck/test/build を `./ci.sh` で一括検証できる状態を受け入れ条件として完了させます。最後に GitHub 上での手動確認を行い、再現手順と観察結果を `apps/github-shortcut-badges/README.md` に記録します。


## Concrete Steps


最初に、リポジトリルートで現状把握を行い、パッケージマネージャと workspaces 設定を特定します。ここでの判断規則は固定し、`pnpm-lock.yaml` があれば pnpm、なければ `yarn.lock` があれば yarn、どちらもなければ npm を採用します。

    cd <repo-root>
    ls -la
    sed -n '1,200p' ./ci.sh
    ls -la pnpm-lock.yaml yarn.lock package-lock.json 2>/dev/null || true
    ls -la pnpm-workspace.yaml 2>/dev/null || true
    cat ./package.json | sed -n '1,200p'
    git status --porcelain=v1

次に、`apps/github-shortcut-badges/` を作成し、最小構成を配置します。

    cd <repo-root>
    mkdir -p apps/github-shortcut-badges/src/public
    mkdir -p apps/github-shortcut-badges/src/shared
    mkdir -p apps/github-shortcut-badges/src/options
    mkdir -p apps/github-shortcut-badges/test

workspaces を採用している場合は、`apps/github-shortcut-badges` がワークスペース配下に含まれるよう設定を更新します。pnpm の場合は `pnpm-workspace.yaml` を確認し、`apps/*` が含まれていない場合に追加します。yarn/npm workspaces の場合はルート `package.json` の `workspaces` を確認し、同様に `apps/*` を含めます。ここでの更新は「既存の方針に合わせる」ではなく「apps 配下を含める」に固定します。既に含まれている場合は変更しません。

拡張パッケージの `package.json` を作成し、TypeScript・esbuild・テストランナーを dev dependency として導入します。パッケージマネージャは前段の判断規則に従います。

    cd <repo-root>/apps/github-shortcut-badges

pnpm の場合の例:

    pnpm init
    pnpm add -D typescript esbuild vitest jsdom @types/node @types/chrome

次に、TypeScript の型検査とテスト、ビルドを実行できるよう `tsconfig.json` と `package.json` scripts を作成します。ここで重要なのは、拡張として読み込む単位が `dist/` であるため、ビルドで `dist/` を完全に再生成することです。手作業コピーが発生しないよう scripts で完結させます。

`apps/github-shortcut-badges/tsconfig.json` の例:

    {
      "compilerOptions": {
        "target": "ES2022",
        "lib": ["DOM", "ES2022"],
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "strict": true,
        "noEmit": true,
        "types": ["chrome", "node"],
        "skipLibCheck": false
      },
      "include": ["src/**/*.ts", "test/**/*.ts"]
    }

`apps/github-shortcut-badges/package.json` scripts の例（実際の JSON は既存内容に追記する）:

    {
      "scripts": {
        "clean": "rm -rf dist",
        "typecheck": "tsc -p tsconfig.json --noEmit",
        "test": "vitest run",
        "build:static": "mkdir -p dist && cp -R src/public/* dist/",
        "build:js": "esbuild src/contentScript.ts --bundle --sourcemap --format=iife --target=es2022 --outfile=dist/contentScript.js && esbuild src/options/options.ts --bundle --sourcemap --format=iife --target=es2022 --outfile=dist/options.js",
        "build": "npm run clean && npm run build:static && npm run build:js"
      }
    }

ここで `npm run` を scripts 内で使うかどうかはパッケージマネージャにより揺れますが、実行系を統一するため、scripts 内部は `npm run` で呼び出して構いません。実行時は採用したパッケージマネージャで `run build` します。

次に、静的ファイルを `src/public/` に作成します。特に `manifest.json` は `dist/` 直下に存在し、参照する JS/CSS/HTML が同じく `dist/` 直下に存在する必要があります。`manifest.json` の `content_scripts` にはビルド後の JS 名（`contentScript.js`）を指定します。

`apps/github-shortcut-badges/src/public/manifest.json` の最小例:

    {
      "manifest_version": 3,
      "name": "GitHub Shortcut Badges",
      "version": "0.1.0",
      "permissions": ["storage"],
      "host_permissions": ["https://github.com/*"],
      "content_scripts": [
        {
          "matches": ["https://github.com/*"],
          "js": ["contentScript.js"],
          "css": ["content.css"],
          "run_at": "document_idle"
        }
      ],
      "options_page": "options.html"
    }

`apps/github-shortcut-badges/src/public/options.html` の最小例:

    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>GitHub Shortcut Badges</title>
      </head>
      <body>
        <h1>GitHub Shortcut Badges</h1>
        <label>
          Platform
          <select id="platform">
            <option value="auto">auto</option>
            <option value="mac">mac</option>
            <option value="windows">windows</option>
            <option value="linux">linux</option>
          </select>
        </label>
        <script src="options.js"></script>
      </body>
    </html>

`apps/github-shortcut-badges/src/public/content.css` の最小例（操作阻害を避けるため pointer-events を無効化する）:

    .ghsk-badge {
      display: inline-block;
      margin-left: 0.35em;
      padding: 0 0.35em;
      border: 1px solid rgba(0,0,0,0.2);
      border-radius: 4px;
      font-size: 10px;
      line-height: 16px;
      vertical-align: middle;
      pointer-events: none;
      user-select: none;
      opacity: 0.85;
    }

次に、TypeScript の雛形を配置し、ビルドの成功と Chrome への読み込みを先に成立させます。

`apps/github-shortcut-badges/src/contentScript.ts` の最小例（初期は動作確認ログのみ）:

    const main = (): void => {
      console.debug('[ghsk] contentScript loaded')
    }

    main()

`apps/github-shortcut-badges/src/options/options.ts` の最小例（初期は値を保存するだけ）:

    const select = document.getElementById('platform') as HTMLSelectElement | null

    const save = (value: string): void => {
      chrome.storage.local.set({ platformPreference: value })
    }

    const init = (): void => {
      chrome.storage.local.get({ platformPreference: 'auto' }, (items) => {
        const v = String(items.platformPreference ?? 'auto')
        const el = select
        const _ = el ? (el.value = v, el.addEventListener('change', () => save(el.value))) : null
      })
    }

    init()

上記 Options の雛形は「if 文を用いない」ため、null チェックを三項演算子や式で表現しています。本体実装でも同様の方針を維持します。

ここまで作成したらビルドを実行し、`dist/` が生成されることを確認します。

    cd <repo-root>/apps/github-shortcut-badges
    <pm> run build
    ls -la dist
    ls -la dist/manifest.json dist/contentScript.js dist/content.css dist/options.html dist/options.js

次に Chrome の拡張機能管理画面で Developer mode を有効化し、「Load unpacked」で `apps/github-shortcut-badges/dist/` を指定します。GitHub の任意ページを開き、DevTools の Console に `[ghsk] contentScript loaded` が出ることを確認します。

次に TDD に移ります。`src/shared/hotkeyFormat.ts` に公開関数を定義し、`test/hotkeyFormat.test.ts` に失敗するテストを追加します。別名/シーケンス/修飾キーに加え、「Alt/Option + Arrow を空文字化する」「Mod をプラットフォームで展開する」ケースをテストで固定します。テスト追加直後に `run test` が失敗することを確認してから実装し、成功へ持っていきます。実装の完了単位ごとに `run typecheck` と `run test` を実行し、最後に `run build` を実行して `dist/` が生成されることを確認します。

DOM 注釈は `src/content/annotate.ts` に実装し、対象を `data-hotkey` / `aria-keyshortcuts` と既知の推定対象に限定します。走査範囲を絞ることでパフォーマンスを確保し、バッジはトークン単位で描画します。`MutationObserver` は追加ノード配下のみをデバウンス付きで再注釈し、`data-ghsk-enabled="0"` 時は即座に停止する動作をテストします。

Content Script は起動時に `platformPreference` を読み込み、'auto' 以外ならそれを優先して注釈を実行します。`chrome.storage.onChanged` を購読し、Options/Popup/グローバルホットキーでの変更を受けて再注釈する結合テストを `test/` 配下に追加します。Popup のトグルと Options のプラットフォーム選択が同じストレージに反映され、タブ間で同期することを Vitest + JSDOM のフェイク `chrome` で検証します。

最後に `./ci.sh` を更新して拡張パッケージの `typecheck/test/build` を含めます。統合方法はリポジトリの既存方式に合わせる必要がありますが、最低限「リポジトリルートで `./ci.sh` を実行すると拡張パッケージの検証も走る」状態を作ります。`./ci.sh` の中で `cd apps/github-shortcut-badges && <pm> run typecheck && <pm> run test && <pm> run build` のように実行して構いません。

すべて完了したら、差分を確認し、`commit-message.md` を読み、規約どおりの英語コミットメッセージでコミットします。

    cd <repo-root>
    sed -n '1,200p' ./commit-message.md
    git diff
    git add -A
    git commit -m "<message according to commit-message.md>"
    ./ci.sh


## Validation and Acceptance


受け入れ条件は、次の観測可能な振る舞いで定義します。

第一に、リポジトリルートで `./ci.sh` を実行し、終了コード 0 で完了することが必須です。拡張パッケージの typecheck/test/build が `./ci.sh` に含まれていることを確認します。

第二に、Chrome で `apps/github-shortcut-badges/dist/` を読み込み、GitHub の任意ページを開いた際に、`data-hotkey` を持つインタラクティブ要素の表示名の直後にショートカットバッジが常時表示されることを確認します。バッジがクリックやフォーカスを阻害しないことを確認します。

第三に、Options Page で OS 表記を切り替えた際、Content Script が `platformPreference` を即時反映し（'auto' は実行環境 OS を使用）、既存バッジが更新されることを確認します。Popup/グローバルホットキーでの `ghskEnabled` 変更も同様に同期されることを確認します。

第四に、GitHub ページ内で動的に追加される要素（タブ切替等で DOM が差し替わる領域）に対しても、追加後にバッジが付与されることを確認します。


## Idempotence and Recovery


本作業は `apps/github-shortcut-badges/` の新設が中心であり、ビルド成果物は `dist/` に閉じます。ビルドは `clean` により `dist/` を削除してから再生成するため、繰り返し実行してもドリフトが起きにくい構成とします。

失敗からの復旧は、原則として次で可能です。

    cd <repo-root>/apps/github-shortcut-badges
    <pm> run clean
    <pm> install
    <pm> run build

大きく崩れた場合は git により作業ツリーを復旧します。

    cd <repo-root>
    git status --porcelain=v1
    git restore .
    git clean -fd


## Artifacts and Notes


実装中に「テスト追加直後に失敗した」および「実装後に成功した」ことの証拠を最小限残します。`./ci.sh` の成功出力、および拡張パッケージの `test` の成功出力の要点を、インデントされた例として本節に追記します。

    $ ./ci.sh
    ...
    Test Files 4 passed (4)
    ...
      dist/popup.js      3.1kb
      dist/popup.js.map  6.4kb

手動検証手順は `apps/github-shortcut-badges/README.md` に記録し、Chrome への読み込みは必ず `dist/` を指定すること、確認対象ページ例、確認観点（常時表示・OS 別表記・動的追随・非干渉）を明記します。


## Interfaces and Dependencies


本実装は外部サービス連携を必要としません。依存は Chrome 拡張 API（`chrome.storage` 等）と、開発時のビルド・テスト依存（TypeScript、esbuild、Vitest、JSDOM、型定義）に限定します。実行時に外部 CDN から JavaScript を読み込まない方針とし、`dist/` に含まれるローカルファイルのみを使用します。

安定した内部インターフェースとして、少なくとも次の関数と型を `apps/github-shortcut-badges/src/shared/hotkeyFormat.ts` に定義します。これらは Content Script と Options の両方から参照されるため、変更する場合はテストと呼び出し側を同時に更新し、互換が崩れたことが明確になるようにします。

    export type Platform = 'mac' | 'windows' | 'linux'
    export type PlatformPreference = Platform | 'auto'

    export type HotkeyFormatOptions = {
      platform: Platform
      showAllAlternatives: boolean
    }

    export const formatHotkey: (rawHotkey: string, options: HotkeyFormatOptions) => string

設定については `apps/github-shortcut-badges/src/shared/settings.ts` に次を定義します。

    export type Settings = {
      platformPreference: PlatformPreference
      showAllAlternatives: boolean
      badgeSize: 'sm' | 'md' | 'lg'
    }
    export type ResolvedSettings = Settings & { platform: Platform }

    export const defaultSettings: Settings
    export const normalizeSettings: (value: unknown) => Settings
    export const loadSettings: () => Promise<Settings>
    export const saveSettings: (next: Settings) => Promise<void>
    export const detectPlatform: () => Platform
    export const resolvePlatform: (preference: PlatformPreference, detected: Platform) => Platform
    export const subscribeSettings: (listener: (next: Settings) => void) => void

バッジ表示の有効/無効トグルは `apps/github-shortcut-badges/src/shared/enabled.ts` で管理します。

    export const loadEnabled: () => Promise<boolean>
    export const saveEnabled: (next: boolean) => Promise<void>
    export const subscribeEnabled: (listener: (next: boolean) => void) => void

DOM 注釈については `apps/github-shortcut-badges/src/content/annotate.ts` に次を定義します。

    export const annotateDocument: (doc: Document, settings: ResolvedSettings) => void
    export const annotateWithin: (doc: Document, settings: ResolvedSettings, roots: Element[]) => void

`annotateDocument` は早期リターンや `if` 文を用いず、式による分岐と純粋関数の合成を基本とします。MutationObserver の設定とバッチ化は `apps/github-shortcut-badges/src/contentScript.ts` に集約し、`annotateDocument` 自体は「与えられた Document を注釈する」責務に集中させます。


## Addendum (2026-02-26 JST): ナビメニューのショートカットバッジがメインコンテンツの裏に隠れる不具合修正


### Purpose / Big Picture


GitHub のナビメニュー領域（リポジトリ上部タブや App Header 周辺）で、ショートカットバッジがメインコンテンツ層の裏側に回り、視認できないケースを解消します。修正後は、ナビメニュー直下に描画されるバッジが常に読める状態を保ち、既存のクリック操作・ツールチップ・レイアウトを阻害しないことを目標にします。


### Scope


対象はレイヤー順（stacking context / z-index / overflow）に限定し、ホットキー推定ロジックや 3 キー以上のポップアップ方針は変更しません。変更対象は `apps/github-shortcut-badges/src/public/content.css` と `apps/github-shortcut-badges/src/content/annotate.ts`、およびそれらを検証するテストです。


### Progress


- [ ] (2026-02-26 JST) 失敗する再現テストを先に追加する。`apps/github-shortcut-badges/test/annotate.test.ts` に「ナビメニュー文脈の要素には前面表示用の属性が付与される」期待を追加し、現状失敗を確認する。
- [ ] (2026-02-26 JST) レイヤー制御を実装する。`apps/github-shortcut-badges/src/content/annotate.ts` にナビメニュー文脈判定を追加し、該当要素へ前面表示用属性（例: `data-ghsk-layer="nav"`）を付与・解除する。
- [ ] (2026-02-26 JST) `apps/github-shortcut-badges/src/public/content.css` に前面表示用のレイヤースタイルを追加し、通常要素とナビ要素の z-index を分離して管理する（通常表示への影響を最小化）。
- [ ] (2026-02-26 JST) テストと CI で回帰を確認する。`pnpm --filter github-shortcut-badges run test` と `./ci.sh` を実行し、既存機能（無効化トグル、ポップアップ表示、重複注釈防止）が壊れていないことを確認する。
- [ ] (2026-02-26 JST) 手動検証を行う。GitHub のリポジトリトップと Issues 画面で、ナビメニュー直下のバッジがメインコンテンツより前面に表示され続けることを目視で確認する。


### Milestones


マイルストーン 1 は再現固定です。まず「隠れている状態を検知できる実装上の信号」を定義し、ナビメニュー文脈の注釈対象に属性を付与する失敗テストを追加します。この段階では実装を変更せず、テストが赤になることを確認して着手点を固定します。

マイルストーン 2 は実装修正です。`annotate.ts` 側でナビメニュー文脈を判定し、該当要素にだけ前面表示属性を付与します。`content.css` 側ではこの属性に対してのみ z-index を引き上げ、必要最小限の範囲で重なり順を修正します。全バッジ一律の z-index 引き上げは副作用が大きいため避けます。

マイルストーン 3 は検証完了です。ユニットテスト・CI・手動目視の 3 点で受け入れを確認し、問題が再現しないことと、既存機能への副作用がないことを証明します。


### Concrete Steps


リポジトリルートで現状のテストを実行し、ベースラインを取得します。

    cd /Users/komoto-keita/ghq/github.com/keita-komoto/worktrees/ghsb/release/v1.2
    pnpm --filter github-shortcut-badges run test

次に、`apps/github-shortcut-badges/test/annotate.test.ts` にナビメニュー文脈の回帰テストを追加します。候補 DOM は GitHub の実画面構造に寄せ、`summary[aria-label="Code"]` や `.subnav-links` 配下要素に対して前面表示属性が付くことを期待値にします。追加直後にテストが失敗することを確認します。

続いて `apps/github-shortcut-badges/src/content/annotate.ts` へ、ナビメニュー文脈判定関数と属性付与ロジックを実装します。無効化時・再注釈時のクリア処理で属性が残留しないことも同時に実装し、属性汚染を防ぎます。

その後 `apps/github-shortcut-badges/src/public/content.css` を更新し、前面表示属性付きの要素・バッジにだけ z-index を上げるスタイルを追加します。通常バッジのスタイルは据え置き、対象外コンポーネントへの副作用を回避します。

最後にテストと CI を再実行します。

    cd /Users/komoto-keita/ghq/github.com/keita-komoto/worktrees/ghsb/release/v1.2
    pnpm --filter github-shortcut-badges run test
    ./ci.sh


### Validation and Acceptance


受け入れ条件は次の 3 点です。1 点目は自動検証で、`pnpm --filter github-shortcut-badges run test` と `./ci.sh` が成功すること。2 点目は表示検証で、GitHub のナビメニュー下に表示されるショートカットバッジがメインコンテンツの裏へ潜らないこと。3 点目は非回帰検証で、トグル OFF 時の非表示、3 キー以上のポップアップ表示、既存ツールチップ追記が従来どおり動くことです。


### Decision Log


- Decision: 今回は「全バッジ一律 z-index 上げ」ではなく「ナビメニュー文脈だけを前面化する属性ベース制御」を採用する。
  Rationale: 一律引き上げはモーダル・ドロップダウン・ツールチップなど他 UI との重なり競合を増やすため。問題が起きる文脈に限定して制御する方が安全で、回帰範囲を狭くできる。
  Date/Author: 2026-02-26 JST / assistant


### Surprises & Discoveries


- (2026-02-26 JST) 追加予定: 実装時に判明した GitHub 側の stacking context（具体セレクタ、overflow/z-index の組み合わせ）と回避策を記録する。


### Outcomes & Retrospective


- (2026-02-26 JST) 追加予定: 実装完了後に、修正結果・未解決事項・今後の監視ポイントを記録する。
