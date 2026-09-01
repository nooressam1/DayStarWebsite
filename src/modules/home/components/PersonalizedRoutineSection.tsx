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
    const [activeTab, setActiveTab] = useState<"morning" | "evening" | "all">("all");
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

    // Reset carousel index when switching tabs
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeTab]);

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
    const extractRawProducts = (time: "morning" | "evening" | "all"): Product[] => {
        if (!rawRoutine) return [];

        const routineObj = rawRoutine as any;
        if (time === "morning" && routineObj.morning) {
            const items = routineObj.morning.recommendedProducts || Object.values(routineObj.morning);
            return items
                .map((i: any) => i?.product || i)
                .filter((p: any) => p && p.id && p.name);
        }
        if (time === "evening" && routineObj.evening) {
            const items = routineObj.evening.recommendedProducts || Object.values(routineObj.evening);
            return items
                .map((i: any) => i?.product || i)
                .filter((p: any) => p && p.id && p.name);
        }
        if (time === "all") {
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
        }
        return [];
    };

    const getDisplayProducts = (): { products: Product[]; recommendedList: RecommendedProduct[] } => {
        if (activeTab === "morning") {
            const raw = extractRawProducts("morning");
            if (raw.length > 0) return { products: raw, recommendedList: morningProducts };
            return { products: morningProducts.map(toProduct), recommendedList: morningProducts };
        }
        if (activeTab === "evening") {
            const raw = extractRawProducts("evening");
            if (raw.length > 0) return { products: raw, recommendedList: eveningProducts };
            return { products: eveningProducts.map(toProduct), recommendedList: eveningProducts };
        }
        const raw = extractRawProducts("all");
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
        <div className="flex flex-col gap-5 items-start w-full">
            {/* Header with Title, Tabs, Cart Button, Carousel Navigation, and View More */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <h1 className="text-brand-primary-brown font-bold font-serif text-2xl md:text-3xl">
                        Your Skincare Routine
                    </h1>

                    {/* Filter tabs */}
                    <div className="flex items-center gap-1 bg-[#FAF5F3] p-1 rounded-lg border border-[#78534a]/15 text-xs font-medium">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${activeTab === "all"
                                    ? "bg-brand-primary-brown text-white font-semibold"
                                    : "text-[#78534a] hover:bg-white/60"
                                }`}
                        >
                            All ({allProducts.length || uniqueProducts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("morning")}
                            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${activeTab === "morning"
                                    ? "bg-brand-primary-brown text-white font-semibold"
                                    : "text-[#78534a] hover:bg-white/60"
                                }`}
                        >
                            Morning ({morningProducts.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab("evening")}
                            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${activeTab === "evening"
                                    ? "bg-brand-primary-brown text-white font-semibold"
                                    : "text-[#78534a] hover:bg-white/60"
                                }`}
                        >
                            Night ({eveningProducts.length || 0})
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
                    {/* Add to Cart button using CustomButton */}
                    <CustomButton
                        onClick={handleAddRoutineToCart}
                        disabled={isAddedToCart || !hasPurchasableItems}
                        icon={isAddedToCart ? Check : ShoppingBag}
                        variant="solid"
                        colorScheme="primary"
                        className={`!rounded-lg !py-2 !px-4 text-xs md:text-sm font-medium ${
                            isAddedToCart ? "!bg-emerald-700 hover:!bg-emerald-700" : ""
                        } ${!hasPurchasableItems ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isAddedToCart
                            ? "Added to Cart!"
                            : !hasPurchasableItems
                            ? "Unavailable"
                            : "Add Routine to Cart"}
                    </CustomButton>

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
