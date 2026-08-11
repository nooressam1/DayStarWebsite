"use client";

import React from "react";
import { ProductCardSkeletonGrid } from "@/modules/shared";

export function ProductCatalogSkeleton() {
    return (
        <div className="min-h-screen bg-[#faf5f3] font-sans antialiased text-[#78534a]">
            {/* 1. Header Hero Banner Skeleton */}
            <div className="w-full h-[320px] sm:h-[620px] relative flex justify-center items-center overflow-hidden bg-stone-300/80 animate-pulse">
                {/* Glassmorphic Overlay Box Skeleton */}
                <div className="flex flex-col w-full gap-3 relative z-10 bg-[#0d3b41]/75 backdrop-blur-md border border-white/10 rounded-lg py-8 px-12 sm:px-20 text-center max-w-xs sm:max-w-sm md:max-w-3xl shadow-lg justify-center items-center animate-pulse">
                    {/* Header Title Skeleton */}
                    <div className="h-10 sm:h-14 w-36 sm:w-56 bg-white/40 rounded-md animate-pulse" />
                    {/* Header Subtitle Skeleton */}
                    <div className="h-4 w-28 sm:w-36 bg-white/30 rounded-md animate-pulse mt-2" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* 2. Collection Title Skeleton */}
                <div className="h-8 sm:h-10 w-48 sm:w-64 bg-stone-300/90 rounded-md animate-pulse mb-6" />

                {/* 3. Filters Layout Section Skeleton */}
                <div className="mb-10 flex flex-col gap-3">
                    <div className="h-3 w-16 bg-stone-300/70 rounded-md animate-pulse" />

                    <div className="flex flex-wrap items-center gap-3 w-full">
                        {/* Filter Buttons Placeholders */}
                        <div className="h-9 w-24 bg-stone-300/80 rounded-md animate-pulse" />
                        <div className="h-9 w-32 bg-stone-300/80 rounded-md animate-pulse" />
                        <div className="h-9 w-24 bg-stone-300/80 rounded-md animate-pulse" />
                        <div className="h-9 w-36 bg-stone-300/80 rounded-md animate-pulse" />
                        <div className="h-9 w-20 bg-stone-300/80 rounded-md animate-pulse" />

                        {/* Search Bar Input Skeleton */}
                        <div className="h-9 w-full sm:w-64 sm:ml-auto bg-stone-300/90 rounded-md animate-pulse" />
                    </div>
                </div>

                {/* 4. Product Cards Grid Skeleton */}
                <ProductCardSkeletonGrid count={6} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12" />
            </div>
        </div>
    );
}

export default ProductCatalogSkeleton;
