import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";

export async function getMe(): Promise<any> {
    try {
        return await apiClient.request(ENDPOINTS.USER.ME);
    } catch {
        return null;
    }
}
