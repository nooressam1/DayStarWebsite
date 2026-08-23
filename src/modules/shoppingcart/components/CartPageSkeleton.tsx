"use client";

import React from "react";
import { CartItemCardSkeleton } from "./CartItemCardSkeleton";

export function CartPageSkeleton() {
    return (
        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 min-h-screen pb-32 animate-pulse">
            {/* Left Column: Cart Items List */}
            <div className="w-full">
                {/* Cart Header Title */}
                <div className="h-7 w-44 bg-stone-300/90 rounded-md animate-pulse mb-6" />

                <div className="px-2 sm:px-5">
                    {/* Cart Items Table Header */}
                    <div className="flex flex-row py-4 justify-between border-b border-stone-200">
                        <div className="h-4 w-20 bg-stone-300/70 rounded-md animate-pulse" />
                        <div className="h-4 w-16 bg-stone-300/70 rounded-md animate-pulse" />
                        <div className="h-4 w-12 bg-stone-300/70 rounded-md animate-pulse" />
                    </div>

                    {/* Cart Items List Skeleton */}
                    <div className="flex flex-col gap-4 mt-4">
                        <CartItemCardSkeleton />
                        <CartItemCardSkeleton />
                        <CartItemCardSkeleton />
                    </div>
                </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-0.5 bg-[#78534A]/10 self-stretch my-2" />

            {/* Right Column: Order Summary */}
            <div className="w-full md:w-1/2">
                {/* Summary Title */}
                <div className="h-7 w-44 bg-stone-300/90 rounded-md animate-pulse mb-6" />

                <div className="px-2 py-2 flex flex-col gap-8">
                    {/* Coupon Input Skeleton */}
                    <div className="flex flex-col gap-3">
                        <div className="h-4 w-24 bg-stone-300/70 rounded-md animate-pulse" />
                        <div className="flex gap-2">
                            <div className="h-12 flex-1 bg-stone-300/80 rounded-lg animate-pulse" />
                            <div className="h-12 w-28 bg-stone-300/90 rounded-lg animate-pulse" />
                        </div>
                    </div>

                    {/* Financial Summary Lines */}
                    <div className="flex flex-col gap-4">
                        <div className="w-full flex py-2 flex-row justify-between items-center">
                            <div className="h-4 w-20 bg-stone-300/70 rounded-md animate-pulse" />
                            <div className="h-5 w-20 bg-stone-300/90 rounded-md animate-pulse" />
                        </div>
                        <div className="w-full flex py-2 flex-row justify-between items-center">
                            <div className="h-4 w-20 bg-stone-300/70 rounded-md animate-pulse" />
                            <div className="h-5 w-16 bg-stone-300/90 rounded-md animate-pulse" />
                        </div>
                        <div className="w-full flex py-2 flex-row justify-between items-center">
                            <div className="h-4 w-24 bg-stone-300/70 rounded-md animate-pulse" />
                            <div className="h-5 w-16 bg-stone-300/90 rounded-md animate-pulse" />
                        </div>
                    </div>

                    {/* Line Divider & Total */}
                    <div>
                        <div className="h-0.5 w-full bg-[#78534A]/10 mb-4" />
                        <div className="w-full flex py-2 flex-row justify-between items-center">
                            <div className="h-6 w-16 bg-stone-300/90 rounded-md animate-pulse" />
                            <div className="h-6 w-24 bg-stone-400/90 rounded-md animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Checkout Button Skeleton */}
                <div className="h-14 w-full bg-stone-400/90 rounded-xl animate-pulse mt-6 shadow-sm" />
            </div>
        </div>
    );
}

export default CartPageSkeleton;
