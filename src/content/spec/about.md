# About me

2019年からWebエンジニアとして活動しています。R&Dエンジニアとしてキャリアをスタートし、バックエンドエンジニアを経て最近はSREやプラットフォームエンジニアに軸足を置いて活動しています。エラーレート改善やO11yの徹底をはじめとしたSRE的業務や、技術基盤の刷新・整備などといったプラットフォームエンジニアリング分野に強みがあります。GoやRustといった静的型付け言語でのバックエンド開発も得意です。

OSSにも注力しており、Rustをメインとして様々なOSSのmaintainerとして活動しています。
特にRustでは2026年11月現在で最も活動している日本人の一人です（GitHub上でのcontributionsを集計した[Thanks](https://thanks.rust-lang.org/rust/all-time/)による、全体42位）。

真面目な技術記事は[Zenn](https://zenn.dev/fraternite)に置いています。

## 経歴

| 期間              | 企業             | ポジション                 | ロール     |
| ----------------- | ---------------- | -------------------------- | ---------- |
| 2025-05 / Current | MOSH             | Staff Software Engineer    | Member     |
| 2022-05 / 2025-04 | Canary           | Backend, Platform Engineer | Member, TL |
| 2021-05 / 2022-04 | Huawei           | OSS Engineer               | Contractor |
| 2019-04 / 2019-10 | Vega Corporation | R&D Engineer               | Member     |

## 登壇

- [なぜRustのエラーメッセージはわかりやすいのか？ by Yuki Okushi | トーク | BuriKaigi 2026 #burikaigi - fortee.jp](https://fortee.jp/burikaigi-2026/proposal/28681e2d-63e9-4c90-aadb-5063491a586e)
- [セッション: How Rust triages regressions and prevents them from reaching to stable by Yuki Okushi | Rust.Tokyo 2021](https://rust.tokyo/2021/lineup/1)

## 詳細

### Work

#### MOSH

スタッフソフトウェアエンジニアとして、主にplatform engineeringに携わっています。

e.g.:

- AWS LambdaからECSへの無停止移行
- Sentryでのo11y整備とイネーブリング
- remote MCP serverの実装と運用
  - rate limit機能の実装
  - 社内ドメインを考慮したOAuthの独自実装
- ユニット内採用活動のリード
- テックブログやポッドキャスト、社外登壇によるアウトリーチ活動

#### Canary

バックエンドエンジニアとして入社し、プラットフォームチームの一人目エンジニアとして活動しました。

e.g.:

- API負荷試験とパフォーマンスチューニング
- tfactionの導入などIaC推進
- マイクロサービスのローカル起動環境整備
- 割れ窓にならないアラート運用の制定

### OSS

#### Rust

[Compiler team](https://github.com/rust-lang/team/blob/main/teams/compiler.toml)と[Diagnostics WG](https://github.com/rust-lang/team/blob/main/teams/wg-diagnostics.toml)のメンバーとして、rustcのエラーメッセージや修正候補の改善、コンパイラの不具合修正などに取り組んでいます。
IssueのトリアージやPRレビューにも参加しています。

また、[Library team](https://github.com/rust-lang/team/blob/main/teams/libs.toml)として、標準ライブラリまわりのレビュワーもやっています。

[lang-docs team](https://github.com/rust-lang/team/blob/main/teams/lang-docs.toml)では、主にRustonomiconをメンテナンスしています。

Example work:

- [#147974: 借用した参照を保持するバッファの再利用に関する診断改善](https://github.com/rust-lang/rust/pull/147974)。
  参照を保持しているコレクションと参照先の寿命の関係を示し、借用エラーの原因を把握しやすくしました。
- [#152165: クロージャがキャプチャする値の型を正規化し、コンパイラのクラッシュを修正](https://github.com/rust-lang/rust/pull/152165)。
  トレイトソルバーとクロージャのキャプチャ解析にまたがる不具合を修正し、再発を防ぐテストを追加しました。

#### libc

RustからOSのシステムライブラリやCの関数を呼び出すための[libc](https://github.com/rust-lang/libc)のメンテナを務めています。
OSごとの型や関数の定義、互換性を確認するテスト、PRレビュー、CIの保守、安定版へのバックポートとリリースを担当しています。

[Rust標準ライブラリ](https://github.com/rust-lang/rust/blob/main/library/std/Cargo.toml)や[Tokio](https://github.com/tokio-rs/tokio/blob/master/tokio/Cargo.toml)も依存する基盤です。
crates.ioでの累計ダウンロード数は[約19.8億回](https://crates.io/crates/libc)、依存クレート数は[18,863件](https://crates.io/crates/libc/reverse_dependencies)です。

#### その他メンテナをやっているOSS

- [actix-web](https://github.com/actix/actix-web)
  - RustのWebフレームワーク
  - crates.ioでの累計ダウンロード数は[約9,080万回](https://crates.io/crates/actix-web)、依存クレート数は[1,770件](https://crates.io/crates/actix-web/reverse_dependencies)
- [notify](https://github.com/notify-rs/notify)
  - 複数のOSに対応したファイルシステム監視ライブラリ
  - [rust-analyzer、Deno、Zed、mdBookなどで採用](https://github.com/notify-rs/notify#readme)
  - crates.ioでの累計ダウンロード数は[約1.98億回](https://crates.io/crates/notify)、依存クレート数は[3,345件](https://crates.io/crates/notify/reverse_dependencies)
- [rust-phf](https://github.com/rust-phf/rust-phf)
  - コンパイル時に完全ハッシュ関数を使った静的な検索テーブルを生成するライブラリ
  - [chrono-tz](https://github.com/chronotope/chrono-tz/blob/main/chrono-tz/Cargo.toml)や[tokio-postgres](https://github.com/rust-postgres/rust-postgres/blob/master/tokio-postgres/Cargo.toml)などで採用
  - `phf`クレートのcrates.ioでの累計ダウンロード数は[約7.20億回](https://crates.io/crates/phf)、依存クレート数は[1,233件](https://crates.io/crates/phf/reverse_dependencies)
- etc...
