// utils/services/product.service.ts

import { Category, Discount, Product, Variant, Review, Address } from "@/utils/types/type";
import { apiFetch } from "./api/api.apiFetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Fetch a single product by slug
export async function getProduct(slug: string): Promise<Product | null> {
    try {
        const res = await fetch(`${BASE_URL}/product/${slug}`);
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}
export async function getProducts(params: { page?: number; limit?: number; categoryId?: string; collection?: string; search?: string; discount?: number }): Promise<{ items: Product[]; total: number }> {
    try {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.categoryId) query.append('categoryId', params.categoryId);
        if (params.collection) query.append('collection', params.collection);
        if (params.search) query.append('search', params.search);
        if (params.discount) query.append('discount', params.discount.toString());

        const res = await fetch(`${BASE_URL}/product?${query.toString()}`);
        if (!res.ok) return { items: [], total: 0 };
        return res.json();
    } catch {
        return { items: [], total: 0 };
    }
}


// Fetch variants for a product
export async function getProductVariants(productId: string): Promise<Variant[]> {
    try {
        const res = await fetch(`${BASE_URL}/product/${productId}/variants`);
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}
export async function getDiscount(code: string): Promise<Discount | null> {
    try {
        const res = await fetch(`${BASE_URL}/discount/${code}`);
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${BASE_URL}/category`);
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}
export async function getBestSellers(): Promise<Product[]> {
    try {
        const res = await fetch(`${BASE_URL}/product/best-sellers`);
        if (!res.ok) return [];
        const data = await res.json();
        console.log("testingggg", data);
        return data;
    } catch (error) {
        console.error("Error fetching best sellers:", error);
        return [];
    }
}
export async function processCheckout(
    city: string,
    area: string,
    address: string,
    floorNumber: string,
    apartmentNumber: string,
    items: { variant_id: string; quantity: number }[],
    token: string,
    couponCode?: string,
    governorate?: string,
    postalCode?: string,
    fullName?: string,
    phoneNumber?: string,
    addressId?: string,
) {
    try {
        const res = await fetch(`${BASE_URL}/orders/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                city,
                area,
                address,
                floorNumber,
                apartmentNumber,
                items,
                couponCode,
                governorate,
                postalCode,
                fullName,
                phoneNumber,
                addressId,
            }),
        });
        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            console.error("Checkout backend error details:", errorBody);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error("Error processing checkout:", error);
        return null;
    }
}

export async function getMe(): Promise<any> {
    try {
        return await apiFetch("/me");
    } catch {
        return null;
    }
}

// Fetch a single order by ID
export async function getOrder(id: string): Promise<any> {
    try {
        return await apiFetch(`/orders/${id}`);
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}
export async function getOrders(): Promise<any[]> {
    try {
        return await apiFetch('/orders');

    } catch (error) {
        console.error("Error fetching orders", error);
        return [];
    }
}
export async function cancelOrder(orderId: string): Promise<any> {
    try {
        return await apiFetch(`/orders/${orderId}/cancel`, { method: 'PATCH' });

    } catch (error) {
        console.error("Error canceling order", error);
        return null;
    }
}

// Fetch reviews for a product
export async function getProductReviews(productId: string): Promise<Review[]> {
    try {
        const res = await fetch(`${BASE_URL}/product/${productId}/reviews`);
        if (!res.ok) return [];
        const reviews: Review[] = await res.json();
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
        const data = await apiFetch<Review>(`/product/${productId}/reviews`, {
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

// Fetch all addresses of the authenticated user
export async function getUserAddresses(): Promise<Address[]> {
    try {
        return await apiFetch<Address[]>("/addresses");
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return [];
    }
}

// Create a new user address
export async function addUserAddress(dto: {
    street: string;
    area: string;
    governorate: string;
    postalCode?: string;
    building_no: string;
    city: string;
    country?: string;
    label?: string;
    is_default?: boolean;
}): Promise<Address | null> {
    try {
        return await apiFetch<Address>("/addresses", {
            method: "POST",
            body: JSON.stringify(dto),
        });
    } catch (error) {
        console.error("Error adding address:", error);
        return null;
    }
}

// Update an existing user address
export async function updateUserAddress(
    id: string,
    dto: {
        street?: string;
        area?: string;
        governorate?: string;
        postalCode?: string;
        building_no?: string;
        city?: string;
        country?: string;
        label?: string;
        is_default?: boolean;
    }
): Promise<Address | null> {
    try {
        return await apiFetch<Address>(`/addresses/${id}`, {
            method: "PUT",
            body: JSON.stringify(dto),
        });
    } catch (error) {
        console.error("Error updating address:", error);
        return null;
    }
}

// Delete a user address
export async function deleteUserAddress(id: string): Promise<string | null> {
    try {
        await apiFetch<{ success: boolean }>(`/addresses/${id}`, {
            method: "DELETE",
        });
        return null;
    } catch (error: any) {
        console.error("Error deleting address:", error);
        return error.message || "Failed to delete address.";
    }
}

// Set a user address as default
export async function setDefaultUserAddress(id: string): Promise<Address | null> {
    try {
        return await apiFetch<Address>(`/addresses/${id}/default`, {
            method: "PATCH",
            });
    } catch (error) {
        console.error("Error setting default address:", error);
        return null;
    }
}

// Create a new contact submission
export async function createContactSubmission(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    user_id?: string;
}): Promise<any> {
    try {
        const res = await fetch(`${BASE_URL}/contact_submissions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Error creating contact submission:", error);
        return null;
    }
}