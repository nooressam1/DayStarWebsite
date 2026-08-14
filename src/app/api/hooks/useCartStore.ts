import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Discount, OrderItem } from "@/app/api/types";
import {
  upsertCartItemInDb,
  removeCartItemFromDb,
  clearServerCartInDb,
} from "@/app/api/endpoints/cart.endpoint";

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
  userId: string | null;
  setUserId: (userId: string | null) => void;
  setCart: (cart: CartItem[]) => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  incrementItem: (variant_id: string) => void;
  decrementItem: (variant_id: string) => void;
  removeFromCart: (variant_id: string) => void;
  clearCart: (clearDb?: boolean) => void;
  resetLocalCart: () => void;
  setDiscount: (discount: Discount | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      discount: null,
      userId: null,

      setUserId: (userId) => set({ userId }),

      setDiscount: (discount) => set({ discount }),

      setCart: (cart) => set({ cart }),

      addToCart: (newItem, quantity = 1) => {
        const userId = get().userId;
        set((state) => {
          const existing = state.cart.find(
            (item) => item.variant_id === newItem.variant_id
          );
          let newCart: CartItem[];
          if (existing) {
            newCart = state.cart.map((item) =>
              item.variant_id === newItem.variant_id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newCart = [...state.cart, { ...newItem, quantity }];
          }

          if (userId) {
            const updatedItem = newCart.find((i) => i.variant_id === newItem.variant_id);
            if (updatedItem) {
              upsertCartItemInDb(userId, updatedItem.variant_id, updatedItem.quantity);
            }
          }

          return { cart: newCart };
        });
      },

      removeFromCart: (variant_id: string) => {
        const userId = get().userId;
        set((state) => ({
          cart: state.cart.filter((item) => item.variant_id !== variant_id),
        }));
        if (userId) {
          removeCartItemFromDb(userId, variant_id);
        }
      },

      incrementItem: (variant_id: string) => {
        const userId = get().userId;
        set((state) => {
          const newCart = state.cart.map((item) =>
            item.variant_id === variant_id ? { ...item, quantity: item.quantity + 1 } : item
          );
          const updatedItem = newCart.find((i) => i.variant_id === variant_id);
          if (userId && updatedItem) {
            upsertCartItemInDb(userId, updatedItem.variant_id, updatedItem.quantity);
          }
          return { cart: newCart };
        });
      },

      decrementItem: (variant_id: string) => {
        const userId = get().userId;
        set((state) => {
          const newCart = state.cart
            .map((item) =>
              item.variant_id === variant_id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0);

          const updatedItem = newCart.find((i) => i.variant_id === variant_id);
          if (userId) {
            if (updatedItem) {
              upsertCartItemInDb(userId, updatedItem.variant_id, updatedItem.quantity);
            } else {
              removeCartItemFromDb(userId, variant_id);
            }
          }
          return { cart: newCart };
        });
      },

      resetLocalCart: () => {
        set({ cart: [], discount: null, userId: null });
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("daystore-cart-storage");
        }
      },

      clearCart: (clearDb = true) => {
        const userId = get().userId;
        set({ cart: [], discount: null });
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("daystore-cart-storage");
        }
        if (clearDb && userId) {
          clearServerCartInDb(userId);
        }
      },
    }),
    {
      name: "daystore-cart-storage",
      partialize: (state) => ({ cart: state.cart, discount: state.discount, userId: state.userId }),
    }
  )
);
