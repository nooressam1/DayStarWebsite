import { Suspense } from "react";
import { OrdersPage, AccountPageSkeleton } from "@/modules/dashboard";

export default function AccountOrders() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <OrdersPage />
    </Suspense>
  );
}
