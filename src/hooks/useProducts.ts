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

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to retrieve all active catalog products from Supabase.
 */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await fetchActiveProducts();

    if (isMountedRef.current) {
      if (result.error) {
        setError(result.error);
        setProducts([]);
      } else {
        setProducts(result.data);
        setError(null);
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
 */
export function useProduct(identifier: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const load = useCallback(async () => {
    if (!identifier) {
      setProduct(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await fetchProductBySlugOrId(identifier);

    if (isMountedRef.current) {
      if (result.error) {
        setError(result.error);
        setProduct(null);
      } else {
        setProduct(result.data);
        setError(null);
      }
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

