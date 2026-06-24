import { Suspense, ViewTransition } from 'react';
import { notFound } from 'next/navigation';
import { NavLink } from '../nav-link';
import { ShopNowButton } from './ShopNowButton';
import { getBrandBySlug, getBrands } from '@/lib/contentful/queries';

export async function generateStaticParams() {
  const fallback = [
    { brand: 'wilko' },
    { brand: 'homebase' },
    { brand: 'the-range' },
  ];
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    return fallback;
  }
  try {
    const brands = await getBrands();
    return brands.length ? brands.map(b => ({ brand: b.slug })) : fallback;
  } catch {
    return fallback;
  }
}

const FALLBACK: Record<string, { name: string; primary: string; secondary: string }> = {
  wilko:       { name: 'Wilko',     primary: '#9d2235', secondary: '#fdda24' },
  homebase:    { name: 'Homebase',  primary: '#089c49', secondary: '#ec7224' },
  'the-range': { name: 'The Range', primary: '#f53e24', secondary: '#2a2c6b' },
};

async function fetchBrand(slug: string) {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    return FALLBACK[slug] ?? null;
  }
  try {
    const entry = await getBrandBySlug(slug);
    if (!entry) return FALLBACK[slug] ?? null;
    return {
      name:      entry.name,
      primary:   entry.color,
      secondary: entry.backgroundColor,
    };
  } catch {
    return FALLBACK[slug] ?? null;
  }
}

function CardsSkeleton() {
  return (
    <div style={{ padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ height: 120, background: '#e8e8e8', borderRadius: 10, animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite` }} />
      ))}
    </div>
  );
}

async function Cards({ primary }: { primary: string }) {
  await new Promise((r) => setTimeout(r, 700));
  return (
    <ViewTransition enter="slide-up" default="none">
      <div style={{ padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {['New Arrivals', 'Best Sellers', 'Sale'].map((label) => (
          <div key={label} style={{ background: '#fff', borderRadius: 10, padding: 24, borderTop: `3px solid ${primary}` }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a' }}>{label}</p>
          </div>
        ))}
      </div>
    </ViewTransition>
  );
}

export default async function BrandPage({
  params,
  searchParams,
}: {
  params:       Promise<{ brand: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { brand } = await params;
  const { error }  = await searchParams;

  const config = await fetchBrand(brand);
  if (!config) notFound();

  if (error === 'true') throw new Error(`Test error: failed to load ${config.name}.`);

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui,sans-serif' }}>
      <ViewTransition name={`brand-card-${brand}`}>
        <header style={{ background: config.primary, padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{config.name}</span>
          <NavLink href="/" transitionTypes={['nav-back']} style={{ color: '#fff', fontSize: 13, textDecoration: 'none', background: 'rgba(255,255,255,0.18)', padding: '7px 14px', borderRadius: 6 }}>
            ← Back
          </NavLink>
        </header>
      </ViewTransition>

      <section style={{ background: config.secondary, padding: '48px 40px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 700, margin: '0 0 24px' }}>
          Welcome to {config.name}
        </h1>
        <ShopNowButton primary={config.primary} />
      </section>

      <Suspense fallback={<ViewTransition exit="slide-down"><CardsSkeleton /></ViewTransition>}>
        <Cards primary={config.primary} />
      </Suspense>
    </main>
  );
}
