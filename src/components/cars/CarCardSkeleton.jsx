import React, { memo } from 'react';

function CarCardSkeleton() {
  return (
    <div className="bg-gradient-to-b from-[#1A1A1C] to-[#151517] rounded-2xl overflow-hidden border border-[#2A2A2D]">
      {/* Image skeleton */}
      <div className="aspect-[16/10] bg-[#2A2A2D] animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-[#2A2A2D] rounded-lg w-3/4 animate-pulse" />
          <div className="h-8 bg-[#2A2A2D] rounded-lg w-1/2 animate-pulse" />
        </div>
        
        {/* Specs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-4 bg-[#2A2A2D] rounded animate-pulse" />
          <div className="h-4 bg-[#2A2A2D] rounded animate-pulse" />
          <div className="h-4 bg-[#2A2A2D] rounded animate-pulse" />
          <div className="h-4 bg-[#2A2A2D] rounded animate-pulse" />
        </div>
        
        {/* Location */}
        <div className="pt-3 border-t border-[#2A2A2D]">
          <div className="h-4 bg-[#2A2A2D] rounded w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default memo(CarCardSkeleton);