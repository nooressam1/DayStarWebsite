"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSkincareRoutineStore, addRoutineToCart, CustomButton } from "@/modules/shared";
import { ProductCard } from "./ProductCard";
import { Product } from "@/app/api/types";
import { RecommendedProduct } from "@/modules/skincare-test/pages/SkincareTestResultsPage";
import { Check, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_VIEW = 4;

export function PersonalizedRoutineSection() {
    const [mounted, setMounted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAddedToCart, setIsAddedToCart] = useState(false);

    const {
        rawRoutine,
        morningProducts,
        eveningProducts,
        allProducts,
        hasRoutine,
    } = useSkincareRoutineStore();

    useEffect(() => {
        setMounted(true);
    }, []);


    // Prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    const hasStoredRoutine =
        hasRoutine() &&
        (morningProducts.length > 0 || eveningProducts.length > 0 || allProducts.length > 0 || rawRoutine);

    // If no routine is saved yet, return null so the section does not render empty
    if (!hasStoredRoutine) {
        return null;
    }

    // Helper to convert RecommendedProduct into standard Product for ProductCard
    const toProduct = (rp: RecommendedProduct): Product => ({
        id: rp.product_id,
        category_id: rp.category || null,
        name: rp.name,
        description: rp.whyChosen || null,
        images: rp.photo ? [rp.photo] : [],
        slug: (rp as any).slug || rp.product_id,
        price: rp.price || 0,
        created_at: new Date().toISOString(),
        is_active: true,
    });

    // Helper to extract products from raw routine object if available
    const extractRawProducts = (): Product[] => {
        if (!rawRoutine) return [];

        const routineObj = rawRoutine as any;

        if (routineObj.allRecommendedProducts) {
            return routineObj.allRecommendedProducts
                .map((i: any) => i?.product || i)
                .filter((p: any) => p && p.id && p.name);
        }
        if (routineObj.recommendedProducts) {
            return routineObj.recommendedProducts
                .map((i: any) => i?.product || i)
                .filter((p: any) => p && p.id && p.name);
        }

        return [];
    };

    const getDisplayProducts = (): { products: Product[]; recommendedList: RecommendedProduct[] } => {

        const raw = extractRawProducts();
        if (raw.length > 0) return { products: raw, recommendedList: allProducts };
        const combined = allProducts.length > 0 ? allProducts : [...morningProducts, ...eveningProducts];
        return { products: combined.map(toProduct), recommendedList: combined };
    };

    const { products: displayProducts, recommendedList } = getDisplayProducts();

    // Deduplicate by id
    const uniqueProducts: Product[] = [];
    const seenIds = new Set<string>();
    for (const p of displayProducts) {
        if (p?.id && !seenIds.has(p.id)) {
            seenIds.add(p.id);
            uniqueProducts.push(p);
        }
    }

    const totalProducts = uniqueProducts.length;
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_VIEW);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1 < totalPages ? prev + 1 : 0));
    };

    // Visible slice for the current page
    const visibleProducts = uniqueProducts.slice(
        currentIndex * ITEMS_PER_VIEW,
        currentIndex * ITEMS_PER_VIEW + ITEMS_PER_VIEW
    );

    const hasPurchasableItems =
        recommendedList.some((p) => p.variant_id && p.variant_id !== p.product_id) ||
        uniqueProducts.some((p) => p.variants && p.variants.length > 0);

    const handleAddRoutineToCart = () => {
        if (!hasPurchasableItems) return;

        const validRecommended = recommendedList.filter(
            (p) => p.variant_id && p.variant_id !== p.product_id
        );
        const validProducts = uniqueProducts.filter(
            (p) => p.variants && p.variants.length > 0
        );

        if (validRecommended.length > 0) {
            addRoutineToCart(validRecommended);
        } else if (validProducts.length > 0) {
            addRoutineToCart(validProducts);
        }

        setIsAddedToCart(true);
        setTimeout(() => {
            setIsAddedToCart(false);
        }, 3000);
    };

    if (totalProducts === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8 items-start w-full">
            <div className=" relative flex flex-col sm:flex-row justify-center sm:justify-center items-center sm:items-center gap-4 w-full">
                <div className="flex flex-col  flex-wrap items-center gap-3 md:gap-4">
                    <h1 className="text-brand-primary-brown font-bold font-serif text-2xl md:text-3xl">
                        Your New Skincare Routine
                    </h1>
                    <CustomButton
                        onClick={handleAddRoutineToCart}
                        disabled={isAddedToCart || !hasPurchasableItems}
                        icon={isAddedToCart ? Check : ShoppingBag}
                        variant="solid"
                        colorScheme="primary"
                        className={`!rounded-lg !py-2 !px-4 text-xs md:text-sm font-medium ${isAddedToCart ? "!bg-emerald-700 hover:!bg-emerald-700" : ""
                            } ${!hasPurchasableItems ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isAddedToCart
                            ? "Added to Cart!"
                            : !hasPurchasableItems
                                ? "Unavailable"
                                : "Add Routine to Cart"}
                    </CustomButton>

                </div>

                <div className=" absolute right-0 flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
                    {/* Add to Cart button using CustomButton */}


                    {/* View More button */}
                    <Link href="/skincare-test/results">
                        <h1 className="text-brand-primary-brown/70 font-regular font-sans text-sm md:text-md cursor-pointer hover:underline">
                            View More
                        </h1>
                    </Link>
                </div>
            </div>

            {/* Products grid carousel with Left and Right Arrows */}
            <div className="relative w-full">
                {/* Left Arrow */}
                {totalPages > 1 && (
                    <button
                        onClick={handlePrev}
                        className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs border border-[#78534a]/20 shadow-md text-brand-primary-brown flex items-center justify-center hover:bg-brand-primary-brown hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                        aria-label="Previous products"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Products grid showing 4 products per page with smooth key transitions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                    {visibleProducts.map((product) => (
                        <div key={product.id} className="animate-in fade-in duration-300">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                {totalPages > 1 && (
                    <button
                        onClick={handleNext}
                        className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs border border-[#78534a]/20 shadow-md text-brand-primary-brown flex items-center justify-center hover:bg-brand-primary-brown hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                        aria-label="Next products"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Carousel dots indicator if more than 4 products */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 w-full pt-1">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex
                                ? "w-8 bg-brand-primary-brown"
                                : "w-3 bg-brand-primary-brown/25 hover:bg-brand-primary-brown/50"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
