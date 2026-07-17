import { Suspense } from "react";
import CheckoutPage from "@/modules/checkout/page";
import { Spinner } from "@/modules/shared/component/Spinner";

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <CheckoutPage />
    </Suspense>
  );
}
