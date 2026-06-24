import type { ReactNode } from 'react';
import {
  LocalThemeSource,
  EdgeConfigThemeSource,
  tokensToCSS,
} from '@multibrand-platform/ui/themes';

const source = process.env.EDGE_CONFIG
  ? new EdgeConfigThemeSource()
  : new LocalThemeSource();

export default async function BrandLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const tokens = await source.getBrand(brand);
  const css = tokens ? tokensToCSS(tokens) : null;

  return (
    <>
      {css && (
        <style dangerouslySetInnerHTML={{ __html: css }} />
      )}
      {children}
    </>
  );
}
