# Baseline validation

Validated **November 25, 2026** with Node.js **24.22.3** and npm **11.19.1**, using the existing dependency lockfile. Direct dependencies are Axios **1.20.0** and Express **5.1.0**.

## Reproduce the checks

Run from the repository root with the versions declared in `.nvmrc` and `package.json`:

~~~sh
node --version
npm --version
npm ci --ignore-scripts --no-audit --no-fund
npm run validate
npm run test:coverage
npm ls --all --json
npm audit --json
~~~

In Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`. The local audit initially failed certificate verification. Retrying with Node's system CA store succeeded, with TLS verification enabled. If your environment requires the system trust store, append `--use-system-ca` to `NODE_OPTIONS` for the audit process. For example, in PowerShell:

~~~powershell
$previousNodeOptions = $env:NODE_OPTIONS
try {
    $env:NODE_OPTIONS = "$previousNodeOptions --use-system-ca".Trim()
    npm.cmd audit --json
} finally {
    $env:NODE_OPTIONS = $previousNodeOptions
}
~~~

No certificate settings or npm configuration were changed in the repository. A failed registry request is an unavailable audit result, not a clean security report. Audit responses can change as the advisory database changes. `npm audit fix` changes dependency versions and is not part of reproducing this snapshot.

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Clean installation | Exit 0; 81 packages; lockfile unchanged | [Installation output](evidence/2026-11-25/clean-install.txt) |
| `npm run validate` | Syntax checks passed; 34 tests passed, zero failures or skips | [Validation output](evidence/2026-11-25/validation.txt) |
| `npm run test:coverage` | 34 tests passed; loaded application modules have 100% line coverage | [Coverage output](evidence/2026-11-25/coverage.txt) |
| Startup and synchronization | Both CLI entrypoints bound to loopback; synchronization succeeded; child processes stopped | [Startup output](evidence/2026-11-25/startup-smoke.txt) |
| `npm ls --all --json` | Exit 0; installed versions match all 81 lockfile package locations | [Installed graph](evidence/2026-11-25/installed-tree.json) |
| `npm audit --json` with system CA store | Exit 0; zero reported vulnerabilities | [Audit response](evidence/2026-11-25/npm-audit.json) |

The [machine-readable summary](evidence/2026-11-25/baseline-summary.json) records toolchain versions, the lockfile hash, and check results. These are local results; no remote GitHub Actions run is asserted.

## Behavior and coverage

Tests cover inventory retrieval, synchronization, malformed and invalid supplier data, upstream HTTP errors, refused/reset connections, timeouts, mapping integrity, atomic updates, recovery, overlapping attempts, sanitized errors, and bypassing environment HTTP proxies for the local supplier.

Coverage reports 100% of lines in loaded application modules. Inventory mapping/state has 97.56% branch coverage; other loaded application modules have 100%. The aggregate also includes the HTTP test helper. Unloaded startup entrypoints and `runtime.js` are excluded from this coverage report; startup success was checked separately. Functional tests and coverage do not establish dependency security.

To repeat the startup check manually, start both processes as described in the [README](../README.md), list inventory, call `POST /sync`, and inspect `GET /sync/status`. Quantities should become `[24, 0, 9]`, costs `[310, 80, 1100]` cents, and state `succeeded`. Stop both processes afterward.

GitHub Actions reads the Node version from `.nvmrc`, installs npm 11.19.1, performs a clean dependency installation, and runs `npm run validate` with read-only repository permissions.

## Historical evidence

The original November 23, 2026 results describe Node 20.20.2, npm 10.8.2, Axios 1.11.0, 79 package locations, and 33 tests. They are retained separately from current results. See the [evidence index](evidence/README.md) and [dependency security maintenance history](known-vulnerabilities.md).

