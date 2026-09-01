"use client";

import React from "react";
import Link from "next/link";
import BannerImage from "../components/BannerImage";
import { CategoriesBox } from "../components/CategoriesBox";
import { ProductCard } from "../components/ProductCard";
import { PersonalizedRoutineSection } from "../components/PersonalizedRoutineSection";
import { SkincareBanner } from "../components/SkincareBanner";
import { SaleBanner } from "../components/SaleBanner";
import { ProductCarousel } from "../components/ProductCarousel";
import {
    useCategoriesQuery,
    useBestSellersQuery,
    useProductsQuery,
} from "@/app/api/hooks/useProductQueries";
import { Category, Product } from "@/app/api/types";
import { ProductCardSkeletonGrid, CategorySkeletonGrid } from "@/modules/shared";

interface HomePageProps {
    initialCategories?: Category[];
    initialBestSellers?: Product[];
    initialSaleProducts?: Product[];
}

export default function HomePage({
    initialCategories = [],
    initialBestSellers = [],
    initialSaleProducts = [],
}: HomePageProps = {}) {
    const { data: categories = initialCategories, isLoading: categoriesLoading } = useCategoriesQuery(
        initialCategories.length > 0 ? initialCategories : undefined
    );
    const { data: bestSellers = initialBestSellers, isLoading: bestSellersLoading } = useBestSellersQuery(
        initialBestSellers.length > 0 ? initialBestSellers : undefined
    );
    const { data: saleData, isLoading: saleLoading } = useProductsQuery(
        {
            collection: "sale",
            discount: 50,
        },
        initialSaleProducts.length > 0 ? { items: initialSaleProducts, total: initialSaleProducts.length } : undefined
    );

    const fiftyPercentOffProducts = saleData?.items || initialSaleProducts;
    const hasSaleProducts = Boolean(fiftyPercentOffProducts && fiftyPercentOffProducts.length > 0);

    return (
        <div className="flex flex-col gap-12 md:gap-25">
            <BannerImage />
            <div className="flex flex-col gap-12 md:gap-20">
                {/* Popular Categories */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col justify-center items-center text-center px-4">
                        <h1 className="text-brand-primary-brown font-bold font-serif text-2xl md:text-3xl">
                            Popular Categories
                        </h1>
                        <h1 className="text-brand-primary-brown/70 font-light font-sans text-base md:text-lg">
                            Everything you need to care for &amp; more
                        </h1>
                    </div>

                    {categoriesLoading && categories.length === 0 ? (
                        <CategorySkeletonGrid count={4} />
                    ) : (
                        <div className="overflow-hidden">
                            {/* Mobile and Tablet: static grid */}
                            <div className="grid grid-cols-2 lg:hidden gap-5 px-10 md:px-5">
                                {categories.map((cat) => (
                                    <Link key={cat.id} href={`/product?category=${cat.id}`} className="cursor-pointer">
                                        <CategoriesBox photo={cat.photo} categoryName={cat.name} />
                                    </Link>
                                ))}
                            </div>

                            {/* Desktop: infinite marquee slider */}
                            <div className="hidden gap-5 lg:flex w-max animate-slide">
                                {[...categories, ...categories].map((cat, index) => (
                                    <Link
                                        key={`${cat.id}-${index}`}
                                        href={`/product?category=${cat.id}`}
                                        className="cursor-pointer w-[20vw] shrink-0"
                                    >
                                        <CategoriesBox photo={cat.photo} categoryName={cat.name} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-8 md:gap-12 items-start px-10 sm:px-10 md:px-15">
                    {/* Best Selling Products */}
                    <div className="flex flex-col gap-5 items-start w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                            <h1 className="text-brand-primary-brown font-bold font-serif text-2xl md:text-3xl">
                                Best Selling Products
                            </h1>
                            <Link href="/product?collection=best-sellers">
                                <h1 className="text-brand-primary-brown/70 font-regular font-sans text-sm md:text-md cursor-pointer hover:underline">
                                    View More
                                </h1>
                            </Link>
                        </div>

                        {bestSellersLoading && bestSellers.length === 0 ? (
                            <ProductCardSkeletonGrid
                                count={4}
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full"
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                                {bestSellers.slice(0, 4).map((product, index) => (
                                    <div
                                        key={product.id}
                                        className={index === 2 ? "hidden md:block" : index === 3 ? "hidden lg:block" : ""}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <SkincareBanner />

                    {/* Personalized Skincare Routine Carousel (shows when routine is cached) */}
                    <PersonalizedRoutineSection />

                    {/* Sale Banner + Product Carousel side by side (or full-width if no 50% products) */}
                    <div className="flex flex-col md:flex-row gap-5 w-full items-stretch">
                        <div className={`flex ${hasSaleProducts || saleLoading ? "flex-[4]" : "w-full"} w-full min-h-[350px] md:min-h-0`}>
                            <SaleBanner hasDiscountProducts={hasSaleProducts || saleLoading} />
                        </div>
                        {saleLoading && fiftyPercentOffProducts.length === 0 ? (
                            <div className="hidden sm:flex flex-[2] w-full">
                                <ProductCardSkeletonGrid count={1} className="w-full h-full" />
                            </div>
                        ) : hasSaleProducts ? (
                            <div className="flex flex-[2] w-full">
                                <ProductCarousel products={fiftyPercentOffProducts.slice(0, 4)} />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
