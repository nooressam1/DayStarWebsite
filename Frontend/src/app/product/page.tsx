"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/app/modules/home/_components/ProductCard";
import Dropdown from "../modules/shared/component/Dropdown";
import { useProductCatalog } from "../modules/shared/hooks/useProductCatalog";

function ProductsCatalogContent() {
    const {
        router,
        products: sortedProducts,
        categories,
        loading,
        activeCategoryName,
        sortBy,
        setSortBy,
        showCategoriesDropdown,
        setShowCategoriesDropdown,
        showPriceDropdown,
        setShowPriceDropdown,
        showAvailabilityDropdown,
        setShowAvailabilityDropdown,
        availability,
        setAvailability,
        page,
        totalPages,
        handleCategorySelect,
        handlePageChange,
        categoryId,
        collection,
    } = useProductCatalog();

    return (
        <div className="min-h-screen bg-[#faf5f3] font-sans antialiased text-[#78534a]">
            {/* 1. Header Hero Banner - Matching the homepage image and design */}
            <div className="w-full h-[320px] sm:h-[620px] relative flex justify-center items-center overflow-hidden">
                <Image
                    src="/assets/images/BannerImage.jpg"
                    alt="Shop Banner"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover w-full h-full brightness-95"
                />

                {/* Dark Teal Glassmorphic Overlay Box */}
                <div className="flex flex-col w-full gap-2 relative z-10 bg-[#0d3b41]/75 backdrop-blur-md border  
                border-white/10 rounded-lg py-8 px-12 sm:px-20 py-15  text-center 
                max-w-xs sm:max-w-sm md:max-w-3xl shadow-lg justify-center items-center">


                    <h1 className="font-serif text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                        Shop
                    </h1>
                    <span className="text-xs sm:text-sm text-white/80 font-sans tracking-wide mt-2">
                        Get Yours Now
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">


                {/* 2. Collection Title */}
                <h2 className="font-serif text-3xl md:text-4xl text-[#78534a] font-bold tracking-tight mb-2">
                    {activeCategoryName}
                </h2>

                {/* 3. Filters Layout Section */}
                <div className="mb-10">
                    <p className="text-xs text-[#78534a]/60 font-sans font-medium uppercase tracking-wider mb-3">
                        Filter by
                    </p>

                    <div className="flex flex-wrap items-center gap-3 relative">
                        {/* Reviews Button (Placeholder) */}
                        <button className="px-5 py-2.5 border border-[#78534a]/20 text-[#78534a]  rounded-md hover:border-[#78534a] text-xs font-sans font-semibold transition-all cursor-pointer">
                            Reviews
                        </button>

                        {/* Categories Selector Dropdown */}
                        <Dropdown
                            label="Categories"
                            isOpen={showCategoriesDropdown}
                            onToggle={(open) => {
                                setShowCategoriesDropdown(open);
                                if (open) setShowPriceDropdown(false);
                            }}
                            dropdownClassName="w-64 py-2"
                        >
                            <button
                                onClick={() => {
                                    handleCategorySelect("");
                                    setShowCategoriesDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-[#faf5f3] transition-colors text-xs font-sans font-semibold ${!categoryId && !collection ? "text-[#78534a] bg-[#faf5f3]" : "text-gray-700"}`}
                            >
                                All Skincare
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        handleCategorySelect(cat.id);
                                        setShowCategoriesDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 hover:bg-[#faf5f3] transition-colors text-xs font-sans font-semibold ${categoryId === cat.id && !collection ? "text-[#78534a] bg-[#faf5f3]" : "text-gray-700"}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams();
                                    params.set("collection", "best-sellers");
                                    params.set("page", "1");
                                    router.push(`/product?${params.toString()}`);
                                    setShowCategoriesDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-[#faf5f3] transition-colors text-xs font-sans font-semibold border-t border-gray-100 ${collection === "best-sellers" ? "text-[#78534a] bg-[#faf5f3]" : "text-gray-700"}`}
                            >
                                🔥 Best Sellers
                            </button>
                        </Dropdown>

                        {/* Price Sorting Selector Dropdown */}
                        <Dropdown
                            label="Price"
                            isOpen={showPriceDropdown}
                            onToggle={(open) => {
                                setShowPriceDropdown(open);
                                if (open) setShowCategoriesDropdown(false);
                            }}
                            dropdownClassName="w-48 py-1.5"
                        >
                            <button
                                onClick={() => {
                                    setSortBy("newest");
                                    setShowPriceDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-[#faf5f3] transition-colors text-xs font-sans font-semibold ${sortBy === "newest" ? "text-[#78534a] bg-[#faf5f3]" : "text-gray-700"}`}
                            >
                                Newest Arrivals
                            </button>
                            <button
                                onClick={() => {
                                    setSortBy("price-asc");
                                    setShowPriceDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-[#faf5f3] transition-colors text-xs font-sans font-semibold ${sortBy === "price-asc" ? "text-[#78534a] bg-[#faf5f3]" : "text-gray-700"}`}
                            >
                                Price: Low to High
                            </button>
                            <button
                                onClick={() => {
                                    setSortBy("price-desc");
                                    setShowPriceDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-[#faf5f3] transition-colors text-xs font-sans font-semibold ${sortBy === "price-desc" ? "text-[#78534a] bg-[#faf5f3]" : "text-gray-700"}`}
                            >
                                Price: High to Low
                            </button>
                        </Dropdown>

                        {/* Availability Selector Dropdown */}
                        <Dropdown
                            label={availability === "in-stock" ? "Availability: In Stock" : availability === "out-of-stock" ? "Availability: Out of Stock" : "Availability"}
                            isOpen={showAvailabilityDropdown}
                            onToggle={(open) => {
                                setShowAvailabilityDropdown(open);
                                if (open) {
                                    setShowCategoriesDropdown(false);
                                    setShowPriceDropdown(false);
                                }
                            }}
                            dropdownClassName="w-48 py-1.5"
                        >
                            <button
                                onClick={() => {
                                    setAvailability("all");
                                    setShowAvailabilityDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-[#faf5f3] transition-colors text-xs font-sans font-semibold ${availability === "all" ? "text-[#78534a] bg-[#faf5f3]" : "text-gray-700"}`}
                            >
                                All Items
                            </button>
                            <button
                                onClick={() => {
                                    setAvailability("in-stock");
                                    setShowAvailabilityDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-[#faf5f3] transition-colors text-xs font-sans font-semibold ${availability === "in-stock" ? "text-[#78534a] bg-[#faf5f3]" : "text-gray-700"}`}
                            >
                                In Stock
                            </button>
                            <button
                                onClick={() => {
                                    setAvailability("out-of-stock");
                                    setShowAvailabilityDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-[#faf5f3] transition-colors text-xs font-sans font-semibold ${availability === "out-of-stock" ? "text-[#78534a] bg-[#faf5f3]" : "text-gray-700"}`}
                            >
                                Out of Stock
                            </button>
                        </Dropdown>

                        {/* Size Button (Placeholder) */}
                        <button className="px-5 py-2.5 border border-[#78534a]/20 text-[#78534a]  rounded-md hover:border-[#78534a] text-xs font-sans font-semibold transition-all cursor-pointer">
                            Size
                        </button>
                    </div>
                </div>

                {/* 4. Products Grid Area */}
                <div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-10 h-10 border-4 border-[#78534a] border-t-transparent rounded-full animate-spin"></div>
                            <span className="mt-4 text-xs text-[#78534a]/75 font-work font-medium">Loading products...</span>
                        </div>
                    ) : sortedProducts.length === 0 ? (
                        <div className="text-center py-20  border border-[#78534a]/10 rounded-xl p-8 shadow-sm">
                            <h3 className="font-serif text-lg font-bold text-[#78534a]">No products found</h3>
                            <p className="mt-2 font-work text-sm text-[#78534a]/60">
                                We couldn't find any products matching this selection. Try checking another category!
                            </p>
                        </div>
                    ) : (
                        <div>
                            {/* Product Grid - Exactly 3 columns on desktop to match mockup ratio */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                {sortedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* 5. Pagination Controls - Styled to match mockup */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 border-t border-[#78534a]/10 pt-6">
                                    {/* Previous Button */}
                                    <button
                                        disabled={page <= 1}
                                        onClick={() => handlePageChange(page - 1)}
                                        className="p-2 border border-[#78534a]/20 rounded-md hover:border-[#78534a] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-[#78534a] bg-white"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    {/* Page numbers */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => handlePageChange(p)}
                                            className={`w-9 h-9 rounded-md font-sans text-xs font-bold transition-all cursor-pointer ${page === p
                                                ? "bg-[#78534a] text-white shadow-sm"
                                                : "bg-white border border-[#78534a]/20 text-[#78534a] hover:border-[#78534a]"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        disabled={page >= totalPages}
                                        onClick={() => handlePageChange(page + 1)}
                                        className="p-2 border border-[#78534a]/20 rounded-md hover:border-[#78534a] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-[#78534a] bg-white"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsCatalogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#faf5f3] py-20 px-4 flex flex-col justify-center items-center font-sans antialiased text-[#78534a]">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-[#78534a] border-t-transparent rounded-full animate-spin"></div>
                    <span className="mt-4 text-xs font-work font-medium">Loading collection...</span>
                </div>
            </div>
        }>
            <ProductsCatalogContent />
        </Suspense>
    );
}
