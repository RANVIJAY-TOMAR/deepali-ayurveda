import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface CatalogErrorStateProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export default function CatalogErrorState({
  message = 'Unable to connect to the Supabase apothecary database. Please check your network or try again.',
  onRetry,
  title = 'Catalog Temporarily Unavailable'
}: CatalogErrorStateProps) {
  return (
    <div className="py-16 px-6 text-center bg-white rounded-sm border border-[#35251F]/15 max-w-lg mx-auto space-y-4 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-[#F5EFE5] text-[#A7835E] flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-serif-luxury text-xl font-bold text-[#35251F]">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#35251F]/75 font-light leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <button
            onClick={onRetry}
            className="btn-bronze inline-flex items-center gap-2 px-6 py-2.5 rounded-sm text-xs uppercase tracking-widest font-bold shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}
    </div>
  );
}

