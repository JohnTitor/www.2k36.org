---
published: 2026-11-07
title: "Contribution report for October 2026"
tags: ["report"]
description: "A contribution report for October 2026, by @JohnTitor."
category: "report"
image: ""
draft: false
lang: "en"
---

## Contribution summary

- 163 commits authored.
- 29 pull requests opened.
- 76 pull request reviews submitted.
- 1 issue opened.

(You can find my full contributions in October [here](https://github.com/JohnTitor?tab=overview&from=2026-10-01&to=2026-10-31))

## Focus areas

### Notify

I released [notify v9.0.0-rc.6](https://github.com/notify-rs/notify/releases/tag/notify-9.0.0-rc.6) and [v9.0.0-rc.7](https://github.com/notify-rs/notify/releases/tag/notify-9.0.0-rc.7), continuing work toward v9.
I also released [notify v8.2.1](https://github.com/notify-rs/notify/releases/tag/notify-8.2.1) and [notify-types v2.2.0](https://github.com/notify-rs/notify/releases/tag/types-2.2.0).

On macOS, I [fixed pending events being lost when the FSEvents stream is rebuilt after watch changes](https://github.com/notify-rs/notify/pull/1033).
Paths that remain watched now retain their pending events across the rebuild.

For inotify, I [added creation events for newly discovered subdirectories when extending a recursive watch](https://github.com/notify-rs/notify/pull/1047).
This covers directories created before their watches were installed; it does not recover file creation events.

I also [made the mini debouncer forward rescan notifications immediately](https://github.com/notify-rs/notify/pull/1032), including notifications without paths.
Previously, it discarded the rescan flag, leaving consumers unaware that they needed to scan their watched paths again.

Documentation work covered [WSL limitations](https://github.com/notify-rs/notify/pull/1048) and [differences between backends when watched paths are renamed, moved, or deleted](https://github.com/notify-rs/notify/pull/1053).

Reviewed 26 PRs this month, including:

- [Fix intermittent hangs during rapid watch/unwatch cycles on macOS](https://github.com/notify-rs/notify/pull/1013)
- [Batch inotify watch updates and avoid redundant metadata reads](https://github.com/notify-rs/notify/pull/1041)
- [Prevent a debouncer thread leak when watcher construction fails](https://github.com/notify-rs/notify/pull/1044)

### Actix

Most of my Actix work this month was dependency and CI maintenance.

I raised the MSRV to 1.89 in [actix-net](https://github.com/actix/actix-net/pull/1006) and [actix-extras](https://github.com/actix/actix-extras/pull/853).
For the Actix website, I [updated dependencies](https://github.com/actix/actix-website/pull/814) and [migrated CI to `pnpm/setup`](https://github.com/actix/actix-website/pull/815).

Reviewed 19 PRs across Actix repositories this month, mostly dependency and GitHub Actions updates.

### Rust

I opened a [follow-up PR for the Linux `defer_accept` API ahead of stabilization](https://github.com/rust-lang/rust/pull/164461).
It renames the methods to `set_defer_accept` and `defer_accept`, and changes the getter to return `io::Result<Option<Duration>>`, with `None` indicating that deferred accept is disabled.

For libc, I [temporarily pinned rustup to 1.29.1 on Solaris](https://github.com/rust-lang/libc/pull/5664) after 1.29.2 broke installation.
I also [reported the regression upstream](https://github.com/rust-lang/rustup/issues/5164).

Reviewed 20 PRs on rust-lang/rust, 3 on rust-lang/libc, and 3 on the Rustonomicon this month.
These included:

- [Stabilize `CStr::display`](https://github.com/rust-lang/rust/pull/163711)
- [Stabilize `ExitCodeExt` for Windows](https://github.com/rust-lang/rust/pull/164656)
- [Avoid advancing the inner iterator in `Skip::advance_by(0)`](https://github.com/rust-lang/rust/pull/164488)
- [Remove duplicated and outdated documentation on FFI unwinding](https://github.com/rust-lang/nomicon/pull/530)

### rust-phf

I added [trait implementations for common container types](https://github.com/rust-phf/rust-phf/pull/466), including `Box`, `Rc`, and `Arc` around strings and slices.
I also [added nested OR patterns to the macros](https://github.com/rust-phf/rust-phf/pull/467), so keys such as `('p', "Point2d" | "Point3d")` can expand into multiple entries.

For the experimental `ptrhash` layout, I [removed the lookup remapping step](https://github.com/rust-phf/rust-phf/pull/468).
The layout now keeps spare slots, which iteration skips.

I also opened a [PR to replace SipHash with portable foldhash](https://github.com/rust-phf/rust-phf/pull/470).
My local string benchmarks with 1–10,000 entries showed roughly 46–54% lower lookup times for hits and 60–69% for misses.
Table generation can be slower: the 10,000-entry CHD benchmark took about 19% longer.
The PR remains open.

Reviewed one maintenance PR to [update rust-cache](https://github.com/rust-phf/rust-phf/pull/473).

### Personal projects

For mach2, I reviewed [additional thread and Mach error bindings](https://github.com/JohnTitor/mach2/pull/98), covering thread termination, abort, special ports, and exception ports.

## Support my work

Does my FLOSS work help you or your company?
Consider sponsoring me at [https://github.com/sponsors/JohnTitor](https://github.com/sponsors/JohnTitor)!
