// ==============================================================================
// DEEPALI AYURVEDA (EST. 1997) — EDGE FUNCTION: verify-razorpay-payment
// File: supabase/functions/verify-razorpay-payment/index.ts
// ==============================================================================
// Responsibilities:
// 1. Verifies Razorpay HMAC-SHA256 cryptographic signature using Web Crypto API.
//    Supports both direct checkout modal callback and Razorpay server-to-server webhooks.
// 2. Performs timing-safe comparison to prevent side-channel timing attacks.
// 3. Reads authoritative order details from the database.
// 4. Calls record_verified_payment() using the service-role client.
// 5. Returns idempotent confirmation without accepting conflicting payments.
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createServiceRoleClient } from '../_shared/supabaseClient.ts';

/**
 * Timing-safe HMAC-SHA256 verification using Web Crypto API
 */
async function verifyHmacSha256(data: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const expectedHex = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (expectedHex.length !== signature.length) {
    return false;
  }

  // Constant-time string comparison
  let mismatch = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    mismatch |= expectedHex.charCodeAt(i) ^ signature.charCodeAt(i);
  }

  return mismatch === 0;
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
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const razorpayWebhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

    const webhookSignatureHeader = req.headers.get('x-razorpay-signature');
    const rawBody = await req.text();
    const supabase = createServiceRoleClient();

    // ============================================================================
    // FLOW 1: Server-to-Server Razorpay Webhook (payment.captured / order.paid)
    // ============================================================================
    if (webhookSignatureHeader) {
      if (!razorpayWebhookSecret) {
        throw new Error('Server configuration error: RAZORPAY_WEBHOOK_SECRET is not configured.');
      }

      const isValidWebhook = await verifyHmacSha256(rawBody, webhookSignatureHeader, razorpayWebhookSecret);
      if (!isValidWebhook) {
        console.warn('Rejected webhook with invalid HMAC signature.');
        return new Response(JSON.stringify({ error: 'Invalid webhook signature.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const webhookEvent = JSON.parse(rawBody);
      const eventName = webhookEvent.event;

      if (eventName !== 'payment.captured' && eventName !== 'order.paid') {
        // Acknowledge other event types without processing
        return new Response(JSON.stringify({ status: 'ignored', event: eventName }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const paymentEntity = webhookEvent.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;
      const amountInPaise = paymentEntity?.amount;
      const currency = paymentEntity?.currency || 'INR';

      if (!razorpayOrderId || !razorpayPaymentId || !amountInPaise) {
        return new Response(JSON.stringify({ error: 'Malformed webhook payload.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Look up corresponding order by razorpay_order_id
      const { data: order, error: orderLookupErr } = await supabase
        .from('orders')
        .select('id, total_amount, status, razorpay_order_id')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (orderLookupErr || !order) {
        console.error('Webhook references unknown Razorpay order:', razorpayOrderId);
        return new Response(JSON.stringify({ error: 'Order not found for Razorpay order ID.' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const amountInRupees = amountInPaise / 100;

      // Invoke atomic payment recorder
      const { data: paymentId, error: recordErr } = await supabase.rpc('record_verified_payment', {
        p_order_id: order.id,
        p_razorpay_order_id: razorpayOrderId,
        p_razorpay_payment_id: razorpayPaymentId,
        p_razorpay_signature: webhookSignatureHeader,
        p_amount: amountInRupees,
        p_currency: currency,
        p_metadata: {
          source: 'webhook',
          event: eventName,
          method: paymentEntity.method,
          email: paymentEntity.email,
          contact: paymentEntity.contact,
        },
      });

      if (recordErr) {
        console.error('record_verified_payment error in webhook:', recordErr);
        return new Response(JSON.stringify({ error: recordErr.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          order_id: order.id,
          payment_id: paymentId,
          status: 'paid',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================================================
    // FLOW 2: Direct Client Modal Callback Verification
    // ============================================================================
    if (!razorpayKeySecret) {
      throw new Error('Server configuration error: RAZORPAY_KEY_SECRET is not configured.');
    }

    const payload = JSON.parse(rawBody);
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, guest_token } = payload;

    if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: 'Missing required payment verification parameters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Verify HMAC-SHA256 signature for client modal callback:
    // Formula: HMAC-SHA256(order_id + "|" + payment_id, secret)
    const signaturePayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const isValidSignature = await verifyHmacSha256(signaturePayload, razorpay_signature, razorpayKeySecret);

    if (!isValidSignature) {
      console.warn('Invalid signature for order:', order_id, 'payment:', razorpay_payment_id);
      return new Response(
        JSON.stringify({ error: 'Payment signature verification failed. Forged or corrupted payment data.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch authoritative order record
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, total_amount, status, customer_id, guest_token, razorpay_order_id')
      .eq('id', order_id)
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: 'Order not found.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Authorization check
    const authHeader = req.headers.get('Authorization');
    if (order.customer_id) {
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const token = authHeader.replace(/^Bearer\s+/i, '');
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData.user || userData.user.id !== order.customer_id) {
        return new Response(JSON.stringify({ error: 'Forbidden.' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      if (!guest_token || guest_token !== order.guest_token) {
        return new Response(JSON.stringify({ error: 'Forbidden: Invalid guest token.' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // 4. Verify Razorpay Order ID matches the order record
    if (order.razorpay_order_id && order.razorpay_order_id !== razorpay_order_id) {
      return new Response(
        JSON.stringify({ error: 'Razorpay order ID mismatch with internal order record.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Invoke atomic payment recorder via service-role RPC
    const { data: paymentId, error: rpcErr } = await supabase.rpc('record_verified_payment', {
      p_order_id: order.id,
      p_razorpay_order_id: razorpay_order_id,
      p_razorpay_payment_id: razorpay_payment_id,
      p_razorpay_signature: razorpay_signature,
      p_amount: Number(order.total_amount),
      p_currency: 'INR',
      p_metadata: { source: 'checkout_modal' },
    });

    if (rpcErr) {
      console.error('record_verified_payment error:', rpcErr);
      return new Response(JSON.stringify({ error: rpcErr.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        payment_id: paymentId,
        status: 'paid',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Unhandled error in verify-razorpay-payment:', err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
