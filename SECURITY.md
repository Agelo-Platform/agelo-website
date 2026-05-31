# Security policy

## Reporting a vulnerability

**Please do not open public GitHub issues for security bugs.**

Use GitHub's private vulnerability reporting form on this repository:

> **Repo → Security → Report a vulnerability**

Or email <sir.jeff.nasseri@gmail.com> with the subject prefix
`[agelo-website security]`.

This repo serves the public marketing site + documentation at
[agelo.app](https://agelo.app). It does not handle user data and has
no backend. The most likely classes of issue here are:

- Cross-site scripting via embedded MDX or copy-pasted markdown
- Open redirects in the documentation links
- Supply-chain issues in build-time dependencies

## What to expect

- An acknowledgement within 72 hours.
- A triage decision and a target fix window within 7 days.
- A coordinated disclosure: we'll keep you in the loop until a patched
  release lands and a security advisory is published.

## Supported versions

Only the deployed `master` is supported.

## Out of scope

- Vulnerabilities in third-party services we link out to (GitHub,
  npm registry, etc.)
- Volumetric / denial-of-service findings against the public site
- Vulnerabilities in transitive npm dependencies that already have a
  public advisory and a fix in `master`

Thank you for helping keep Agelo safe.
