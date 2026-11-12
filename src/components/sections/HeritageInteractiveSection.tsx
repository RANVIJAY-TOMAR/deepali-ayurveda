import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_ESTABLISHED, BRAND_LOCATION, BRAND_STORYLINE_GANGA, BRAND_ADDRESS } from '../../data/products';

export default function HeritageInteractiveSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#35251F] text-[#FBF8F2] rounded-sm p-8 sm:p-14 shadow-lift border border-[#A7835E]/40 relative overflow-hidden text-left">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#A7835E]/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#49352B] text-[#D8C3A5] border border-[#A7835E]/30 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#A7835E]" />
              <span>Three Decades of Trust • Est. {BRAND_ESTABLISHED}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury leading-tight text-[#FBF8F2]">
              Rooted in Unnao, on the Banks of River Ganga
            </h2>

            <p className="text-xs sm:text-sm text-[#D8C3A5] leading-relaxed font-light">
              In 1997, <strong>{BRAND_NAME}</strong> was founded in Unnao, Uttar Pradesh along the fertile banks of the sacred River Ganga. While the commercial industry shifted towards synthetic isolates and chemical fillers, we pledged to formulate in strict adherence to classical Shastriya pharmacopoeia standards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3.5 bg-white/10 rounded-sm border border-white/10 backdrop-blur-xs">
                <span className="font-bold text-[#D8C3A5] block text-sm">Est. 1997</span>
                <span className="text-[11px] text-[#F5EFE5]/70">Unnao, UP heritage</span>
              </div>
              <div className="p-3.5 bg-white/10 rounded-sm border border-white/10 backdrop-blur-xs">
                <span className="font-bold text-[#D8C3A5] block text-sm">Low-Heat Kwath</span>
                <span className="text-[11px] text-[#F5EFE5]/70">Preserves active phytonutrients</span>
              </div>
              <div className="p-3.5 bg-white/10 rounded-sm border border-white/10 backdrop-blur-xs">
                <span className="font-bold text-[#D8C3A5] block text-sm">100% Discreet</span>
                <span className="text-[11px] text-[#F5EFE5]/70">Plain box packaging</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/heritage"
                className="btn-bronze px-6 py-3.5 rounded-sm text-xs uppercase tracking-wider font-bold shadow-lift flex items-center gap-2 cursor-pointer"
              >
                <span>Read the Heritage Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-sm border border-white/20 transition flex items-center gap-2"
              >
                <span>Our Quality Standards</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#49352B] p-6 rounded-sm border border-[#A7835E]/30 space-y-3">
              <h4 className="font-serif-luxury text-lg font-bold text-[#FBF8F2]">Dispensary Coordinates</h4>
              <p className="text-xs text-[#D8C3A5] font-light leading-relaxed">
                {BRAND_ADDRESS}
              </p>
              <div className="pt-2 text-[11px] text-[#D8C3A5]/80 space-y-1">
                <p>✦ Classical decoctions compounded on premise</p>
                <p>✦ Daily speed post and courier dispatches</p>
                <p>✦ 100% unbranded plain packaging for all parcels</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
