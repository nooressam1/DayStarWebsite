import { Suspense } from "react";
import { OrderConfirmedPage, OrderConfirmedPageSkeleton } from "@/modules/order-confirmed";

interface OrderConfirmedPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderConfirmed({ params }: OrderConfirmedPageProps) {
  return (
    <Suspense fallback={<OrderConfirmedPageSkeleton />}>
      <OrderConfirmedPage params={params} />
    </Suspense>
  );
}
