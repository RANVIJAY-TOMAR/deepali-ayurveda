import { supabase, isSupabaseConfigured } from './supabase';
import type { Database } from '../types/database';

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  specialNotes?: string;
  paymentMethod?: string;
}

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
  productName?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface CheckoutSubmissionResult {
  success: boolean;
  orderId?: string;
  orderReference?: string;
  guestToken?: string | null;
  totalAmount?: number;
  subtotal?: number;
  shippingFee?: number;
  discountAmount?: number;
  status?: string;
  error?: string;
}

export interface RetrievedOrder {
  orderId: string;
  orderReference: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  razorpayOrderId?: string | null;
  deliveryAddress: {
    fullName?: string;
    phone?: string;
    email?: string | null;
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  orderItems: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

// Authoritative mapping for product slug aliases
export const PRODUCT_SLUG_MAP: Record<string, string> = {
  'daaru-mukti-powder': 'daaru-mukti-powder',
  'vitamin-b12-d3-k2-calcium': 'b12',
  'b12': 'b12',
  'sea-buckthorn-extract-capsules': 'sea-buckthorn',
  'sea-buckthorn': 'sea-buckthorn',
  'apple-cider-vinegar-moringa': 'apple-cider-vinegar',
  'apple-cider-vinegar': 'apple-cider-vinegar',
  'digest-guru-churan': 'digest-guru',
  'digest-guru': 'digest-guru'
};

// Authoritative fallback catalog prices strictly matching specifications:
// 1. Daaru Mukti Powder: ₹1,100
// 2. B12: ₹599
// 3. Sea Buckthorn: ₹599
// 4. Apple Cider Vinegar: ₹293
// 5. Digest Guru: ₹199
export const AUTHORITATIVE_PRICES: Record<string, number> = {
  'daaru-mukti-powder': 1100.00,
  'b12': 599.00,
  'sea-buckthorn': 599.00,
  'apple-cider-vinegar': 293.00,
  'digest-guru': 199.00
};

/**
 * Validates checkout form data according to database constraint rules.
 */
export function validateCheckoutForm(
  formData: CheckoutFormData,
  items: CheckoutItemInput[]
): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. Full name validation: >= 2 chars
  if (!formData.fullName || formData.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  // 2. Phone validation: 10-15 digits matching database regex ^[0-9+ -]{10,15}$
  const phoneRegex = /^[0-9+ -]{10,15}$/;
  const cleanPhone = formData.phone ? formData.phone.trim() : '';
  if (!cleanPhone || !phoneRegex.test(cleanPhone) || cleanPhone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Please enter a valid 10-digit mobile number.';
  }

  // 3. Email (optional, but must be valid if provided)
  if (formData.email && formData.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
  }

  // 4. Street address validation: >= 5 chars
  if (!formData.address || formData.address.trim().length < 5) {
    errors.address = 'Street address must be at least 5 characters.';
  }

  // 5. City validation: >= 2 chars
  if (!formData.city || formData.city.trim().length < 2) {
    errors.city = 'City name must be at least 2 characters.';
  }

  // 6. State validation
  if (!formData.state || formData.state.trim().length < 2) {
    errors.state = 'State is required.';
  }

  // 7. Pincode validation: 6 digits matching database regex ^[0-9]{6}$
  const pincodeRegex = /^[0-9]{6}$/;
  if (!formData.pincode || !pincodeRegex.test(formData.pincode.trim())) {
    errors.pincode = 'Please enter a valid 6-digit Indian PIN code.';
  }

  // 8. Items validation
  if (!items || items.length === 0) {
    errors.items = 'Your shopping basket is empty.';
  } else {
    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        errors.items = 'All item quantities must be at least 1.';
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Executes secure checkout via the existing submit_checkout() database RPC function.
 * Fetches authoritative database products and prices, locks stock, and generates
 * the order reference server-side.
 */
export async function submitSecureCheckout(
  formData: CheckoutFormData,
  items: CheckoutItemInput[]
): Promise<CheckoutSubmissionResult> {
  // Step 1: Frontend validation
  const validation = validateCheckoutForm(formData, items);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0];
    return { success: false, error: firstError };
  }

  // Step 2: Supabase connection check
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase backend is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    };
  }

  try {
    // Step 3: Fetch active catalog products from Supabase to obtain database UUIDs and authoritative prices
    const { data: dbProducts, error: prodErr } = await supabase
      .from('products')
      .select('id, name, slug, price, stock_quantity, is_active')
      .eq('is_active', true);

    if (prodErr) {
      return {
        success: false,
        error: `Failed to verify catalog with database: ${prodErr.message}`
      };
    }

    if (!dbProducts || dbProducts.length === 0) {
      return {
        success: false,
        error: 'No active products found in the database catalogue.'
      };
    }

    // Step 4: Map cart items to verified database product records
    const rpcItemsPayload: Array<{ product_id: string; quantity: number }> = [];

    for (const cartItem of items) {
      // Find matching database product by id, slug, or mapped slug alias
      const canonicalSlug = PRODUCT_SLUG_MAP[cartItem.productId] || cartItem.productId;
      const dbMatch = dbProducts.find(
        (p) =>
          p.id === cartItem.productId ||
          p.slug === canonicalSlug ||
          p.slug === cartItem.productId
      );

      if (!dbMatch) {
        return {
          success: false,
          error: `Product "${cartItem.productName || cartItem.productId}" is not available in the active database catalogue.`
        };
      }

      if (!dbMatch.is_active) {
        return {
          success: false,
          error: `Product "${dbMatch.name}" is currently inactive and cannot be ordered.`
        };
      }

      // Check stock availability
      if (dbMatch.stock_quantity < cartItem.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${dbMatch.name}". Currently available: ${dbMatch.stock_quantity}, requested: ${cartItem.quantity}.`
        };
      }

      rpcItemsPayload.push({
        product_id: dbMatch.id,
        quantity: cartItem.quantity
      });
    }

