-- ==============================================================================
-- DEEPALI AYURVEDA (EST. 1997) — AUTHORIZED PRODUCT CATALOG SEED
-- Migration: 20261103180001_seed_products.sql
-- ==============================================================================
-- Single Active Flagship Product:
-- Sea Buckthorn 99% Pure Pulp (500 ML): ₹699.00 with Free Pan-India Delivery
-- Deactivates all other products from the storefront.
-- ==============================================================================

-- 1. Safely deactivate all other products without breaking past order foreign keys
UPDATE public.products
SET is_active = false, updated_at = now()
WHERE slug != 'sea-buckthorn';

-- 2. Permanently remove obsolete products if no order history references them
DELETE FROM public.products
WHERE slug NOT IN ('sea-buckthorn')
  AND NOT EXISTS (
    SELECT 1 FROM public.order_items WHERE order_items.product_id = products.id
  );

-- 3. Upsert the authorized Sea Buckthorn product
INSERT INTO public.products (
  id,
  name,
  slug,
  description,
  price,
  image_url,
  stock_quantity,
  is_active,
  category,
  volume,
  serving,
  sanskrit_name,
  created_at,
  updated_at
) VALUES
(
  gen_random_uuid(),
  'Sea Buckthorn 99% Pure Pulp',
  'sea-buckthorn',
  'Himalayan Sea Buckthorn 99% Pure Pulp Daily Health Shot 500 ML Health Supplement by Deepali Ayurveda. Free Delivery PAN India.',
  699.00,
  '/images/products/sea-buckthorn.png',
  100,
  true,
  'Herbal Formulations',
  '500 ML',
  '500 ML Bottle (Daily Health Shot)',
  'हिमालयन संजीवनी फल रस',
  now(),
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  stock_quantity = EXCLUDED.stock_quantity,
  is_active = EXCLUDED.is_active,
  category = EXCLUDED.category,
  volume = EXCLUDED.volume,
  serving = EXCLUDED.serving,
  sanskrit_name = EXCLUDED.sanskrit_name,
  updated_at = now();
