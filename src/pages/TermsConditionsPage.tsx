import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Scale, Award } from 'lucide-react';
import { 
  BRAND_NAME, 
  BRAND_ESTABLISHED, 
  BRAND_LOCATION, 
  BRAND_SUPPORT_EMAIL, 
  BRAND_SUPPORT_PHONE, 
  BRAND_SUPPORT_PHONE_DISPLAY, 
  BRAND_ADDRESS 
} from '../data/products';

export default function TermsConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12 text-[#35251F] text-left">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#35251F]/60 font-medium">
        <Link to="/" className="hover:text-[#A7835E] transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
        <span className="text-[#35251F] font-bold">Terms & Conditions</span>
      </nav>

      <div className="space-y-3 pb-8 border-b border-[#35251F]/15">
        <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block">
          Client Agreement • Est. {BRAND_ESTABLISHED} • {BRAND_LOCATION}
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#35251F] font-bold tracking-tight">
          Terms & Conditions of Service
        </h1>
        <p className="text-sm text-[#35251F]/75 font-light">
          Deepali Ayurveda • Classical Herbal Pharmacy Standards
        </p>
      </div>

      <div className="space-y-10 text-sm text-[#35251F]/85 leading-relaxed font-light">
        
        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing, browsing, or placing orders through the <strong>{BRAND_NAME}</strong> digital storefront, you accept and agree to be bound by these Terms and Conditions and our Privacy Policy.
          </p>
        </section>

        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            2. Traditional Knowledge & Ayurvedic Health Guidance
          </h2>
          <p>
            Our classical Ayurvedic formulations (e.g. Kwath decoctions, churnas, rasayanas) are compounded according to authentic Shastriya classical texts. Information on our website is designed for traditional wellness and lifestyle enhancement. Patrons with acute medical conditions should seek advice from a qualified healthcare practitioner or schedule a personal consultation with our Ayurvedic Vaidyas.
          </p>
        </section>

        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            3. Product Authenticity & Unnao Origin
          </h2>
          <p>
            Every product supplied by Deepali Ayurveda is guaranteed 100% genuine and compounded directly from certified whole botanicals at our licensed pharmacy in Unnao, Uttar Pradesh.
          </p>
        </section>

        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            4. Pricing & Ordering Accuracy
          </h2>
          <p>
            All listed prices are denominated in Indian Rupees (INR) inclusive of taxes. We reserve the right to revise catalog pricing, correct accidental typographical errors, or decline an order in case of suspected misuse or supply constraints.
          </p>
        </section>

        <section className="bg-white p-8 rounded-sm border border-[#35251F]/15 shadow-sm space-y-3 card-luxury">
          <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">
            5. Office Inquiries & Customer Support
          </h2>
          <p>
            For any legal or service queries regarding orders, please contact our Unnao office:
          </p>
          <div className="pt-2 text-xs font-medium space-y-1 text-[#35251F]">
            <p><strong>Office Address:</strong> {BRAND_ADDRESS}</p>
            <p><strong>Direct Helpline:</strong> <a href={`tel:${BRAND_SUPPORT_PHONE}`} className="underline font-bold text-[#A7835E]">{BRAND_SUPPORT_PHONE_DISPLAY}</a></p>
            <p><strong>Email:</strong> <a href={`mailto:${BRAND_SUPPORT_EMAIL}`} className="underline font-bold text-[#A7835E]">{BRAND_SUPPORT_EMAIL}</a></p>
          </div>
        </section>

      </div>
    </div>
  );
}
