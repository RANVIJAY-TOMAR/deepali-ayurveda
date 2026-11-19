import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck, Lock, Truck, PhoneCall } from 'lucide-react';
import { VAIDYA_CONSULTATION_FEE } from '../../data/products';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Discreet Packaging",
    question: "Is the outer packaging 100% secure and tamper-proof?",
    answer: "Yes, absolutely. All parcels are dispatched in sturdy, unbranded, opaque brown cardboard boxes sealed with tamper-evident security tape. The exterior shipping label only indicates your address and our registered sender name 'Deepali Apothecary Logistics'."
  },
  {
    category: "Delivery & Dispatch",
    question: "How quickly are orders dispatched from your Unnao dispensary?",
    answer: "Orders placed before 3:00 PM IST are freshly packed and dispatched the very same day directly from our dispensary in Unnao, Uttar Pradesh. Deliveries to Metro cities take 2 to 3 business days, while Tier-2 and Tier-3 locations take 3 to 5 business days with complete live SMS tracking."
  },
  {
    category: "Payment & Delivery",
    question: "Do you offer Cash on Delivery (COD), and what are the delivery charges?",
    answer: "We do not provide Cash on Delivery (COD). All orders are 100% prepaid via secure online payment (UPI, Debit/Credit Cards, Net Banking) to ensure tamper-proof safety packaging and rapid dispatch from our Unnao dispensary. Delivery is 100% Free (Complimentary) PAN India across all pincodes!"
  },
  {
    category: "Usage & Administration",
    question: "How is Deepali Ayurveda Sea Buckthorn 99% Pure Pulp taken?",
    answer: "Take 20ml to 30ml diluted in equal parts lukewarm water, or consume it directly as an invigorating daily health shot first thing in the morning on an empty stomach. Shake well before each use. A 500 ML bottle serves as your comprehensive daily health shot course."
  },
  {
    category: "Quality Standards & Certifications",
    question: "Why should I trust Deepali Ayurveda? What certifications do you hold?",
    answer: "Deepali Ayurveda is officially MSME Certified, FSSAI Certified, AYUSH Certified, ISO 9001:2015 Certified, and GMP Certified. Furthermore, every production batch of our Himalayan Sea Buckthorn 99% Pure Pulp is independently 100% Lab Tested to guarantee complete absence of Lead, Mercury, Arsenic, microbial pathogens, synthetic fillers, added sugar, or chemical preservatives."
  },
  {
    category: "Replacements & Refunds",
    question: "What is your replacement policy and refund timeline?",
    answer: "We offer a 100% Replacement Guarantee for damaged or wrong items, dispatched within 24 hours of reporting with zero extra charges. If a refund is requested, refunds are processed within 3–5 business days directly back to your original payment method (UPI / Bank Account / Card)."
  },
  {
    category: "Vaidya Consultation",
    question: `How does the 'Talk to a Vaidya' phone consultation work?`,
    answer: `You can schedule a personal consultation over a call with an experienced Ayurvedic Vaidya for ₹${VAIDYA_CONSULTATION_FEE} per call. We discuss your bodily symptoms, evaluate dosage schedules, and recommend appropriate dietary companion foods (Anupana).`
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-left">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className={`rounded-sm border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'bg-white border-[#A7835E]/60 shadow-subtle'
                : 'bg-white/80 hover:bg-white border-[#35251F]/15'
            }`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A7835E] bg-[#F5EFE5] px-2.5 py-1 rounded-xs">
                  {faq.category}
                </span>
                <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#35251F]">
                  {faq.question}
                </h4>
              </div>

              <ChevronDown
                className={`w-5 h-5 text-[#A7835E] transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 text-xs sm:text-sm text-[#35251F]/80 leading-relaxed font-light border-t border-[#35251F]/10 pt-4"
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
