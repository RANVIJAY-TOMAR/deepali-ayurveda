import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Clock,
  MapPin,
  PhoneCall
} from 'lucide-react';
import { 
  BRAND_NAME, 
  BRAND_TAGLINE, 
  BRAND_ESTABLISHED, 
  BRAND_LOCATION,
  BRAND_STORYLINE_GANGA,
  BRAND_STORYLINE_HERITAGE,
  VAIDYA_CONSULTATION_FEE 
} from '../data/products';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-24 text-[#35251F]">
      
      {/* Editorial Header */}
      <section className="pt-12 pb-20 bg-gradient-to-b from-[#F5EFE5] via-[#FBF8F2] to-[#FBF8F2] border-b border-[#35251F]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#35251F]/60 mb-6 font-medium">
            <Link to="/" className="hover:text-[#A7835E] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
            <span className="text-[#35251F] font-bold">About Us</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#A7835E] shadow-md shrink-0 bg-[#2A1D17] p-0.5">
                  <img
                    src="/images/logo/deepali-ayurveda-logo-circle.png"
                    alt="Deepali Ayurveda Official Seal"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#35251F]/10 text-[#35251F] text-xs font-bold uppercase tracking-widest border border-[#35251F]/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#A7835E]" />
                  <span>Established {BRAND_ESTABLISHED} • {BRAND_LOCATION}</span>
                </div>
              </div>

              <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-[#35251F] leading-tight tracking-tight">
                Tradition of Ayurveda. <br />
                <span className="text-[#A7835E] italic font-serif">Trust Through Generations.</span>
              </h1>

              <div className="space-y-3">
                <p className="text-base sm:text-lg font-serif italic text-[#725543] font-medium">
                  "{BRAND_STORYLINE_HERITAGE}"
                </p>
                <p className="text-sm sm:text-base text-[#35251F]/85 leading-relaxed font-light max-w-2xl">
                  "{BRAND_STORYLINE_GANGA}" Founded in 1997 in Unnao, Uttar Pradesh, <strong>{BRAND_NAME}</strong> was established with a singular dedication: to compound authentic Ayurvedic formulations according to classical Shastriya texts, preserving nature's natural synergies without synthetic isolates or chemical shortcuts.
                </p>
              </div>

              {/* 3 Metric Badges */}
              <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-4 bg-white rounded-sm border border-[#35251F]/15 shadow-xs">
                  <span className="font-serif-luxury text-2xl font-bold text-[#35251F] block">29+ Years</span>
                  <span className="text-[#35251F]/70 text-xs font-medium">Unbroken Trust</span>
                </div>
                <div className="p-4 bg-white rounded-sm border border-[#35251F]/15 shadow-xs">
                  <span className="font-serif-luxury text-2xl font-bold text-[#35251F] block">100% Classical</span>
                  <span className="text-[#35251F]/70 text-xs font-medium">Authentic Formulas</span>
                </div>
                <div className="p-4 bg-white rounded-sm border border-[#35251F]/15 shadow-xs">
                  <span className="font-serif-luxury text-2xl font-bold text-[#35251F] block">River Ganga</span>
                  <span className="text-[#35251F]/70 text-xs font-medium">Regional Roots</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-sm overflow-hidden border-2 border-[#A7835E]/40 relative bg-[#F5EFE5] aspect-4/3 shadow-premium img-zoom-container">
                <img
                  src="https://images.unsplash.com/photo-1570283988059-af8412f4fe91?auto=format&fit=crop&w=1000&q=80"
                  alt="Classical Ayurvedic Mortar, Pestle and Whole Botanical Preparation in Unnao"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#35251F]/90 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#D8C3A5] font-bold">
                    Unnao, Uttar Pradesh Classical Apothecary
                  </span>
                  <p className="text-xs text-[#FBF8F2] font-hindi-luxury mt-1 font-medium">
                    गंगा तीरे निर्मित प्रामाणिक आयुर्वेदिक योग
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold">
            The Deepali Standard
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#35251F] tracking-tight">
            Four Pillars of Ayurvedic Integrity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 bg-white rounded-sm border border-[#35251F]/15 space-y-3 card-luxury text-left">
            <div className="w-12 h-12 rounded-full bg-[#F5EFE5] text-[#35251F] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-[#A7835E]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#35251F]">Whole-Plant Synergy</h3>
            <p className="text-xs sm:text-sm text-[#35251F]/80 leading-relaxed font-light">
              We reject synthetic isolates. Plants evolved complex phytocomplexes where companion co-factors ensure high physiological bio-absorption.
            </p>
          </div>

          <div className="p-8 bg-white rounded-sm border border-[#35251F]/15 space-y-3 card-luxury text-left">
            <div className="w-12 h-12 rounded-full bg-[#F5EFE5] text-[#35251F] flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#A7835E]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#35251F]">Slow Kwath Boiling</h3>
            <p className="text-xs sm:text-sm text-[#35251F]/80 leading-relaxed font-light">
              Traditional slow-heat water decoction preserves volatile essential principles and eliminates the harsh chemical residues common in fast industrial extraction.
            </p>
          </div>

          <div className="p-8 bg-white rounded-sm border border-[#35251F]/15 space-y-3 card-luxury text-left">
            <div className="w-12 h-12 rounded-full bg-[#F5EFE5] text-[#35251F] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#A7835E]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#35251F]">NABL Tested Purity</h3>
            <p className="text-xs sm:text-sm text-[#35251F]/80 leading-relaxed font-light">
              Every production batch is tested in accredited laboratories to verify zero presence of harmful heavy metals (Lead, Mercury, Arsenic) or synthetic fillers.
            </p>
          </div>

          <div className="p-8 bg-white rounded-sm border border-[#35251F]/15 space-y-3 card-luxury text-left">
            <div className="w-12 h-12 rounded-full bg-[#F5EFE5] text-[#35251F] flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#A7835E]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#35251F]">100% Plain Box Discretion</h3>
            <p className="text-xs sm:text-sm text-[#35251F]/80 leading-relaxed font-light">
              All orders are dispatched in plain brown cardboard packaging without external remedy markings, ensuring complete personal privacy for every patron.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#35251F] text-[#FBF8F2] p-8 sm:p-12 rounded-sm text-center space-y-6 border border-[#A7835E]/40 shadow-lift">
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#D8C3A5] font-bold">
              Direct-to-Customer Store
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-white">
              Experience the True Science of Ayurveda
            </h3>
            <p className="text-xs sm:text-sm text-[#D8C3A5]/90 font-light">
              From our flagship 1 Month Supply Daaru Mukti Powder to daily cellular vitality formulations, discover remedies rooted in tradition since 1997.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="btn-bronze px-8 py-4 rounded-sm text-xs uppercase tracking-widest font-bold inline-flex items-center gap-2 shadow-premium"
            >
              <span>Explore Formulations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="/#talk-to-vaidya"
              className="px-6 py-4 rounded-sm text-xs uppercase tracking-widest font-bold text-[#FBF8F2] bg-[#49352B] hover:bg-[#5C4336] border border-[#A7835E]/50 transition inline-flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D8C3A5]" />
              <span>Talk to a Vaidya (₹{VAIDYA_CONSULTATION_FEE})</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
