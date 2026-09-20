"use client";

import React from "react";

export function ImageCarouselSkeleton() {
    return (
        <div className="w-full flex flex-col md:flex-row gap-4 items-start animate-pulse">
            {/* Thumbnail List Skeleton */}
            <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 w-full md:w-20 lg:w-24 pb-2 md:pb-0 shrink-0">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-300/85 shrink-0 border border-stone-300/40 animate-pulse"
                    />
                ))}
            </div>

            {/* Main Image Display Box Skeleton */}
            <div className="relative order-1 md:order-2 aspect-square flex-1 min-w-0 w-full max-h-[500px] bg-stone-300/85 rounded-2xl overflow-hidden border border-stone-300/40 shadow-xs animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
        </div>
    );
}

export default ImageCarouselSkeleton;
