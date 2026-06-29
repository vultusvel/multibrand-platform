import type { ReactNode } from 'react';
import { cacheTag, cacheLife } from 'next/cache';
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

const source = makeSource();

async function getCachedBrand(slug: string) {
  'use cache';
  cacheTag('brand-theme');
  cacheLife('minutes');
  
  return source.getBrand(slug);
}

export default async function BrandLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const tokens = await getCachedBrand(brand);
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
