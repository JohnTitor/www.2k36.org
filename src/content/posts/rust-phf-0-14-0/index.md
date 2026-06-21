---
published: 2026-06-21
title: "rust-phf v0.14.0をリリースしました"
tags: [rust, rust-phf, oss, japanese]
description: "rust-phf v0.14.0の主な変更点と移行時の注意点"
category: "release"
image: ""
draft: false
lang: "ja"
---

rust-phf v0.14.0をリリースしました。

リリースノートは[GitHub Releases](https://github.com/rust-phf/rust-phf/releases/tag/v0.14.0)にあります。

普段はこういうのをサイレントにやっているのですが、できれば多くの人に知ってほしいな～というところで実験的にアナウンスポストを書いてみています。

## rust-phf is 何？

rust-phfは、コンパイル時に完全ハッシュ関数(PHF)を使った lookup table を生成する crate 群です。

使えるのは、キー集合がビルド時点で決まっている table です。実行時に `HashMap` を組み立てる必要がなく、生成済みの静的データから lookup できるのでその分高速に引くことができます。

たとえば、言語処理系で `"while"` を `Token::While` に変換する、設定ファイルのキー名を何かしら利用したい形に変換する、みたいな用途に向いています。

一方で、キーを実行時に追加したり削除したりする用途には向きません。

採用例を挙げると、chronoやtokio-postgresなどで採用されています: https://crates.io/crates/phf/reverse_dependencies

以下で今回のリリースの概要を紹介していきます。ただ機能差分メインで書くので新しく使ってみたいという方は repository からドキュメントや examples を辿るのがいいかもしれません: https://github.com/rust-phf/rust-phf

## MSRVが1.85になりました

v0.14.0では各 crate を 2024 edition に移行しました。

そのため、MSRV は 1.85 になりました。

2024 edition が出たのはつい最近のように思いますが、気付けばもう 2026 年も半分過ぎようとしています。早すぎる。

こういうライブラリでは edition 更新やその他 MSRV に関する変更を比較的ゆっくりやるようにしています。

昔は厳密に breaking change として扱うところも多かったですが、今だと [time crate のように](https://github.com/time-rs/time#minimum-rust-version-policy) N-3 window のような相対的な MSRV policy を持つところも増えている気がします。

メンテナとしては確かにこちらの方が楽というか、MSRV を bump させるためだけに major version を上げるのは結構躊躇われる気持ちがあり、自分のメンテする crates でも最近はこのようなポリシーを適用することが多いです。phf は明示的なポリシーを定めていませんが、そろそろしようかしら。

## ptrhash feature

v0.14.0では、実験的な `ptrhash` feature を追加しました。

この feature は、既存の CHD 実装をいきなり置き換えるものではありません。既定のレイアウトはこれまで通り CHD で、`ptrhash` は明示的に有効化したときだけ使われます。

`phf_macros` を使う場合は、`phf` 側で `macros` と `ptrhash` を有効にします。

```toml
[dependencies]
phf = { version = "0.14.0", features = ["macros", "ptrhash"] }
```

`phf_codegen` を使う場合は、生成側と実行時側の両方で `ptrhash` を有効にします。

```toml
[dependencies]
phf = { version = "0.14.0", features = ["ptrhash"] }

[build-dependencies]
phf_codegen = { version = "0.14.0", features = ["ptrhash"] }
```

この feature を入れたモチベとしてはパフォーマンスの改善があります。

実際、[PR](https://github.com/rust-phf/rust-phf/pull/392)のベンチマークでは、生成時間と lookup の両方でよい結果が出ています。やったね。

ただし、データの形や利用箇所によって結果は変わるので、実運用で使う場合はご自身の環境で実際に測ってから採用してください。ほとんどの場合、デフォルトよりもパフォーマンスが改善するかと思いますが念のため。

何かしら既存と動作が変わったりだとか、不具合を見つけたら教えてください。

## cfg付きエントリの扱い

`phf_map!` などのマクロで `#[cfg]` を使っている場合、v0.14.0ではいくつかの挙動が変わります。

### `#[cfg]` が無効になっている際のバグ修正

まず、すべての `#[cfg]` が無効になったときに、空の map や set ではなく別の variant 由来のデータが残ることがありました。

これは PR [#393](https://github.com/rust-phf/rust-phf/pull/393)で修正されています。

### OR パターンの挙動の統一

次に、OR パターンに付いた `#[cfg]` は、そのエントリ全体に適用されるようになりました。

```rust
static MAP: phf::Map<&'static str, u32> = phf::phf_map! {
    #[cfg(feature = "foo")]
    "a" | "b" => 1,
};
```

この例では、`#[cfg(feature = "foo")]` は `"a"` だけでなく `"a" | "b"` 全体にかかります。

これは Rust の pattern に付く `#[cfg]` の挙動と揃えるための変更で、PR [#391](https://github.com/rust-phf/rust-phf/pull/391)で入りました。

もし OR パターンの先頭だけが条件付きになるという挙動に依存していたコードがあれば、エントリを分けて書き直す必要があるので注意してください。

### 複数の `#[cfg]` を含む構造の生成

複数の `#[cfg]` を含む構造の生成も、組み合わせを列挙する方式から宣言マクロで解決する方式に変わりました。

この変更は PR [#403](https://github.com/rust-phf/rust-phf/pull/403)で入り、`#[cfg]` が多い場合のビルド時間も短くなっています。

## `quote::ToTokens`

`phf_codegen` では、`quote` feature を有効にしたときに `build()` の返り値が `quote::ToTokens` を実装するようになりました。

これは PR [#414](https://github.com/rust-phf/rust-phf/pull/414)による変更で、`build.rs` で `quote!` を使っている場合に、生成結果を文字列として扱う必要がなくなります。

## `FmtConst`

PR [#416](https://github.com/rust-phf/rust-phf/pull/416) により `FmtConst` は新しく `Vec` と slice key に対応しました。

これにより、 `phf_codegen::Map::<Vec<u8>>::new()` のような形で slice として lookup する table を生成できます。

## tuple まわりの改善

PR [#420](https://github.com/rust-phf/rust-phf/pull/420)で tuple を使っている際の lifetime の取り回しを改善しました。

PR でメンションされている issues にあるような lifetime の問題が解消されているはずです。

ただ内部的な実装方針を結構変えたので何かしら予期しない副作用があるかもしれません。逆に動作しなくなった例などあれば教えてください！

## slice まわりの改善

slice と pointer-sized integer の hash も修正しています。

PR [#396](https://github.com/rust-phf/rust-phf/pull/396)では slice key の hash を整理しました。

これは例えば `usize` と `isize` が 32-bit target と 64-bit target で異なる hash になって cross compilation を壊すといった問題に対する修正です。

## integer literalのsuffix

v0.14.0では、macro で integer key を使うときの型推論をより厳密にしました。

最初の key の型を決める位置にある integer literal には、明示的な suffix が必要になります。

```rust
static MAP: phf::Map<u32, &'static str> = phf::phf_map! {
    0u32 => "zero",
    1 => "one",
};
```

この例では、最初の key の `0u32` が型を決めます。

後続の `1` は同じ位置から `u32` と推論されます。

tuple や array の中でも、最初の key の型を決める integer literal には suffix が必要です。

```rust
static TUPLES: phf::Map<(u32, &'static str), u8> = phf::phf_map! {
    (0u32, "a") => 1,
    (1, "b") => 2,
};

static ARRAYS: phf::Map<[u8; 2], u8> = phf::phf_map! {
    [0u8, 1] => 1,
    [2, 3] => 2,
};
```

この変更は PR [#419](https://github.com/rust-phf/rust-phf/pull/419)で入り、型の曖昧さをコンパイル時に明示させるためのものです。

0.14.0へ上げてこのエラーが出た場合は、最初の key の integer literal に `u32` や `u8` などの suffix を足してください。

## 生成時間の改善

また、パフォーマンス改善も入れてみています。

PR [#407](https://github.com/rust-phf/rust-phf/pull/407)では、大きな map の生成時間を短くするために bucket storage と bucket group の扱いを調整しました。

PR の説明にも書いた通り、この変更には lookup speed と table size の小さなトレードオフがあります。とはいえ、得られるスピードアップに対しての regression は十分小さいとは思っています。

巨大な table の生成時間に困っていた場合には効く可能性がある一方で、トレードオフが気になる場合は更新前後を測って判断してください。

## まとめ

結構大きいリリースになってしまったので、既存ユーザーの方はこちらで言及しているマイグレーション方法など参考に更新してみてください。その分微妙な挙動の問題やパフォーマンス改善などなど、嬉しいポイントも盛りだくさんになっているはず……です！

また、新規ユーザーは単純に改善された rust-phf をお使いいただけると思います。ぜひ使ってみてほしいです。

今回言及している他に何か意図していなさそうな挙動の変更など、問題を見つけた場合は [rust-phf の issue](https://github.com/rust-phf/rust-phf/issues)で教えてください。
