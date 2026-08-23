import { Suspense } from "react";
import { CartPage, CartPageSkeleton } from "@/modules/shoppingcart";

export default function Cart() {
  return (
    <Suspense fallback={<CartPageSkeleton />}>
      <CartPage />
    </Suspense>
  );
}
