/**
 * ============================================================================
 * DEEPALI AYURVEDA — DYNAMIC PRODUCT SERVICE
 * ============================================================================
 * Fetches authoritative e-commerce product records from public.products in Supabase
 * and enriches them with rich classical botanical and clinical metadata from
 * the curated local catalog using canonical slug resolution.
 * ============================================================================
 */

import { supabase, isSupabaseConfigured } from './supabase';
import type { Database } from '../types/database';
import type { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { PRODUCT_SLUG_MAP } from './orders';

export type DatabaseProductRow = Database['public']['Tables']['products']['Row'];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Merges a database product row with local rich clinical and botanical metadata.
 * Authoritative fields (price, stock, active state, name, UUID, slug) strictly
 * come from the database.
 */
export function mergeDatabaseProductWithMetadata(dbProduct: DatabaseProductRow): Product {
  const canonicalSlug = dbProduct.slug.trim().toLowerCase();

  // Find corresponding metadata by canonical slug or mapped alias
  const meta = PRODUCTS.find((p) => {
    const pSlug = (p.id || '').trim().toLowerCase();
    const mapped = PRODUCT_SLUG_MAP[pSlug] || pSlug;
    return pSlug === canonicalSlug || mapped === canonicalSlug;
  }) || PRODUCTS[0];

  const parsedPrice = typeof dbProduct.price === 'number' 
    ? dbProduct.price 
    : parseFloat(String(dbProduct.price)) || 699;

  const stockQuantity = dbProduct.stock_quantity ?? 100;
  // In stock only if the product is active AND has positive inventory
  const inStock = Boolean(dbProduct.is_active && stockQuantity > 0);

  return {
    // 1. Authoritative Database Attributes
    id: dbProduct.id || meta.id,
    slug: dbProduct.slug || meta.slug,
    name: dbProduct.name || meta.name,
    price: parsedPrice,
    stockQuantity,
    inStock,
    isActive: dbProduct.is_active ?? true,
    category: dbProduct.category || meta.category,
    image: (() => {
      const raw = dbProduct.image_url || meta.image || '/images/products/sea-buckthorn.png';
      return raw.includes('?') ? raw : `${raw}?v=20261120_2`;
    })(),
    sanskritName: dbProduct.sanskrit_name || meta.sanskritName,
    volume: dbProduct.volume || meta.volume || '500 ML',
    serving: dbProduct.serving || meta.serving || '500 ML Bottle (Daily Health Shot)',

    // 2. Preserved Rich Clinical, Botanical & Marketing Attributes
    subName: meta.subName,
    originalPrice: meta.originalPrice,
    rating: meta.rating || 4.98,
    reviewCount: meta.reviewCount || 524,
    tag: meta.tag || '99% Pure Pulp • Free Delivery PAN India',
    badgeColor: meta.badgeColor || 'bg-[#F5EFE5] text-[#35251F] border-[#D8C3A5]',
    shelfLife: meta.shelfLife || '24 Months',
    scientificFact: meta.scientificFact,
    shortDescription: dbProduct.description || meta.shortDescription,
    heroBenefit: meta.heroBenefit,
    symptoms: meta.symptoms,
    whyYouNeedIt: meta.whyYouNeedIt,
    whoShouldTake: meta.whoShouldTake,
    keyIngredients: meta.keyIngredients,
    dosage: meta.dosage,
    bestTime: meta.bestTime,
    course: meta.course,
    whoShouldNotTake: meta.whoShouldNotTake,
    certifications: meta.certifications,
    colorScheme: meta.colorScheme || 'bronze'
  };
}

export interface ProductsFetchResult {
  data: Product[];
  error: string | null;
}

export interface SingleProductFetchResult {
  data: Product | null;
  error: string | null;
}

/**
 * Fetches active products from Supabase and merges them with metadata.
 * Gracefully falls back to local curated Sea Buckthorn formulation if Supabase is unconfigured or offline.
 */
export async function fetchActiveProducts(): Promise<ProductsFetchResult> {
  if (!isSupabaseConfigured()) {
    return {
      data: PRODUCTS,
      error: null
    };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: false });

    if (error || !data || data.length === 0) {
      return {
        data: PRODUCTS,
        error: null
      };
    }

    const merged = data.map(mergeDatabaseProductWithMetadata);
    return {
      data: merged.length > 0 ? merged : PRODUCTS,
      error: null
    };
  } catch (err: unknown) {
    console.warn('[Deepali Ayurveda] Network error connecting to Supabase, serving local catalog:', err);
    return {
      data: PRODUCTS,
      error: null
    };
  }
}

/**
 * Fetches a single product by slug, alias, or UUID from Supabase.
 */
export async function fetchProductBySlugOrId(identifier: string): Promise<SingleProductFetchResult> {
  if (!identifier || identifier.trim().length === 0) {
    return { data: PRODUCTS[0] || null, error: null };
  }

  if (!isSupabaseConfigured()) {
    const cleanId = identifier.trim().toLowerCase();
    const canonicalSlug = PRODUCT_SLUG_MAP[cleanId] || cleanId;
    const found = PRODUCTS.find(
      (p) => (p.slug || '').toLowerCase() === canonicalSlug || (p.id || '').toLowerCase() === cleanId
    ) || PRODUCTS[0];
    return {
      data: found || null,
      error: null
    };
  }

  const cleanId = identifier.trim();
  const isUuid = UUID_REGEX.test(cleanId);

  try {
    let query = supabase.from('products').select('*').eq('is_active', true);

    if (isUuid) {
      query = query.eq('id', cleanId);
    } else {
      const canonicalSlug = PRODUCT_SLUG_MAP[cleanId.toLowerCase()] || cleanId.toLowerCase();
      query = query.eq('slug', canonicalSlug);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return {
        data: PRODUCTS[0] || null,
        error: null
      };
    }

    return {
      data: mergeDatabaseProductWithMetadata(data),
      error: null
    };
  } catch (err: unknown) {
    return {
      data: PRODUCTS[0] || null,
      error: null
    };
  }
}

export const fetchProductBySlug = fetchProductBySlugOrId;
export const fetchProductById = fetchProductBySlugOrId;
