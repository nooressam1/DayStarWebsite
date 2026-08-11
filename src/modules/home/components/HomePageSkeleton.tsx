"use client";

import { ProductCardSkeletonGrid } from "@/modules/shared";

export function HomePageSkeleton() {
    return (
        <div className="flex flex-col gap-12 md:gap-25 animate-pulse">
            {/* Banner Skeleton */}
            <div className="w-full h-[350px] sm:h-[450px] md:h-[600px] bg-stone-200/70 rounded-2xl relative overflow-hidden flex justify-center items-center">
                <div className="w-64 h-32 bg-stone-300/50 rounded-xl" />
            </div>

            <div className="flex flex-col gap-12 md:gap-20">
                {/* Popular Categories Skeleton */}
                <div className="flex flex-col gap-8 items-center px-4">
                    <div className="flex flex-col justify-center items-center text-center gap-2">
                        <div className="h-8 w-48 bg-stone-200/80 rounded-md" />
                        <div className="h-4 w-64 bg-stone-200/50 rounded-md" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full px-10 md:px-15">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-44 sm:h-52 bg-stone-200/70 rounded-xl w-full" />
                        ))}
                    </div>
                </div>

                {/* Best Selling Products Skeleton */}
                <div className="flex flex-col gap-8 md:gap-12 items-start px-10 sm:px-10 md:px-15">
                    <div className="flex flex-col gap-5 items-start w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="h-8 w-56 bg-stone-200/80 rounded-md" />
                            <div className="h-4 w-20 bg-stone-200/60 rounded-md" />
                        </div>
                        <ProductCardSkeletonGrid count={4} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full" />
                    </div>

                    {/* Skincare Banner Skeleton */}
                    <div className="w-full h-[300px] sm:h-[400px] bg-stone-200/70 rounded-2xl" />

                    {/* On Sale / Best Selling Products Skeleton */}
                    <div className="flex flex-col gap-5 items-start w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="h-8 w-56 bg-stone-200/80 rounded-md" />
                            <div className="h-4 w-20 bg-stone-200/60 rounded-md" />
                        </div>
                        <ProductCardSkeletonGrid count={4} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePageSkeleton;
