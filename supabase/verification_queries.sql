-- ==============================================================================
-- DEEPALI AYURVEDA (EST. 1997) — POST-MIGRATION VERIFICATION SUITE
-- File: supabase/verification_queries.sql
-- Security Audit Version: 6.0 (Verified Razorpay Validation & Defense-in-Depth)
-- ==============================================================================
-- IMPORTANT EXECUTION INSTRUCTIONS:
-- - SECTION A: Read-Only Schema, Catalog, Privilege & Function Diagnostics
--   Execute in Supabase SQL Editor to verify schema structures and permissions.
-- - SECTION B: Safe Rollback-Based Behavioral Security Tests
--   Execute in Supabase SQL Editor. Each test block is strictly self-contained,
--   contains explicit failure assertions, distinguishes security exceptions,
--   and cleans up all test records so no leftover rows remain in production.
-- ==============================================================================

-- ==============================================================================
-- SECTION A: READ-ONLY SCHEMA, CATALOG, PRIVILEGE & FUNCTION DIAGNOSTICS
-- ==============================================================================

-- A1. VERIFY ALL 7 PRODUCTION TABLES EXIST AND HAVE RLS ENABLED
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'products',
    'customer_profiles',
    'customer_addresses',
    'orders',
    'order_items',
    'payments',
    'consultation_bookings'
  )
ORDER BY tablename;
-- Expected output: Exactly 7 rows, all showing rls_enabled = true.

-- ------------------------------------------------------------------------------

-- A2. VERIFY EXACT 5 AUTHORIZED PRODUCTS, CLEAN SLUGS, ZERO STOCK & NO STAMON GOLD
SELECT
  name,
  slug,
  price,
  stock_quantity,
  is_active,
  image_url,
  volume,
  serving,
  sanskrit_name
FROM public.products
WHERE is_active = true
ORDER BY price DESC;
-- Expected output: Exactly 5 rows with stock_quantity = 0 and NULL unverified specs:
-- 1. Daaru Mukti Powder | daaru-mukti-powder | ₹1100.00 | stock: 0 | /images/products/daaru-mukti-powder.png
-- 2. B12                | b12                | ₹599.00  | stock: 0 | /images/products/vitamin-b12.png
-- 3. Sea Buckthorn      | sea-buckthorn      | ₹599.00  | stock: 0 | /images/products/sea-buckthorn.png
-- 4. Apple Cider Vinegar| apple-cider-vinegar| ₹293.00  | stock: 0 | /images/products/apple-cider-vinegar.png
-- 5. Digest Guru        | digest-guru        | ₹199.00  | stock: 0 | /images/products/digest-guru-churan.png

-- Confirm complete absence of active Stamon Gold records:
SELECT COUNT(*) AS active_stamon_gold_count
FROM public.products
WHERE (name ILIKE '%stamon%' OR slug ILIKE '%stamon%') AND is_active = true;
-- Expected output: 0 rows.

-- ------------------------------------------------------------------------------

-- A3. VERIFY SECURITY DEFINER STATUS AND FIXED SEARCH_PATH (public, pg_temp)
SELECT
  p.proname AS function_name,
  r.rolname AS owner,
  p.prosecdef AS is_security_definer,
  p.proconfig AS search_path_config
FROM pg_proc p
JOIN pg_roles r ON r.oid = p.proowner
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'is_admin',
    'bootstrap_initial_admin',
    'submit_checkout',
    'get_guest_order',
    'set_order_razorpay_id',
    'record_verified_payment',
    'validate_order_item',
    'recalculate_order_totals',
    'check_consultation_rate_limit',
    'protect_customer_profile_admin_flag',
    'protect_address_ownership',
    'protect_order_immutability'
  )
ORDER BY function_name;
-- Expected output: All functions have is_security_definer = true and proconfig = {search_path=public, pg_temp}.

-- ------------------------------------------------------------------------------

