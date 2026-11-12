import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ChevronRight, 
  Truck, 
  Lock, 
  Tag, 
  Leaf,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon.trim());
    if (res.success) {
      setInputCoupon('');
      setCouponError('');
    } else {
      setCouponError(res.message || 'Invalid coupon code. Try code "AYUR10".');
    }
  };

  const freeShippingThreshold = 500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = freeShippingThreshold - subtotal;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-5 text-[#35251F]">
        <div className="w-16 h-16 bg-[#F5EFE5] text-[#35251F] rounded-full flex items-center justify-center mx-auto shadow-xs border border-[#A7835E]/40">
          <ShoppingBag className="w-8 h-8 text-[#A7835E]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#35251F]">
            Your Ayurvedic Basket is Empty
          </h1>
          <p className="text-sm text-[#35251F]/70 max-w-sm mx-auto font-light">
            You have not added any classical formulations yet. Explore our remedies prepared with whole-plant extracts.
          </p>
        </div>
        <div>
          <Link
            to="/shop"
            className="btn-espresso inline-flex items-center gap-2 px-8 py-3.5 rounded-sm text-xs uppercase tracking-widest font-semibold"
          >
            <Leaf className="w-4 h-4 text-[#D8C3A5]" />
            <span>Explore All Remedies</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-[#35251F]">
      
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#35251F]/60 font-medium">
        <Link to="/" className="hover:text-[#A7835E] transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
        <Link to="/shop" className="hover:text-[#A7835E] transition">Formulations</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
        <span className="text-[#35251F] font-bold">Shopping Basket</span>
      </nav>

      <div className="text-left">
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#35251F] tracking-tight">
          Shopping Basket
        </h1>
        <p className="text-sm text-[#35251F]/70 mt-1 font-light">
          Review your selected Ayurvedic formulations before secure checkout.
        </p>
      </div>

      {/* Free Express Shipping Notification Banner */}
      <div className="p-4 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/40 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#A7835E]" />
            {amountNeeded > 0 ? (
              <span className="text-[#35251F] font-medium">
                Add <strong className="text-[#35251F] font-bold">{formatPrice(amountNeeded)}</strong> more to unlock <strong>Complimentary Pan-India Shipping</strong>!
              </span>
            ) : (
              <span className="text-[#35251F] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#A7835E]" />
                <span>You qualify for Complimentary Pan-India Delivery!</span>
              </span>
            )}
          </div>
          <span className="font-mono text-xs font-bold text-[#A7835E]">{progressPercent}%</span>
        </div>

        <div className="w-full bg-[#35251F]/10 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#35251F] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2-Column Basket Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Product Items Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-sm border border-[#35251F]/15 divide-y divide-[#35251F]/10 shadow-xs">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                {/* Product Thumbnail & Names */}
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-contain p-2 rounded-sm border border-[#35251F]/15 shrink-0 bg-[#FAF6EE]"
                  />
                  <div className="space-y-1 text-left">
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      className="font-serif-luxury text-base sm:text-lg font-bold text-[#35251F] hover:text-[#A7835E] transition block"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-[#A7835E] font-bold">
                      <span>{product.volume}</span>
                      {(product.slug === 'daaru-mukti-powder' || product.id === 'daaru-mukti-powder') && (
                        <span className="px-2 py-0.5 bg-[#F5EFE5] text-[#35251F] border border-[#D8C3A5] rounded-xs text-[10px] uppercase tracking-wider font-bold">
                          1 Month Supply
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#35251F]/60 block font-mono">
                      Unit: {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  
                  {/* Quantity Buttons */}
                  <div className="flex items-center border border-[#35251F]/20 bg-white rounded-sm">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 hover:bg-[#F5EFE5] text-[#35251F] transition cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#35251F]">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 hover:bg-[#F5EFE5] text-[#35251F] transition cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="text-base font-bold font-serif-luxury text-[#35251F] min-w-[70px] text-right">
                    {formatPrice(product.price * quantity)}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition cursor-pointer"
                    title="Remove remedy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider font-bold text-[#35251F] hover:text-[#A7835E] transition inline-flex items-center gap-1.5"
            >
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Voucher (4 cols) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="bg-white p-6 sm:p-7 rounded-sm border border-[#35251F]/15 space-y-6 shadow-premium card-luxury">
            
            <h3 className="font-serif-luxury text-xl font-bold text-[#35251F] pb-3 border-b border-[#35251F]/10">
              Basket Summary
            </h3>

            {/* Voucher Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F]">
                Apply Voucher Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-3 text-[#A7835E]" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                    placeholder="CODE (e.g. AYUR10)"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase bg-[#FBF8F2] rounded-sm border border-[#35251F]/20 focus:outline-none focus:border-[#A7835E]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F5EFE5] hover:bg-[#EFE7DA] text-[#35251F] text-xs uppercase tracking-wider font-bold rounded-sm border border-[#D8C3A5] transition cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {couponCode && (
                <div className="flex items-center justify-between text-xs text-[#A7835E] font-medium pt-1">
                  <span>Coupon <strong>{couponCode}</strong> applied (10% Off)</span>
                  <button onClick={removeCoupon} className="text-red-600 hover:underline text-[11px] cursor-pointer">
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-xs text-red-600 font-medium">{couponError}</p>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-[#35251F]/80 border-t border-[#35251F]/10 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#35251F]">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#A7835E] font-bold">
                  <span>Voucher Savings</span>
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

              <div className="flex justify-between text-base font-bold text-[#35251F] pt-3 border-t border-[#35251F]/15 font-serif-luxury">
                <span>Total Amount</span>
                <span className="text-xl">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 btn-bronze text-xs uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 shadow-premium cursor-pointer"
            >
              <span>PROCEED TO SECURE CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Packaging Reassurance */}
            <div className="p-4 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/30 text-xs text-[#35251F] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#A7835E]">
                <Lock className="w-4 h-4" />
                <span>100% Plain Box Guaranteed</span>
              </div>
              <p className="text-[11px] text-[#35251F]/70 font-light">
                Discreet plain brown corrugated carton with zero external health indications.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
