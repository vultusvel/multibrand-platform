import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { startVT, supportsVT, ViewTransition, UnsupportedBanner, BrandList, BrandDetail, type Brand } from '../_demo-shared';

interface Args {
  duration: number;
  easing: string;
  scaleDown: number;
  scaleUp: number;
}

function ScaleDemo({ duration, easing, scaleDown, scaleUp }: Args) {
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.vtId = 'scale';
    el.textContent = `
      @keyframes _vt-scale-out { to   { transform: scale(var(--vt-scale-down)); opacity: 0; } }
      @keyframes _vt-scale-in  { from { transform: scale(var(--vt-scale-up));   opacity: 0; } }
      
      ::view-transition-old(root) { animation: var(--vt-scale-dur) var(--vt-scale-ease) both _vt-scale-out; }
      ::view-transition-new(root) { animation: var(--vt-scale-dur) var(--vt-scale-ease) both _vt-scale-in;  }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--vt-scale-down', String(scaleDown));
    document.documentElement.style.setProperty('--vt-scale-up',   String(scaleUp));
    document.documentElement.style.setProperty('--vt-scale-dur',  `${duration}ms`);
    document.documentElement.style.setProperty('--vt-scale-ease', easing);
  }, [duration, easing, scaleDown, scaleUp]);

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
  title: 'Animations/Page Transitions/Scale',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** The outgoing page shrinks to the centre while the incoming page grows from a slightly smaller size — mimicking the native iOS/Android "drill-down" gesture.',
          '',
          '**Recommended for:** Detail drilldowns (list → item), modal open/close, confirmation dialogs.',
          '',
          '**Tune it:** `Scale Down` controls how small the exiting page gets; `Scale Up` controls the starting size of the entering page. Values close to 1 feel subtle; 0.7 / 1.3 feel dramatic.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Duration (ms)',
      control: { type: 'range', min: 100, max: 700, step: 20 },
      table: { defaultValue: { summary: '300' } },
    },
    easing: {
      name: 'Easing',
      control: 'select',
      options: ['ease', 'ease-out', 'ease-in-out', 'cubic-bezier(0.4,0,0.2,1)', 'cubic-bezier(0.34,1.56,0.64,1)'],
      table: { defaultValue: { summary: 'cubic-bezier(0.4,0,0.2,1)' } },
    },
    scaleDown: {
      name: 'Scale Down (exit)',
      description: 'Scale factor of the exiting page (< 1 = shrink)',
      control: { type: 'range', min: 0.5, max: 0.98, step: 0.01 },
      table: { defaultValue: { summary: '0.88' } },
    },
    scaleUp: {
      name: 'Scale Up (enter)',
      description: 'Starting scale of the entering page (> 1 = grow in)',
      control: { type: 'range', min: 1.02, max: 1.5, step: 0.01 },
      table: { defaultValue: { summary: '1.08' } },
    },
  },
  args: { duration: 300, easing: 'cubic-bezier(0.4,0,0.2,1)', scaleDown: 0.88, scaleUp: 1.08 },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Scale — default (drill-down)',
  render: (args) => <ScaleDemo {...args} />,
};

export const Subtle: Story = {
  name: 'Scale — subtle (0.96 / 1.03)',
  args: { scaleDown: 0.96, scaleUp: 1.03, duration: 250, easing: 'ease-out' },
  render: (args) => <ScaleDemo {...args} />,
};

export const Dramatic: Story = {
  name: 'Scale — dramatic (0.7 / 1.25)',
  args: { scaleDown: 0.70, scaleUp: 1.25, duration: 420, easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
  render: (args) => <ScaleDemo {...args} />,
};
