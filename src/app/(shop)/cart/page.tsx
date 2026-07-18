import { Suspense } from "react";
import { CartPage } from "@/modules/shoppingcart";
import { Spinner } from "@/modules/shared";

export default function Cart() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <CartPage />
    </Suspense>
  );
}
