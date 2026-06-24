import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useCallback } from 'react';

type Phase = 'idle' | 'loading' | 'success' | 'error';

function useLoadingCycle(loadMs = 1800, successMs = 2000) {
  const [phase, setPhase] = useState<Phase>('idle');

  const trigger = useCallback(async () => {
    if (phase !== 'idle') return;
    setPhase('loading');
    await new Promise((r) => setTimeout(r, loadMs));
    setPhase('success');
    await new Promise((r) => setTimeout(r, successMs));
    setPhase('idle');
  }, [phase, loadMs, successMs]);

  return { phase, trigger };
}

const BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  padding: '13px 32px',
  border: 'none',
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
  transition: 'background 250ms, opacity 200ms',
  minWidth: 180,
};

function DemoShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 48, fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ margin: 0, fontSize: 13, color: '#999' }}>{label}</p>
      {children}
    </div>
  );
}


function SpinnerBtn({ color = '#9d2235' }: { color?: string }) {
  const { phase, trigger } = useLoadingCycle();

  return (
    <>
      <style>{`@keyframes _btn-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        onClick={trigger}
        disabled={phase !== 'idle'}
        style={{ ...BASE, background: phase === 'success' ? '#2ecc71' : color, color: '#fff', opacity: phase === 'loading' ? 0.85 : 1 }}
      >
        {phase === 'loading' && (
          <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: '_btn-spin 0.65s linear infinite', flexShrink: 0 }} />
        )}
        {phase === 'idle'    && 'Add to Basket'}
        {phase === 'loading' && 'Adding…'}
        {phase === 'success' && '✓ Added!'}
      </button>
    </>
  );
}


function ProgressBtn({ color = '#089c49' }: { color?: string }) {
  const { phase, trigger } = useLoadingCycle(2000);

  return (
    <button
      onClick={trigger}
      disabled={phase !== 'idle'}
      style={{ ...BASE, background: color, color: '#fff', position: 'relative', overflow: 'hidden', opacity: phase === 'loading' ? 0.9 : 1 }}
    >
      {phase === 'loading' && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.25)',
            transformOrigin: 'left',
            animation: '_prog-fill 2s cubic-bezier(0.4,0,0.2,1) forwards',
          }}
        />
      )}
      <style>{`@keyframes _prog-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
      <span style={{ position: 'relative', zIndex: 1 }}>
        {phase === 'idle'    && 'Place Order'}
        {phase === 'loading' && 'Processing…'}
        {phase === 'success' && '✓ Order Placed!'}
      </span>
    </button>
  );
}

function DotsBtn({ color = '#0da0cc' }: { color?: string }) {
  const { phase, trigger } = useLoadingCycle();

  return (
    <>
      <style>{`
        @keyframes _dot-bounce {
          0%, 80%, 100% { transform: translateY(0);   opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1;   }
        }
      `}</style>
      <button
        onClick={trigger}
        disabled={phase !== 'idle'}
        style={{ ...BASE, background: phase === 'success' ? '#2ecc71' : color, color: '#fff' }}
      >
        {phase === 'loading'
          ? [0, 1, 2].map((i) => (
              <span
                key={i}
                style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', animation: `_dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))
          : phase === 'success' ? '✓ Saved!'
          : 'Save Changes'}
      </button>
    </>
  );
}

function ShimmerBtn({ color = '#f53e24' }: { color?: string }) {
  const { phase, trigger } = useLoadingCycle();

  return (
    <>
      <style>{`
        @keyframes _shimmer {
          from { transform: translateX(-100%) skewX(-15deg); }
          to   { transform: translateX(250%)  skewX(-15deg); }
        }
      `}</style>
      <button
        onClick={trigger}
        disabled={phase !== 'idle'}
        style={{ ...BASE, background: phase === 'success' ? '#2ecc71' : color, color: '#fff', position: 'relative', overflow: 'hidden' }}
      >
        {phase === 'loading' && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
              animation: '_shimmer 1.2s ease-in-out infinite',
            }}
          />
        )}
        <span style={{ position: 'relative' }}>
          {phase === 'idle'    && 'Subscribe'}
          {phase === 'loading' && 'Subscribing…'}
          {phase === 'success' && '✓ Subscribed!'}
        </span>
      </button>
    </>
  );
}

