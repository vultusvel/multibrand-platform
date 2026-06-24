import type { BrandTokens } from '../schema';

export interface ThemeSource {
  getBrand(slug: string): Promise<BrandTokens | null>;
  getAllBrands(): Promise<BrandTokens[]>;
}
