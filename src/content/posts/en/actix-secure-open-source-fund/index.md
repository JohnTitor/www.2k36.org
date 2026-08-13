---
published: 2026-08-14
title: "How Actix strengthened its security through GitHub's Secure Open Source Fund"
tags: [rust, actix, oss, security, english]
description: "The security improvements and lessons from Actix's participation in GitHub Secure Open Source Fund Session 4"
category: "announcement"
image: ""
draft: false
lang: "en"
---

Actix participated in Session 4 of the [GitHub Secure Open Source Fund](https://github.com/open-source/github-secure-open-source-fund).

https://github.blog/open-source/maintainers/what-50-open-source-projects-taught-us-about-security-in-the-ai-era/

As an Actix maintainer, I joined the three-week security education program and learned about open source security with experts from the GitHub Security Lab and maintainers from other projects.

Actix is not a single crate or repository.
Alongside the web framework itself, we release crates for HTTP, asynchronous networking, sessions, authentication, and more from several repositories.
Securing Actix therefore cannot stop at reviewing its Rust code.

We also need to consider maintainer accounts, GitHub settings, GitHub Actions, the publishing path to crates.io, and what happens after we receive a vulnerability report.

## Treating the path from code to release as one system

The session reinforced that individual security measures need to be organized around the full path that code takes before it reaches users.
Even when the source code has no known vulnerability, an attacker who compromises a maintainer account or release workflow could distribute a modified crate.
Conversely, a scanner finding a problem is not enough if nobody has decided how to receive the report or in what order to publish a fix.

We started by writing an [Actix threat model](https://github.com/actix/.github/blob/main/THREAT_MODEL.md).
Its scope includes not only implementation areas such as HTTP parsing, file serving, and sessions, but also dependencies, GitHub Actions, tags, releases, and crates.io credentials.

It is a first pass rather than a complete audit.
Its purpose is to share what reviews should prioritize and which changes should trigger another look at the model.

## Enabling systems that help find vulnerabilities

We enabled GitHub `secret scanning` and `code scanning` on key Actix repositories.

We use `secret scanning` to detect credentials that may have been committed accidentally.
`code scanning` continuously looks for potential vulnerabilities in the code.

They provide a baseline that makes issues which are easy to miss in manual review easier to detect as the project changes.

## Documenting our Security Policy and Incident Response Plan

To handle the problems we find, we established a shared [Security Policy](https://github.com/actix/.github/blob/main/SECURITY.md) and [Incident Response Plan (IRP)](https://github.com/actix/.github/blob/main/INCIDENT_RESPONSE.md) for the organization.

The Security Policy defines supported versions, the private reporting channel, the information that helps us investigate, and how we approach fixes and disclosure.
The IRP distinguishes code vulnerabilities, release integrity issues, security regressions, and dependency issues.
It then documents severity levels and the order of initial response, scoping, remediation, publication, and follow-up.

Actix is primarily maintained by volunteers, so its response times are targets rather than a strict SLA.
Still, agreeing on goals and procedures in advance means we do not need to decide the disclosure scope or release order from scratch during an incident.

We also added guidance about AI-assisted vulnerability reports to the Security Policy.
We do not ban the use of AI, but we do not accept reports generated entirely by AI, low-quality reports, or spam.
A report must reflect a real investigation, contain Actix-specific details, and provide a credible reproduction or impact assessment.
AI may make reports faster to produce, but that is not a reason to lower the standard of evidence behind them.

## Reviewing GitHub Actions and organization settings

GitHub Actions handles permissions and credentials as well as running tests, which also makes it a potential entry point for supply chain attacks.
We introduced [zizmor](https://github.com/zizmorcore/zizmor), a static analysis tool for GitHub Actions, in key Actix repositories.
For example, the [actix-web rollout](https://github.com/actix/actix-web/pull/4054) stopped `actions/checkout` from persisting credentials and moved GitHub expressions embedded directly in shell scripts through environment variables instead.
Workflows now go through static analysis whenever they change, just like the rest of the code.

We also began [experimenting with a GitHub Actions lockfile in actix-web](https://github.com/actix/actix-web/pull/4124).
The lockfile resolves direct and transitive Action dependencies to immutable commit SHAs and records that mapping in the repository.
If an Action tag moves unexpectedly or a transitive dependency changes, the lockfile makes the change easier to review before it runs.
The feature is still experimental and has operational trade-offs, but we will keep evaluating it as a way to reduce supply chain risk.

We reviewed our GitHub organization settings as well and now require two-factor authentication (2FA) for the Actix organization.
Hardening code and workflows is not enough if a stolen maintainer account can alter a repository or its release path.
Requiring 2FA turns protection against a leaked password from an individual choice into an organization-wide baseline.

## What comes next

These changes do not mean that Actix security work is finished.
The threat model needs to evolve with the implementation and release process, and we need to check periodically that the IRP still works in practice.
We are also still looking for an Actions lockfile workflow that coexists smoothly with routine dependency updates.
However, recording our expectations for detection, prevention, reporting, and response in code and documentation has made the next things to check much clearer.

Thank you to GitHub and the GitHub Security Lab for running the program, and to the instructors, partners, Microsoft for Startups, and participating maintainers who shared their knowledge and real-world examples.

If you're interested in joining a future session or have questions about applying, feel free to reach out!
I'm happy to answer your questions.
