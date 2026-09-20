import { apiClient } from "@/app/api/utils/client";
import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { Review } from "@/app/api/types";

// Fetch reviews for a product
export async function getProductReviews(productId: string): Promise<Review[]> {
    try {
        const reviews = await apiClient.request<Review[]>(ENDPOINTS.REVIEWS.BY_PRODUCT(productId));
        // Map backend relation profile.username to username if username is empty
        return (reviews || []).map(r => ({
            ...r,
            username: r.username || r.profile?.username || "Anonymous"
        }));
    } catch {
        return [];
    }
}

// Fetch featured reviews for homepage testimonials
export async function getFeaturedReviews(limit = 10): Promise<Review[]> {
    try {
        const reviews = await apiClient.request<Review[]>(`${ENDPOINTS.REVIEWS.FEATURED}?limit=${limit}`);
        return (reviews || []).map(r => ({
            ...r,
            username: r.username || r.profile?.username || "Verified Customer"
        }));
    } catch (error) {
        console.error("Error fetching featured reviews:", error);
        return [];
    }
}

// Create a new review for a product (requires auth)
export async function createProductReview(
    productId: string,
    reviewData: { rating: number; title: string; body: string }
): Promise<Review | null> {
    try {
        const data = await apiClient.request<Review>(ENDPOINTS.REVIEWS.CREATE(productId), undefined, {
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
