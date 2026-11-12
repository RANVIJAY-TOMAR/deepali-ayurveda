import React from 'react';

interface ProductCardSkeletonProps {
  count?: number;
}

export default function ProductCardSkeleton({ count = 3 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-sm border border-[#35251F]/15 overflow-hidden flex flex-col justify-between h-full p-4 space-y-4 animate-pulse"
        >
          {/* Top Badge placeholder */}
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-[#35251F]/10 rounded-xs" />
            <div className="h-6 w-6 rounded-full bg-[#35251F]/10" />
          </div>

          {/* Image Placeholder */}
          <div className="aspect-square w-full bg-[#FAF6EE] rounded-sm flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#35251F]/5" />
          </div>

          {/* Content Placeholders */}
          <div className="space-y-3 pt-2 text-left">
            <div className="h-3 w-28 bg-[#A7835E]/20 rounded-xs" />
            <div className="h-5 w-3/4 bg-[#35251F]/15 rounded-xs" />
            <div className="h-3 w-1/2 bg-[#35251F]/10 rounded-xs" />
            <div className="space-y-1.5 pt-2">
              <div className="h-2.5 w-full bg-[#35251F]/10 rounded-xs" />
              <div className="h-2.5 w-5/6 bg-[#35251F]/10 rounded-xs" />
            </div>
          </div>

          {/* Price & Action Button Placeholder */}
          <div className="pt-3 border-t border-[#35251F]/10 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-6 w-20 bg-[#35251F]/20 rounded-xs" />
              <div className="h-3 w-16 bg-[#35251F]/10 rounded-xs" />
            </div>
            <div className="h-10 w-full bg-[#35251F]/10 rounded-sm" />
          </div>
        </div>
      ))}
    </>
  );
}

