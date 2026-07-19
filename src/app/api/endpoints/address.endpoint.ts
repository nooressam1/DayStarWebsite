import { Address } from "@/app/api/types";
import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";

export interface AddressPayloadDto {
    street: string;
    city: string;
    building_no?: string | null;
    floor_number?: string | null;
    apartment_number?: string | null;
    area?: string | null;
    governorate?: string | null;
    postal_code?: string | null;
    postalCode?: string | null;
    country?: string;
    label?: string;
    is_default?: boolean;
}

// Fetch all addresses of the authenticated user
export async function getUserAddresses(): Promise<Address[]> {
    try {
        return await apiClient.request<Address[]>(ENDPOINTS.ADDRESS.LIST_OR_CREATE);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return [];
    }
}

// Create a new user address
export async function addUserAddress(dto: AddressPayloadDto): Promise<Address | null> {
    try {
        return await apiClient.request<Address>(ENDPOINTS.ADDRESS.LIST_OR_CREATE, undefined, {
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
    dto: Partial<AddressPayloadDto>
): Promise<Address | null> {
    try {
        return await apiClient.request<Address>(ENDPOINTS.ADDRESS.BY_ID(id), undefined, {
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
        await apiClient.request<{ success: boolean }>(ENDPOINTS.ADDRESS.BY_ID(id), undefined, {
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
        return await apiClient.request<Address>(ENDPOINTS.ADDRESS.SET_DEFAULT(id), undefined, {
            method: "PATCH",
        });
    } catch (error) {
        console.error("Error setting default address:", error);
        return null;
    }
}
