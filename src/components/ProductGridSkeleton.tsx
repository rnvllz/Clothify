import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridSkeletonProps {
  count?: number;
}

const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-4">
          {/* Image Skeleton */}
          <Skeleton className="w-full aspect-square rounded-lg" />
          
          {/* Title Skeleton */}
          <Skeleton className="w-3/4 h-4" />
          
          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-5/6 h-3" />
          </div>
          
          {/* Price Skeleton */}
          <Skeleton className="w-1/3 h-5" />
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