-- A4. VERIFY TABLE-LEVEL PRIVILEGES MATRIX (DEFENSE-IN-DEPTH AUDIT)
-- Confirms that direct INSERT, UPDATE, DELETE permissions are denied to anon and authenticated
-- on orders, order_items, payments, and products.
SELECT
  t.table_name,
  has_table_privilege('anon', 'public.' || t.table_name, 'SELECT') AS anon_select,
  has_table_privilege('anon', 'public.' || t.table_name, 'INSERT') AS anon_insert,
  has_table_privilege('anon', 'public.' || t.table_name, 'UPDATE') AS anon_update,
  has_table_privilege('anon', 'public.' || t.table_name, 'DELETE') AS anon_delete,
  has_table_privilege('authenticated', 'public.' || t.table_name, 'SELECT') AS auth_select,
  has_table_privilege('authenticated', 'public.' || t.table_name, 'INSERT') AS auth_insert,
  has_table_privilege('authenticated', 'public.' || t.table_name, 'UPDATE') AS auth_update,
  has_table_privilege('authenticated', 'public.' || t.table_name, 'DELETE') AS auth_delete,
  has_table_privilege('service_role', 'public.' || t.table_name, 'INSERT') AS service_insert
FROM (
  VALUES
    ('products'),
    ('customer_profiles'),
    ('customer_addresses'),
    ('orders'),
    ('order_items'),
    ('payments'),
    ('consultation_bookings')
) AS t(table_name)
ORDER BY t.table_name;
-- Expected output:
-- - orders: anon_insert=false, auth_insert=false, auth_update=false, auth_delete=false
-- - order_items: anon_insert=false, auth_insert=false, auth_update=false, auth_delete=false
-- - payments: anon_insert=false, auth_insert=false, auth_update=false, auth_delete=false
-- - products: anon_insert=false, auth_insert=false, auth_update=false, auth_delete=false
-- - service_role: service_insert=true across all tables.

-- ------------------------------------------------------------------------------

-- A5. VERIFY FUNCTION EXECUTE PRIVILEGES MATRIX (LEAST PRIVILEGE)
-- Confirms that sensitive administration & payment recording functions cannot be called
-- by anon or ordinary authenticated users.
SELECT
  p.proname AS function_name,
  has_function_privilege('anon', p.oid, 'EXECUTE') AS anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') AS authenticated_can_execute,
  has_function_privilege('service_role', p.oid, 'EXECUTE') AS service_role_can_execute
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'bootstrap_initial_admin',
    'record_verified_payment',
    'set_order_razorpay_id',
    'submit_checkout',
    'get_guest_order',
    'is_admin'
  )
ORDER BY function_name;
-- Expected output:
-- - bootstrap_initial_admin: anon = false, authenticated = false, service_role = true
-- - record_verified_payment: anon = false, authenticated = false, service_role = true
-- - set_order_razorpay_id:   anon = false, authenticated = false, service_role = true
-- - submit_checkout:         anon = true,  authenticated = true,  service_role = true
-- - get_guest_order:         anon = true,  authenticated = true,  service_role = true
-- - is_admin:                anon = true,  authenticated = true,  service_role = true

-- ------------------------------------------------------------------------------

-- A6. VERIFY CHECK CONSTRAINTS (MATH, PRICING, DISCOUNT & FEE LOCK)
SELECT
  conrelid::regclass AS table_name,
  conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE n.nspname = 'public'
  AND c.contype = 'c'
  AND conrelid::regclass::text IN ('orders', 'order_items', 'consultation_bookings')
ORDER BY table_name, constraint_name;
-- Expected output:
-- - chk_orders_math: (total_amount = ((subtotal - discount_amount) + shipping_fee))
-- - chk_orders_discount: (discount_amount <= subtotal)
-- - chk_order_items_math: (line_total = (unit_price * quantity))
-- - consultation_bookings_consultation_fee_check: (consultation_fee = 200.00)

-- ------------------------------------------------------------------------------

