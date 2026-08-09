---
published: 2026-08-09
title: "Contribution report for July 2026"
tags: ["report"]
description: "A contribution report for July 2026, by @JohnTitor."
category: "report"
image: ""
draft: false
lang: "en"
---

## Contribution summary

- 185 commits authored.
- 16 pull requests opened.
- 119 pull request reviews submitted.
- 0 issues opened.

(You can find my full contributions in July [here](https://github.com/JohnTitor?tab=overview&from=2026-07-01&to=2026-07-31))

## Focus areas

### Actix

July was mostly a maintenance month across the Actix project.

I released actix-protobuf v0.12.0, which updates prost to v0.14 and raises the MSRV to 1.88:

- https://github.com/actix/actix-extras/releases/tag/protobuf-v0.12.0
- https://github.com/actix/actix-extras/pull/779

For actix-web, I migrated code coverage from Codecov to GitHub's built-in coverage support and handled dependency and GitHub Actions updates:

- https://github.com/actix/actix-web/pull/4132
- https://github.com/actix/actix-web/pull/4133
- https://github.com/actix/actix-web/pull/4141
- https://github.com/actix/actix-web/pull/4162
- https://github.com/actix/actix-web/pull/4163

I'm also experimenting with Actions lockfile on the Actix project. It's currently beta but I believe it'd resolve some concerns of supply-chain risks around Actions.

I also cleaned up clippy warnings in the Actix examples:

- https://github.com/actix/examples/pull/1343
- https://github.com/actix/examples/pull/1344

Reviewed 64 PRs across Actix repositories this month.

### Notify

Most notify work in July was review and platform-specific stabilization toward v9.

I reviewed 13 PRs, including fixes for kqueue error propagation, recursive watch setup, and Windows shutdown races:

- Preserve kqueue error kinds: https://github.com/notify-rs/notify/pull/953
- Install recursive kqueue watches before delivering events: https://github.com/notify-rs/notify/pull/957
- Handle Windows watch shutdown races: https://github.com/notify-rs/notify/pull/958

I also investigated Windows handler test flakiness: https://github.com/notify-rs/notify/pull/959

### Rust

I fixed VxWorks support after libc removed its `pread` and `pwrite` shims.

The rust-lang/rust change makes positioned I/O return an unsupported error on VxWorks, while the libc follow-up updates its semver test:

- https://github.com/rust-lang/rust/pull/160031
- https://github.com/rust-lang/libc/pull/5334

Reviewed 16 PRs on rust-lang/rust and 13 PRs on rust-lang/libc this month.

### rust-phf

I continued rust-phf maintenance by upgrading syn to v3 and refreshing the lockfile:

- https://github.com/rust-phf/rust-phf/pull/437
- https://github.com/rust-phf/rust-phf/pull/435

Reviewed 7 rust-phf PRs this month.

## Support my work

Does my FLOSS work help you or your company?
Consider sponsoring me at [https://github.com/sponsors/JohnTitor](https://github.com/sponsors/JohnTitor)!
