"use client";

import React from "react";
import { SkeletonBox, SkeletonText } from "@/modules/shared/components/skeletons/SkeletonBox";

export function AboutPageSkeleton() {
    return (
        <div className="flex flex-col w-full bg-[#faf5f3] overflow-x-hidden animate-pulse">
            {/* 1. Hero Section Skeleton */}
            <section className="w-full bg-[#78534a]/90 text-white flex flex-col-reverse md:flex-row items-center relative overflow-hidden md:h-[450px] lg:h-[520px]">
                <div className="w-full md:w-[45%] px-6 sm:px-12 md:pl-20 py-12 md:py-0 flex flex-col justify-center gap-5 text-left z-10">
                    <SkeletonBox className="h-10 sm:h-12 w-48 bg-white/40 rounded-md" />
                    <SkeletonText lines={3} className="h-4 bg-white/30 rounded-md" />
                </div>
                <div className="w-full md:w-[55%] h-[280px] sm:h-[350px] md:h-full relative overflow-hidden rounded-bl-[180px] md:rounded-bl-none md:rounded-l-full self-stretch bg-stone-300/80" />
            </section>

            {/* 2. Our Philosophy & Our Products Section Skeleton */}
            <section className="mx-auto max-w-7xl px-6 sm:px-12 md:px-20 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center w-full">
                <SkeletonBox className="w-full h-[320px] sm:h-[400px] md:h-[500px] rounded-[2rem]" />
                <div className="flex flex-col gap-10 justify-center">
                    <div className="flex flex-col gap-3">
                        <SkeletonBox className="h-8 w-44 rounded-md" />
                        <SkeletonText lines={3} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <SkeletonBox className="h-8 w-44 rounded-md" />
                        <SkeletonText lines={3} />
                    </div>
                </div>
            </section>

            {/* 3. Our Promise Banner Section Skeleton */}
            <section className="w-full h-[280px] sm:h-[350px] md:h-[420px] relative flex items-center justify-start overflow-hidden bg-stone-300/80 p-6 sm:p-12 md:pl-20">
                <div className="flex flex-col gap-4 max-w-xl sm:max-w-2xl md:max-w-3xl w-full">
                    <SkeletonBox className="h-10 sm:h-12 w-48 bg-stone-400/80 rounded-md" />
                    <SkeletonText lines={2} className="h-4 bg-stone-400/60 rounded-md" />
                </div>
            </section>

            {/* 4. Why choose us? Section Skeleton */}
            <section className="mx-auto max-w-7xl px-6 sm:px-12 md:px-20 py-16 md:py-24 flex flex-col gap-8 md:gap-12 w-full">
                <SkeletonBox className="h-8 w-48 rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white border border-[#78534a]/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
                            <SkeletonBox className="h-6 w-3/4 rounded-md" />
                            <SkeletonText lines={3} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default AboutPageSkeleton;
