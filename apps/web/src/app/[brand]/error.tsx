'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BrandError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    console.error('[BrandError]', { message: error.message, digest: error.digest });
  }, [error]);

  const handleRetry = async () => {
    setRetrying(true);

    await new Promise((r) => setTimeout(r, 700));

    reset();
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: 48,
        background: '#fafafa',
      }}
    >
      <div style={{ fontSize: 52 }}>⚠️</div>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#c0392b', margin: 0 }}>
        Something went wrong
      </h1>

      <p style={{ color: '#666', margin: 0, textAlign: 'center', maxWidth: 420, lineHeight: 1.6 }}>
        {error.message || 'This brand page failed to load. The error has been reported.'}
      </p>

      {error.digest && (
        <code
          style={{
            background: '#f0f0f0',
            padding: '4px 12px',
            borderRadius: 4,
            fontSize: 12,
            color: '#888',
            fontFamily: 'monospace',
          }}
        >
          Error ID: {error.digest}
        </code>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button
          onClick={handleRetry}
          disabled={retrying}
          style={{
            padding: '12px 28px',
            background: retrying ? '#aaa' : '#c0392b',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: retrying ? 'not-allowed' : 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'background 150ms',
          }}
        >
          {retrying ? (
            <>
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 13,
                  height: 13,
                  border: '2px solid rgba(255,255,255,0.35)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }}
              />
              Retrying…
            </>
          ) : (
            'Try again'
          )}
        </button>

        <Link
          href="/"
          style={{
            padding: '12px 28px',
            background: '#efefef',
            color: '#333',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ← Back to brands
        </Link>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <p style={{ marginTop: 24, fontSize: 12, color: '#bbb', textAlign: 'center' }}>
          Dev tip: add <code>?error=true</code> to any brand URL to trigger this boundary.
        </p>
      )}
    </main>
  );
}
