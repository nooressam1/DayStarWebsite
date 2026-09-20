import { Product, Variant, Review } from "@/app/api/types";
import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";

// Fetch a single product by slug
export async function getProduct(slug: string): Promise<Product | null> {
    try {
        return await apiClient.request<Product>(ENDPOINTS.PRODUCT.BY_SLUG(slug));
    } catch {
        return null;
    }
}

export async function getProducts(params: { page?: number; limit?: number; categoryId?: string; collection?: string; search?: string; discount?: number }): Promise<{ items: Product[]; total: number }> {
    try {
        const stringParams: Record<string, string> = {};
        if (params.page) stringParams.page = params.page.toString();
        if (params.limit) stringParams.limit = params.limit.toString();
        if (params.categoryId) stringParams.categoryId = params.categoryId;
        if (params.collection) stringParams.collection = params.collection;
        if (params.search) stringParams.search = params.search;
        if (params.discount) stringParams.discount = params.discount.toString();

        return await apiClient.request<{ items: Product[]; total: number }>(ENDPOINTS.PRODUCT.LIST, stringParams);
    } catch {
        return { items: [], total: 0 };
    }
}

// Fetch variants for a product
export async function getProductVariants(productId: string): Promise<Variant[]> {
    try {
        return await apiClient.request<Variant[]>(ENDPOINTS.PRODUCT.VARIANTS(productId));
    } catch {
        return [];
    }
}

export async function getBestSellers(): Promise<Product[]> {
    try {
        return await apiClient.request<Product[]>(ENDPOINTS.PRODUCT.BEST_SELLERS);
    } catch (error) {
        console.error("Error fetching best sellers:", error);
        return [];
    }
}

export async function getNewArrivals(): Promise<Product[]> {
    try {
        return await apiClient.request<Product[]>(ENDPOINTS.PRODUCT.NEW_ARRIVALS);
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        return [];
    }
}

// Re-export reviews from dedicated review endpoint
export * from "./review.endpoint";
