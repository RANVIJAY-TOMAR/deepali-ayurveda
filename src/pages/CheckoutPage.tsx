import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CreditCard, Lock, ChevronRight, Leaf, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

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
    paymentMethod: 'upi',
    specialNotes: ''
  });

  const [razorpayKey, setRazorpayKey] = useState(
    () => localStorage.getItem('deepali_razorpay_key') || 'rzp_test_placeholder'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderId = `DA-ORD-${Date.now().toString().slice(-6)}`;
    const orderData = {
      orderId,
      items,
      subtotal,
      discountAmount,
      shippingFee,
      grandTotal,
      customer: formData,
      date: new Date().toISOString(),
      status: 'Confirmed'
    };

    // If Razorpay online gateway is chosen and key provided
    if (formData.paymentMethod === 'online' && razorpayKey && razorpayKey !== 'rzp_test_placeholder') {
      const isLoaded = await loadRazorpayScript();
      if (isLoaded && window.Razorpay) {
        const options = {
          key: razorpayKey,
          amount: grandTotal * 100, // in paise
          currency: 'INR',
          name: 'Deepali Ayurveda',
          description: `Classical Ayurvedic Formulations (Order #${orderId})`,
          image: '/images/logo/deepali-ayurveda-logo-circle.png',
          handler: function (response: any) {
            orderData.status = 'Paid via Razorpay';
            sessionStorage.setItem('deepali_last_order', JSON.stringify({ ...orderData, paymentId: response.razorpay_payment_id }));
            clearCart();
            setIsSubmitting(false);
            navigate(`/order-success/${orderId}`);
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#35251F'
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }
    }

    // Default confirmation (COD or test simulation)
    setTimeout(() => {
      sessionStorage.setItem('deepali_last_order', JSON.stringify(orderData));
      clearCart();
      setIsSubmitting(false);
      navigate(`/order-success/${orderId}`);
    }, 700);
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
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">Email Address *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-sm border border-[#35251F]/20 bg-[#FBF8F2] focus:outline-none focus:border-[#A7835E]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#35251F] mb-1">Delivery Street Address *</label>
              <textarea
                required
                rows={2}
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

          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white p-6 sm:p-7 rounded-sm border border-[#35251F]/15 space-y-4 shadow-subtle card-luxury">
            <div className="flex items-center gap-2 pb-3 border-b border-[#35251F]/10">
              <span className="w-6 h-6 rounded-full bg-[#35251F] text-[#FBF8F2] text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-serif-luxury text-lg font-bold text-[#35251F]">Payment Preference</h3>
            </div>

            <div className="space-y-3">
              {/* Option 1: UPI */}
              <label className={`p-4 rounded-sm border flex items-start gap-3 cursor-pointer transition ${
                formData.paymentMethod === 'upi'
                  ? 'border-[#35251F] bg-[#F5EFE5]'
                  : 'border-[#35251F]/15 hover:border-[#35251F]/40'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.paymentMethod === 'upi'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#35251F] block">
                    Instant UPI (Google Pay, PhonePe, Paytm, BHIM)
                  </span>
                  <p className="text-[11px] text-[#35251F]/70 font-light">
                    Fastest dispatch. Zero gateway surcharge.
                  </p>
                </div>
              </label>

              {/* Option 2: Cards / NetBanking / Razorpay */}
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
                    Credit / Debit Card / Net Banking (Razorpay Secure)
                  </span>
                  <p className="text-[11px] text-[#35251F]/70 font-light">
                    100% Encrypted 256-bit bank level SSL checkout.
                  </p>
                </div>
              </label>

              {/* Option 3: Cash On Delivery */}
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
                    Pay in cash directly to the courier upon delivery in plain box packaging.
                  </p>
                </div>
              </label>

              {/* Optional Custom Razorpay Key Accordion */}
              <details className="mt-3 text-xs text-[#35251F]/70 bg-[#FBF8F2] p-3 rounded-sm border border-[#35251F]/10">
                <summary className="cursor-pointer font-medium text-[#35251F] flex items-center justify-between">
                  <span>Connect Custom Razorpay Key ID</span>
                  <span className="text-[10px] text-[#A7835E] font-bold">Configure</span>
                </summary>
                <div className="mt-2 pt-2 border-t border-[#35251F]/10 space-y-2">
                  <p className="text-[11px] text-[#35251F]/70 font-light">
                    Paste your Razorpay Key ID (e.g. <code className="bg-white px-1 py-0.5 rounded border text-[#35251F] font-mono">rzp_test_...</code>).
                  </p>
                  <input
                    type="text"
                    value={razorpayKey === 'rzp_test_placeholder' ? '' : razorpayKey}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      setRazorpayKey(val || 'rzp_test_placeholder');
                      localStorage.setItem('deepali_razorpay_key', val);
                    }}
                    placeholder="rzp_test_your_razorpay_key_id"
                    className="w-full px-3 py-1.5 bg-white text-xs font-mono rounded-sm border border-[#35251F]/20 focus:outline-none focus:border-[#A7835E]"
                  />
                </div>
              </details>

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
                      <span className="text-[11px] text-[#A7835E] font-medium">Qty: {quantity} {product.id === 'daaru-mukti-powder' ? '• 1 Month Supply' : ''}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#35251F]">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-[#35251F]/10 text-xs text-[#35251F]/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
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
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confirm Order ({formatPrice(grandTotal)})</span>
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
