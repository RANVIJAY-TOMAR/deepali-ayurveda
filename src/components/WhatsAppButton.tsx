import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { BRAND_WHATSAPP_NUMBER, BRAND_NAME } from '../data/products';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const quickInquiries = [
    {
      title: "Enquire about Daaru Mukti Powder",
      desc: "1 Month Supply & plain box packaging questions",
      text: "Hello Deepali Ayurveda, I would like to enquire about Daaru Mukti Powder (1 Month Supply) and discreet plain box packaging."
    },
    {
      title: "Ayurvedic Formulation Guidance",
      desc: "Consult regarding specific symptoms or herbal choice",
      text: "Hello Deepali Ayurveda, I need herbal guidance regarding my health symptoms. Could you please advise?"
    },
    {
      title: "Order & Dispatch Assistance",
      desc: "Track dispatch from Unnao pharmacy or payment query",
      text: "Hello Deepali Ayurveda, I need assistance placing an order on your website."
    },
    {
      title: "Talk to a Vaidya (₹200)",
      desc: "Book personal consultation over a call",
      text: "Hello Deepali Ayurveda, I would like to book a personal Vaidya call consultation (₹200)."
    }
  ];

  const handleSendWhatsApp = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    const url = `https://wa.me/${BRAND_WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="WhatsApp Ayurvedic Customer Assistance"
          className="flex items-center gap-2.5 px-4 py-2.5 bg-[#35251F] hover:bg-[#49352B] text-[#FBF8F2] rounded-full shadow-premium border border-[#A7835E]/40 transition-all duration-300 cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-full bg-[#25D366]/20 flex items-center justify-center">
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          </div>
          <span className="hidden sm:inline text-xs uppercase tracking-wider font-bold text-[#FBF8F2]">
            Dispensary Chat
          </span>
        </button>
      </div>

      {/* Floating Popup Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-80 sm:w-96 bg-white rounded-sm border border-[#35251F]/15 shadow-2xl overflow-hidden text-[#35251F] animate-fade-in text-left">
          
          {/* Header */}
          <div className="bg-[#35251F] p-4 text-[#FBF8F2] flex items-center justify-between border-b border-[#A7835E]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm font-bold text-[#FBF8F2]">{BRAND_NAME}</h4>
                <p className="text-[10px] text-[#D8C3A5]">Unnao Pharmacy • Active Now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#D8C3A5] hover:text-white transition p-1 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body: Select an inquiry */}
          <div className="p-4 space-y-2 bg-[#FBF8F2] max-h-80 overflow-y-auto">
            <p className="text-xs text-[#35251F]/70 font-light mb-2">
              Select an inquiry topic to chat with our dispensary:
            </p>

            {quickInquiries.map((inq, idx) => (
              <button
                key={idx}
                onClick={() => handleSendWhatsApp(inq.text)}
                className="w-full text-left p-3 rounded-sm bg-white hover:bg-[#F5EFE5] border border-[#35251F]/10 transition group cursor-pointer space-y-0.5 card-luxury"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#35251F] group-hover:text-[#A7835E]">
                    {inq.title}
                  </span>
                  <Send className="w-3 h-3 text-[#35251F]/30 group-hover:text-[#A7835E] transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[11px] text-[#35251F]/60 font-light leading-snug">
                  {inq.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-white border-t border-[#35251F]/10 text-center text-[10px] text-[#35251F]/60 font-light">
            100% Confidential • Direct link opens in WhatsApp
          </div>

        </div>
      )}
    </>
  );
}
