import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';
import { BRAND_NAME, BRAND_ESTABLISHED } from '../../data/products';

interface CinematicLoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number; // in milliseconds
}

export default function CinematicLoadingScreen({ onComplete, minDuration = 1400 }: CinematicLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsFinished(true);
      if (onComplete) onComplete();
      return;
    }

    const intervalTime = 20;
    const step = 100 / (minDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFinished(true);
            if (onComplete) onComplete();
          }, 250);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="deepali-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#35251F] text-[#FBF8F2] select-none overflow-hidden px-4"
          aria-label="Loading Deepali Ayurveda"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#A7835E]/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-md w-full text-center space-y-6">
            
            {/* Top Ornamental Brand Emblem */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#A7835E] shadow-2xl p-0.5 bg-[#2A1D17]"
            >
              <img
                src="/images/logo/deepali-ayurveda-logo-circle.png"
                alt="Deepali Ayurveda Official Seal"
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>

            {/* Drawing Bronze Line */}
            <div className="w-32 h-[1px] mx-auto bg-[#49352B] overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
                className="h-full bg-gradient-to-r from-[#A7835E] via-[#D8C3A5] to-[#A7835E]"
              />
            </div>

            {/* Brand Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-1.5"
            >
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#D8C3A5] font-bold block">
                Pure Shastriya Herbology
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FBF8F2]">
                DEEPALI AYURVEDA
              </h1>
            </motion.div>

            {/* Tagline Staggered Reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="space-y-1"
            >
              <p className="text-xs sm:text-sm font-serif italic text-[#D8C3A5]/90">
                "A tradition of Ayurveda since {BRAND_ESTABLISHED}."
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#F5EFE5]/50 font-light">
                Unnao, Uttar Pradesh • Sacred Ganga Region
              </p>
            </motion.div>

            {/* Subtle Linear Progress Meter */}
            <div className="pt-4 max-w-xs mx-auto space-y-2">
              <div className="w-full bg-[#29231F] h-1 rounded-full overflow-hidden border border-[#A7835E]/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#A7835E] to-[#D8C3A5] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#D8C3A5]/60 font-mono">
                <span>PREPARING APOTHECARY</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
