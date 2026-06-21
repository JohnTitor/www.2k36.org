---
published: 2026-06-21
title: "rust-phf v0.14.0 has been released"
tags: [rust, rust-phf, oss, english]
description: "Highlights and migration notes for rust-phf v0.14.0"
category: "release"
image: ""
draft: false
lang: "en"
---

rust-phf v0.14.0 has been released.

The release notes are available on [GitHub Releases](https://github.com/rust-phf/rust-phf/releases/tag/v0.14.0).

I usually do this kind of release silently, but I would like more people to notice this one, so I am trying an announcement post this time.

## What is rust-phf?

rust-phf is a set of crates for generating lookup tables at compile time using perfect hash functions (PHF).

It is useful for tables whose key set is known at build time.
Because the table is generated as static data, there is no need to construct a `HashMap` at runtime, and lookups can be faster.

Typical examples include converting `"while"` to `Token::While` in a language processor, or converting configuration key names into a more convenient internal representation.

It is not a good fit for tables whose keys need to be added or removed at runtime.

For real-world usage, rust-phf is used by crates such as chrono and tokio-postgres: https://crates.io/crates/phf/reverse_dependencies

Below is an overview of this release.
This post focuses on the feature-level changes, so if you want to try rust-phf for the first time, the repository documentation and examples are probably the better starting point: https://github.com/rust-phf/rust-phf

## MSRV is now 1.85

In v0.14.0, all crates have been migrated to the 2024 edition.

As a result, the MSRV is now 1.85.

It feels like the 2024 edition was released only recently, but somehow 2026 is already almost halfway over.
Time flies.

For libraries like this, I tend to move relatively slowly on edition updates and other MSRV-related changes.

In the past, many projects treated MSRV bumps strictly as breaking changes.
These days, I feel like more crates have adopted relative MSRV policies such as the N-3 window used by the [time crate](https://github.com/time-rs/time#minimum-rust-version-policy).

From a maintainer perspective, that approach is certainly easier.
I often hesitate to bump a major version just to raise MSRV, and I have recently been applying policies like this to crates I maintain.
phf does not have an explicit MSRV policy yet, but maybe it is about time to define one.

## ptrhash feature

v0.14.0 adds an experimental `ptrhash` feature.

This feature does not immediately replace the existing CHD implementation.
The default layout is still CHD, and `ptrhash` is used only when explicitly enabled.

If you use `phf_macros`, enable both `macros` and `ptrhash` on the `phf` crate.

```toml
[dependencies]
phf = { version = "0.14.0", features = ["macros", "ptrhash"] }
```

If you use `phf_codegen`, enable `ptrhash` on both the generator side and the runtime side.

```toml
[dependencies]
phf = { version = "0.14.0", features = ["ptrhash"] }

[build-dependencies]
phf_codegen = { version = "0.14.0", features = ["ptrhash"] }
```

The motivation for adding this feature is performance.

In fact, the benchmark results in the [PR](https://github.com/rust-phf/rust-phf/pull/392) look good for both generation time and lookup performance.
Nice.

That said, results depend on the shape of the data and where the table is used, so please measure with your own workload before adopting it in production.
I expect it to improve performance over the default in most cases, but better safe than sorry.

Please let me know if you see any behavior differences from the existing implementation or find a bug.

## Handling entries with cfg

If you use `#[cfg]` inside macros such as `phf_map!`, v0.14.0 changes a few behaviors.

### Bug fix when cfgs are disabled

First, there was a bug where, if all `#[cfg]` entries were disabled, a map or set could contain data from another variant instead of being empty.

This was fixed in PR [#393](https://github.com/rust-phf/rust-phf/pull/393).

### OR pattern behavior is now consistent

Second, a `#[cfg]` attached to an OR pattern now applies to the whole entry.

```rust
static MAP: phf::Map<&'static str, u32> = phf::phf_map! {
    #[cfg(feature = "foo")]
    "a" | "b" => 1,
};
```

In this example, `#[cfg(feature = "foo")]` applies not only to `"a"`, but to the entire `"a" | "b"` pattern.

This change was introduced in PR [#391](https://github.com/rust-phf/rust-phf/pull/391) to match how Rust handles `#[cfg]` on patterns.

If your code depended on only the first alternative in an OR pattern being conditional, you need to split the entry.

### Generating structures with multiple cfgs

Generation for structures containing multiple `#[cfg]` entries has also changed from enumerating combinations to resolving them through declarative macros.

This change landed in PR [#403](https://github.com/rust-phf/rust-phf/pull/403), and it also reduces build time when many `#[cfg]` entries are involved.

## `quote::ToTokens`

In `phf_codegen`, the value returned by `build()` now implements `quote::ToTokens` when the `quote` feature is enabled.

This change comes from PR [#414](https://github.com/rust-phf/rust-phf/pull/414), and it removes the need to treat generated output as a string when using `quote!` in `build.rs`.

## `FmtConst`

PR [#416](https://github.com/rust-phf/rust-phf/pull/416) adds `FmtConst` support for `Vec` and slice keys.

This makes it possible to generate a table that can be looked up as a slice, for example by using `phf_codegen::Map::<Vec<u8>>::new()`.

## Tuple improvements

PR [#420](https://github.com/rust-phf/rust-phf/pull/420) improves lifetime handling when tuple keys are used.

The lifetime issues mentioned in the linked issues should now be resolved.

The internal implementation strategy changed quite a bit, so there may be unintended side effects.
Please let me know if you find an example that no longer works.

## Slice improvements

Hashing for slices and pointer-sized integers has also been fixed.

PR [#396](https://github.com/rust-phf/rust-phf/pull/396) cleaned up slice key hashing.

This fixes issues such as `usize` and `isize` producing different hashes on 32-bit and 64-bit targets and breaking cross-compilation.

## Integer literal suffixes

v0.14.0 makes type inference stricter when integer keys are used in macros.

Integer literals in positions that determine the first key's type now need explicit suffixes.

```rust
static MAP: phf::Map<u32, &'static str> = phf::phf_map! {
    0u32 => "zero",
    1 => "one",
};
```

In this example, the first key, `0u32`, determines the type.

The later `1` is inferred as `u32` from the same position.

The same rule applies to integer literals inside tuple and array keys.

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

This change was introduced in PR [#419](https://github.com/rust-phf/rust-phf/pull/419) to make ambiguous types explicit at compile time.

If you see this error after upgrading to 0.14.0, add suffixes such as `u32` or `u8` to the integer literals in the first key.

## Generation time improvements

This release also includes performance improvements.

In PR [#407](https://github.com/rust-phf/rust-phf/pull/407), I adjusted bucket storage and bucket grouping to reduce generation time for large maps.

As described in the PR, this change has small trade-offs in lookup speed and table size.
That said, I think the regression is small enough compared to the speedup it gives.

If you were struggling with generation time for a huge table, this may help.
If the trade-off matters for your use case, please measure before and after the update.

## Closing

This became a fairly large release, so existing users may want to use the migration notes in this post as a guide when upgrading.
At the same time, it should include many nice changes, including behavior fixes and performance improvements.

New users can simply start with an improved rust-phf.
I hope you give it a try.

If you find any behavior changes that do not look intentional, or any other problems, please let me know in [rust-phf issues](https://github.com/rust-phf/rust-phf/issues).
