import { apiClient } from "@/app/api/utils/client";
import { ENDPOINTS } from "@/app/api/constants/endpoints";
import { Product } from "@/app/api/types";

export interface ServerFavoriteItem {
  favorite_id: string;
  notify_on_sale: boolean;
  product: Product;
}

// 1. Fetch User Favorites from Backend API
export async function fetchServerFavorites(): Promise<ServerFavoriteItem[]> {
  try {
    const data = await apiClient.request<ServerFavoriteItem[]>(ENDPOINTS.FAVORITES.GET);
    return data || [];
  } catch (err) {
    console.error("Error fetching favorites from backend API:", err);
    return [];
  }
}

// 2. Add Favorite to Backend API
export async function addFavoriteToDb(productId: string, notifyOnSale = true): Promise<boolean> {
  try {
    await apiClient.request(ENDPOINTS.FAVORITES.ADD(productId), undefined, {
      method: "POST",
      body: JSON.stringify({ notify_on_sale: notifyOnSale }),
    });
    return true;
  } catch (err) {
    console.error("Error adding favorite to backend API:", err);
    return false;
  }
}

// 3. Remove Favorite from Backend API
export async function removeFavoriteFromDb(productId: string): Promise<boolean> {
  try {
    await apiClient.request(ENDPOINTS.FAVORITES.REMOVE(productId), undefined, {
      method: "DELETE",
    });
    return true;
  } catch (err) {
    console.error("Error removing favorite from backend API:", err);
    return false;
  }
}

// 4. Toggle notify_on_sale in Backend API
export async function toggleNotifyInDb(notifyOnSale: boolean, productId?: string): Promise<boolean> {
  try {
    await apiClient.request(ENDPOINTS.FAVORITES.TOGGLE_NOTIFY, undefined, {
      method: "PATCH",
      body: JSON.stringify({ notify_on_sale: notifyOnSale, product_id: productId }),
    });
    return true;
  } catch (err) {
    console.error("Error updating notification settings in backend API:", err);
    return false;
  }
}

// 5. Sync Guest Favorites to Backend API
export async function syncGuestFavoritesToDb(productIds: string[]): Promise<boolean> {
  if (!productIds || productIds.length === 0) return true;
  try {
    await apiClient.request(ENDPOINTS.FAVORITES.SYNC_GUEST, undefined, {
      method: "POST",
      body: JSON.stringify({ productIds }),
    });
    return true;
  } catch (err) {
    console.error("Error syncing guest favorites to backend API:", err);
    return false;
  }
}
