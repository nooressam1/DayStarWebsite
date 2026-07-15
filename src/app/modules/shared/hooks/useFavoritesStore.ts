import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/utils/types/type";

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (product) =>
        set((state) => {
          if (state.favorites.some((p) => p.id === product.id)) return {};
          return { favorites: [...state.favorites, product] };
        }),
      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== productId),
        })),
      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },
    }),
    { name: "daystore-favorites-storage" },
  ),
);
