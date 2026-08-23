import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";
import { Profile } from "@/app/api/types";

export async function getMe(): Promise<Profile | null> {
    try {
        return await apiClient.request<Profile>(ENDPOINTS.USER.ME);
    } catch {
        return null;
    }
}
