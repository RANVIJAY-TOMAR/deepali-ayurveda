import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, CheckCircle2, Sparkles, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '../lib/format';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    amountNeededForFreeShipping,
    applyCoupon,
    couponCode,
    couponMessage,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const res = applyCoupon(inputCode);
    if (!res.success) {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round(((subtotal - discountAmount) / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#35251F]/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-[#FBF8F2] flex flex-col border-l-2 border-[#A7835E]/40 shadow-2xl text-left"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#35251F]/15 flex items-center justify-between bg-[#F5EFE5]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#35251F] text-[#D8C3A5] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-[#A7835E]" />
              </div>
              <div>
                <h2 className="font-serif-luxury text-xl font-bold text-[#35251F]">Shopping Basket</h2>
                <span className="text-[10px] uppercase tracking-wider text-[#A7835E] font-bold">
                  {items.length} {items.length === 1 ? 'Classical Formulation' : 'Classical Formulations'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-sm text-[#35251F]/70 hover:text-[#35251F] hover:bg-[#EFE7DA] transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-4 bg-[#EFE7DA] border-b border-[#35251F]/15 text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <div className="space-y-2">
                <p className="text-[#35251F] font-medium text-xs flex items-center justify-between">
                  <span>Add <strong className="text-[#35251F] font-bold">{formatPrice(amountNeededForFreeShipping)}</strong> more for Free Delivery</span>
                  <span className="text-[10px] text-[#A7835E] font-bold">{freeShippingProgress}%</span>
                </p>
                <div className="w-full bg-[#35251F]/15 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#35251F] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#35251F] text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#A7835E]" />
                <span>Complimentary Pan-India Express Delivery Unlocked!</span>
              </div>
            )}
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F5EFE5] text-[#35251F] flex items-center justify-center border border-[#A7835E]/40">
                  <ShoppingBag className="w-8 h-8 text-[#A7835E]" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#35251F]">Your basket is empty</h3>
                <p className="text-xs text-[#35251F]/75 max-w-xs font-light leading-relaxed">
                  Discover traditional Ayurvedic remedies formulated in Unnao using Shastriya decoctions.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="btn-bronze px-6 py-3 text-xs uppercase tracking-widest font-bold rounded-sm shadow-premium cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-4 bg-white rounded-sm border border-[#35251F]/15 flex gap-4 items-center card-luxury"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-contain p-1.5 rounded-sm border border-[#35251F]/15 shrink-0 shadow-xs bg-[#FAF6EE]"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-serif-luxury font-bold text-[#35251F] truncate pr-2">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-400 hover:text-red-600 transition p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#A7835E] font-bold">
                        {(product.slug === 'daaru-mukti-powder' || product.id === 'daaru-mukti-powder') ? '1 Month Supply' : product.volume}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#35251F]/10">
                      <span className="text-sm font-bold text-[#35251F]">
                        {formatPrice(product.price * quantity)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#35251F]/20 bg-[#FBF8F2] rounded-xs">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1.5 hover:bg-[#F5EFE5] text-[#35251F] transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#35251F]">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1.5 hover:bg-[#F5EFE5] text-[#35251F] transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#35251F]/15 bg-white space-y-4">

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-3 text-[#A7835E]" />
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="PROMO CODE (e.g. AYUR10)"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-sm border border-[#35251F]/20 focus:outline-none focus:border-[#A7835E] font-mono uppercase bg-[#FBF8F2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F5EFE5] hover:bg-[#EFE7DA] text-[#35251F] text-xs uppercase tracking-wider font-bold rounded-sm border border-[#D8C3A5] transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-xs text-[#A7835E] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {couponMessage}
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-red-600 font-medium">{couponError}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-[#35251F]/80 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#35251F]">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#A7835E] font-bold">
                    <span>Discount ({couponCode})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Delivery</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-[#A7835E]">FREE</span>
                  ) : (
                    <span className="font-semibold text-[#35251F]">{formatPrice(shippingFee)}</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-bold text-[#35251F] pt-2 border-t border-[#35251F]/15 font-serif-luxury">
                  <span>Total Payable</span>
                  <span className="text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 btn-bronze text-xs uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 shadow-premium cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#35251F]/65 font-medium">
                <Lock className="w-3.5 h-3.5 text-[#A7835E]" />
                <span>100% Plain Box Discreet Packaging Guaranteed</span>
              </div>

            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
