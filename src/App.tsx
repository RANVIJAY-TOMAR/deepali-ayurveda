import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import DoshaQuizModal from './components/DoshaQuizModal';
import DoctorConsultModal from './components/DoctorConsultModal';
import WhatsAppButton from './components/WhatsAppButton';
import SmoothScroll from './components/layout/SmoothScroll';
import CinematicLoadingScreen from './components/loading/CinematicLoadingScreen';
import { WishlistProvider } from './context/WishlistContext';
import { VAIDYA_CONSULTATION_FEE } from './data/products';
import './lib/supabase';

// 12 Mandatory Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import HeritagePage from './pages/HeritagePage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isDoshaQuizOpen, setIsDoshaQuizOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <WishlistProvider>
      {/* 9. HIGHLY PREMIUM CINEMATIC LOADING SCREEN */}
      {!hasLoaded && (
        <CinematicLoadingScreen
          onComplete={() => setHasLoaded(true)}
          minDuration={1400}
        />
      )}

      <SmoothScroll>
        <div className="min-h-screen flex flex-col bg-[#FBF8F2] text-[#35251F] font-sans selection:bg-[#A7835E]/30 selection:text-[#35251F]">
          
          {/* Scroll to Top on Route Change */}
          <ScrollToTop />

          {/* Top Navbar */}
          <Navbar
            onOpenDoshaQuiz={() => setIsDoshaQuizOpen(true)}
            onOpenConsult={() => setIsConsultOpen(true)}
          />

          {/* Main Routed Views */}
          <main className="flex-1">
            <Routes>
              {/* 1. Home */}
              <Route
                path="/"
                element={
                  <HomePage
                    onOpenQuiz={() => setIsDoshaQuizOpen(true)}
                    onOpenConsult={() => setIsConsultOpen(true)}
                  />
                }
              />

              {/* 2. Shop All Products */}
              <Route path="/shop" element={<ShopPage />} />

              {/* 3. Product Categories */}
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:categoryId" element={<CategoriesPage />} />

              {/* 4. Product Details */}
              <Route
                path="/product/stamon-gold-capsules"
                element={<Navigate to="/shop" replace />}
              />
              <Route
                path="/product/:id"
                element={
                  <ProductDetailPage
                    onOpenConsult={() => setIsConsultOpen(true)}
                  />
                }
              />

              {/* 5. About Deepali Ayurveda */}
              <Route path="/about" element={<AboutPage />} />

              {/* 6. Our Heritage */}
              <Route path="/heritage" element={<HeritagePage />} />

              {/* 7. Contact Us */}
              <Route path="/contact" element={<ContactPage />} />

              {/* 8. Shopping Cart */}
              <Route path="/cart" element={<CartPage />} />

              {/* 9. Checkout */}
              <Route path="/checkout" element={<CheckoutPage />} />

              {/* 10. Privacy Policy */}
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

              {/* 11. Terms & Conditions */}
              <Route path="/terms-conditions" element={<TermsConditionsPage />} />

              {/* 12. Shipping & Returns */}
              <Route path="/shipping-returns" element={<ShippingReturnsPage />} />

              {/* Order Success Confirmation */}
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

              {/* 404 Fallback */}
              <Route
                path="*"
                element={
                  <div className="py-28 text-center space-y-4">
                    <h2 className="font-serif-luxury text-3xl text-[#35251F]">Formulation Not Found</h2>
                    <p className="text-xs text-[#35251F]/70 font-light">The requested classical page could not be located.</p>
                    <div>
                      <a
                        href="/"
                        className="btn-espresso inline-block px-6 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold"
                      >
                        Return to Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>

          {/* Persistent slide-out cart drawer */}
          <CartDrawer />

          {/* Floating WhatsApp Support Button */}
          <WhatsAppButton />

          {/* Floating Ayurvedic Vaidya Consultation Pill */}
          <div className="fixed bottom-6 right-6 z-30">
            <button
              onClick={() => setIsConsultOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#35251F] hover:bg-[#49352B] text-[#FBF8F2] rounded-full shadow-premium border border-[#A7835E]/50 transition-all duration-300 cursor-pointer"
              title="Talk to an Ayurvedic Vaidya"
            >
              <span className="w-2 h-2 rounded-full bg-[#A7835E] animate-pulse"></span>
              <span className="text-xs uppercase tracking-wider font-bold">
                Talk to a Vaidya (₹{VAIDYA_CONSULTATION_FEE})
              </span>
            </button>
          </div>

          {/* Dosha Prakriti Quiz Modal */}
          <DoshaQuizModal
            isOpen={isDoshaQuizOpen}
            onClose={() => setIsDoshaQuizOpen(false)}
          />

          {/* Doctor Consultation Modal */}
          <DoctorConsultModal
            isOpen={isConsultOpen}
            onClose={() => setIsConsultOpen(false)}
          />

          {/* Global Botanical Footer */}
          <Footer />

        </div>
      </SmoothScroll>
    </WishlistProvider>
  );
}
