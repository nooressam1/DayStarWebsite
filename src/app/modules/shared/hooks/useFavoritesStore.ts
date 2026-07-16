import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/utils/types/type";
import { getProduct } from "@/utils/services";
import { isProductOnSale, getProductSalePrice } from "@/utils/product";
import { formatMoney } from "@/utils/format/format.moneyFormat";

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
          // change this to a pop up clean notification

          alert("None of your favorited items are currently on sale. We will monitor them and notify you!");
          return;
        }

        const itemsText = onSaleItems
          .map((p) => {
            const salePrice = getProductSalePrice(p);
            return `- ${p.name}: Now ${formatMoney(salePrice)} (Was ${formatMoney(p.price)})`;
          })
          .join("\n");
        // change this to a pop up clean notification
        alert(
          `An email notification has been sent containing your favorited products that are currently on sale:\n\n${itemsText}`
        );
      },
    }),
    { name: "daystore-favorites-storage" },
  ),
);
