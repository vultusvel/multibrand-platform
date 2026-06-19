import { ViewTransition } from 'react';

export default function BrandLoading() {
  return (
    <ViewTransition exit="slide-down">
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header skeleton */}
        <div style={{ height: 64, background: '#e0e0e0', animation: 'pulse 1.5s ease-in-out infinite' }} />

        {/* Hero skeleton */}
        <div style={{ height: 320, background: '#d0d0d0', animation: 'pulse 1.5s ease-in-out infinite' }} />

        {/* Cards skeleton */}
        <div style={{ padding: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, background: '#f9f9f9', flex: 1 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: '#e8e8e8',
                borderRadius: 12,
                height: 160,
                animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </ViewTransition>
  );
}
