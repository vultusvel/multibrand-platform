'use client';

import { useState } from 'react';

type State = 'idle' | 'loading' | 'success';

export function ShopNowButton() {
  const [state, setState] = useState<State>('idle');

  const handleClick = async () => {
    if (state !== 'idle') return;
    setState('loading');
    await new Promise((r) => setTimeout(r, 1600));
    setState('success');
    await new Promise((r) => setTimeout(r, 2200));
    setState('idle');
  };

  const label =
    state === 'loading' ? 'Adding to basket...' :
    state === 'success'  ? '✓ Added to basket!' :
                           'Shop now';

  const bg =
    state === 'success' ? '#2ecc71' :
    state === 'loading' ? 'color-mix(in srgb, var(--brand-primary), transparent 27%)' :
                          'var(--brand-primary)';

  return (
    <button
      onClick={handleClick}
      disabled={state !== 'idle'}
      aria-live="polite"
      style={{
        padding: '14px 40px',
        background: bg,
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 700,
        cursor: state !== 'idle' ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        transition: 'background 300ms',
        minWidth: 190,
        justifyContent: 'center',
      }}
    >
      {state === 'loading' && (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 16,
            height: 16,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {label}
    </button>
  );
}
