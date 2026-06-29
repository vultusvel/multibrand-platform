import type { ReactNode } from 'react';
import {
  LocalThemeSource,
  EdgeConfigThemeSource,
  ContentfulThemeSource,
  tokensToCSS,
} from '@multibrand-platform/ui/themes';

function makeSource() {
  if (process.env.EDGE_CONFIG) return new EdgeConfigThemeSource();
  if (process.env.CONTENTFUL_SPACE_ID) return new ContentfulThemeSource();
  return new LocalThemeSource();
}

export default async function BrandLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const tokens = await makeSource().getBrand(brand);
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
