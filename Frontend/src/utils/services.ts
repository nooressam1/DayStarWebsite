// utils/services/product.service.ts

import { Discount, Product, Variant } from "@/utils/types/type";

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