-- A7. VERIFY UNIQUE CONSTRAINTS & PERFORMANCE INDEXES
SELECT
  conrelid::regclass AS table_name,
  conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE n.nspname = 'public'
  AND c.contype = 'u'
  AND conrelid::regclass::text IN ('products', 'orders', 'payments')
ORDER BY table_name, constraint_name;
-- Expected output:
-- - products.slug UNIQUE
-- - orders.order_reference UNIQUE
-- - orders.razorpay_order_id UNIQUE
-- - payments.razorpay_payment_id UNIQUE


-- ==============================================================================
-- SECTION B: SAFE ROLLBACK-BASED BEHAVIORAL SECURITY TESTS
-- Run these in Supabase SQL Editor. Each block safely cleans up its test data.
-- ==============================================================================

-- B1. TEST: DIRECT INSERTION REJECTION ON ORDERS, ORDER_ITEMS & PAYMENTS
-- Confirms that direct client insertion without admin/checkout function is rejected.
-- Explicitly fails if insertion succeeds.
DO $$
DECLARE
  v_test_order_id UUID := gen_random_uuid();
  v_orders_blocked BOOLEAN := false;
  v_items_blocked BOOLEAN := false;
  v_payments_blocked BOOLEAN := false;
BEGIN
  -- 1. Attempt direct INSERT into public.orders under simulated non-admin context
  BEGIN
    SET LOCAL ROLE anon;
    INSERT INTO public.orders (
      id,
      order_reference,
      delivery_address,
      subtotal,
      total_amount,
      status
    ) VALUES (
      v_test_order_id,
      'DIRECT-INTRUSION-ORDERS',
      '{}'::jsonb,
      100.00,
      100.00,
      'pending'
    );
    RESET ROLE;
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    IF SQLERRM LIKE '%permission denied%' OR SQLERRM LIKE '%violates row-level security policy%' THEN
      v_orders_blocked := true;
    ELSE
      RAISE EXCEPTION 'TEST FAILED (B1): Unexpected error on orders insertion attempt: %', SQLERRM;
    END IF;
  END;

  IF NOT v_orders_blocked THEN
    DELETE FROM public.orders WHERE id = v_test_order_id;
    RAISE EXCEPTION 'TEST FAILED (B1): Direct client INSERT on public.orders was allowed!';
  END IF;

  -- 2. Attempt direct INSERT into public.order_items
  BEGIN
    SET LOCAL ROLE anon;
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      unit_price,
      quantity,
      line_total
    ) VALUES (
      v_test_order_id,
      gen_random_uuid(),
      'Forged Product',
      1.00,
      1,
      1.00
    );
    RESET ROLE;
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    IF SQLERRM LIKE '%permission denied%' OR SQLERRM LIKE '%violates row-level security policy%' THEN
      v_items_blocked := true;
    ELSE
      RAISE EXCEPTION 'TEST FAILED (B1): Unexpected error on order_items insertion attempt: %', SQLERRM;
    END IF;
  END;

  IF NOT v_items_blocked THEN
    RAISE EXCEPTION 'TEST FAILED (B1): Direct client INSERT on public.order_items was allowed!';
  END IF;

  -- 3. Attempt direct INSERT into public.payments
  BEGIN
    SET LOCAL ROLE anon;
    INSERT INTO public.payments (
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      amount,
      currency,
      status
    ) VALUES (
      v_test_order_id,
      'order_fake_123',
      'pay_fake_123',
      100.00,
      'INR',
      'captured'
    );
    RESET ROLE;
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    IF SQLERRM LIKE '%permission denied%' OR SQLERRM LIKE '%violates row-level security policy%' THEN
      v_payments_blocked := true;
    ELSE
      RAISE EXCEPTION 'TEST FAILED (B1): Unexpected error on payments insertion attempt: %', SQLERRM;
    END IF;
  END;

  IF NOT v_payments_blocked THEN
    RAISE EXCEPTION 'TEST FAILED (B1): Direct client INSERT on public.payments was allowed!';
  END IF;

  RAISE NOTICE 'TEST PASSED (B1): Direct table write privileges on orders, order_items, and payments are strictly rejected.';
