import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CreditCard, Lock, ChevronRight, Leaf, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import { submitSecureCheckout } from '../lib/orders';

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    clearCart,
    couponCode
  } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: 'Uttar Pradesh',
    paymentMethod: 'online',
    specialNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28 text-center space-y-4 text-[#35251F]">
        <h2 className="font-serif-luxury text-3xl font-bold text-[#35251F]">Your basket is currently empty</h2>
        <p className="text-sm text-[#35251F]/70 font-light">Select your classical Ayurvedic remedies before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="btn-espresso inline-block px-8 py-3.5 rounded-sm text-xs uppercase tracking-widest font-semibold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions caused by multiple clicks
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const checkoutItems = items.map((it) => ({
      productId: it.product.id,
      quantity: it.quantity,
      productName: it.product.name
    }));

    // Submit checkout via audited submit_checkout() database RPC function
    const result = await submitSecureCheckout(formData, checkoutItems);

    if (!result.success) {
      setIsSubmitting(false);
      setErrorMessage(result.error || 'Failed to process checkout.');
      return;
    }

    // Store guest token in order-specific sessionStorage entry for tab-isolated retrieval.
    // Kept strictly out of URL paths, query parameters, URL fragments, and history state.
    if (result.guestToken && result.orderReference) {
      sessionStorage.setItem(`guest_token_${result.orderReference}`, result.guestToken);
    }

    clearCart();
    setIsSubmitting(false);

    // Clean URL navigation without token in path, query, or history state
    navigate(`/order-success/${result.orderReference}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#35251F] text-left">
      
      {/* Top Header */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-[#35251F] hover:text-[#A7835E] mb-2 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Basket</span>
        </Link>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#35251F] font-bold">
          Checkout & Discreet Dispatch
        </h1>
        <p className="text-xs text-[#35251F]/70 font-light">Shipped fresh from our Unnao pharmacy with confidential plain packaging.</p>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-sm text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-semibold">Checkout Notice</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Delivery Address */}
          <div className="bg-white p-6 sm:p-7 rounded-sm border border-[#35251F]/15 space-y-4 shadow-subtle card-luxury">
            <div className="flex items-center gap-2 pb-3 border-b border-[#35251F]/10">
              <span className="w-6 h-6 rounded-full bg-[#35251F] text-[#FBF8F2] text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="font-serif-luxury text-lg font-bold text-[#35251F]">Shipping Address</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  minLength={2}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">Mobile Number (For Courier SMS) *</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9140086856"
                  className="w-full px-3.5 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com (optional for tracking receipts)"
                className="w-full px-3.5 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">Delivery Street Address *</label>
              <textarea
                required
                rows={2}
                minLength={5}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Flat / House No., Society, Landmark..."
                className="w-full px-3.5 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">PIN Code *</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="e.g. 209801"
                  className="w-full px-3.5 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">City *</label>
                <input
                  required
                  type="text"
                  minLength={2}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Unnao"
                  className="w-full px-3.5 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">State *</label>
                <input
                  required
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Uttar Pradesh"
                  className="w-full px-3.5 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">Discreet Delivery Instructions (Optional)</label>
              <input
                type="text"
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                placeholder="e.g. Deliver during business hours, call before arrival..."
                className="w-full px-3.5 py-2 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white p-6 sm:p-7 rounded-sm border border-[#35251F]/15 space-y-4 shadow-subtle card-luxury">
            <div className="flex items-center gap-2 pb-3 border-b border-[#35251F]/10">
              <span className="w-6 h-6 rounded-full bg-[#35251F] text-[#FBF8F2] text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-serif-luxury text-lg font-bold text-[#35251F]">Payment Preference</h3>
            </div>

            <div className="space-y-3">
              {/* Option 1: Standard Online / UPI */}
              <label className={`p-4 rounded-sm border flex items-start gap-3 cursor-pointer transition ${
                formData.paymentMethod === 'online'
                  ? 'border-[#35251F] bg-[#F5EFE5]'
                  : 'border-[#35251F]/15 hover:border-[#35251F]/40'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'online' })}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#35251F] block">
                    Online Payment (UPI, Debit/Credit Card, Net Banking)
                  </span>
                  <p className="text-[11px] text-[#35251F]/70 font-light">
                    Protected by server-side verification and bank-grade encryption.
                  </p>
                </div>
              </label>

              {/* Option 2: Cash on Delivery */}
              <label className={`p-4 rounded-sm border flex items-start gap-3 cursor-pointer transition ${
                formData.paymentMethod === 'cod'
                  ? 'border-[#35251F] bg-[#F5EFE5]'
                  : 'border-[#35251F]/15 hover:border-[#35251F]/40'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#35251F] block">
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-[11px] text-[#35251F]/70 font-light">
                    Pay in cash upon physical delivery at your doorstep.
                  </p>
                </div>
              </label>
            </div>

          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-sm border border-[#35251F]/15 space-y-5 sticky top-28 shadow-premium card-luxury">
            <h3 className="font-serif-luxury text-xl font-bold text-[#35251F] pb-3 border-b border-[#35251F]/10">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Compact items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-contain p-0.5 rounded-xs border border-[#35251F]/10 bg-[#FAF6EE]" />
                    <div>
                      <span className="font-semibold text-[#35251F] block line-clamp-1">{product.name}</span>
                      <span className="text-[11px] text-[#A7835E] font-medium">Qty: {quantity} {(product.slug === 'daaru-mukti-powder' || product.id === 'daaru-mukti-powder') ? '• 1 Month Supply' : ''}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#35251F]">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-[#35251F]/10 text-xs text-[#35251F]/80">
              <div className="flex justify-between">
                <span>Subtotal (Authoritative database pricing)</span>
                <span className="font-bold text-[#35251F]">{formatPrice(subtotal)}</span>
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
              <div className="flex justify-between text-base font-bold text-[#35251F] pt-3 border-t border-[#35251F]/15 font-serif-luxury">
                <span>Total Payable</span>
                <span className="text-xl">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Confirm & Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 btn-bronze text-xs uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 shadow-premium cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to Dispensary...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confirm & Dispatch ({formatPrice(grandTotal)})</span>
                </>
              )}
            </button>

            <div className="p-4 bg-[#F5EFE5] rounded-sm border border-[#A7835E]/30 text-[11px] text-[#35251F] space-y-1">
              <span className="font-bold block uppercase tracking-wider text-[#A7835E]">
                Confidential Packaging Reassurance:
              </span>
              <p className="font-light">
                Each order is shipped in plain sealed cardboard without external health markings.
              </p>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
