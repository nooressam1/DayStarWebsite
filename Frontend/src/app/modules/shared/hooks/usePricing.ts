import { useMemo } from "react";

export interface PricingItem {
  price: number;
  quantity: number;
}

export interface PricingOptions {
  deliveryType?: string; // "home" | "pickup"
  deliveryFee?: number; // exact override for delivery fee
  discount?: {
    type: string;
    value: number;
  } | null;
  discountAmount?: number; // exact override for discount amount
  overrideTotal?: number; // exact override for total amount (recalculates discount)
  createdAt?: string; // date order was created
}

/**
 * Custom hook to calculate subtotal, delivery fee, discount, and total pricing
 * consistently across shopping cart, checkout, and order confirmation pages.
 * Optionally handles formatting of purchase and delivery dates.
 */
export function usePricing(items: PricingItem[], options: PricingOptions = {}) {
  // Use stringified options to prevent unnecessary useMemo runs if object reference changes
  const optionsKey = JSON.stringify(options);

  return useMemo(() => {
    // 1. Calculate subtotal
    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 2. Calculate delivery fee
    let deliveryFee = 0;
    if (options.deliveryFee !== undefined) {
      deliveryFee = options.deliveryFee;
    } else if (options.deliveryType === "home") {
      deliveryFee = 50;
    } else if (options.deliveryType === "pickup") {
      deliveryFee = 57;
    } else {
      deliveryFee = 5000; // default standard delivery fee
    }

    // 3. Calculate discount
    let discount = 0;
    if (options.discountAmount !== undefined) {
      discount = options.discountAmount;
    } else if (options.discount) {
      discount = options.discount.type === "percent"
        ? subTotal * (options.discount.value / 100)
        : options.discount.value;
    }

    // 4. Calculate total
    let total = subTotal + deliveryFee - discount;
    if (options.overrideTotal !== undefined) {
      total = options.overrideTotal;
      // Reconstruct discount only if it was not explicitly provided by options.discountAmount
      if (options.discountAmount === undefined) {
        discount = Math.max(0, subTotal + deliveryFee - total);
      }
    }

    // 5. Optional Date calculations
    let purchasedDate = "N/A";
    let deliveryDate = "N/A";

    if (options.createdAt) {
      purchasedDate = new Date(options.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      deliveryDate = new Date(new Date(options.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    }

    return {
      subTotal,
      deliveryFee,
      discount,
      total,
      purchasedDate,
      deliveryDate,
    };
  }, [items, optionsKey]); // eslint-disable-line react-hooks/exhaustive-deps
}
