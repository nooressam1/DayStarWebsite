import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/app/api/types";
import { getProduct } from "@/app/api/endpoints/product.endpoint";
import {
  addFavoriteToDb,
  removeFavoriteFromDb,
  toggleNotifyInDb,
  fetchServerFavorites,
} from "@/app/api/endpoints/favorites.endpoint";
import { isProductOnSale, getProductSalePrice } from "@/modules/product";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import { toast } from "sonner";

interface FavoritesState {
  favorites: Product[];
  emailAlertsEnabled: boolean;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  setFavorites: (favorites: Product[]) => void;
  setEmailAlertsEnabled: (enabled: boolean) => void;
  resetFavorites: () => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  refreshFavorites: () => Promise<void>;
  toggleEmailAlerts: (userEmail?: string) => boolean;
  sendSaleEmailAlert: (userEmail?: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      emailAlertsEnabled: false,
      userId: null,

      setUserId: (userId) => set({ userId }),
      setFavorites: (favorites) => set({ favorites }),
      setEmailAlertsEnabled: (emailAlertsEnabled) => set({ emailAlertsEnabled }),

      resetFavorites: () => {
        set({ favorites: [], emailAlertsEnabled: false, userId: null });
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("daystore-favorites-storage");
        }
      },

      addFavorite: (product) => {
        const userId = get().userId;
        const emailAlertsEnabled = get().emailAlertsEnabled;

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
        });

        if (userId) {
          addFavoriteToDb(product.id, emailAlertsEnabled);
        }
      },

      removeFavorite: (productId) => {
        const userId = get().userId;

        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== productId),
        }));

        if (userId) {
          removeFavoriteFromDb(productId);
        }
      },

      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },

      refreshFavorites: async () => {
        const userId = get().userId;

        if (userId) {
          try {
            const serverFavorites = await fetchServerFavorites();
            if (serverFavorites && serverFavorites.length > 0) {
              const products = serverFavorites.map((sf) => sf.product).filter(Boolean);
              const hasNotify = serverFavorites.some((sf) => sf.notify_on_sale);
              set({ favorites: products, emailAlertsEnabled: hasNotify });
              return;
            }
          } catch (err) {
            console.error("Failed to refresh from database:", err);
          }
        }

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

      toggleEmailAlerts: (userEmail?: string) => {
        const userId = get().userId;
        const nextState = !get().emailAlertsEnabled;
        set({ emailAlertsEnabled: nextState });
        const emailTarget = userEmail ? ` at ${userEmail}` : "";

        if (userId) {
          toggleNotifyInDb(nextState);
        }

        if (nextState) {
          toast.success(
            `You will receive email alerts${emailTarget} whenever your favorite items go on sale!`,
            { duration: 5000 }
          );
        } else {
          toast.info(
            "On-sale email alerts disabled. You can re-enable them anytime.",
            { duration: 4000 }
          );
        }
        return nextState;
      },

      sendSaleEmailAlert: (userEmail?: string) => {
        const currentFavorites = get().favorites;
        const onSaleItems = currentFavorites.filter((p) => isProductOnSale(p));
        const emailTarget = userEmail ? ` to ${userEmail}` : "";

        if (onSaleItems.length > 0) {
          const count = onSaleItems.length;
          toast.success(
            `You will receive email alerts${emailTarget}! (${count} of your favorited ${count === 1 ? 'item is' : 'items are'} currently on sale)`,
            { duration: 5000 }
          );
        } else {
          toast.success(
            `You will receive email alerts${emailTarget} whenever your favorite items go on sale!`,
            { duration: 5000 }
          );
        }
      },
    }),
    {
      name: "daystore-favorites-storage",
      partialize: (state) => ({
        favorites: state.favorites,
        emailAlertsEnabled: state.emailAlertsEnabled,
        userId: state.userId,
      }),
    },
  ),
);
