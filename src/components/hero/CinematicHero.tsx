import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Award, Lock, Sparkles, Clock, Leaf, PhoneCall } from 'lucide-react';
import { 
  BRAND_NAME, 
  BRAND_ESTABLISHED, 
  BRAND_HERO_HEADLINE, 
  BRAND_HERO_SUBTEXT,
  BRAND_STORYLINE_GANGA,
  VAIDYA_CONSULTATION_FEE
} from '../../data/products';

const TRUST_CREDENTIALS = [
  { title: "Est. 1997 Unnao", desc: "Rooted along the sacred River Ganga", icon: Award },
  { title: "100% Classical Kwath", desc: "Zero synthetic chemicals or isolates", icon: Leaf },
  { title: "100% Plain Box Delivery", desc: "Discreet unbranded packaging guaranteed", icon: Lock },
  { title: "Talk to a Vaidya (₹200)", desc: "Personal consultation over a call", icon: PhoneCall },
];

export default function CinematicHero() {
  const headlineWords = ["THE", "WISDOM", "OF", "AYURVEDA.", "REIMAGINED", "FOR", "TODAY."];

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#FBF8F2] border-b border-[#35251F]/15">
      
      {/* Background Decorative Atmosphere with Earthy Luxury Warmth */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm Mocha & Bronze Radial Ambient Highlights */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#D8C3A5]/25 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full bg-[#A7835E]/15 blur-[140px]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Typography & Storytelling */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Eyebrow Heritage Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F5EFE5] border border-[#D8C3A5] text-[#35251F] text-xs uppercase tracking-widest font-bold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A7835E]" />
              <span>Sacred Ganga Heritage • Est. {BRAND_ESTABLISHED} Unnao</span>
            </motion.div>

            {/* Staggered Word Reveal Major Headline */}
            <div className="space-y-3">
              <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#35251F] leading-[1.08] flex flex-wrap gap-x-3.5 gap-y-1">
                {headlineWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15 + i * 0.07,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className={word === "AYURVEDA." || word === "TODAY." ? "text-[#A7835E]" : ""}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.65 }}
                className="pt-1"
              >
                <span className="text-sm sm:text-base font-serif italic text-[#725543] font-medium block">
                  "{BRAND_STORYLINE_GANGA}"
                </span>
              </motion.div>
            </div>

            {/* Supporting Editorial Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg text-[#35251F]/85 font-light leading-relaxed max-w-2xl"
            >
              For over 29 years, <strong>{BRAND_NAME}</strong> has formulated classical Shastriya preparations directly from pure whole botanicals in Unnao, Uttar Pradesh. From our flagship <strong>1 Month Supply Daaru Mukti Powder</strong> to cellular nutritional tonics, experience authentic Ayurveda untouched by synthetic isolates.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to="/shop"
                className="btn-bronze px-8 py-4 rounded-sm text-xs uppercase tracking-widest font-bold flex items-center gap-2.5 shadow-premium group cursor-pointer"
              >
                <span>EXPLORE REMEDIES</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <a
                href="#talk-to-vaidya"
                className="px-6 py-4 rounded-sm text-xs uppercase tracking-widest font-bold text-[#35251F] bg-[#F5EFE5] hover:bg-[#EFE7DA] border border-[#D8C3A5] transition flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#A7835E]" />
                <span>TALK TO A VAIDYA (₹{VAIDYA_CONSULTATION_FEE})</span>
              </a>
            </motion.div>

          </div>

          {/* Right Column: Hand-Carved Official Brand Emblem */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="relative mx-auto max-w-md w-full"
            >
              {/* Warm Ambient Golden Halo Backlight */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#A7835E]/30 via-[#D4AF37]/25 to-[#D8C3A5]/30 rounded-2xl blur-3xl opacity-80 pointer-events-none animate-pulse" />

              {/* Museum Showcase Frame */}
              <div className="relative rounded-sm overflow-hidden border-2 border-[#A7835E]/60 shadow-[0_25px_60px_-15px_rgba(53,37,31,0.6)] bg-gradient-to-br from-[#35251F] via-[#2A1D17] to-[#1E140F] p-4 group">
                
                {/* Square Emblem Container */}
                <div className="aspect-square rounded-xs overflow-hidden relative border border-[#A7835E]/40 shadow-inner bg-[#241A16]">
                  <img
                    src="/images/logo/deepali-ayurveda-logo.jpg"
                    alt="Deepali Ayurveda Hand-Carved Wood & Gold Emblem (Est. 1997)"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Interactive Metallic Gold Sheen Glint Sweep on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {/* Subtle Inner Bevel Shadow */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
                </div>

                {/* Brass Inscription Pedestal Plaque */}
                <div className="mt-4 p-3.5 rounded-xs bg-[#241A16]/95 border border-[#A7835E]/35 text-center space-y-1 shadow-inner">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3 text-[#A7835E]" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#D8C3A5] font-bold">
                      The Official Heritage Crest
                    </span>
                    <Sparkles className="w-3 h-3 text-[#A7835E]" />
                  </div>
                  <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#FBF8F2] tracking-wide">
                    DEEPALI AYURVEDA • EST. {BRAND_ESTABLISHED}
                  </h3>
                  <p className="text-xs text-[#D8C3A5] font-hindi-luxury font-medium">
                    गंगा तीरे प्रतिष्ठित • उन्नाव, उत्तर प्रदेश
                  </p>
                </div>

              </div>

              {/* Floating Quality Seal Badge (Top-Left) */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -left-5 bg-[#35251F] text-[#D8C3A5] border-2 border-[#A7835E]/70 rounded-sm py-2 px-3.5 shadow-premium hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider backdrop-blur-md"
              >
                <Award className="w-4 h-4 text-[#A7835E]" />
                <span>Hand-Carved Seal • Est. {BRAND_ESTABLISHED}</span>
              </motion.div>

              {/* Floating Plain Box Delivery Badge (Bottom-Right) */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-5 -right-5 bg-white text-[#35251F] border-2 border-[#A7835E]/60 rounded-sm p-3.5 shadow-premium hidden sm:flex items-center gap-2.5 text-xs font-bold"
              >
                <Lock className="w-4 h-4 text-[#A7835E]" />
                <div>
                  <span className="block text-[11px] font-bold text-[#35251F]">100% Plain Box</span>
                  <span className="block text-[9px] text-[#A7835E] uppercase tracking-wider font-semibold">Discreet Packaging</span>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* 4 Bottom Trust Credential Seals */}
      <div className="border-t border-[#35251F]/15 bg-[#F5EFE5]/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_CREDENTIALS.map((cred, idx) => {
              const Icon = cred.icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#35251F] text-[#D8C3A5] flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-5 h-5 text-[#A7835E]" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-sm font-bold text-[#35251F]">
                      {cred.title}
                    </h4>
                    <p className="text-[11px] text-[#35251F]/70 font-light">
                      {cred.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}
