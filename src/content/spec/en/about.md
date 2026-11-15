# About me

I have been working as a web engineer since 2019. I started my career as an R&D engineer, then worked as a backend engineer, and recently have been focusing on SRE and platform engineering.
I have expertise in SRE-related tasks such as error rate improvement and thorough O11y (Observability), as well as platform engineering areas including technology infrastructure renewal and maintenance. I am also skilled in backend development using statically typed languages such as Go and Rust.

I maintain several open-source projects, with a particular focus on Rust.
As of November 2026, I am one of the most active Japanese contributors to Rust, ranking 42nd overall according to [Thanks](https://thanks.rust-lang.org/rust/all-time/), which aggregates contributions on GitHub.

The serious technical articles are on [Zenn](https://zenn.dev/fraternite) (written in Japanese).

## Career History

| Period            | Company          | Position                   | Role       |
| ----------------- | ---------------- | -------------------------- | ---------- |
| 2025-05 / Current | MOSH             | Staff Software Engineer    | Member     |
| 2022-05 / 2025-04 | Canary           | Backend, Platform Engineer | Member, TL |
| 2021-05 / 2022-04 | Huawei           | OSS Engineer               | Contractor |
| 2019-04 / 2019-10 | Vega Corporation | R&D Engineer               | Member     |

## Talks

- [Why Are Rust's Error Messages Easy to Understand? — BuriKaigi 2026](https://fortee.jp/burikaigi-2026/proposal/28681e2d-63e9-4c90-aadb-5063491a586e) (in Japanese)
- [How Rust triages regressions and prevents them from reaching to stable — Rust.Tokyo 2021](https://rust.tokyo/2021/lineup/1)

## Details

### Work

#### MOSH

As a Staff Software Engineer, I primarily work on platform engineering.

Examples:

- Migrated services from AWS Lambda to ECS without downtime
- Improved observability with Sentry and helped teams adopt it
- Developed and operated a remote MCP server
  - Implemented rate limiting
  - Built a custom OAuth implementation tailored to our internal domain requirements
- Led hiring within my unit
- Contributed to outreach through technical blog posts, podcasts, and conference talks

#### Canary

I joined as a backend engineer and became the first engineer on the platform team.

Examples:

- Conducted API load testing and performance tuning
- Advanced infrastructure as code, including introducing tfaction
- Set up a local development environment for microservices
- Established alerting practices to prevent unresolved alerts from becoming the norm

### OSS

#### Rust

As a member of the [Compiler team](https://github.com/rust-lang/team/blob/main/teams/compiler.toml) and [Diagnostics WG](https://github.com/rust-lang/team/blob/main/teams/wg-diagnostics.toml), I work on improving rustc's error messages and suggestions and fixing compiler bugs.
I also participate in issue triage and PR reviews.

As a member of the [Library team](https://github.com/rust-lang/team/blob/main/teams/libs.toml), I also review changes to the standard library.

On the [lang-docs team](https://github.com/rust-lang/team/blob/main/teams/lang-docs.toml), I primarily maintain the Rustonomicon.

Example work:

- [#147974: Improve diagnostics for buffer reuse with borrowed references](https://github.com/rust-lang/rust/pull/147974). Clarified the relationship between a collection holding borrowed references and the lifetime of the referenced data, making borrow errors easier to understand.
- [#152165: Normalize captured types to fix compiler crashes](https://github.com/rust-lang/rust/pull/152165). Fixed bugs involving the trait solver and closure capture analysis, and added regression tests.

#### libc

I maintain [libc](https://github.com/rust-lang/libc), which provides bindings for calling system libraries and C functions from Rust.
My work covers platform-specific type and function definitions, compatibility tests, PR reviews, CI maintenance, backports to the stable branch, and releases.

Both the [Rust standard library](https://github.com/rust-lang/rust/blob/main/library/std/Cargo.toml) and [Tokio](https://github.com/tokio-rs/tokio/blob/master/tokio/Cargo.toml) depend on it.
It has [about 1.98 billion cumulative downloads](https://crates.io/crates/libc) and [18,863 dependent crates](https://crates.io/crates/libc/reverse_dependencies) on crates.io.

#### Other OSS projects I maintain

- [actix-web](https://github.com/actix/actix-web)
  - A web framework for Rust
  - [About 90.8 million cumulative downloads](https://crates.io/crates/actix-web) and [1,770 dependent crates](https://crates.io/crates/actix-web/reverse_dependencies) on crates.io
- [notify](https://github.com/notify-rs/notify)
  - A cross-platform filesystem notification library
  - [Used by rust-analyzer, Deno, Zed, mdBook, and others](https://github.com/notify-rs/notify#readme)
  - [About 198 million cumulative downloads](https://crates.io/crates/notify) and [3,345 dependent crates](https://crates.io/crates/notify/reverse_dependencies) on crates.io
- [rust-phf](https://github.com/rust-phf/rust-phf)
  - A library for generating static lookup tables at compile time using perfect hash functions
  - Used by [chrono-tz](https://github.com/chronotope/chrono-tz/blob/main/chrono-tz/Cargo.toml), [tokio-postgres](https://github.com/rust-postgres/rust-postgres/blob/master/tokio-postgres/Cargo.toml), and others
  - The `phf` crate has [about 720 million cumulative downloads](https://crates.io/crates/phf) and [1,233 dependent crates](https://crates.io/crates/phf/reverse_dependencies) on crates.io
- And more...
