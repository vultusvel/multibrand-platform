# Externally-Sourced Themes — POC

Brand colour tokens live outside the codebase. Changing a colour requires no code change and no redeploy.

Active source is chosen at runtime:
- `EDGE_CONFIG` set → Edge Config
- `CONTENTFUL_SPACE_ID` set → Contentful
- otherwise → Local JSON

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
    contentful.ts     ContentfulThemeSource

apps/web/src/app/[brand]/
  layout.tsx          Injects <style> with CSS vars at SSR
apps/web/src/app/api/revalidate/
  route.ts            Webhook → revalidateTag('brand-theme')
```

## Phases

| Phase | Source             | Status  |
|-------|--------------------|---------|
| 0     | Local JSON         | ✅ done |
| 1     | Vercel Edge Config | ✅ done |
| 2     | Contentful         | ✅ done |

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

| Variable       | Where                                            |
|----------------|--------------------------------------------------|
| `EDGE_CONFIG`  | Auto-added by `vercel env pull` after connecting |
| `VERCEL_TOKEN` | Vercel Dashboard → Account Settings → Tokens     |

## Phase 2 — Contentful

### Content model `brandTheme`

Create in Contentful UI with these fields (all Short text):

| Field            | Required |
|------------------|----------|
| `slug`           | ✅       |
| `name`           | ✅       |
| `brandPrimary`   | ✅       |
| `brandSecondary` | ✅       |
| `statusNew`      | ✅       |
| `statusRatings`  | ✅       |
| `statusSale`     | ✅       |

### Update a colour (no redeploy)

1. Edit the `brandTheme` entry in Contentful
2. Click **Publish**
3. Contentful fires the webhook → `POST /api/revalidate?secret=…`
4. `revalidateTag('brand-theme', 'max')` clears the cache
5. Next request fetches fresh data from Contentful

### Webhook setup in Contentful

URL: `https://your-domain.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET`
Trigger: Entry published, Content type: `brandTheme`

### Required env vars

| Variable             | Where                              |
|----------------------|------------------------------------|
| `CONTENTFUL_SPACE_ID`    | Contentful → Settings → API keys |
| `CONTENTFUL_ACCESS_TOKEN`| Contentful → Settings → API keys |
| `REVALIDATE_SECRET`      | Any random string, also in webhook URL |

## Adding a new brand (Local JSON)

1. Create `libs/ui/src/themes/{slug}.json`
2. Register in `adapters/local.ts`
3. Add fallback in `apps/web/src/app/page.tsx` and `[brand]/page.tsx`

## Trade-offs

|                 | Local JSON  | Edge Config          | Contentful           |
|-----------------|-------------|----------------------|----------------------|
| Editing UI      | code only   | Vercel dashboard     | rich editor + roles  |
| Update speed    | rebuild     | instant              | instant + webhook    |
| Change history  | git log     | none                 | entry history        |
| Setup cost      | zero        | free (8 KB tier)     | Contentful account   |
