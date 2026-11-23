# Baseline validation

Validation date: **2026-11-23**.

The inventory synchronization service was validated with **Node.js 20.20.2** and **npm 10.8.2**, using the dependency versions in package-lock.json. Axios **1.11.0** and Express **5.1.0** are exact direct pins. Known dependency vulnerabilities remain unresolved.

## Reproduce the checks

Run from the repository root with the documented Node.js and npm versions:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run validate
npm run test:coverage
npm ls --all --json
npm audit --json
```

The audit command is observational and currently exits 1 because of known vulnerabilities. Do not use `npm audit fix` to reproduce this dependency snapshot; it changes dependencies. Advisory responses can change over time, so a new audit may differ from the archived output.

To reproduce the startup check, start the supplier and inventory processes as described in the [README](../README.md), list inventory, call `POST /sync`, and check `GET /sync/status`. The three quantities should become `[24, 0, 9]` in inventory order, with state `succeeded`. Stop both processes after the check.

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Clean npm installation | 79 packages; lockfile unchanged | [Summary](evidence/baseline-summary.json) |
| npm run validate | Syntax checks passed; 33 tests passed, 0 failures or skips | [Validation output](evidence/validation.txt) |
| npm run test:coverage | 33 tests passed | [Coverage output](evidence/coverage.txt) |
| Server startup and synchronization | Both entrypoints bound to loopback; synchronization succeeded; processes stopped | [Startup output](evidence/startup-smoke.txt) |
| npm ls --all --json | Exit 0 | [Installed graph](evidence/installed-tree.json) |
| npm audit --json | Exit 1; 1 high-severity affected package with 32 advisory records | [Audit response](evidence/npm-audit.json) |

Tests cover successful inventory retrieval and synchronization, malformed and invalid supplier data, upstream HTTP errors, refused/reset connections, timeouts, mapping integrity, atomic updates, recovery, concurrent attempts, and sanitized error responses.

Coverage is 100% of lines in loaded application modules. Inventory mapping/state has 97.56% branch coverage; other loaded application modules have 100%. The runner's aggregate includes test/support files and excludes unloaded startup entrypoints. Startup was checked separately. Functional validation and coverage do not establish dependency security.

The GitHub Actions workflow performs a clean npm installation and `npm run validate` on pushes and pull requests, with read-only repository permissions. These archived results describe local validation, not a remote workflow run.

## Dependency snapshot

Every installed package version was compared with its lockfile entry. See the [complete dependency inventory](dependencies.md) for all 79 package locations and the [vulnerability register](known-vulnerabilities.md) for advisory IDs, affected ranges, and audit limitations.

Lockfile SHA-256:

```text
d2cdaf03e6dc9a45b2e7ec9ba5ff89a5a318eb84eb5f82dc8635671768713743
```

Node.js 20 is [end-of-life](https://nodejs.org/en/about/eol). The runtime version is documented for reproducibility; npm audit does not assess the runtime or operating system.

