import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { startVT, supportsVT, ViewTransition, UnsupportedBanner, BRANDS, type Brand } from '../_demo-shared';

interface Args {
  duration: number;
  easing: string; 
}

function SharedElementDemo({ duration, easing }: Args) {
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.vtId = 'shared';
    el.textContent = `
      @keyframes _vt-fade-in  { from { opacity: 0; } }
      @keyframes _vt-fade-out { to   { opacity: 0; } }

      ::view-transition-old(root) { animation: var(--vt-shared-root-dur) ease both _vt-fade-out; }
      ::view-transition-new(root) { animation: var(--vt-shared-root-dur) ease var(--vt-shared-root-delay) both _vt-fade-in; }

      ::view-transition-group(*) {
        animation-duration: var(--vt-shared-dur);
        animation-timing-function: var(--vt-shared-ease);
      }
      ::view-transition-image-pair(*) { isolation: isolate; }
      ::view-transition-old(*) { animation: var(--vt-shared-el-dur) ease both _vt-fade-out; }
      ::view-transition-new(*) { animation: var(--vt-shared-el-dur) ease var(--vt-shared-el-delay) both _vt-fade-in; }

      ::view-transition-old(root) { animation: var(--vt-shared-root-dur) ease both _vt-fade-out; }
      ::view-transition-new(root) { animation: var(--vt-shared-root-dur) ease var(--vt-shared-root-delay) both _vt-fade-in; }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--vt-shared-dur',        `${duration}ms`);
    document.documentElement.style.setProperty('--vt-shared-ease',        easing);
    document.documentElement.style.setProperty('--vt-shared-root-dur',   `${duration * 0.6}ms`);
    document.documentElement.style.setProperty('--vt-shared-root-delay', `${duration * 0.2}ms`);
    document.documentElement.style.setProperty('--vt-shared-el-dur',     `${Math.round(duration * 0.4)}ms`);
    document.documentElement.style.setProperty('--vt-shared-el-delay',   `${Math.round(duration * 0.6)}ms`);
  }, [duration, easing]);

  const nav = (fn: () => void) => startVT(fn);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {!supportsVT && <UnsupportedBanner />}
      <ViewTransition>
      {brand ? (
        // ── Detail view ──────────────────────────────────────────────────────
        <div style={{ background: '#f5f5f5', minHeight: 440 }}>
          {/* Same view-transition-name as the card in list view → morph! */}
          <div
            style={{
              background: brand.color,
              padding: '16px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              viewTransitionName: `brand-${brand.slug}`,
            } as React.CSSProperties}
          >
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{brand.name}</span>
            <button
              onClick={() => nav(() => setBrand(null))}
              style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            >
              ← Back
            </button>
          </div>
          <div style={{ padding: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {['New Arrivals', 'Best Sellers', 'Sale'].map((label) => (
                <div key={label} style={{ background: '#fff', borderRadius: 10, padding: 20, borderTop: `3px solid ${brand.color}` }}>
                  <h3 style={{ margin: '0 0 6px', color: '#1a1a1a', fontSize: 15, fontWeight: 600 }}>{label}</h3>
                  <p style={{ margin: 0, color: '#999', fontSize: 13 }}>Browse {label.toLowerCase()} at {brand.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // ── List view ────────────────────────────────────────────────────────
        <div style={{ padding: 40, background: '#f5f5f5', minHeight: 440 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>
            Multibrand Platform
          </h1>
          <p style={{ color: '#999', margin: '0 0 28px', fontSize: 13 }}>
            Click a brand — the card morphs into the header
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {BRANDS.map((b) => (
              <button
                key={b.slug}
                onClick={() => nav(() => setBrand(b))}
                style={{
                  background: b.color,
                  border: 'none',
                  borderRadius: 12,
                  padding: '20px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  textAlign: 'left',
                  // This element morphs into the brand header above ↑
                  viewTransitionName: `brand-${b.slug}`,
                } as React.CSSProperties}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {b.initial}
                </span>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      </ViewTransition>
    </div>
  );
}

const meta = {
  title: 'Animations/Page Transitions/Shared Element',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** A specific element (here: the brand card) smoothly morphs into a different element on the target page (the brand header). Position, size, border-radius, and color all interpolate simultaneously.',
          '',
          '**How it works:** Both elements share the same `view-transition-name` CSS property. The browser captures a screenshot of each and cross-interpolates the geometry automatically — no keyframe animation needed.',
          '',
          '**Recommended for:** Product cards expanding to detail views, thumbnails becoming hero images, modal-open flows. The most visually impressive option — highest client appeal.',
          '',
          '**Trade-off:** Each morphing element needs a unique name per item (e.g. `brand-wilko`, `brand-homebase`). Manageable but adds a small naming convention.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Duration (ms)',
      description: 'Morph animation duration',
      control: { type: 'range', min: 200, max: 900, step: 20 },
      table: { defaultValue: { summary: '420' } },
    },
    easing: {
      name: 'Easing',
      description: 'Applied to the geometry interpolation',
      control: 'select',
      options: ['cubic-bezier(0.4,0,0.2,1)', 'ease-in-out', 'ease-out', 'cubic-bezier(0.34,1.56,0.64,1)', 'linear'],
      table: { defaultValue: { summary: 'cubic-bezier(0.4,0,0.2,1)' } },
    },
  },
  args: { duration: 420, easing: 'cubic-bezier(0.4,0,0.2,1)' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Shared Element — morph (recommended)',
  render: (args) => <SharedElementDemo {...args} />,
};

export const SpringBounce: Story = {
  name: 'Shared Element — spring bounce',
  args: { duration: 520, easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
  render: (args) => <SharedElementDemo {...args} />,
};

export const Snappy: Story = {
  name: 'Shared Element — snappy (220 ms)',
  args: { duration: 220, easing: 'ease-out' },
  render: (args) => <SharedElementDemo {...args} />,
};
