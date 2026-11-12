-- ==============================================================================
-- DEEPALI AYURVEDA (EST. 1997) — INITIAL E-COMMERCE DATABASE FOUNDATION
-- Migration: 20261103180000_create_ecommerce_foundation.sql
-- Security Audit Version: 6.0 (Defense-in-Depth & Verified Razorpay Validation)
-- ==============================================================================
-- Tables:
-- 1. products
-- 2. customer_profiles
-- 3. customer_addresses
-- 4. orders
-- 5. order_items
-- 6. payments
-- 7. consultation_bookings
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CORE UTILITY FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Automatic updated_at timestamp maintenance
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC;

-- Server-verified admin authorization function
-- SECURITY DEFINER with fixed search_path (public, pg_temp).
-- Verifies caller JWT claims ('service_role') or verified database admin record.
-- Unsafe CURRENT_USER checks are completely omitted.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() ->> 'role' = 'service_role') OR
    EXISTS (
      SELECT 1 FROM public.customer_profiles
      WHERE id = auth.uid() AND is_admin = true
    ),
    false
  );
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- Automatic Order Reference Generator
-- Generates standardized order identifier (e.g., DA-20261104-A8F29C)
CREATE OR REPLACE FUNCTION public.generate_order_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_reference IS NULL OR trim(NEW.order_reference) = '' THEN
    NEW.order_reference := 'DA-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.generate_order_reference() FROM PUBLIC;

-- ==============================================================================
-- 3. TABLE: products
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(trim(name)) >= 2),
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  category TEXT,
  volume TEXT,
  serving TEXT,
  sanskrit_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS tr_products_updated_at ON public.products;
CREATE TRIGGER tr_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 4. TABLE: customer_profiles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  prakriti TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS tr_customer_profiles_updated_at ON public.customer_profiles;
CREATE TRIGGER tr_customer_profiles_updated_at
  BEFORE UPDATE ON public.customer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Protection trigger: Prevents non-administrators from modifying the is_admin flag.
CREATE OR REPLACE FUNCTION public.protect_customer_profile_admin_flag()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Unauthorized: Only verified administrators or service_role can modify the is_admin status.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.protect_customer_profile_admin_flag() FROM PUBLIC;

DROP TRIGGER IF EXISTS tr_protect_customer_profile_admin ON public.customer_profiles;
CREATE TRIGGER tr_protect_customer_profile_admin
  BEFORE UPDATE ON public.customer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_customer_profile_admin_flag();

