# Externally-Sourced Themes — POC

Brand colour tokens live outside the codebase. Changing a colour requires no code change and no redeploy.

Active source is chosen at runtime: `EDGE_CONFIG` env var present → Edge Config, otherwise → Local JSON.

## File structure

```
libs/ui/src/themes/
  schema.ts           Zod schema + tokensToCSS()
  wilko.json
  homebase.json
  the-range.json
  adapters/
    types.ts          ThemeSource interface
    local.ts          LocalThemeSource
    edge-config.ts    EdgeConfigThemeSource

apps/web/src/app/[brand]/
  layout.tsx          Injects <style> with CSS vars at SSR
```

## Token schema

| JSON key         | CSS variable        | Required |
|------------------|---------------------|----------|
| `brandPrimary`   | `--brand-primary`   | ✅       |
| `brandSecondary` | `--brand-secondary` | ✅       |
| `statusNew`      | `--status-new`      | ✅       |
| `statusRatings`  | `--status-ratings`  | ✅       |
| `statusSale`     | `--status-sale`     | ✅       |

All values must be valid hex (`#rgb` / `#rrggbb`). Extended optional fields exist for The Range.

## Phase 1 — Edge Config

### Setup

```bash
# Connect store in Vercel Dashboard → Storage, then:
vercel env pull .env.local

# Seed initial values:
node --env-file=.env.local scripts/seed-edge-config.mjs
```

### Update a colour (no redeploy)

1. Vercel Dashboard → Storage → Edge Config → Items
2. Edit `theme-{slug}`, change any hex value
3. Click **Save**
4. Reload the brand page

### Required env vars

| Variable       | Where                                          |
|----------------|------------------------------------------------|
| `EDGE_CONFIG`  | Auto-added by `vercel env pull` after connecting |
| `VERCEL_TOKEN` | Vercel Dashboard → Account Settings → Tokens   |

## Adding a new brand (Local JSON)

1. Create `libs/ui/src/themes/{slug}.json`
2. Register in `adapters/local.ts`
3. Add fallback in `apps/web/src/app/page.tsx` and `[brand]/page.tsx`

## Phase 2 — Contentful (planned)

Content model `brandTheme` with fields: `slug`, `name`, `brandPrimary`, `brandSecondary`, `statusNew`, `statusRatings`, `statusSale`.

Publish webhook → `POST /api/revalidate?tag=brand-theme` → `revalidateTag()` → live update.
