import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Lock, 
  ShieldCheck, 
  Award, 
  Leaf, 
  Sparkles,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MapPin,
  Mail,
  PhoneCall
} from 'lucide-react';
import { 
  CATEGORY_DETAILS, 
  VERIFIED_TESTIMONIALS,
  BRAND_NAME,
  BRAND_ESTABLISHED,
  BRAND_LOCATION,
  BRAND_SUPPORT_PHONE,
  BRAND_SUPPORT_PHONE_DISPLAY,
  BRAND_SUPPORT_EMAIL,
  BRAND_WHATSAPP_NUMBER,
  BRAND_ADDRESS,
  BRAND_STORYLINE_GANGA,
  BRAND_STORYLINE_HERITAGE,
  VAIDYA_CONSULTATION_FEE
} from '../data/products';
import { useProducts } from '../hooks/useProducts';
import CinematicHero from '../components/hero/CinematicHero';
import ProductCard from '../components/products/ProductCard';
import ProductCardSkeleton from '../components/products/ProductCardSkeleton';
import TalkToVaidyaSection from '../components/sections/TalkToVaidyaSection';
import { formatPrice } from '../lib/format';

interface HomePageProps {
  onOpenQuiz?: () => void;
  onOpenConsult?: () => void;
}

export default function HomePage({ onOpenQuiz, onOpenConsult }: HomePageProps) {
  const { products, loading } = useProducts();

  // Flagship formulations for top showcase: Daaru Mukti (1 Month Supply), Plant B12, Digest Guru
  const flagshipSlugs = ['daaru-mukti-powder', 'b12', 'digest-guru'];
  const flagshipRemedies = products.filter((p) => 
    flagshipSlugs.includes(p.slug || '') ||
    ['daaru-mukti-powder', 'vitamin-b12-d3-k2-calcium', 'digest-guru-churan'].includes(p.id)
  );

  const daaruMuktiProduct = products.find(
    (p) => p.slug === 'daaru-mukti-powder' || p.id === 'daaru-mukti-powder'
  );

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent(`Hello Deepali Ayurveda, I would like consultation regarding your classical remedies.`);
    window.open(`https://wa.me/${BRAND_WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#FBF8F2] text-[#35251F] space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <CinematicHero />

      {/* 2. FEATURED AYURVEDIC PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#35251F]/15 pb-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A7835E] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Classical Formulations • Unnao Apothecary</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#35251F] tracking-tight leading-tight">
              Featured Ayurvedic Remedies
            </h2>
            <p className="text-sm sm:text-base text-[#35251F]/80 font-light max-w-xl">
              Time-tested Shastriya recipes prepared in small batches using whole-plant extracts for physiological bio-availability.
            </p>
          </div>

          <Link
            to="/shop"
            className="btn-espresso px-6 py-3.5 rounded-sm text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2 group shrink-0"
          >
            <span>VIEW ALL 5 PRODUCTS</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#D8C3A5]" />
          </Link>
        </div>

        {/* 3 Impressive Flagship Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <ProductCardSkeleton count={3} />
          ) : (
            flagshipRemedies.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))
          )}
        </div>
      </section>

      {/* 3. DEDICATED SPOTLIGHT: DAARU MUKTI POWDER (1 MONTH SUPPLY - ₹1,100) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-sm bg-gradient-to-br from-[#29231F] via-[#35251F] to-[#49352B] text-[#FBF8F2] p-8 sm:p-14 border-2 border-[#A7835E]/50 shadow-lift"
        >
          {/* Subtle Ambient Radial Bronze Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#A7835E]/15 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#49352B] text-[#D8C3A5] border border-[#A7835E]/40 text-xs font-bold uppercase tracking-widest">
                <Lock className="w-3.5 h-3.5 text-[#A7835E]" />
                <span>100% Plain Box Discreet Packaging Guaranteed</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#FBF8F2] leading-tight">
                    Daaru Mukti Powder
                  </h2>
                  <span className="px-3 py-1 bg-[#A7835E] text-[#FBF8F2] text-xs uppercase tracking-widest font-bold rounded-xs">
                    30 Daily Sachets
                  </span>
                </div>
                <span className="text-[#D8C3A5] text-lg sm:text-xl font-hindi-luxury font-medium block">
                  दारू मुक्ति चूर्ण • घर बैठे शराब की लत से प्राकृतिक मुक्ति
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#F5EFE5]/85 leading-relaxed font-light max-w-2xl">
                Classical de-addiction preparation combining <strong>Vidarikand (Kudzu Root)</strong> to curb neurological dopamine-triggered craving impulses with <strong>Bhumi Amla</strong> to flush toxic acetaldehyde and restore healthy liver parenchymal cells. Complete <strong>1 Month Supply containing 30 daily sachets (1 sachet each day for 30 days)</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-xs">
                <div className="p-3.5 rounded-sm bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#A7835E] shrink-0" />
                  <span className="font-medium text-[#FAF8F3]">30 Daily Sachets (1/day)</span>
                </div>
                <div className="p-3.5 rounded-sm bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#A7835E] shrink-0" />
                  <span className="font-medium text-[#FAF8F3]">Easily mixed in daily food/dal</span>
                </div>
                <div className="p-3.5 rounded-sm bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#A7835E] shrink-0" />
                  <span className="font-medium text-[#FAF8F3]">Visible change in 15–21 days</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/product/daaru-mukti-powder"
                  className="btn-bronze px-8 py-4 rounded-sm text-xs uppercase tracking-widest font-bold flex items-center gap-2.5 shadow-premium"
                >
                  <span>ORDER 1 MONTH SUPPLY (₹1,100)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {onOpenConsult && (
                  <button
                    onClick={onOpenConsult}
                    className="px-6 py-4 rounded-sm text-xs uppercase tracking-widest font-bold text-[#FBF8F2] bg-[#49352B] hover:bg-[#5C4336] border border-[#A7835E]/60 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>TALK TO A VAIDYA (₹{VAIDYA_CONSULTATION_FEE})</span>
                    <Phone className="w-3.5 h-3.5 text-[#D8C3A5]" />
                  </button>
                )}
              </div>

            </div>

            {/* Right Side Visual Thumbnail */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative bg-[#49352B] p-5 rounded-sm border border-[#A7835E]/40 text-center space-y-4 max-w-sm w-full shadow-premium">
                <div className="aspect-square rounded-sm overflow-hidden bg-[#241A16] flex items-center justify-center p-4">
                  <img
                    src="/images/products/daaru-mukti-powder.png?v=20261113"
                    alt="Daaru Mukti 30 Daily Sachets (1 Month Supply)"
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-[#D8C3A5] font-bold block">
                    1 Month Supply (30 Sachets)
                  </span>
                  <span className="text-3xl font-bold font-serif-luxury text-[#FBF8F2] block">
                    {formatPrice(daaruMuktiProduct?.price ?? 1100)}
                  </span>
                  <span className="text-xs text-[#D8C3A5]/60 line-through">₹1,599</span>
                </div>
                <Link
                  to="/product/daaru-mukti-powder"
                  className="block w-full py-2.5 text-xs uppercase tracking-wider font-bold text-[#D8C3A5] hover:text-[#FBF8F2] border-t border-white/10 pt-3"
                >
                  View 30-Day Sachets & Dosage Guide →
                </Link>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 4. PRODUCT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-[#35251F]/15 pb-6 text-left">
          <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block mb-1">
            Therapeutic Departments
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#35251F] tracking-tight">
            Browse by Product Category
          </h2>
          <p className="text-sm sm:text-base text-[#35251F]/80 font-light mt-2 max-w-xl">
            Targeted herbal categories formulated to restore gut balance, nourish cellular vitamins, and clear systemic impurities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {CATEGORY_DETAILS.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                to={`/categories/${cat.id}`}
                className="group bg-white border border-[#35251F]/15 rounded-sm overflow-hidden flex flex-col justify-between card-luxury block h-full hover:border-[#A7835E]"
              >
                <div className="aspect-[4/3] bg-[#FAF6EE] overflow-hidden img-zoom-container flex items-center justify-center p-6 group-hover:bg-[#F2ECE1] transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-sm"
                  />
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#A7835E] font-bold">
                      {cat.productCount} {cat.productCount === 1 ? 'Formulation' : 'Formulations'}
                    </span>
                    <h3 className="font-serif-luxury text-xl font-bold text-[#35251F] group-hover:text-[#A7835E] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#35251F]/75 leading-relaxed font-light line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[#35251F] group-hover:text-[#A7835E] inline-flex items-center gap-1.5 pt-2 border-t border-[#35251F]/10">
                    <span>Explore Products</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. COMPLETE STOREFRONT OF ALL 5 PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#35251F]/15 pb-6">
          <div className="space-y-1 text-left">
            <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block mb-1">
              Complete Storefront
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#35251F] tracking-tight">
              All Classical Formulations
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest font-bold text-[#35251F] hover:text-[#A7835E] transition inline-flex items-center gap-2"
          >
            <span>Search & Filter Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <ProductCardSkeleton count={5} />
          ) : (
            products.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))
          )}
        </div>
      </section>

      {/* 6. OUR HERITAGE & ROOTS IN UNNAO ON RIVER GANGA (EST. 1997) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5EFE5] border border-[#35251F]/15 rounded-sm p-8 sm:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-xs uppercase tracking-widest text-[#35251F] font-bold block">
                Living Tradition • Established {BRAND_ESTABLISHED} • {BRAND_LOCATION}
              </span>

              <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#35251F] leading-tight">
                Tradition of Ayurveda. <br />
                <span className="text-[#A7835E] italic font-serif">Trust Through Generations.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#35251F]/85 leading-relaxed font-light">
                "{BRAND_STORYLINE_HERITAGE}" Founded in 1997 in Unnao, Uttar Pradesh along the sacred River Ganga, <strong>{BRAND_NAME}</strong> adheres strictly to classical Shastriya texts (Charaka and Sushruta Samhita). While commercial brands dilute remedies with synthetic isolates, we remain steadfast in low-heat Kwath boiling and pure whole-plant compounding.
              </p>

              {/* 3 Numerical Fact Counters */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-white rounded-sm border border-[#35251F]/10">
                  <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#35251F] block">29+</span>
                  <span className="text-[11px] text-[#35251F]/70 font-semibold uppercase tracking-wider">Years Unbroken</span>
                </div>
                <div className="p-4 bg-white rounded-sm border border-[#35251F]/10">
                  <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#35251F] block">100%</span>
                  <span className="text-[11px] text-[#35251F]/70 font-semibold uppercase tracking-wider">Classical Kwath</span>
                </div>
                <div className="p-4 bg-white rounded-sm border border-[#35251F]/10">
                  <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#35251F] block">0%</span>
                  <span className="text-[11px] text-[#35251F]/70 font-semibold uppercase tracking-wider">Synthetic Isolates</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/heritage"
                  className="btn-espresso px-7 py-3.5 rounded-sm text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2"
                >
                  <span>EXPLORE OUR HERITAGE TIMELINE</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D8C3A5]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-sm overflow-hidden border-2 border-[#A7835E]/40 aspect-[4/5] shadow-premium img-zoom-container">
                <img
                  src="https://images.unsplash.com/photo-1706186829065-ede677efe384?auto=format&fit=crop&w=1000&q=80"
                  alt="Sacred River Ganga Ghats in Uttar Pradesh - Deepali Ayurveda Heritage"
                  className="w-full h-full object-cover"
                />

                {/* Floating Official Seal Medallion */}
                <div className="absolute top-5 right-5 w-20 h-20 rounded-full overflow-hidden border-2 border-[#A7835E] shadow-2xl bg-[#2A1D17] p-0.5 pointer-events-none">
                  <img
                    src="/images/logo/deepali-ayurveda-logo-circle.png"
                    alt="Official Deepali Ayurveda Seal"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#35251F]/90 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#D8C3A5] font-bold">
                    Unnao, Uttar Pradesh Heritage • Est. {BRAND_ESTABLISHED}
                  </span>
                  <p className="text-xs text-[#FBF8F2] font-hindi-luxury mt-1">
                    गंगा तीरे निर्मित प्रामाणिक आयुर्वेदिक योग
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. TALK TO A VAIDYA — ₹200 PER CALL (DEDICATED SECTION) */}
      <TalkToVaidyaSection onOpenModal={onOpenConsult} />

      {/* 8. VERIFIED CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-[#35251F]/15 pb-6 text-left">
          <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block mb-1">
            Real Client Experiences
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#35251F] tracking-tight">
            Words from Those We Serve
          </h2>
          <p className="text-sm text-[#35251F]/75 font-light mt-1">
            Verified feedback from patrons across India who rely on our classical remedies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VERIFIED_TESTIMONIALS.slice(0, 2).map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-white border border-[#35251F]/15 p-8 rounded-sm space-y-5 text-left flex flex-col justify-between card-luxury"
            >
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#35251F] font-bold bg-[#F5EFE5] px-3 py-1 rounded-xs inline-block border border-[#D8C3A5]">
                  Remedy: {t.productName}
                </span>
                <p className="text-sm sm:text-base text-[#35251F]/90 leading-relaxed font-light italic">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#35251F]/10 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-sm font-bold text-[#35251F] block font-serif-luxury">{t.name}</strong>
                  <span className="text-[#35251F]/60">{t.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#A7835E] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#A7835E]" />
                  <span>Verified Buyer</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. CONTACT AND CUSTOMER ASSISTANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#49352B] text-white p-8 sm:p-14 rounded-sm border border-[#A7835E]/40 shadow-lift">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-8 space-y-4 text-left">
              <span className="text-xs uppercase tracking-widest text-[#D8C3A5] font-bold block">
                Direct Apothecary Assistance • Unnao, Uttar Pradesh
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-white">
                Have Inquiries Regarding Dosages or Plain Box Delivery?
              </h2>
              <p className="text-xs sm:text-sm text-[#F5EFE5]/80 leading-relaxed font-light max-w-xl">
                Our qualified Ayurvedic team provides phone and WhatsApp assistance. Every order is shipped in sealed, unbranded plain brown cartons for complete privacy.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#D8C3A5]">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#A7835E]" />
                  <span>Helpline: <a href={`tel:${BRAND_SUPPORT_PHONE}`} className="underline font-bold text-white">{BRAND_SUPPORT_PHONE_DISPLAY}</a></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#A7835E]" />
                  <span>Email: <a href={`mailto:${BRAND_SUPPORT_EMAIL}`} className="underline font-bold text-white">{BRAND_SUPPORT_EMAIL}</a></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#A7835E]" />
                  <span>{BRAND_ADDRESS}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3 justify-center">
              <button
                onClick={handleWhatsAppHelp}
                className="w-full py-4 px-6 btn-bronze text-xs uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-premium"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>

              <Link
                to="/contact"
                className="w-full py-3.5 px-6 bg-white/10 hover:bg-white/15 text-white text-xs uppercase tracking-widest font-semibold rounded-sm border border-white/20 transition text-center"
              >
                <span>Send An Enquiry</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