-- Secure Initial Administrator Bootstrap Function
-- Features:
-- 1. Uses an advisory transaction lock to serialize concurrent calls.
-- 2. Checks that ZERO administrators currently exist in customer_profiles (or caller is service_role).
-- 3. Verifies that the specified admin_email exists in auth.users.
-- 4. Permissions strictly revoked from PUBLIC, anon, and authenticated.
CREATE OR REPLACE FUNCTION public.bootstrap_initial_admin(admin_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_admin_count INTEGER;
BEGIN
  -- Acquire transaction-level advisory lock to serialize concurrent calls
  PERFORM pg_advisory_xact_lock(hashtext('deepali_admin_bootstrap_lock'));

  SELECT COUNT(*) INTO v_admin_count FROM public.customer_profiles WHERE is_admin = true;

  IF v_admin_count > 0 AND (auth.jwt() ->> 'role' IS DISTINCT FROM 'service_role') THEN
    RAISE EXCEPTION 'Unauthorized: Initial admin bootstrap is permanently disabled because an administrator already exists.';
  END IF;

  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE lower(trim(email)) = lower(trim(admin_email))
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email "%" does not exist in auth.users. Please sign up the account first.', trim(admin_email);
  END IF;

  INSERT INTO public.customer_profiles (id, email, is_admin, created_at, updated_at)
  VALUES (v_user_id, lower(trim(admin_email)), true, now(), now())
  ON CONFLICT (id) DO UPDATE SET is_admin = true, email = lower(trim(admin_email)), updated_at = now();
END;
$$;

-- Restrict bootstrap_initial_admin execution exclusively to postgres and service_role
REVOKE ALL ON FUNCTION public.bootstrap_initial_admin(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.bootstrap_initial_admin(TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.bootstrap_initial_admin(TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_initial_admin(TEXT) TO postgres, service_role;

-- ==============================================================================
-- 5. TABLE: customer_addresses
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL CHECK (length(trim(full_name)) >= 2),
  phone TEXT NOT NULL CHECK (phone ~ '^[0-9+ -]{10,15}$'),
  address_line TEXT NOT NULL CHECK (length(trim(address_line)) >= 5),
  city TEXT NOT NULL CHECK (length(trim(city)) >= 2),
  state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
  pincode TEXT NOT NULL CHECK (pincode ~ '^[0-9]{6}$'),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS tr_customer_addresses_updated_at ON public.customer_addresses;
CREATE TRIGGER tr_customer_addresses_updated_at
  BEFORE UPDATE ON public.customer_addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Protection trigger: Prevents reassigning address ownership to another user
CREATE OR REPLACE FUNCTION public.protect_address_ownership()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_id IS DISTINCT FROM OLD.customer_id AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot reassign address ownership to another user.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.protect_address_ownership() FROM PUBLIC;

DROP TRIGGER IF EXISTS tr_protect_address_ownership ON public.customer_addresses;
CREATE TRIGGER tr_protect_address_ownership
  BEFORE UPDATE ON public.customer_addresses
  FOR EACH ROW EXECUTE FUNCTION public.protect_address_ownership();

-- ==============================================================================
-- 6. TABLE: orders
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference TEXT NOT NULL UNIQUE,
  guest_token UUID NOT NULL DEFAULT gen_random_uuid(),
  razorpay_order_id TEXT UNIQUE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  delivery_address JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
  shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_fee >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL DEFAULT 'online',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_orders_math CHECK (total_amount = (subtotal - discount_amount + shipping_fee)),
  CONSTRAINT chk_orders_discount CHECK (discount_amount <= subtotal)
);

DROP TRIGGER IF EXISTS tr_orders_reference ON public.orders;
CREATE TRIGGER tr_orders_reference
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_reference();

DROP TRIGGER IF EXISTS tr_orders_updated_at ON public.orders;
CREATE TRIGGER tr_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Dedicated server-side function to assign Razorpay Order ID to an existing pending order
CREATE OR REPLACE FUNCTION public.set_order_razorpay_id(p_order_id UUID, p_razorpay_order_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
BEGIN
  IF (auth.jwt() ->> 'role' IS DISTINCT FROM 'service_role') AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only trusted backend services can assign Razorpay order IDs.';
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order "%" does not exist.', p_order_id;
  END IF;

  IF v_order.status <> 'pending' THEN
    RAISE EXCEPTION 'Cannot assign Razorpay order ID to order with status "%". Expected "pending".', v_order.status;
  END IF;

  IF v_order.razorpay_order_id IS NOT NULL AND v_order.razorpay_order_id <> p_razorpay_order_id THEN
    RAISE EXCEPTION 'Conflict: Order "%" already has a different Razorpay order ID ("%").', p_order_id, v_order.razorpay_order_id;
  END IF;

  UPDATE public.orders
  SET razorpay_order_id = p_razorpay_order_id, updated_at = now()
  WHERE id = p_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.set_order_razorpay_id(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_order_razorpay_id(UUID, TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.set_order_razorpay_id(UUID, TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.set_order_razorpay_id(UUID, TEXT) TO service_role;

-- ==============================================================================
-- 7. TABLE: order_items
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_order_items_math CHECK (line_total = (unit_price * quantity))
);

-- Integrity Trigger: Validates order status on INSERT and UPDATE.
-- Rejects changes after payment, prevents changing order_id/product_id,
-- strictly prevents NULL product_id, and calculates authoritative line totals.
CREATE OR REPLACE FUNCTION public.validate_order_item()
RETURNS TRIGGER AS $$
DECLARE
  v_product public.products%ROWTYPE;
  v_order public.orders%ROWTYPE;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = NEW.order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Referenced order does not exist.';
  END IF;

  -- Items can only be added or modified on a pending order (blocks changes after payment)
  IF v_order.status <> 'pending' THEN
    RAISE EXCEPTION 'Cannot modify items for an order with status "%". Expected "pending".', v_order.status;
  END IF;

  -- On UPDATE, prevent changing order_id or product_id
  IF TG_OP = 'UPDATE' THEN
    IF NEW.order_id <> OLD.order_id THEN
      RAISE EXCEPTION 'Cannot reassign order_id on an existing order item.';
    END IF;
    IF NEW.product_id <> OLD.product_id THEN
      RAISE EXCEPTION 'Cannot change product_id on an existing order item.';
    END IF;
  END IF;

  -- Strictly prevent NULL product_id
  IF NEW.product_id IS NULL THEN
    RAISE EXCEPTION 'Order items must reference a valid active catalog product.';
  END IF;

  SELECT * INTO v_product FROM public.products WHERE id = NEW.product_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Referenced product does not exist in catalog.';
  END IF;

  IF NOT v_product.is_active AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Product "%" is currently inactive and cannot be ordered.', v_product.name;
  END IF;

  -- Enforce authoritative catalog name, price, and exact line_total
  NEW.product_name := v_product.name;
  NEW.unit_price := v_product.price;
  NEW.line_total := ROUND((v_product.price * NEW.quantity)::numeric, 2);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.validate_order_item() FROM PUBLIC;

DROP TRIGGER IF EXISTS tr_validate_order_item ON public.order_items;
CREATE TRIGGER tr_validate_order_item
  BEFORE INSERT OR UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.validate_order_item();

-- Automatic order subtotal & total recalculation trigger
CREATE OR REPLACE FUNCTION public.recalculate_order_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_order_id UUID;
  v_subtotal NUMERIC(10, 2);
  v_shipping NUMERIC(10, 2);
  v_discount NUMERIC(10, 2);
BEGIN
  v_order_id := COALESCE(NEW.order_id, OLD.order_id);

  SELECT COALESCE(SUM(line_total), 0.00) INTO v_subtotal
  FROM public.order_items
  WHERE order_id = v_order_id;

  SELECT shipping_fee, discount_amount INTO v_shipping, v_discount
  FROM public.orders
  WHERE id = v_order_id;

  UPDATE public.orders
  SET subtotal = v_subtotal,
      total_amount = (v_subtotal - COALESCE(v_discount, 0.00) + COALESCE(v_shipping, 0.00)),
      updated_at = now()
  WHERE id = v_order_id AND status = 'pending';

  RETURN NULL;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.recalculate_order_totals() FROM PUBLIC;

DROP TRIGGER IF EXISTS tr_recalculate_order_totals ON public.order_items;
CREATE TRIGGER tr_recalculate_order_totals
  AFTER INSERT OR UPDATE OR DELETE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_order_totals();

-- ==============================================================================
-- 8. SECURE ORDER LOOKUP FOR GUESTS
-- ==============================================================================
-- Requires matching BOTH order_reference and unguessable bearer guest_token.
-- Never exposes the guest_token in the returned columns.
-- Placed after both public.orders and public.order_items exist.
CREATE OR REPLACE FUNCTION public.get_guest_order(p_order_reference TEXT, p_guest_token UUID)
RETURNS TABLE (
  order_id UUID,
  order_reference TEXT,
  razorpay_order_id TEXT,
  delivery_address JSONB,
  subtotal NUMERIC(10, 2),
  shipping_fee NUMERIC(10, 2),
  discount_amount NUMERIC(10, 2),
  total_amount NUMERIC(10, 2),
  status TEXT,
  created_at TIMESTAMPTZ,
  order_items JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.id AS order_id,
    o.order_reference,
    o.razorpay_order_id,
    o.delivery_address,
    o.subtotal,
    o.shipping_fee,
    o.discount_amount,
    o.total_amount,
    o.status,
    o.created_at,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'product_name', oi.product_name,
            'unit_price', oi.unit_price,
            'quantity', oi.quantity,
            'line_total', oi.line_total
          )
        )
        FROM public.order_items oi
        WHERE oi.order_id = o.id
      ),
      '[]'::jsonb
    ) AS order_items
  FROM public.orders o
  WHERE o.order_reference = p_order_reference
    AND o.guest_token = p_guest_token
    AND o.customer_id IS NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.get_guest_order(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_guest_order(TEXT, UUID) TO anon, authenticated, service_role;

-- ==============================================================================
-- 9. CONTROLLED ATOMIC CHECKOUT FUNCTION
-- ==============================================================================
-- Validates active products, checks positive quantity, locks inventory (FOR UPDATE in sorted order),
-- prevents overselling (rejects 0 stock), calculates subtotal/total server-side,
-- and inserts orders + order_items atomically.
CREATE OR REPLACE FUNCTION public.submit_checkout(
  p_delivery_address JSONB,
  p_items JSONB,
  p_customer_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order_id UUID;
  v_order_reference TEXT;
  v_guest_token UUID;
  v_customer_id UUID;
  v_subtotal NUMERIC(10, 2) := 0.00;
  v_shipping_fee NUMERIC(10, 2) := 0.00;
  v_discount_amount NUMERIC(10, 2) := 0.00;
  v_total_amount NUMERIC(10, 2);
  v_item JSONB;
  v_product_id UUID;
  v_qty INTEGER;
  v_product public.products%ROWTYPE;
BEGIN
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Checkout items cannot be empty.';
  END IF;

  IF p_delivery_address IS NULL OR jsonb_typeof(p_delivery_address) <> 'object' THEN
    RAISE EXCEPTION 'Valid delivery address object is required.';
  END IF;

  v_customer_id := auth.uid();
  v_guest_token := gen_random_uuid();

  -- Acquire row-level locks on requested products in sorted UUID order to prevent deadlocks
  FOR v_product_id IN 
    SELECT DISTINCT (val->>'product_id')::UUID 
    FROM jsonb_array_elements(p_items) val 
    ORDER BY (val->>'product_id')::UUID
  LOOP
    PERFORM 1 FROM public.products WHERE id = v_product_id FOR UPDATE;
  END LOOP;

  -- Validate stock and decrement inventory
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item ->> 'product_id')::UUID;
    v_qty := (v_item ->> 'quantity')::INTEGER;

    IF v_qty IS NULL OR v_qty <= 0 THEN
      RAISE EXCEPTION 'Product quantity must be a positive integer.';
    END IF;

    SELECT * INTO v_product
    FROM public.products
    WHERE id = v_product_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product with ID "%" does not exist in catalog.', v_product_id;
    END IF;

    IF NOT v_product.is_active THEN
      RAISE EXCEPTION 'Product "%" is currently inactive and cannot be purchased.', v_product.name;
    END IF;

    -- Inventory check: Rejects zero-stock and insufficient stock
    IF v_product.stock_quantity < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for product "%". Available: %, requested: %.',
        v_product.name, v_product.stock_quantity, v_qty;
    END IF;

    v_subtotal := v_subtotal + ROUND((v_product.price * v_qty)::numeric, 2);

    UPDATE public.products
    SET stock_quantity = stock_quantity - v_qty, updated_at = now()
    WHERE id = v_product_id;
  END LOOP;

  v_total_amount := v_subtotal - v_discount_amount + v_shipping_fee;

  INSERT INTO public.orders (
    customer_id,
    guest_token,
    delivery_address,
    subtotal,
    discount_amount,
    shipping_fee,
    total_amount,
    payment_method,
    status,
    customer_notes
  ) VALUES (
    v_customer_id,
    v_guest_token,
    p_delivery_address,
    v_subtotal,
    v_discount_amount,
    v_shipping_fee,
    v_total_amount,
    'online',
    'pending',
    p_customer_notes
  ) RETURNING id, order_reference INTO v_order_id, v_order_reference;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item ->> 'product_id')::UUID;
    v_qty := (v_item ->> 'quantity')::INTEGER;

    SELECT * INTO v_product FROM public.products WHERE id = v_product_id;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      unit_price,
      quantity,
      line_total
    ) VALUES (
      v_order_id,
      v_product.id,
      v_product.name,
      v_product.price,
      v_qty,
      ROUND((v_product.price * v_qty)::numeric, 2)
    );
  END LOOP;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_reference', v_order_reference,
    'guest_token', CASE WHEN v_customer_id IS NULL THEN v_guest_token ELSE NULL END,
    'subtotal', v_subtotal,
    'shipping_fee', v_shipping_fee,
    'discount_amount', v_discount_amount,
    'total_amount', v_total_amount,
    'status', 'pending'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_checkout(JSONB, JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_checkout(JSONB, JSONB, TEXT) TO anon, authenticated, service_role;

-- ==============================================================================
-- 8. TABLE: payments
-- ==============================================================================
-- PCI/RBI Compliance: Never stores credit/debit card numbers, CVVs, or UPI PINs.
-- Deduplication: razorpay_payment_id is UNIQUE to block duplicate webhook replay attacks.
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
  verification_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS tr_payments_updated_at ON public.payments;
CREATE TRIGGER tr_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.sync_payment_status_to_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'captured' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'captured') THEN
    UPDATE public.orders
    SET status = 'paid', updated_at = now()
    WHERE id = NEW.order_id AND status = 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.sync_payment_status_to_order() FROM PUBLIC;

DROP TRIGGER IF EXISTS tr_sync_payment_status ON public.payments;
CREATE TRIGGER tr_sync_payment_status
  AFTER INSERT OR UPDATE OF status ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.sync_payment_status_to_order();

-- Trusted Backend Payment Recording Function
-- Note: The Razorpay HMAC-SHA256 signature must be verified in the server-side
-- Supabase Edge Function using the Razorpay webhook secret before calling this procedure.
-- Features:
-- 1. Idempotency: Handles repeated webhook events for the same razorpay_payment_id safely.
-- 2. Checks order status is 'pending' and currency is 'INR'.
-- 3. Verifies exact amount match against authoritative order total.
-- 4. Confirms razorpay_order_id matches the previously assigned Razorpay Order ID.
CREATE OR REPLACE FUNCTION public.record_verified_payment(
  p_order_id UUID,
  p_razorpay_order_id TEXT,
  p_razorpay_payment_id TEXT,
  p_razorpay_signature TEXT,
  p_amount NUMERIC(10, 2),
  p_currency TEXT DEFAULT 'INR',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_existing_payment public.payments%ROWTYPE;
  v_payment_id UUID;
BEGIN
  -- Strict security: Only callable by service_role (backend edge function after signature verification)
  IF (auth.jwt() ->> 'role' IS DISTINCT FROM 'service_role') THEN
    RAISE EXCEPTION 'Unauthorized: Only trusted backend services with service_role can record verified payments.';
  END IF;

  -- Validate payment identifier format
  IF p_razorpay_payment_id IS NULL OR length(trim(p_razorpay_payment_id)) < 5 THEN
    RAISE EXCEPTION 'Invalid payment identifier: "%".', p_razorpay_payment_id;
  END IF;

  -- Validate razorpay_order_id format
  IF p_razorpay_order_id IS NULL OR length(trim(p_razorpay_order_id)) < 5 THEN
    RAISE EXCEPTION 'Invalid Razorpay order identifier: "%".', p_razorpay_order_id;
  END IF;

  -- 1. Webhook Idempotency Check: Return existing payment record if already processed for this order & amount
  SELECT * INTO v_existing_payment
  FROM public.payments
  WHERE razorpay_payment_id = p_razorpay_payment_id;

  IF FOUND THEN
    IF v_existing_payment.order_id = p_order_id
       AND v_existing_payment.amount = p_amount
       AND v_existing_payment.currency = p_currency
       AND v_existing_payment.razorpay_order_id = p_razorpay_order_id THEN
      RETURN v_existing_payment.id;
    ELSE
      RAISE EXCEPTION 'Conflict: Payment ID "%" was previously recorded with conflicting order, amount, or currency details.', p_razorpay_payment_id;
    END IF;
  END IF;

  -- 2. Lock order row for update
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order "%" does not exist.', p_order_id;
  END IF;

  -- 3. Reject if order is not pending
  IF v_order.status <> 'pending' THEN
    RAISE EXCEPTION 'Cannot record payment for order "%" with status "%". Expected "pending".', p_order_id, v_order.status;
  END IF;

  -- 4. Verify Razorpay Order ID matches what was created for this order
  IF v_order.razorpay_order_id IS NOT NULL AND v_order.razorpay_order_id <> p_razorpay_order_id THEN
    RAISE EXCEPTION 'Razorpay order ID mismatch: expected "%", received "%".', v_order.razorpay_order_id, p_razorpay_order_id;
  END IF;

  -- 5. Currency must be INR
  IF p_currency <> 'INR' THEN
    RAISE EXCEPTION 'Invalid currency "%". Deepali Ayurveda only accepts INR.', p_currency;
  END IF;

  -- 6. Exact amount verification against authoritative order total
  IF v_order.total_amount <> p_amount THEN
    RAISE EXCEPTION 'Payment amount mismatch: received %, expected order total %.', p_amount, v_order.total_amount;
  END IF;

  -- 7. Insert payment record as captured
  INSERT INTO public.payments (
    order_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency,
    status,
    verification_metadata
  ) VALUES (
    p_order_id,
    p_razorpay_order_id,
    p_razorpay_payment_id,
    p_razorpay_signature,
    p_amount,
    p_currency,
    'captured',
    p_metadata
  ) RETURNING id INTO v_payment_id;

  -- 8. Bind razorpay_order_id if not already set, and transition order to 'paid'
  UPDATE public.orders
  SET status = 'paid',
      razorpay_order_id = COALESCE(orders.razorpay_order_id, p_razorpay_order_id),
      updated_at = now()
  WHERE id = p_order_id;

  RETURN v_payment_id;
END;
$$;

-- Restrict record_verified_payment strictly to service_role
REVOKE ALL ON FUNCTION public.record_verified_payment(UUID, TEXT, TEXT, TEXT, NUMERIC, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_verified_payment(UUID, TEXT, TEXT, TEXT, NUMERIC, TEXT, JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.record_verified_payment(UUID, TEXT, TEXT, TEXT, NUMERIC, TEXT, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.record_verified_payment(UUID, TEXT, TEXT, TEXT, NUMERIC, TEXT, JSONB) TO service_role;

-- ==============================================================================
-- 9. TABLE: consultation_bookings
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.consultation_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL CHECK (length(trim(customer_name)) >= 2),
  customer_phone TEXT NOT NULL CHECK (customer_phone ~ '^[0-9+ -]{10,15}$'),
  customer_email TEXT,
  health_concern TEXT,
  preferred_time_slot TEXT,
  preferred_datetime TIMESTAMPTZ,
  consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 200.00 CHECK (consultation_fee = 200.00),
  booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS tr_consultation_bookings_updated_at ON public.consultation_bookings;
CREATE TRIGGER tr_consultation_bookings_updated_at
  BEFORE UPDATE ON public.consultation_bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Spam Protection & Concurrency-Safe Rate Limiting Trigger
CREATE OR REPLACE FUNCTION public.check_consultation_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_recent_count INTEGER;
BEGIN
  -- Concurrency control: Serialize requests for the same phone number
  PERFORM pg_advisory_xact_lock(hashtext(NEW.customer_phone));

  SELECT COUNT(*) INTO v_recent_count
  FROM public.consultation_bookings
  WHERE customer_phone = NEW.customer_phone
    AND created_at >= (now() - interval '1 hour');

  IF v_recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Too many consultation bookings submitted from this phone number. Please wait or contact support at +91 91400 86856.';
  END IF;

  NEW.consultation_fee := 200.00;
  NEW.booking_status := 'pending';
  NEW.payment_status := 'pending';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.check_consultation_rate_limit() FROM PUBLIC;

DROP TRIGGER IF EXISTS tr_check_consultation_rate_limit ON public.consultation_bookings;
CREATE TRIGGER tr_check_consultation_rate_limit
  BEFORE INSERT ON public.consultation_bookings
  FOR EACH ROW EXECUTE FUNCTION public.check_consultation_rate_limit();

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all 7 tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Defense-in-Depth: Revoke table-level direct write privileges from anon & authenticated
REVOKE INSERT, UPDATE, DELETE ON public.payments FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.orders FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.order_items FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.products FROM anon, authenticated;

-- Products RLS
DROP POLICY IF EXISTS "Public visitors can view active products" ON public.products;
CREATE POLICY "Public visitors can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Customer Profiles RLS
DROP POLICY IF EXISTS "Customers can view their own profile" ON public.customer_profiles;
CREATE POLICY "Customers can view their own profile"
  ON public.customer_profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Customers can update their own profile" ON public.customer_profiles;
CREATE POLICY "Customers can update their own profile"
  ON public.customer_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND is_admin = false);

DROP POLICY IF EXISTS "Customers can insert their own profile" ON public.customer_profiles;
CREATE POLICY "Customers can insert their own profile"
  ON public.customer_profiles FOR INSERT
  WITH CHECK (auth.uid() = id AND is_admin = false);

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.customer_profiles;
CREATE POLICY "Admins can manage all profiles"
  ON public.customer_profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Customer Addresses RLS
DROP POLICY IF EXISTS "Customers can view their own addresses" ON public.customer_addresses;
CREATE POLICY "Customers can view their own addresses"
  ON public.customer_addresses FOR SELECT
  USING (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "Customers can insert their own addresses" ON public.customer_addresses;
CREATE POLICY "Customers can insert their own addresses"
  ON public.customer_addresses FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers can update their own addresses" ON public.customer_addresses;
CREATE POLICY "Customers can update their own addresses"
  ON public.customer_addresses FOR UPDATE
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers can delete their own addresses" ON public.customer_addresses;
CREATE POLICY "Customers can delete their own addresses"
  ON public.customer_addresses FOR DELETE
  USING (auth.uid() = customer_id);

-- Orders RLS
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
CREATE POLICY "Customers can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "Only trusted checkout function or admin can insert orders" ON public.orders;
CREATE POLICY "Only trusted checkout function or admin can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins or server functions can update orders" ON public.orders;
CREATE POLICY "Only admins or server functions can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Order Items RLS
DROP POLICY IF EXISTS "Customers can view their own order items" ON public.order_items;
CREATE POLICY "Customers can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Only trusted checkout function or admin can insert order items" ON public.order_items;
CREATE POLICY "Only trusted checkout function or admin can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update order items" ON public.order_items;
CREATE POLICY "Only admins can update order items"
  ON public.order_items FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Payments RLS
DROP POLICY IF EXISTS "Customers can view their own payment records" ON public.payments;
CREATE POLICY "Customers can view their own payment records"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payments.order_id
      AND (orders.customer_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Only server functions can insert or update payments" ON public.payments;
CREATE POLICY "Only server functions can insert or update payments"
  ON public.payments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Consultation Bookings RLS
DROP POLICY IF EXISTS "Customers can view their own consultations" ON public.consultation_bookings;
CREATE POLICY "Customers can view their own consultations"
  ON public.consultation_bookings FOR SELECT
  USING (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "Public visitors can create consultation booking" ON public.consultation_bookings;
CREATE POLICY "Public visitors can create consultation booking"
  ON public.consultation_bookings FOR INSERT
  WITH CHECK (
    (auth.uid() = customer_id OR customer_id IS NULL)
    AND booking_status = 'pending'
    AND payment_status = 'pending'
    AND consultation_fee = 200.00
  );

DROP POLICY IF EXISTS "Only admins can update consultation bookings" ON public.consultation_bookings;
CREATE POLICY "Only admins can update consultation bookings"
  ON public.consultation_bookings FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 11. AUDITED PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON public.customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_guest_token ON public.orders(guest_token);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_consultations_customer_id ON public.consultation_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_consultations_phone ON public.consultation_bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultation_bookings(booking_status);
