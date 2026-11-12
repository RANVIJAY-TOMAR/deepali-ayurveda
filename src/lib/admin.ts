import { supabase, isSupabaseConfigured } from './supabase';
import type { Database } from '../types/database';

export interface AdminOrderRecord {
  id: string;
  orderReference: string;
  razorpayOrderId: string | null;
  customerId: string | null;
  status: string;
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  customerNotes: string | null;
  createdAt: string;
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
    id: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
}

export interface AdminConsultationRecord {
  id: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  healthConcern: string | null;
  preferredTimeSlot: string | null;
  consultationFee: number;
  bookingStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export interface AdminCustomerRecord {
  id: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  prakriti: string | null;
  isAdmin: boolean;
  createdAt: string;
  addresses: Array<{
    id: string;
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>;
}

/**
 * Verifies whether the currently signed-in user has admin privileges.
 * Calls public.is_admin() RPC function.
 */
export async function verifyAdminStatus(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      return false;
    }

    const { data, error } = await supabase.rpc('is_admin');
    if (error) {
      console.warn('[Admin Service] is_admin check failed:', error.message);
      return false;
    }

    return Boolean(data);
  } catch (e) {
    console.error('[Admin Service] Error verifying admin access:', e);
    return false;
  }
}

/**
 * Retrieves orders and order items under admin RLS policies.
 */
export async function fetchAdminOrders(): Promise<{
  success: boolean;
  orders: AdminOrderRecord[];
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { success: false, orders: [], error: 'Supabase is not configured.' };
  }

  const isAdmin = await verifyAdminStatus();
  if (!isAdmin) {
    return {
      success: false,
      orders: [],
      error: 'Unauthorized: Administrator privileges are required to access store orders.'
    };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_reference,
        razorpay_order_id,
        customer_id,
        status,
        total_amount,
        subtotal,
        shipping_fee,
        discount_amount,
        customer_notes,
        delivery_address,
        created_at,
        order_items (
          id,
          product_name,
          unit_price,
          quantity,
          line_total
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, orders: [], error: error.message };
    }

    const orders: AdminOrderRecord[] = (data || []).map((row: any) => {
      const addr = (typeof row.delivery_address === 'object' && row.delivery_address !== null)
        ? row.delivery_address
        : {};

      const items = Array.isArray(row.order_items) ? row.order_items : [];

      return {
        id: row.id,
        orderReference: row.order_reference,
        razorpayOrderId: row.razorpay_order_id,
        customerId: row.customer_id,
        status: row.status,
        totalAmount: Number(row.total_amount),
        subtotal: Number(row.subtotal),
        shippingFee: Number(row.shipping_fee),
        discountAmount: Number(row.discount_amount),
        customerNotes: row.customer_notes,
        createdAt: row.created_at,
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
          id: it.id,
          productName: it.product_name,
          unitPrice: Number(it.unit_price),
          quantity: Number(it.quantity),
          lineTotal: Number(it.line_total)
        }))
      };
    });

    return { success: true, orders };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, orders: [], error: msg };
  }
}

/**
 * Retrieves consultation bookings under admin RLS policies.
 */
export async function fetchAdminConsultations(): Promise<{
  success: boolean;
  consultations: AdminConsultationRecord[];
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { success: false, consultations: [], error: 'Supabase is not configured.' };
  }

  const isAdmin = await verifyAdminStatus();
  if (!isAdmin) {
    return {
      success: false,
      consultations: [],
      error: 'Unauthorized: Administrator privileges are required to access consultation bookings.'
    };
  }

  try {
    const { data, error } = await supabase
      .from('consultation_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, consultations: [], error: error.message };
    }

    const consultations: AdminConsultationRecord[] = (data || []).map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email,
      healthConcern: row.health_concern,
      preferredTimeSlot: row.preferred_time_slot,
      consultationFee: Number(row.consultation_fee),
      bookingStatus: row.booking_status,
      paymentStatus: row.payment_status,
      createdAt: row.created_at
    }));

    return { success: true, consultations };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, consultations: [], error: msg };
  }
}

/**
 * Retrieves customer profiles and registered delivery addresses under admin RLS policies.
 */
export async function fetchAdminCustomers(): Promise<{
  success: boolean;
  customers: AdminCustomerRecord[];
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { success: false, customers: [], error: 'Supabase is not configured.' };
  }

  const isAdmin = await verifyAdminStatus();
  if (!isAdmin) {
    return {
      success: false,
      customers: [],
      error: 'Unauthorized: Administrator privileges are required to access customer records.'
    };
  }

  try {
    // Query profiles and addresses separately to conform strictly to foreign key structure
    // (Both customer_profiles.id and customer_addresses.customer_id reference auth.users(id))
    const [profilesRes, addressesRes] = await Promise.all([
      supabase
        .from('customer_profiles')
        .select('id, full_name, phone, email, prakriti, is_admin, created_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('customer_addresses')
        .select('id, customer_id, full_name, phone, address_line, city, state, pincode, is_default')
    ]);

    if (profilesRes.error) {
      return { success: false, customers: [], error: profilesRes.error.message };
    }

    const addressList = addressesRes.data || [];

    const customers: AdminCustomerRecord[] = (profilesRes.data || []).map((prof) => ({
      id: prof.id,
      fullName: prof.full_name,
      phone: prof.phone,
      email: prof.email,
      prakriti: prof.prakriti,
      isAdmin: Boolean(prof.is_admin),
      createdAt: prof.created_at,
      addresses: addressList
        .filter((a) => a.customer_id === prof.id)
        .map((a) => ({
          id: a.id,
          fullName: a.full_name,
          phone: a.phone,
          addressLine: a.address_line,
          city: a.city,
          state: a.state,
          pincode: a.pincode,
          isDefault: Boolean(a.is_default)
        }))
    }));

    return { success: true, customers };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, customers: [], error: msg };
  }
}

