---
published: 2026-10-11
title: "Contribution report for September 2026"
tags: ["report"]
description: "A contribution report for September 2026, by @JohnTitor."
category: "report"
image: ""
draft: false
lang: "en"
---

## Contribution summary

- 125 commits authored.
- 6 pull requests opened.
- 74 pull request reviews submitted.
- 1 issue opened.

(You can find my full contributions in September [here](https://github.com/JohnTitor?tab=overview&from=2026-09-01&to=2026-09-30))

## Focus areas

### Notify

I continued work toward notify v9 with fixes for PollWatcher and the macOS backend.

In PollWatcher, I [fixed detection of subsecond changes to symlink modification times](https://github.com/notify-rs/notify/pull/1004) when symlink following is disabled.
This follows up on August's timestamp precision fix and works with or without content comparison enabled.

On macOS, I [avoided rebuilding the FSEvents stream when adding or updating a watch already covered by a recursive parent watch on the same volume](https://github.com/notify-rs/notify/pull/1005).
Independent paths still require a rebuild, so I also documented using `Watcher::update_paths` to register many paths in a single batch.

Reviewed 10 PRs this month, including two fixes to watch setup:

- [Continue setting up recursive watches when a subdirectory fails, and report the failures](https://github.com/notify-rs/notify/pull/970)
- [Return an error when PollWatcher is asked to watch a nonexistent path](https://github.com/notify-rs/notify/pull/1001)

### Actix

Most of my Actix work this month was maintenance and review.

I [fixed documentation warnings and consolidated workspace lint settings in actix-net](https://github.com/actix/actix-net/pull/964).
For actix-web, I [allowed the `linker_messages` lint at the workspace level](https://github.com/actix/actix-web/pull/4263) to handle an Apple linker warning that had no actionable fix in the project.

Reviewed 35 PRs across Actix repositories this month, including dependency updates in the examples and these actix-web changes:

- [Make HTTP/2 optional when enabling TLS features](https://github.com/actix/actix-web/pull/4213)
- [Fix a panic when asking an empty removed-header iterator for its length](https://github.com/actix/actix-web/pull/4265)
- [Fix parsing of the `Connection` and `Expect` headers](https://github.com/actix/actix-web/pull/4179)

### Rust

I opened an [initial implementation of `#[diagnostic::c_buffer_length]`](https://github.com/rust-lang/rust/pull/162565) and its [tracking issue](https://github.com/rust-lang/rust/issues/162563).
The attribute identifies the buffer pointer and length parameters of a C-style function.
It is groundwork for a future lint to help catch mismatches between buffers and the lengths passed to these APIs.
The implementation PR remains open (need a discussion around the design).

For libc, I [updated CI to test `i686-pc-windows-msvc` using an `x86_64-pc-windows-msvc` host toolchain](https://github.com/rust-lang/libc/pull/5526), following the target's move to Tier 1 without host tools.

Reviewed 19 PRs on rust-lang/rust and 2 PRs on rust-lang/libc this month.
Rust reviews included diagnostics and ABI fixes:

- [Point closure trait errors at the captured values responsible](https://github.com/rust-lang/rust/pull/161624)
- [Avoid suggesting imports of traits declared inside function bodies](https://github.com/rust-lang/rust/pull/162506)
- [Make `Complex` ABI-compatible with C on sparc64 and powerpc64](https://github.com/rust-lang/rust/pull/161697)

### rust-phf

I reviewed 2 maintenance PRs:

- [Update siphasher to v1.0.4](https://github.com/rust-phf/rust-phf/pull/459)
- [Update zizmor](https://github.com/rust-phf/rust-phf/pull/451)

### Other OSS

I also reviewed fixes in Diesel and Nixpkgs:

- [Prevent a panic when deserializing PostgreSQL intervals from malformed responses](https://github.com/diesel-rs/diesel/pull/5194)
- [Pass the target triple to bindgen when cross-compiling](https://github.com/NixOS/nixpkgs/pull/558886)

## Support my work

Does my FLOSS work help you or your company?
Consider sponsoring me at [https://github.com/sponsors/JohnTitor](https://github.com/sponsors/JohnTitor)!
