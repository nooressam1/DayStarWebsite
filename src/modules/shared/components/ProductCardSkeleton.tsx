"use client";

import React from "react";

export interface ProductCardSkeletonProps {
    className?: string;
}

export function ProductCardSkeleton({ className = "" }: ProductCardSkeletonProps) {
    return (
        <div className={`flex flex-col gap-2 w-full h-full border border-brand-primary-brown/15 rounded-lg overflow-hidden bg-white shadow-xs ${className}`}>
            {/* Product Image Skeleton */}
            <div className="relative w-full aspect-[4/5] bg-stone-300/85 animate-pulse overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>

            {/* Product Details Skeleton */}
            <div className="p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-4 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                    {/* Title Skeleton */}
                    <div className="h-4 sm:h-5 bg-stone-300/90 rounded-md w-3/4 animate-pulse" />
                    {/* Price Skeleton */}
                    <div className="h-3.5 sm:h-4 bg-stone-300/95 rounded-md w-1/3 mt-1 animate-pulse" />
                </div>

                {/* Actions Skeleton (hidden on mobile like real card) */}
                <div className="hidden md:flex flex-row gap-2 items-center">
                    {/* View Button Skeleton */}
                    <div className="h-12 flex-1 bg-stone-300/90 rounded-lg animate-pulse" />
                    {/* Favorite Button Skeleton */}
                    <div className="h-12 w-12 bg-stone-300/90 rounded-lg animate-pulse shrink-0" />
                </div>
            </div>
        </div>
    );
}

export interface ProductCardSkeletonGridProps {
    count?: number;
    className?: string;
}

export function ProductCardSkeletonGrid({
    count = 6,
    className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full",
}: ProductCardSkeletonGridProps) {
    return (
        <div className={className}>
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}

export default ProductCardSkeleton;
