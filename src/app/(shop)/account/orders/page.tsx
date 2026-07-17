import { Suspense } from "react";
import OrdersPage from "@/modules/dashboard/orders/page";
import { Spinner } from "@/modules/shared/component/Spinner";

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
