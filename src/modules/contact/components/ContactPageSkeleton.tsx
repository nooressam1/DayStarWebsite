"use client";

import React from "react";
import { SkeletonBox, SkeletonText, SkeletonInput, SkeletonButton } from "@/modules/shared/components/skeletons/SkeletonBox";

export function ContactPageSkeleton() {
    return (
        <div className="flex flex-col w-full bg-[#faf5f3] overflow-x-hidden min-h-[80vh] animate-pulse">
            {/* 1. Hero Section Skeleton */}
            <section className="w-full h-[320px] sm:h-[360px] md:h-[400px] relative flex flex-col justify-center items-center px-6 text-center overflow-hidden bg-stone-300/80">
                <div className="relative z-10 max-w-3xl flex flex-col gap-4 items-center w-full">
                    <SkeletonBox className="h-10 sm:h-12 w-48 bg-stone-400/80 rounded-md" />
                    <SkeletonText lines={2} className="h-4 w-3/4 max-w-xl mx-auto bg-stone-400/60 rounded-md" />
                </div>
            </section>

            {/* 2. Main content split section Skeleton */}
            <section className="mx-auto max-w-8xl w-full px-6 sm:px-12 md:px-20 py-16 md:py-24 flex justify-center">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 w-full justify-center items-center max-w-6xl">
                    {/* Left Column: Contact Info Cards Skeleton */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-8 max-w-md">
                        <div className="flex flex-col gap-3">
                            <SkeletonBox className="h-9 w-48 rounded-md" />
                            <SkeletonText lines={2} />
                        </div>

                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl border border-[#78534a]/10 bg-white items-center">
                                    <SkeletonBox className="h-10 w-10 rounded-full shrink-0" />
                                    <SkeletonText lines={2} className="h-3.5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Contact Form Skeleton */}
                    <div className="w-full lg:w-1/2 max-w-xl bg-white border border-[#78534a]/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
                        <SkeletonBox className="h-7 w-36 rounded-md mb-2" />
                        <SkeletonInput />
                        <SkeletonInput />
                        <SkeletonInput />
                        <div className="flex flex-col gap-1.5 w-full">
                            <SkeletonBox className="h-3.5 w-20 rounded-md" />
                            <SkeletonBox className="h-28 w-full rounded-lg" />
                        </div>
                        <SkeletonButton className="h-12 w-full bg-stone-400/90 rounded-xl mt-2" />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ContactPageSkeleton;
