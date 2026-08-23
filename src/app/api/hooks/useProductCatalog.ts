"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProductsQuery, useCategoriesQuery } from "./useProductQueries";

export function useProductCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read query params
  const categoryId = searchParams.get("category") || "";
  const collection = searchParams.get("collection") || "";
  const search = searchParams.get("search") || "";
  const discountParam = searchParams.get("discount") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 9; // Show 9 items per page (3x3 grid)

  const discount = discountParam ? parseInt(discountParam, 10) : undefined;

  // React Query for Products & Categories (Automatic Caching & Instant Nav)
  const { data: productsData, isLoading: productsLoading } = useProductsQuery({
    page,
    limit,
    categoryId,
    collection,
    search,
    discount,
  });

  const { data: categoriesData = [] } = useCategoriesQuery();

  const products = productsData?.items || [];
  const categories = categoriesData || [];
  const totalProducts = productsData?.total || 0;
  const loading = productsLoading;

  // Local state for header title & filters
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest"); // newest, price-asc, price-desc

  // Dropdown states
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const [availability, setAvailability] = useState<string>("all"); // "all", "in-stock", "out-of-stock"

  // Determine active title / header name
  useEffect(() => {
    if (search) {
      setActiveCategoryName(`Search Results for "${search}"`);
    } else if (collection === "best-sellers") {
      setActiveCategoryName("Best Selling");
    } else if (collection === "sale" || collection === "on-sale") {
      setActiveCategoryName("On Sale");
    } else if (categoryId && categories.length > 0) {
      const activeCat = categories.find((c) => c.id === categoryId);
      setActiveCategoryName(activeCat ? activeCat.name : "Collection");
    } else {
      setActiveCategoryName("All Skincare");
    }
  }, [categoryId, collection, categories, search]);

  const totalPages = Math.ceil(totalProducts / limit) || 1;

  // Handle category selection
  const handleCategorySelect = (id: string) => {
    const params = new URLSearchParams();
    if (id) params.set("category", id);
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`/product?${params.toString()}`);
  };

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/product?${params.toString()}`);
  };

  // Apply client-side sorting on products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0; // keep backend ordering
  });

  const filteredProducts = sortedProducts.filter((product) => {
    const inStock = product.name.charCodeAt(0) % 6 !== 0; // 83% in stock
    const matchesAvailability =
      availability === "in-stock"
        ? inStock
        : availability === "out-of-stock"
        ? !inStock
        : true;
    if (!matchesAvailability) return false;
    return true;
  });

  return {
    router,
    products: filteredProducts,
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
  };
}
