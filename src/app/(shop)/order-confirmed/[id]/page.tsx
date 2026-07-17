import { Suspense } from "react";
import OrderConfirmedPage from "@/modules/order-confirmed/[id]/page";
import { Spinner } from "@/modules/shared/component/Spinner";

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
