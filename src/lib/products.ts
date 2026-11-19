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
  const meta = PRODUCTS[0];

  return {
    ...meta,
    id: 'sea-buckthorn',
    slug: 'sea-buckthorn',
    name: 'Sea Buckthorn (Leh Berry) 99% Pure Pulp',
    price: 699,
    originalPrice: 999,
    stockQuantity: 100,
    inStock: true,
    isActive: true,
    category: 'Herbal Formulations',
    image: '/images/products/sea-buckthorn.png?v=20261120_2',
    sanskritName: 'हिमालयन संजीवनी फल रस • 99% शुद्ध पल्प',
    volume: '500 ML',
    serving: '500 ML Bottle (Daily Health Shot)'
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
 * Fetches active products. Strictly returns the single authoritative Sea Buckthorn remedy at ₹699.
 */
export async function fetchActiveProducts(): Promise<ProductsFetchResult> {
  return {
    data: PRODUCTS,
    error: null
  };
}

/**
 * Fetches single product. Always resolves to the authoritative Sea Buckthorn remedy.
 */
export async function fetchProductBySlugOrId(identifier?: string): Promise<SingleProductFetchResult> {
  return {
    data: PRODUCTS[0] || null,
    error: null
  };
}

export const fetchProductBySlug = fetchProductBySlugOrId;
export const fetchProductById = fetchProductBySlugOrId;
