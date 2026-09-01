"use client";

import React from "react";

export interface CategorySkeletonProps {
  className?: string;
}

export function CategorySkeleton({ className = "" }: CategorySkeletonProps) {
  return (
    <div
      className={`relative rounded-sm md:rounded-2xl w-full md:h-[412px] h-[150px] bg-stone-300/80 animate-pulse flex items-center justify-center p-4 overflow-hidden border border-black/5 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      <div className="h-6 sm:h-7 md:h-8 w-2/3 sm:w-1/2 bg-stone-400/80 rounded-md animate-pulse shadow-xs z-10" />
    </div>
  );
}

export interface CategorySkeletonGridProps {
  count?: number;
  className?: string;
}

export function CategorySkeletonGrid({
  count = 4,
  className = "grid grid-cols-2 md:grid-cols-4 gap-5 w-full px-10 md:px-5",
}: CategorySkeletonGridProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <CategorySkeleton key={index} />
      ))}
    </div>
  );
}

export default CategorySkeleton;
