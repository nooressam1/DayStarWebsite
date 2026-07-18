import { Discount } from "@/app/api/types";
import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";

export async function getDiscount(code: string): Promise<Discount | null> {
    try {
        return await apiClient.request<Discount>(ENDPOINTS.DISCOUNT.GET(code));
    } catch {
        return null;
    }
}
