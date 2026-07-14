import { Product } from "./types/type";

/**
 * Computes the active sale price of a product.
 * Calculates price dynamically using discount_percentage if defined.
 */
export function getProductSalePrice(product: Product): number {
  if (product.discount_percentage && product.discount_percentage > 0) {
    return product.price * (1 - product.discount_percentage / 100);
  }
  return product.price;
}

/**
 * Determines if a product is currently on sale.
 */
export function isProductOnSale(product: Product): boolean {
  return !!(product.discount_percentage && product.discount_percentage > 0);
}

/**
 * Returns the discount percentage for a product.
 * Returns direct discount_percentage if defined, or returns 0.
 */
export function getProductDiscountPercentage(product: Product): number {
  return product.discount_percentage && product.discount_percentage > 0 
    ? product.discount_percentage 
    : 0;
}
