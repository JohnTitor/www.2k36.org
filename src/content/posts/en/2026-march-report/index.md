---
published: 2026-04-10
title: "Contribution report for Mar. 2026"
tags: ["report"]
description: "A contribution report for Mar. 2026, by @JohnTitor."
category: "report"
image: ""
draft: false
lang: "en"
---

## Contribution summary

- 156 commits authored.
- 27 pull requests opened.
- 125 pull request reviews submitted.
- 1 issue opened.

(You can find my full contributions in March [here](https://github.com/JohnTitor?tab=overview&from=2026-03-01&to=2026-03-31))

## Focus areas

### Actix

I kept working on follow-ups after the February releases.

For actix-extras, I added rustls support to actix-settings: https://github.com/actix/actix-extras/pull/697

For actix-web, I opened a couple of actix-http improvements:

- Make the HTTP/1 write buffer size configurable: https://github.com/actix/actix-web/pull/3986
- Make the early-response linger behavior configurable via `client_disconnect_timeout`: https://github.com/actix/actix-web/pull/3985

I also handled smaller maintenance work, including security advisory updates and test fixes.

### Notify

Continued working toward notify v9.

I fixed Windows `unwatch()` so it waits until the watch is fully removed: https://github.com/notify-rs/notify/pull/849

I also added `watched_paths` for `Debouncer` in notify-debouncer-full: https://github.com/notify-rs/notify/pull/850

There was more cleanup around flaky tests, CI, and Renovate scheduling. I still need more time before the final v9 release, but the queue is getting smaller.

### Rust

I fixed some suggestions of the `for-loops-over-fallibles` lint: https://github.com/rust-lang/rust/pull/153913

I also opened a diagnostic improvement for E0401 on inner const items: https://github.com/rust-lang/rust/pull/153566

On the libc side, I helped with the 0.2.183 release and CI maintenance:

- https://github.com/rust-lang/libc/pull/5007
- https://github.com/rust-lang/libc/pull/5013

### Personal projects

Released [`dotenvor` v0.2.0](https://github.com/JohnTitor/dotenvor/releases/tag/v0.2.0) and [`dotenvor-macros` v0.1.0](https://github.com/JohnTitor/dotenvor/releases/tag/macros-v0.1.0).

I also upgraded this site to Astro v6: https://github.com/JohnTitor/www.2k36.org/pull/515

## Support my work

Does my FLOSS work help you or your company?
Consider sponsoring me at [https://github.com/sponsors/JohnTitor](https://github.com/sponsors/JohnTitor)!
