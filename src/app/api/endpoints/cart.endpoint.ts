import { apiClient } from "@/app/api/utils/client";
import { ENDPOINTS } from "@/app/api/constants/endpoints";

export interface ServerCartItem {
  variant_id: string;
  product_id: string;
  name: string;
  price: number;
  size: string;
  photo: string;
  quantity: number;
}

// 1. Fetch User Cart from Backend API
export async function fetchServerCart(userId: string): Promise<ServerCartItem[]> {
  try {
    const data = await apiClient.request<ServerCartItem[]>(ENDPOINTS.CART.GET);
    return data || [];
  } catch (err) {
    console.error("Error fetching cart from backend API:", err);
    return [];
  }
}

// 2. Sync Cart Item with Backend API
export async function upsertCartItemInDb(userId: string, variant_id: string, quantity: number): Promise<boolean> {
  try {
    await apiClient.request(ENDPOINTS.CART.SYNC_ITEM, undefined, {
      method: "POST",
      body: JSON.stringify({ variant_id, quantity }),
    });
    return true;
  } catch (err) {
    console.error("Error syncing cart item with backend API:", err);
    return false;
  }
}

// 3. Remove Cart Item via Backend API
export async function removeCartItemFromDb(userId: string, variant_id: string): Promise<boolean> {
  try {
    await apiClient.request(ENDPOINTS.CART.REMOVE_ITEM(variant_id), undefined, {
      method: "DELETE",
    });
    return true;
  } catch (err) {
    console.error("Error removing cart item via backend API:", err);
    return false;
  }
}

// 4. Clear Entire Cart via Backend API
export async function clearServerCartInDb(userId: string): Promise<boolean> {
  try {
    await apiClient.request(ENDPOINTS.CART.CLEAR, undefined, {
      method: "DELETE",
    });
    return true;
  } catch (err) {
    console.error("Error clearing cart via backend API:", err);
    return false;
  }
}

// 5. Merge Guest Cart with Backend API
export async function mergeGuestCartToDb(userId: string, guestItems: ServerCartItem[]): Promise<boolean> {
  if (!guestItems || guestItems.length === 0) return true;
  try {
    await apiClient.request(ENDPOINTS.CART.MERGE_GUEST, undefined, {
      method: "POST",
      body: JSON.stringify({ items: guestItems }),
    });
    return true;
  } catch (err) {
    console.error("Error merging guest cart via backend API:", err);
    return false;
  }
}
