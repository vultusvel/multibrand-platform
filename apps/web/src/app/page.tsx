import Link from 'next/link';

const brands = [
  { slug: 'wilko', name: 'Wilko', color: '#9d0d26', bg: '#fff5f5' },
  { slug: 'homebase', name: 'Homebase', color: '#008c49', bg: '#f0faf4' },
  { slug: 'bathstore', name: 'Bathstore', color: '#6f2ac0', bg: '#f8f4ff' },
  { slug: 'the-range', name: 'The Range', color: '#f53e24', bg: '#fff8f7' },
];

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, padding: 48, background: '#f5f5f5' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
        Multibrand Platform
      </h1>
      <p style={{ color: '#6b6b6b', margin: 0 }}>Select a brand to preview</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 280px)', gap: 24 }}>
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/${brand.slug}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 140,
              borderRadius: 16,
              background: brand.bg,
              border: `2px solid ${brand.color}22`,
              textDecoration: 'none',
              gap: 12,
              transition: 'transform 150ms, box-shadow 150ms',
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
          </Link>
        ))}
      </div>
    </main>
  );
}
