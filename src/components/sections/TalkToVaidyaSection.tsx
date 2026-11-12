import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, Clock, CheckCircle, ShieldCheck, Sparkles, User, ArrowRight } from 'lucide-react';
import { BRAND_NAME, BRAND_SUPPORT_PHONE, VAIDYA_CONSULTATION_FEE } from '../../data/products';

interface TalkToVaidyaSectionProps {
  onOpenModal?: () => void;
}

export default function TalkToVaidyaSection({ onOpenModal }: TalkToVaidyaSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredSlot: 'Morning (10:00 AM - 1:00 PM IST)',
    healthConcern: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section id="talk-to-vaidya" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#35251F] text-[#FBF8F2] rounded-sm p-8 sm:p-14 border border-[#A7835E]/40 shadow-lift relative overflow-hidden">
        
        {/* Ambient Subtle Radial Glow */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#A7835E]/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: Information & Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#49352B] border border-[#A7835E]/50 text-[#D8C3A5] text-xs uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#A7835E]" />
              <span>Personal Consultation Over a Call</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#FBF8F2] tracking-tight leading-tight">
                Talk to a Vaidya
              </h2>
              <p className="text-sm sm:text-base text-[#D8C3A5] font-light max-w-xl leading-relaxed">
                Receive personalized traditional Ayurvedic counsel directly over the phone. Discuss root-cause imbalances, remedy selection, dosage timings, and lifestyle recommendations.
              </p>
            </div>

            {/* Price Badge */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-xs uppercase tracking-widest text-[#D8C3A5] font-bold">
                Consultation Fee:
              </span>
              <span className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#FBF8F2]">
                ₹{VAIDYA_CONSULTATION_FEE}
              </span>
              <span className="text-xs text-[#D8C3A5]/70 font-light">
                / personal call
              </span>
            </div>

            {/* Credential Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs">
              <div className="p-3.5 rounded-sm bg-[#49352B]/70 border border-[#A7835E]/30 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span className="font-medium text-[#F5EFE5]">Direct phone consultation</span>
              </div>
              <div className="p-3.5 rounded-sm bg-[#49352B]/70 border border-[#A7835E]/30 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span className="font-medium text-[#F5EFE5]">Personalized dosage guidance</span>
              </div>
              <div className="p-3.5 rounded-sm bg-[#49352B]/70 border border-[#A7835E]/30 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span className="font-medium text-[#F5EFE5]">100% confidential discussion</span>
              </div>
              <div className="p-3.5 rounded-sm bg-[#49352B]/70 border border-[#A7835E]/30 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span className="font-medium text-[#F5EFE5]">Direct call: {BRAND_SUPPORT_PHONE}</span>
              </div>
            </div>

            {onOpenModal && (
              <div className="pt-2">
                <button
                  onClick={onOpenModal}
                  className="btn-bronze px-8 py-4 rounded-sm text-xs uppercase tracking-widest font-bold flex items-center gap-2.5 shadow-premium cursor-pointer"
                >
                  <span>BOOK A CONSULTATION (₹{VAIDYA_CONSULTATION_FEE})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Direct Booking/Enquiry Form */}
          <div className="lg:col-span-5">
            <div className="bg-[#49352B] p-6 sm:p-8 rounded-sm border border-[#A7835E]/40 shadow-premium">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-[#A7835E]/20 pb-3">
                    <h3 className="font-serif-luxury text-lg font-bold text-[#FBF8F2]">
                      Book a Consultation
                    </h3>
                    <p className="text-[11px] text-[#D8C3A5]">
                      Personal consultation over a call • Fee: ₹{VAIDYA_CONSULTATION_FEE}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#D8C3A5] mb-1">
                      Customer Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Anand Kumar"
                      className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#35251F] border border-[#A7835E]/30 text-[#FBF8F2] placeholder-[#D8C3A5]/40 focus:outline-none focus:border-[#A7835E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#D8C3A5] mb-1">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9140086856"
                      className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#35251F] border border-[#A7835E]/30 text-[#FBF8F2] placeholder-[#D8C3A5]/40 focus:outline-none focus:border-[#A7835E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#D8C3A5] mb-1">
                      Preferred Date or Time *
                    </label>
                    <select
                      value={formData.preferredSlot}
                      onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#35251F] border border-[#A7835E]/30 text-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                    >
                      <option>Morning (10:00 AM - 1:00 PM IST)</option>
                      <option>Afternoon (2:00 PM - 5:00 PM IST)</option>
                      <option>Evening (5:00 PM - 8:00 PM IST)</option>
                      <option>Immediate / Next Available Slot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#D8C3A5] mb-1">
                      Health Concern (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.healthConcern}
                      onChange={(e) => setFormData({ ...formData, healthConcern: e.target.value })}
                      placeholder="e.g. Alcohol urges, digestion, daily fatigue..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#35251F] border border-[#A7835E]/30 text-[#FBF8F2] placeholder-[#D8C3A5]/40 focus:outline-none focus:border-[#A7835E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 btn-bronze text-xs uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 shadow-premium cursor-pointer"
                  >
                    <span>Submit Booking (₹{VAIDYA_CONSULTATION_FEE})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-[10px] text-center text-[#D8C3A5]/70">
                    Our team will confirm your consultation slot at your provided mobile number.
                  </p>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#35251F] text-[#A7835E] border border-[#A7835E]/50 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7 text-[#A7835E]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif-luxury text-xl font-bold text-[#FBF8F2]">
                      Booking Request Received
                    </h4>
                    <p className="text-xs text-[#D8C3A5] leading-relaxed max-w-xs mx-auto font-light">
                      Thank you, <strong>{formData.name}</strong>. Our team will contact you at <strong>{formData.phone}</strong> for your consultation during {formData.preferredSlot}.
                    </p>
                  </div>
                  <div className="p-3 bg-[#35251F] rounded-sm border border-[#A7835E]/30 text-[11px] text-[#D8C3A5]">
                    Consultation Fee: ₹{VAIDYA_CONSULTATION_FEE} per call
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs text-[#D8C3A5] hover:underline cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
