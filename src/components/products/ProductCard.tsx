import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Check, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../lib/format';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const isDaaruMukti = product.id === 'daaru-mukti-powder';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-sm border border-[#35251F]/15 overflow-hidden flex flex-col justify-between h-full card-luxury relative">
        
        {/* Top Badges & Wishlist */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {isDaaruMukti ? (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#35251F] text-[#FBF8F2] border border-[#A7835E]/60 rounded-xs shadow-xs pointer-events-auto">
                ★ 1 Month Supply
              </span>
            ) : product.tag ? (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#F5EFE5] text-[#35251F] border border-[#D8C3A5] rounded-xs shadow-xs pointer-events-auto">
                {product.tag.split('•')[0]}
              </span>
            ) : null}

            {discountPercent > 0 && (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#A7835E] text-[#FBF8F2] rounded-xs shadow-xs pointer-events-auto">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full backdrop-blur-md transition shadow-xs pointer-events-auto cursor-pointer ${
              isFavorite
                ? 'bg-white text-rose-600'
                : 'bg-white/80 text-[#35251F]/60 hover:text-rose-600 hover:bg-white'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Image Frame */}
        <Link to={`/product/${product.id}`} className="block relative aspect-square bg-[#FAF6EE] overflow-hidden flex items-center justify-center p-5 group-hover:bg-[#F2ECE1] transition-colors">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-xs"
          />

          {/* Quick Peek Action Overlay */}
          <div className="absolute inset-0 bg-[#35251F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>

        {/* Product Details Content */}
        <div className="p-5 sm:p-6 space-y-3.5 flex-1 flex flex-col justify-between">
          
          <div className="space-y-1.5">
            {/* Category & Volume / 1 Month Supply Badge */}
            <div className="flex items-center justify-between text-[11px] text-[#A7835E] font-bold tracking-wider uppercase">
              <span>{product.category}</span>
              <span className="text-[#35251F]/70 font-semibold">{product.volume}</span>
            </div>

            {/* Product Title */}
            <Link to={`/product/${product.id}`} className="block group-hover:text-[#A7835E] transition-colors">
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#35251F] leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Short Benefit or 1 Month Supply highlight */}
            {isDaaruMukti && (
              <p className="text-xs font-semibold text-[#A7835E]">
                30 Daily Sachets (1 Sachet/Day) • 1 Month Supply
              </p>
            )}

            {/* Symptoms Tags or Sanskrit Subtitle */}
            {product.sanskritName && (
              <p className="text-xs text-[#725543] font-hindi-luxury line-clamp-1 font-medium">
                {product.sanskritName}
              </p>
            )}

            {/* Star Rating & Verified Reviews */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex items-center text-[#A7835E]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#35251F]">{product.rating}</span>
              <span className="text-[11px] text-[#35251F]/50">({product.reviewCount})</span>
            </div>
          </div>

          {/* Price & Action Section */}
          <div className="pt-3 border-t border-[#35251F]/10 space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#35251F]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-[#35251F]/50 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              {isDaaruMukti && (
                <span className="text-[10px] font-bold text-[#A7835E] uppercase tracking-wider">
                  1 Mo. Course
                </span>
              )}
            </div>

            {/* Quick Add To Basket Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 px-4 rounded-sm text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition duration-300 shadow-sm cursor-pointer ${
                isAdded
                  ? 'bg-[#35251F] text-[#FBF8F2]'
                  : 'btn-bronze text-[#FBF8F2]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-[#D8C3A5]" />
                  <span>Added to Basket</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Basket</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
