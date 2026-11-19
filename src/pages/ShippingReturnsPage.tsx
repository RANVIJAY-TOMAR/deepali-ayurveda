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
            Every order from <strong>{BRAND_NAME}</strong>—including our flagship <strong>Himalayan Sea Buckthorn 99% Pure Pulp (500 ML)</strong>—is packed inside a heavy-duty, unprinted brown corrugated box with tamper-evident security tape.
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

        {/* Section 3: Shipping Rates & Payment Policy */}
        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            3. Complimentary Pan-India Delivery on All Orders
          </h2>
          <p>
            All domestic orders qualify for <strong>100% Complimentary Free Pan-India Delivery</strong> across all serviceable pincodes at zero shipping fee.
          </p>
          <div className="p-4 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/30 text-xs text-[#35251F] space-y-1">
            <span className="font-bold block uppercase tracking-wider text-[#A7835E]">
              100% Prepaid Orders Only (No Cash on Delivery):
            </span>
            <p className="font-light text-[#35251F]/80">
              We do not provide Cash on Delivery (COD). All parcels are dispatched exclusively after secure online payment verification (UPI, Debit/Credit Cards, Net Banking) to guarantee untouched tamper-proof packaging and rapid dispatch from our Unnao dispensary.
            </p>
          </div>
        </section>

        {/* Section 4: Replacement Guarantee */}
        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-4 card-luxury">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-5 h-5 text-[#A7835E]" />
            <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
              4. 100% Replacement Guarantee for Damaged/Wrong Items
            </h2>
          </div>
          <p>
            Due to the medicinal nature of our Ayurvedic formulations, opened or consumed products cannot be restocked. However, if your shipment arrives damaged in transit or you receive an incorrect item, we provide an immediate <strong>100% Replacement Guarantee</strong>.
          </p>
          <div className="p-4 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/40 flex items-center gap-3 text-xs font-semibold text-[#35251F]">
            <ShieldCheck className="w-5 h-5 text-[#A7835E] shrink-0" />
            <span>100% Replacement Guarantee for Damaged/Wrong Items • Dispatched in 24 Hours</span>
          </div>
          <p className="text-xs text-[#35251F]/80 font-light">
            Simply share a clear photo of the damaged parcel or outer shipping label via WhatsApp at <a href={`tel:${BRAND_SUPPORT_PHONE}`} className="underline font-bold text-[#A7835E]">{BRAND_SUPPORT_PHONE_DISPLAY}</a> or email <a href={`mailto:${BRAND_SUPPORT_EMAIL}`} className="underline font-bold text-[#A7835E]">{BRAND_SUPPORT_EMAIL}</a> within 48 hours of delivery. A brand-new replacement parcel will be dispatched within 24 hours at zero extra charge.
          </p>
        </section>

        {/* Section 5: Clear Refund Timelines */}
        <section className="bg-white p-8 rounded-sm border-2 border-[#A7835E]/40 shadow-lift space-y-4 card-luxury">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#A7835E]" />
            <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
              5. Refund Policy & Clear Timelines
            </h2>
          </div>
          <p>
            We uphold complete transparency regarding billing and returns. If a replacement is not feasible or an order cancellation is approved prior to dispatch, our refund timeline is strictly honored as follows:
          </p>
          <div className="p-5 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/40 text-xs text-[#35251F] space-y-3 font-medium">
            <div className="flex items-center gap-2 text-sm font-bold text-[#35251F] uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-[#A7835E]" />
              <span>Clear Refund Timelines:</span>
            </div>
            <p className="text-sm font-bold text-[#A7835E]">
              Refunds processed within 3–5 business days.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#35251F]/85 font-light text-xs">
              <li>
                <strong>UPI Payments:</strong> Refunds are initiated directly to your linked UPI VPA/Bank Account. The amount typically reflects within <strong>3–5 business days</strong>.
              </li>
              <li>
                <strong>Debit/Credit Cards & Net Banking:</strong> Refunds are credited directly back to the original funding account or card statement within <strong>3–5 business days</strong>, subject to your card issuer’s clearing timeline.
              </li>
              <li>
                <strong>Notification:</strong> You will receive an immediate confirmation SMS/email with the payment gateway refund reference ID (RRN) as soon as the refund is initiated.
              </li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
