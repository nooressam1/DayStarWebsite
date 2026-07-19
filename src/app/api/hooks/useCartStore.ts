import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Discount, OrderItem } from "@/app/api/types";

export interface CartItem extends Pick<OrderItem, "variant_id" | "quantity"> {
  product_id: string;
  name: string;
  price: number;
  size: string; // e.g., "50ml" (from variants.size)
  photo: string;
}

export interface CartState {
  cart: CartItem[];
  discount: Discount | null;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  incrementItem: (variant_id: string) => void;
  decrementItem: (variant_id: string) => void;
  removeFromCart: (variant_id: string) => void;
  clearCart: () => void;
  setDiscount: (discount: Discount | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      discount: null, setDiscount: (discount) => set({ discount }),

      addToCart: (newItem, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find(
            (item) => item.variant_id === newItem.variant_id,
          );
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.variant_id === newItem.variant_id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return { cart: [...state.cart, { ...newItem, quantity }] };
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

      clearCart: () => set({ cart: [], discount: null }),
    }),
    { name: "daystore-cart-storage" },
  ),
);
