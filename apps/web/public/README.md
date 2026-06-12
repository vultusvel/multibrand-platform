# Static assets (`public/`)

Files here are served from the site root (e.g. `public/payment/visa.svg` → `/payment/visa.svg`)
and are also available inside Storybook (configured via `staticDirs` in `.storybook/main.ts`).

## Layout

```
public/
├── brands/                 # Per-brand assets
│   ├── wilko/logos/        # wilko.com logos (full, compact, mono, icon, ...)
│   ├── homebase/logos/     # Homebase logos
│   └── bathstore/logos/    # Bathstore logos
├── icons/                  # Shared icon set (same across brands)
│   ├── system/             # arrows, search, cart, menu, etc.
│   ├── fulfilment/         # delivery / collection
│   ├── ratings/            # stars
│   ├── social/             # facebook, instagram, youtube, pinterest, x, tiktok
│   ├── indicators/         # status dots
│   └── badges/             # roundels & badges (save £, clearance, new, ...)
├── payment/                # Payment badges (Visa, Mastercard, Klarna, Clearpay, PayPal, Apple/Google Pay, ...)
└── media/                  # Placeholder / marketing imagery
```

## How to add files
1. Drop SVG/PNG/WebP files into the matching folder.
2. Reference them by absolute path from the site root, e.g.:
   ```tsx
   <img src="/brands/wilko/logos/wilko-full.svg" alt="wilko.com" />
   <img src="/payment/visa.svg" alt="Visa" />
   ```
3. Prefer **SVG** for logos/icons/badges and **WebP/PNG** for photographic media.

> The `.gitkeep` files just keep the empty folders in git — delete them once a
> folder has real assets.
