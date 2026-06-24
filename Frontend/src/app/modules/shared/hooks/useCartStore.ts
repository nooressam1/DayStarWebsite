import { CartState } from "@/utils/types/componentType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (newItem) =>
        set((state) => {
          const existing = state.cart.find(
            (item) => item.variant_id === newItem.variant_id,
          );
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.variant_id === newItem.variant_id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return { cart: [...state.cart, { ...newItem, quantity: 1 }] };
        }),
      removeFromCart: (variant_id: string) => set((state) => ({
        cart: state.cart.filter((item) => item.variant_id !== variant_id)
      })),
      incrementItem: (variant_id: string) => set((state) => ({
        cart: state.cart.map((item) =>
          item.variant_id === variant_id ? { ...item, quantity: item.quantity + 1 } : item)
      })), decrementItem: (variant_id: string) => set((state) => ({
        cart: state.cart.map((item) =>
          item.variant_id === variant_id ? { ...item, quantity: item.quantity - 1 } : item)
          .filter((item) => item.quantity > 0)
      })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: "daystore-cart-storage" },
  ),
);
