"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { ProductCard } from "@/modules/home/components/ProductCard";
import { Dropdown, ProductCardSkeletonGrid } from "@/modules/shared";
import { useProductsQuery, useCategoriesQuery } from "@/app/api/hooks/useProductQueries";

function ProductsCatalogContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read URL query params
    const categoryId = searchParams.get("category") || "";
    const collection = searchParams.get("collection") || "";
    const search = searchParams.get("search") || "";
    const discountParam = searchParams.get("discount") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 9; // Show 9 items per page (3x3 grid)

    const discount = discountParam ? parseInt(discountParam, 10) : undefined;

    // React Query Data Fetching (Automatic Caching)
    const { data: productsData, isLoading: loading } = useProductsQuery({
        page,
        limit,
        categoryId,
        collection,
        search,
        discount,
    });

    const { data: categories = [] } = useCategoriesQuery();

    const products = productsData?.items || [];
    const totalProducts = productsData?.total || 0;
    const totalPages = Math.ceil(totalProducts / limit) || 1;

    // Local UI State
    const [searchVal, setSearchVal] = useState(search);
    const [sortBy, setSortBy] = useState<string>("newest");
    const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
    const [availability, setAvailability] = useState<string>("all");

    // Sync input field value when search parameter changes
    useEffect(() => {
        setSearchVal(search);
    }, [search]);

    // Active Category Title
    let activeCategoryName = "All Skincare";
    if (search) {
        activeCategoryName = `Search Results for "${search}"`;
    } else if (collection === "best-sellers") {
        activeCategoryName = "Best Selling";
    } else if (collection === "sale" || collection === "on-sale") {
        activeCategoryName = "On Sale";
    } else if (categoryId && categories.length > 0) {
        const activeCat = categories.find((c) => c.id === categoryId);
        activeCategoryName = activeCat ? activeCat.name : "Collection";
    }

    // Category / Page Handlers
    const handleCategorySelect = (id: string) => {
        const params = new URLSearchParams();
        if (id) params.set("category", id);
        params.set("page", "1");
        router.push(`/product?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/product?${params.toString()}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchVal.trim()) {
            params.set("search", searchVal.trim());
        } else {
            params.delete("search");
        }
        params.set("page", "1");
        router.push(`/product?${params.toString()}`);
    };

    const handleSearchClear = () => {
        setSearchVal("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");
        params.set("page", "1");
        router.push(`/product?${params.toString()}`);
    };

    // Client-side sorting & availability filter
    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
    });

    const filteredProducts = sortedProducts.filter((product) => {
        const inStock = product.name.charCodeAt(0) % 6 !== 0;
        const matchesAvailability =
            availability === "in-stock"
                ? inStock
                : availability === "out-of-stock"
                ? !inStock
                : true;
        return matchesAvailability;
    });

    return (
        <div className="min-h-screen bg-[#faf5f3] font-sans antialiased text-[#78534a]">
            {/* 1. Header Hero Banner */}
            <div className="w-full h-[320px] sm:h-[620px] relative flex justify-center items-center overflow-hidden">
                <Image
                    src="/assets/images/BannerImage.jpg"
                    alt="Shop Banner"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover w-full h-full brightness-95"
                />

                <div className="flex flex-col w-full gap-2 relative z-10 bg-[#0d3b41]/75 backdrop-blur-md border border-white/10 rounded-lg py-8 px-12 sm:px-20 py-15 text-center max-w-xs sm:max-w-sm md:max-w-3xl shadow-lg justify-center items-center">
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
                <h2 className="font-serif text-2xl md:text-4xl text-[#78534a] font-bold tracking-tight mb-2">
                    {activeCategoryName}
                </h2>

                {/* 3. Filters Layout Section */}
                <div className="mb-10">
                    <p className="text-xs text-[#78534a]/60 font-sans font-medium uppercase tracking-wider mb-3">
                        Filter by
                    </p>

                    <div className="flex flex-wrap items-center gap-3 relative">
                        <button className="px-5 py-2.5 border border-[#78534a]/20 text-[#78534a] rounded-md hover:border-[#78534a] text-xs font-sans font-semibold transition-all cursor-pointer">
                            Reviews
                        </button>

                        <Dropdown
                            label="Categories"
                            isOpen={showCategoriesDropdown}
                            onToggle={(open) => {
                                setShowCategoriesDropdown(open);
                                if (open) setShowPriceDropdown(false);
                            }}
                        >
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        handleCategorySelect("");
                                        setShowCategoriesDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-xs font-sans hover:bg-[#faf5f3] flex items-center justify-between cursor-pointer ${
                                        !categoryId ? "font-bold text-[#78534a]" : "text-[#78534a]/80"
                                    }`}
                                >
                                    <span>All Categories</span>
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            handleCategorySelect(cat.id);
                                            setShowCategoriesDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-sans hover:bg-[#faf5f3] flex items-center justify-between cursor-pointer ${
                                            categoryId === cat.id ? "font-bold text-[#78534a]" : "text-[#78534a]/80"
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </Dropdown>

                        <Dropdown
                            label="Availability"
                            isOpen={showAvailabilityDropdown}
                            onToggle={(open) => {
                                setShowAvailabilityDropdown(open);
                                if (open) {
                                    setShowCategoriesDropdown(false);
                                    setShowPriceDropdown(false);
                                }
                            }}
                        >
                            <div className="py-1">
                                {[
                                    { label: "All Items", val: "all" },
                                    { label: "In Stock Only", val: "in-stock" },
                                    { label: "Out of Stock", val: "out-of-stock" },
                                ].map((item) => (
                                    <button
                                        key={item.val}
                                        onClick={() => {
                                            setAvailability(item.val);
                                            setShowAvailabilityDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-sans hover:bg-[#faf5f3] cursor-pointer ${
                                            availability === item.val ? "font-bold text-[#78534a]" : "text-[#78534a]/80"
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </Dropdown>

                        <Dropdown
                            label="Sort By"
                            isOpen={showPriceDropdown}
                            onToggle={(open) => {
                                setShowPriceDropdown(open);
                                if (open) setShowCategoriesDropdown(false);
                            }}
                        >
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        setSortBy("newest");
                                        setShowPriceDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-xs font-sans hover:bg-[#faf5f3] cursor-pointer ${
                                        sortBy === "newest" ? "font-bold text-[#78534a]" : "text-[#78534a]/80"
                                    }`}
                                >
                                    Newest
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy("price-asc");
                                        setShowPriceDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-xs font-sans hover:bg-[#faf5f3] cursor-pointer ${
                                        sortBy === "price-asc" ? "font-bold text-[#78534a]" : "text-[#78534a]/80"
                                    }`}
                                >
                                    Price: Low to High
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy("price-desc");
                                        setShowPriceDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-xs font-sans hover:bg-[#faf5f3] cursor-pointer ${
                                        sortBy === "price-desc" ? "font-bold text-[#78534a]" : "text-[#78534a]/80"
                                    }`}
                                >
                                    Price: High to Low
                                </button>
                            </div>
                        </Dropdown>

                        {/* Search Input Box */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px]">
                            <input
                                type="text"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                placeholder="Search skincare products..."
                                className="w-full pl-9 pr-8 py-2 border border-[#78534a]/20 rounded-md text-xs font-sans focus:outline-hidden focus:border-[#78534a] text-[#78534a] placeholder-[#78534a]/40"
                            />
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#78534a]/40" />
                            {searchVal && (
                                <button
                                    type="button"
                                    onClick={handleSearchClear}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78534a]/40 hover:text-[#78534a] cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Active Filter Badges */}
                    {(categoryId || collection || search || availability !== "all") && (
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            <span className="text-xs text-[#78534a]/60">Active filters:</span>
                            {categoryId && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#78534a]/10 text-[#78534a] text-xs font-medium rounded-full">
                                    {activeCategoryName}
                                    <button onClick={() => handleCategorySelect("")} className="hover:text-red-600 cursor-pointer">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {collection && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#78534a]/10 text-[#78534a] text-xs font-medium rounded-full capitalize">
                                    {collection.replace("-", " ")}
                                    <button onClick={() => router.push("/product")} className="hover:text-red-600 cursor-pointer">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {search && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#78534a]/10 text-[#78534a] text-xs font-medium rounded-full">
                                    Search: "{search}"
                                    <button onClick={handleSearchClear} className="hover:text-red-600 cursor-pointer">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {availability !== "all" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#78534a]/10 text-[#78534a] text-xs font-medium rounded-full">
                                    {availability === "in-stock" ? "In Stock" : "Out of Stock"}
                                    <button onClick={() => setAvailability("all")} className="hover:text-red-600 cursor-pointer">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setSearchVal("");
                                    setAvailability("all");
                                    router.push("/product");
                                }}
                                className="text-xs text-[#78534a] underline hover:text-black cursor-pointer ml-2"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* 4. Product Cards Grid */}
                {loading ? (
                    <ProductCardSkeletonGrid count={9} />
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg border border-[#78534a]/10 p-8 shadow-xs">
                        <p className="font-serif text-lg text-[#78534a] font-bold">No Products Found</p>
                        <p className="text-xs text-[#78534a]/60 font-sans mt-1">
                            Try adjusting your filters or search terms.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* 5. Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="p-2 border border-[#78534a]/20 text-[#78534a] rounded-md hover:border-[#78534a] disabled:opacity-30 disabled:hover:border-[#78534a]/20 cursor-pointer disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`w-8 h-8 rounded-md text-xs font-sans font-medium transition-all cursor-pointer ${
                                    page === p
                                        ? "bg-[#78534a] text-white"
                                        : "border border-[#78534a]/20 text-[#78534a] hover:border-[#78534a]"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="p-2 border border-[#78534a]/20 text-[#78534a] rounded-md hover:border-[#78534a] disabled:opacity-30 disabled:hover:border-[#78534a]/20 cursor-pointer disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProductCatalogPage() {
    return (
        <Suspense fallback={<ProductCardSkeletonGrid count={9} />}>
            <ProductsCatalogContent />
        </Suspense>
    );
}
