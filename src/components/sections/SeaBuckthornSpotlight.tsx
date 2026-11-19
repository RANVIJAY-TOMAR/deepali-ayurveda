import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, PhoneCall, Truck, ShieldCheck, Award, Lock, Sparkles, FlaskConical } from 'lucide-react';
import { formatPrice } from '../../lib/format';
import { VAIDYA_CONSULTATION_FEE } from '../../data/products';
import { useProduct } from '../../hooks/useProducts';

interface SpotlightProps {
  onOpenConsult?: () => void;
}

export default function SeaBuckthornSpotlight({ onOpenConsult }: SpotlightProps) {
  const { product: seaBuckthorn } = useProduct('sea-buckthorn');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-[#29231F] via-[#35251F] to-[#49352B] text-[#FBF8F2] p-7 sm:p-14 shadow-lift border border-[#A7835E]/40">

        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#A7835E]/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">

          <div className="lg:col-span-8 space-y-5 text-left">

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#49352B] text-[#D8C3A5] border border-[#A7835E]/40 text-xs font-bold uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5 text-[#A7835E]" />
                <span>Complimentary Free Delivery PAN India</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#49352B] text-[#D8C3A5] border border-[#A7835E]/40 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A7835E]" />
                <span>MSME • FSSAI • AYUSH • ISO • GMP Certified</span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury leading-tight text-[#FBF8F2]">
                  Sea Buckthorn (Leh Berry)
                </h2>
                <span className="px-2.5 py-0.5 bg-[#A7835E] text-[#FBF8F2] text-xs uppercase tracking-widest font-bold rounded-xs">
                  99% Pure Pulp
                </span>
              </div>
              <span className="text-[#D8C3A5] text-lg sm:text-xl font-normal font-hindi-luxury block">
                हिमालयन संजीवनी फल रस • दैनिक स्वास्थ्य शॉट (500 ML)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#F5EFE5]/90 leading-relaxed max-w-2xl font-light">
              Harvested from the pristine, high-altitude regions of the Himalayas, Sea Buckthorn (Leh Berry) is nature’s ultimate superfruit for daily vitality and radiant skin. Packed with potent antioxidants, natural Vitamin C, Vitamin E, and rare Omega-3, 6, 7, and 9 fatty acids, this golden-orange berry delivers complete cellular nourishment from within. Known in traditional wellness for boosting immunity, supporting heart and digestive health, and restoring skin elasticity, it offers pure, plant-based rejuvenation in every serving.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2 bg-white/10 rounded-sm p-2.5 backdrop-blur-xs border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span>Rare Omegas 3, 6, 7 & 9</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-sm p-2.5 backdrop-blur-xs border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span>Natural Vit C & E</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-sm p-2.5 backdrop-blur-xs border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span>Restores Skin Elasticity</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-sm p-2.5 backdrop-blur-xs border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span>100% Lab Tested Pure</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to="/product/sea-buckthorn"
                className="btn-bronze px-7 py-3.5 rounded-sm text-xs uppercase tracking-widest font-bold shadow-lift flex items-center gap-2 cursor-pointer"
              >
                <span>Order Sea Buckthorn ({formatPrice(seaBuckthorn?.price ?? 699)})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {onOpenConsult && (
                <button
                  onClick={onOpenConsult}
                  className="px-5 py-3.5 bg-[#49352B] hover:bg-[#5C4336] text-[#FBF8F2] font-bold text-xs uppercase tracking-wider rounded-sm border border-[#A7835E]/40 transition flex items-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#D8C3A5]" />
                  <span>Talk to a Vaidya (₹{VAIDYA_CONSULTATION_FEE})</span>
                </button>
              )}
            </div>

          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="p-5 bg-[#49352B] rounded-sm border border-[#A7835E]/30 text-center space-y-3 max-w-xs w-full shadow-premium">
              <div className="h-56 rounded-xs overflow-hidden bg-[#241A16] flex items-center justify-center p-2">
                <img
                  src="/images/products/sea-buckthorn.png?v=20261120_2"
                  alt="Deepali Ayurveda Sea Buckthorn (Leh Berry) 99% Pure Pulp 500 ML"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#D8C3A5] font-bold block mb-1">
                  500 ML Daily Health Shot
                </span>
                <span className="text-3xl font-bold font-serif-luxury text-[#FBF8F2] block">
                  {formatPrice(seaBuckthorn?.price || 699)}
                </span>
                <span className="text-xs text-[#D8C3A5]/60 line-through">
                  {formatPrice(seaBuckthorn?.originalPrice || 999)}
                </span>
              </div>

              <span className="text-[11px] bg-white/10 text-[#D8C3A5] px-3 py-1 rounded-xs block border border-white/10 font-medium">
                100% Free Delivery PAN India
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
