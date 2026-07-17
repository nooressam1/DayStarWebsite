import { Suspense } from "react";
import { OrderConfirmedPage } from "@/modules/order-confirmed";
import { Spinner } from "@/modules/shared";

interface OrderConfirmedPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderConfirmed({ params }: OrderConfirmedPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <OrderConfirmedPage params={params} />
    </Suspense>
  );
}
