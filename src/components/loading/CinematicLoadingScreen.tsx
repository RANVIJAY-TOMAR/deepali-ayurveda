import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { BRAND_NAME, BRAND_ESTABLISHED } from '../../data/products';

interface CinematicLoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number; // in milliseconds
}

const APOTHECARY_PHASES = [
  { threshold: 0, text: "Connecting to Unnao Dispensary..." },
  { threshold: 25, text: "Harvesting High-Altitude Himalayan Botanicals..." },
  { threshold: 55, text: "Compounding 99% Pure Sea Buckthorn Pulp..." },
  { threshold: 82, text: "Verifying Batch Purity & Zero Preservatives..." },
  { threshold: 96, text: "Welcome to Deepali Ayurveda..." },
];

export default function CinematicLoadingScreen({
  onComplete,
  minDuration = 1800
}: CinematicLoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalTime = 25;
    const step = 100 / (minDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 350);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [minDuration, onComplete]);

  const currentPhase = [...APOTHECARY_PHASES]
    .reverse()
    .find((phase) => progress >= phase.threshold)?.text || APOTHECARY_PHASES[0].text;

  return (
    <motion.div
      key="deepali-cinematic-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#29231F] text-[#FBF8F2] select-none overflow-hidden px-4"
      aria-label="Loading Deepali Ayurveda Apothecary"
    >
      {/* Warm Ambient Gold and Mocha Atmospheric Halos */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#A7835E]/15 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        
        {/* Official Brand Emblem with Glowing Golden Ring */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          {/* Outer Breathing Radial Ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-2 border-[#A7835E]/60 blur-[2px]"
          />

          {/* Golden Rotating Accent Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-full border border-dashed border-[#D8C3A5]/40"
          />

          {/* Central Logo Disk */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full h-full rounded-full overflow-hidden border-2 border-[#A7835E] shadow-2xl p-1 bg-[#241A16]"
          >
            <img
              src="/images/logo/deepali-ayurveda-logo-circle.png"
              alt="Deepali Ayurveda Official Crest"
              className="w-full h-full object-cover rounded-full drop-shadow-md"
            />
          </motion.div>
        </div>

        {/* Brand Identity Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="space-y-1.5"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35251F] border border-[#A7835E]/40 text-[10px] uppercase tracking-[0.25em] text-[#D8C3A5] font-bold">
            <Sparkles className="w-3 h-3 text-[#A7835E]" />
            <span>Classical Shastriya Apothecary</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FBF8F2] pt-1">
            {BRAND_NAME}
          </h1>

          <p className="text-xs sm:text-sm font-serif italic text-[#D8C3A5]/90 pt-0.5">
            Tradition of Ayurveda. Trust Through Generations.
          </p>
          <p className="text-[10px] uppercase tracking-widest text-[#F5EFE5]/50 font-light">
            Est. {BRAND_ESTABLISHED} • Unnao, Uttar Pradesh (River Ganga)
          </p>
        </motion.div>

        {/* Animated Progress Meter & Status Updates */}
        <div className="pt-3 max-w-xs mx-auto space-y-2.5">
          {/* Sleek Progress Track */}
          <div className="w-full bg-[#1F1916] h-1.5 rounded-full overflow-hidden border border-[#A7835E]/30 p-[1px]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#A7835E] via-[#D8C3A5] to-[#EBD9BE] rounded-full shadow-[0_0_12px_rgba(216,195,165,0.7)]"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          {/* Dynamic Percentage & Phase Message */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-mono font-medium text-[#D8C3A5]">
              <span className="text-[10px] uppercase tracking-wider text-[#D8C3A5]/70">
                Himalayan Sea Buckthorn 99% Pulp
              </span>
              <span className="font-bold text-[#FBF8F2]">{Math.round(progress)}%</span>
            </div>

            <p className="text-[11px] text-[#F5EFE5]/80 font-light truncate transition-all duration-300">
              {currentPhase}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
