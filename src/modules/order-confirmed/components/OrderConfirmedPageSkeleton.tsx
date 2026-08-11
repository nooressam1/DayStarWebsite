"use client";

import React from "react";
import { SkeletonBox, SkeletonText, SkeletonButton } from "@/modules/shared/components/skeletons/SkeletonBox";

export function OrderConfirmedPageSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10 min-h-[70vh] animate-pulse">
            {/* Header Success Icon & Message Skeleton */}
            <div className="flex flex-col items-center justify-center text-center gap-4">
                <SkeletonBox className="h-20 w-20 rounded-full bg-stone-300/90" />
                <SkeletonBox className="h-8 w-64 rounded-md mt-2" />
                <SkeletonBox className="h-4 w-96 max-w-full rounded-md" />
            </div>

            {/* Order Info Card Skeleton */}
            <div className="bg-white border border-[#78534a]/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-stone-200/60 pb-6">
                    <div className="flex flex-col gap-2">
                        <SkeletonBox className="h-4 w-28 rounded-md" />
                        <SkeletonBox className="h-6 w-40 rounded-md" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <SkeletonBox className="h-4 w-28 rounded-md" />
                        <SkeletonBox className="h-6 w-32 rounded-md" />
                    </div>
                </div>

                {/* Items List Skeleton */}
                <div className="flex flex-col gap-4">
                    <SkeletonBox className="h-5 w-32 rounded-md mb-1" />
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex gap-4 items-center justify-between">
                            <div className="flex gap-4 items-center w-3/4">
                                <SkeletonBox className="h-16 w-16 rounded-xl shrink-0" />
                                <div className="flex flex-col gap-2 w-full">
                                    <SkeletonBox className="h-4 w-2/3 rounded-md" />
                                    <SkeletonBox className="h-3 w-1/3 rounded-md" />
                                </div>
                            </div>
                            <SkeletonBox className="h-5 w-16 rounded-md shrink-0" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <SkeletonButton className="h-12 w-full sm:w-56 rounded-xl" />
                <SkeletonButton className="h-12 w-full sm:w-56 bg-stone-300/80 rounded-xl" />
            </div>
        </div>
    );
}

export default OrderConfirmedPageSkeleton;
