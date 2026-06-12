# @wilko-platform/ui

The shared **design system** for the Wilko Platform: React components, design
tokens (colours, brand themes, typography) and the Storybook used to develop and
showcase them. Consumed by the apps via `import { Button } from '@wilko-platform/ui'`.

## What's inside

```
libs/ui/
├── .storybook/              # Storybook config (@storybook/react-vite)
│   ├── main.ts
│   ├── preview.tsx          # brand switcher + Lato (@fontsource) + tokens
│   └── preview.css          # @import tailwindcss + theme.css
└── src/
    ├── index.ts             # public API (exports components)
    ├── styles/
    │   └── theme.css         # design tokens: brand colours, themes, typography
    └── lib/
        └── button/
            ├── button.tsx          # component
            ├── button.stories.tsx  # Storybook story
            └── button.spec.tsx     # unit test
```

## Storybook

Storybook lives **with the components** (here in `libs/ui`), not in an app —
it showcases the shared library and works across all brands.

```bash
npx nx storybook       ui     # dev server → http://localhost:4400
npx nx build-storybook ui     # static build
```

- **Builder:** Vite (`@storybook/react-vite`) — fast, framework-agnostic.
- **Tailwind v4** is wired via the `@tailwindcss/vite` plugin in `.storybook/main.ts`.
- **Brand switcher** in the toolbar (wilko / Homebase / Bathstore) via
  `@storybook/addon-themes`.
- **Font:** Lato via `@fontsource/lato` (the app uses `next/font` instead — the
  design system only declares the `--font-sans` contract).
- **Addons:** docs, a11y, links, themes, vitest, chromatic.

## Running tests (Vitest, not Jest)

Tests run on **Vitest** (the old Nx default Jest was removed).

```bash
npx nx test ui                          # everything in this project
```

This project has **two Vitest sub-projects**, so `nx test ui` runs both:

| Sub-project    | What it runs                                  |
| -------------- | --------------------------------------------- |
| `ui`           | unit tests (`*.spec.tsx`)                     |
| `ui-storybook` | every story run as a test (`@storybook/addon-vitest`) |

That's why a full run reports more tests than you have `.spec` files — each
story counts as a test too.

### Run only a subset

```bash
# only the unit tests (skip stories)
npx nx test ui -- --project=ui

# only button.spec.tsx (unit project)
npx nx test ui -- button.spec --project=ui

# a single test by name
npx nx test ui -- button.spec --project=ui -t "renders its children"

# watch mode
npx nx test ui -- --project=ui --watch
```

> The `Not implemented: HTMLCanvasElement's getContext()` lines during a run are
> harmless warnings from the a11y addon (axe wants the `canvas` package); tests
> still pass.

## Design tokens & theming

`src/styles/theme.css` defines the design system and is shared with the app
(imported there via `@wilko-platform/ui/theme.css`).

- **Brands:** `theme-wilko` (default), `theme-homebase`, `theme-bathstore` —
  set the class on a parent element; utilities like `bg-brand-primary` follow.
- **Typography (Lato):** `t-hero`, `t-h1…t-h5`, `t-body-xl…xs` (+ `-bold`),
  `t-link-l/m/s`. Responsive at 768px.
- **Spacing:** `xs s m l xl xxl massive` → `p-l`, `gap-massive`, etc.

## Adding a component

1. Create `src/lib/<name>/<name>.tsx` + `<name>.stories.tsx` + `<name>.spec.tsx`.
2. Export it from `src/index.ts`.
3. Use it: `import { X } from '@wilko-platform/ui'`. It shows up in Storybook and
   runs as a test automatically.

---

_See the root [`README.md`](../../README.md) for the full platform overview._
