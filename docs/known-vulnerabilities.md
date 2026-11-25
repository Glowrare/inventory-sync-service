# Dependency security maintenance

## Current dependency snapshot

The current lockfile pins Axios **1.20.0** and Express **5.1.0**. On **November 25, 2026**, npm **11.19.1** returned exit code **0** with **zero reported vulnerabilities** for this graph. See the [dated audit response](evidence/2026-11-25/npm-audit.json) and [dependency inventory](dependencies.md).

The initial audit request failed certificate verification. A retry using Node's system CA store succeeded without disabling TLS verification. [Validation documentation](validation.md) describes how to reproduce the check.

This result is limited to the advisory database response at that time. It does not establish the absence of vulnerabilities or assess application logic, runtime binaries, operating system packages, or CI actions. Refresh the audit when reviewing dependency security.

## Historical Axios findings

The retained **November 23, 2026** [audit response](evidence/npm-audit.json) describes the earlier Axios **1.11.0** snapshot. It reported one affected package at high aggregate severity with 32 advisory records. These observations describe that historical graph and do not describe the installed Axios 1.20.0 baseline.

The captured records include GHSA-4hjh-wcwx-xvwj, concerning data-URI decoding in the Axios Node adapter. The historical response records an affected range of `>=1.0.0 <1.12.0` for that issue. All original advisory IDs, reported ranges, severities, and suggested updates remain in the raw JSON for traceability. Captured advisory ranges may change in later database responses.

Dependency maintenance subsequently updated Axios to 1.20.0 in commit `5c0663b`, merged into `5092f8a`. The current baseline preserves that dependency graph.

## Ongoing maintenance

Use `npm audit --json` to query current advisories and assess findings in the context of the application's supplier integration. Keep dated results distinct from historical captures. Loopback supplier configuration, payload validation, and sanitized errors support application correctness but do not substitute for dependency maintenance.

Review dependency updates separately, including lockfile changes and functional validation. `npm audit fix` mutates the dependency graph. The current functional CI workflow runs syntax checks and tests; it does not run a dependency audit.
