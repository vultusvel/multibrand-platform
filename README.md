# Multibrand Platform

A multi-brand retail platform built as an [Nx](https://nx.dev) monorepo. A single
shared UI library powers multiple brands (**wilko**, **Homebase**, **Bathstore**)
through runtime theming — same components, different colours.

---

## Tech stack

| Area              | Tool                          | Version  |
| ----------------- | ----------------------------- | -------- |
| Monorepo          | Nx                            | 22.7.5   |
| Runtime           | Node.js (LTS "Krypton")       | 24.x     |
| App framework     | Next.js (App Router)          | 16.1.x   |
| UI library        | React                         | 19.x     |
| Language          | TypeScript                    | 5.9.x    |
| Styling           | Tailwind CSS                  | 4.x      |
| Font              | Lato (`next/font` + `@fontsource/lato`) | — |
| Component explorer| Storybook (`@storybook/react-vite`) | 10.4.x |
| Tests             | Vitest                        | 4.x      |
| Bundlers          | Turbopack (app) · Vite (tests & Storybook) | — |

> **Why two bundlers?** The production app is **Next.js**, which builds with its
> own engine (Turbopack). Tests and Storybook run on **Vite** because that is
> their native, fastest engine. The app is always built with Next — Vite is only
> used for dev tooling. See [Architecture](#architecture).

---

## Prerequisites

- **Node.js 24** (enforced via `engines` and `.nvmrc`)
- **npm** (the repo ships a `package-lock.json`)

```bash
nvm use            # picks up Node 24 from .nvmrc
npm install
```

---

## Workspace structure

```
.
├── apps/
│   └── web/                     # Next.js application (a brand storefront)
│       ├── src/app/             # App Router pages, layout
│       │   ├── global.css       # thin entry: Tailwind + import design system
│       │   └── fonts.ts         # Lato via next/font (app's font strategy)
│       └── public/              # static assets (brand logos, icons, payment, media)
│
├── libs/
│   └── ui/                      # @multibrand-platform/ui — the design system
│       ├── .storybook/          # Storybook config (lives with the components)
│       └── src/
│           ├── styles/
│           │   └── theme.css    # design tokens: colours, brand themes, typography
│           └── lib/             # components + stories + unit tests
│               └── button/
│
├── nx.json                      # Nx config (plugins, sync, targets)
├── tsconfig.base.json           # shared TS config + path mappings
└── vitest.workspace.ts          # Vitest projects discovery
```

**Two projects:** `@multibrand-platform/web` (app) and `ui` (library).
The app consumes the library via `import { Button } from '@multibrand-platform/ui'`.

---

## Common commands

Run from the repo root.

### App (`@multibrand-platform/web`)

```bash
npx nx dev   @multibrand-platform/web      # dev server (Next.js)
npx nx build @multibrand-platform/web      # production build (Next.js)
npx nx start @multibrand-platform/web      # serve the production build
```

### Storybook (lives in the `ui` library)

```bash
npx nx storybook       ui             # dev server → http://localhost:4400
npx nx build-storybook ui             # static build
```

### Tests (Vitest)

```bash
npx nx test ui                        # unit tests + stories run as tests
npx nx test @multibrand-platform/web       # app unit tests
npx nx run-many -t test               # everything
```

### Quality

```bash
npx nx run-many -t lint               # ESLint (all projects)
npx nx run-many -t typecheck          # TypeScript
npx nx sync                           # sync TS project references (auto-applied)
npx nx graph                          # interactive dependency graph
```

> Tip: `npx nx affected -t test lint` runs only what your changes touched.

---

## Design system

The design system lives entirely in **`libs/ui`** and is consumed by the app.

### Brands & theming

Three brands share one set of components. Colours switch via a CSS class on a
parent element:

| Brand     | Theme class        | Primary   | Secondary |
| --------- | ------------------ | --------- | --------- |
| wilko     | `theme-wilko`      | `#9D0D26` | `#F6DA24` |
| Homebase  | `theme-homebase`   | `#008C49` | `#EF7D24` |
| Bathstore | `theme-bathstore`  | `#6F2AC0` | `#1A1A1A` |

Utilities like `bg-brand-primary` resolve to the active brand. In Storybook,
switch brands from the toolbar; in the app the brand is set on `<html>` (default
`theme-wilko`).

### Typography (The Range scale)

Lato, responsive (mobile → desktop at 768px). Semantic classes:

- Headings: `t-hero`, `t-h1` … `t-h5`
- Body: `t-body-xl/l/m/s/xs` (+ `-bold` variants)
- Links: `t-link-l/m/s`

> **Note:** Google Fonts' Lato has no weight 600, so the design's "Semi Bold"
> is mapped to **700**.

### Spacing scale

Named tokens: `xs` (16) · `s` (24) · `m` (32) · `l` (48) · `xl` (64) ·
`xxl` (80) · `massive` (96) — use as `p-l`, `gap-massive`, etc.

Tokens are defined in [`libs/ui/src/styles/theme.css`](libs/ui/src/styles/theme.css).

---

## Adding a component

1. Create the component + story + test next to each other:
   ```
   libs/ui/src/lib/<name>/<name>.tsx
   libs/ui/src/lib/<name>/<name>.stories.tsx
   libs/ui/src/lib/<name>/<name>.spec.tsx
   ```
2. Export it from [`libs/ui/src/index.ts`](libs/ui/src/index.ts).
3. Use it anywhere: `import { X } from '@multibrand-platform/ui'`.
4. It appears automatically in Storybook and runs as a test.

---

## Architecture

- **Production app → Next.js (Turbopack).** Unchanged, single build path. SSR,
  App Router, `next/image`, `next/font` all available.
- **Tests & Storybook → Vite.** Native engine for Vitest and
  `@storybook/react-vite`; faster than webpack.
- **Design system → `libs/ui`.** Components, design tokens (`theme.css`) and the
  Storybook config all live with the library. The app imports tokens via the
  package export `@multibrand-platform/ui/theme.css` and components via
  `@multibrand-platform/ui`. Next transpiles the raw-TS library via
  `transpilePackages`.
- **Tailwind v4** runs through `@tailwindcss/postcss` in the app (Next) and
  through `@tailwindcss/vite` in Storybook (Vite resolves `@import` before
  PostCSS, so the Vite plugin is required there).
- **Font strategy is per-consumer.** `theme.css` only declares
  `--font-sans: var(--font-lato), …`; the app provides `--font-lato` via
  `next/font`, Storybook via `@fontsource/lato`.

---

## Assets

Brand assets live under [`apps/web/public`](apps/web/public) — see
[`apps/web/public/README.md`](apps/web/public/README.md) for the folder layout
and how to add logos/icons/payment badges.
