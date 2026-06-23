import { contentfulClient } from './client';
import type { Brand, Product, Banner } from './types';  

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}
function num(v: unknown): number {
  return typeof v === 'number' ? v : 0;
}
function bool(v: unknown): boolean {
  return typeof v === 'boolean' ? v : false;
}
function assetUrl(v: unknown): string | null {
  const url = (v as any)?.fields?.file?.url as string | undefined;
  if (!url) return null;
  return url.startsWith('//') ? `https:${url}` : url;
}
function linkedSlug(v: unknown): string | null {
  const slug = (v as any)?.fields?.slug;
  return typeof slug === 'string' ? slug : null;
}

export async function getBrands(): Promise<Brand[]> {
  const res = await contentfulClient.getEntries({
    content_type: 'brand',
    order:        ['fields.name'],
  });
  return res.items.map(e => ({
    id:              e.sys.id,
    slug:            str(e.fields.slug),
    name:            str(e.fields.name),
    color:           str(e.fields.color),
    backgroundColor: str(e.fields.backgroundColor),
    initial:         str(e.fields.initial),
    heroImageUrl:    assetUrl(e.fields.heroImage),
  }));
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const res = await contentfulClient.getEntries({
    content_type:  'brand',
    'fields.slug': slug,
    limit:         1,
  });
  const e = res.items[0];
  if (!e) return null;
  return {
    id:              e.sys.id,
    slug:            str(e.fields.slug),
    name:            str(e.fields.name),
    color:           str(e.fields.color),
    backgroundColor: str(e.fields.backgroundColor),
    initial:         str(e.fields.initial),
    heroImageUrl:    assetUrl(e.fields.heroImage),
  };
}

export async function getProducts(brandSlug?: string): Promise<Product[]> {
  const res = await contentfulClient.getEntries({
    content_type:     'product',
    'fields.inStock': true,
    ...(brandSlug && { 'fields.brand.fields.slug[match]': brandSlug }),
    order:            ['fields.title'],
    limit:            100,
  });
  return res.items.map(e => ({
    id:        e.sys.id,
    slug:      str(e.fields.slug),
    title:     str(e.fields.title),
    price:     num(e.fields.price),
    wasPrice:  e.fields.wasPrice != null ? num(e.fields.wasPrice) : null,
    badge:     e.fields.badge ? str(e.fields.badge) : null,
    inStock:   bool(e.fields.inStock),
    category:  str(e.fields.category),
    brandSlug: linkedSlug(e.fields.brand) ?? '',
    imageUrls: Array.isArray(e.fields.images)
      ? (e.fields.images as unknown[]).map(assetUrl).filter((u): u is string => u !== null)
      : [],
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await contentfulClient.getEntries({
    content_type:  'product',
    'fields.slug': slug,
    limit:         1,
  });
  const e = res.items[0];
  if (!e) return null;
  return {
    id:        e.sys.id,
    slug:      str(e.fields.slug),
    title:     str(e.fields.title),
    price:     num(e.fields.price),
    wasPrice:  e.fields.wasPrice != null ? num(e.fields.wasPrice) : null,
    badge:     e.fields.badge ? str(e.fields.badge) : null,
    inStock:   bool(e.fields.inStock),
    category:  str(e.fields.category),
    brandSlug: linkedSlug(e.fields.brand) ?? '',
    imageUrls: Array.isArray(e.fields.images)
      ? (e.fields.images as unknown[]).map(assetUrl).filter((u): u is string => u !== null)
      : [],
  };
}

export async function getBanners(brandSlug?: string): Promise<Banner[]> {
  const res = await contentfulClient.getEntries({
    content_type:    'banner',
    'fields.active': true,
    ...(brandSlug && { 'fields.brand.fields.slug[match]': brandSlug }),
    order:           ['sys.createdAt'],
  });
  return res.items.map(e => ({
    id:                  e.sys.id,
    title:               str(e.fields.title),
    subtitle:            e.fields.subtitle ? str(e.fields.subtitle) : null,
    ctaText:             str(e.fields.ctaText),
    ctaLink:             str(e.fields.ctaLink),
    backgroundImageUrl:  assetUrl(e.fields.backgroundImage),
    brandSlug:           linkedSlug(e.fields.brand),
  }));
}
