# Cloudflare deployment

## Pages

Create or configure a Cloudflare Pages project with Git integration:

1. Production branch: `main`.
2. Framework preset: `None`.
3. Root directory: `/`.
4. Install command: `npm ci`.
5. Build command: `npm run build:web:cloudflare`.
6. Build output directory: `apps/web/dist/web/browser`.
7. Node.js compatibility/build variable: `NODE_VERSION=24.15.0`.

The browser output directory was verified from the actual Angular 22 application
build; it is not inferred from a generic Angular default. Preview builds use the
branch environment, and the main branch uses `production`. Cloudflare should not
be asked to deploy the Worker from the Pages project.

The repository also contains a root `wrangler.jsonc` with the verified Pages
output directory for Wrangler-based direct uploads. Cloudflare's native Git
integration does not read build commands from this file, so the settings above
must be entered when connecting the repository.

`APP_API_BASE_URL` may be set to `/api` for same-origin routing or an exact public
HTTPS API URL. If an external API is chosen, update CSP `connect-src` and the
Worker's exact `ALLOWED_ORIGINS`; do not use `*`.

`APP_SITE_URL` should be set only to the verified HTTPS production hostname,
without inventing a fallback domain. For production builds it enables canonical
metadata, generates `sitemap.xml`, and adds the sitemap URL to `robots.txt`.
The build script enforces this environment separation: preview builds ignore
`APP_SITE_URL`, omit the sitemap, and emit `Disallow: /` in `robots.txt`.

The `/contact` form uses runtime-selected submission implementations:

- Local and preview builds use the mock. No request is made, and success is
  simulated rather than delivered.
- Production builds require `APP_CONTACT_ENDPOINT` to be an absolute HTTPS
  contact endpoint on the eventual external API. They generate contact mode
  `http`; a production mock is rejected.
- The build adds only that endpoint's origin to Pages CSP `connect-src`.

`APP_CONTACT_ENDPOINT` is public configuration, not a secret. Do not place an
API token, private key, or credential in it. The endpoint is expected to accept
`POST` JSON and treat HTTP `200` or `201` as success. The response body is not
required by the client. No automatic retry is performed because a repeated POST
could create duplicate messages.

The request contract uses exactly these fields:

| Field       | Required | Validation                                                         |
| ----------- | -------- | ------------------------------------------------------------------ |
| `firstName` | Yes      | Non-whitespace text, maximum 50 characters                         |
| `lastName`  | Yes      | Non-whitespace text, maximum 50 characters                         |
| `email`     | Yes      | Valid email format, maximum 254 characters                         |
| `phone`     | No       | Common phone characters, maximum 30 characters; omitted when empty |
| `message`   | Yes      | Non-whitespace text, maximum 2,000 characters                      |

Required fields are sourced from `REQUIRED_FIELDS`; payload allowlisting is
sourced from `ALLOWED_FIELDS`. Text is trimmed before submission, and frontend-only
properties are never included.

## External contact API integration

The endpoint is not hosted or proxied by this project, and its exact domain is
still pending confirmation. Before enabling production contact delivery:

1. Set `APP_CONTACT_ENDPOINT` to the approved, full HTTPS URL.
2. Configure CORS on the external API for the exact brewery production origin.
   Allow local `http://localhost:4200` only if the real API is intentionally used
   during local development; the default mock needs no CORS configuration.
3. Allow `POST` and `Content-Type` in the external API's preflight policy. Do not
   use wildcard origins with credentials, add credentials, or assume cookie-based
   authentication unless the final API contract requires them.
4. Independently validate the exact required/allowed JSON fields
   (`firstName`, `lastName`, `email`, `phone`, `message`), reject unexpected
   fields, enforce length and format limits, and apply an appropriate request-size
   limit.
5. Configure rate limiting, spam/bot controls, safe monitoring, and personal-data
   retention before launch. Do not log contact request bodies or personal data.

CORS is configured on the external API; it cannot be fixed by Angular and is not
authentication, authorization, or spam prevention. If the future API uses
cookies or authentication, its CSRF and credentialed-CORS requirements need a
separate security review. All browser validation is for usability only and is
not a security boundary.

## Worker

The Worker is an independent deployment:

```powershell
npm run build:api
npx wrangler deploy --config apps/api/wrangler.jsonc
```

The deploy command is documentation only and requires operator approval plus
credentials. Configure `ALLOWED_ORIGINS` and `ENVIRONMENT` for each environment.
Use Worker secrets for secret values.

## Deployment validation

Before promoting a production release:

- Inspect preview build logs and confirm the output directory contains
  `index.html`, `_headers`, `_redirects`, `robots.txt`, and `app-config.json`.
  Production builds with `APP_SITE_URL` must also contain `sitemap.xml`.
- Check CSP, referrer, permissions, content-type, frame, and CORS headers in real
  HTTP responses.
- Verify the SPA fallback, direct route navigation, and local/preview/production
  runtime configuration.
- Confirm HTTPS and certificate health before enabling HSTS.
- Review Cloudflare WAF, rate-limiting, bot controls, DNS, TLS, observability, and
  rollback requirements for the eventual production project.
