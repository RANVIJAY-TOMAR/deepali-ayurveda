import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Clock,
  Sparkles,
  Heart,
  Share2,
  Check,
  Award,
  AlertTriangle,
  Lock,
  Truck,
  PhoneCall
} from 'lucide-react';
import { BRAND_NAME, VAIDYA_CONSULTATION_FEE } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../lib/format';
import { useProduct, useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import CatalogErrorState from '../components/products/CatalogErrorState';

interface ProductDetailPageProps {
  onOpenConsult?: () => void;
}

export default function ProductDetailPage({ onOpenConsult }: ProductDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { product, loading, error, refetch } = useProduct(id);
  const { products: allProducts } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'symptoms' | 'ingredients' | 'dosage' | 'safety'>('symptoms');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // If stamon gold is requested, redirect to shop
  if (id === 'stamon-gold-capsules') {
    navigate('/shop', { replace: true });
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-[#35251F] animate-pulse">
        <div className="h-4 w-48 bg-[#35251F]/10 rounded-xs" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 aspect-square bg-[#FAF6EE] rounded-sm border border-[#35251F]/10" />
          <div className="lg:col-span-7 space-y-6">
            <div className="h-4 w-32 bg-[#A7835E]/20 rounded-xs" />
            <div className="h-10 w-3/4 bg-[#35251F]/15 rounded-xs" />
            <div className="h-4 w-1/2 bg-[#35251F]/10 rounded-xs" />
            <div className="h-8 w-28 bg-[#35251F]/20 rounded-xs" />
            <div className="h-24 w-full bg-[#35251F]/10 rounded-sm" />
            <div className="h-12 w-full bg-[#35251F]/15 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-6">
        <CatalogErrorState message={error} onRetry={refetch} title="Formulation Data Unavailable" />
        <div>
          <Link
            to="/shop"
            className="btn-espresso inline-block px-8 py-3.5 rounded-sm text-xs uppercase tracking-widest font-semibold"
          >
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F5EFE5] text-[#35251F] flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-[#A7835E]" />
        </div>
        <h2 className="font-serif-luxury text-3xl font-bold text-[#35251F]">Formulation Not Located</h2>
        <p className="text-sm text-[#35251F]/70 font-light">The requested classical formulation does not exist or has been relocated.</p>
        <Link
          to="/shop"
          className="btn-espresso inline-block px-8 py-3.5 rounded-sm text-xs uppercase tracking-widest font-semibold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isDaaruMukti = product.slug === 'daaru-mukti-powder' || product.id === 'daaru-mukti-powder';
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.slug !== product.slug)
    .slice(0, 3);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-[#35251F]">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#35251F]/60 font-medium">
        <Link to="/" className="hover:text-[#A7835E] transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
        <Link to="/shop" className="hover:text-[#A7835E] transition">Formulations</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
        <span className="text-[#35251F] font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Product Visuals */}
        <div className="lg:col-span-6 space-y-5">
          <div className="relative rounded-sm overflow-hidden bg-gradient-to-b from-[#FAF6EE] to-[#EFE8DC] border border-[#35251F]/15 aspect-square shadow-premium group flex items-center justify-center p-8 sm:p-12">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
              {isDaaruMukti ? (
                <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 bg-[#35251F] text-[#FBF8F2] border border-[#A7835E] rounded-xs shadow-xs">
                  ★ 1 Month Supply (30 Sachets)
                </span>
              ) : (
                <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 bg-[#35251F] text-[#FBF8F2] border border-[#A7835E] rounded-xs shadow-xs">
                  {product.tag}
                </span>
              )}
              <span className="text-xs bg-white/95 text-[#35251F] px-3 py-1 font-semibold border border-[#35251F]/15 rounded-xs flex items-center gap-1.5 shadow-xs backdrop-blur-xs">
                <Leaf className="w-3.5 h-3.5 text-[#A7835E]" />
                <span>100% Classical Shastriya</span>
              </span>
            </div>

            {/* Wishlist & Share Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => toggleWishlist(product)}
                className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#35251F] flex items-center justify-center border border-[#35251F]/15 transition shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-[#35251F]/70 hover:text-rose-600'}`} />
              </button>

              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#35251F] flex items-center justify-center border border-[#35251F]/15 transition shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Share formulation link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#A7835E]" /> : <Share2 className="w-4 h-4 text-[#35251F]/70" />}
              </button>
            </div>

            {/* Scientific Highlight Overlay */}
            {product.scientificFact && (
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-sm border border-[#35251F]/15 text-xs shadow-lift space-y-1">
                <span className="font-bold text-[#35251F] block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A7835E]" />
                  <span>Clinical Bio-Mechanism:</span>
                </span>
                <p className="text-[#35251F]/85 text-xs leading-relaxed font-light">{product.scientificFact}</p>
              </div>
            )}
          </div>

          {/* 3 Quality Pillars */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-4 bg-white rounded-sm border border-[#35251F]/15 shadow-xs">
              <Award className="w-5 h-5 text-[#A7835E] mx-auto mb-1.5" />
              <span className="font-bold text-[#35251F] block text-xs">AYUSH Standard</span>
              <span className="text-[11px] text-[#35251F]/65 font-light">Pharma Grade Purity</span>
            </div>
            <div className="p-4 bg-white rounded-sm border border-[#35251F]/15 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#A7835E] mx-auto mb-1.5" />
              <span className="font-bold text-[#35251F] block text-xs">NABL Lab Tested</span>
              <span className="text-[11px] text-[#35251F]/65 font-light">Heavy Metal Free</span>
            </div>
            <div className="p-4 bg-white rounded-sm border border-[#35251F]/15 shadow-xs">
              <Clock className="w-5 h-5 text-[#A7835E] mx-auto mb-1.5" />
              <span className="font-bold text-[#35251F] block text-xs">Fresh Prep Batch</span>
              <span className="text-[11px] text-[#35251F]/65 font-light">{product.shelfLife}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Overview & Action Buttons */}
        <div className="lg:col-span-6 space-y-7 text-left">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs uppercase tracking-widest font-bold text-[#35251F] bg-[#F5EFE5] px-3 py-1 rounded-xs border border-[#D8C3A5]">
                {product.category}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-[#A7835E] font-bold">{product.volume}</span>
              {isDaaruMukti && (
                <span className="text-xs font-bold bg-[#35251F] text-[#FBF8F2] px-2.5 py-0.5 rounded-xs">
                  30 Daily Sachets (1 Sachet/Day)
                </span>
              )}
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#35251F] leading-tight tracking-tight">
              {product.name}
            </h1>
            {product.sanskritName && (
              <p className="text-base text-[#725543] font-hindi-luxury font-medium">
                {product.sanskritName}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-[#A7835E] bg-[#F5EFE5] px-3 py-1 rounded-xs border border-[#A7835E]/30">
                <Star className="w-4 h-4 fill-[#A7835E] text-[#A7835E]" />
                <span className="font-bold text-[#35251F]">{product.rating}</span>
                <span className="text-[#35251F]/60">({product.reviewCount} Verified Reviews)</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-[#A7835E] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Herbal</span>
              </span>
            </div>
          </div>

          {/* Primary Indication Callout */}
          <div className="p-5 bg-[#F5EFE5] rounded-sm border-l-4 border-[#A7835E] space-y-1.5">
            <span className="text-xs uppercase tracking-widest font-bold text-[#35251F] block">
              Primary Healing Indication:
            </span>
            <p className="text-sm text-[#35251F] leading-relaxed font-normal">
              {product.heroBenefit}
            </p>
          </div>

          {/* Pricing & Savings */}
          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#35251F]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-[#35251F]/40 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="text-xs font-bold text-[#A7835E] bg-[#F5EFE5] px-2.5 py-1 rounded-xs border border-[#A7835E]/40 uppercase tracking-wider">
                Save {formatPrice(product.originalPrice - product.price)}
              </span>
            )}
            {product.inStock ? (
              <span className="text-xs text-[#35251F] ml-auto flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#A7835E]" />
                <span>In Stock</span>
              </span>
            ) : (
              <span className="text-xs text-amber-900 ml-auto flex items-center gap-1 font-bold bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Temporarily Out of Stock</span>
              </span>
            )}
          </div>

          {/* Confidential Packaging Reassurance */}
          <div className="p-3.5 bg-white rounded-sm border border-[#35251F]/15 text-xs text-[#35251F]/85 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#A7835E] shrink-0" />
              <span>Prepared & dispatched from Unnao, Uttar Pradesh</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#35251F] bg-[#F5EFE5] px-2 py-0.5 rounded-xs border border-[#35251F]/10">
              Pan-India Express
            </span>
          </div>

          {/* Quantity Selector & Checkout Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-[#35251F] font-bold">Quantity:</span>
              <div className="flex items-center border border-[#35251F]/20 bg-white rounded-sm shadow-xs">
                <button
                  disabled={!product.inStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-[#F5EFE5] text-[#35251F] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-[#35251F]">{quantity}</span>
                <button
                  disabled={!product.inStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-[#F5EFE5] text-[#35251F] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs text-[#35251F]/70 font-light">
                Total: <strong className="text-sm font-bold text-[#35251F]">{formatPrice(product.price * quantity)}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <button
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className={`py-4 px-5 text-xs uppercase tracking-widest font-bold rounded-sm transition flex items-center justify-center gap-2 shadow-xs ${
                  !product.inStock
                    ? 'bg-[#35251F]/10 text-[#35251F]/40 border border-[#35251F]/20 cursor-not-allowed'
                    : 'bg-white hover:bg-[#F5EFE5] text-[#35251F] border-2 border-[#35251F] cursor-pointer'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {!product.inStock
                    ? 'Out of Stock'
                    : addedNotice
                    ? 'Added to Basket ✓'
                    : 'Add to Basket'}
                </span>
              </button>

              <button
                disabled={!product.inStock}
                onClick={handleBuyNow}
                className={`py-4 px-5 text-xs uppercase tracking-widest font-bold rounded-sm transition flex items-center justify-center gap-2 ${
                  !product.inStock
                    ? 'bg-[#35251F]/20 text-[#35251F]/40 cursor-not-allowed'
                    : 'btn-bronze cursor-pointer shadow-premium'
                }`}
              >
                <span>{!product.inStock ? 'Currently Unavailable' : 'Purchase Formulation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Plain Box Guarantee Reassurance */}
            <div className="p-3.5 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#35251F]">
                <Lock className="w-4 h-4 text-[#A7835E] shrink-0" />
                <span className="text-xs font-semibold">100% Plain Box Discreet Packaging Guaranteed</span>
              </div>
              {onOpenConsult && (
                <button
                  onClick={onOpenConsult}
                  className="text-[#35251F] font-bold hover:underline text-xs shrink-0 ml-2 cursor-pointer flex items-center gap-1"
                >
                  <span>Talk to Vaidya (₹{VAIDYA_CONSULTATION_FEE})</span>
                  <PhoneCall className="w-3 h-3 text-[#A7835E]" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* DETAILED TABS: Symptoms, Ingredients, Dosage, Safety */}
      <div className="bg-white rounded-sm border border-[#35251F]/15 shadow-subtle overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#35251F]/15 overflow-x-auto bg-[#F5EFE5] scrollbar-none">
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'symptoms'
                ? 'border-[#35251F] text-[#35251F] bg-white'
                : 'border-transparent text-[#35251F]/60 hover:text-[#35251F]'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-[#A7835E]" />
            <span>Target Symptoms & Indications</span>
          </button>

          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'ingredients'
                ? 'border-[#35251F] text-[#35251F] bg-white'
                : 'border-transparent text-[#35251F]/60 hover:text-[#35251F]'
            }`}
          >
            <Leaf className="w-4 h-4 text-[#A7835E]" />
            <span>Botanical Ingredients & Amounts</span>
          </button>

          <button
            onClick={() => setActiveTab('dosage')}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'dosage'
                ? 'border-[#35251F] text-[#35251F] bg-white'
                : 'border-transparent text-[#35251F]/60 hover:text-[#35251F]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#A7835E]" />
            <span>Usage & Course Protocol</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'safety'
                ? 'border-[#35251F] text-[#35251F] bg-white'
                : 'border-transparent text-[#35251F]/60 hover:text-[#35251F]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#A7835E]" />
            <span>Certifications & Safety Proof</span>
          </button>
        </div>

        {/* Tab 1: Targeted Symptoms & Why You Need It */}
        {activeTab === 'symptoms' && (
          <div className="p-8 sm:p-12 space-y-8 animate-fade-in text-left">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold">
                Clinical Indication Checklist
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#35251F]">
                Recommended If You Experience:
              </h3>
              <p className="text-xs sm:text-sm text-[#35251F]/70 font-light">
                Check if any of these daily bodily signals or chronic imbalances resonate with your condition:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
                {product.symptoms.map((symptom, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#FBF8F2] rounded-sm border border-[#35251F]/10 flex items-start gap-3"
                  >
                    <Check className="w-4 h-4 text-[#A7835E] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-[#35251F] leading-snug">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {product.whyYouNeedIt && product.whyYouNeedIt.length > 0 && (
              <div className="pt-6 border-t border-[#35251F]/10 space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold">
                  Bio-Mechanism Analysis
                </span>
                <h4 className="font-serif-luxury text-xl font-bold text-[#35251F]">
                  Why Standard Options Fail & Why This Works:
                </h4>
                <div className="space-y-3">
                  {product.whyYouNeedIt.map((reason, idx) => (
                    <div key={idx} className="p-4 bg-[#F5EFE5] rounded-sm border border-[#35251F]/10 text-xs sm:text-sm text-[#35251F]/85 leading-relaxed font-light">
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Botanical Ingredients */}
        {activeTab === 'ingredients' && (
          <div className="p-8 sm:p-12 space-y-6 animate-fade-in text-left">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold">
                Pharmacopoeial Formulation Composition
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#35251F]">
                Active Botanical Ingredients
              </h3>
              <p className="text-xs text-[#35251F]/70 font-light">
                Every herb is whole-plant extracted to preserve natural phytocomplexes and synergies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              {product.keyIngredients.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-sm bg-[#FBF8F2] border border-[#35251F]/15 space-y-2 card-luxury"
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-serif-luxury text-base font-bold text-[#35251F]">
                      {item.name}
                    </h5>
                    <span className="text-[10px] uppercase tracking-wider text-[#A7835E] font-bold px-2 py-0.5 bg-white border border-[#35251F]/10 rounded-xs">
                      {item.amount}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#A7835E] font-medium block">
                    Source: {item.source}
                  </span>
                  <p className="text-xs text-[#35251F]/75 leading-relaxed font-light">
                    {item.benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Dosage & Usage Guidelines */}
        {activeTab === 'dosage' && (
          <div className="p-8 sm:p-12 space-y-8 animate-fade-in text-left">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold">
                Classical Administration Protocol
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#35251F]">
                Dosage & Anupana (Carrier) Instructions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#FBF8F2] rounded-sm border border-[#35251F]/15 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#A7835E] font-bold block">1. Recommended Dose</span>
                <p className="text-sm font-semibold text-[#35251F] leading-snug">{product.dosage}</p>
              </div>

              <div className="p-6 bg-[#FBF8F2] rounded-sm border border-[#35251F]/15 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#A7835E] font-bold block">2. Optimal Timing</span>
                <p className="text-sm font-semibold text-[#35251F] leading-snug">{product.bestTime}</p>
              </div>

              <div className="p-6 bg-[#FBF8F2] rounded-sm border border-[#35251F]/15 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#A7835E] font-bold block">3. Suggested Course</span>
                <p className="text-sm font-semibold text-[#35251F] leading-snug">{product.course}</p>
              </div>
            </div>

            {product.whoShouldNotTake && (
              <div className="p-4 bg-amber-50 rounded-sm border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Special Contraindications:</strong>
                  <span>{product.whoShouldNotTake}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Safety & Quality Proof */}
        {activeTab === 'safety' && (
          <div className="p-8 sm:p-12 space-y-6 animate-fade-in text-left">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold">
                Scientific Verification & Certifications
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#35251F]">
                Laboratory & Manufacturing Credentials
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {product.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#FBF8F2] rounded-sm border border-[#35251F]/15 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#A7835E] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[#35251F]">{cert}</span>
                </div>
              ))}
            </div>

            <div className="p-5 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/40 text-xs text-[#35251F] space-y-1">
              <span className="font-bold block uppercase tracking-wider text-[#A7835E]">Unnao Apothecary Batch Assurance:</span>
              <p className="font-light leading-relaxed">
                Compounded at our pharmacy in Unnao, Uttar Pradesh. Free of chemical isolates, artificial binders, and heavy metals.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* RELATED FORMULATIONS */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-8 border-t border-[#35251F]/15">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold block mb-1">
                Complementary Formulations
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#35251F]">
                Pair with Related Remedies
              </h3>
            </div>
            <Link to="/shop" className="text-xs uppercase tracking-widest font-bold text-[#35251F] hover:text-[#A7835E] transition">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
