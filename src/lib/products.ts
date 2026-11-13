/**
 * ============================================================================
 * DEEPALI AYURVEDA — DYNAMIC PRODUCT SERVICE
 * ============================================================================
 * Fetches authoritative e-commerce product records from public.products in Supabase
 * and enriches them with rich classical botanical and clinical metadata from
 * the curated local catalog using canonical slug resolution.
 *
 * AUTHORITATIVE DATABASE FIELDS:
 * - id: Supabase UUID (used for database operations, foreign keys, RPC checkout)
 * - slug: Canonical URL identifier (used for routing /product/:slug)
 * - name: Authoritative product name
 * - price: Authoritative database price (never fallback or hardcoded)
 * - stock_quantity: Authoritative stock count (never fabricated)
 * - is_active: Storefront visibility toggle
 * - image_url: Authoritative image asset path (mapped to `image`)
 * - sanskrit_name: Optional Shastriya name (mapped to `sanskritName`)
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
  });

  const parsedPrice = typeof dbProduct.price === 'number' 
    ? dbProduct.price 
    : parseFloat(String(dbProduct.price)) || 0;

  const stockQuantity = dbProduct.stock_quantity ?? 0;
  // In stock only if the product is active AND has positive inventory
  const inStock = Boolean(dbProduct.is_active && stockQuantity > 0);

  return {
    // 1. Authoritative Database Attributes
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    price: parsedPrice,
    stockQuantity,
    inStock,
    isActive: dbProduct.is_active,
    category: dbProduct.category || meta?.category || 'All Products',
    image: (() => {
      const raw = dbProduct.image_url || meta?.image || '/images/products/daaru-mukti-powder.png';
      return raw.includes('?') ? raw : `${raw}?v=20261113`;
    })(),
    sanskritName: dbProduct.sanskrit_name || meta?.sanskritName || undefined,
    volume: dbProduct.volume || meta?.volume || '',
    serving: dbProduct.serving || meta?.serving || undefined,

    // 2. Preserved Rich Clinical, Botanical & Marketing Attributes with Safe Defaults
    subName: meta?.subName || `${dbProduct.name} — Classical Formulation`,
    originalPrice: meta?.originalPrice,
    rating: meta?.rating || 4.9,
    reviewCount: meta?.reviewCount || 100,
    tag: meta?.tag || '',
    badgeColor: meta?.badgeColor || 'bg-[#F5EFE5] text-[#35251F] border-[#D8C3A5]',
    shelfLife: meta?.shelfLife || '24 Months',
    scientificFact: meta?.scientificFact || undefined,
    shortDescription: dbProduct.description || meta?.shortDescription || '',
    heroBenefit: meta?.heroBenefit || dbProduct.description || '',
    symptoms: Array.isArray(meta?.symptoms) ? meta.symptoms : [],
    whyYouNeedIt: Array.isArray(meta?.whyYouNeedIt) ? meta.whyYouNeedIt : [],
    whoShouldTake: meta?.whoShouldTake || undefined,
    keyIngredients: Array.isArray(meta?.keyIngredients) ? meta.keyIngredients : [],
    dosage: meta?.dosage || 'As directed by an Ayurvedic physician.',
    bestTime: meta?.bestTime || 'Morning or evening with lukewarm water.',
    course: meta?.course || 'Recommended 1 to 3 months course.',
    whoShouldNotTake: meta?.whoShouldNotTake || undefined,
    certifications: Array.isArray(meta?.certifications) ? meta.certifications : [
      '100% Classical Ayurvedic Formulation',
      'AYUSH Standard Compliant',
      'Heavy Metal Tested for Purity'
    ],
    colorScheme: meta?.colorScheme || 'bronze'
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
 * Fetches all active products from Supabase and merges them with metadata.
 * Returns an empty array and clear error if connection fails.
 * Never fabricates prices or stock.
 */
export async function fetchActiveProducts(): Promise<ProductsFetchResult> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      error: 'Supabase client is not configured. Please check your .env.local configuration.'
    };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: false });

    if (error) {
      console.error('[Deepali Ayurveda] Error fetching active products:', error);
      return {
        data: [],
        error: `Failed to load remedies from Supabase: ${error.message}`
      };
    }

    if (!data || data.length === 0) {
      return {
        data: [],
        error: null
      };
    }

    const merged = data.map(mergeDatabaseProductWithMetadata);
    return {
      data: merged,
      error: null
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Deepali Ayurveda] Network error fetching products:', err);
    return {
      data: [],
      error: `Network error connecting to Supabase: ${message}`
    };
  }
}

/**
 * Fetches a single product by slug, alias, or UUID from Supabase.
 */
export async function fetchProductBySlugOrId(identifier: string): Promise<SingleProductFetchResult> {
  if (!identifier || identifier.trim().length === 0) {
    return { data: null, error: 'Product identifier is required.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: 'Supabase client is not configured. Please check your .env.local configuration.'
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

    if (error) {
      console.error(`[Deepali Ayurveda] Error fetching product "${cleanId}":`, error);
      return {
        data: null,
        error: `Failed to load product: ${error.message}`
      };
    }

    if (!data) {
      // If canonical search yielded nothing and it wasn't a UUID, try literal slug as fallback
      if (!isUuid) {
        const { data: literalData, error: literalError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('slug', cleanId)
          .maybeSingle();

        if (!literalError && literalData) {
          return {
            data: mergeDatabaseProductWithMetadata(literalData),
            error: null
          };
        }
      }

      return { data: null, error: null };
    }

    return {
      data: mergeDatabaseProductWithMetadata(data),
      error: null
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      data: null,
      error: `Network error retrieving product: ${message}`
    };
  }
}

export const fetchProductBySlug = fetchProductBySlugOrId;
export const fetchProductById = fetchProductBySlugOrId;

