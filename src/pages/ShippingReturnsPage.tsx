import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Lock, CheckCircle, Truck, RefreshCw, ShieldCheck } from 'lucide-react';
import { 
  BRAND_NAME, 
  BRAND_LOCATION, 
  BRAND_SUPPORT_PHONE, 
  BRAND_SUPPORT_PHONE_DISPLAY, 
  BRAND_SUPPORT_EMAIL, 
  BRAND_ADDRESS 
} from '../data/products';

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12 text-[#35251F] text-left">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#35251F]/60 font-medium">
        <Link to="/" className="hover:text-[#A7835E] transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
        <span className="text-[#35251F] font-bold">Shipping & Returns</span>
      </nav>

      <div className="space-y-3 pb-8 border-b border-[#35251F]/15">
        <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block">
          Pan-India Logistics & Delivery
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#35251F] font-bold tracking-tight">
          Shipping & Returns Policy
        </h1>
        <p className="text-sm text-[#35251F]/75 font-light">
          Dispatched fresh from our Unnao, Uttar Pradesh dispensary directly to your doorstep.
        </p>
      </div>

      <div className="space-y-10 text-sm text-[#35251F]/85 leading-relaxed font-light">
        
        {/* Section 1: Discreet Packaging */}
        <section className="bg-white p-8 rounded-sm border-2 border-[#A7835E]/50 shadow-lift space-y-4 card-luxury">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#A7835E]" />
            <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
              1. 100% Plain Box Discreet Packaging Protocol
            </h2>
          </div>
          <p>
            Every order from <strong>{BRAND_NAME}</strong>—including our <strong>1 Month Supply Daaru Mukti Powder</strong>—is packed inside a heavy-duty, unprinted brown corrugated box with tamper-evident security tape.
          </p>
          <div className="p-5 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/30 text-xs text-[#35251F] space-y-2 font-medium">
            <span className="font-bold text-[#35251F] uppercase tracking-wider block">Discretion Guarantee:</span>
            <ul className="list-disc pl-5 space-y-1 text-[#35251F]/80 font-light">
              <li>Recipient Name, Street Address, and Phone Number for carrier logistics only.</li>
              <li>Sender designated simply as "Deepali Apothecary Logistics".</li>
              <li>Zero medical indications, disease keywords, or remedy names printed on the external shipping label.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Dispatch Times */}
        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-4 card-luxury">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-[#A7835E]" />
            <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
              2. Pan-India Delivery Timelines
            </h2>
          </div>
          <p>
            Orders confirmed before 3:00 PM IST are freshly packed and dispatched same-day from Unnao, Uttar Pradesh via speed post and premium express courier partners (Delhivery, Blue Dart, Speed Post).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-[#F5EFE5] rounded-sm border border-[#35251F]/15">
              <span className="text-xs uppercase tracking-wider text-[#A7835E] font-bold block mb-1">Metros & Tier 1 Cities</span>
              <p className="text-base font-bold font-serif-luxury text-[#35251F]">2 to 4 Business Days</p>
              <p className="text-xs text-[#35251F]/70 font-light mt-0.5">Delhi NCR, Lucknow, Kanpur, Mumbai, Bengaluru, Pune, Kolkata</p>
            </div>
            <div className="p-4 bg-[#F5EFE5] rounded-sm border border-[#35251F]/15">
              <span className="text-xs uppercase tracking-wider text-[#A7835E] font-bold block mb-1">Rest of India & Rural Pincodes</span>
              <p className="text-base font-bold font-serif-luxury text-[#35251F]">4 to 6 Business Days</p>
              <p className="text-xs text-[#35251F]/70 font-light mt-0.5">Delivered via India Post Speed Post network</p>
            </div>
          </div>
        </section>

        {/* Section 3: Shipping Rates */}
        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            3. Complimentary Delivery Threshold
          </h2>
          <p>
            All domestic orders with a basket value of <strong>₹500 or above</strong> qualify for <strong>Complimentary Pan-India Shipping</strong>. For orders below ₹500, a standard logistics fee of ₹60 is applied at checkout.
          </p>
        </section>

        {/* Section 4: Replacement Policy */}
        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-5 h-5 text-[#A7835E]" />
            <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
              4. Damage Guarantee & Fresh Replacement Policy
            </h2>
          </div>
          <p>
            Due to the medicinal nature of our Ayurvedic formulations, opened or consumed products cannot be restocked. However, if your shipment arrives damaged in transit or defective, we provide an immediate <strong>100% Free Replacement</strong>.
          </p>
          <p className="text-xs text-[#35251F]/80 font-light">
            Simply share a photo of the damaged carton via WhatsApp at <a href={`tel:${BRAND_SUPPORT_PHONE}`} className="underline font-bold text-[#A7835E]">{BRAND_SUPPORT_PHONE_DISPLAY}</a> or email <a href={`mailto:${BRAND_SUPPORT_EMAIL}`} className="underline font-bold text-[#A7835E]">{BRAND_SUPPORT_EMAIL}</a> within 48 hours of delivery. Our Unnao team will dispatch a replacement parcel at zero additional cost.
          </p>
        </section>

      </div>
    </div>
  );
}
