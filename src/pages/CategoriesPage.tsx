import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORY_DETAILS } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import ProductCardSkeleton from '../components/products/ProductCardSkeleton';
import CatalogErrorState from '../components/products/CatalogErrorState';

export default function CategoriesPage() {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [activeCatId, setActiveCatId] = useState<string>(categoryId || 'all');
  const { products, loading, error, refetch } = useProducts();

  const currentCategory = CATEGORY_DETAILS.find((c) => c.id === activeCatId);

  const displayedProducts = activeCatId === 'all'
    ? products
    : products.filter((p) => {
      if (activeCatId === 'ayurvedic-medicines') return p.category === 'Ayurvedic Medicines';
      if (activeCatId === 'herbal-formulations') return p.category === 'Herbal Formulations';
      if (activeCatId === 'digestive-wellness') return p.category === 'Digestive Wellness';
      return true;
    });

  return (
    <div className="space-y-12 pb-24 text-[#35251F]">

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F5EFE5] to-[#FBF8F2] border-b border-[#35251F]/15 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-left">
          <nav className="flex items-center gap-2 text-xs text-[#35251F]/60 font-medium">
            <Link to="/" className="hover:text-[#A7835E] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
            <Link to="/shop" className="hover:text-[#A7835E] transition">Catalog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#35251F]/30" />
            <span className="text-[#35251F] font-bold">Categories</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#35251F]/10 text-[#35251F] text-xs font-bold uppercase tracking-widest border border-[#35251F]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#A7835E]" />
              <span>Therapeutic Focus • Classical Lineage</span>
            </div>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-[#35251F] tracking-tight leading-tight">
              Product Categories
            </h1>
            <p className="text-sm sm:text-base text-[#35251F]/85 leading-relaxed font-light">
              Explore classical herbal remedies categorized by physiological action: de-addiction recovery, cell-nutrition tonics, and gut fire kindle.
            </p>
          </div>
        </div>
      </section>

      {/* Main Categories & Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap gap-2.5 border-b border-[#35251F]/10 pb-5">
          <button
            onClick={() => setActiveCatId('all')}
            className={`px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-bold transition cursor-pointer ${activeCatId === 'all'
                ? 'bg-[#35251F] text-[#FBF8F2] shadow-xs'
                : 'bg-white hover:bg-[#F5EFE5] text-[#35251F] border border-[#35251F]/15'
              }`}
          >
            All Categories ({products.length})
          </button>

          {CATEGORY_DETAILS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              className={`px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-bold transition cursor-pointer ${activeCatId === cat.id
                  ? 'bg-[#35251F] text-[#FBF8F2] shadow-xs'
                  : 'bg-white hover:bg-[#F5EFE5] text-[#35251F] border border-[#35251F]/15'
                }`}
            >
              {cat.title} ({cat.productCount})
            </button>
          ))}
        </div>

        {/* Active Category Description Panel */}
        {currentCategory && (
          <div className="p-6 bg-white rounded-sm border border-[#35251F]/15 flex flex-col sm:flex-row items-center gap-6 card-luxury text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#FAF6EE] rounded-sm p-2 border border-[#35251F]/10 flex items-center justify-center">
              <img
                src={currentCategory.image}
                alt={currentCategory.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <span className="text-xs uppercase tracking-widest text-[#A7835E] font-bold">
                {currentCategory.badge}
              </span>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#35251F]">
                {currentCategory.title}
              </h3>
              {currentCategory.hindiTitle && (
                <span className="text-sm font-hindi-luxury text-[#725543] font-medium block">
                  {currentCategory.hindiTitle}
                </span>
              )}
              <p className="text-xs sm:text-sm text-[#35251F]/80 leading-relaxed font-light pt-1">
                {currentCategory.description}
              </p>
            </div>
          </div>
        )}

        {/* Filtered Products Grid: Loading, Error & Populated Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCardSkeleton count={3} />
          </div>
        ) : error ? (
          <CatalogErrorState message={error} onRetry={refetch} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </div>
        )}

      </section>

    </div>
  );
}
