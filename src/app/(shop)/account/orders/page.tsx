import { Suspense } from "react";
import { OrdersPage } from "@/modules/dashboard";
import { Spinner } from "@/modules/shared";

export default function AccountOrders() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <OrdersPage />
    </Suspense>
  );
}
