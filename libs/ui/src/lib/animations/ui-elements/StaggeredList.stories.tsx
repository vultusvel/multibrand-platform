import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BRANDS } from '../_demo-shared';

interface Args {
  duration: number;
  stagger: number;
  direction: 'up' | 'down' | 'left' | 'right';
  distance: number;
}

const ITEMS = [
  { id: 1, brand: BRANDS[0], label: 'New Arrivals',  count: 128 },
  { id: 2, brand: BRANDS[1], label: 'Best Sellers',  count: 84  },
  { id: 3, brand: BRANDS[2], label: 'Sale Items',    count: 212 },
  { id: 4, brand: BRANDS[0], label: 'Collections',   count: 56  },
  { id: 5, brand: BRANDS[1], label: 'Clearance',     count: 44  },
  { id: 6, brand: BRANDS[2], label: 'New Season',    count: 97  },
  { id: 7, brand: BRANDS[0], label: 'Trending',      count: 33  },
  { id: 8, brand: BRANDS[1], label: 'Editor Picks',  count: 19  },
];

const TRANSLATE: Record<string, string> = {
  up:    'translateY(VAR)',
  down:  'translateY(-VAR)',
  left:  'translateX(VAR)',
  right: 'translateX(-VAR)',
};

function StaggeredListDemo({ duration, stagger, direction, distance }: Args) {
  const [key, setKey] = useState(0);
  const translateFrom = TRANSLATE[direction].replace('VAR', `${distance}px`);
  const totalDuration = duration + stagger * (ITEMS.length - 1);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: 440, background: '#f5f5f5' }}>
      <style>{`
        @keyframes _stagger-in-${key} {
          from { opacity: 0; transform: ${translateFrom}; }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      <div style={{ background: '#1a1a1a', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Product Catalogue</span>
        <button
          onClick={() => setKey(k => k + 1)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}
        >
          ↺ Re-animate
        </button>
      </div>

      <div style={{ padding: '12px 40px', background: '#fff', borderBottom: '1px solid #eee', fontSize: 12, color: '#aaa' }}>
        Total duration: <strong style={{ color: '#1a1a1a' }}>{totalDuration}ms</strong> &nbsp;·&nbsp;
        Stagger: <strong style={{ color: '#1a1a1a' }}>{stagger}ms</strong> per item &nbsp;·&nbsp;
        Direction: <strong style={{ color: '#1a1a1a' }}>{direction}</strong>
      </div>

      <div style={{ padding: '28px 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {ITEMS.map((item, i) => (
          <div
            key={`${key}-${item.id}`}
            style={{
              background: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              animationName: `_stagger-in-${key}`,
              animationDuration: `${duration}ms`,
              animationDelay: `${i * stagger}ms`,
              animationFillMode: 'both',
              animationTimingFunction: 'cubic-bezier(0.2,0,0,1)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            } as React.CSSProperties}
          >
            <div style={{ height: 6, background: item.brand?.color }} />
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: item.brand?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {item.brand?.initial}
                </span>
                <span style={{ fontSize: 11, color: '#aaa' }}>{item.brand?.name}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{item.count} items</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Animations/UI Elements/Staggered List',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** List items animate in sequentially, each delayed by a fixed interval. Creates a flowing "cascade" effect that draws the eye across the content.',
          '',
          '**How it works:** Pure CSS `animation-delay: calc(index × stagger)` on each item. No JavaScript timing needed — the browser schedules each item independently.',
          '',
          '**Recommended for:** Product grids on page load, search results appearing, dashboard cards, any list where communicating "items are loading/arriving" adds clarity.',
          '',
          '**Tune it:** Click **Re-animate** to replay. Keep stagger ≤ 60ms for grids (avoids waiting); 80–120ms for hero lists (more dramatic).',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Item Duration (ms)',
      control: { type: 'range', min: 100, max: 700, step: 20 },
      table: { defaultValue: { summary: '400' } },
    },
    stagger: {
      name: 'Stagger Delay (ms)',
      description: 'Delay between each item starting',
      control: { type: 'range', min: 20, max: 200, step: 10 },
      table: { defaultValue: { summary: '60' } },
    },
    direction: {
      name: 'Direction',
      control: 'select',
      options: ['up', 'down', 'left', 'right'],
      table: { defaultValue: { summary: 'up' } },
    },
    distance: {
      name: 'Distance (px)',
      description: 'How far items travel from start to rest',
      control: { type: 'range', min: 8, max: 80, step: 4 },
      table: { defaultValue: { summary: '24' } },
    },
  },
  args: { duration: 400, stagger: 60, direction: 'up', distance: 24 },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Staggered List — slide up',
  render: (args) => <StaggeredListDemo {...args} />,
};

export const FromLeft: Story = {
  name: 'Staggered List — slide from left',
  args: { direction: 'left', stagger: 80, distance: 40 },
  render: (args) => <StaggeredListDemo {...args} />,
};

export const Tight: Story = {
  name: 'Staggered List — tight (30ms stagger)',
  args: { stagger: 30, duration: 300, distance: 16 },
  render: (args) => <StaggeredListDemo {...args} />,
};
