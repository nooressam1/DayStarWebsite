"use client";

import React from "react";
import { SkeletonBox, SkeletonText, SkeletonButton } from "@/modules/shared/components/skeletons/SkeletonBox";
import { ProductCardSkeletonGrid } from "@/modules/shared";

export function SkincareTestSkeleton() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-8 min-h-[70vh] items-center text-center animate-pulse">
            <SkeletonBox className="h-4 w-32 rounded-full" />
            <SkeletonBox className="h-9 w-3/4 rounded-md mt-2" />
            <SkeletonBox className="h-4 w-2/3 rounded-md" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonBox key={i} className="h-24 w-full rounded-2xl border border-stone-200" />
                ))}
            </div>

            <div className="flex justify-between w-full mt-8">
                <SkeletonButton className="h-12 w-28 bg-stone-300/80 rounded-xl" />
                <SkeletonButton className="h-12 w-32 rounded-xl" />
            </div>
        </div>
    );
}

export function SkincareTestResultsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10 animate-pulse">
            <div className="flex flex-col items-center text-center gap-3">
                <SkeletonBox className="h-10 w-64 rounded-md" />
                <SkeletonBox className="h-4 w-96 max-w-full rounded-md" />
            </div>

            <div className="bg-white border border-[#78534a]/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
                <SkeletonBox className="h-7 w-48 rounded-md" />
                <SkeletonText lines={3} />
            </div>

            <div className="flex flex-col gap-6 mt-4">
                <SkeletonBox className="h-8 w-60 rounded-md" />
                <ProductCardSkeletonGrid count={3} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full" />
            </div>
        </div>
    );
}

export default SkincareTestSkeleton;
