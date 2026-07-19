import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";

export interface CheckoutAddressPayload {
    city: string;
    area: string;
    address: string; // street name / building details
    floorNumber?: string;
    apartmentNumber?: string;
    governorate?: string;
    postalCode?: string;
    addressId?: string;
}

export interface ProcessCheckoutParams {
    address: CheckoutAddressPayload;
    items: { variant_id: string; quantity: number }[];
    token: string;
    couponCode?: string;
    fullName?: string;
    phoneNumber?: string;
}

export async function processCheckout(params: ProcessCheckoutParams): Promise<any> {
    const { address, items, token, couponCode, fullName, phoneNumber } = params;
    try {
        return await apiClient.request(ENDPOINTS.ORDER.CHECKOUT, undefined, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                city: address.city,
                area: address.area,
                address: address.address,
                floorNumber: address.floorNumber,
                apartmentNumber: address.apartmentNumber,
                governorate: address.governorate,
                postalCode: address.postalCode,
                addressId: address.addressId,
                items,
                couponCode,
                fullName,
                phoneNumber,
            }),
        });
    } catch (error) {
        console.error("Error processing checkout:", error);
        return null;
    }
}

// Fetch a single order by ID
export async function getOrder(id: string): Promise<any> {
    try {
        return await apiClient.request(ENDPOINTS.ORDER.GET(id));
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}

export async function getOrders(limit?: number, offset?: number): Promise<any[]> {
    try {
        const params: Record<string, string> = {};
        if (limit !== undefined) params.limit = limit.toString();
        if (offset !== undefined) params.offset = offset.toString();
        
        return await apiClient.request<any[]>(ENDPOINTS.ORDER.LIST, params);
    } catch (error) {
        console.error("Error fetching orders", error);
        return [];
    }
}

export async function cancelOrder(orderId: string): Promise<any> {
    try {
        return await apiClient.request(ENDPOINTS.ORDER.CANCEL(orderId), undefined, { method: 'PATCH' });
    } catch (error) {
        console.error("Error canceling order", error);
        return null;
    }
}
