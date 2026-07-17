import { Suspense } from "react";
import CartPage from "@/modules/shoppingcart/page";
import { Spinner } from "@/modules/shared/component/Spinner";

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
