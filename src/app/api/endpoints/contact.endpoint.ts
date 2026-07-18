import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";

// Create a new contact submission
export async function createContactSubmission(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    user_id?: string;
}): Promise<any> {
    try {
        return await apiClient.request(ENDPOINTS.CONTACT.SUBMIT, undefined, {
            method: "POST",
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Error creating contact submission:", error);
        return null;
    }
}
