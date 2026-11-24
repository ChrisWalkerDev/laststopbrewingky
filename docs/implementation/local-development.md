# Local development

## Install

```powershell
npm install
```

npm workspaces provide one lockfile for the Angular app, Worker, and contracts.

## Web

```powershell
npm start
```

The Angular dev server uses `http://localhost:4200`. The public local runtime
configuration points to the same-origin `/api` path. Add a development proxy only
when a real local API route is introduced, and keep it out of production output.

The `/contact` page uses a deterministic mock by default. It delays for 650 ms,
reports success, and makes no HTTP request; successful mock submissions are
simulated and are not delivered to the brewery. To test the error state, set
`contact.mockFailure` to `true` in `apps/web/public/app-config.json`, restart the
dev server if necessary, and submit a valid form. Return it to `false` before
normal development.

## API

```powershell
Copy-Item apps\api\.dev.vars.example apps\api\.dev.vars
npm run start:api
```

`apps/api/.dev.vars` is ignored. Put exact local browser origins in
`ALLOWED_ORIGINS`. Secrets introduced later must use Wrangler secret commands or
approved server-side secret bindings, never public vars or Angular files.

## Checks

`npm run quality:check` runs formatting, lint, type checks, architecture checks,
unit tests, and builds. `npm run security:check` performs npm's vulnerability
audit. CI repeats both workflows on Node 24.

Angular production artifacts are written to `apps/web/dist/web/browser`.
Worker dry-run output is written to `apps/api/dist`.
