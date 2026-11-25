# Inventory Synchronization Service

A service for maintaining inventory and synchronizing stock with supplier integrations. The application uses JavaScript ES modules, Express for its HTTP API, and Axios to retrieve supplier stock.

The repository includes an inventory API and a separate synthetic supplier service for local development. Inventory is held in memory and initialized from JSON fixtures. Both processes bind to `127.0.0.1`.

## Requirements and installation

- Node.js **24.22.3**, pinned in [.nvmrc](.nvmrc); supported engine range: `>=24 <25`.
- npm **11.19.1**, declared in [package.json](package.json).

Check your versions and install the locked dependencies:

~~~sh
node --version
npm --version
npm ci --ignore-scripts --no-audit --no-fund
~~~

Use `npm ci` to install the exact snapshot in [package-lock.json](package-lock.json). In Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

## Run locally

Start the synthetic supplier in one terminal:

~~~sh
npm run start:supplier
~~~

Start the inventory service in another:

~~~sh
npm start
~~~

| Process | Default address | Port variable |
| --- | --- | --- |
| Inventory Sync Service | `http://127.0.0.1:3000` | `PORT` |
| Synthetic supplier | `http://127.0.0.1:3001` | `SUPPLIER_PORT` |

Optional port variables must be integers from 1 through 65535. When changing `SUPPLIER_PORT`, set the same value in both terminals. The inventory entrypoint always connects to the local supplier; API requests cannot configure upstream URLs. No environment file is loaded automatically.

Stop each process with Ctrl+C. Restarting the inventory service restores fixture data and clears synchronization status.

## API

The inventory API accepts these requests without authentication. `POST /sync` requires no request body.

| Method | Path | Successful response |
| --- | --- | --- |
| GET | `/inventory` | `{ "items": [...] }` |
| GET | `/inventory/:id` | `{ "item": {...} }` |
| POST | `/sync` | `{ "updatedCount": 3, "synchronizedAt": "<ISO timestamp>" }` |
| GET | `/sync/status` | `state`, `lastAttemptAt`, `lastSuccessAt`, `lastErrorCode` |

The separate synthetic supplier exposes `GET /stock` on its own port.

~~~sh
curl http://127.0.0.1:3000/inventory
curl http://127.0.0.1:3000/inventory/inv-001
curl -X POST http://127.0.0.1:3000/sync
curl http://127.0.0.1:3000/sync/status
~~~

Use `curl.exe` in Windows PowerShell to avoid its legacy `curl` alias.

## Synchronization behavior

The fixtures contain three inventory items and two suppliers. Synchronization retrieves a complete supplier snapshot and matches records by supplier ID and SKU. It updates quantities and integer costs in cents while preserving item IDs, names, supplier associations, and inventory order. With the supplied fixtures, quantities change from `[12, 30, 4]` to `[24, 0, 9]`, and costs become `[310, 80, 1100]` cents.

Snapshot validation rejects missing or duplicate mappings, unknown suppliers or SKUs, malformed responses, negative numbers, fractional numbers, and unsafe integers. Zero stock is valid. Updates are atomic: a failed attempt preserves inventory and the previous successful synchronization timestamp. A later successful attempt clears the failure code.

Synchronization states are `idle`, `syncing`, `succeeded`, and `failed`. Timestamp fields begin as `null`; populated timestamps use ISO format. The supplier request timeout is 1,500 ms. Overlapping synchronization returns HTTP 409 while the active attempt continues.

| HTTP status | Error code | Meaning |
| --- | --- | --- |
| 404 | `NOT_FOUND` | Unknown item or route |
| 409 | `SYNC_IN_PROGRESS` | Another synchronization is active |
| 502 | `SUPPLIER_INVALID_RESPONSE` | Supplier data fails validation |
| 502 | `SUPPLIER_UNAVAILABLE` | Supplier HTTP or connection failure |
| 504 | `SUPPLIER_TIMEOUT` | Supplier request timed out |
| 500 | `INTERNAL_ERROR` | Unexpected application error |

Errors have the shape `{ "error": { "code": "...", "message": "..." } }`. Public responses omit raw exceptions, upstream bodies, request configuration, and stack traces.

## Development and validation

| Command | Purpose |
| --- | --- |
| `npm run check` | Check JavaScript syntax in source, tests, helpers, and scripts |
| `npm test` | Run unit and integration tests with Node's test runner |
| `npm run validate` | Run syntax checks and tests |
| `npm run test:coverage` | Run tests with Node's coverage reporting |
| `npm ls --all --json` | Inspect the installed dependency graph |
| `npm audit --json` | Query current dependency advisories |

Tests exercise real loopback HTTP and Axios requests, mapping integrity, invalid payloads, upstream failures, timeouts, recovery, atomic updates, concurrency, safe errors, and direct supplier requests without environment proxies. Test servers use ephemeral ports and close after each test.

The November 25, 2026 validation passed **34 tests with zero failures** on Node.js 24.22.3 and npm 11.19.1. See [validation results and reproduction steps](docs/validation.md). Coverage measures loaded modules; startup entrypoints are checked separately. GitHub Actions installs the pinned toolchain and runs `npm run validate` on pushes and pull requests with read-only repository permissions.

## Dependencies and security maintenance

The direct dependencies are Axios **1.20.0** and Express **5.1.0**. The existing lockfile is the authoritative snapshot. The November 25, 2026 npm audit returned **zero reported vulnerabilities**; this is a dated advisory-database observation, not a security guarantee.

The [dependency inventory](docs/dependencies.md) describes the current graph. The [security maintenance record](docs/known-vulnerabilities.md) distinguishes the current audit from historical Axios 1.11.0 findings. Earlier captures remain in the [evidence directory](docs/evidence/README.md). Use `npm audit --json` to refresh advisory information; `npm audit fix` changes the dependency snapshot.

## Repository structure

~~~text
src/
  app.js, server.js          inventory application factory and entrypoint
  routes/                   inventory and synchronization HTTP routes
  supplier-client.js        Axios supplier communication and error mapping
  inventory.js              stock mapping, atomic store, synchronization state
  errors.js, fixtures.js    public errors and fixture loading
  runtime.js                local startup and port configuration
  mock-supplier/            synthetic supplier application and entrypoint
fixtures/                   inventory, supplier, and stock JSON data
test/unit/                  mapping, state, and integrity tests
test/integration/           HTTP, Axios, and failure handling tests
support/                    test HTTP helpers
scripts/                    JavaScript syntax validation
.github/workflows/          functional CI validation
docs/                       dependency, validation, and security records
  evidence/                 historical and dated validation output
~~~

## Operational scope

This baseline has no persistent database, authentication, background synchronization, or external supplier configuration. Each process owns its in-memory state; multiple inventory processes do not share data or synchronization locks. The standalone supplier always serves its successful synthetic fixture; failure scenarios are exercised in automated tests. Deployment beyond local development requires appropriate persistence, access controls, and operational configuration.
