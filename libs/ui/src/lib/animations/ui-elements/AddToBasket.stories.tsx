import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { startVT, supportsVT, UnsupportedBanner, BRANDS } from '../_demo-shared';

interface Args {
  duration: number;
  easing: string;
  from: 'right' | 'bottom';
}

const PRODUCTS = [
  { id: 1, title: '6-Seater Garden Dining Set', price: '£499.99', was: '£699.99', brand: BRANDS[2], img: '🪑', badge: 'New' },
  { id: 2, title: 'Premium Storage Box 120L',   price: '£34.99',  was: null,       brand: BRANDS[0], img: '📦', badge: 'Best Seller' },
  { id: 3, title: 'Mosaic Bistro Table & Chairs',price: '£149.00', was: '£199.00', brand: BRANDS[1], img: '☕', badge: 'Sale' },
  { id: 4, title: 'Luxury Bath Towel Set',       price: '£39.99',  was: null,       brand: BRANDS[1], img: '🛁', badge: 'New' },
  { id: 5, title: 'LED Solar Garden Lights x10', price: '£19.99',  was: '£29.99',  brand: BRANDS[2], img: '💡', badge: 'Sale' },
  { id: 6, title: 'Heavy Duty Shelf Unit 5-Tier',price: '£69.99',  was: null,       brand: BRANDS[0], img: '🗄️', badge: null },
];

type Product = (typeof PRODUCTS)[number];

const PANEL_STYLE: Record<string, React.CSSProperties> = {
  right:  { top: 0, right: 0, bottom: 0, width: 340, borderRadius: 0,              boxShadow: '-4px 0 32px rgba(0,0,0,0.18)' },
  bottom: { bottom: 0, left: 0, right: 0, borderRadius: '16px 16px 0 0', maxHeight: '60%', boxShadow: '0 -4px 32px rgba(0,0,0,0.18)' },
};

