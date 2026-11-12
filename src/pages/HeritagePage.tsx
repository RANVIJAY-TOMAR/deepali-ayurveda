import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Award, Leaf, Clock, Sparkles } from 'lucide-react';
import { 
  BRAND_NAME, 
  BRAND_ESTABLISHED, 
  BRAND_LOCATION, 
  BRAND_STORYLINE_GANGA, 
  HERITAGE_TIMELINE,
  VAIDYA_CONSULTATION_FEE 
} from '../data/products';

export default function HeritagePage() {
  return (
    <div className="space-y-16 pb-24 text-[#35251F]">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F5EFE5] via-[#FBF8F2] to-[#FBF8F2] border-b border-[#35251F]/15 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-left">
          <nav className="flex items-center gap-2 text-xs text-[#35251F]/60 font-medium">
            <Link to="/" className="hover:text-[#A7835E] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
            <span className="text-[#35251F] font-bold">Our Heritage</span>
          </nav>

          <div className="max-w-3xl space-y-4">
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
                <span>Unbroken Lineage • Established {BRAND_ESTABLISHED}</span>
              </div>
            </div>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-[#35251F] tracking-tight leading-tight">
              Our Heritage & Regional Roots
            </h1>
            <p className="text-sm sm:text-base text-[#35251F]/85 leading-relaxed font-light">
              "{BRAND_STORYLINE_GANGA}" Over the past 29 years, Deepali Ayurveda has compounded classical remedies in Unnao, Uttar Pradesh, adhering strictly to Charaka and Sushruta Samhita principles.
            </p>
          </div>
        </div>
      </section>

      {/* Historical Milestones Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-[#35251F]/15 pb-6 text-left">
          <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block mb-1">
            Chronology of Authenticity
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#35251F] tracking-tight">
            Key Milestones (1997–{new Date().getFullYear()})
          </h2>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 sm:before:left-1/2 before:w-0.5 before:bg-[#A7835E]/30 text-left">
          {HERITAGE_TIMELINE.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col sm:flex-row items-start gap-8 ${
                idx % 2 === 0 ? 'sm:flex-row-reverse' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#35251F] text-[#D8C3A5] border-2 border-[#A7835E] flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-xs self-start sm:self-center">
                {idx + 1}
              </div>

              <div className="flex-1 bg-white p-6 sm:p-8 rounded-sm border border-[#35251F]/15 shadow-subtle card-luxury space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block">
                  {item.year}
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-[#35251F]">
                  {item.milestone}
                </h3>
                <p className="text-xs sm:text-sm text-[#35251F]/80 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Regional Ganga Valley Setting */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5EFE5] rounded-sm p-8 sm:p-14 border border-[#35251F]/15">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block">
                Regional Heritage • Unnao, Uttar Pradesh
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#35251F]">
                Why Our Roots Along River Ganga Matter
              </h2>
              <p className="text-xs sm:text-sm text-[#35251F]/80 leading-relaxed font-light">
                The fertile Ganga basin has been a cradle of classical Indian botanical knowledge for millennia. The microclimate, clean water, and rich alluvial soil support potent whole-herb cultivation without synthetic pesticides.
              </p>
              <p className="text-xs sm:text-sm text-[#35251F]/80 leading-relaxed font-light">
                At our apothecary in Unnao, every batch is prepared following classical Shastriya methods—utilizing pure decoctions, sun drying, and fine pulverization.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-sm overflow-hidden border border-[#35251F]/15 aspect-video shadow-xs bg-[#35251F]">
                <img
                  src="https://images.unsplash.com/photo-1706186829065-ede677efe384?auto=format&fit=crop&w=800&q=80"
                  alt="Sacred River Ganga in Uttar Pradesh - Deepali Ayurveda Heritage"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 bg-white rounded-sm border border-[#35251F]/15 shadow-xs space-y-3">
                <h4 className="font-serif-luxury text-lg font-bold text-[#35251F]">Apothecary Headquarters</h4>
                <div className="text-xs text-[#35251F]/70 space-y-1 font-light">
                  <p><strong>Location:</strong> {BRAND_LOCATION}</p>
                  <p><strong>Address:</strong> C-9, Awas Vikas Colony, Unnao, UP</p>
                  <p><strong>Foundation:</strong> 1997</p>
                </div>
                <div className="pt-2">
                  <Link
                    to="/shop"
                    className="btn-espresso inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold"
                  >
                    <span>View Formulations</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D8C3A5]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
