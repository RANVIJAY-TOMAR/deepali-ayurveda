import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, PhoneCall, CheckCircle, ShieldCheck, Clock, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { BRAND_NAME, BRAND_SUPPORT_PHONE, VAIDYA_CONSULTATION_FEE } from '../data/products';
import { bookVaidyaConsultation } from '../lib/consultations';

interface DoctorConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DoctorConsultModal({ isOpen, onClose }: DoctorConsultModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    concern: '',
    preferredTime: 'Morning (10:00 AM - 1:00 PM IST)'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await bookVaidyaConsultation(formData);

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to register consultation appointment.');
      return;
    }

    setBookingReference(result.bookingId || null);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setErrorMessage(null);
    setBookingReference(null);
    setFormData({
      name: '',
      phone: '',
      concern: '',
      preferredTime: 'Morning (10:00 AM - 1:00 PM IST)'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 text-[#35251F]">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#35251F]/70 backdrop-blur-xs"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-[#FBF8F2] rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#A7835E]/40 z-10 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#35251F]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#35251F] text-[#D8C3A5] flex items-center justify-center shadow-xs">
              <PhoneCall className="w-5 h-5 text-[#A7835E]" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#35251F]">Talk to a Vaidya</h3>
              <p className="text-[11px] text-[#A7835E] uppercase tracking-wider font-bold">
                Personal consultation over a call • Fee: ₹{VAIDYA_CONSULTATION_FEE}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-sm text-[#35251F]/60 hover:text-[#35251F] hover:bg-[#F5EFE5] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/30 text-xs text-[#35251F] space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span>Personal consultation over a call</span>
                <span className="text-[#A7835E] font-serif-luxury text-sm">Consultation Fee: ₹{VAIDYA_CONSULTATION_FEE}</span>
              </div>
              <p className="text-[11px] text-[#35251F]/70 font-light">
                Speak directly with an experienced Ayurvedic Vaidya from Deepali Ayurveda regarding classical remedies, dosage schedules, or dietary compatibility.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-sm text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1.5">
                Customer Name *
              </label>
              <input
                required
                type="text"
                minLength={2}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Anand Kumar"
                className="w-full px-4 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-white focus:outline-none focus:border-[#A7835E]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1.5">
                Phone Number *
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9140086856"
                className="w-full px-4 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-white focus:outline-none focus:border-[#A7835E]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1.5">
                Preferred Consultation Time *
              </label>
              <select
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-white focus:outline-none focus:border-[#A7835E]"
              >
                <option>Morning (10:00 AM - 1:00 PM IST)</option>
                <option>Afternoon (2:00 PM - 5:00 PM IST)</option>
                <option>Evening (5:00 PM - 8:00 PM IST)</option>
                <option>Immediate / Next Available Vaidya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1.5">
                Health Concern / Inquiry (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.concern}
                onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                placeholder="Briefly state your concern (e.g. alcohol recovery, digestion, vitamin deficiency)..."
                className="w-full px-4 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-white focus:outline-none focus:border-[#A7835E]"
              />
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 btn-bronze text-xs uppercase tracking-widest font-bold rounded-sm shadow-premium cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>REGISTERING BOOKING...</span>
                  </>
                ) : (
                  <span>BOOK A CONSULTATION (₹{VAIDYA_CONSULTATION_FEE})</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#35251F]/70 font-medium">
                <Lock className="w-3.5 h-3.5 text-[#A7835E]" />
                <span>100% Confidential • Direct call from our consultation team</span>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F5EFE5] text-[#35251F] border border-[#A7835E]/40 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8 text-[#A7835E]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif-luxury text-2xl font-bold text-[#35251F]">Booking Request Received</h4>
              <p className="text-xs text-[#35251F]/80 leading-relaxed max-w-sm mx-auto font-light">
                Thank you, <strong>{formData.name}</strong>. Your consultation booking has been registered with our Unnao dispensary team. Our coordinator will connect at <strong>{formData.phone}</strong> during {formData.preferredTime}.
              </p>
            </div>
            <div className="p-4 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/30 text-xs text-[#35251F] font-medium max-w-sm mx-auto space-y-1">
              <div>Consultation Fee: ₹{VAIDYA_CONSULTATION_FEE} • Direct Helpline: <strong>{BRAND_SUPPORT_PHONE}</strong></div>
              {bookingReference && (
                <div className="text-[11px] font-mono text-[#35251F]/60">Booking ID: {bookingReference}</div>
              )}
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 btn-espresso rounded-sm text-xs uppercase tracking-widest font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
