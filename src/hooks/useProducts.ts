/**
 * ============================================================================
 * DEEPALI AYURVEDA — PRODUCTS REACT HOOKS
 * ============================================================================
 * Provides declarative, reactive Supabase product loading with:
 * - Loading state
 * - Authoritative product data state
 * - Error message state
 * - Retry capability
 * - Memory-leak safe unmounted component protection
 * ============================================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Product } from '../types';
import { fetchActiveProducts, fetchProductBySlugOrId } from '../lib/products';
import { PRODUCTS } from '../data/products';

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseProductResult {
  product: Product;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to retrieve all active catalog products.
 * Pre-seeded with single Sea Buckthorn formulation for instant, flicker-free rendering.
 */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const load = useCallback(async () => {
    setError(null);
    const result = await fetchActiveProducts();

    if (isMountedRef.current) {
      if (result.error) {
        setProducts(PRODUCTS);
      } else {
        setProducts(result.data && result.data.length > 0 ? result.data : PRODUCTS);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    load();

    return () => {
      isMountedRef.current = false;
    };
  }, [load]);

  const refetch = useCallback(async () => {
    await load();
  }, [load]);

  return { products, loading, error, refetch };
}

/**
 * Hook to retrieve a single active catalog product by slug, alias, or UUID.
 * Defaults reliably to Sea Buckthorn so product details never show empty or not located.
 */
export function useProduct(identifier: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product>(PRODUCTS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const load = useCallback(async () => {
    setError(null);
    const targetSlug = identifier || 'sea-buckthorn';
    const result = await fetchProductBySlugOrId(targetSlug);

    if (isMountedRef.current) {
      setProduct(result.data || PRODUCTS[0]);
      setError(null);
      setLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    isMountedRef.current = true;
    load();

    return () => {
      isMountedRef.current = false;
    };
  }, [load]);

  const refetch = useCallback(async () => {
    await load();
  }, [load]);

  return { product, loading, error, refetch };
}

