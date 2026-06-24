import React, { startTransition } from 'react';

type ViewTransitionProps = {
  children: React.ReactNode;
  name?: string;
  enter?: string;
  exit?: string;
  default?: string;
};

export const ViewTransition: React.ComponentType<ViewTransitionProps> =
  (React as any).ViewTransition ??
  function ViewTransitionFallback({ children }: ViewTransitionProps) {
    return <>{children}</>;
  };

export function startVT(fn: () => void): void {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    (document as any).startViewTransition(() => {
      startTransition(fn);
    });
  } else {
    startTransition(fn);
  }
}

export const supportsVT =
  typeof document !== 'undefined' && 'startViewTransition' in document;

export const BRANDS = [
  { slug: 'wilko',     name: 'Wilko',     color: '#9d2235', bg: '#fff5f5', initial: 'W' },
  { slug: 'homebase',  name: 'Homebase',  color: '#089c49', bg: '#f0faf4', initial: 'H' },

  { slug: 'the-range', name: 'The Range', color: '#f53e24', bg: '#fff8f7', initial: 'R' },
] as const;

export type Brand = (typeof BRANDS)[number];

export function UnsupportedBanner() {
  return (
    <div style={{ background: '#fff3cd', padding: '10px 20px', fontSize: 13, color: '#856404', borderBottom: '1px solid #ffc107' }}>
      ⚠️ View Transitions API not supported — showing instant navigation.
    </div>
  );
}

export function BrandList({ onSelect }: { onSelect: (b: Brand) => void }) {
  return (
    <div style={{ padding: 40, background: '#f5f5f5', minHeight: 440, fontFamily: 'system-ui,sans-serif' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>
        Multibrand Platform
      </h1>
      <p style={{ color: '#999', margin: '0 0 28px', fontSize: 13 }}>Select a brand — click to navigate</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {BRANDS.map((brand) => (
          <button
            key={brand.slug}
            onClick={() => onSelect(brand)}
            style={{ background: brand.bg, border: `2px solid ${brand.color}33`, borderRadius: 12, padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}
          >
            <span style={{ width: 38, height: 38, borderRadius: '50%', background: brand.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
              {brand.initial}
            </span>
            <span style={{ fontWeight: 600, color: brand.color, fontSize: 15 }}>{brand.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function BrandDetail({ brand, onBack }: { brand: Brand; onBack: () => void }) {
  return (
    <div style={{ background: '#f5f5f5', minHeight: 440, fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ background: brand.color, padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{brand.name}</span>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
          ← Back
        </button>
      </div>
      <div style={{ padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {['New Arrivals', 'Best Sellers', 'Sale'].map((label) => (
          <div key={label} style={{ background: '#fff', borderRadius: 10, padding: 20, borderTop: `3px solid ${brand.color}` }}>
            <h3 style={{ margin: '0 0 6px', color: '#1a1a1a', fontSize: 15, fontWeight: 600 }}>{label}</h3>
            <p style={{ margin: 0, color: '#999', fontSize: 13 }}>Browse {label.toLowerCase()} at {brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
