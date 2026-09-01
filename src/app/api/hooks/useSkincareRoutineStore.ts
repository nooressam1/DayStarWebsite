import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/app/api/types";
import { RecommendedProduct } from "@/modules/skincare-test/pages/SkincareTestResultsPage";
import { getProductSalePrice } from "@/modules/product";
import { useCartStore } from "./useCartStore";

export interface SkincareRoutineAnswers {
  skinType?: string;
  concerns?: string[];
  sensitivity?: string;
  sunExposure?: string;
  goals?: string[];
}

/**
 * Reusable helper to add an entire routine or list of recommended products to the user's cart.
 * If a product does not have any variants, it cannot be purchased and will not be added.
 */
export const addRoutineToCart = (
  products: (Product | RecommendedProduct)[],
  quantity = 1
) => {
  if (!products || products.length === 0) return;
  const { addToCart } = useCartStore.getState();

  products.forEach((item) => {
    // If standard Product
    if ("images" in item && "price" in item) {
      const prod = item as Product;
      const validVariant =
        prod.variants && prod.variants.length > 0
          ? prod.variants.find((v) => (v.stock ?? 1) > 0) || prod.variants[0]
          : null;

      if (!validVariant || !validVariant.id || validVariant.id === prod.id) {
        console.warn(`Product "${prod.name}" has no valid variants and cannot be purchased.`);
        return;
      }
      const finalPrice = getProductSalePrice(prod);
      addToCart(
        {
          variant_id: validVariant.id,
          product_id: prod.id,
          name: prod.name,
          price: finalPrice,
          size: validVariant.size || "",
          photo: prod.images?.[0] || "",
        },
        quantity
      );
    } else {
      // RecommendedProduct backwards compatibility
      const rec = item as RecommendedProduct;
      if (!rec.variant_id || rec.variant_id === rec.product_id) {
        console.warn(`Product "${rec.name}" has no valid variant_id and cannot be purchased.`);
        return;
      }
      addToCart(
        {
          variant_id: rec.variant_id,
          product_id: rec.product_id,
          name: rec.name,
          price: rec.price,
          size: rec.size === "Standard" ? "" : rec.size || "",
          photo: rec.photo,
        },
        quantity
      );
    }
  });
};

export interface SkincareRoutineState {
  answers: SkincareRoutineAnswers | null;
  rawRoutine: Record<string, unknown> | null;
  morningProducts: RecommendedProduct[];
  eveningProducts: RecommendedProduct[];
  allProducts: RecommendedProduct[];
  updatedAt: string | null;

  setRoutineData: (
    rawRoutine: Record<string, unknown>,
    answers: SkincareRoutineAnswers
  ) => void;
  setResolvedProducts: (
    morningProducts: RecommendedProduct[],
    eveningProducts: RecommendedProduct[],
    allProducts: RecommendedProduct[]
  ) => void;
  clearRoutine: () => void;
  hasRoutine: () => boolean;
}

export const useSkincareRoutineStore = create<SkincareRoutineState>()(
  persist(
    (set, get) => ({
      answers: null,
      rawRoutine: null,
      morningProducts: [],
      eveningProducts: [],
      allProducts: [],
      updatedAt: null,

      setRoutineData: (rawRoutine, answers) => {
        set({
          rawRoutine,
          answers,
          updatedAt: new Date().toISOString(),
        });
      },

      setResolvedProducts: (morningProducts, eveningProducts, allProducts) => {
        set({
          morningProducts,
          eveningProducts,
          allProducts,
          updatedAt: new Date().toISOString(),
        });
      },

      clearRoutine: () => {
        set({
          answers: null,
          rawRoutine: null,
          morningProducts: [],
          eveningProducts: [],
          allProducts: [],
          updatedAt: null,
        });
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("daystore-skincare-routine-storage");
        }
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.removeItem("skincare_results_routine");
          sessionStorage.removeItem("skincare_results_answers");
        }
      },

      hasRoutine: () => {
        const state = get();
        return Boolean(
          (state.allProducts && state.allProducts.length > 0) ||
          (state.morningProducts && state.morningProducts.length > 0) ||
          (state.eveningProducts && state.eveningProducts.length > 0) ||
          state.rawRoutine
        );
      },
    }),
    {
      name: "daystore-skincare-routine-storage",
      partialize: (state) => ({
        answers: state.answers,
        rawRoutine: state.rawRoutine,
        morningProducts: state.morningProducts,
        eveningProducts: state.eveningProducts,
        allProducts: state.allProducts,
        updatedAt: state.updatedAt,
      }),
    }
  )
);
