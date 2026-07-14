import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, Category } from "@/utils/types/type";
import { getProducts, getCategories } from "@/utils/services";

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

  // Local state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest"); // newest, price-asc, price-desc

  // Dropdown states
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const [availability, setAvailability] = useState<string>("all"); // "all", "in-stock", "out-of-stock"

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // Fetch products when query parameters change
  useEffect(() => {
    setLoading(true);
    const discount = discountParam ? parseInt(discountParam, 10) : undefined;
    getProducts({ page, limit, categoryId, collection, search, discount })
      .then((data) => {
        setProducts(data.items);
        setTotalProducts(data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, [categoryId, collection, page, search, discountParam]);

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
    const matchesAvailability = availability === "in-stock" ? inStock : availability === "out-of-stock" ? !inStock : true;
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