function OptimisticBtn({ color = '#9d2235' }: { color?: string }) {
  const [liked, setLiked] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const toggle = async () => {
    const next = !liked;
    setLiked(next); // instant UI update
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1600)); // background sync
    setSyncing(false);
  };

  return (
    <>
      <style>{`@keyframes _btn-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button
          onClick={toggle}
          style={{
            ...BASE,
            background: liked ? color : '#fff',
            color: liked ? '#fff' : color,
            border: `2px solid ${color}`,
          }}
        >
          {liked ? '♥ Saved to wishlist' : '♡ Save to wishlist'}
        </button>
        <span style={{ fontSize: 12, color: '#bbb', height: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          {syncing && (
            <>
              <span style={{ width: 10, height: 10, border: '1.5px solid #ccc', borderTopColor: '#888', borderRadius: '50%', animation: '_btn-spin 0.7s linear infinite', display: 'inline-block' }} />
              Syncing…
            </>
          )}
        </span>
      </div>
    </>
  );
}

const meta = {
  title: 'Animations/Button Loading',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Five loading/feedback patterns for buttons. Each simulates a 1.8 s async operation. Click any button to see the cycle.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Spinner: Story = {
  name: 'Spinner — classic (Wilko)',
  parameters: { docs: { description: { story: '**Best for:** Add to basket, form submit. Universally understood. Shows a spinner + text change during loading, green confirmation on success.' } } },
  render: () => <DemoShell label="Click to trigger 1.8 s loading cycle"><SpinnerBtn /></DemoShell>,
};

export const Progress: Story = {
  name: 'Progress fill — bar (Homebase)',
  parameters: { docs: { description: { story: '**Best for:** Multi-step checkout, file upload, order processing. The fill bar communicates progress visually — feels deterministic even when it isn\'t.' } } },
  render: () => <DemoShell label="Click to trigger"><ProgressBtn /></DemoShell>,
};

export const Dots: Story = {
  name: 'Dots — bouncing',
  parameters: { docs: { description: { story: '**Best for:** Search, auto-save, background data fetch. Friendly and lightweight — less urgent than a spinner.' } } },
  render: () => <DemoShell label="Click to trigger"><DotsBtn /></DemoShell>,
};

export const Shimmer: Story = {
  name: 'Shimmer sweep — shine (The Range)',
  parameters: { docs: { description: { story: '**Best for:** Subscriptions, loyalty actions, "premium feel" CTAs. The light sweep reads as polish. Works best on solid-colour buttons with a brand colour.' } } },
  render: () => <DemoShell label="Click to trigger"><ShimmerBtn /></DemoShell>,
};

export const Optimistic: Story = {
  name: 'Optimistic UI — instant feedback',
  parameters: { docs: { description: { story: '**Best for:** Wishlist, like, follow, bookmark. The UI updates _instantly_ on click, then syncs in the background. Feels fastest of all the options. Requires the action to be reversible.' } } },
  render: () => <DemoShell label="Click to toggle — syncs in background"><OptimisticBtn /></DemoShell>,
};

export const AllVariants: Story = {
  name: 'All — side by side',
  parameters: { layout: 'padded', docs: { description: { story: 'All five variants rendered together for quick comparison.' } } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, padding: 32, justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Spinner</span>
        <SpinnerBtn />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Progress</span>
        <ProgressBtn />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Dots</span>
        <DotsBtn />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Shimmer</span>
        <ShimmerBtn />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Optimistic</span>
        <OptimisticBtn />
      </div>
    </div>
  ),
};
