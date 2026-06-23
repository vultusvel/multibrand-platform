import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { startVT, supportsVT, UnsupportedBanner, BRANDS } from '../_demo-shared';

interface Args {
  duration: number;
  easing: string;
  width: number;
}

const FILTERS = {
  Category: ['Garden Furniture', 'Storage', 'Lighting', 'BBQ & Grills', 'Plants & Pots', 'Tools'],
  Brand: BRANDS.map(b => b.name),
  Price: ['Under £25', '£25 – £50', '£50 – £100', '£100 – £250', 'Over £250'],
  Rating: ['★★★★★ (5)', '★★★★☆ (4+)', '★★★☆☆ (3+)'],
  Availability: ['In Stock', 'Available for Delivery', 'Available Click & Collect'],
};

const PRODUCTS = [
  { emoji: '🪑', title: '6-Seater Rattan Dining Set', price: '£499.99', was: '£699.99', rating: 5, reviews: 124 },
  { emoji: '🏮', title: 'Solar Garden String Lights', price: '£19.99',  was: null,      rating: 4, reviews: 56  },
  { emoji: '📦', title: 'Premium Storage Box 120L',  price: '£34.99',  was: null,      rating: 4, reviews: 89  },
  { emoji: '🌿', title: 'Large Artificial Olive Tree',price: '£79.00',  was: '£99.00', rating: 5, reviews: 31  },
  { emoji: '☕', title: 'Mosaic Bistro Set 3pc',     price: '£149.00', was: '£199.00', rating: 4, reviews: 17  },
  { emoji: '💡', title: 'LED Patio Heater 2100W',   price: '£129.99', was: null,      rating: 3, reviews: 44  },
];

