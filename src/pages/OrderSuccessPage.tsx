import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Leaf, Printer, Sparkles, MapPin } from 'lucide-react';
import { formatPrice } from '../lib/format';
import { BRAND_NAME, BRAND_LOCATION } from '../data/products';

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId?: string }>();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('deepali_last_order');
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [orderId]);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-[#35251F]">
      
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
            <strong className="text-sm font-mono font-bold text-[#35251F]">{orderId || 'DA-2026-98124'}</strong>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[#35251F]/15" />
          <div>
            <span className="text-[#35251F]/50 block text-[11px] uppercase tracking-wider font-semibold">Estimated Delivery</span>
            <strong className="text-sm font-bold text-[#A7835E]">By {formattedDelivery}</strong>
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
      {order && (
        <div className="bg-white p-8 rounded-sm border border-[#35251F]/15 space-y-6 shadow-xs text-left">
          <div className="flex items-center justify-between border-b border-[#35251F]/10 pb-4">
            <h3 className="font-serif-luxury text-xl font-bold text-[#35251F]">
              Dispatched Formulations & Dosage Schedule
            </h3>
            <span className="text-xs text-[#A7835E] font-bold">
              Pan-India Express
            </span>
          </div>

          <div className="divide-y divide-[#35251F]/10">
            {order.items?.map(({ product, quantity }: any) => (
              <div key={product.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-contain p-1 rounded-sm border border-[#35251F]/10 bg-[#FAF6EE]" />
                  <div>
                    <h4 className="font-serif-luxury text-sm font-bold text-[#35251F]">
                      {product.name}
                    </h4>
                    <span className="text-xs text-[#A7835E] font-medium">Qty: {quantity} • {product.volume}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#35251F]">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/30 space-y-1 text-xs">
            <strong className="block font-bold text-[#35251F]">Patient Support Notice:</strong>
            <p className="text-[#35251F]/70 font-light">
              A printed dosage sheet and lifestyle guide are included inside the sealed carton. For any queries, reach our dispensary helpline.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
