import { createClient } from 'contentful';
import { BrandTokensSchema, type BrandTokens } from '../schema';
import type { ThemeSource } from './types';

export class ContentfulThemeSource implements ThemeSource {
  private getClient() {
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      throw new Error('Contentful env vars not set');
    }
    return createClient({
      space:       process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    });
  }

  async getBrand(slug: string): Promise<BrandTokens | null> {
    try {
      const res = await this.getClient().getEntries({
        content_type:  'brandTheme',
        'fields.slug': slug,
        limit:         1,
      });
      const entry = res.items[0];
      if (!entry) return null;
      const result = BrandTokensSchema.safeParse(entry.fields);
      if (!result.success) {
        console.warn(`[ContentfulThemeSource] invalid tokens for "${slug}":`, result.error.issues);
        return null;
      }
      return result.data;
    } catch {
      return null;
    }
  }

  async getAllBrands(): Promise<BrandTokens[]> {
    try {
      const res = await this.getClient().getEntries({
        content_type: 'brandTheme',
        limit:        100,
      });
      return res.items.flatMap(e => {
        const result = BrandTokensSchema.safeParse(e.fields);
        return result.success ? [result.data] : [];
      });
    } catch {
      return [];
    }
  }
}