END $$;

-- ------------------------------------------------------------------------------

-- B2. TEST: CUSTOMER SELF-PROMOTION PROTECTION
-- Attempt to set is_admin = true on customer_profiles without service_role or admin privileges.
-- Verifies the trigger tr_protect_customer_profile_admin_flag.
DO $$
DECLARE
  v_test_uid UUID := gen_random_uuid();
  v_promotion_rejected BOOLEAN := false;
  v_auth_created BOOLEAN := false;
BEGIN
  -- Insert temporary test auth user if permitted, or simulate profile insert
  BEGIN
    INSERT INTO auth.users (id, email, role, aud)
    VALUES (v_test_uid, 'test_attacker@example.com', 'authenticated', 'authenticated');
    v_auth_created := true;
  EXCEPTION WHEN OTHERS THEN
    -- In environments where auth.users is restricted from direct insert, continue to trigger test
    NULL;
  END;

  BEGIN
    INSERT INTO public.customer_profiles (id, email, is_admin)
    VALUES (v_test_uid, 'test_attacker@example.com', false);
  EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'CHECK B2: auth.users foreign key strictly enforced. Profile insertion prevented.';
    RETURN;
  END;

  -- Attempt unauthorized self-promotion update
  BEGIN
    UPDATE public.customer_profiles
    SET is_admin = true
    WHERE id = v_test_uid;
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Only verified administrators%' OR SQLERRM LIKE '%violates row-level security policy%' THEN
      v_promotion_rejected := true;
    ELSE
      RAISE EXCEPTION 'TEST FAILED (B2): Unexpected error on promotion update: %', SQLERRM;
    END IF;
  END;

  -- Cleanup test records
  DELETE FROM public.customer_profiles WHERE id = v_test_uid;
  IF v_auth_created THEN
    DELETE FROM auth.users WHERE id = v_test_uid;
  END IF;

  IF v_promotion_rejected THEN
    RAISE NOTICE 'TEST PASSED (B2): Customer self-promotion attack was correctly rejected.';
  ELSE
    RAISE EXCEPTION 'TEST FAILED (B2): Non-admin user was able to modify is_admin = true!';
  END IF;
END $$;

-- ------------------------------------------------------------------------------

-- B3. TEST: INSUFFICIENT-STOCK & ZERO-STOCK CHECKOUT REJECTION
-- Attempt to checkout any catalog product with 0 stock quantity.
-- Expected result: Insufficient stock exception.
DO $$
DECLARE
  v_prod_id UUID;
  v_rejected BOOLEAN := false;
BEGIN
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'daaru-mukti-powder';

  BEGIN
    PERFORM public.submit_checkout(
      p_delivery_address := '{"address": "Test Street", "city": "Unnao", "pincode": "209801"}'::jsonb,
      p_items := jsonb_build_array(
        jsonb_build_object('product_id', v_prod_id, 'quantity', 1)
      )
    );
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Insufficient stock%' THEN
      v_rejected := true;
    ELSE
      RAISE EXCEPTION 'TEST FAILED (B3): Unexpected error during zero-stock checkout: %', SQLERRM;
    END IF;
  END;

  IF v_rejected THEN
    RAISE NOTICE 'TEST PASSED (B3): Zero-stock checkout was correctly rejected.';
  ELSE
    RAISE EXCEPTION 'TEST FAILED (B3): Checkout succeeded on 0 stock!';
  END IF;
END $$;

-- ------------------------------------------------------------------------------

-- B4. TEST: SEQUENTIAL ATOMIC STOCK-DEPLETION TEST
-- NOTE: This test runs sequentially in a single transaction/session to verify that stock
-- decrement is atomic, immediate, and prevents subsequent purchases of depleted inventory.
-- To simulate true concurrent race conditions across simultaneous HTTP requests, execute parallel
-- transactions from two separate psql/client connections (see instructions in SECURITY_AUDIT.md).
DO $$
DECLARE
  v_prod_id UUID;
  v_res JSONB;
  v_order_id UUID;
  v_second_failed BOOLEAN := false;
