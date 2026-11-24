# Repository Engineering Instructions

These instructions apply to all work in this repository. The repository's custom
Angular & Cloudflare Principal Architect agent must follow them in addition to its
agent-specific instructions.

## 1. Before changing code

- Inspect the existing project structure, `package.json`, lockfile, Angular version,
  TypeScript configuration, lint configuration, tests, and Cloudflare configuration.
- Follow established conventions unless they conflict with a security requirement
  or a documented architectural decision.
- Do not assume the repository uses Nx, a particular test runner, SSR, or a particular
  Cloudflare deployment mode. Verify first.
- Prefer small, focused changes. Do not refactor unrelated code.

## 2. Architecture

- Organize application code by business feature/domain.
- Keep each feature's UI, domain logic, and data-access concerns cohesive.
- Keep presentation components focused on rendering and user interaction.
- Keep HTTP transport and backend communication out of presentation components.
- Keep shared code genuinely generic. Do not use `shared` as a dumping ground.
- Keep application-wide infrastructure in `core` only when it is truly cross-cutting.
- Avoid circular dependencies and cross-feature access to implementation details.
- If one feature needs another feature's capability, expose a deliberate public API
  or move genuinely shared behavior into an appropriately owned abstraction.
- Prefer composition and explicit contracts over broad inheritance or hidden coupling.
- Do not introduce abstractions without a concrete benefit to testability,
  reuse, isolation, or maintainability.

## 3. Angular and TypeScript

- Respect the installed Angular version. Verify API and package compatibility before
  using newer APIs or recommending upgrades.
- Prefer standalone components, directives, and pipes.
- Prefer lazy-loaded feature routes where appropriate.
- Prefer Signals for local and synchronous reactive state.
- Use RxJS for asynchronous streams, cancellation, composition, and event workflows
  where it provides a clear benefit.
- Do not use effects as a general-purpose state synchronization mechanism.
- Prefer functional guards and interceptors when supported by the installed version.
- Write strict, explicit TypeScript. Prefer `unknown` over `any`.
- Treat all data received over HTTP, storage, URLs, and browser messaging as untrusted.
  TypeScript generics do not validate runtime data.
- Keep components small and cohesive; extract behavior when doing so improves clarity.
- Build zoneless-compatible code when supported and appropriate; do not break project
  compatibility merely to adopt zoneless mode.
- Use Angular Material/CDK only when it fits the project's existing design system
  and dependency strategy.
- Preserve accessibility: semantic HTML, keyboard operation, focus behavior,
  labels, and appropriate ARIA.

## 4. HTTP and API contracts

- Use HTTP methods and status codes according to their semantics.
- Define and maintain explicit request/response contracts.
- Validate untrusted input at runtime on the server.
- Enforce authentication and authorization on the server, never only in Angular.
- Handle errors consistently without leaking stack traces, secrets, or internal details.
- Set deliberate request-size, timeout, caching, and content-type policies.
- Do not treat CORS as authentication, authorization, or a complete CSRF defense.
- Avoid logging credentials, tokens, session identifiers, personal data, or request
  bodies unless specifically justified and safely redacted.

## 5. Cloudflare

- Treat Cloudflare Workers as the primary backend API runtime unless the project
  documents a different architecture.
- Use Pages Functions only where their deployment and ownership model is appropriate.
- Keep domain/business logic separate from HTTP transport handlers.
- Use environment bindings for configuration and secret bindings for secrets.
- Never put server secrets in Angular environment files or browser-delivered bundles.
- Keep preview and production configuration separate.
- Do not change production DNS, WAF, routing, secrets, or destructive infrastructure
  without explicit approval.
- Verify the actual deployment mode and current Cloudflare documentation before
  relying on platform-specific behavior.

## 6. Security baseline

- Apply security-by-design and threat-model meaningful changes.
- Validate input at trust boundaries; encode output for its context.
- Avoid unsafe DOM APIs and Angular sanitization bypasses.
- Use restrictive, tested Content Security Policy (CSP).
- Use explicit CORS origin allowlists. Never reflect arbitrary origins.
- Do not combine wildcard origins with credentialed CORS.
- Evaluate CSRF defenses whenever browser credentials (especially cookies) are used.
- Apply authentication, authorization, and rate limiting at the backend.
- Use HTTPS and carefully configured security headers.
- Keep secrets out of source, logs, client bundles, source maps, and error messages.
- Do not weaken security controls to make a test or deployment pass.
- Stop and explain serious vulnerabilities before proceeding with an unsafe design.

## 7. Dependencies

Before adding a dependency, check whether the platform or existing dependencies
already provide the capability. Evaluate compatibility, maintenance, security,
bundle impact, and long-term ownership. Explain material additions.

Do not silently add a new architectural enforcement framework or replace the
repository's existing lint/test tooling.

## 8. Verification

For relevant changes, run the checks available in this repository:

- formatting and linting;
- TypeScript and Angular compilation;
- unit and integration tests;
- production build;
- dependency and security audits where configured;
- architecture checks where configured.

Report exactly what ran and whether it passed. Never claim an unexecuted check passed.
If a check cannot run, state why.

## 9. Approval boundaries

Ask for explicit approval before:

- breaking public API or persisted-data contracts;
- major architectural migrations;
- destructive data or infrastructure operations;
- production DNS or security-policy changes;
- weakening security controls;
- irreversible production changes.

Routine, reversible implementation and tests may proceed autonomously.

## 10. Documentation

Update relevant implementation and security documentation when behavior, boundaries,
deployment, or threat assumptions change. Record significant architectural decisions
with context, alternatives, decision, and consequences.
