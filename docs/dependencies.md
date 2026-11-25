# Dependency inventory

Validated **November 25, 2026** with Node.js **24.22.3**, npm **11.19.1**, and npm lockfile version **3**.

- Direct dependencies: Axios **1.20.0** and Express **5.1.0**, both exact pins.
- **81** locked package locations; no development dependencies.
- A clean `npm ci --ignore-scripts --no-audit --no-fund` completed without changing the lockfile.
- Every installed package version matches its lockfile entry. All dependency entries retain integrity hashes.
- All non-root lockfile entries are identical to commit `5092f8a`, including versions, resolved URLs, integrity values, and dependency relationships.

The only lockfile changes from that commit are the root package name and Node engine range. Application version **0.1.0** is preserved. No application dependency was added, removed, or updated during this maintenance.

Lockfile SHA-256:

~~~text
ef0ab35672ee73604a73bb44c8c92aeb2041dc2b0b9757906dabe566bf931799
~~~

The table lists package locations so nested versions remain distinguishable. See the [installed dependency graph](evidence/2026-11-25/installed-tree.json), [validation summary](evidence/2026-11-25/baseline-summary.json), and [security maintenance record](known-vulnerabilities.md).

| Locked package location | Exact version |
| --- | --- |
| `node_modules/accepts` | 2.0.0 |
| `node_modules/agent-base` | 6.0.2 |
| `node_modules/asynckit` | 0.4.0 |
| `node_modules/axios` | 1.20.0 |
| `node_modules/body-parser` | 2.4.0 |
| `node_modules/body-parser/node_modules/content-type` | 2.1.0 |
| `node_modules/bytes` | 3.1.2 |
| `node_modules/call-bind-apply-helpers` | 1.0.2 |
| `node_modules/call-bound` | 1.0.4 |
| `node_modules/combined-stream` | 1.0.8 |
| `node_modules/content-disposition` | 1.1.0 |
| `node_modules/content-type` | 1.0.5 |
| `node_modules/cookie` | 0.7.2 |
| `node_modules/cookie-signature` | 1.2.2 |
| `node_modules/debug` | 4.4.3 |
| `node_modules/delayed-stream` | 1.0.0 |
| `node_modules/depd` | 2.0.0 |
| `node_modules/dunder-proto` | 1.0.1 |
| `node_modules/ee-first` | 1.1.1 |
| `node_modules/encodeurl` | 2.0.3 |
| `node_modules/es-define-property` | 1.0.1 |
| `node_modules/es-errors` | 1.3.0 |
| `node_modules/es-object-atoms` | 1.1.2 |
| `node_modules/es-set-tostringtag` | 2.1.0 |
| `node_modules/escape-html` | 1.0.3 |
| `node_modules/etag` | 1.8.1 |
| `node_modules/express` | 5.1.0 |
| `node_modules/finalhandler` | 2.1.1 |
| `node_modules/follow-redirects` | 1.16.3 |
| `node_modules/form-data` | 4.0.6 |
| `node_modules/form-data/node_modules/mime-db` | 1.52.0 |
| `node_modules/form-data/node_modules/mime-types` | 2.1.35 |
| `node_modules/forwarded` | 0.2.0 |
| `node_modules/fresh` | 2.0.0 |
| `node_modules/function-bind` | 1.1.2 |
| `node_modules/get-intrinsic` | 1.3.0 |
| `node_modules/get-proto` | 1.0.1 |
| `node_modules/gopd` | 1.2.0 |
| `node_modules/has-symbols` | 1.1.0 |
| `node_modules/has-tostringtag` | 1.0.2 |
| `node_modules/hasown` | 2.0.4 |
| `node_modules/http-errors` | 2.0.1 |
| `node_modules/https-proxy-agent` | 5.0.1 |
| `node_modules/iconv-lite` | 0.7.3 |
| `node_modules/inherits` | 2.0.4 |
| `node_modules/ipaddr.js` | 1.9.1 |
| `node_modules/is-promise` | 4.0.0 |
| `node_modules/math-intrinsics` | 1.1.0 |
| `node_modules/media-typer` | 1.1.1 |
| `node_modules/merge-descriptors` | 2.0.0 |
| `node_modules/mime-db` | 1.54.0 |
| `node_modules/mime-types` | 3.0.2 |
| `node_modules/ms` | 2.1.3 |
| `node_modules/negotiator` | 1.1.0 |
| `node_modules/negotiator/node_modules/content-type` | 2.1.0 |
| `node_modules/object-inspect` | 1.14.0 |
| `node_modules/on-finished` | 2.4.2 |
| `node_modules/once` | 1.4.0 |
| `node_modules/parseurl` | 1.3.3 |
| `node_modules/path-to-regexp` | 8.4.2 |
| `node_modules/proxy-addr` | 2.0.8 |
| `node_modules/proxy-from-env` | 2.1.0 |
| `node_modules/qs` | 6.17.1 |
| `node_modules/range-parser` | 1.3.0 |
| `node_modules/raw-body` | 3.0.2 |
| `node_modules/router` | 2.3.0 |
| `node_modules/safer-buffer` | 2.1.2 |
| `node_modules/send` | 1.2.1 |
| `node_modules/serve-static` | 2.2.1 |
| `node_modules/setprototypeof` | 1.2.0 |
| `node_modules/side-channel` | 1.1.1 |
| `node_modules/side-channel-list` | 1.0.1 |
| `node_modules/side-channel-map` | 1.0.1 |
| `node_modules/side-channel-weakmap` | 1.0.2 |
| `node_modules/statuses` | 2.0.2 |
| `node_modules/toidentifier` | 1.0.1 |
| `node_modules/type-is` | 2.1.0 |
| `node_modules/type-is/node_modules/content-type` | 2.1.0 |
| `node_modules/unpipe` | 1.0.0 |
| `node_modules/vary` | 1.1.2 |
| `node_modules/wrappy` | 1.0.2 |

## Historical snapshot

The [November 23, 2026 summary](evidence/baseline-summary.json) and [historical installed graph](evidence/installed-tree.json) describe the earlier Axios 1.11.0 baseline with 79 package locations, Node 20.20.2, and npm 10.8.2. They are retained for traceability and do not describe the current installation.
