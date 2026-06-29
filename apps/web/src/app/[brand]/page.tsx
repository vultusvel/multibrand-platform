import { Suspense, ViewTransition } from 'react';
import { notFound } from 'next/navigation';
import { NavLink } from '../nav-link';
import { ShopNowButton } from './ShopNowButton';
import {
  LocalThemeSource,
  EdgeConfigThemeSource,
  ContentfulThemeSource,
} from '@multibrand-platform/ui/themes';

const STATIC_FALLBACK = [
  { brand: 'wilko' },
  { brand: 'homebase' },
  { brand: 'the-range' },
];

function getThemeSource() {
  if (process.env.EDGE_CONFIG) return new EdgeConfigThemeSource();

  if (process.env.CONTENTFUL_SPACE_ID) return new ContentfulThemeSource();
  
  return new LocalThemeSource();
}

export async function generateStaticParams() {
  try {
    const brands = await getThemeSource().getAllBrands();

    if (brands.length) return brands.map(b => ({ brand: b.slug }));
  } catch { 
    /* empty */ 
  }
  return STATIC_FALLBACK;
}

const FALLBACK: Record<string, string> = {
  wilko:       'Wilko',
  homebase:    'Homebase',
  'the-range': 'The Range',
};

async function fetchBrandName(slug: string): Promise<string | null> {
  try {
    const tokens = await getThemeSource().getBrand(slug);
    
    if (tokens) return tokens.name;
  } catch { 
    /* empty */ 
  }

  return FALLBACK[slug] ?? null;
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

async function Cards() {
  await new Promise((r) => setTimeout(r, 700));
  return (
    <ViewTransition enter="slide-up" default="none">
      <div style={{ padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {['New Arrivals', 'Best Sellers', 'Sale'].map((label) => (
          <div key={label} style={{ background: '#fff', borderRadius: 10, padding: 24, borderTop: '3px solid var(--brand-primary)' }}>
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
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { brand } = await params;
  const { error } = await searchParams;

  const name = await fetchBrandName(brand);
  if (!name) notFound();

  if (error === 'true') throw new Error(`Test error: failed to load ${name}.`);

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui,sans-serif' }}>
      <ViewTransition name={`brand-card-${brand}`}>
        <header style={{ background: 'var(--brand-primary)', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{name}</span>
          <NavLink href="/" transitionTypes={['nav-back']} style={{ color: '#fff', fontSize: 13, textDecoration: 'none', background: 'rgba(255,255,255,0.18)', padding: '7px 14px', borderRadius: 6 }}>
            ← Back
          </NavLink>
        </header>
      </ViewTransition>

      <section style={{ background: 'var(--brand-secondary)', padding: '48px 40px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 700, margin: '0 0 24px' }}>
          Welcome to {name}
        </h1>
        <ShopNowButton />
      </section>

      <Suspense fallback={<ViewTransition exit="slide-down"><CardsSkeleton /></ViewTransition>}>
        <Cards />
      </Suspense>
    </main>
  );
}
