import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { startVT, supportsVT, UnsupportedBanner, BRANDS, type Brand } from '../_demo-shared';

interface Args {
  from: 'bottom' | 'right' | 'center';
  duration: number;
  easing: string;
}

const TRANSLATE_OUT: Record<string, string> = {
  bottom: 'translateY(100%)',
  right:  'translateX(100%)',
  center: 'scale(0.85)',
};

const DRAWER_STYLE: Record<string, React.CSSProperties> = {
  bottom: { bottom: 0, left: 0, right: 0, borderRadius: '16px 16px 0 0', maxHeight: '70%' },
  right:  { top: 0, right: 0, bottom: 0, width: 340, borderRadius: '16px 0 0 16px' },
  center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 420, borderRadius: 16, maxHeight: '80%' },
};

function ModalDrawerDemo({ from, duration, easing }: Args) {
  const [open, setOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState<Brand>(BRANDS[0]);

  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.vtId = 'modal-drawer';
    el.textContent = `
      @keyframes _vt-drawer-in  { from { transform: var(--vt-drawer-tfm); opacity: var(--vt-drawer-opacity); } }
      @keyframes _vt-drawer-out { to   { transform: var(--vt-drawer-tfm); opacity: var(--vt-drawer-opacity); } }
      @keyframes _vt-backdrop-in  { from { opacity: 0; } }
      @keyframes _vt-backdrop-out { to   { opacity: 0; } }
      ::view-transition-new(drawer)   { animation: var(--vt-drawer-dur) var(--vt-drawer-ease) both _vt-drawer-in;   }
      ::view-transition-old(drawer)   { animation: var(--vt-drawer-dur) var(--vt-drawer-ease) both _vt-drawer-out;  }
      ::view-transition-new(backdrop) { animation: var(--vt-drawer-dur) ease both _vt-backdrop-in;  }
      ::view-transition-old(backdrop) { animation: var(--vt-drawer-dur) ease both _vt-backdrop-out; }
      ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--vt-drawer-tfm',     TRANSLATE_OUT[from]);
    document.documentElement.style.setProperty('--vt-drawer-opacity', from === 'center' ? '0' : '1');
    document.documentElement.style.setProperty('--vt-drawer-dur',     `${duration}ms`);
    document.documentElement.style.setProperty('--vt-drawer-ease',    easing);
  }, [from, duration, easing]);

  const openDrawer  = () => startVT(() => setOpen(true));
  const closeDrawer = () => startVT(() => setOpen(false));

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: 440,
    background: '#f5f5f5',
    fontFamily: 'system-ui, sans-serif',
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      {!supportsVT && <UnsupportedBanner />}

      <div style={{ padding: 40 }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>
          Brand Platform
        </h2>
        <p style={{ color: '#999', margin: '0 0 28px', fontSize: 14 }}>
          Click the button to open the {from} drawer
        </p>

        <button
          onClick={openDrawer}
          style={{ padding: '12px 28px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}
        >
          Open {from === 'bottom' ? 'Bottom Drawer' : from === 'right' ? 'Side Panel' : 'Modal'}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 32 }}>
          {BRANDS.map(b => (
            <div key={b.slug} style={{ background: '#fff', borderRadius: 10, padding: 16, borderLeft: `3px solid ${b.color}` }}>
              <span style={{ fontWeight: 600, color: b.color, fontSize: 14 }}>{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div
          onClick={closeDrawer}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            viewTransitionName: 'backdrop',
          } as React.CSSProperties}
        />
      )}

      {open && (
        <div
          style={{
            position: 'absolute',
            background: '#fff',
            overflow: 'auto',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.2)',
            viewTransitionName: 'drawer',
            ...DRAWER_STYLE[from],
          } as React.CSSProperties}
        >
          {from === 'bottom' && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: '#ddd' }} />
            </div>
          )}

          <div style={{ padding: '20px 28px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>Select Brand</h3>
              <button
                onClick={closeDrawer}
                style={{ background: '#f0f0f0', border: 'none', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#666' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {BRANDS.map(b => (
                <button
                  key={b.slug}
                  onClick={() => { setActiveBrand(b); closeDrawer(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    background: b.slug === activeBrand.slug ? b.bg : '#fafafa',
                    border: `2px solid ${b.slug === activeBrand.slug ? b.color : 'transparent'}`,
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ width: 36, height: 36, borderRadius: '50%', background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                    {b.initial}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, color: b.color, fontSize: 14 }}>{b.name}</div>
                    <div style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>Browse {b.name} products</div>
                  </div>
                  {b.slug === activeBrand.slug && (
                    <span style={{ marginLeft: 'auto', color: b.color, fontSize: 18 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const meta = {
  title: 'Animations/UI Elements/Modal & Drawer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** A contextual panel slides in from the bottom (drawer), right (side panel), or scales up from centre (modal). Both the panel and backdrop animate independently via named view transitions.',
          '',
          '**How it works:** The panel element has `view-transition-name: drawer`; the backdrop has `view-transition-name: backdrop`. Each gets its own CSS animation — the panel slides, the backdrop fades — without a full-page snapshot.',
          '',
          '**Recommended for:** Brand/filter selectors, cart drawers, settings panels, confirmation modals.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    from: {
      name: 'Open from',
      control: 'radio',
      options: ['bottom', 'right', 'center'],
      table: { defaultValue: { summary: 'bottom' } },
    },
    duration: {
      name: 'Duration (ms)',
      control: { type: 'range', min: 100, max: 600, step: 20 },
      table: { defaultValue: { summary: '340' } },
    },
    easing: {
      name: 'Easing',
      control: 'select',
      options: ['cubic-bezier(0.2,0,0,1)', 'ease-out', 'cubic-bezier(0.4,0,0.2,1)', 'cubic-bezier(0.34,1.56,0.64,1)'],
      table: { defaultValue: { summary: 'cubic-bezier(0.2,0,0,1)' } },
    },
  },
  args: { from: 'bottom', duration: 340, easing: 'cubic-bezier(0.2,0,0,1)' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const BottomDrawer: Story = {
  name: 'Drawer — bottom sheet',
  render: (args) => <ModalDrawerDemo {...args} />,
};

export const SidePanel: Story = {
  name: 'Drawer — side panel (right)',
  args: { from: 'right', easing: 'cubic-bezier(0.4,0,0.2,1)' },
  render: (args) => <ModalDrawerDemo {...args} />,
};

export const Modal: Story = {
  name: 'Modal — centre scale',
  args: { from: 'center', duration: 260, easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
  render: (args) => <ModalDrawerDemo {...args} />,
};
