import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from '../lib/format';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('deepali_ayurveda_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('deepali_ayurveda_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to local storage', e);
    }
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountPercent(0);
    setCouponMessage('');
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'AYUR10' || cleanCode === 'DEEPALI10') {
      setDiscountPercent(10);
      setCouponCode(cleanCode);
      setCouponMessage('10% Ayurvedic inaugural discount applied!');
      return { success: true, message: '10% discount applied!' };
    }
    if (cleanCode === 'OJAS15') {
      setDiscountPercent(15);
      setCouponCode(cleanCode);
      setCouponMessage('15% Wellness voucher applied!');
      return { success: true, message: '15% discount applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try AYUR10' };
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const shippingFee = calculateShipping(discountedSubtotal);
  const grandTotal = discountedSubtotal + shippingFee;
  const amountNeededForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - discountedSubtotal
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
        totalItemsCount,
        subtotal,
        discountAmount,
        discountPercent,
        shippingFee,
        grandTotal,
        amountNeededForFreeShipping,
        applyCoupon,
        couponCode,
        couponMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
