# Inventory Synchronization Service

A small internal service for maintaining inventory and synchronizing stock with a supplier integration. Express provides the HTTP API, and Axios retrieves supplier stock.

The repository includes synthetic inventory and supplier fixtures and a local mock supplier for development and testing. Both processes bind to 127.0.0.1. Inventory is stored in memory; there is no database or authentication.

## Setup

Use **Node.js 20.20.2** and **npm 10.8.2**. Node 20 is now [end-of-life](https://nodejs.org/en/about/eol); this version is documented for reproducibility and is not recommended for production.

```sh
node --version
npm --version
npm ci --ignore-scripts
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`. The lockfile is part of the baseline: use `npm ci`, which installs its exact versions.

Start the supplier in one terminal:

```sh
npm run start:supplier
```

Start the inventory service in another:

```sh
npm start
```

Defaults: inventory at `http://127.0.0.1:3000`, supplier at `http://127.0.0.1:3001`. Optional environment variables `PORT` and `SUPPLIER_PORT` accept integers 1–65535. If changing the supplier port, set the same value in both terminals. There are no external supplier URLs to configure.

## API and behavior

| Method | Path | Result |
| --- | --- | --- |
| GET | /inventory | `{ items: [...] }` containing the current snapshot |
| GET | /inventory/:id | `{ item: {...} }`; unknown IDs return 404 |
| POST | /sync | Synchronize all inventory; return updatedCount and synchronizedAt |
| GET | /sync/status | state, lastAttemptAt, lastSuccessAt, lastErrorCode |
| GET | supplier /stock | Synthetic upstream stock snapshot |

```sh
curl http://127.0.0.1:3000/inventory
curl -X POST http://127.0.0.1:3000/sync
curl http://127.0.0.1:3000/inventory/inv-001
curl http://127.0.0.1:3000/sync/status
```

Use `curl.exe` in Windows PowerShell to avoid its legacy `curl` alias.

The inventory starts with three items and two suppliers. Synchronization calls the local supplier through Axios, joins records by supplier ID and SKU, and updates quantities and integer costs in cents. Stable IDs, names, and supplier associations remain intact. The supplier snapshot arrives in a different order and contains zero stock for one item.

A complete, valid snapshot is required: missing records, duplicates, unknown mappings, malformed responses, negative values, fractional values, and unsafe integers fail validation. Updates are atomic. A failed attempt retains inventory and the last successful synchronization timestamp; a later successful attempt clears the failure code. Simultaneous attempts return 409 while the active attempt completes.

Synchronization states are `idle`, `syncing`, `succeeded`, and `failed`. The upstream timeout is 1,500 ms. Failures return:

- 502 / SUPPLIER_INVALID_RESPONSE for invalid supplier data.
- 502 / SUPPLIER_UNAVAILABLE for HTTP failures or connection problems.
- 504 / SUPPLIER_TIMEOUT for a timeout.
- 409 / SYNC_IN_PROGRESS for an overlapping attempt.
- 404 / NOT_FOUND for an unknown resource.
- 500 / INTERNAL_ERROR for an unexpected exception.

Error bodies have the shape `{ error: { code, message } }`. Raw exceptions, upstream bodies, request configuration, and stack traces are not returned.

Inventory is in memory. Restarting the inventory process restores its fixtures. There is no background synchronization. The standalone mock always serves its successful fixture; failure scenarios exist only inside the automated tests.

## Validation

```sh
npm test
npm run validate
npm run test:coverage
npm ls --all
npm audit --json
```

`validate` runs JavaScript syntax checks and unit/integration tests. The tests use real loopback HTTP and Axios requests, including malformed data, connection refusal/reset, upstream HTTP errors, timeouts, recovery, atomicity, and safe errors. Test instances use ephemeral ports and close their servers.

The documented validation run passed **33 tests** under Node 20.20.2. See [validation evidence](docs/evidence/validation.txt) and [coverage evidence](docs/evidence/coverage.txt). Node 20's coverage option is experimental and reports loaded files; the startup entrypoints are checked separately by a [CLI smoke test](docs/evidence/startup-smoke.txt).

`npm audit` currently exits 1 for unresolved vulnerabilities. Audit results are tracked separately from functional CI. Use the existing lockfile to reproduce the dependency snapshot; `npm audit fix` changes dependencies.

## Structure

```text
src/
  app.js, server.js          application factory and local entrypoint
  routes/                   inventory and synchronization HTTP routes
  supplier-client.js        Axios upstream communication and error mapping
  inventory.js              mapping, atomic store, synchronization state
  errors.js, fixtures.js    public errors and fixture loading
  runtime.js                local startup and port configuration
  mock-supplier/            standalone synthetic supplier
fixtures/                   inventory, suppliers, supplier stock
test/unit/                  mapping, validation, state and integrity
test/integration/           real HTTP/Axios behavior and failure handling
support/                    test HTTP helpers
scripts/                    syntax validation
.github/workflows/          functional validation
docs/                       validation, dependencies, findings and evidence
```

## Dependency security maintenance

Axios **1.11.0** is affected by [GHSA-4hjh-wcwx-xvwj / CVE-2025-58754](https://github.com/advisories/GHSA-4hjh-wcwx-xvwj), which covers unbounded in-memory decoding of data URIs in the Node adapter. The advisory affects Axios `>=1.0.0 <1.12.0` and `>=0.28.0 <0.30.2`. The dependency remains affected.

Additional findings are listed in [known vulnerabilities](docs/known-vulnerabilities.md). The [dependency inventory](docs/dependencies.md), [lockfile](package-lock.json), and [audit response](docs/evidence/npm-audit.json) document the current snapshot. The resolved graph excludes known compromised Axios 1.14.1/0.30.4 and Debug 4.4.2 releases.

The application uses a local supplier integration and accepts no supplier URLs from API requests. Payload validation and error handling support application correctness; they do not resolve dependency vulnerabilities.

The GitHub Actions workflow runs functional validation with read-only repository permissions. Dependency auditing is separate from these checks; no automated dependency-update configuration is included in this repository.

See [baseline validation](docs/validation.md) for reproducible commands, results, and coverage limitations.
