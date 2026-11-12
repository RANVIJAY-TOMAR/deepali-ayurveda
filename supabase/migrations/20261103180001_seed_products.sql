-- ==============================================================================
-- DEEPALI AYURVEDA (EST. 1997) — AUTHORIZED PRODUCT CATALOG SEED
-- Migration: 20261103180001_seed_products.sql
-- ==============================================================================
-- Inserts exactly five authorized products with exact authorized prices:
-- 1. Daaru Mukti Powder: ₹1,100
-- 2. B12: ₹599
-- 3. Sea Buckthorn: ₹599
-- 4. Apple Cider Vinegar: ₹293
-- 5. Digest Guru: ₹199
--
-- Strict Audit Constraints:
-- - Stamon Gold is 100% EXCLUDED from the catalog.
-- - Slugs are simple and directly based on verified names:
--     daaru-mukti-powder, b12, sea-buckthorn, apple-cider-vinegar, digest-guru
-- - Image paths directly align with actual files on disk in public/images/products/.
-- - Unverified claims, ingredients, Sanskrit names, pack sizes, and serving
--   specifications are completely omitted (volume, serving, sanskrit_name = NULL).
-- - Stock quantities initialized to 0 (neutral default; no fabricated inventory).
-- - Safely handles previously drafted inaccurate catalogue rows: deactivates old
--   slugs so they cannot be ordered while preserving foreign key integrity for past orders.
-- ==============================================================================

-- 1. Safely deactivate any obsolete or unauthorized products without breaking past order history
UPDATE public.products
SET is_active = false, updated_at = now()
WHERE (
  slug IN (
    'vitamin-b12-d3-k2-calcium',
    'apple-cider-vinegar-moringa',
    'sea-buckthorn-extract-capsules',
    'digest-guru-churan'
  ) OR name ILIKE '%stamon%' OR slug ILIKE '%stamon%'
)
AND slug NOT IN ('daaru-mukti-powder', 'b12', 'sea-buckthorn', 'apple-cider-vinegar', 'digest-guru');

-- 2. Permanently remove Stamon Gold if no order history references it
DELETE FROM public.products
WHERE (name ILIKE '%stamon%' OR slug ILIKE '%stamon%')
  AND NOT EXISTS (
    SELECT 1 FROM public.order_items WHERE order_items.product_id = products.id
  );

-- 3. Upsert the exact five authorized products
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
  'Daaru Mukti Powder',
  'daaru-mukti-powder',
  'Traditional herbal powder formulation. Verified packaging and specification details pending confirmation.',
  1100.00,
  '/images/products/daaru-mukti-powder.png',
  0,
  true,
  'Ayurvedic Medicines',
  NULL,
  NULL,
  NULL,
  now(),
  now()
),
(
  gen_random_uuid(),
  'B12',
  'b12',
  'Dietary supplement formulation. Verified packaging and specification details pending confirmation.',
  599.00,
  '/images/products/vitamin-b12.png',
  0,
  true,
  'Herbal Formulations',
  NULL,
  NULL,
  NULL,
  now(),
  now()
),
(
  gen_random_uuid(),
  'Sea Buckthorn',
  'sea-buckthorn',
  'Sea buckthorn berry extract formulation. Verified packaging and specification details pending confirmation.',
  599.00,
  '/images/products/sea-buckthorn.png',
  0,
  true,
  'Herbal Formulations',
  NULL,
  NULL,
  NULL,
  now(),
  now()
),
(
  gen_random_uuid(),
  'Apple Cider Vinegar',
  'apple-cider-vinegar',
  'Apple cider vinegar formulation. Verified packaging and specification details pending confirmation.',
  293.00,
  '/images/products/apple-cider-vinegar.png',
  0,
  true,
  'Digestive Wellness',
  NULL,
  NULL,
  NULL,
  now(),
  now()
),
(
  gen_random_uuid(),
  'Digest Guru',
  'digest-guru',
  'Traditional herbal churan formulation. Verified packaging and specification details pending confirmation.',
  199.00,
  '/images/products/digest-guru-churan.png',
  0,
  true,
  'Digestive Wellness',
  NULL,
  NULL,
  NULL,
  now(),
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  is_active = EXCLUDED.is_active,
  category = EXCLUDED.category,
  volume = NULL,
  serving = NULL,
  sanskrit_name = NULL,
  updated_at = now();
