'use client';

import Link from 'next/link';

export default function BrandError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 48, background: '#fff5f5' }}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#c0392b', margin: 0 }}>
        Something went wrong
      </h1>
      <p style={{ color: '#6b6b6b', margin: 0, textAlign: 'center', maxWidth: 400 }}>
        {error.message || 'Failed to load this brand page.'}
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={reset}
          style={{ padding: '10px 24px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{ padding: '10px 24px', background: '#f0f0f0', color: '#333', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