    // Step 5: Format delivery address conforming to delivery_address JSONB schema
    const deliveryAddressPayload = {
      full_name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email ? formData.email.trim() : null,
      address_line1: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim()
    };

    // Step 6: Invoke the audited submit_checkout() database function
    // All prices, totals, stock decrements, and order_reference generation happen atomically in Postgres
    const { data: rpcData, error: rpcError } = await supabase.rpc('submit_checkout', {
      p_delivery_address: deliveryAddressPayload,
      p_items: rpcItemsPayload,
      p_customer_notes: formData.specialNotes ? formData.specialNotes.trim() : null
    });

    if (rpcError) {
      return {
        success: false,
        error: rpcError.message || 'Checkout failed during server execution.'
      };
    }

    const result = rpcData as {
      order_id: string;
      order_reference: string;
      guest_token: string | null;
      subtotal: number;
      shipping_fee: number;
      discount_amount: number;
      total_amount: number;
      status: string;
    };

    return {
      success: true,
      orderId: result.order_id,
      orderReference: result.order_reference,
      guestToken: result.guest_token,
      subtotal: Number(result.subtotal),
      shippingFee: Number(result.shipping_fee),
      discountAmount: Number(result.discount_amount),
      totalAmount: Number(result.total_amount),
      status: result.status
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Network or unexpected error during checkout: ${msg}`
    };
  }
}

/**
 * Safely retrieves an order from Supabase without exposing customer data.
 * Authenticated users read via RLS.
 * Guests read strictly through get_guest_order(order_reference, guest_token).
 */
export async function retrieveSecureOrder(
  orderReference: string,
  guestToken?: string | null
): Promise<{ success: boolean; order?: RetrievedOrder; error?: string }> {
  if (!orderReference) {
    return { success: false, error: 'Order reference is required.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase backend is not configured yet. Live order retrieval requires database connectivity.'
    };
  }

  try {
    // Check if the current viewer is an authenticated user
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;

    // PATH 1: Guest order lookup via get_guest_order() RPC
    if (!currentUser) {
      if (!guestToken) {
        return {
          success: false,
          error: 'Guest order token is required to view confidential order details.'
        };
      }

      const { data: guestData, error: guestError } = await supabase.rpc('get_guest_order', {
        p_order_reference: orderReference,
        p_guest_token: guestToken
      });

      if (guestError) {
        return { success: false, error: guestError.message };
      }

      if (!guestData || guestData.length === 0) {
        return {
          success: false,
          error: 'Order not found. Please verify the order reference and guest token.'
        };
      }

      const row = guestData[0];
      const addr = (typeof row.delivery_address === 'object' && row.delivery_address !== null)
        ? (row.delivery_address as Record<string, any>)
        : {};

      const items = Array.isArray(row.order_items) ? row.order_items : [];

      return {
        success: true,
        order: {
          orderId: row.order_id,
          orderReference: row.order_reference,
          razorpayOrderId: row.razorpay_order_id,
          status: row.status,
          createdAt: row.created_at,
          subtotal: Number(row.subtotal),
          shippingFee: Number(row.shipping_fee),
          discountAmount: Number(row.discount_amount),
          totalAmount: Number(row.total_amount),
          deliveryAddress: {
            fullName: addr.full_name || '',
            phone: addr.phone || '',
            email: addr.email || null,
            addressLine1: addr.address_line1 || '',
            city: addr.city || '',
            state: addr.state || '',
            pincode: addr.pincode || ''
          },
          orderItems: items.map((it: any) => ({
            productName: it.product_name || 'Ayurvedic Remedy',
            quantity: Number(it.quantity) || 1,
            unitPrice: Number(it.unit_price) || 0,
            lineTotal: Number(it.line_total) || 0
          }))
        }
      };
    }

    // PATH 2: Authenticated customer order lookup via RLS-protected SELECT
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_reference,
        razorpay_order_id,
        delivery_address,
        subtotal,
        shipping_fee,
        discount_amount,
        total_amount,
        status,
        created_at,
        order_items (
          product_name,
          quantity,
          unit_price,
          line_total
        )
      `)
      .eq('order_reference', orderReference)
      .maybeSingle();

    if (orderError) {
      return { success: false, error: orderError.message };
    }

    if (!orderData) {
      return {
        success: false,
        error: 'Order not found or you do not have permission to access it.'
      };
    }

    const addr = (typeof orderData.delivery_address === 'object' && orderData.delivery_address !== null)
      ? (orderData.delivery_address as Record<string, any>)
      : {};

    const items = Array.isArray(orderData.order_items) ? orderData.order_items : [];

    return {
      success: true,
      order: {
        orderId: orderData.id,
        orderReference: orderData.order_reference,
        razorpayOrderId: orderData.razorpay_order_id,
        status: orderData.status,
        createdAt: orderData.created_at,
        subtotal: Number(orderData.subtotal),
        shippingFee: Number(orderData.shipping_fee),
        discountAmount: Number(orderData.discount_amount),
        totalAmount: Number(orderData.total_amount),
        deliveryAddress: {
          fullName: addr.full_name || '',
          phone: addr.phone || '',
          email: addr.email || null,
          addressLine1: addr.address_line1 || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || ''
        },
        orderItems: items.map((it: any) => ({
          productName: it.product_name,
          quantity: it.quantity,
          unitPrice: Number(it.unit_price),
          lineTotal: Number(it.line_total)
        }))
      }
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Failed to retrieve order: ${msg}`
    };
  }
}

