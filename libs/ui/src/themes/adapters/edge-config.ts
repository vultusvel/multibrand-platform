import { get } from '@vercel/edge-config';
import { BrandTokensSchema, type BrandTokens } from '../schema';
import type { ThemeSource } from './types';

export class EdgeConfigThemeSource implements ThemeSource {
  async getBrand(slug: string): Promise<BrandTokens | null> {
    try {
      const raw = await get(`theme-${slug}`);
      if (!raw) return null;
      const result = BrandTokensSchema.safeParse(raw);
      if (!result.success) {
        console.warn(`[EdgeConfigThemeSource] invalid tokens for "${slug}":`, result.error.issues);
        return null;
      }
      return result.data;
    } catch {
      return null;
    }
  }

  async getAllBrands(): Promise<BrandTokens[]> {
    try {
      const slugs = await get<string[]>('brand-slugs');
      if (!Array.isArray(slugs)) return [];
      const results = await Promise.all(slugs.map(s => this.getBrand(s)));
      return results.filter((b): b is BrandTokens => b !== null);
    } catch {
      return [];
    }
  }
}