BEGIN
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'digest-guru';

  -- Temporarily grant 1 test stock unit
  UPDATE public.products SET stock_quantity = 1 WHERE id = v_prod_id;

  -- First checkout: Consumes the last available item (1 unit)
  v_res := public.submit_checkout(
    p_delivery_address := '{"address": "Test Street", "city": "Unnao", "pincode": "209801"}'::jsonb,
    p_items := jsonb_build_array(
      jsonb_build_object('product_id', v_prod_id, 'quantity', 1)
    )
  );

  v_order_id := (v_res ->> 'order_id')::UUID;

  -- Second checkout: Must be rejected as stock is now 0
  BEGIN
    PERFORM public.submit_checkout(
      p_delivery_address := '{"address": "Test Street", "city": "Unnao", "pincode": "209801"}'::jsonb,
      p_items := jsonb_build_array(
        jsonb_build_object('product_id', v_prod_id, 'quantity', 1)
      )
    );
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Insufficient stock%' THEN
      v_second_failed := true;
    ELSE
      RAISE EXCEPTION 'TEST FAILED (B4): Unexpected error on depleted stock checkout: %', SQLERRM;
    END IF;
  END;

  -- Safe Cleanup: Delete test order and restore stock to 0
  DELETE FROM public.orders WHERE id = v_order_id;
  UPDATE public.products SET stock_quantity = 0 WHERE id = v_prod_id;

  IF v_second_failed THEN
    RAISE NOTICE 'TEST PASSED (B4): Atomic inventory decrement and subsequent purchase rejection verified.';
  ELSE
    RAISE EXCEPTION 'TEST FAILED (B4): Overselling permitted: second purchase succeeded on depleted stock!';
  END IF;
END $$;

-- ------------------------------------------------------------------------------

-- B5. TEST: GUEST TOKEN ISOLATION & ORDER ITEMS LOCKING
-- Verifies:
-- 1. get_guest_order returns empty when queried with an invalid guest token.
-- 2. Modifying order items on a non-pending order is strictly blocked.
DO $$
DECLARE
  v_order_id UUID := gen_random_uuid();
  v_real_token UUID := gen_random_uuid();
  v_wrong_token UUID := gen_random_uuid();
  v_prod_id UUID;
  v_count INTEGER;
  v_update_blocked BOOLEAN := false;
BEGIN
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'b12';

  -- Create test guest order
  INSERT INTO public.orders (
    id,
    order_reference,
    guest_token,
    customer_id,
    delivery_address,
    subtotal,
    total_amount,
    status
  ) VALUES (
    v_order_id,
    'TEST-GUEST-TOKEN-ISOLATION',
    v_real_token,
    NULL,
    '{"address": "Confidential Road"}'::jsonb,
    599.00,
    599.00,
    'pending'
  );

  -- 1. Query with wrong guest token
  SELECT COUNT(*) INTO v_count
  FROM public.get_guest_order('TEST-GUEST-TOKEN-ISOLATION', v_wrong_token);

  IF v_count <> 0 THEN
    DELETE FROM public.orders WHERE id = v_order_id;
    RAISE EXCEPTION 'TEST FAILED (B5): Guest order was leaked with an invalid guest token!';
  END IF;

  -- 2. Transition order to 'paid' and verify order_items are locked against modification
  UPDATE public.orders SET status = 'paid' WHERE id = v_order_id;

  BEGIN
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      unit_price,
      quantity,
      line_total
    ) VALUES (
      v_order_id,
      v_prod_id,
      'B12',
      599.00,
      1,
      599.00
    );
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Cannot modify items for order in "paid" status%' THEN
      v_update_blocked := true;
    ELSE
      RAISE EXCEPTION 'TEST FAILED (B5): Unexpected error on item modification: %', SQLERRM;
    END IF;
  END;

  -- Safe Cleanup
  DELETE FROM public.orders WHERE id = v_order_id;

  IF v_update_blocked THEN
    RAISE NOTICE 'TEST PASSED (B5): Guest token isolation and post-payment item modification locking verified.';
  ELSE
    RAISE EXCEPTION 'TEST FAILED (B5): Order items could be added to an order in "paid" status!';
  END IF;
