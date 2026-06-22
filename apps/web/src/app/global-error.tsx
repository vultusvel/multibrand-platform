'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fafafa' }}>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: 48,
          }}
        >
          <div style={{ fontSize: 52 }}>💥</div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#c0392b', margin: 0 }}>
            Application Error
          </h1>

          <p style={{ color: '#666', textAlign: 'center', maxWidth: 440, lineHeight: 1.6, margin: 0 }}>
            A critical error occurred and the page could not be displayed.
            Our team has been notified.
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

          <button
            onClick={reset}
            style={{
              marginTop: 8,
              padding: '12px 32px',
              background: '#c0392b',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 15,
            }}
          >
            Refresh page
          </button>
        </main>
      </body>
    </html>
  );
}