function FilterSidebarDemo({ duration, easing, width }: Args) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Category', 'Brand', 'Price']));

  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.vtId = 'filter-sidebar';
    el.textContent = `
      @keyframes _vt-fs-in  { from { transform: translateX(-100%); } }
      @keyframes _vt-fs-out { to   { transform: translateX(-100%); } }
      @keyframes _vt-fs-bd-in  { from { opacity: 0; } }
      @keyframes _vt-fs-bd-out { to   { opacity: 0; } }
      
      ::view-transition-new(filter-sidebar)  { animation: var(--vt-fs-dur) var(--vt-fs-ease) both _vt-fs-in; }
      ::view-transition-old(filter-sidebar)  { animation: var(--vt-fs-dur) var(--vt-fs-ease) both _vt-fs-out; }
      ::view-transition-new(filter-backdrop) { animation: var(--vt-fs-dur) ease both _vt-fs-bd-in; }
      ::view-transition-old(filter-backdrop) { animation: var(--vt-fs-dur) ease both _vt-fs-bd-out; }
      ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--vt-fs-dur',  `${duration}ms`);
    document.documentElement.style.setProperty('--vt-fs-ease', easing);
  }, [duration, easing]);

  const openSidebar  = () => startVT(() => setOpen(true));
  const closeSidebar = () => startVT(() => setOpen(false));

  const toggle = (group: string, value: string) => {
    setSelected(prev => {
      const next = { ...prev };
      const set = new Set(next[group] ?? []);
      set.has(value) ? set.delete(value) : set.add(value);
      next[group] = set;
      return next;
    });
  };

  const toggleExpand = (group: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });
  };

  const totalSelected = Object.values(selected).reduce((sum, s) => sum + s.size, 0);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: 520, background: '#f5f5f5', position: 'relative', overflow: 'hidden' }}>
      {!supportsVT && <UnsupportedBanner />}

      <div style={{ background: '#1a1a1a', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Brand Platform</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Garden & Outdoors</span>
      </div>

      <div style={{ background: '#fff', padding: '12px 24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={openSidebar}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: totalSelected > 0 ? '#1a1a1a' : '#fff', color: totalSelected > 0 ? '#fff' : '#1a1a1a', border: '1px solid #1a1a1a', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}
        >
          ⚙ Filters {totalSelected > 0 && `(${totalSelected})`}
        </button>
        <span style={{ fontSize: 13, color: '#666' }}>8,018 Results</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {['Sort by', 'Price', 'Rating'].map(f => (
            <button key={f} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', fontSize: 12, color: '#555', fontFamily: 'inherit' }}>{f} ▾</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {PRODUCTS.map((p, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
            <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, background: '#fafafa' }}>{p.emoji}</div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: '#f5a623', marginBottom: 6 }}>{'★'.repeat(p.rating)}{'☆'.repeat(5 - p.rating)} <span style={{ color: '#999' }}>({p.reviews})</span></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{p.price}</span>
                {p.was && <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through', alignSelf: 'center' }}>{p.was}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div
          onClick={closeSidebar}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', viewTransitionName: 'filter-backdrop' } as React.CSSProperties}
        />
      )}

      {open && (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            width,
            background: '#fff',
            overflow: 'auto',
            boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
            viewTransitionName: 'filter-sidebar',
            display: 'flex',
            flexDirection: 'column',
          } as React.CSSProperties}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Filters {totalSelected > 0 && <span style={{ fontSize: 13, color: '#888', fontWeight: 400 }}>({totalSelected} selected)</span>}</span>
            <button onClick={closeSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#666', lineHeight: 1 }}>×</button>
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {Object.entries(FILTERS).map(([group, options]) => (
              <div key={group} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <button
                  onClick={() => toggleExpand(group)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}
                >
                  <span>{group} {selected[group]?.size ? <span style={{ color: '#888', fontSize: 12, fontWeight: 400 }}>({selected[group].size})</span> : null}</span>
                  <span style={{ fontSize: 12, color: '#aaa', transition: 'transform 200ms', transform: expanded.has(group) ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▼</span>
                </button>
                {expanded.has(group) && (
                  <div style={{ padding: '4px 20px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {options.map(opt => {
                      const checked = selected[group]?.has(opt) ?? false;
                      return (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#333' }}>
                          <span style={{ width: 18, height: 18, borderRadius: 3, border: `2px solid ${checked ? '#1a1a1a' : '#ccc'}`, background: checked ? '#1a1a1a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 150ms' }} onClick={() => toggle(group, opt)}>
                            {checked && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
                          </span>
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ padding: '16px 20px', borderTop: '1px solid #eee', flexShrink: 0 }}>
            <button
              onClick={closeSidebar}
              style={{ width: '100%', padding: '13px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' }}
            >
              Apply Filters {totalSelected > 0 && `(${totalSelected})`}
            </button>
            {totalSelected > 0 && (
              <button
                onClick={() => setSelected({})}
                style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', marginTop: 6, fontFamily: 'inherit' }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const meta = {
  title: 'Animations/UI Elements/Filter Sidebar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** A filter panel slides in from the left without navigating away from the product grid. Backdrop fades in behind it. Closing applies the selection and slides the panel back out.',
          '',
          '**How it works:** Two named elements — `filter-sidebar` (slides) and `filter-backdrop` (fades) — animate independently via View Transitions. The product grid stays in place.',
          '',
          '**Recommended for:** PLP pages across all brands. Can be adapted to show brand-specific colour accents on checkbox states and the Apply button.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Duration (ms)',
      control: { type: 'range', min: 150, max: 600, step: 20 },
      table: { defaultValue: { summary: '300' } },
    },
    easing: {
      name: 'Easing',
      control: 'select',
      options: ['cubic-bezier(0.2,0,0,1)', 'ease-out', 'cubic-bezier(0.4,0,0.2,1)'],
      table: { defaultValue: { summary: 'cubic-bezier(0.2,0,0,1)' } },
    },
    width: {
      name: 'Sidebar width (px)',
      control: { type: 'range', min: 240, max: 400, step: 10 },
      table: { defaultValue: { summary: '300' } },
    },
  },
  args: { duration: 300, easing: 'cubic-bezier(0.2,0,0,1)', width: 300 },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Filter Sidebar — slide from left',
  render: (args) => <FilterSidebarDemo {...args} />,
};

export const Wide: Story = {
  name: 'Filter Sidebar — wide (360px)',
  args: { width: 360, duration: 340 },
  render: (args) => <FilterSidebarDemo {...args} />,
};