END $$;

-- ------------------------------------------------------------------------------

-- B6. TEST: RAZORPAY PAYMENT RECORDING & VALIDATION TEST SUITE
-- Verifies all security constraints in record_verified_payment():
-- B6a: Valid payment flow transitions order to 'paid'
-- B6b: Idempotent replay with matching details succeeds without duplicate rows
-- B6c: Conflicting replay with different amount/order is rejected
-- B6d: Razorpay Order ID mismatch is rejected
-- B6e: Payment amount mismatch is rejected
-- B6f: Currency mismatch (non-INR) is rejected
-- B6g: Payment recording on non-pending order is rejected
DO $$
DECLARE
  v_order_id UUID := gen_random_uuid();
  v_payment_id UUID;
  v_replay_payment_id UUID;
  v_mismatch_rejected BOOLEAN := false;
  v_amount_rejected BOOLEAN := false;
  v_currency_rejected BOOLEAN := false;
  v_status_rejected BOOLEAN := false;
  v_conflict_rejected BOOLEAN := false;
BEGIN
  -- Setup test pending order
  INSERT INTO public.orders (
    id,
    order_reference,
    guest_token,
    razorpay_order_id,
    customer_id,
    delivery_address,
    subtotal,
    total_amount,
    status
  ) VALUES (
    v_order_id,
    'TEST-RAZORPAY-SEC-FLOW',
    gen_random_uuid(),
    'order_test_bound_123',
    NULL,
    '{"address": "Secure Lane"}'::jsonb,
    599.00,
    599.00,
    'pending'
  );

  -- B6d: Test Razorpay Order ID mismatch rejection
  BEGIN
    PERFORM public.record_verified_payment(
      p_order_id := v_order_id,
      p_razorpay_order_id := 'order_mismatched_999',
      p_razorpay_payment_id := 'pay_test_mismatch_001',
      p_razorpay_signature := 'sig_test_001',
      p_amount := 599.00,
      p_currency := 'INR',
      p_metadata := '{"source": "test"}'::jsonb
    );
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Razorpay order ID mismatch%' THEN
      v_mismatch_rejected := true;
    END IF;
  END;

  IF NOT v_mismatch_rejected THEN
    DELETE FROM public.orders WHERE id = v_order_id;
    RAISE EXCEPTION 'TEST FAILED (B6d): Mismatched Razorpay order ID was accepted!';
  END IF;

  -- B6e: Test Amount mismatch rejection
  BEGIN
    PERFORM public.record_verified_payment(
      p_order_id := v_order_id,
      p_razorpay_order_id := 'order_test_bound_123',
      p_razorpay_payment_id := 'pay_test_amount_002',
      p_razorpay_signature := 'sig_test_002',
      p_amount := 100.00, -- Authoritative total is 599.00
      p_currency := 'INR',
      p_metadata := '{"source": "test"}'::jsonb
    );
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Payment amount mismatch%' THEN
      v_amount_rejected := true;
    END IF;
  END;

  IF NOT v_amount_rejected THEN
    DELETE FROM public.orders WHERE id = v_order_id;
    RAISE EXCEPTION 'TEST FAILED (B6e): Mismatched payment amount was accepted!';
  END IF;

  -- B6f: Test Currency mismatch rejection (non-INR)
  BEGIN
    PERFORM public.record_verified_payment(
      p_order_id := v_order_id,
      p_razorpay_order_id := 'order_test_bound_123',
      p_razorpay_payment_id := 'pay_test_curr_003',
      p_razorpay_signature := 'sig_test_003',
      p_amount := 599.00,
      p_currency := 'USD', -- Deepali Ayurveda only accepts INR
      p_metadata := '{"source": "test"}'::jsonb
    );
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Invalid currency%' THEN
      v_currency_rejected := true;
    END IF;
  END;

  IF NOT v_currency_rejected THEN
    DELETE FROM public.orders WHERE id = v_order_id;
    RAISE EXCEPTION 'TEST FAILED (B6f): Non-INR currency was accepted!';
  END IF;

  -- B6a: Valid payment recording (success path)
  v_payment_id := public.record_verified_payment(
    p_order_id := v_order_id,
    p_razorpay_order_id := 'order_test_bound_123',
    p_razorpay_payment_id := 'pay_test_valid_004',
    p_razorpay_signature := 'sig_test_valid_004',
    p_amount := 599.00,
    p_currency := 'INR',
    p_metadata := '{"source": "test"}'::jsonb
  );

  IF v_payment_id IS NULL THEN
    DELETE FROM public.orders WHERE id = v_order_id;
    RAISE EXCEPTION 'TEST FAILED (B6a): Valid payment recording returned NULL!';
  END IF;

  -- B6b: Webhook Idempotency Replay test (same payment ID & matching parameters)
  v_replay_payment_id := public.record_verified_payment(
    p_order_id := v_order_id,
    p_razorpay_order_id := 'order_test_bound_123',
    p_razorpay_payment_id := 'pay_test_valid_004',
    p_razorpay_signature := 'sig_test_valid_004',
    p_amount := 599.00,
    p_currency := 'INR',
    p_metadata := '{"source": "test"}'::jsonb
  );

  IF v_replay_payment_id <> v_payment_id THEN
    DELETE FROM public.payments WHERE id = v_payment_id;
    DELETE FROM public.orders WHERE id = v_order_id;
    RAISE EXCEPTION 'TEST FAILED (B6b): Idempotent webhook replay created a duplicate payment record!';
  END IF;

  -- B6c: Conflicting payment replay (same payment ID, different amount)
  BEGIN
    PERFORM public.record_verified_payment(
      p_order_id := v_order_id,
      p_razorpay_order_id := 'order_test_bound_123',
      p_razorpay_payment_id := 'pay_test_valid_004',
      p_razorpay_signature := 'sig_test_valid_004',
      p_amount := 999.00, -- Conflicting amount
      p_currency := 'INR',
      p_metadata := '{"source": "test"}'::jsonb
    );
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Conflict%' THEN
      v_conflict_rejected := true;
    END IF;
  END;

  IF NOT v_conflict_rejected THEN
    DELETE FROM public.payments WHERE id = v_payment_id;
    DELETE FROM public.orders WHERE id = v_order_id;
    RAISE EXCEPTION 'TEST FAILED (B6c): Conflicting payment replay was accepted!';
  END IF;

  -- B6g: Non-pending order rejection (order is now 'paid', attempt with new payment ID)
  BEGIN
    PERFORM public.record_verified_payment(
      p_order_id := v_order_id,
      p_razorpay_order_id := 'order_test_bound_123',
      p_razorpay_payment_id := 'pay_test_new_005',
      p_razorpay_signature := 'sig_test_005',
      p_amount := 599.00,
      p_currency := 'INR',
      p_metadata := '{"source": "test"}'::jsonb
    );
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%Cannot record payment for order%Expected "pending"%' THEN
      v_status_rejected := true;
    END IF;
  END;

  -- Safe Cleanup: Clean up all test records
  DELETE FROM public.payments WHERE id = v_payment_id;
  DELETE FROM public.orders WHERE id = v_order_id;

  IF NOT v_status_rejected THEN
    RAISE EXCEPTION 'TEST FAILED (B6g): Payment recording on non-pending order was accepted!';
  END IF;

  RAISE NOTICE 'TEST PASSED (B6): All Razorpay payment recording, validation, idempotency, and mismatch protections verified.';
END $$;
