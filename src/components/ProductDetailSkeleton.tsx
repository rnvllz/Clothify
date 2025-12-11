import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Skeleton */}
        <div>
          <Skeleton className="w-full aspect-square rounded-lg mb-6" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full aspect-square rounded" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-6">
          {/* Title */}
          <Skeleton className="w-3/4 h-8" />

          {/* Price */}
          <Skeleton className="w-1/3 h-7" />

          {/* Description */}
          <div className="space-y-3">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <Skeleton className="w-20 h-4" />
            <div className="grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="w-full h-10" />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>

          {/* Additional Info */}
          <div className="space-y-3 pt-6 border-t">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
