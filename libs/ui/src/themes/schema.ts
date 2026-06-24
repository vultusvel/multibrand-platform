import { z } from 'zod';

const hex = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'must be a hex colour');

export const BrandTokensSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),

  brandPrimary:   hex,
  brandSecondary: hex,
  statusNew:      hex,
  statusRatings:  hex,
  statusSale:     hex,

  brandPrimaryAa:   hex.optional(),
  brandBlue:        hex.optional(),
  brandBrightBlue:  hex.optional(),
  brandMidBlue:     hex.optional(),
  brandBlueHover:   hex.optional(),
  brandBluePressed: hex.optional(),
  brandGreen:       hex.optional(),
  brandRed:         hex.optional(),
  brandYellow:      hex.optional(),
  brandBase100:     hex.optional(),
  brandBase80:      hex.optional(),
  brandBase60:      hex.optional(),
  brandBase40:      hex.optional(),
  brandBase20:      hex.optional(),
  brandBase10:      hex.optional(),
  brandAccentGreen: hex.optional(),
  brandDivider40:   hex.optional(),
  brandDivider20:   hex.optional(),
});

export type BrandTokens = z.infer<typeof BrandTokensSchema>;

const SKIP = new Set(['slug', 'name']);

function camelToKebab(key: string): string {
  return key
    .replace(/([A-Z])/g, (m) => '-' + m.toLowerCase())
    .replace(/([a-z])(\d+)/g, '$1-$2');
}

export function tokensToCSS(tokens: BrandTokens, selector = ':root'): string {
  const vars = (Object.entries(tokens) as [string, string | undefined][])
    .filter(([k, v]) => !SKIP.has(k) && typeof v === 'string')
    .map(([k, v]) => `  --${camelToKebab(k)}: ${v};`)
    .join('\n');
    
  return `${selector} {\n${vars}\n}`;
}
