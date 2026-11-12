import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, Heart, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PhilosophySection() {
  const steps = [
    {
      step: "Phase 01",
      title: "Shodhan (Deep Detox)",
      desc: "Cleansing deep metabolic toxins (Ama) from tissues and digestive tracts to unblock cellular absorption channels.",
      herb: "Bhumi Amla & Triphala"
    },
    {
      step: "Phase 02",
      title: "Doshashaman (Equilibrium)",
      desc: "Balancing aggravated Vata, Pitta, and Kapha to extinguish internal inflammation and restore nervous calm.",
      herb: "Vidarikand & Brahmi"
    },
    {
      step: "Phase 03",
      title: "Dhatuposhan (Cell Nourishment)",
      desc: "Flooding vital tissues with bio-available plant vitamins, calcium, and Omega 7 for deep musculoskeletal regeneration.",
      herb: "Plant B12 & Sea Buckthorn"
    },
    {
      step: "Phase 04",
      title: "Rasayana (Longevity & Vitality)",
      desc: "Building Ojas (vital physical and mental immunity) to protect the body against future stress and burnout.",
      herb: "Ashwagandha & Shilajit"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
          The Classical Science of Healing
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-ayur-950">
          Our Four-Phase Ayurvedic Philosophy
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Ayurveda does not believe in superficial symptom masking. True healing follows the sacred Shastriya sequence: eliminating toxins, balancing bio-energies, deeply feeding tissues, and fortifying cellular immunity.
        </p>
      </div>

      {/* 4 Steps Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="p-6 bg-white rounded-3xl border border-surface-border hover:border-brand-gold/60 shadow-subtle hover:shadow-lift transition-all duration-300 flex flex-col justify-between group card-hover-lift"
          >
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-brand-gold font-mono tracking-wider">
                {item.step}
              </span>
              <h3 className="text-lg font-bold font-serif-luxury text-ayur-950 group-hover:text-emerald-800 transition">
                {item.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-surface-border flex items-center justify-between text-xs">
              <span className="text-[10px] text-gray-400">Classical Botanicals:</span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                {item.herb}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Philosophy Highlight Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-emerald via-brand-forest to-brand-emerald text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lift border border-brand-gold/30">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
            The Botanical Oath
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury">
            "Nothing Isolated. Nothing Artificial. Nothing Unsubstantiated."
          </h3>
          <p className="text-xs text-emerald-100 max-w-xl">
            We preserve nature's whole complex matrix so your body easily recognizes, absorbs, and thrives on each active botanical constituent.
          </p>
        </div>
        <Link
          to="/about"
          className="px-6 py-3.5 bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-gold hover:opacity-95 text-brand-charcoal font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-lift transition flex items-center gap-2 btn-press shrink-0"
        >
          <span>Read Our Full Story</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </section>
  );
}
