---
published: 2026-11-22
title: "notify v9をリリースしました"
tags: [rust, notify, oss, japanese]
description: "notify (notify-rs)のv9リリースアナウンスメント"
category: "release"
image: ""
draft: false
lang: "ja"
---

Rust のファイルシステム監視ライブラリである notify (notify-rs) の v9 をリリースしました。
v9 初めての pre-release が今年の1月なので苦節10ヶ月。

## notify is 何？

雑に言うとファイルの変更などを検知して通知する crate です。
inotify や FSEvents などは聞き馴染みもあるかと思いますが、その辺りをラップして OS をあまり気にせず使えるようにしたもの、というイメージです。

最近は Rust 製のソフトウェアも増えてきたこともあり、実は色々使われています。
fork で使われているものも含めると、Zed や Codex CLI、Rolldown(Vite) や rust-analyzer など、結構幅広く使われています。嬉しいですね。

## ここがすごいぞ v9

以下で今回のリリースの目玉を紹介していきます。

今回特に手を入れたのはパフォーマンス改善で、その他破壊的変更を伴うバグ修正なども含めています。
パフォーマンス改善についてベンチマークの結果も紹介していますが、v9 の開発中に各 PR で変更の適用前後を比べたローカル計測なので参考程度に見てください（それでも体感できるほどの改善はできたはずだと自負しています）。

