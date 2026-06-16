import Link from 'next/link';
import { notFound } from 'next/navigation';

const brands: Record<string, { name: string; primary: string; secondary: string; description: string }> = {
  wilko: {
    name: 'Wilko',
    primary: '#9d0d26',
    secondary: '#f6da24',
    description: 'Value products for your home, garden and family.',
  },
  homebase: {
    name: 'Homebase',
    primary: '#008c49',
    secondary: '#ef7d24',
    description: 'Your home improvement and garden destination.',
  },
  bathstore: {
    name: 'Bathstore',
    primary: '#6f2ac0',
    secondary: '#1a1a1a',
    description: 'Beautiful bathrooms for every home.',
  },
  'the-range': {
    name: 'The Range',
    primary: '#f53e24',
    secondary: '#2a2c6b',
    description: 'Arts, crafts, leisure and homeware.',
  },
};

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const config = brands[brand];
  if (!config) notFound();

  return (
    <main
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}
    >
      {/* Header */}
      <header
        style={{
          background: config.primary,
          padding: '20px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{config.name}</span>
        <Link
          href="/"
          style={{
            color: '#fff',
            fontSize: 14,
            textDecoration: 'none',
            opacity: 0.8,
            border: '1px solid rgba(255,255,255,0.4)',
            padding: '6px 16px',
            borderRadius: 8,
          }}
        >
          ← All brands
        </Link>
      </header>

      {/* Hero */}
      <section
        style={{
          background: config.secondary,
          padding: '80px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#fff', margin: 0 }}>
          Welcome to {config.name}
        </h1>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', margin: 0, maxWidth: 480 }}>
          {config.description}
        </p>
        <button
          style={{
            marginTop: 8,
            padding: '14px 32px',
            background: config.primary,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Shop now
        </button>
      </section>

      {/* Cards */}
      <section
        style={{
          padding: '48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          background: '#f9f9f9',
          flex: 1,
        }}
      >
        {['New Arrivals', 'Best Sellers', 'Sale'].map((label) => (
          <div
            key={label}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              borderTop: `4px solid ${config.primary}`,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
              {label}
            </h2>
            <p style={{ color: '#6b6b6b', margin: 0, fontSize: 14 }}>
              Browse our latest {label.toLowerCase()} at {config.name}.
            </p>
            <span
              style={{
                marginTop: 8,
                color: config.primary,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              View all →
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
