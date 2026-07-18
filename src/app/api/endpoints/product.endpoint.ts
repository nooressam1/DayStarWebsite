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

// Fetch reviews for a product
export async function getProductReviews(productId: string): Promise<Review[]> {
    try {
        const reviews = await apiClient.request<Review[]>(ENDPOINTS.PRODUCT.REVIEWS(productId));
        // Map backend relation profile.username to username if username is empty
        return reviews.map(r => ({
            ...r,
            username: r.username || r.profile?.username || "Anonymous"
        }));
    } catch {
        return [];
    }
}

// Create a new review for a product (requires auth)
export async function createProductReview(
    productId: string,
    reviewData: { rating: number; title: string; body: string }
): Promise<Review | null> {
    try {
        const data = await apiClient.request<Review>(ENDPOINTS.PRODUCT.REVIEWS(productId), undefined, {
            method: "POST",
            body: JSON.stringify(reviewData),
        });
        return {
            ...data,
            username: data.username || data.profile?.username || "Anonymous"
        };
    } catch (error) {
        console.error("Error creating review:", error);
        return null;
    }
}
