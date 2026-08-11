"use client";

import React from "react";
import { SkeletonBox, SkeletonText, SkeletonInput, SkeletonButton } from "@/modules/shared/components/skeletons/SkeletonBox";

export function CheckoutPageSkeleton() {
    return (
        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 h-full min-h-screen pb-32 animate-pulse">
            {/* Left Column: Personal Info, Address & Payment */}
            <div className="w-full flex flex-col gap-6 pr-0 md:pr-4">
                <SkeletonBox className="h-8 w-44 rounded-md mb-2" />

                {/* Personal Information */}
                <div className="flex flex-col gap-4">
                    <SkeletonBox className="h-5 w-40 rounded-md" />
                    <SkeletonInput />
                    <div className="grid grid-cols-2 gap-4">
                        <SkeletonInput />
                        <SkeletonInput />
                    </div>
                </div>

                {/* Address Details */}
                <div className="flex flex-col gap-4 mt-2">
                    <SkeletonBox className="h-5 w-40 rounded-md" />
                    <div className="grid grid-cols-2 gap-4">
                        <SkeletonInput />
                        <SkeletonInput />
                    </div>
                    <SkeletonInput />
                    <div className="grid grid-cols-3 gap-3">
                        <SkeletonInput />
                        <SkeletonInput />
                        <SkeletonInput />
                    </div>
                </div>

                {/* Delivery Type */}
                <div className="flex flex-col gap-3 mt-2">
                    <SkeletonBox className="h-5 w-32 rounded-md" />
                    <SkeletonBox className="h-20 w-full rounded-xl border border-stone-200" />
                    <SkeletonBox className="h-20 w-full rounded-xl border border-stone-200" />
                </div>

                {/* Select Payment Method */}
                <div className="flex flex-col gap-3 mt-2">
                    <SkeletonBox className="h-5 w-44 rounded-md" />
                    <SkeletonBox className="h-20 w-full rounded-xl border border-stone-200" />
                    <SkeletonBox className="h-20 w-full rounded-xl border border-stone-200" />
                </div>

                <SkeletonButton className="h-14 w-full bg-stone-400/90 rounded-xl mt-4" />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-0.5 bg-[#78534A]/10 self-stretch my-2" />

            {/* Right Column: Order Summary */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
                <SkeletonBox className="h-8 w-44 rounded-md" />

                <div className="px-2 py-4 flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <SkeletonBox className="h-5 w-32 rounded-md" />
                        <div className="flex justify-between py-2">
                            <SkeletonBox className="h-4 w-24 rounded-md" />
                            <SkeletonBox className="h-4 w-16 rounded-md" />
                        </div>
                        <div className="flex justify-between py-2">
                            <SkeletonBox className="h-4 w-20 rounded-md" />
                            <SkeletonBox className="h-4 w-16 rounded-md" />
                        </div>
                        <div className="flex justify-between py-2">
                            <SkeletonBox className="h-4 w-24 rounded-md" />
                            <SkeletonBox className="h-4 w-16 rounded-md" />
                        </div>
                    </div>

                    <div>
                        <div className="h-0.5 w-full bg-[#78534A]/10 mb-4" />
                        <div className="flex justify-between py-2">
                            <SkeletonBox className="h-6 w-16 rounded-md" />
                            <SkeletonBox className="h-6 w-24 bg-stone-400/90 rounded-md" />
                        </div>
                    </div>

                    <SkeletonBox className="h-5 w-36 rounded-md mt-2" />
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <SkeletonBox className="h-20 w-20 rounded-xl shrink-0" />
                                <div className="flex flex-col gap-2 w-full">
                                    <SkeletonBox className="h-4 w-3/4 rounded-md" />
                                    <SkeletonBox className="h-3 w-1/2 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPageSkeleton;
