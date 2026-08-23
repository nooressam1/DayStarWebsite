"use client";

import React from "react";
import { SkeletonBox, SkeletonText, SkeletonInput, SkeletonButton } from "@/modules/shared/components/skeletons/SkeletonBox";

export function AccountPageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 flex flex-col md:flex-row gap-8 min-h-[70vh] animate-pulse">
            {/* Left Sidebar Navigation Skeleton */}
            <div className="w-full md:w-64 flex flex-col gap-3 shrink-0">
                <div className="flex gap-3 items-center p-4 bg-white rounded-xl border border-stone-200 mb-2">
                    <SkeletonBox className="h-12 w-12 rounded-full shrink-0" />
                    <div className="flex flex-col gap-2 w-full">
                        <SkeletonBox className="h-4 w-3/4 rounded-md" />
                        <SkeletonBox className="h-3 w-1/2 rounded-md" />
                    </div>
                </div>

                {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonBox key={i} className="h-11 w-full rounded-xl bg-white border border-stone-200" />
                ))}
            </div>

            {/* Main Account Area Skeleton */}
            <div className="flex-1 bg-white border border-[#78534a]/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
                <SkeletonBox className="h-8 w-48 rounded-md mb-2" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SkeletonInput />
                    <SkeletonInput />
                </div>
                <SkeletonInput />
                <SkeletonButton className="h-12 w-44 rounded-xl mt-4" />
            </div>
        </div>
    );
}

export default AccountPageSkeleton;
