// utils/services/product.service.ts

import { Category, Discount, Product, Variant } from "@/utils/types/type";
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
export async function getProducts(params: { page?: number; limit?: number; categoryId?: string; collection?: string; search?: string }): Promise<{ items: Product[]; total: number }> {
    try {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.categoryId) query.append('categoryId', params.categoryId);
        if (params.collection) query.append('collection', params.collection);
        if (params.search) query.append('search', params.search);

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
    couponCode?: string, // 🟢 Add this optional parameter

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
                couponCode, // 🟢 Add this optional parameter

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