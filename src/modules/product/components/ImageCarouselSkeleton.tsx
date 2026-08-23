"use client";

import React from "react";

export function ImageCarouselSkeleton() {
    return (
        <div className="w-full max-w-lg flex flex-col md:flex-row gap-4 items-start animate-pulse">
            {/* Thumbnail List Skeleton */}
            <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 w-full md:w-28 pb-2 md:pb-0 shrink-0">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-xl bg-stone-300/85 shrink-0 border border-stone-300/40 animate-pulse"
                    />
                ))}
            </div>

            {/* Main Image Display Box Skeleton */}
            <div className="relative order-1 md:order-2 aspect-square w-full h-[320px] sm:h-[450px] md:h-[500px] bg-stone-300/85 rounded-2xl overflow-hidden border border-stone-300/40 shadow-xs shrink-0 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
        </div>
    );
}

export default ImageCarouselSkeleton;
