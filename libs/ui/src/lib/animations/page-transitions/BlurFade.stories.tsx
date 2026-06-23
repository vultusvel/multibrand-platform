import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { startVT, supportsVT, ViewTransition, UnsupportedBanner, BrandList, BrandDetail, type Brand } from '../_demo-shared';

interface Args {
  duration: number;
  blur: number;
  easing: string;
}

function BlurFadeDemo({ duration, blur, easing }: Args) {
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.vtId = 'blur-fade';
    el.textContent = `
      @keyframes _vt-blur-out { to   { opacity: 0; filter: blur(var(--vt-blur-px)); transform: scale(1.03); } }
      @keyframes _vt-blur-in  { from { opacity: 0; filter: blur(var(--vt-blur-px)); transform: scale(0.97); } }
      ::view-transition-old(root) { animation: var(--vt-blur-dur) var(--vt-blur-ease) both _vt-blur-out; }
      ::view-transition-new(root) { animation: var(--vt-blur-dur) var(--vt-blur-ease) both _vt-blur-in;  }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--vt-blur-px',   `${blur}px`);
    document.documentElement.style.setProperty('--vt-blur-dur',  `${duration}ms`);
    document.documentElement.style.setProperty('--vt-blur-ease', easing);
  }, [duration, blur, easing]);

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
  title: 'Animations/Page Transitions/Blur Fade',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** Pages dissolve through a gaussian blur — the outgoing page blurs out while the incoming page sharpens in. Adds a tactile, depth-of-field quality to navigation.',
          '',
          '**Recommended for:** Image-heavy pages, editorial/lifestyle content, brand storytelling, and anywhere you want a premium "focus shift" feel.',
          '',
          '**Tune it:** Increase `Blur (px)` for a dreamier transition; pair with a longer duration. For product UIs, 6–10 px at 280ms feels polished without being slow.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Duration (ms)',
      control: { type: 'range', min: 100, max: 800, step: 20 },
      table: { defaultValue: { summary: '320' } },
    },
    blur: {
      name: 'Blur (px)',
      description: 'Gaussian blur radius at peak transition',
      control: { type: 'range', min: 2, max: 40, step: 1 },
      table: { defaultValue: { summary: '10' } },
    },
    easing: {
      name: 'Easing',
      control: 'select',
      options: ['ease-in-out', 'ease-out', 'ease', 'cubic-bezier(0.4,0,0.2,1)', 'linear'],
      table: { defaultValue: { summary: 'ease-in-out' } },
    },
  },
  args: { duration: 320, blur: 10, easing: 'ease-in-out' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Blur Fade — default (320ms, 10px)',
  render: (args) => <BlurFadeDemo {...args} />,
};

export const Heavy: Story = {
  name: 'Blur Fade — heavy (500ms, 24px)',
  args: { duration: 500, blur: 24, easing: 'ease-in-out' },
  render: (args) => <BlurFadeDemo {...args} />,
};

export const Snappy: Story = {
  name: 'Blur Fade — snappy (160ms, 6px)',
  args: { duration: 160, blur: 6, easing: 'ease-out' },
  render: (args) => <BlurFadeDemo {...args} />,
};
