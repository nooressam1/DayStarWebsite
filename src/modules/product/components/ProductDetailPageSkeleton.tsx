"use client";

import React from "react";
import { ImageCarouselSkeleton } from "./ImageCarouselSkeleton";
import { ProductCardSkeletonGrid } from "@/modules/shared";

export function ProductDetailPageSkeleton() {
    return (
        <div className="py-10 px-6 sm:px-10 flex flex-col gap-16 animate-pulse">
            {/* Upper Section: Carousel + Details */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-14 items-start w-full">
                {/* Image Carousel Skeleton Column */}
                <div className="w-full md:w-1/2 shrink-0">
                    <ImageCarouselSkeleton />
                </div>

                {/* Product Details Skeleton Column */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                    {/* Title & Price */}
                    <div className="flex flex-col gap-3">
                        <div className="h-8 w-3/4 bg-stone-300/90 rounded-md animate-pulse" />
                        <div className="h-7 w-1/3 bg-stone-300/95 rounded-md animate-pulse mt-1" />
                        <div className="h-4 w-full bg-stone-300/70 rounded-md animate-pulse mt-2" />
                        <div className="h-4 w-4/5 bg-stone-300/60 rounded-md animate-pulse" />
                    </div>

                    {/* Size Selector Skeleton */}
                    <div className="flex flex-col gap-3">
                        <div className="h-4 w-16 bg-stone-300/70 rounded-md animate-pulse" />
                        <div className="flex gap-3">
                            <div className="h-10 w-20 bg-stone-300/85 rounded-lg animate-pulse" />
                            <div className="h-10 w-20 bg-stone-300/85 rounded-lg animate-pulse" />
                            <div className="h-10 w-20 bg-stone-300/85 rounded-lg animate-pulse" />
                        </div>
                    </div>

                    {/* Action Buttons Skeleton */}
                    <div className="flex flex-col gap-3.5 mt-2">
                        {/* Quantity Selector */}
                        <div className="h-10 w-32 bg-stone-300/85 rounded-lg animate-pulse" />
                        {/* Buy Now Button */}
                        <div className="h-14 w-full bg-stone-400/90 rounded-xl animate-pulse shadow-sm" />
                        {/* Add to Cart & Favorite Button */}
                        <div className="flex flex-row gap-2">
                            <div className="h-14 flex-1 bg-stone-300/90 rounded-xl animate-pulse" />
                            <div className="h-14 w-14 bg-stone-300/90 rounded-xl animate-pulse shrink-0" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products Section Skeleton */}
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 mt-4">
                <div className="h-8 w-56 bg-stone-300/90 rounded-md animate-pulse" />
                <ProductCardSkeletonGrid count={4} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full" />
            </div>
        </div>
    );
}

export default ProductDetailPageSkeleton;
