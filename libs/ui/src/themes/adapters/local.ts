import { BrandTokensSchema, type BrandTokens } from '../schema';
import type { ThemeSource } from './types';

import wilko     from '../wilko.json';
import homebase  from '../homebase.json';
import theRange  from '../the-range.json';

const RAW: Record<string, unknown> = {
  'wilko':     wilko,
  'homebase':  homebase,
  'the-range': theRange,
};

function parse(raw: unknown): BrandTokens | null {
  const result = BrandTokensSchema.safeParse(raw);
  if (!result.success) {
    console.warn('[LocalThemeSource] invalid token data:', result.error.flatten());

    return null;
  }
  
  return result.data;
}

export class LocalThemeSource implements ThemeSource {
  async getBrand(slug: string): Promise<BrandTokens | null> {
    const raw = RAW[slug];

    return raw !== undefined ? parse(raw) : null;
  }

  async getAllBrands(): Promise<BrandTokens[]> {
    return Object.values(RAW)
      .map(parse)
      .filter((b): b is BrandTokens => b !== null);
  }
}
