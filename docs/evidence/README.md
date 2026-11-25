# Validation evidence

## Current baseline

[2026-11-25/](2026-11-25/) contains the Node.js 24.22.3 and npm 11.19.1 validation results for the current lockfile, including Axios 1.20.0, Express 5.1.0, and 34 passing tests. Start with the [summary](2026-11-25/baseline-summary.json) or [validation guide](../validation.md).

## Historical captures

Files directly in this directory predate the current validation and describe the November 23, 2026 baseline:

- `baseline-summary.json`: Node 20.20.2, npm 10.8.2, Axios 1.11.0, 79 package locations, and 33 passing tests.
- `validation.txt` and `coverage.txt`: the earlier 33-test runs.
- `installed-tree.json`: the earlier dependency graph with Axios 1.11.0.
- `npm-audit.json`: the earlier Axios findings, including full advisory records.
- `startup-smoke.txt`: the earlier Node 20 startup check.

These captures are retained as historical evidence and are not refreshed in place. Package-name labels were normalized separately in `validation.txt`, `coverage.txt`, and `installed-tree.json`; their test results and dependency versions still describe the earlier baseline. Use the dated subdirectory for current results.
