import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import {
  startVT,
  supportsVT,
  ViewTransition,
  UnsupportedBanner,
  BrandList,
  BrandDetail,
  type Brand,
} from '../_demo-shared';

interface Args {
  duration: number;
  easing: string;
}

function FadeDemo({ duration, easing }: Args) {
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.vtId = 'fade';
    el.textContent = `
      @keyframes _vt-fade-out { to   { opacity: 0; } }
      @keyframes _vt-fade-in  { from { opacity: 0; } }
      ::view-transition-old(root) { animation: ${duration}ms ${easing} both _vt-fade-out; }
      ::view-transition-new(root) { animation: ${duration}ms ${easing} both _vt-fade-in;  }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, [duration, easing]);

  const nav = (fn: () => void) => startVT(fn);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {!supportsVT && <UnsupportedBanner />}
      <ViewTransition>
        {brand
          ? <BrandDetail brand={brand} onBack={() => nav(() => setBrand(null))} />
          : <BrandList onSelect={(b) => nav(() => setBrand(b))} />}
      </ViewTransition>
    </div>
  );
}

const meta = {
  title: 'Animations/Page Transitions/Fade',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** Both pages cross-dissolve through opacity — the old page fades to 0 while the new page fades in from 0.',
          '',
          '**Recommended for:** Universal fallback, content-heavy pages, or when direction has no meaning (e.g. settings → profile).',
          '',
          '**Tune it:** Drag the Duration slider. Below ~150 ms it feels instant; above ~450 ms it starts to feel sluggish. `ease-in-out` is the standard recommendation.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Duration (ms)',
      description: 'Total fade duration in milliseconds',
      control: { type: 'range', min: 80, max: 700, step: 20 },
      table: { defaultValue: { summary: '300' } },
    },
    easing: {
      name: 'Easing',
      description: 'CSS easing function applied to both fade-out and fade-in',
      control: 'select',
      options: ['ease', 'ease-in-out', 'ease-in', 'ease-out', 'linear', 'cubic-bezier(0.4,0,0.2,1)'],
      table: { defaultValue: { summary: 'ease-in-out' } },
    },
  },
  args: { duration: 300, easing: 'ease-in-out' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Fade — default (300 ms)',
  render: (args) => <FadeDemo {...args} />,
};

export const Snappy: Story = {
  name: 'Fade — snappy (150 ms)',
  args: { duration: 150, easing: 'ease-out' },
  render: (args) => <FadeDemo {...args} />,
};

export const Slow: Story = {
  name: 'Fade — slow for review (600 ms)',
  args: { duration: 600, easing: 'ease-in-out' },
  render: (args) => <FadeDemo {...args} />,
};
