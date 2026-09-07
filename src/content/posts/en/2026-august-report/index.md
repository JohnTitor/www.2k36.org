---
published: 2026-09-07
title: "Contribution report for August 2026"
tags: ["report"]
description: "A contribution report for August 2026, by @JohnTitor."
category: "report"
image: ""
draft: false
lang: "en"
---

## Contribution summary

- 133 commits authored.
- 12 pull requests opened.
- 118 pull request reviews submitted.
- 0 issues opened.

(You can find my full contributions in August [here](https://github.com/JohnTitor?tab=overview&from=2026-08-01&to=2026-08-31))

## Focus areas

### Notify

I released [notify v9.0.0-rc.5](https://github.com/notify-rs/notify/releases/tag/notify-9.0.0-rc.5) on August 30, continuing work toward v9.

I added automatic backend selection for native FreeBSD builds.
A follow-up extended inotify selection to FreeBSD 14.5+, while older versions continue to use kqueue:

- [Select the FreeBSD backend at build time](https://github.com/notify-rs/notify/pull/972)
- [Enable inotify selection on FreeBSD 14.5+](https://github.com/notify-rs/notify/pull/989)

I also [migrated the workspace to the Rust 2024 edition](https://github.com/notify-rs/notify/pull/990).

Reviewed 21 PRs this month, including platform-specific fixes and performance improvements:

- [Guard against FSEvents closing unrelated file descriptors when watching too many paths](https://github.com/notify-rs/notify/pull/971)
- [Detect file modification times changing within the same second in PollWatcher](https://github.com/notify-rs/notify/pull/981)
- [Avoid repeated filesystem metadata queries when adding a Windows watch](https://github.com/notify-rs/notify/pull/987)

Still no ETA for v9 but that release would be cool.

### Actix

For actix-web, nothing major but I updated syn to v3 in the proc-macro crates and refreshed GitHub Actions and their lockfile:

- [Upgrade syn to v3](https://github.com/actix/actix-web/pull/4175)
- [Update GitHub Actions](https://github.com/actix/actix-web/pull/4176)

I also [fixed actix-net CI by removing unused test imports](https://github.com/actix/actix-net/pull/941).

Review work included graceful shutdown support across actix-net and actix-web, and the removal of actix-files' experimental io-uring integration:

- [Notify server services when graceful shutdown starts](https://github.com/actix/actix-net/pull/930)
- [Close idle HTTP/1 connections and finish active requests during graceful shutdown](https://github.com/actix/actix-web/pull/4169)
- [Remove experimental io-uring support from actix-files](https://github.com/actix/actix-web/pull/4198)

Reviewed 45 PRs across Actix repositories this month.

### Rust

Most of my authored Rust work this month was CI maintenance and platform support documentation.

I [pinned cc to v1.4.0 to unblock libc CI](https://github.com/rust-lang/libc/pull/5388) while waiting for an upstream fix.
Later in the month, I [adjusted libc's CI for the removal of `i686-pc-windows-gnu` host tools, removed duplicate `repr(C)` attributes, and switched the Android CI image to Debian](https://github.com/rust-lang/libc/pull/5446).

I also [moved `i686-pc-windows-gnu` to the Tier 2 without host tools section in rustc's platform support documentation](https://github.com/rust-lang/rust/pull/162001).

Reviewed 28 PRs on rust-lang/rust and 10 PRs on rust-lang/libc this month.
Reviewing PRs on rust-lang/rust is quite fun but also takes my time and energy.
I hope I could dedicate my time to other projects more...

### rust-phf

I reviewed 3 maintenance PRs, covering dependency and CI tooling updates:

- [Update trybuild](https://github.com/rust-phf/rust-phf/pull/445)
- [Update zizmor](https://github.com/rust-phf/rust-phf/pull/444)
- [Update rust-cache](https://github.com/rust-phf/rust-phf/pull/446)

### Personal projects

I released [mach2 v0.7.0](https://github.com/JohnTitor/mach2/releases/tag/0.7.0), with [bindings and CI updates for Xcode 26.6.0 and its 26.5 SDKs](https://github.com/JohnTitor/mach2/pull/89).
The release also includes [new Mach port attribute and notification bindings](https://github.com/JohnTitor/mach2/pull/88), which I reviewed this month.

## Support my work

Does my FLOSS work help you or your company?
Consider sponsoring me at [https://github.com/sponsors/JohnTitor](https://github.com/sponsors/JohnTitor)!
