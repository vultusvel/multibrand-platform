import type { Meta, StoryObj } from '@storybook/react-vite';
import { BRANDS } from '../_demo-shared';

interface Args {
  duration: number;
  color: string;
  thickness: number;
}


function SlideUnderLink({ label, color, duration, thickness }: { label: string; color: string; duration: number; thickness: number }) {
  return (
    <>
      <style>{`
        .link-slide { position: relative; color: ${color}; text-decoration: none; font-weight: 500; }
        .link-slide::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: ${thickness}px;
          background: ${color};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform ${duration}ms cubic-bezier(0.4,0,0.2,1);
        }
        .link-slide:hover::after { transform: scaleX(1); }
      `}</style>
      <a href="/" className="link-slide" onClick={e => e.preventDefault()}>{label}</a>
    </>
  );
}

function CentreUnderLink({ label, color, duration, thickness }: { label: string; color: string; duration: number; thickness: number }) {
  return (
    <>
      <style>{`
        .link-centre { position: relative; color: ${color}; text-decoration: none; font-weight: 500; }
        .link-centre::after {
          content: ''; position: absolute;
          bottom: -2px; left: 50%; right: 50%;
          height: ${thickness}px; background: ${color};
          transition: left ${duration}ms cubic-bezier(0.4,0,0.2,1), right ${duration}ms cubic-bezier(0.4,0,0.2,1);
        }
        .link-centre:hover::after { left: 0; right: 0; }
      `}</style>
      <a href="/" className="link-centre" onClick={e => e.preventDefault()}>{label}</a>
    </>
  );
}

function FadeColorLink({ label, color, duration }: { label: string; color: string; duration: number }) {
  return (
    <>
      <style>{`
        .link-color { color: #1a1a1a; text-decoration: underline; text-underline-offset: 3px; font-weight: 500; transition: color ${duration}ms ease; }
        .link-color:hover { color: ${color}; }
      `}</style>
      <a href="/" className="link-color" onClick={e => e.preventDefault()}>{label}</a>
    </>
  );
}

function ArrowLink({ label, color, duration }: { label: string; color: string; duration: number }) {
  return (
    <>
      <style>{`
        .link-arrow { color: ${color}; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
        .link-arrow .arrow { display: inline-block; transition: transform ${duration}ms cubic-bezier(0.34,1.56,0.64,1); }
        .link-arrow:hover .arrow { transform: translateX(5px); }
      `}</style>
      <a href="/" className="link-arrow" onClick={e => e.preventDefault()}>
        {label} <span className="arrow">→</span>
      </a>
    </>
  );
}

function BackLink({ label, color, duration }: { label: string; color: string; duration: number }) {
  return (
    <>
      <style>{`
        .link-back { color: ${color}; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; }
        .link-back .arrow { display: inline-block; transition: transform ${duration}ms cubic-bezier(0.34,1.56,0.64,1); }
        .link-back:hover .arrow { transform: translateX(-5px); }
      `}</style>
      <a href="/" className="link-back" onClick={e => e.preventDefault()}>
        <span className="arrow">←</span> {label}
      </a>
    </>
  );
}

function HighlightLink({ label, color, bg, duration }: { label: string; color: string; bg: string; duration: number }) {
  return (
    <>
      <style>{`
        .link-highlight {
          color: ${color}; text-decoration: none; font-weight: 500;
          padding: 2px 6px; border-radius: 4px;
          background: transparent;
          transition: background ${duration}ms ease, color ${duration}ms ease;
        }
        .link-highlight:hover { background: ${bg}; }
      `}</style>
      <a href="/" className="link-highlight" onClick={e => e.preventDefault()}>{label}</a>
    </>
  );
} 

