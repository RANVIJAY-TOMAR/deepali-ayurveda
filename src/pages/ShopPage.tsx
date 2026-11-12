import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Filter, 
  Search, 
  ChevronRight, 
  Leaf, 
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { CATEGORIES, BRAND_ESTABLISHED } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import ProductCardSkeleton from '../components/products/ProductCardSkeleton';
import CatalogErrorState from '../components/products/CatalogErrorState';

export default function ShopPage() {
  const { products, loading, error, refetch } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("popular");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "All Products" || p.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        (p.sanskritName && p.sanskritName.includes(q)) ||
        p.heroBenefit.toLowerCase().includes(q) ||
        p.symptoms.some((s) => s.toLowerCase().includes(q)) ||
        p.keyIngredients.some((k) => k.name.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortOrder === "price-low") return a.price - b.price;
      if (sortOrder === "price-high") return b.price - a.price;
      if (sortOrder === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [filteredProducts, sortOrder]);

  return (
    <div className="space-y-12 pb-24 text-[#35251F]">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F5EFE5] to-[#FBF8F2] border-b border-[#35251F]/15 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-left">
          <nav className="flex items-center gap-2 text-xs text-[#35251F]/60 font-medium">
            <Link to="/" className="hover:text-[#A7835E] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
            <span className="text-[#35251F] font-bold">Storefront</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#35251F]/10 text-[#35251F] text-xs font-bold uppercase tracking-widest border border-[#35251F]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#A7835E]" />
              <span>Classical Shastriya Catalog • Unnao Est. {BRAND_ESTABLISHED}</span>
            </div>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-[#35251F] tracking-tight leading-tight">
              All Classical Formulations
            </h1>
            <p className="text-sm sm:text-base text-[#35251F]/85 leading-relaxed font-light">
              Explore authentic Ayurvedic formulations compounded in accordance with ancient pharmacopoeia texts. Prepared from ethically harvested whole plants with zero synthetic additives.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Controls: Search, Filter Tabs & Sort Order */}
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-[#A7835E] absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulations, ingredients, or symptoms..."
                className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm bg-white rounded-sm border border-[#35251F]/20 focus:outline-none focus:border-[#A7835E] text-[#35251F] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-[#35251F] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs uppercase tracking-wider text-[#35251F]/70 font-bold">Sort By:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3.5 py-2.5 bg-white text-xs font-semibold rounded-sm border border-[#35251F]/20 text-[#35251F] focus:outline-none focus:border-[#A7835E] shadow-xs cursor-pointer"
              >
                <option value="popular">Most Trusted</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-[#35251F]/10 pb-4">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#35251F] text-[#FBF8F2] shadow-xs'
                      : 'bg-white hover:bg-[#F5EFE5] text-[#35251F] border border-[#35251F]/15'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Catalog Views: Loading, Error, Empty & Populated Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCardSkeleton count={6} />
          </div>
        ) : error ? (
          <CatalogErrorState message={error} onRetry={refetch} />
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-sm border border-[#35251F]/15 p-8 max-w-md mx-auto shadow-xs">
            <Leaf className="w-8 h-8 text-[#A7835E] mx-auto" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#35251F]">No Classical Remedies Available</h3>
            <p className="text-xs text-[#35251F]/70 font-light">
              Our apothecary catalog is currently refreshing from the Supabase database. Please try again shortly.
            </p>
            <button
              onClick={refetch}
              className="btn-bronze px-5 py-2.5 rounded-sm text-xs uppercase tracking-widest font-semibold cursor-pointer"
            >
              Refresh Catalog
            </button>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-white rounded-sm border border-[#35251F]/15 p-8 max-w-md mx-auto">
            <Leaf className="w-8 h-8 text-[#A7835E] mx-auto" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#35251F]">No remedies matched your query</h3>
            <p className="text-xs text-[#35251F]/70 font-light">
              Try adjusting your search terms or selecting another department category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Products");
              }}
              className="btn-espresso px-5 py-2.5 rounded-sm text-xs uppercase tracking-widest font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

    </div>
  );
}
