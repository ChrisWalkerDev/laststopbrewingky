# Angular web application

Run from the repository root with `npm start`.

This package is generated with Angular CLI 22 and intentionally uses static CSR,
standalone components, zoneless change detection, strict template compilation,
and Vitest. Application and deployment commands are documented in the
repository [README](../../README.md).

## Brand design system

The global stylesheet (`src/styles.scss`) is the single source of truth for the
brewery colour system:

- `--color-brand-primary` (`#c2151b`) is Brewery Red and powers accents, active
  navigation, primary actions, focus treatment, and validation.
- `--color-brand-dark` (`#030301`) is Near Black and powers prominent dark
  surfaces, primary text, and strong contrast.
- `--color-brand-light` (`#fefefe`) is White and powers light surfaces and
  inverse text.

Semantic tokens map those foundations to backgrounds, surfaces, text, borders,
buttons, and feedback. Derived neutral and tint values use `color-mix` so
components do not duplicate unrelated palette colours. The only separate
interaction shade is `--color-button-primary-hover` (`#a81218`), a darker
version of Brewery Red.

Use semantic tokens in component styles rather than brand hex values directly.
Keep red to strategic emphasis and controls; do not use it for long body copy on
dark surfaces. White-on-red and dark-on-white are the default accessible
foreground combinations. Focus indicators, form feedback, active navigation, and
status messages must retain text or structural cues in addition to colour.

The application does not currently use Angular Material, so no Material theme or
component overrides are required. If Material is added later, map its palette and
state tokens to this design-token system rather than accepting default colours.

## Feature architecture

Organise code by business capability:

- Route-level components belong in a feature's `pages/` directory.
- Feature-owned interactive UI belongs in that feature's `components/`.
- Feature models, services, static content, and transport concerns remain inside
  the feature under `models/`, `services/`, or `data-access/` as warranted.
- Keep route definitions at the feature root so lazy loading remains visible.
- Use `components/` in `shared` only for domain-neutral UI used by multiple
  features. Feature forms, submission behavior, and validation remain with their
  owning feature.
- Keep `core` for application-wide configuration, layout, HTTP, and SEO
  infrastructure.

Avoid empty folders and extra component-level directories when a direct file in
`pages/` is clear. Add a component directory when the component owns a cohesive
template, stylesheet, test, or related implementation. Features may consume
another feature only through its explicit `index.ts` public API; imports of
another feature's internal files are rejected by the architecture check.

## Component file organisation

Use one directory-local file set for each non-trivial Angular component:

```text
example-page.component.ts
example-page.component.html
example-page.component.scss
example-page.component.spec.ts
```

Keep component logic and metadata in the TypeScript file and reference the
external files with `templateUrl` and `styleUrl`. Keep component-specific
styles scoped to the component stylesheet. Templates should express rendering
and user interaction; complex transformations, validation, and data access
belong in TypeScript or the owning feature's services and models.

Keep global design tokens, resets, typography, and shared utility classes in
`src/styles.scss`. Repeated UI structures should be extracted into genuine
shared components rather than copied between templates. A small inline template
or style is acceptable only for a genuinely trivial component when separate
files would add no maintainability value. Add a `.component.spec.ts` file when
the component has behavior or important rendering contracts worth testing; pure
presentation with no applicable independent behavior may rely on route or parent
integration coverage.
