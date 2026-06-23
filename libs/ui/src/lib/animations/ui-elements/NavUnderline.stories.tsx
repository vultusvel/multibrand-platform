import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { startVT, BRANDS } from '../_demo-shared';

interface Args {
  duration: number;
  easing: string;
  underlineHeight: number;
  underlineColor: string;
}

const NAV_ITEMS = ['All Brands', ...BRANDS.map(b => b.name)];

const BRAND_MAP: Record<string, { color: string; bg: string }> = {
  'All Brands': { color: '#1a1a1a', bg: '#f5f5f5' },
  'Wilko':      { color: '#9d2235', bg: '#fff5f5' },
  'Homebase':   { color: '#089c49', bg: '#f0faf4' },
  'Bathstore':  { color: '#0da0cc', bg: '#f0f8ff' },
  'The Range':  { color: '#f53e24', bg: '#fff8f7' },
};

function NavUnderlineDemo({ duration, easing, underlineHeight, underlineColor }: Args) {
  const [active, setActive] = useState('All Brands');

  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.vtId = 'nav-underline';
    el.textContent = `
      ::view-transition-group(nav-underline) {
        animation-duration: var(--vt-nav-dur);
        animation-timing-function: var(--vt-nav-ease);
      }
      ::view-transition-old(root), ::view-transition-new(root) {
        animation: none;
        mix-blend-mode: normal;
      }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--vt-nav-dur',  `${duration}ms`);
    document.documentElement.style.setProperty('--vt-nav-ease', easing);
  }, [duration, easing]);

  const nav = (item: string) => startVT(() => setActive(item));
  const { color, bg } = BRAND_MAP[active];
  const displayColor = underlineColor === 'brand' ? color : underlineColor;

  const CONTENT: Record<string, string[]> = {
    'All Brands':  ['Wilko', 'Homebase', 'Bathstore', 'The Range'],
    'Wilko':       ['Garden Tools', 'Home Decor', 'Cleaning', 'Storage'],
    'Homebase':    ['Paints', 'Flooring', 'Kitchens', 'Bathrooms'],
    'Bathstore':   ['Showers', 'Baths', 'Taps', 'Tiles'],
    'The Range':   ['Furniture', 'Lighting', 'Art', 'Crafts'],
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: 440 }}>
      {/* Nav bar */}
      <nav style={{
        display: 'flex',
        background: '#fff',
        borderBottom: '1px solid #eee',
        paddingLeft: 24,
        position: 'relative',
      }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item}
            onClick={() => nav(item)}
            style={{
              position: 'relative',
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: active === item ? 700 : 400,
              color: active === item ? displayColor : '#888',
              transition: `color ${duration}ms ${easing}`,
              whiteSpace: 'nowrap',
            }}
          >
            {item}
            {active === item && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: underlineHeight,
                  background: displayColor,
                  borderRadius: `${underlineHeight}px ${underlineHeight}px 0 0`,
                  viewTransitionName: 'nav-underline',
                } as React.CSSProperties}
              />
            )}
          </button>
        ))}
      </nav>

      <div style={{ background: bg, padding: 40, transition: `background 400ms ease` }}>
        <h2 style={{ margin: '0 0 8px', color, fontSize: 20, fontWeight: 700 }}>{active}</h2>
        <p style={{ margin: '0 0 28px', color: '#999', fontSize: 13 }}>
          Browse {active === 'All Brands' ? 'all brands' : `${active} categories`}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {CONTENT[active].map(label => (
            <div
              key={label}
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: '18px 20px',
                borderLeft: `4px solid ${displayColor}`,
                fontSize: 14,
                fontWeight: 600,
                color: '#1a1a1a',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Animations/UI Elements/Nav Underline',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** A coloured underline indicator slides smoothly between active navigation items. The browser interpolates position and width automatically via `view-transition-name`.',
          '',
          '**How it works:** The underline `<span>` lives inside the currently active tab. On switch, the View Transitions API captures its old bounding box, renders it at the new position, and morphs between the two — no JS position calculation needed.',
          '',
          '**Recommended for:** Top-level brand/category navigation, tabbed content areas, filter bars.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Slide Duration (ms)',
      control: { type: 'range', min: 80, max: 600, step: 10 },
      table: { defaultValue: { summary: '300' } },
    },
    easing: {
      name: 'Easing',
      control: 'select',
      options: ['cubic-bezier(0.4,0,0.2,1)', 'ease-out', 'ease-in-out', 'cubic-bezier(0.34,1.56,0.64,1)', 'linear'],
      table: { defaultValue: { summary: 'cubic-bezier(0.4,0,0.2,1)' } },
    },
    underlineHeight: {
      name: 'Underline height (px)',
      control: { type: 'range', min: 2, max: 6, step: 1 },
      table: { defaultValue: { summary: '3' } },
    },
    underlineColor: {
      name: 'Colour',
      control: 'select',
      options: ['brand', '#1a1a1a', '#6366f1', '#f53e24'],
      table: { defaultValue: { summary: 'brand' } },
    },
  },
  args: { duration: 300, easing: 'cubic-bezier(0.4,0,0.2,1)', underlineHeight: 3, underlineColor: 'brand' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Nav Underline — brand colours',
  render: (args) => <NavUnderlineDemo {...args} />,
};

export const Springy: Story = {
  name: 'Nav Underline — spring bounce',
  args: { easing: 'cubic-bezier(0.34,1.56,0.64,1)', duration: 400, underlineHeight: 4 },
  render: (args) => <NavUnderlineDemo {...args} />,
};

export const Thick: Story = {
  name: 'Nav Underline — thick bar',
  args: { underlineHeight: 6, duration: 280, underlineColor: '#1a1a1a' },
  render: (args) => <NavUnderlineDemo {...args} />,
};
