import type { Meta, StoryObj } from '@storybook/react-vite';

const brands = [
  { name: 'wilko', label: 'wilko.com', theme: 'theme-wilko' },
  { name: 'homebase', label: 'Homebase', theme: 'theme-homebase' },

  { name: 'the-range', label: 'The Range', theme: 'theme-the-range' },
];

const brandSwatches = [
  { label: 'Primary', var: '--brand-primary' },
  { label: 'Secondary', var: '--brand-secondary' },
  { label: 'Status New', var: '--status-new' },
  { label: 'Status Ratings', var: '--status-ratings' },
  { label: 'Status Sale', var: '--status-sale' },
];

const semanticSwatches = [
  { label: 'Blue BG', var: '--blue-bg' },
  { label: 'Blue Border', var: '--blue-border' },
  { label: 'Blue Utility', var: '--blue-utility' },
  { label: 'Blue Text', var: '--blue-text' },
  { label: 'Green BG', var: '--green-bg' },
  { label: 'Green Border', var: '--green-border' },
  { label: 'Green Utility', var: '--green-utility' },
  { label: 'Green Text', var: '--green-text' },
  { label: 'Amber BG', var: '--amber-bg' },
  { label: 'Amber Border', var: '--amber-border' },
  { label: 'Amber Utility', var: '--amber-utility' },
  { label: 'Amber Text', var: '--amber-text' },
  { label: 'Red BG', var: '--red-bg' },
  { label: 'Red Border', var: '--red-border' },
  { label: 'Red Utility', var: '--red-utility' },
  { label: 'Red Text', var: '--red-text' },
];

const greySwatches = [
  { label: 'Grey 1', var: '--grey-1' },
  { label: 'Grey 2', var: '--grey-2' },
  { label: 'Grey 3', var: '--grey-3' },
  { label: 'Grey 4', var: '--grey-4' },
  { label: 'Grey 5', var: '--grey-5' },
  { label: 'Grey 6', var: '--grey-6' },
  { label: 'Grey 7', var: '--grey-7' },
];

const thirdPartySwatches = [
  { label: 'Clearpay Mint', var: '--clearpay-mint' },
  { label: 'Clearpay Black', var: '--clearpay-black' },
  { label: 'Klarna Pink', var: '--klarna-pink' },
  { label: 'Klarna Black', var: '--klarna-black' },
  { label: 'PayPal Blue', var: '--paypal-blue' },
  { label: 'PayPal Light', var: '--paypal-light-blue' },
  { label: 'PayPal Black', var: '--paypal-black' },
];

const theRangeExtra = [
  { label: 'Primary AA', var: '--brand-primary-aa' },
  { label: 'Blue', var: '--brand-blue' },
  { label: 'Bright Blue', var: '--brand-bright-blue' },
  { label: 'Mid Blue', var: '--brand-mid-blue' },
  { label: 'Blue Hover', var: '--brand-blue-hover' },
  { label: 'Blue Pressed', var: '--brand-blue-pressed' },
  { label: 'Green', var: '--brand-green' },
  { label: 'Red', var: '--brand-red' },
  { label: 'Yellow', var: '--brand-yellow' },
  { label: 'Base 100', var: '--brand-base-100' },
  { label: 'Base 80', var: '--brand-base-80' },
  { label: 'Base 60', var: '--brand-base-60' },
  { label: 'Base 40', var: '--brand-base-40' },
  { label: 'Base 20', var: '--brand-base-20' },
  { label: 'Base 10', var: '--brand-base-10' },
  { label: 'Accent Green', var: '--brand-accent-green' },
];

function Swatch({ label, cssVar }: { label: string; cssVar: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 72 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 10,
          background: `var(${cssVar})`,
          border: '1px solid rgba(0,0,0,0.1)',
        }}
      />
      <span style={{ fontSize: 10, color: '#666', lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

function SwatchGroup({ title, swatches }: { title: string; swatches: { label: string; var: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {swatches.map((s) => (
          <Swatch key={s.var} label={s.label} cssVar={s.var} />
        ))}
      </div>
    </div>
  );
}

function BrandCard({ label, theme, isTheRange }: { label: string; theme: string; isTheRange?: boolean }) {
  return (
    <div
      className={theme}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--brand-primary)' }}>
        {label}
      </h2>
      <SwatchGroup title="Brand" swatches={brandSwatches} />
      {isTheRange && <SwatchGroup title="The Range Extended" swatches={theRangeExtra} />}
      <SwatchGroup title="Semantic UI" swatches={semanticSwatches} />
      <SwatchGroup title="Neutral" swatches={greySwatches} />
      <SwatchGroup title="Third Party" swatches={thirdPartySwatches} />
    </div>
  );
}

function AllThemes() {
  return (
    <div style={{ padding: 32, background: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ margin: '0 0 32px', fontSize: 28, fontWeight: 700 }}>Brand Themes</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        {brands.map((b) => (
          <BrandCard key={b.name} label={b.label} theme={b.theme} isTheRange={b.name === 'the-range'} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Brand Themes',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const AllBrands: Story = {
  render: () => <AllThemes />,
  parameters: { backgrounds: { disable: true } },
};
