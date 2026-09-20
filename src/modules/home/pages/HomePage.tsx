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
    useNewArrivalsQuery,
    useProductsQuery,
} from "@/app/api/hooks/useProductQueries";
import { Category, Product } from "@/app/api/types";
import { ProductCardSkeletonGrid, CategorySkeletonGrid, ItemsCarousel } from "@/modules/shared";
import { TestimonialsSection } from "../components/TestimonialsSection";

interface HomePageProps {
    initialCategories?: Category[];
    initialBestSellers?: Product[];
    initialSaleProducts?: Product[];
    initialnewArrivals?: Product[];
}

export default function HomePage({
    initialCategories = [],
    initialBestSellers = [],
    initialSaleProducts = [],
    initialnewArrivals = [],
}: HomePageProps = {}) {
    const { data: categories = initialCategories, isLoading: categoriesLoading } = useCategoriesQuery(
        initialCategories.length > 0 ? initialCategories : undefined
    );
    const { data: bestSellers = initialBestSellers, isLoading: bestSellersLoading } = useBestSellersQuery(
        initialBestSellers.length > 0 ? initialBestSellers : undefined
    );
    const { data: newArrivals = initialnewArrivals, isLoading: newArrivalsLoading } = useNewArrivalsQuery(
        initialnewArrivals.length > 0 ? initialnewArrivals : undefined
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
        <div className="flex flex-col gap-12 md:gap-25 w-full overflow-x-clip">

            <BannerImage />

            <PersonalizedRoutineSection />
            <div className="flex flex-col gap-10 md:gap-20 w-full min-w-0">
                {/* Popular Categories */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col justify-center items-center text-center px-4">
                        <h1 className="text-brand-primary-brown text-center font-bold font-serif text-2xl md:text-3xl">
                            Popular Categories
                        </h1>
                        <h1 className="text-brand-primary-brown/70 text-center font-light font-sans text-base md:text-lg">
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
                            <div className="hidden gap-0 lg:flex w-max animate-slide">
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

                <div className="flex flex-col gap-8 md:gap-20 items-start px-6 sm:px-10 md:px-15 w-full min-w-0">

                    {/* Best Selling Products */}
                    <div className="flex flex-col gap-10 items-start w-full">
                        <div className="relative flex items-center justify-center w-full">
                            <h1 className="text-brand-primary-brown text-center font-bold font-serif text-2xl md:text-3xl">
                                Best Selling Products
                            </h1>
                            <Link
                                href="/product?collection=best-sellers"
                                className="absolute right-0 text-brand-primary-brown/70 font-sans text-sm md:text-base cursor-pointer hover:underline"
                            >
                                View More
                            </Link>
                        </div>


                        {bestSellersLoading && bestSellers.length === 0 ? (
                            <ProductCardSkeletonGrid
                                count={4}
                                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full"
                            />
                        ) : (
                            <ItemsCarousel
                                items={bestSellers}
                                itemsPerPage={4}
                                responsive={{
                                    md: 2,
                                    sm: 2,
                                }}
                                gridClassName="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full"
                                renderItem={(product) => <ProductCard product={product} />}
                            />
                        )}
                    </div>

                    <SkincareBanner />

                    {/* Personalized Skincare Routine Carousel (shows when routine is cached) */}

                    <div className="flex flex-col gap-10 items-start w-full">
                        <div className="relative flex items-center justify-center w-full">
                            <h1 className="text-brand-primary-brown text-center font-bold font-serif text-2xl md:text-3xl">
                                New Arrivals
                            </h1>
                            <Link
                                href="/product?collection=new-arrivals"
                                className="absolute right-0 text-brand-primary-brown/70 font-sans text-sm md:text-base cursor-pointer hover:underline"
                            >
                                View More
                            </Link>
                        </div>


                        {newArrivalsLoading && newArrivals.length === 0 ? (
                            <ProductCardSkeletonGrid
                                count={4}
                                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full"
                            />
                        ) : (
                            <ItemsCarousel
                                items={newArrivals}
                                itemsPerPage={4}
                                responsive={{
                                    md: 2,
                                    sm: 2,
                                }}
                                gridClassName="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full"
                                renderItem={(product) => <ProductCard product={product} />}
                            />
                        )}
                    </div>
                    <TestimonialsSection></TestimonialsSection>

                    {/* Sale Banner + Product Carousel side by side on desktop, stacked on mobile/tablet */}
                    <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch min-w-0">
                        <div className={`flex ${hasSaleProducts || saleLoading ? "flex-1" : "w-full"} min-w-0`}>
                            <SaleBanner hasDiscountProducts={hasSaleProducts || saleLoading} />
                        </div>
                        {saleLoading && fiftyPercentOffProducts.length === 0 ? (
                            <div className="w-full lg:w-[300px] xl:w-[340px] lg:shrink-0 min-w-0">
                                <ProductCardSkeletonGrid count={1} className="w-full h-full" />
                            </div>
                        ) : hasSaleProducts ? (
                            <div className="w-full lg:w-[300px] xl:w-[340px] lg:shrink-0 min-w-0">
                                <ProductCarousel products={fiftyPercentOffProducts.slice(0, 4)} />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
