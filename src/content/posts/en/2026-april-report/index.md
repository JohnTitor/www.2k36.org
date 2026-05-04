---
published: 2026-05-04
title: "Contribution report for Apr. 2026"
tags: ["report"]
description: "A contribution report for Apr. 2026, by @JohnTitor."
category: "report"
image: ""
draft: false
lang: "en"
---

## Contribution summary

- 237 commits authored.
- 87 pull requests opened.
- 96 pull request reviews submitted.
- 1 issue opened.

(You can find my full contributions in April [here](https://github.com/JohnTitor?tab=overview&from=2026-04-01&to=2026-04-30))

## Focus areas

### Actix

April had a lot of Actix maintenance across the project.

For actix-web, I prepared the actix-http v3.12.1 release: https://github.com/actix/actix-web/releases/tag/http-v3.12.1

I also worked on multipart fixes and follow-ups:

- Fix parser buffering cap: https://github.com/actix/actix-web/pull/4025
- Fix a multipart parser panic: https://github.com/actix/actix-web/pull/4024
- Count ignored fields toward `MultipartFormConfig` limits: https://github.com/actix/actix-web/pull/4026
- Prepare actix-multipart 0.8.0: https://github.com/actix/actix-web/pull/4027

Other actix-web work included adding the `cookie_raw` API, supporting multi-component path params in actix-files, fixing `web::Data` drop behavior during graceful shutdown, and reducing a few needless allocations:

- https://github.com/actix/actix-web/pull/4013
- https://github.com/actix/actix-web/pull/4039
- https://github.com/actix/actix-web/pull/4033
- https://github.com/actix/actix-web/pull/4042

For actix-net, I spent time on bytestring performance and released bytestring v1.5.1: https://github.com/actix/actix-net/releases/tag/bytestring-v1.5.1

I also wrote Actix security documentation and hardened GitHub Actions usage across several repositories:

- Incident response plan: https://github.com/actix/.github/pull/1
- Threat model: https://github.com/actix/.github/pull/2
- Example zizmor hardening PR: https://github.com/actix/actix-web/pull/4054

### Notify

Continued working toward notify v9.

Released notify v9.0.0-rc.3 and notify-debouncer-full v0.8.0-rc.1:

- https://github.com/notify-rs/notify/releases/tag/notify-9.0.0-rc.3
- https://github.com/notify-rs/notify/releases/tag/debouncer-full-0.8.0-rc.1

There were also a few fixes and performance improvements:

- Avoid rebuilding queues during flush: https://github.com/notify-rs/notify/pull/883
- Speed up debouncer hashing with `rustc-hash`: https://github.com/notify-rs/notify/pull/896
- Preserve watched path representations across backends: https://github.com/notify-rs/notify/pull/901
- Replace watcher state correctly when rewatching: https://github.com/notify-rs/notify/pull/906
- Fix kqueue path handling for non-recursive watchers: https://github.com/notify-rs/notify/pull/907

The remaining v9 queue is mostly about tightening behavior and checking platform-specific edge cases.

### Rust

I opened a stabilization PR for `tcp_deferaccept`: https://github.com/rust-lang/rust/pull/154834

On libc, I helped with the 0.2.186 release and CI/security maintenance:

- Migrate CI from Cirrus CI to GitHub Actions: https://github.com/rust-lang/libc/pull/5058
- Backports for 0.2.186: https://github.com/rust-lang/libc/pull/5074
- Release 0.2.186: https://github.com/rust-lang/libc/pull/5075
- SHA-pin actions: https://github.com/rust-lang/libc/pull/5078

### rust-phf

I also did some rust-phf maintenance, including an experimental `ptrhash` feature and a security policy:

- https://github.com/rust-phf/rust-phf/pull/392
- https://github.com/rust-phf/rust-phf/pull/401
- https://github.com/rust-phf/rust-phf/pull/402

### Personal projects

Rewrote the rust-thanks-card action: https://github.com/JohnTitor/rust-thanks-card/pull/272

## Support my work

Does my FLOSS work help you or your company?
Consider sponsoring me at [https://github.com/sponsors/JohnTitor](https://github.com/sponsors/JohnTitor)!
