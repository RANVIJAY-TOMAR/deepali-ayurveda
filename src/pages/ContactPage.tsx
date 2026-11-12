import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  CheckCircle,
  Send,
  ShieldCheck,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Info
} from 'lucide-react';
import {
  BRAND_NAME,
  BRAND_ADDRESS,
  BRAND_SUPPORT_PHONE,
  BRAND_SUPPORT_PHONE_DISPLAY,
  BRAND_SUPPORT_EMAIL,
  BRAND_WHATSAPP_NUMBER,
  BRAND_ESTABLISHED,
  VAIDYA_CONSULTATION_FEE
} from '../data/products';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Dosage & Product Inquiry',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello Deepali Ayurveda, I have an inquiry regarding your classical formulations.`);
    window.open(`https://wa.me/${BRAND_WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleSendFormViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Deepali Ayurveda (Unnao Dispensary),\n\n*Inquiry Details:*\n• Name: ${formData.name}\n• Phone: ${formData.phone}\n• Email: ${formData.email || 'Not provided'}\n• Topic: ${formData.subject}\n• Message: ${formData.message}`
    );
    window.open(`https://wa.me/${BRAND_WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleSendFormViaEmail = () => {
    const subject = encodeURIComponent(`[${BRAND_NAME}] Inquiry: ${formData.subject}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nPhone: ${formData.phone}\nTopic: ${formData.subject}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${BRAND_SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-16 pb-24 text-[#35251F]">

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F5EFE5] via-[#FBF8F2] to-[#FBF8F2] border-b border-[#35251F]/15 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-left">
          <nav className="flex items-center gap-2 text-xs text-[#35251F]/60 font-medium">
            <Link to="/" className="hover:text-[#A7835E] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
            <span className="text-[#35251F] font-bold">Contact Us</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#35251F]/10 text-[#35251F] text-xs font-bold uppercase tracking-widest border border-[#35251F]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#A7835E]" />
              <span>Unnao Apothecary • Mon-Sat 9:00 AM - 7:00 PM IST</span>
            </div>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-[#35251F] tracking-tight leading-tight">
              Contact Deepali Ayurveda
            </h1>
            <p className="text-sm sm:text-base text-[#35251F]/85 leading-relaxed font-light">
              Have questions regarding classical preparations, 100% discreet shipping, dosage schedules, or booking a Vaidya call (₹{VAIDYA_CONSULTATION_FEE})? Our Unnao team is here to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Official Contact Channels */}
          <div className="lg:col-span-5 space-y-6 text-left">

            {/* Direct WhatsApp Action Card */}
            <div className="bg-[#35251F] text-[#FBF8F2] p-8 rounded-sm space-y-5 shadow-lift border border-[#A7835E]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#49352B] flex items-center justify-center text-[#D8C3A5]">
                  <MessageCircle className="w-5 h-5 text-[#A7835E]" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-white">Instant WhatsApp Connect</h3>
                  <span className="text-[10px] uppercase tracking-wider text-[#D8C3A5]">Official: {BRAND_SUPPORT_PHONE_DISPLAY}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#D8C3A5]/90 leading-relaxed font-light">
                Chat directly with our dispensary team for quick dosage questions, order tracking, and confidential inquiries.
              </p>
              <button
                onClick={handleWhatsApp}
                className="w-full py-3.5 btn-bronze rounded-sm text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* Structured Contact Details */}
            <div className="bg-white p-8 rounded-sm border border-[#35251F]/15 space-y-6 shadow-subtle card-luxury">

              <div className="flex items-start gap-4 pb-5 border-b border-[#35251F]/10">
                <div className="w-9 h-9 rounded-full bg-[#F5EFE5] text-[#35251F] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#A7835E]" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-widest text-[#35251F]/60 font-semibold block">Telephone Helpline</span>
                  <a href={`tel:${BRAND_SUPPORT_PHONE}`} className="text-base font-bold font-mono text-[#35251F] hover:text-[#A7835E] transition">
                    {BRAND_SUPPORT_PHONE_DISPLAY}
                  </a>
                  <p className="text-xs text-[#35251F]/70 font-light">Mon-Sat, 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-5 border-b border-[#35251F]/10">
                <div className="w-9 h-9 rounded-full bg-[#F5EFE5] text-[#35251F] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#A7835E]" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-widest text-[#35251F]/60 font-semibold block">Official Dispensary Email</span>
                  <a href={`mailto:${BRAND_SUPPORT_EMAIL}`} className="text-sm font-semibold text-[#35251F] hover:text-[#A7835E] transition">
                    {BRAND_SUPPORT_EMAIL}
                  </a>
                  <p className="text-xs text-[#35251F]/70 font-light">Response within 24 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#F5EFE5] text-[#35251F] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#A7835E]" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-widest text-[#35251F]/60 font-semibold block">Dispensary & Registered Apothecary</span>
                  <p className="text-xs text-[#35251F] font-medium leading-relaxed">
                    {BRAND_ADDRESS}
                  </p>
                  <p className="text-xs text-[#35251F]/70 font-light">Established {BRAND_ESTABLISHED} • Sacred River Ganga Region</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Inquiry Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#35251F]/15 shadow-premium text-left space-y-6">

              <div className="border-b border-[#35251F]/10 pb-4">
                <h3 className="font-serif-luxury text-2xl font-bold text-[#35251F]">
                  Send an Apothecary Inquiry
                </h3>
                <p className="text-xs text-[#35251F]/70 font-light mt-1">
                  Direct inquiry to our Unnao pharmacy desk.
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        minLength={2}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Verma"
                        className="w-full px-4 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9140086856"
                        className="w-full px-4 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1.5">
                        Inquiry Topic *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                      >
                        <option>Talk to a Vaidya (₹{VAIDYA_CONSULTATION_FEE})</option>
                        <option>Daaru Mukti (1 Month Supply) Inquiry</option>
                        <option>Plant Vitamin B12 / Mineral Guidance</option>
                        <option>Digest Guru / Gut Health Questions</option>
                        <option>Discreet Packaging & Order Dispatch</option>
                        <option>Other General Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1.5">
                      Your Message or Symptoms *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share your questions or describe your symptoms..."
                      className="w-full px-4 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 btn-espresso rounded-sm text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer shadow-premium"
                  >
                    <Send className="w-4 h-4 text-[#D8C3A5]" />
                    <span>Review & Transmit Inquiry</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#35251F]/70 pt-2 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A7835E]" />
                    <span>100% Confidential • Direct communication with our Unnao pharmacy desk</span>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#F5EFE5] text-[#35251F] border border-[#A7835E]/40 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle className="w-8 h-8 text-[#A7835E]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif-luxury text-2xl font-bold text-[#35251F]">
                      Ready to Connect
                    </h4>
                    <p className="text-xs sm:text-sm text-[#35251F]/80 max-w-md mx-auto font-light leading-relaxed">
                      Thank you, <strong>{formData.name}</strong>. Choose your preferred channel to transmit your inquiry directly to our Unnao dispensary team:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
                    <button
                      onClick={handleSendFormViaWhatsApp}
                      className="p-3.5 btn-bronze rounded-sm text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send via WhatsApp</span>
                    </button>
                    <button
                      onClick={handleSendFormViaEmail}
                      className="p-3.5 btn-espresso rounded-sm text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send via Email</span>
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#F5EFE5] rounded-sm border border-[#35251F]/10 text-[11px] text-[#35251F]/75 max-w-md mx-auto text-left flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#A7835E] shrink-0 mt-0.5" />
                    <span>
                      Direct Transmission Policy: To guarantee confidentiality and zero message delays, customer inquiries are relayed directly through WhatsApp (+91 {BRAND_SUPPORT_PHONE}) or official email. Persistent database message archiving requires a dedicated approved database schema.
                    </span>
                  </div>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs text-[#35251F]/70 hover:text-[#35251F] underline cursor-pointer"
                  >
                    Edit Message Details
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
