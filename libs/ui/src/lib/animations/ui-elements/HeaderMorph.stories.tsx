import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { startVT, supportsVT, ViewTransition, UnsupportedBanner, BRANDS, type Brand } from '../_demo-shared';

interface Args {
  duration: number;
  easing: string;
}

const CATEGORIES = ['New Arrivals', 'Best Sellers', 'Sale', 'Collections'];

function HeaderMorphDemo({ duration, easing }: Args) {
  const [brand, setBrand] = useState<Brand>(BRANDS[0]);

  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.vtId = 'header-morph';
    el.textContent = `
      @keyframes _vt-hdr-out { to   { opacity: 0; transform: scale(0.98); } }
      @keyframes _vt-hdr-in  { from { opacity: 0; transform: scale(1.02); } }
      
      ::view-transition-group(page-header) {
        animation-duration: var(--vt-hdr-group-dur);
        animation-timing-function: var(--vt-hdr-group-ease);
      }
      ::view-transition-image-pair(page-header) { isolation: isolate; }
      ::view-transition-old(page-header) { animation: var(--vt-hdr-out-dur) ease-out both _vt-hdr-out; }
      ::view-transition-new(page-header) { animation: var(--vt-hdr-in-dur) ease-out var(--vt-hdr-in-delay) both _vt-hdr-in; }
      ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--vt-hdr-group-dur',   `${duration}ms`);
    document.documentElement.style.setProperty('--vt-hdr-group-ease',   easing);
    document.documentElement.style.setProperty('--vt-hdr-out-dur',     `${Math.round(duration * 0.45)}ms`);
    document.documentElement.style.setProperty('--vt-hdr-in-dur',      `${Math.round(duration * 0.55)}ms`);
    document.documentElement.style.setProperty('--vt-hdr-in-delay',    `${Math.round(duration * 0.35)}ms`);
  }, [duration, easing]);

  const switchBrand = (b: Brand) => startVT(() => setBrand(b));

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: 440 }}>
      {!supportsVT && <UnsupportedBanner />}

      <ViewTransition>
        <header
          style={{
            background: brand.color,
            padding: '20px 40px 28px',
            viewTransitionName: 'page-header',
          } as React.CSSProperties}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>
                {brand.initial}
              </span>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{brand.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 3 }}>Brand Platform</div>
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Switch brand ↓</div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <span key={cat} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer' }}>
                {cat}
              </span>
            ))}
          </div>
        </header>
      </ViewTransition>

      <div style={{ padding: '20px 40px', background: '#f5f5f5', borderBottom: '1px solid #eee' }}>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Switch brand
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {BRANDS.map(b => (
            <button
              key={b.slug}
              onClick={() => switchBrand(b)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 8,
                border: `2px solid ${b.slug === brand.slug ? b.color : 'transparent'}`,
                background: b.slug === brand.slug ? b.bg : '#fff',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: b.slug === brand.slug ? 700 : 400,
                color: b.color,
                transition: 'border-color 200ms',
              }}
            >
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {b.initial}
              </span>
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {CATEGORIES.map(cat => (
          <div key={cat} style={{ background: '#fff', borderRadius: 10, padding: 20, borderTop: `3px solid ${brand.color}` }}>
            <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: 14, marginBottom: 6 }}>{cat}</div>
            <div style={{ color: '#aaa', fontSize: 12 }}>Browse at {brand.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Animations/UI Elements/Header Morph',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** The entire page header — background colour, logo, and navigation — morphs smoothly when switching between brands. The element keeps `view-transition-name: page-header`; the browser handles geometry and cross-dissolve automatically.',
          '',
          '**How it works:** Only the header element is named; the rest of the page updates instantly. This focuses attention on the brand change and feels far more intentional than a full-page transition.',
          '',
          '**Recommended for:** Multi-brand platforms, theme switchers, tenant-customised apps.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Duration (ms)',
      control: { type: 'range', min: 150, max: 800, step: 20 },
      table: { defaultValue: { summary: '400' } },
    },
    easing: {
      name: 'Easing',
      control: 'select',
      options: ['ease-out', 'ease-in-out', 'cubic-bezier(0.4,0,0.2,1)', 'cubic-bezier(0.34,1.56,0.64,1)', 'ease'],
      table: { defaultValue: { summary: 'ease-out' } },
    },
  },
  args: { duration: 400, easing: 'ease-out' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Header Morph — brand switch',
  render: (args) => <HeaderMorphDemo {...args} />,
};

export const Slow: Story = {
  name: 'Header Morph — slow for review (700ms)',
  args: { duration: 700, easing: 'ease-in-out' },
  render: (args) => <HeaderMorphDemo {...args} />,
};

export const Springy: Story = {
  name: 'Header Morph — spring bounce',
  args: { duration: 500, easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
  render: (args) => <HeaderMorphDemo {...args} />,
};
