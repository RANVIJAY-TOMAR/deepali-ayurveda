import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';
import { formatPrice } from '../../lib/format';
import { PRODUCTS, VAIDYA_CONSULTATION_FEE } from '../../data/products';

interface DaaruMuktiSpotlightProps {
  onOpenConsult?: () => void;
}

export default function DaaruMuktiSpotlight({ onOpenConsult }: DaaruMuktiSpotlightProps) {
  const daaruMukti = PRODUCTS.find((p) => p.id === "daaru-mukti-powder");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-[#29231F] via-[#35251F] to-[#49352B] text-[#FBF8F2] p-7 sm:p-14 shadow-lift border border-[#A7835E]/40">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#A7835E]/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          <div className="lg:col-span-8 space-y-5 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#49352B] text-[#D8C3A5] border border-[#A7835E]/40 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-[#A7835E]" />
              <span>100% Plain Box Discreet Packaging Guaranteed</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury leading-tight text-[#FBF8F2]">
                  Daaru Mukti Powder
                </h2>
                <span className="px-2.5 py-0.5 bg-[#A7835E] text-[#FBF8F2] text-xs uppercase tracking-widest font-bold rounded-xs">
                  30 Daily Sachets
                </span>
              </div>
              <span className="text-[#D8C3A5] text-lg sm:text-xl font-normal font-hindi-luxury block">
                दारू मुक्ति चूर्ण • घर बैठे शराब की लत से मुक्ति
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#F5EFE5]/85 leading-relaxed max-w-2xl font-light">
              Time-tested classical formula to break alcohol dependency and regenerate fatty liver cells. Powered by <strong>Vidarikand (Kudzu Root)</strong> to curb dopamine-triggered cravings and <strong>Bhumi Amla</strong> to flush toxic acetaldehyde. Complete 1 Month Supply containing <strong>30 individual daily sachets (1 sachet each day)</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2.5 bg-white/10 rounded-sm p-3 backdrop-blur-xs border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span>30 Daily Sachets (1/day)</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 rounded-sm p-3 backdrop-blur-xs border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span>Mix in daily food/dal</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 rounded-sm p-3 backdrop-blur-xs border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span>Calms tremors & cravings</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to="/product/daaru-mukti-powder"
                className="btn-bronze px-7 py-3.5 rounded-sm text-xs uppercase tracking-widest font-bold shadow-lift flex items-center gap-2 cursor-pointer"
              >
                <span>Order 1 Month Supply (₹1,100)</span>
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
              <div className="h-48 rounded-xs overflow-hidden bg-[#241A16] flex items-center justify-center p-3">
                <img
                  src="/images/products/daaru-mukti-powder.png"
                  alt="Daaru Mukti 30 Daily Sachets (1 Month Supply)"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#D8C3A5] font-bold block mb-1">
                  1 Month Supply (30 Sachets)
                </span>
                <span className="text-3xl font-bold font-serif-luxury text-[#FBF8F2] block">
                  {formatPrice(daaruMukti?.price || 1100)}
                </span>
                <span className="text-xs text-[#D8C3A5]/60 line-through">
                  {formatPrice(daaruMukti?.originalPrice || 1599)}
                </span>
              </div>

              <span className="text-[11px] bg-white/10 text-[#D8C3A5] px-3 py-1 rounded-xs block border border-white/10 font-medium">
                1 Sachet / Day • Plain Outer Box
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
