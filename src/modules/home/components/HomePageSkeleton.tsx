"use client";

import { ProductCardSkeletonGrid } from "@/modules/shared";

export function HomePageSkeleton() {
    return (
        <div className="flex flex-col gap-12 md:gap-25">
            {/* Banner Skeleton with Header Text and Button Placeholders */}
            <div className="w-full flex overflow-hidden justify-start items-center h-[500px] sm:h-[700px] md:h-[950px] relative bg-stone-300/80 rounded-2xl p-6 sm:p-12 md:pl-20 animate-pulse">
                <div className="flex flex-col items-start justify-center gap-5 max-w-xl md:max-w-3xl w-full">
                    {/* Header text line placeholders */}
                    <div className="h-8 sm:h-12 bg-stone-400/70 rounded-md w-11/12 animate-pulse" />
                    <div className="h-8 sm:h-12 bg-stone-400/70 rounded-md w-4/5 animate-pulse" />
                    <div className="h-8 sm:h-12 bg-stone-400/70 rounded-md w-3/5 animate-pulse" />

                    {/* Shop Now Button Skeleton */}
                    <div className="h-14 sm:h-16 w-44 sm:w-56 bg-stone-400/90 rounded-xl animate-pulse mt-4 shadow-sm" />
                </div>
            </div>

            <div className="flex flex-col gap-12 md:gap-20">
                {/* Popular Categories Skeleton */}
                <div className="flex flex-col gap-8 items-center px-4">
                    <div className="flex flex-col justify-center items-center text-center gap-2">
                        <div className="h-8 w-56 bg-stone-300 rounded-md animate-pulse" />
                        <div className="h-4 w-72 bg-stone-300/70 rounded-md animate-pulse" />
                    </div>

                    {/* Categories Skeleton Grid - Accurately matching CategoriesBox (h-[150px] md:h-[412px], rounded-sm md:rounded-2xl, centered text) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full px-10 md:px-15">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="relative rounded-sm md:rounded-2xl w-full h-[150px] md:h-[412px] bg-stone-300/85 animate-pulse flex items-center justify-center p-4 overflow-hidden border border-black/5"
                            >
                                {/* Centered Category Name Text Placeholder */}
                                <div className="h-6 sm:h-7 md:h-8 w-2/3 sm:w-1/2 bg-stone-400/80 rounded-md animate-pulse shadow-xs" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Selling Products Skeleton */}
                <div className="flex flex-col gap-8 md:gap-12 items-start px-10 sm:px-10 md:px-15">
                    <div className="flex flex-col gap-5 items-start w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="h-8 w-60 bg-stone-300 rounded-md animate-pulse" />
                            <div className="h-5 w-24 bg-stone-300/75 rounded-md animate-pulse" />
                        </div>
                        <ProductCardSkeletonGrid count={4} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full" />
                    </div>

                    {/* Skincare Banner Skeleton */}
                    <div className="w-full h-[300px] sm:h-[400px] bg-stone-300/85 rounded-2xl p-8 sm:p-14 flex flex-col justify-center items-start gap-4 animate-pulse">
                        <div className="h-8 sm:h-10 w-72 bg-stone-400/70 rounded-md animate-pulse" />
                        <div className="h-4 sm:h-5 w-96 max-w-full bg-stone-400/60 rounded-md animate-pulse" />
                        <div className="h-12 w-44 bg-stone-400/90 rounded-lg animate-pulse mt-2" />
                    </div>

                    {/* Second Best Selling / Featured Section Skeleton */}
                    <div className="flex flex-col gap-5 items-start w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="h-8 w-60 bg-stone-300 rounded-md animate-pulse" />
                            <div className="h-5 w-24 bg-stone-300/75 rounded-md animate-pulse" />
                        </div>
                        <ProductCardSkeletonGrid count={4} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePageSkeleton;
