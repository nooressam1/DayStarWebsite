import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/app/api/types";
import { getProduct } from "@/app/api/endpoints/product.endpoint";
import { isProductOnSale, getProductSalePrice } from "@/modules/product";
import { formatMoney } from "@/utils/format/format.moneyFormat";

import { toast } from "sonner";

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  refreshFavorites: () => Promise<void>;
  sendSaleEmailAlert: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (product) =>
        set((state) => {
          const exists = state.favorites.some((p) => p.id === product.id);
          if (exists) {
            return {
              favorites: state.favorites.map((p) =>
                p.id === product.id ? product : p
              ),
            };
          }
          return { favorites: [...state.favorites, product] };
        }),
      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== productId),
        })),
      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },
      refreshFavorites: async () => {
        const currentFavorites = get().favorites;
        if (currentFavorites.length === 0) return;
        try {
          const freshData = await Promise.all(
            currentFavorites.map(async (fav) => {
              const fresh = await getProduct(fav.slug);
              return fresh || fav;
            })
          );
          set({ favorites: freshData });
        } catch (error) {
          console.error("Failed to refresh favorites:", error);
        }
      },
      sendSaleEmailAlert: () => {
        const currentFavorites = get().favorites;
        const onSaleItems = currentFavorites.filter((p) => isProductOnSale(p));

        if (onSaleItems.length === 0) {
          toast.info("None of your favorited items are currently on sale. We will monitor them and notify you!");
          return;
        }

        const itemsText = onSaleItems
          .map((p) => {
            const salePrice = getProductSalePrice(p);
            return `${p.name}: Now ${formatMoney(salePrice)} (Was ${formatMoney(p.price)})`;
          })
          .join(" | ");
        toast.success(`Notification sent for items on sale: ${itemsText}`);
      },
    }),
    { name: "daystore-favorites-storage" },
  ),
);
