import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";

export interface ContactSubmissionData {
    name: string;
    email: string;
    subject: string;
    message: string;
    user_id?: string;
}

export interface ContactSubmissionResponse {
    id?: string;
    success?: boolean;
    message?: string;
}

// Create a new contact submission
export async function createContactSubmission(data: ContactSubmissionData): Promise<ContactSubmissionResponse | null> {
    try {
        return await apiClient.request<ContactSubmissionResponse>(ENDPOINTS.CONTACT.SUBMIT, undefined, {
            method: "POST",
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Error creating contact submission:", error);
        return null;
    }
}
