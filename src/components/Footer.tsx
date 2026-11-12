import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Leaf, 
  Lock, 
  Sparkles,
  ArrowUp,
  Heart
} from 'lucide-react';
import { 
  BRAND_NAME, 
  BRAND_ESTABLISHED, 
  BRAND_ADDRESS, 
  BRAND_SUPPORT_PHONE, 
  BRAND_SUPPORT_PHONE_DISPLAY,
  BRAND_SUPPORT_EMAIL, 
  BRAND_TAGLINE,
  BRAND_STORYLINE_GANGA,
  VAIDYA_CONSULTATION_FEE,
  PRODUCTS 
} from '../data/products';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#35251F] text-[#F5EFE5] border-t-2 border-[#A7835E]/40 overflow-hidden">
      
      {/* 5 Quality Assurance Seals Header */}
      <div className="border-b border-[#49352B] bg-[#29231F] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#49352B] text-[#D8C3A5] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-[#A7835E]" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm font-bold text-[#FBF8F2]">100% Shastriya</h4>
                <p className="text-[11px] text-[#D8C3A5]/70 font-light">Zero synthetic chemicals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#49352B] text-[#D8C3A5] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-[#A7835E]" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm font-bold text-[#FBF8F2]">Discreet Packaging</h4>
                <p className="text-[11px] text-[#D8C3A5]/70 font-light">100% Plain sealed box</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#49352B] text-[#D8C3A5] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#A7835E]" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm font-bold text-[#FBF8F2]">Free Express Shipping</h4>
                <p className="text-[11px] text-[#D8C3A5]/70 font-light">Complimentary above ₹500</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#49352B] text-[#D8C3A5] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#A7835E]" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm font-bold text-[#FBF8F2]">Tested for Purity</h4>
                <p className="text-[11px] text-[#D8C3A5]/70 font-light">NABL Heavy metal free</p>
              </div>
            </div>

            <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-full bg-[#49352B] text-[#D8C3A5] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#A7835E]" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm font-bold text-[#FBF8F2]">Established {BRAND_ESTABLISHED}</h4>
                <p className="text-[11px] text-[#D8C3A5]/70 font-light">Unnao, River Ganga region</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Column 1: Brand Lore & Regional Heritage (5 cols) */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#A7835E]/80 shadow-md bg-[#2A1D17] shrink-0 p-0.5">
                <img
                  src="/images/logo/deepali-ayurveda-logo-circle.png"
                  alt="Deepali Ayurveda Official Seal"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#FBF8F2] tracking-tight">
                  {BRAND_NAME}
                </h3>
                <span className="text-[11px] uppercase tracking-widest text-[#D8C3A5] font-bold block">
                  Tradition of Ayurveda • Est. {BRAND_ESTABLISHED}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F5EFE5]/85 leading-relaxed font-light max-w-md">
              "{BRAND_STORYLINE_GANGA}" Founded in 1997 in Unnao, Uttar Pradesh, <strong>{BRAND_NAME}</strong> compounds authentic Shastriya classical formulations according to ancient Ayurvedic pharmacopoeia texts.
            </p>

            {/* Direct Official Contact Info */}
            <div className="space-y-2.5 pt-2 text-xs text-[#D8C3A5]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A7835E] shrink-0 mt-0.5" />
                <span><strong>Office Address:</strong> {BRAND_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span>Phone: <a href={`tel:${BRAND_SUPPORT_PHONE}`} className="text-[#FBF8F2] hover:text-[#D8C3A5] font-semibold underline">{BRAND_SUPPORT_PHONE_DISPLAY}</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span>Email: <a href={`mailto:${BRAND_SUPPORT_EMAIL}`} className="text-[#FBF8F2] hover:text-[#D8C3A5] font-semibold underline">{BRAND_SUPPORT_EMAIL}</a></span>
              </div>
            </div>
          </div>

          {/* Column 2: Classical Store Catalog Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif-luxury text-base font-bold text-[#FBF8F2] border-b border-[#49352B] pb-2">
              Classical Catalog
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5EFE5]/80">
              <li>
                <Link to="/product/daaru-mukti-powder" className="hover:text-[#D8C3A5] transition flex items-center justify-between">
                  <span>Daaru Mukti Powder (1 Mo.)</span>
                  <span className="text-[10px] text-[#A7835E] font-bold">₹1,100</span>
                </Link>
              </li>
              <li>
                <Link to="/product/b12" className="hover:text-[#D8C3A5] transition flex items-center justify-between">
                  <span>Plant Vitamin B12 (4-in-1)</span>
                  <span className="text-[10px] text-[#A7835E] font-bold">₹599</span>
                </Link>
              </li>
              <li>
                <Link to="/product/sea-buckthorn" className="hover:text-[#D8C3A5] transition flex items-center justify-between">
                  <span>Sea Buckthorn Pure Extract</span>
                  <span className="text-[10px] text-[#A7835E] font-bold">₹599</span>
                </Link>
              </li>
              <li>
                <Link to="/product/apple-cider-vinegar" className="hover:text-[#D8C3A5] transition flex items-center justify-between">
                  <span>Apple Cider Vinegar + Moringa</span>
                  <span className="text-[10px] text-[#A7835E] font-bold">₹293</span>
                </Link>
              </li>
              <li>
                <Link to="/product/digest-guru" className="hover:text-[#D8C3A5] transition flex items-center justify-between">
                  <span>Digest Guru Churan</span>
                  <span className="text-[10px] text-[#A7835E] font-bold">₹199</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-[#49352B]">
                <Link to="/shop" className="text-[#A7835E] hover:underline font-bold">
                  View All Products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Navigation & Consultation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif-luxury text-base font-bold text-[#FBF8F2] border-b border-[#49352B] pb-2">
              Apothecary
            </h4>
            <ul className="space-y-2 text-xs text-[#F5EFE5]/80">
              <li><Link to="/about" className="hover:text-[#D8C3A5] transition">About Us</Link></li>
              <li><Link to="/heritage" className="hover:text-[#D8C3A5] transition">Our Heritage</Link></li>
              <li><Link to="/categories" className="hover:text-[#D8C3A5] transition">Categories</Link></li>
              <li><Link to="/contact" className="hover:text-[#D8C3A5] transition">Contact Us</Link></li>
              <li><Link to="/cart" className="hover:text-[#D8C3A5] transition">Shopping Basket</Link></li>
              <li><a href="#talk-to-vaidya" className="hover:text-[#D8C3A5] text-[#A7835E] font-bold transition">Talk to a Vaidya (₹{VAIDYA_CONSULTATION_FEE})</a></li>
            </ul>
          </div>

          {/* Column 4: Trust & Policies (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif-luxury text-base font-bold text-[#FBF8F2] border-b border-[#49352B] pb-2">
              Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#F5EFE5]/80">
              <li><Link to="/privacy-policy" className="hover:text-[#D8C3A5] transition">Privacy & Discretion</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-[#D8C3A5] transition">Shipping & Delivery</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-[#D8C3A5] transition">Terms of Service</Link></li>
            </ul>

            <div className="pt-4">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs text-[#D8C3A5] hover:text-[#FBF8F2] cursor-pointer"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Regional Footnote */}
        <div className="mt-14 pt-8 border-t border-[#49352B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8C3A5]/60 font-light">
          <p>
            © 1997–{new Date().getFullYear()} {BRAND_NAME}. All rights reserved. C-9, Awas Vikas Colony, Unnao, Uttar Pradesh.
          </p>
          <p className="text-[11px] text-[#D8C3A5]/80">
            Rooted in Unnao on the sacred River Ganga • Ayurveda Direct
          </p>
        </div>

      </div>

    </footer>
  );
}
