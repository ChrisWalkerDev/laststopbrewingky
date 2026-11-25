# ADR 0001: Bootstrap a static Angular client and independent Worker

## Status

Accepted.

## Context

The repository needs a secure, production-oriented foundation without known
domain or SEO requirements. It may grow to several Angular features and a Worker
API, but currently has no application behavior.

## Decision

- Use Angular 22 standalone APIs, strict TypeScript, zoneless defaults, Vitest,
  Angular Material, and CDK.
- Use npm workspaces instead of Nx.
- Use static CSR on Cloudflare Workers Static Assets.
- Use a separately deployed Cloudflare Worker for server-side APIs.
- Share only explicit transport contracts through `libs/contracts`.
- Keep runtime browser configuration public and validate it before bootstrap.

## Alternatives

Nx provides stronger task graphs and generated library boundaries, but introduces
configuration and dependency cost before the repository has multiple applications
or independently built libraries. Cloudflare Pages could host the static frontend,
but Workers Static Assets is the current platform model for a new deployment and
provides a unified asset-serving configuration. Pages Functions would reduce one
deployment surface but couple API release ownership to the frontend and duplicate
the Worker boundary if APIs grow. SSR improves server-rendered content but adds
runtime, caching, and deployment complexity without a current SEO or
personalization need.

## Consequences

The initial workspace remains understandable and uses standard Angular/npm
tooling. Feature teams must maintain explicit boundaries and routes.
`dependency-cruiser` supplies a baseline, not proof of correct ownership. SSR,
cross-feature restrictions, or Nx can be reconsidered with evidence. Web asset
and API Worker deployments, secrets, and environment variables must be
configured as separate release surfaces.
