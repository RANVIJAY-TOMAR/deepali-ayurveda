import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Heart, 
  Leaf, 
  Sparkles, 
  PhoneCall, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  BRAND_NAME, 
  BRAND_ESTABLISHED, 
  BRAND_SUPPORT_PHONE, 
  VAIDYA_CONSULTATION_FEE, 
  PRODUCTS 
} from '../data/products';
import { formatPrice } from '../lib/format';

interface NavbarProps {
  onOpenDoshaQuiz?: () => void;
  onOpenConsult?: () => void;
}

export default function Navbar({ onOpenDoshaQuiz, onOpenConsult }: NavbarProps) {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigate
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Our Heritage', path: '/heritage' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#29231F] text-[#D8C3A5] text-[11px] py-2 px-4 border-b border-[#35251F]">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A7835E] animate-pulse" />
            <span className="font-serif-luxury tracking-normal text-[#FBF8F2]">
              Est. {BRAND_ESTABLISHED} • Unnao, Uttar Pradesh (River Ganga)
            </span>
          </div>
          
          <div className="hidden sm:flex items-center gap-6 text-[10px] uppercase font-semibold">
            <span>Free Express Delivery Above ₹500</span>
            <span className="text-[#35251F]/40">•</span>
            <span>100% Plain Box Discreet Packaging</span>
            <span className="text-[#35251F]/40">•</span>
            {onOpenConsult && (
              <button
                onClick={onOpenConsult}
                className="hover:text-white transition flex items-center gap-1 cursor-pointer text-[#A7835E]"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Talk to a Vaidya (₹{VAIDYA_CONSULTATION_FEE})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#35251F]/95 backdrop-blur-md shadow-premium border-b border-[#A7835E]/30 py-3 text-[#FBF8F2]'
            : 'bg-[#35251F] border-b border-[#49352B] py-4 text-[#FBF8F2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#A7835E]/80 shadow-md group-hover:border-[#D8C3A5] transition-all bg-[#2A1D17] shrink-0 p-0.5">
              <img
                src="/images/logo/deepali-ayurveda-logo-circle.png"
                alt="Deepali Ayurveda Official Seal"
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-[#A7835E]/40 pointer-events-none" />
            </div>
            <div>
              <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-[#FBF8F2] block leading-none group-hover:text-[#D8C3A5] transition-colors">
                DEEPALI AYURVEDA
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D8C3A5] font-bold block mt-1">
                Est. {BRAND_ESTABLISHED} • Unnao
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-xs uppercase tracking-widest font-bold transition-colors py-1 ${
                    isActive ? 'text-[#D8C3A5]' : 'text-[#F5EFE5]/80 hover:text-[#D8C3A5]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute left-0 bottom-0 right-0 h-[2px] bg-[#A7835E]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-[#49352B] text-[#F5EFE5] transition cursor-pointer"
              aria-label="Search remedies"
            >
              <Search className="w-4 h-4 text-[#D8C3A5]" />
            </button>

            {/* Talk to Vaidya Pill CTA */}
            {onOpenConsult && (
              <button
                onClick={onOpenConsult}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#49352B] hover:bg-[#5C4336] text-[#D8C3A5] border border-[#A7835E]/40 text-xs font-bold transition cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#A7835E]" />
                <span>Talk to a Vaidya (₹{VAIDYA_CONSULTATION_FEE})</span>
              </button>
            )}

            {/* Wishlist Link */}
            <Link
              to="/shop"
              className="p-2.5 rounded-full hover:bg-[#49352B] text-[#F5EFE5] transition relative hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 text-[#D8C3A5]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-full bg-[#A7835E] hover:bg-[#C5A582] text-[#FBF8F2] transition flex items-center gap-2 shadow-xs cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold">{totalItems}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md lg:hidden hover:bg-[#49352B] text-[#F5EFE5] transition cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#35251F] border-b border-[#A7835E]/30 text-[#FBF8F2] px-6 py-6 space-y-5 z-30"
          >
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm uppercase tracking-widest font-serif-luxury font-bold hover:text-[#D8C3A5] py-2 border-b border-[#49352B]"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="space-y-3 pt-2">
              {onOpenConsult && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenConsult();
                  }}
                  className="w-full py-3.5 btn-bronze text-xs uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Talk to a Vaidya (₹{VAIDYA_CONSULTATION_FEE})</span>
                </button>
              )}

              <div className="text-[11px] text-[#D8C3A5]/80 space-y-1 font-light pt-2">
                <p>📍 {BRAND_NAME} • C-9, Awas Vikas Colony, Unnao, UP</p>
                <p>📞 Helpline: <a href={`tel:${BRAND_SUPPORT_PHONE}`} className="underline font-bold text-[#FBF8F2]">{BRAND_SUPPORT_PHONE}</a></p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#29231F]/80 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative max-w-2xl mx-auto mt-16 sm:mt-24 bg-[#FBF8F2] rounded-sm p-6 sm:p-8 shadow-2xl border-2 border-[#A7835E]/40 z-10 space-y-6 text-[#35251F]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#35251F]/15">
                <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold">
                  Deepali Ayurveda Formulation Search
                </span>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-sm text-[#35251F]/60 hover:text-[#35251F] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-5 h-5 absolute left-4 top-3.5 text-[#A7835E]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Daaru Mukti, B12, Digest Guru, symptoms..."
                  autoFocus
                  className="w-full pl-12 pr-4 py-3.5 text-sm bg-white rounded-sm border border-[#35251F]/20 focus:outline-none focus:border-[#A7835E]"
                />
              </form>

              {/* Quick Suggestion Pills */}
              <div className="space-y-2">
                <span className="text-[11px] text-[#35251F]/60 uppercase tracking-wider font-semibold block">
                  Popular Searches:
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Daaru Mukti Powder", "Plant Vitamin B12", "Digest Guru Churan", "Sea Buckthorn", "Apple Cider Vinegar"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 rounded-full bg-[#F5EFE5] hover:bg-[#EFE7DA] text-xs text-[#35251F] border border-[#D8C3A5] cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#35251F]/10 max-h-72 overflow-y-auto">
                  <span className="text-[11px] uppercase tracking-wider text-[#A7835E] font-bold block">
                    Found {searchResults.length} {searchResults.length === 1 ? 'Remedy' : 'Remedies'}:
                  </span>
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between p-3 rounded-sm bg-white hover:bg-[#F5EFE5] border border-[#35251F]/10 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain p-1 rounded-sm border border-[#35251F]/10 bg-[#FAF6EE]" />
                        <div>
                          <h4 className="font-serif-luxury text-sm font-bold text-[#35251F] group-hover:text-[#A7835E]">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-[#A7835E] font-semibold">{item.volume}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#35251F]">{formatPrice(item.price)}</span>
                        <ChevronRight className="w-4 h-4 text-[#35251F]/40 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
