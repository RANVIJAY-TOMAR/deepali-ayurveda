// ==============================================================================
// DEEPALI AYURVEDA (EST. 1997) — EDGE FUNCTION: create-razorpay-order
// File: supabase/functions/create-razorpay-order/index.ts
// ==============================================================================
// Responsibilities:
// 1. Authorizes caller (guest bearer token or authenticated customer JWT).
// 2. Authoritatively reads order total from database (never trusts client amount).
// 3. Creates Razorpay order via Razorpay REST API in INR paise.
// 4. Calls set_order_razorpay_id() to lock the relationship in the database.
// 5. Returns Razorpay order details and public Key ID to client.
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createServiceRoleClient } from '../_shared/supabaseClient.ts';

interface RequestPayload {
  order_id: string;
  guest_token?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Server configuration error: Razorpay credentials are not configured.');
    }

    const payload: RequestPayload = await req.json();
    const { order_id, guest_token } = payload;

    if (!order_id || typeof order_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid required parameter: order_id.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createServiceRoleClient();

    // 1. Fetch internal order securely from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_reference, customer_id, guest_token, total_amount, status, razorpay_order_id')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validate order status
    if (order.status !== 'pending') {
      return new Response(
        JSON.stringify({
          error: `Cannot initiate payment for order in "${order.status}" status. Expected "pending".`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Authorization verification (Guest Token or Authenticated User)
    const authHeader = req.headers.get('Authorization');
    if (order.customer_id) {
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: Authentication required for this order.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const token = authHeader.replace(/^Bearer\s+/i, '');
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData.user || userData.user.id !== order.customer_id) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: You do not have access to this order.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Guest order: Require valid bearer guest_token matching the order
      if (!guest_token || guest_token !== order.guest_token) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: Invalid or missing guest checkout token.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 4. Return existing Razorpay Order ID if already created and pending
    if (order.razorpay_order_id) {
      return new Response(
        JSON.stringify({
          razorpay_order_id: order.razorpay_order_id,
          order_id: order.id,
          order_reference: order.order_reference,
          amount_in_paise: Math.round(Number(order.total_amount) * 100),
          currency: 'INR',
          key_id: razorpayKeyId,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Authoritative total calculation in paise (INR)
    const amountInPaise = Math.round(Number(order.total_amount) * 100);
    if (amountInPaise <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid order total amount.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Call Razorpay API to create an order
    const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: order.order_reference,
        notes: {
          internal_order_id: order.id,
          order_reference: order.order_reference,
        },
      }),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay API error response:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to create order with Razorpay gateway.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const razorpayOrder = await razorpayResponse.json();

    // 7. Store Razorpay Order ID in database via trusted RPC function
    const { error: rpcError } = await supabase.rpc('set_order_razorpay_id', {
      p_order_id: order.id,
      p_razorpay_order_id: razorpayOrder.id,
    });

    if (rpcError) {
      console.error('Database set_order_razorpay_id error:', rpcError);
      return new Response(
        JSON.stringify({ error: 'Failed to bind Razorpay order ID to database order.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 8. Return response to frontend modal
    return new Response(
      JSON.stringify({
        razorpay_order_id: razorpayOrder.id,
        order_id: order.id,
        order_reference: order.order_reference,
        amount_in_paise: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: razorpayKeyId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Unhandled error in create-razorpay-order:', err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
