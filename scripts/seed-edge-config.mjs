const EDGE_CONFIG_URL = process.env.EDGE_CONFIG;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!EDGE_CONFIG_URL) {
  console.error('Missing EDGE_CONFIG env var. Run: vercel env pull .env.local');
  process.exit(1);
}

if (!VERCEL_TOKEN) {
  console.error('Missing VERCEL_TOKEN env var. Usage: VERCEL_TOKEN=xxx node scripts/seed-edge-config.mjs');
  process.exit(1);
}

const storeId = new URL(EDGE_CONFIG_URL).pathname.split('/')[1];

const THEMES = [
  {
    slug: 'wilko',
    name: 'Wilko',
    brandPrimary:   '#9d2235',
    brandSecondary: '#fdda24',
    statusNew:      '#67a239',
    statusRatings:  '#f68d00',
    statusSale:     '#e41222',
  },
  {
    slug: 'homebase',
    name: 'Homebase',
    brandPrimary:   '#089c49',
    brandSecondary: '#ec7224',
    statusNew:      '#fb610b',
    statusRatings:  '#fb610b',
    statusSale:     '#ee0000',
  },
  {
    slug: 'the-range',
    name: 'The Range',
    brandPrimary:     '#f53e24',
    brandSecondary:   '#2a2c6b',
    statusNew:        '#178728',
    statusRatings:    '#f68d00',
    statusSale:       '#ec1818',
    brandBlue:        '#2a2c6b',
    brandBrightBlue:  '#3d68c2',
    brandMidBlue:     '#5178a4',
    brandBlueHover:   '#202f88',
    brandBluePressed: '#1e2051',
  },
];

const items = [
  {
    operation: 'upsert',
    key:       'brand-slugs',
    value:     THEMES.map(t => t.slug),
  },
  ...THEMES.map(theme => ({
    operation: 'upsert',
    key:       `theme-${theme.slug}`,
    value:     theme,
  })),
];

const res = await fetch(
  `https://api.vercel.com/v1/edge-config/${storeId}/items`,
  {
    method:  'PATCH',
    headers: {
      Authorization:  `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  }
);

if (!res.ok) {
  const err = await res.text();
  console.error('Failed to seed Edge Config:', res.status, err);
  process.exit(1);
}

console.log('✓ Edge Config seeded with', THEMES.length, 'brands:');
THEMES.forEach(t => console.log(`  theme:${t.slug}`));
