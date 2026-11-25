# Last Stop Brewing KY

Production-oriented Angular 22 and Cloudflare marketing website foundation. The
site includes Home, Beers, Food & Menu, About Us, Visit Us, and Contact Us features. Brewery
photography, history, menu items, beer records, and remaining unpublished
details are explicitly marked as placeholders until verified content is
supplied. Events are outside the approved initial scope.

## Architecture

```text
apps/
  web/              Angular 22 standalone application
  api/              Cloudflare Worker API runtime
libs/
  contracts/        Shared, transport-only TypeScript contracts
infrastructure/
  cloudflare/       Deployment guidance and production controls
docs/
  architecture/     Architecture and decision records
  implementation/   Local development and quality workflows
  security/         Threat model and security decisions
```

Features are lazy-loaded and own their route-level presentation. Reusable
content contracts and neutral infrastructure live in the core/shared boundaries.
The web client cannot import the API implementation. Core infrastructure cannot
import web features, and shared modules cannot depend on feature implementation.
See [Architecture](docs/architecture/overview.md) and the
[first decision record](docs/architecture/adr/0001-foundation.md).

## Prerequisites

- Node.js 24.15.0 or newer in the Node 24 line
- npm 11.12.1
- A Cloudflare account only if deploying; local development does not require one

## Start locally

```powershell
npm install
npm start
```

Open `http://localhost:4200`.

For the Worker:

```powershell
Copy-Item apps\api\.dev.vars.example apps\api\.dev.vars
npm run start:api
```

The local Worker listens on Wrangler's reported local URL and exposes
`GET /api/health`.

## Verify

```powershell
npm run format:check
npm run lint
npm run typecheck
npm run architecture:check
npm test
npm run build
npm run security:check
```

Run everything except the vulnerability audit with `npm run quality:check`.
Format files with `npm run format`.

## Cloudflare Pages

No deployment is performed by this repository.

The repository includes a root `wrangler.jsonc` for direct Pages uploads and a
`.node-version` file matching the supported Node runtime. Connect the GitHub
repository as a Cloudflare Pages project with:

- Framework preset: `None`
- Root directory: `/`
- Build command: `npm run build:web:cloudflare`
- Build output directory: `apps/web/dist/web/browser`
- Production branch: `main`
- Node version: `24.15.0`
- Install command: `npm ci`

The build reads the Cloudflare branch at build time to label public runtime
configuration as `production` or `preview`. Optionally set
`APP_API_BASE_URL` to a public, absolute API origin or a same-origin path. Set
`APP_SITE_URL` to the verified HTTPS production hostname to generate canonical
URLs, `sitemap.xml`, and the sitemap declaration in `robots.txt`. Production
contact submissions require `APP_CONTACT_ENDPOINT`; the build rejects a missing
or insecure endpoint and emits HTTP mode. Without an endpoint, use preview
deployments, which intentionally use the local mock and make no contact requests.
Without the site URL,
setting, canonical tags and the sitemap are intentionally omitted rather than
publishing incorrect URLs. Preview builds ignore `APP_SITE_URL` and publish a
`Disallow: /` robots policy. Never place secrets in public runtime configuration. See
[Cloudflare deployment](docs/implementation/cloudflare-deployment.md).

## Security

The baseline includes a restrictive CSP, SPA security headers, safe runtime
configuration loading, centralized HTTP error normalization, exact-origin Worker
CORS, RFC 9457-style API errors, no browser credentials by default, and
dependency/architecture checks. HSTS, WAF, rate limiting, DNS, authentication, and
provider-specific authorization require explicit production decisions. See
[Security](docs/security/baseline.md).

## Content

Initial placeholder content is owned by its business feature under the
corresponding `data-access/` directory. Replace placeholders only with supplied
and approved brewery information. A future CMS adapter should map its validated
response into these typed feature contracts rather than allowing CMS details to
leak directly into presentation components.

## Future features and APIs

Add business capabilities under `apps/web/src/app/features/<feature>` with lazy
routes. Keep transport in feature data-access layers, runtime validation and
authorization in the Worker, and cross-application protocol types in
`libs/contracts`. Do not make CORS an access-control mechanism.
