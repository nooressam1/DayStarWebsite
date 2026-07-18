import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { apiClient } from "@/app/api/utils/client";

export async function processCheckout(
    city: string,
    area: string,
    address: string,
    floorNumber: string,
    apartmentNumber: string,
    items: { variant_id: string; quantity: number }[],
    token: string,
    couponCode?: string,
    governorate?: string,
    postalCode?: string,
    fullName?: string,
    phoneNumber?: string,
    addressId?: string,
): Promise<any> {
    try {
        return await apiClient.request(ENDPOINTS.ORDER.CHECKOUT, undefined, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                city,
                area,
                address,
                floorNumber,
                apartmentNumber,
                items,
                couponCode,
                governorate,
                postalCode,
                fullName,
                phoneNumber,
                addressId,
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
