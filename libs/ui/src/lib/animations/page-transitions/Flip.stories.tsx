import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { startVT, supportsVT, ViewTransition, UnsupportedBanner, BrandList, BrandDetail, type Brand } from '../_demo-shared';

interface Args {
  duration: number;
  perspective: number;
  axis: 'horizontal' | 'vertical';
}

function FlipDemo({ duration, perspective, axis }: Args) {
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.vtId = 'flip';
    el.textContent = `
      @keyframes _vt-flip-out { to   { transform: var(--vt-flip-r-out); opacity: 0; } }
      @keyframes _vt-flip-in  { from { transform: var(--vt-flip-r-in);  opacity: 0; } }
      ::view-transition-old(root) { animation: var(--vt-flip-half) ease-in                   both _vt-flip-out; }
      ::view-transition-new(root) { animation: var(--vt-flip-half) ease-out var(--vt-flip-half) both _vt-flip-in; }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    const half = `${Math.round(duration / 2)}ms`;
    const rotateOut = axis === 'horizontal' ? 'rotateY(90deg)' : 'rotateX(-90deg)';
    const rotateIn  = axis === 'horizontal' ? 'rotateY(-90deg)' : 'rotateX(90deg)';
    
    document.documentElement.style.setProperty('--vt-flip-half',  half);
    document.documentElement.style.setProperty('--vt-flip-r-out', `perspective(${perspective}px) ${rotateOut}`);
    document.documentElement.style.setProperty('--vt-flip-r-in',  `perspective(${perspective}px) ${rotateIn}`);
  }, [duration, perspective, axis]);

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
  title: 'Animations/Page Transitions/Flip',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** Pages flip like a physical card — the outgoing page rotates 90° away, then the incoming page rotates 90° in from the opposite side. Split timing creates a sharp midpoint.',
          '',
          '**Recommended for:** Brand/theme switchers, card-based UIs, high-impact product reveals, or anywhere the "reveal" metaphor adds meaning.',
          '',
          '**Tune it:** `Perspective` controls the sense of depth (600px = dramatic, 1200px = subtle). `Axis: vertical` creates a book-page feel; `horizontal` feels more like a card flip.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Duration (ms)',
      description: 'Total flip duration (split equally between exit and enter)',
      control: { type: 'range', min: 200, max: 900, step: 20 },
      table: { defaultValue: { summary: '500' } },
    },
    perspective: {
      name: 'Perspective (px)',
      description: 'Camera distance — lower = more dramatic 3D effect',
      control: { type: 'range', min: 400, max: 2000, step: 50 },
      table: { defaultValue: { summary: '800' } },
    },
    axis: {
      name: 'Flip Axis',
      control: 'radio',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
  },
  args: { duration: 500, perspective: 800, axis: 'horizontal' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Horizontal: Story = {
  name: 'Flip — horizontal (card flip)',
  render: (args) => <FlipDemo {...args} />,
};

export const Vertical: Story = {
  name: 'Flip — vertical (book page)',
  args: { axis: 'vertical', duration: 480, perspective: 900 },
  render: (args) => <FlipDemo {...args} />,
};

export const Fast: Story = {
  name: 'Flip — fast (220ms)',
  args: { duration: 220, perspective: 600 },
  render: (args) => <FlipDemo {...args} />,
};