function LinksDemo({ duration, color, thickness }: Args) {
  const brandRows = BRANDS.map(b => ({ ...b, displayColor: color === 'brand' ? b.color : color }));

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 40, background: '#fff', minHeight: 500 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Link Animations</h2>
      <p style={{ margin: '0 0 40px', color: '#999', fontSize: 13 }}>Hover over each link to see the animation</p>

      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Slide Underline — grows from left</h3>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', fontSize: 15 }}>
          {brandRows.map(b => (
            <SlideUnderLink key={b.slug} label={b.name} color={b.displayColor} duration={duration} thickness={thickness} />
          ))}
          <SlideUnderLink label="View all products" color={color === 'brand' ? '#1a1a1a' : color} duration={duration} thickness={thickness} />
          <SlideUnderLink label="Terms & conditions" color={color === 'brand' ? '#666' : color} duration={duration} thickness={thickness} />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Centre Expand — grows from middle</h3>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', fontSize: 15 }}>
          {brandRows.map(b => (
            <CentreUnderLink key={b.slug} label={b.name} color={b.displayColor} duration={duration} thickness={thickness} />
          ))}
          <CentreUnderLink label="Privacy policy" color={color === 'brand' ? '#1a1a1a' : color} duration={duration} thickness={thickness} />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Colour Shift — underline stays, colour changes</h3>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', fontSize: 15 }}>
          {brandRows.map(b => (
            <FadeColorLink key={b.slug} label={b.name} color={b.displayColor} duration={duration} />
          ))}
          <FadeColorLink label="Learn more" color={color === 'brand' ? '#9d2235' : color} duration={duration} />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Arrow Links — forward navigation</h3>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', fontSize: 15 }}>
          {brandRows.map(b => (
            <ArrowLink key={b.slug} label={`Shop ${b.name}`} color={b.displayColor} duration={duration} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', fontSize: 15, marginTop: 14 }}>
          <BackLink label="Back to results" color={color === 'brand' ? '#1a1a1a' : color} duration={duration} />
          <BackLink label="Continue shopping" color={color === 'brand' ? '#666' : color} duration={duration} />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Background Highlight — pill highlight on hover</h3>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 15 }}>
          {brandRows.map(b => (
            <HighlightLink key={b.slug} label={b.name} color={b.displayColor} bg={b.bg} duration={duration} />
          ))}
          <HighlightLink label="View all" color="#1a1a1a" bg="#f0f0f0" duration={duration} />
          <HighlightLink label="Sale" color="#e74c3c" bg="#fef0f0" duration={duration} />
        </div>
      </section>

      <section style={{ background: '#f5f5f5', borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>In-context example</h3>
        <p style={{ fontSize: 14, color: '#333', lineHeight: 1.8, margin: 0 }}>
          Browse our full range at{' '}
          <SlideUnderLink label="Wilko" color="#9d2235" duration={duration} thickness={thickness} />,{' '}
          <SlideUnderLink label="Homebase" color="#089c49" duration={duration} thickness={thickness} /> and{' '}
          <SlideUnderLink label="The Range" color="#f53e24" duration={duration} thickness={thickness} />.
          {' '}<ArrowLink label="View all brands" color="#1a1a1a" duration={duration} />
        </p>
      </section>
    </div>
  );
}

const meta = {
  title: 'Animations/UI Elements/Links',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Five hover animation patterns** for hyperlinks — each using CSS transitions only (no JavaScript). All are accessible (no focus-only reliance), keyboard-navigable, and respect `prefers-reduced-motion` if added to global CSS.',
          '',
          '**Patterns:** Slide Underline (left→right), Centre Expand (middle outward), Colour Shift, Arrow CTA, Background Highlight.',
          '',
          '**Recommended for:** Navigation links, in-copy hyperlinks, CTA text links, breadcrumbs, and footer links across all brand sites.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    duration: {
      name: 'Transition Duration (ms)',
      control: { type: 'range', min: 80, max: 600, step: 20 },
      table: { defaultValue: { summary: '220' } },
    },
    color: {
      name: 'Link Colour',
      control: 'select',
      options: ['brand', '#1a1a1a', '#9d2235', '#089c49', '#0da0cc', '#f53e24'],
      table: { defaultValue: { summary: 'brand' } },
    },
    thickness: {
      name: 'Underline thickness (px)',
      control: { type: 'range', min: 1, max: 4, step: 1 },
      table: { defaultValue: { summary: '2' } },
    },
  },
  args: { duration: 220, color: 'brand', thickness: 2 },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const AllPatterns: Story = {
  name: 'Links — all patterns (hover to preview)',
  render: (args) => <LinksDemo {...args} />,
};

export const Dark: Story = {
  name: 'Links — dark (editorial / footer)',
  args: { color: '#1a1a1a', thickness: 1, duration: 180 },
  render: (args) => <LinksDemo {...args} />,
};

export const Slow: Story = {
  name: 'Links — slow for review (400ms)',
  args: { duration: 400 },
  render: (args) => <LinksDemo {...args} />,
};
