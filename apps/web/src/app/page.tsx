import { ViewTransition } from 'react';
import { NavLink } from './nav-link';
import { getBrands } from '@/lib/contentful/queries';

const FALLBACK_BRANDS = [
  { slug: 'wilko',     name: 'Wilko',     color: '#9d2235', bg: '#fff5f5' },
  { slug: 'homebase',  name: 'Homebase',  color: '#089c49', bg: '#f0faf4' },
  { slug: 'the-range', name: 'The Range', color: '#f53e24', bg: '#fff8f7' },
];

async function fetchBrands() {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    return FALLBACK_BRANDS;
  }
  try {
    const entries = await getBrands();
    if (!entries.length) return FALLBACK_BRANDS;
    return entries.map(b => ({
      slug:  b.slug,
      name:  b.name,
      color: b.color,
      bg:    b.backgroundColor,
    }));
  } catch {
    return FALLBACK_BRANDS;
  }
}

export default async function Home() {
  const brands = await fetchBrands();

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, padding: 48, background: '#f5f5f5' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
        Multibrand Platform
      </h1>
      <p style={{ color: '#6b6b6b', margin: 0 }}>Select a brand to preview</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 280px)', gap: 24 }}>
        {brands.map((brand) => (
          <NavLink
            key={brand.slug}
            href={`/${brand.slug}`}
            transitionTypes={['nav-forward']}
            style={{ textDecoration: 'none' }}
          >
            <ViewTransition name={`brand-card-${brand.slug}`}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 140,
                  borderRadius: 16,
                  background: brand.bg,
                  border: `2px solid ${brand.color}22`,
                  gap: 12,
                }}
              >
                <span style={{ width: 48, height: 48, borderRadius: '50%', background: brand.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>
                    {brand.name[0]}
                  </span>
                </span>
                <span style={{ fontWeight: 600, color: brand.color, fontSize: 16 }}>
                  {brand.name}
                </span>
              </div>
            </ViewTransition>
          </NavLink>
        ))}
      </div>
    </main>
  );
}
