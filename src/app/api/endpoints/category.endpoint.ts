import { Category } from "@/app/api/types";
import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";

export async function getCategories(): Promise<Category[]> {
    try {
        return await apiClient.request<Category[]>(ENDPOINTS.CATEGORY.LIST);
    } catch {
        return [];
    }
}
