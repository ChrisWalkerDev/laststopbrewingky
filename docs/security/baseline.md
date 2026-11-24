# Security baseline

## Trust boundaries

The browser, URL, local/device storage, API responses, request bodies, and Worker
bindings are untrusted boundaries. Browser-side validation improves UX but never
authorizes or validates for the server.

## Current controls

- Strict TypeScript and Angular templates.
- Sanitized Angular templates; no bypass APIs or unsafe DOM HTML.
- Runtime validation of public browser configuration before bootstrap.
- Centralized, non-sensitive HTTP errors.
- CSP with no inline scripts, a same-origin `connect-src`, `base-uri 'self'`,
  `object-src 'none'`, and `frame-ancestors 'none'`.
- `nosniff`, frame, referrer, permissions, and fingerprinted asset cache headers.
- Exact-origin, non-credentialed Worker CORS. Preflight does not reflect arbitrary
  origins. CORS is not authorization.
- Contact form payloads are built from an explicit five-field allowlist, trimmed
  before submission, and sent without credentials. Local and preview modes use
  a deterministic mock. Production builds require an external HTTPS endpoint
  and add its origin to Pages CSP; the production mock configuration is rejected.
- API responses use `application/json`, `Cache-Control: no-store`, and
  RFC 9457-shaped errors.
- No secrets or privileged tokens are used by the client or committed.
- npm audit, lint, architecture, tests, and build checks in CI.
- Menu allergen guidance, brewery history, beer specifications, and remaining
  unpublished factual claims stay as placeholders until approved. This avoids
  presenting invented or safety-sensitive information as verified.
- Canonical and sitemap generation requires an explicitly configured HTTPS
  production hostname, preventing accidental indexing under guessed URLs.

The Pages CSP currently permits inline styles because Angular Material and dynamic
component styling may emit them. It does not permit inline scripts. Test any
future style/CSP tightening in a preview before removal.

## Authentication and CSRF

No authentication provider is selected. Future protected endpoints must enforce
authentication and authorization in the Worker. If cookie credentials are later
used, select a provider, use an appropriate `SameSite` policy, validate origins
for state-changing requests, add deliberate anti-CSRF controls, and configure
credentialed CORS with exact origins. Never place access or refresh tokens in
frontend configuration.

## Remaining production decisions

- Enable HSTS only after HTTPS is stable on the final hostname. Audit
  `includeSubDomains` and preload consequences before using them.
- Configure Cloudflare WAF, managed rules, rate limiting, bot controls, DNS proxy
  behavior, TLS, logging retention, and alerting in the account.
- Add runtime schemas at each Worker input boundary before accepting request data.
- Set request limits and timeout policies for future routes.
- Define redaction and observability standards before logging application events.
- Review CSP report-only violations in preview when integrations are added.
- Confirm the external contact API validates required and allowed fields,
  rejects unexpected fields, enforces request limits, applies rate limiting and
  spam controls, and does not log submitted personal data.
- Keep preview deployments non-indexable or explicitly isolate their robots and
  canonical strategy before connecting a production domain.

## Vulnerability response

Do not suppress a failing security control to pass CI. Triage high/critical
dependency results, rotate any exposed credential, update affected dependencies,
and add a regression test at the affected trust boundary.
