import { Suspense } from "react";
import { CheckoutPage, CheckoutPageSkeleton } from "@/modules/checkout";

export default function Checkout() {
  return (
    <Suspense fallback={<CheckoutPageSkeleton />}>
      <CheckoutPage />
    </Suspense>
  );
}
