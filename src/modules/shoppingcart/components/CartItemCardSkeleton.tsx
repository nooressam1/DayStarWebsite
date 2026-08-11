"use client";

import React from "react";

export function CartItemCardSkeleton() {
    return (
        <div className="flex flex-row w-full items-center justify-between py-3 border-b border-stone-200/60 animate-pulse">
            {/* Product Image & Title Section */}
            <div className="flex flex-row gap-5 items-center w-1/2">
                {/* Product Image Placeholder */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-stone-300/85 rounded-xl shrink-0 border border-stone-300/40 animate-pulse" />

                {/* Name and Variant Placeholders */}
                <div className="flex flex-col gap-2.5 w-full">
                    <div className="h-5 bg-stone-300/90 rounded-md w-3/4 sm:w-1/2 animate-pulse" />
                    <div className="h-4 bg-stone-300/70 rounded-md w-1/3 animate-pulse" />
                </div>
            </div>

            {/* Quantity Controls & Delete Icon Section */}
            <div className="flex flex-row gap-4 items-center justify-center w-1/4">
                <div className="h-9 w-24 bg-stone-300/85 rounded-lg animate-pulse" />
                <div className="h-5 w-5 bg-stone-300/70 rounded-md animate-pulse shrink-0" />
            </div>

            {/* Item Price Placeholder */}
            <div className="w-1/6 flex justify-end">
                <div className="h-5 w-16 bg-stone-300/90 rounded-md animate-pulse" />
            </div>
        </div>
    );
}

export default CartItemCardSkeleton;
