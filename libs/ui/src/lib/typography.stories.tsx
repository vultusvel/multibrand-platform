import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

const Row = ({ cls, label }: { cls: string; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span className="t-body-xs" style={{ color: 'var(--grey-5)' }}>
      {label} · <code>.{cls}</code>
    </span>
    <span className={cls}>The quick brown fox — Lato 1234567890</span>
  </div>
);

export const Headings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row cls="t-hero" label="Heading Hero (Display)" />
      <Row cls="t-h1" label="Heading XL (H1)" />
      <Row cls="t-h2" label="Heading L (H2)" />
      <Row cls="t-h3" label="Heading M (H3)" />
      <Row cls="t-h4" label="Heading S (H4)" />
      <Row cls="t-h5" label="Heading XS (H5)" />
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row cls="t-body-xl" label="Body XL (Subtitle)" />
      <Row cls="t-body-xl-bold" label="Body XL Bold" />
      <Row cls="t-body-l" label="Body L (Body 1)" />
      <Row cls="t-body-l-bold" label="Body L Bold" />
      <Row cls="t-body-m" label="Body M (Body 2)" />
      <Row cls="t-body-m-bold" label="Body M Bold" />
      <Row cls="t-body-s" label="Body S (Body 3)" />
      <Row cls="t-body-s-bold" label="Body S Bold" />
      <Row cls="t-body-xs" label="Body XS (Caption)" />
      <Row cls="t-body-xs-bold" label="Body XS Bold" />
    </div>
  ),
};

export const Links: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['t-link-l', 't-link-m', 't-link-s'] as const).map((cls, i) => (
        <div key={cls} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="t-body-xs" style={{ color: 'var(--grey-5)' }}>
            {`Body ${['L', 'M', 'S'][i]} Link`} · <code>.{cls}</code>
          </span>
          <a
            href="https://www.therange.co.uk"
            className={cls}
            style={{ color: 'var(--color-brand-primary)' }}
          >
            Hover me to underline
          </a>
        </div>
      ))}
    </div>
  ),
};