詳細な変更点は[マイグレーションガイド](https://github.com/notify-rs/notify/blob/main/docs/UPGRADING_V8_TO_V9.md)を参照してください。

### Windows: 複数ファイルを個別に監視する際のパフォーマンス改善

Windows でファイルを1個監視するとき、notify はその親ディレクトリに変更通知を要求します。
v8 では例えば `assets/a.png` と `assets/b.png` を個別に登録すると、同じ `assets` を 2 回開きそれぞれにハンドルと読み取り用のバッファを持っていました。
v9 では同じ watcher に登録したファイルが同じ親ディレクトリを持っていれば OS 側の監視も共有するよう改善しています。

Windows での計測結果:

| 1,000 ファイルの合計                   |   変更前 |   変更後 |
| -------------------------------------- | -------: | -------: |
| 登録時間                               |  42.8 ms |  24.3 ms |
| 解除時間                               |  20.8 ms |   9.9 ms |
| 追加ハンドル数                         |    2,000 |        2 |
| プロセス専用のコミット済みメモリの増分 | 17.4 MiB | 0.96 MiB |

ハンドルを都度持っていた部分のオーバーヘッドがなくなっているのがここでの嬉しみです。
例えばエディタなどではこのケースに当てはまるので効果が大きいと考えています。

### inotify, kqueue: 大きなディレクトリツリーの登録と解除

Linux の inotify でディレクトリを再帰監視する場合、notify がツリーを辿って各ディレクトリをカーネルに登録します。
その途中でファイルの種別を問い合わせ直したり、イベントに載せるパスを計算し直したりしていたので、どちらも走査中に得た値を使うようにしました。
例として、1万ディレクトリに再帰監視を設定する時間は約 173～230 ms から約 55～59 ms に短縮されました。

また、kqueue でもファイルやディレクトリを一つ登録するたびに既存の監視をすべて見直すような処理をしていた箇所があり、これも似たような仕組みで改善を図っています。
一つのルートと配下の10万件について、このメタデータを組み立てる処理だけをリリースビルドで測ると、10.5 秒から 30 ms になりました。

監視の解除（notify で言うところの `unwatch`）でも、inotify と kqueue は対象パス以下の登録をインデックスから引けるようになりました。
たとえばプロジェクト全体を監視していて `cargo clean` で `target` が消えたとき、その後処理のために `src` 以下の監視を一つずつ調べないようになります。

### ストリームとパスの一括更新

複数の登録や解除をまとめる API は、v8 の `paths_mut()` と `commit()` から、全バックエンド共通の `Watcher::update_paths` に変わりました。
v8 のときにサクッと追加したのですが API デザインがベストではなく内部実装も見直しつつ整理した形です。

例えば以下のように利用できます:

```rust
use notify::{PathOp, UpdatePathsError, Watcher};

fn watch_project(watcher: &mut impl Watcher) -> Result<(), UpdatePathsError> {
    watcher.update_paths(vec![
        PathOp::watch_recursive("src"),
        PathOp::watch_recursive("assets"),
        PathOp::watch_non_recursive("Cargo.toml"),
    ])
}
```

操作は書いた順に適用されます。
この例で `assets` の登録に失敗すると、`src` は登録済みで、`Cargo.toml` の登録は未実行のままになります。
返ってくる `UpdatePathsError` の `origin` には失敗した `assets` の操作、`remaining` には未実行の `Cargo.toml` の操作が入るので、どこから再開するかを判断できます。

内部実装的な改善で言うと、独立したルートをいくつ追加してもバックエンド（inotify や FSEvents など）への変更を `update_paths` の呼び出しの中で一回にまとめるようにしています。
FSEvents だとストリームを作り直すのはバッチ全体で最大 1 回、inotify でも監視スレッドへのリクエストが 1 回で済むようにしています。

### Linux/Windows: 登録したパスとイベントの対応

v8 の Linux や Windows では、`src` を相対パスで登録しても絶対パスのイベントが届くことがありました。
v9 では登録時の表記に従うよう修正しています。
たとえば Linux なら、`src` を監視すれば `Event.paths` に `src/lib.rs` が、`/repo/src` を監視すれば `/repo/src/lib.rs` が入ります。
絶対パスをキーにしているキャッシュがあれば、`watch` に渡す時点で `std::env::current_dir()?.join("src")` のように絶対パスを作ってください。

また、イベントの取り回しにもちょっと改善を入れています。
複数のプロジェクトを一つの watcher で監視する場合、`watch_with` で登録時に `WatchPathConfig::with_user_data` を使って、プロジェクトの ID（`u64`）を持たせることができるようになりました。
その監視に対応するイベントやエラーからは、`Event::user_data()` と `Error::user_data()` で ID を取り出せます。
これを使って届いたイベントがどのプロジェクトのものかを簡単に区別できる、という寸法です。

### 保存時のイベントと debouncer 0.8

notify と一緒に、短時間に続いたイベントをまとめる `notify-debouncer-mini` と `notify-debouncer-full` の 0.8.0 もリリースしました。
ここでの目玉は以下の3つです。

full では Blender のバックアップ保存で見つかった通知順の問題を直しました。
Blender は元の `scene.blend` を `scene.blend1` にリネームしてから、新しいファイルを `scene.blend` に置きます。
以前は最後に旧ファイルのリネームが届くことがあり、イベントを順に適用した Bevy は新しい `scene.blend` まで消えたと判断していました。
0.8 ではリネームを先に、そのパスを再利用する新規作成を後に通知するよう修正しています。

full がリネームの対応付けに使うファイル ID のキャッシュ（`FileIdMap`）では、パスから ID を引くハッシュ表と、削除時に子ファイルなどを探すためのインデックスを分けました。
絶対パスで10万回 ID を引くのにかかった時間は 57.13 ms から 4.94 ms になりました。でかいね。

mini のハンドラーでは、通常の変更は `DebouncedEventBatch::Events`、OS が通知を取りこぼした可能性があるときは `DebouncedEventBatch::Rescan` で受け取ります。
後者はデバウンスの待ち時間を挟まずに届くので、ファイル一覧などをキャッシュしている場合は、そこで監視中のルートをすべて読み直してください。

## まとめ

1 月の最初の RC から、実際のプロジェクトで試して issue や PR を用意してくださった皆さん、ありがとうございました！
おかげでだいぶ仕上がったリリースになりました。

v9 に上げて気になる挙動があればぜひ [notify の issue tracker](https://github.com/notify-rs/notify/issues) までご報告お願いします。

最後に、notify は現状自分一人でメンテナンスしています。
repository への star や、Open Collective/GitHub Sponsors を通じて応援していただけると励みになります！🙏

- [repository](https://github.com/notify-rs/notify)
- [Open Collective](https://opencollective.com/notify-rs)
- [GitHub Sponsors](https://github.com/sponsors/JohnTitor)
