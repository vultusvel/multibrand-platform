import { Lato } from 'next/font/google';

/**
 * Lato — primary platform font (The Range design system).
 *
 * NOTE: Google Fonts Lato ships only 100/300/400/700/900 — there is NO 600.
 * The design's "Semi Bold" (600) is therefore mapped to 700 in the type scale.
 * If a true 600 is required, self-host a Lato build that includes it.
 */
export const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-lato',
});
