import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { PRODUCT_SLUG_MAP } from '../lib/orders';
import { formatPrice } from '../lib/format';

const QUESTIONS = [
  {
    id: 'energy_nerves',
    question: 'How do your daily vitality, nervous system, and habits feel?',
    options: [
      { text: 'Frequent mental fatigue, peripheral tingling/numbness, afternoon exhaustion', target: 'vitamin-b12-d3-k2-calcium' },
      { text: 'Persistent alcohol craving urges, liver fatigue, withdrawal restlessness', target: 'daaru-mukti-powder' },
      { text: 'Sluggish metabolic rate, heavy snacking urges, afternoon energy slumps', target: 'apple-cider-vinegar-moringa' },
      { text: 'High work burnout, physical depletion, slow cellular recovery', target: 'sea-buckthorn-extract-capsules' },
    ]
  },
  {
    id: 'gut_stomach',
    question: 'How does your digestive tract behave after meals?',
    options: [
      { text: 'Chronic gas, post-meal bloating, acidity, or irregular morning elimination', target: 'digest-guru-churan' },
      { text: 'Frequent overeating, frequent hunger between scheduled meals', target: 'apple-cider-vinegar-moringa' },
      { text: 'Normal digestion, but systemic oxidative fatigue, low immunity', target: 'sea-buckthorn-extract-capsules' },
    ]
  },
  {
    id: 'skin_aging',
    question: 'What are your primary physiological wellness objectives?',
    options: [
      { text: 'Dry skin, dry eyes, loss of tissue hydration, high oxidative stress', target: 'sea-buckthorn-extract-capsules' },
      { text: 'Joint stiffness, bone ache, low sunlight exposure (indoor desk work)', target: 'vitamin-b12-d3-k2-calcium' },
      { text: 'Alcohol habit de-addiction and deep liver cell detoxification', target: 'daaru-mukti-powder' },
    ]
  }
];

interface DoshaQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DoshaQuizModal({ isOpen, onClose }: DoshaQuizModalProps) {
  const { products } = useProducts();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectOption = (targetProductId: string) => {
    const updated = { ...answers, [QUESTIONS[currentStep].id]: targetProductId };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const productIds = Object.values(updated);
      const uniqueIds = [...new Set(productIds)];
      const recommendedProducts = products.filter((p) => {
        return uniqueIds.some((targetId) => {
          const canonical = PRODUCT_SLUG_MAP[targetId] || targetId;
          return p.slug === canonical || p.id === targetId || p.slug === targetId;
        });
      });

      setResult({
        title: 'Diagnostic Profile Complete',
        description: 'Based on your reported physiological signals, our clinical herbology criteria indicates these targeted classical formulations:',
        recommendations: recommendedProducts.length > 0 ? recommendedProducts : products.slice(0, 2)
      });
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const handleViewProduct = (prod: any) => {
    onClose();
    const targetSlug = prod.slug || prod.id;
    navigate(`/product/${targetSlug}`);
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
        className="relative bg-[#FBF8F2] rounded-sm max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[#A7835E]/40 z-10 overflow-hidden space-y-6 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#35251F]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#35251F] text-[#D8C3A5] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#A7835E]" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#35251F]">Dosha & Wellness Diagnosis</h3>
              <p className="text-[11px] text-[#A7835E] uppercase tracking-wider font-bold">Root-Cause Classical Guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#35251F]/60 hover:text-[#35251F] hover:bg-[#F5EFE5] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <div className="space-y-6">
            {/* Step Counter */}
            <div className="flex items-center justify-between text-xs text-[#35251F]/70 font-semibold border-b border-[#35251F]/10 pb-3">
              <span className="uppercase tracking-widest text-[#A7835E] font-bold">
                Step {currentStep + 1} of {QUESTIONS.length}
              </span>
              <span>Select the option best matching your condition</span>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#35251F] leading-snug">
                {QUESTIONS[currentStep].question}
              </h4>

              <div className="space-y-3">
                {QUESTIONS[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt.target)}
                    className="w-full text-left p-4 rounded-sm border border-[#35251F]/20 hover:border-[#35251F] hover:bg-[#F5EFE5] bg-white transition flex items-center justify-between group cursor-pointer card-luxury"
                  >
                    <span className="text-xs sm:text-sm text-[#35251F] font-medium leading-relaxed pr-4">
                      {opt.text}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#35251F]/30 group-hover:text-[#35251F] group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-14 h-14 rounded-full bg-[#F5EFE5] text-[#35251F] border border-[#A7835E]/40 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-[#A7835E]" />
              </div>
              <h4 className="font-serif-luxury text-2xl font-bold text-[#35251F]">
                {result.title}
              </h4>
              <p className="text-xs text-[#35251F]/80 leading-relaxed max-w-md mx-auto font-light">
                {result.description}
              </p>
            </div>

            {/* Recommended Products */}
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#A7835E] block">
                Targeted Ayurvedic Formulations:
              </span>
              <div className="space-y-3">
                {result.recommendations.map((prod: any) => (
                  <div
                    key={prod.id}
                    className="p-4 bg-white rounded-sm border border-[#35251F]/15 flex items-center justify-between gap-4 card-luxury"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded-sm border border-[#35251F]/15 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif-luxury text-sm font-bold text-[#35251F] truncate">
                        {prod.name}
                      </h5>
                      <span className="text-[11px] text-[#A7835E] font-medium block">
                        {prod.id === 'daaru-mukti-powder' ? '1 Month Supply' : prod.volume}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-[#35251F]">
                          {formatPrice(prod.price)}
                        </span>
                        {prod.originalPrice && (
                          <span className="text-[10px] text-gray-500 line-through">
                            {formatPrice(prod.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewProduct(prod)}
                      className="btn-bronze px-4 py-2 text-[11px] uppercase tracking-wider font-bold rounded-sm shrink-0 cursor-pointer shadow-premium"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#35251F]/10">
              <button
                onClick={handleReset}
                className="text-xs text-[#35251F] hover:underline inline-flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Diagnostic Assessment</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 btn-espresso rounded-sm text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
