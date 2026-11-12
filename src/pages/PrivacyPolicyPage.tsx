import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Lock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BRAND_NAME, BRAND_SUPPORT_EMAIL, BRAND_SUPPORT_PHONE, BRAND_SUPPORT_PHONE_DISPLAY, BRAND_ADDRESS } from '../data/products';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12 text-[#35251F] text-left">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#35251F]/60 font-medium">
        <Link to="/" className="hover:text-[#A7835E] transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
        <span className="text-[#35251F] font-bold">Privacy Policy</span>
      </nav>

      <div className="space-y-3 pb-8 border-b border-[#35251F]/15">
        <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block">
          Client & Patient Discretion
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#35251F] font-bold tracking-tight">
          Privacy Policy & Discretion Standards
        </h1>
        <p className="text-sm text-[#35251F]/75 font-light">
          Deepali Ayurveda Apothecary • Unnao, Uttar Pradesh • Established 1997
        </p>
      </div>

      <div className="space-y-10 text-sm text-[#35251F]/85 leading-relaxed font-light">
        
        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            1. Commitment to Absolute Confidentiality
          </h2>
          <p>
            At <strong>{BRAND_NAME}</strong>, we respect your privacy and are committed to safeguarding personal, consultation, and delivery data. As an established Ayurvedic business serving patrons across India since 1997 from Unnao, Uttar Pradesh, all information provided to our Vaidyas and checkout system is treated with strict discretion.
          </p>
        </section>

        <section className="bg-white p-8 rounded-sm border-2 border-[#A7835E]/50 shadow-lift space-y-4 card-luxury">
          <div className="flex items-center gap-2.5 text-[#35251F]">
            <Lock className="w-5 h-5 text-[#A7835E]" />
            <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
              2. 100% Plain Box Discreet Packaging Guarantee
            </h2>
          </div>
          <p>
            We recognize that formulations such as <strong>Daaru Mukti Powder</strong> (de-addiction and liver detox) address sensitive personal concerns.
          </p>
          <div className="p-5 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/30 text-xs text-[#35251F] space-y-2 font-medium">
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A7835E] shrink-0" />
              <span>All orders are shipped in unmarked, opaque brown cardboard packaging with tamper-evident seals.</span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A7835E] shrink-0" />
              <span>Zero external labeling regarding remedy names, addiction recovery, or medical conditions on the outer parcel label.</span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A7835E] shrink-0" />
              <span>Courier personnel are not informed of the medicinal contents inside the parcel.</span>
            </p>
          </div>
        </section>

        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            3. Information We Collect & Use
          </h2>
          <p>
            When placing an order or requesting Vaidya guidance, we gather necessary delivery information (Full Name, Street Address, Mobile Number, Email) to ensure prompt delivery via India Post or express courier partners.
          </p>
        </section>

        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            4. Encrypted Payment Security
          </h2>
          <p>
            Online payments conducted via UPI or cards are encrypted end-to-end via PCI-DSS certified gateway infrastructure. We never store or log bank accounts, UPI PINs, or credit card CVV details.
          </p>
        </section>

        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            5. Office Contact & Inquiries
          </h2>
          <p>
            For any queries regarding personal data, address corrections, or confidentiality preferences, please reach our pharmacy desk at:
          </p>
          <div className="pt-2 text-xs font-medium space-y-1 text-[#35251F]">
            <p><strong>Office Address:</strong> {BRAND_ADDRESS}</p>
            <p><strong>Email:</strong> <a href={`mailto:${BRAND_SUPPORT_EMAIL}`} className="underline font-bold text-[#A7835E]">{BRAND_SUPPORT_EMAIL}</a></p>
            <p><strong>Helpline:</strong> <a href={`tel:${BRAND_SUPPORT_PHONE}`} className="underline font-bold text-[#A7835E]">{BRAND_SUPPORT_PHONE_DISPLAY}</a></p>
          </div>
        </section>

      </div>
    </div>
  );
}
