---
published: 2026-06-01
title: "Contribution report for May 2026"
tags: ["report"]
description: "A contribution report for May 2026, by @JohnTitor."
category: "report"
image: ""
draft: false
lang: "en"
---

## Contribution summary

- 187 commits authored.
- 34 pull requests opened.
- 106 pull request reviews submitted.
- 1 issue opened.

(You can find my full contributions in May [here](https://github.com/JohnTitor?tab=overview&from=2026-05-01&to=2026-05-31))

## Focus areas

### Notify

May was another month of work toward notify v9.

Released notify v9.0.0-rc.4 and notify-debouncer-full v0.8.0-rc.2:

- https://github.com/notify-rs/notify/releases/tag/notify-9.0.0-rc.4
- https://github.com/notify-rs/notify/releases/tag/debouncer-full-0.8.0-rc.2

I also worked on platform-specific fixes and performance improvements:

- Speed up recursive inotify watch setup: https://github.com/notify-rs/notify/pull/918
- Speed up fsevent flag conversion: https://github.com/notify-rs/notify/pull/920
- Avoid filesystem walks for recursive kqueue unwatch: https://github.com/notify-rs/notify/pull/924
- Retry fsevent startup in tests: https://github.com/notify-rs/notify/pull/928
- Report Windows watch errors correctly: https://github.com/notify-rs/notify/pull/936

The remaining v9 queue is mostly about release confidence and platform-specific behavior.

### Actix

Actix work was smaller than April, but I still handled a few maintenance items.

For actix-web and actix-net, I updated hickory-resolver and fixed a panic in `Files` paths containing `.`:

- https://github.com/actix/actix-web/pull/4056
- https://github.com/actix/actix-net/pull/872
- https://github.com/actix/actix-web/pull/4083

I also added the Actix contributing guide and opened a session performance improvement:

- https://github.com/actix/.github/pull/3
- https://github.com/actix/actix-extras/pull/737

### Rust

Most Rust work this month was libc maintenance.

I migrated libc release automation to `release-plz/action`, and opened follow-up PRs for Linux bindings and CI image updates:

- https://github.com/rust-lang/libc/pull/5103
- https://github.com/rust-lang/libc/pull/5125
- https://github.com/rust-lang/libc/pull/5126

I also opened an issue to validate `ignore-tidy-cr` entries against `.gitattributes`: https://github.com/rust-lang/rust/issues/157184

Reviewed 14 PRs on rust-lang/rust this month.

### rust-phf

I continued rust-phf maintenance and feature work.

This included generator performance, 2024 edition migration, new const-formatting support, and a parser fix:

- Reduce generation time: https://github.com/rust-phf/rust-phf/pull/407
- Add support for `ToTokens`: https://github.com/rust-phf/rust-phf/pull/414
- Migrate to the 2024 edition: https://github.com/rust-phf/rust-phf/pull/415
- Add `FmtConst` support for `Vec` and slice keys: https://github.com/rust-phf/rust-phf/pull/416
- Require suffixed integers on parsing: https://github.com/rust-phf/rust-phf/pull/419

I have some more things for the next major release, but the goal is near.

### Personal projects and other OSS

I set up zizmor for mach2 and documented Xcode version availability in setup-xcode:

- https://github.com/JohnTitor/mach2/pull/74
- https://github.com/JohnTitor/setup-xcode/pull/2

I also did small maintenance on this site and activity.2k36.org, including a pnpm v11 upgrade:

- https://github.com/JohnTitor/www.2k36.org/pull/611
- https://github.com/JohnTitor/activity.2k36.org/pull/147

For purell, I helped with documentation, dependency updates, and GitHub Actions hardening:

- https://github.com/PuerkitoBio/purell/pull/43
- https://github.com/PuerkitoBio/purell/pull/44
- https://github.com/PuerkitoBio/purell/pull/46

## Support my work

Does my FLOSS work help you or your company?
Consider sponsoring me at [https://github.com/sponsors/JohnTitor](https://github.com/sponsors/JohnTitor)!

## Short notice

I'm planning to move to Tokyo and take a short vacation in early June.
Therefore, OSS activities are likely to be relatively quiet for.
