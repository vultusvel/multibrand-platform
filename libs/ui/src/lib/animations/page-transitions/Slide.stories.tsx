import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect, useRef } from 'react';
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
  axis: 'horizontal' | 'vertical';
}

function setDir(dir: 'forward' | 'back') {
  document.documentElement.dataset.slideDir = dir;
}
function clearDir(delay: number) {
  setTimeout(() => delete document.documentElement.dataset.slideDir, delay + 80);
}

function SlideDemo({ duration, easing, axis }: Args) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const axisRef = useRef(axis);
  axisRef.current = axis;

  useEffect(() => {
    const px = axis === 'horizontal' ? '100%' : '0';
    const py = axis === 'vertical' ? '60px' : '0';
    const el = document.createElement('style');
    el.dataset.vtId = 'slide';
    el.textContent = `
      @keyframes _vt-slide-out-fwd {
        to { transform: translate(${axis === 'horizontal' ? '-' : ''}${px}, ${axis === 'vertical' ? '-' : ''}${py}); opacity: 0.3; }
      }
      @keyframes _vt-slide-in-fwd {
        from { transform: translate(${px}, ${py}); opacity: 0.3; }
      }
      @keyframes _vt-slide-out-back {
        to { transform: translate(${px}, ${py}); opacity: 0.3; }
      }
      @keyframes _vt-slide-in-back {
        from { transform: translate(${axis === 'horizontal' ? '-' : ''}${px}, ${axis === 'vertical' ? '-' : ''}${py}); opacity: 0.3; }
      }

      :root[data-slide-dir="forward"] ::view-transition-old(root) {
        animation: ${duration}ms ${easing} both _vt-slide-out-fwd;
      }
      :root[data-slide-dir="forward"] ::view-transition-new(root) {
        animation: ${duration}ms ${easing} both _vt-slide-in-fwd;
      }
      :root[data-slide-dir="back"] ::view-transition-old(root) {
        animation: ${duration}ms ${easing} both _vt-slide-out-back;
      }
      :root[data-slide-dir="back"] ::view-transition-new(root) {
        animation: ${duration}ms ${easing} both _vt-slide-in-back;
      }

      /* Fallback when no direction set */
      ::view-transition-old(root) { animation: ${duration}ms ${easing} both _vt-slide-out-fwd; }
      ::view-transition-new(root) { animation: ${duration}ms ${easing} both _vt-slide-in-fwd; }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, [duration, easing, axis]);

  const navTo = (fn: () => void, dir: 'forward' | 'back') => {
    setDir(dir);
    startVT(fn);
    clearDir(duration);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      {!supportsVT && <UnsupportedBanner />}
      <ViewTransition>
        {brand
          ? <BrandDetail brand={brand} onBack={() => navTo(() => setBrand(null), 'back')} />
          : <BrandList onSelect={(b) => navTo(() => setBrand(b), 'forward')} />}
      </ViewTransition>
    </div>
  );
}

const meta = {
  title: 'Animations/Page Transitions/Slide',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Effect:** Pages slide in/out along an axis — **forward** navigation exits left and enters from the right; **back** navigation reverses. Communicates direction and spatial hierarchy.',
          '',
          '**Recommended for:** Multi-step flows, brand drilldowns, onboarding. Direction makes the navigation feel intuitive and predictable.',
          '',
          '**Tune it:** Try `Axis: vertical` for a more modern app-like feel (think iOS sheets). Horizontal is the web standard.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Duration (ms)',
      control: { type: 'range', min: 100, max: 700, step: 20 },
      table: { defaultValue: { summary: '350' } },
    },
    easing: {
      name: 'Easing',
      control: 'select',
      options: ['ease', 'ease-in-out', 'ease-out', 'cubic-bezier(0.4,0,0.2,1)', 'cubic-bezier(0.2,0,0,1)'],
      table: { defaultValue: { summary: 'cubic-bezier(0.4,0,0.2,1)' } },
    },
    axis: {
      name: 'Axis',
      description: 'Direction of the slide',
      control: 'radio',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
  },
  args: { duration: 350, easing: 'cubic-bezier(0.4,0,0.2,1)', axis: 'horizontal' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Horizontal: Story = {
  name: 'Slide — horizontal (default)',
  render: (args) => <SlideDemo {...args} />,
};

export const Vertical: Story = {
  name: 'Slide — vertical (sheet style)',
  args: { axis: 'vertical', duration: 380, easing: 'cubic-bezier(0.2,0,0,1)' },
  render: (args) => <SlideDemo {...args} />,
};

export const Snappy: Story = {
  name: 'Slide — snappy (180 ms)',
  args: { duration: 180, easing: 'ease-out', axis: 'horizontal' },
  render: (args) => <SlideDemo {...args} />,
};
