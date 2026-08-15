"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProduct,
  getBestSellers,
  getProductVariants,
  getProductReviews,
  createProductReview,
} from "@/app/api/endpoints/product.endpoint";
import { getCategories } from "@/app/api/endpoints/category.endpoint";
import { Product } from "@/app/api/types";

// 1. Fetch Product Catalog List with Automatic Caching
export function useProductsQuery(params: {
  page?: number;
  limit?: number;
  categoryId?: string;
  collection?: string;
  search?: string;
  discount?: number;
}) {
  return useQuery<{ items: Product[]; total: number }>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: (previousData) => previousData,
  });
}

// 2. Fetch Categories List with Caching
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  });
}

// 3. Fetch Single Product by Slug
export function useProductBySlugQuery(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });
}

// 4. Fetch Best Sellers
export function useBestSellersQuery() {
  return useQuery({
    queryKey: ["best-sellers"],
    queryFn: getBestSellers,
  });
}

// 5. Fetch Product Variants
export function useProductVariantsQuery(productId: string) {
  return useQuery({
    queryKey: ["product-variants", productId],
    queryFn: () => getProductVariants(productId),
    enabled: !!productId,
  });
}

// 6. Fetch Product Reviews
export function useProductReviewsQuery(productId: string) {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  });
}

// 7. Create Product Review Mutation
export function useCreateReviewMutation(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: { rating: number; title: string; body: string; username: string }) =>
      createProductReview(productId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
