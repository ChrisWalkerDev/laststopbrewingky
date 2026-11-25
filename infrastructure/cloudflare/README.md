# Cloudflare foundation

No deployment script in this repository authenticates to or modifies a live
Cloudflare account.

## Web Worker with Static Assets

Use Workers Builds with these settings:

- Install command: `npm ci`
- Build command: `npm run build:web:cloudflare`
- Deploy command: `npx wrangler deploy`
- Preview command: `npx wrangler preview`
- Node version: `24.15.0`

`apps/web/public` is copied into the Angular browser output. It contains runtime
configuration, the CSP and security headers, and the SPA fallback. Verify the
headers against a preview deployment before production enforcement.

The root `wrangler.jsonc` identifies the Angular browser output as Worker static
assets and configures single-page-application fallback behavior. For the first
production build, configure the public values documented in
`docs/implementation/cloudflare-deployment.md`; production intentionally fails
when the real contact endpoint has not been configured.

## API Worker

The API is independently owned in `apps/api` and deploys from that directory:

```powershell
npm run build:api
npx wrangler deploy --config apps/api/wrangler.jsonc
```

Deploying requires explicit approval and Cloudflare credentials. Set
`ALLOWED_ORIGINS` separately for preview and production; use exact scheme, host,
and port values. Never use a wildcard origin. Set `ENVIRONMENT` to the correct
environment name.

## Production controls

Configure HSTS only on the final custom domain after HTTPS is reliable for every
affected hostname. Review WAF managed rules, rate limiting for sensitive future
routes, DNS proxy status, origin access, TLS mode, bot controls, and observability
in the Cloudflare account. This repository intentionally does not alter any of
those live controls.
