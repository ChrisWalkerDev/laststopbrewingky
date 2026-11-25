# Architecture overview

## Ownership

- `apps/web`: browser delivery and presentation. Application-wide providers live in
  `core`; generic UI belongs in `shared`; domain features own their routes,
  pages, feature components, models, and API communication.
- `apps/api`: Cloudflare Worker HTTP boundary and operational routes.
- `libs/contracts`: transport contracts shared by the web and API builds.
- `infrastructure/cloudflare`: non-secret deployment guidance. No live account
  resources are managed from source.

## Marketing feature map

- `/`: home introduction, beer highlights, menu entry point, and visit CTA.
- `/beers`: placeholder-ready beer catalogue.
- `/menu`: food, beverage, and dietary information structure.
- `/about`: history, process, people, and community structure.
- `/visit`: location, hours, contact, directions, and accessibility structure.

Events are intentionally excluded from the initial feature set. Every active
feature is lazy-loaded. Shared presentation components remain domain-neutral.
Feature-specific content and behavior are owned by the corresponding feature.

## Feature layout

Keep feature routes at the feature root and colocate route-level components,
feature components, and data concerns below that feature:

```text
features/contact/
  components/contact-form/     # Contact-specific form
  models/                      # Contact form and request models
  pages/                       # Route-level presentation
  services/                    # Contact submission implementations
  contact.routes.ts
```

Use only the folders a feature needs. Small features keep page files directly
under `pages/`; a component gets its own folder when it has a meaningful file set
or is composed independently. Static feature content and future feature data
sources live in `data-access`. Contact submission and validation stay in Contact;
they are not application-wide core concerns.

`core` is limited to application-wide configuration, layout, HTTP
infrastructure, and SEO. `shared` contains genuinely domain-neutral UI and
utilities used by multiple features. Do not introduce generic form engines or
move feature forms to `shared` only because their fields look similar.

## Dependency direction

Features may consume core, shared, and contracts. Core and shared must not consume
feature implementation. Web and API implementation code must not import each
other. Both may import contracts. A feature must not import another feature's
internal files; cross-feature behavior or data is exposed through that feature's
`index.ts` public API or a deliberately owned shared abstraction.

`dependency-cruiser` enforces the no-cycle, core/shared, contract, and
cross-feature internal-import boundaries. The Beers `index.ts` is the intentional
public API used by Home for beer highlights.

## Runtime model

The browser app is statically rendered CSR output deployed through Cloudflare
Workers Static Assets.
Signals and `OnPush` components are used for local synchronous state. RxJS remains
available for cancellable HTTP and event composition. API business logic is owned
by a separately deployed Worker, keeping the API release boundary independent
from the web asset deployment.

Public runtime configuration is loaded from `app-config.json` before Angular
bootstrap. Configuration files are browser-visible by design and must never hold
credentials, tokens, or private keys. A verified HTTPS `APP_SITE_URL` enables
canonical metadata and build-time sitemap generation. Without it, those
domain-dependent artifacts are intentionally omitted.

## HTTP boundary

Application code should call `ApiClient` rather than constructing API URLs.
The functional error interceptor converts transport failures into stable
user-safe errors. TypeScript interfaces describe expected contracts; the server
must still perform runtime validation for every untrusted input.

## Evolution

Start with standalone lazy feature routes. Add libraries only when a real
independent owner, publish/build boundary, or multi-app reuse requirement exists.
Do not add SSR, Nx, a state-management package, or provider-specific
authentication until product requirements justify the operational cost.