function AddToBasketDemo({ duration, easing, from }: Args) {
  const [basket, setBasket] = useState<Product | null>(null);
  const [adding, setAdding] = useState<number | null>(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.vtId = 'atb';
    el.textContent = `
      @keyframes _vt-atb-in  { from { transform: var(--vt-atb-tfm); } }
      @keyframes _vt-atb-out { to   { transform: var(--vt-atb-tfm); } }
      @keyframes _vt-atb-backdrop-in  { from { opacity: 0; } }
      @keyframes _vt-atb-backdrop-out { to   { opacity: 0; } }

      ::view-transition-new(atb-panel)    { animation: var(--vt-atb-dur) var(--vt-atb-ease) both _vt-atb-in; }
      ::view-transition-old(atb-panel)    { animation: var(--vt-atb-dur) var(--vt-atb-ease) both _vt-atb-out; }
      ::view-transition-new(atb-backdrop) { animation: var(--vt-atb-dur) ease both _vt-atb-backdrop-in; }
      ::view-transition-old(atb-backdrop) { animation: var(--vt-atb-dur) ease both _vt-atb-backdrop-out; }
      ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--vt-atb-tfm',  from === 'right' ? 'translateX(100%)' : 'translateY(100%)');
    document.documentElement.style.setProperty('--vt-atb-dur',  `${duration}ms`);
    document.documentElement.style.setProperty('--vt-atb-ease', easing);
  }, [from, duration, easing]);

  const addToBasket = (p: Product) => {
    setAdding(p.id);
    setTimeout(() => {
      setAdding(null);
      startVT(() => setBasket(p));
    }, 600);
  };

  const close = () => startVT(() => setBasket(null));

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: 520, background: '#f5f5f5', position: 'relative', overflow: 'hidden' }}>
      {!supportsVT && <UnsupportedBanner />}

      <div style={{ background: '#1a1a1a', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>The Range</span>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          <span>Search</span>
          <span>Account</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>Basket (0)</span>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '10px 24px', borderBottom: '1px solid #eee', display: 'flex', gap: 10, fontSize: 13 }}>
        <span style={{ color: '#666' }}>8,018 Results</span>
        <span style={{ color: '#ccc' }}>|</span>
        {['Sort by', 'Category', 'Price', 'Brand', 'Rating'].map(f => (
          <button key={f} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'inherit' }}>
            {f} ▾
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {PRODUCTS.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ background: p.brand?.bg, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, position: 'relative' }}>
              {p.img}
              {p.badge && (
                <span style={{ position: 'absolute', top: 8, left: 8, background: p.badge === 'Sale' ? '#e74c3c' : p.badge === 'Best Seller' ? '#f39c12' : '#27ae60', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3 }}>
                  {p.badge}
                </span>
              )}
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 6, lineHeight: 1.35 }}>{p.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{p.price}</span>
                {p.was && <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>{p.was}</span>}
              </div>
              <div style={{ fontSize: 11, color: '#27ae60', marginBottom: 10 }}>● Available for delivery</div>
              <button
                onClick={() => addToBasket(p)}
                disabled={adding === p.id}
                style={{
                  width: '100%',
                  padding: '9px 0',
                  background: adding === p.id ? '#555' : '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: adding === p.id ? 'not-allowed' : 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  transition: 'background 200ms',
                }}
              >
                {adding === p.id ? 'Adding…' : 'Add to basket'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {basket && (
        <div
          onClick={close}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.35)',
            viewTransitionName: 'atb-backdrop',
          } as React.CSSProperties}
        />
      )}

      {basket && (
        <div
          style={{
            position: 'absolute',
            background: '#fff',
            overflow: 'auto',
            viewTransitionName: 'atb-panel',
            ...PANEL_STYLE[from],
          } as React.CSSProperties}
        >
          <div style={{ background: '#eaf7ee', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #d5eedd' }}>
            <span style={{ background: '#27ae60', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1a5c2a' }}>Item added to your basket</span>
            <button onClick={close} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666', lineHeight: 1 }}>×</button>
          </div>

          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 80, height: 80, background: basket.brand?.bg, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
                {basket.img}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 4, lineHeight: 1.35 }}>{basket.title}</div>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 10 }}>{basket.brand?.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <select style={{ fontSize: 13, border: '1px solid #ddd', borderRadius: 4, padding: '4px 8px' }}>
                    <option>1</option><option>2</option><option>3</option>
                  </select>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{basket.price}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid #f0f0f0', marginBottom: 16 }}>
              <span style={{ fontSize: 14, color: '#666' }}>Subtotal (1 item)</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{basket.price}</span>
            </div>
          </div>

          <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button style={{ padding: '14px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' }}>
              View Basket
            </button>
            <button onClick={close} style={{ padding: '13px', background: '#fff', color: '#1a1a1a', border: '2px solid #1a1a1a', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const meta = {
  title: 'Animations/UI Elements/Add to Basket',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** Clicking "Add to basket" on the PLP triggers a confirmation panel that slides in from the right (or bottom on mobile). The panel shows the added product, subtotal, and CTAs — without navigating away from the grid.',
          '',
          '**How it works:** The panel and backdrop each have a `view-transition-name`. They animate independently — panel slides, backdrop fades — leaving the product grid visible behind.',
          '',
          '**Recommended for:** All e-commerce brand sites in the platform. The "Continue Shopping" flow keeps users on PLP; "View Basket" navigates to checkout.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    from: {
      name: 'Panel direction',
      control: 'radio',
      options: ['right', 'bottom'],
      table: { defaultValue: { summary: 'right' } },
    },
    duration: {
      name: 'Duration (ms)',
      control: { type: 'range', min: 150, max: 600, step: 20 },
      table: { defaultValue: { summary: '320' } },
    },
    easing: {
      name: 'Easing',
      control: 'select',
      options: ['cubic-bezier(0.2,0,0,1)', 'ease-out', 'cubic-bezier(0.4,0,0.2,1)'],
      table: { defaultValue: { summary: 'cubic-bezier(0.2,0,0,1)' } },
    },
  },
  args: { from: 'right', duration: 320, easing: 'cubic-bezier(0.2,0,0,1)' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Desktop: Story = {
  name: 'Add to Basket — desktop (right panel)',
  render: (args) => <AddToBasketDemo {...args} />,
};

export const Mobile: Story = {
  name: 'Add to Basket — mobile (bottom sheet)',
  args: { from: 'bottom', duration: 340, easing: 'cubic-bezier(0.2,0,0,1)' },
  render: (args) => <AddToBasketDemo {...args} />,
};
