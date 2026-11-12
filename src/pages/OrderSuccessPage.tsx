import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Leaf, Printer, Sparkles, MapPin, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../lib/format';
import { BRAND_NAME, BRAND_LOCATION } from '../data/products';
import { retrieveSecureOrder, RetrievedOrder } from '../lib/orders';

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId?: string }>();

  // Retrieve guest token exclusively from order-specific sessionStorage entry for this tab.
  // The token is kept strictly out of URL paths, query parameters, fragments, and router history state.
  // Page refresh continues to function within the same browser tab via sessionStorage.
  const guestToken = orderId ? sessionStorage.getItem(`guest_token_${orderId}`) : null;

  const [order, setOrder] = useState<RetrievedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (!orderId) {
        setLoading(false);
        setErrorMessage('No order reference provided.');
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      const result = await retrieveSecureOrder(orderId, guestToken);

      if (!isMounted) return;

      if (!result.success || !result.order) {
        setErrorMessage(result.error || 'Unable to retrieve order details from the dispensary database.');
        setOrder(null);
      } else {
        setOrder(result.order);
      }

      setLoading(false);
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, guestToken]);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-[#35251F]">
      
      {/* Loading State */}
      {loading && (
        <div className="py-24 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#A7835E] animate-spin mx-auto" />
          <h2 className="font-serif-luxury text-2xl font-bold text-[#35251F]">
            Verifying Order with Unnao Dispensary...
          </h2>
          <p className="text-xs text-[#35251F]/70 font-light">
            Retrieving authenticated order details securely from the database.
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && errorMessage && (
        <div className="bg-white rounded-sm p-8 sm:p-12 border border-[#35251F]/15 text-center space-y-5 card-luxury shadow-premium">
          <div className="w-16 h-16 bg-amber-50 text-amber-700 border border-amber-300 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-amber-700" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#35251F]">
              Order Verification Notice
            </h2>
            <p className="text-sm text-[#35251F]/80 max-w-md mx-auto leading-relaxed">
              {errorMessage}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/shop"
              className="btn-espresso px-6 py-3 rounded-sm text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2"
            >
              <span>Return to Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D8C3A5]" />
            </Link>
          </div>
        </div>
      )}

      {/* Confirmed Order Display */}
      {!loading && order && (
        <>
          {/* Top Banner */}
          <div className="bg-white rounded-sm p-8 sm:p-12 border border-[#35251F]/15 text-center space-y-5 card-luxury shadow-premium">
            <div className="w-16 h-16 bg-[#F5EFE5] text-[#35251F] border border-[#A7835E]/40 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8 text-[#A7835E]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block">
                Order Confirmed • Scheduled for Preparation
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#35251F]">
                Thank You for Trusting {BRAND_NAME}
              </h1>
              <p className="text-sm text-[#35251F]/75 max-w-lg mx-auto font-light leading-relaxed">
                Your classical formulations are being freshly verified and packed in plain confidential boxes at our Unnao, Uttar Pradesh pharmacy.
              </p>
            </div>

            <div className="p-5 bg-[#FBF8F2] rounded-sm border border-[#35251F]/10 inline-flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm text-[#35251F]">
              <div>
                <span className="text-[#35251F]/50 block text-[11px] uppercase tracking-wider font-semibold">Order Reference</span>
                <strong className="text-sm font-mono font-bold text-[#35251F]">{order.orderReference}</strong>
              </div>
              <div className="hidden sm:block w-px h-8 bg-[#35251F]/15" />
              <div>
                <span className="text-[#35251F]/50 block text-[11px] uppercase tracking-wider font-semibold">Order Status</span>
                <strong className="text-sm uppercase font-bold text-[#A7835E]">{order.status}</strong>
              </div>
              <div className="hidden sm:block w-px h-8 bg-[#35251F]/15" />
              <div>
                <span className="text-[#35251F]/50 block text-[11px] uppercase tracking-wider font-semibold">Estimated Delivery</span>
                <strong className="text-sm font-bold text-[#35251F]">By {formattedDelivery}</strong>
              </div>
              <div className="hidden sm:block w-px h-8 bg-[#35251F]/15" />
              <div>
                <span className="text-[#35251F]/50 block text-[11px] uppercase tracking-wider font-semibold">Packaging Type</span>
                <strong className="text-sm font-bold text-[#35251F]">100% Plain Box</strong>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/shop"
                className="btn-espresso px-6 py-3 rounded-sm text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2"
              >
                <span>Return to Storefront</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D8C3A5]" />
              </Link>
              
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-[#F5EFE5] hover:bg-[#EFE7DA] border border-[#D8C3A5] rounded-sm text-xs uppercase tracking-widest font-bold text-[#35251F] inline-flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#A7835E]" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>

          {/* Ordered Formulations Breakdown */}
          <div className="bg-white p-8 rounded-sm border border-[#35251F]/15 space-y-6 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-[#35251F]/10 pb-4">
              <h3 className="font-serif-luxury text-xl font-bold text-[#35251F]">
                Verified Order Items ({order.orderItems.length})
              </h3>
              <span className="text-xs text-[#A7835E] font-bold">
                Pan-India Express Dispatch
              </span>
            </div>

            <div className="divide-y divide-[#35251F]/10">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-serif-luxury text-sm font-bold text-[#35251F]">
                      {item.productName}
                    </h4>
                    <span className="text-xs text-[#A7835E] font-medium">
                      Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#35251F]">
                      {formatPrice(item.lineTotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Address & Totals Summary */}
            <div className="pt-4 border-t border-[#35251F]/15 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5 p-4 bg-[#FBF8F2] rounded-sm border border-[#35251F]/10">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#A7835E] block">
                  Delivery Destination
                </span>
                <p className="font-bold text-[#35251F]">{order.deliveryAddress.fullName}</p>
                <p className="text-[#35251F]/80">{order.deliveryAddress.addressLine1}</p>
                <p className="text-[#35251F]/80">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
                </p>
                <p className="text-[#35251F]/70 font-mono">Mobile: {order.deliveryAddress.phone}</p>
              </div>

              <div className="space-y-2 p-4 bg-[#FBF8F2] rounded-sm border border-[#35251F]/10">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#A7835E] block">
                  Payment & Invoice Summary
                </span>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#A7835E]">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#35251F]/15 text-sm font-bold font-serif-luxury text-[#35251F]">
                  <span>Total Paid / Payable</span>
                  <span className="text-base">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/30 space-y-1 text-xs">
              <strong className="block font-bold text-[#35251F]">Patient Support Notice:</strong>
              <p className="text-[#35251F]/70 font-light">
                A printed dosage schedule and authentic batch certificate are included inside your confidential carton. For questions, call our Unnao dispensary helpline.
              </p>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
