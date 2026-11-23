# Known dependency vulnerabilities

Observed 2026-11-23 with npm 10.8.2 against the installed lockfile. npm audit exited **1**: **1 affected package**, at high aggregate severity, with **32 distinct advisory records**. These are package/advisory observations, not proof that each issue is reachable through this application.

All reported records affect Axios 1.11.0, the current direct dependency pin. npm audit reported no additional affected packages in this graph. This observation is limited to the database response at audit time.

## Axios data URI denial of service

[GHSA-4hjh-wcwx-xvwj / CVE-2025-58754](https://github.com/advisories/GHSA-4hjh-wcwx-xvwj) concerns unbounded data-URI decoding in the Node adapter. Affected ranges: >=1.0.0 <1.12.0 and >=0.28.0 <0.30.2. The advisory lists 1.12.0 and 0.30.2 as patched versions for this specific issue; those historical versions do not resolve all later advisories.

Axios remains at 1.11.0 and dependency security maintenance is outstanding. The local supplier integration and payload validation do not resolve the dependency vulnerabilities.

## All advisory records returned by npm audit

Ranges below are the npm audit affected ranges relevant to this installed Axios major. The primary advisory links may include other affected release lines. The [raw audit JSON](evidence/npm-audit.json) includes suggested updates; those suggestions have not been applied.

| Advisory | Severity | Affected range reported | Description |
| --- | --- | --- | --- |
| [GHSA-4hjh-wcwx-xvwj](https://github.com/advisories/GHSA-4hjh-wcwx-xvwj) | high | >=1.0.0 <1.12.0 | Axios is vulnerable to DoS attack through lack of data size check |
| [GHSA-3p68-rc4w-qgx5](https://github.com/advisories/GHSA-3p68-rc4w-qgx5) | moderate | >=1.0.0 <1.15.0 | Axios has a NO_PROXY Hostname Normalization Bypass that Leads to SSRF |
| [GHSA-w9j2-pvgh-6h63](https://github.com/advisories/GHSA-w9j2-pvgh-6h63) | moderate | >=1.0.0 <1.15.1 | Axios: Authentication Bypass via Prototype Pollution Gadget in `validateStatus` Merge Strategy |
| [GHSA-pmwg-cvhr-8vh7](https://github.com/advisories/GHSA-pmwg-cvhr-8vh7) | high | >=1.0.0 <1.15.1 | Axios: Incomplete Fix for CVE-2025-62718 — NO_PROXY Protection Bypassed via RFC 1122 Loopback Subnet (127.0.0.0/8) in Axios 1.15.0 |
| [GHSA-3w6x-2g7m-8v23](https://github.com/advisories/GHSA-3w6x-2g7m-8v23) | moderate | >=1.0.0 <1.15.2 | Axios: Invisible JSON Response Tampering via Prototype Pollution Gadget in `parseReviver` |
| [GHSA-xhjh-pmcv-23jw](https://github.com/advisories/GHSA-xhjh-pmcv-23jw) | low | >=1.0.0 <1.15.1 | Axios: Null Byte Injection via Reverse-Encoding in AxiosURLSearchParams |
| [GHSA-445q-vr5w-6q77](https://github.com/advisories/GHSA-445q-vr5w-6q77) | moderate | >=1.0.0 <1.15.1 | Axios: CRLF Injection in multipart/form-data body via unsanitized blob.type in formDataToStream |
| [GHSA-m7pr-hjqh-92cm](https://github.com/advisories/GHSA-m7pr-hjqh-92cm) | moderate | >=1.0.0 <1.15.1 | Axios: no_proxy bypass via IP alias allows SSRF |
| [GHSA-5c9x-8gcm-mpgx](https://github.com/advisories/GHSA-5c9x-8gcm-mpgx) | moderate | >=1.0.0 <1.15.1 | Axios' HTTP adapter-streamed uploads bypass maxBodyLength when maxRedirects: 0 |
| [GHSA-vf2m-468p-8v99](https://github.com/advisories/GHSA-vf2m-468p-8v99) | moderate | >=1.0.0 <1.15.1 | Axios: HTTP adapter streamed responses bypass maxContentLength |
| [GHSA-pf86-5x62-jrwf](https://github.com/advisories/GHSA-pf86-5x62-jrwf) | high | >=1.0.0 <1.15.1 | Axios: Prototype Pollution Gadgets - Response Tampering, Data Exfiltration, and Request Hijacking |
| [GHSA-6chq-wfr3-2hj9](https://github.com/advisories/GHSA-6chq-wfr3-2hj9) | high | >=1.0.0 <1.15.1 | Axios: Header Injection via Prototype Pollution |
| [GHSA-xx6v-rp6x-q39c](https://github.com/advisories/GHSA-xx6v-rp6x-q39c) | moderate | >=1.0.0 <1.15.1 | Axios: XSRF Token Cross-Origin Leakage via Prototype Pollution Gadget in `withXSRFToken` Boolean Coercion |
| [GHSA-43fc-jf86-j433](https://github.com/advisories/GHSA-43fc-jf86-j433) | high | >=1.0.0 <=1.13.4 | Axios is Vulnerable to Denial of Service via __proto__ Key in mergeConfig |
| [GHSA-q8qp-cvcw-x6jj](https://github.com/advisories/GHSA-q8qp-cvcw-x6jj) | high | >=1.0.0 <1.15.2 | Axios has prototype pollution read-side gadgets in HTTP adapter that allow credential injection and request hijacking |
| [GHSA-fvcv-3m26-pcqx](https://github.com/advisories/GHSA-fvcv-3m26-pcqx) | moderate | >=1.0.0 <1.15.0 | Axios has Unrestricted Cloud Metadata Exfiltration via Header Injection Chain |
| [GHSA-62hf-57xw-28j9](https://github.com/advisories/GHSA-62hf-57xw-28j9) | moderate | >=1.0.0 <1.15.1 | Axios: unbounded recursion in toFormData causes DoS via deeply nested request data |
| [GHSA-hfxv-24rg-xrqf](https://github.com/advisories/GHSA-hfxv-24rg-xrqf) | high | >=1.0.0 <1.16.0 | Axios: Regular Expression Denial of Service (ReDoS) via Cookie Name Injection |
| [GHSA-777c-7fjr-54vf](https://github.com/advisories/GHSA-777c-7fjr-54vf) | high | >=1.7.0 <1.16.0 | Allocation of Resources Without Limits or Throttling in Axios |
| [GHSA-p92q-9vqr-4j8v](https://github.com/advisories/GHSA-p92q-9vqr-4j8v) | high | >=1.0.0 <1.16.0 | Axios: Proxy-Authorization Credential Leak to Origin Server Across HTTP-to-HTTPS Redirect in Axios Node.js HTTP Adapter |
| [GHSA-j5f8-grm9-p9fc](https://github.com/advisories/GHSA-j5f8-grm9-p9fc) | high | >=1.0.0 <1.16.0 | Axios: Proxy-Authorization header leaks to redirect target when proxy is re-evaluated to direct connection |
| [GHSA-3g43-6gmg-66jw](https://github.com/advisories/GHSA-3g43-6gmg-66jw) | high | >=1.0.0 <1.15.2 | axios Vulnerable to Credential Theft and Response Hijacking via Prototype Pollution Gadget in Config Merge |
| [GHSA-35jp-ww65-95wh](https://github.com/advisories/GHSA-35jp-ww65-95wh) | high | >=1.0.0 <1.16.0 | axios Vulnerable to Full Man-in-the-Middle via Prototype Pollution Gadget in `config.proxy` |
| [GHSA-898c-q2cr-xwhg](https://github.com/advisories/GHSA-898c-q2cr-xwhg) | moderate | >=1.0.0 <1.16.0 | axios has DoS & Header Injection via Prototype Pollution Read-Side Gadgets in axios merge functions |
| [GHSA-mmx7-hfxf-jppx](https://github.com/advisories/GHSA-mmx7-hfxf-jppx) | moderate | >=1.0.0 <1.18.0 | Axios: Prototype pollution gadgets can alter axios request construction |
| [GHSA-pmv8-rq9r-6j72](https://github.com/advisories/GHSA-pmv8-rq9r-6j72) | moderate | >=1.0.0 <1.18.0 | Axios: Deep formToJSON Key Recursion Can Cause Denial of Service |
| [GHSA-7q8q-rj6j-mhjq](https://github.com/advisories/GHSA-7q8q-rj6j-mhjq) | moderate | >=1.0.0 <1.18.0 | Axios: Nested axios option objects can consume polluted prototype values |
| [GHSA-jqh4-m9w3-8hp9](https://github.com/advisories/GHSA-jqh4-m9w3-8hp9) | moderate | >=1.7.0 <1.18.0 | Axios: Fetch adapter `ReadableStream` uploads bypass `maxBodyLength` |
| [GHSA-42h9-826w-cgv3](https://github.com/advisories/GHSA-42h9-826w-cgv3) | moderate | >=1.0.0 <1.18.0 | Axios: Excessive recursion in formDataToJSON can cause denial of service |
| [GHSA-vh66-26gq-q6x8](https://github.com/advisories/GHSA-vh66-26gq-q6x8) | moderate | >=1.7.0 <1.20.0 | Axios: Prototype pollution gadget in fetch adapter can alter outbound requests |
| [GHSA-9fr6-4gfg-395g](https://github.com/advisories/GHSA-9fr6-4gfg-395g) | moderate | >=1.0.0 <1.20.0 | Axios: Prototype-Pollution Gadget in the Default Instance Allows Inherited Object.prototype.method to Override HTTP Method |
| [GHSA-j8rh-479h-cp32](https://github.com/advisories/GHSA-j8rh-479h-cp32) | moderate | >=1.0.0 <1.20.0 | Axios: Header Injection via Inherited headers After Minimal Interceptor |

## Compromised versions excluded

- [GHSA-fw8c-xr5c-95f9](https://github.com/advisories/GHSA-fw8c-xr5c-95f9): malicious Axios 1.14.1 and 0.30.4 are absent; installed Axios is 1.11.0.
- [GHSA-4x49-vf9v-38px](https://github.com/debug-js/debug/security/advisories/GHSA-4x49-vf9v-38px): compromised Debug 4.4.2 is absent; installed Debug is 4.4.3.
- The malicious plain-crypto-js package is absent. No dependency has an install lifecycle script in the generated lockfile; installation used --ignore-scripts.

The graph was inspected and audited before package installation. No known malicious package version was selected. This is a point-in-time check, not a guarantee about future advisories.

## Runtime constraint

The documented runtime, Node 20, is [end-of-life](https://nodejs.org/en/about/eol). npm audit covers the npm graph, not the runtime, operating system, or GitHub Actions dependencies.
