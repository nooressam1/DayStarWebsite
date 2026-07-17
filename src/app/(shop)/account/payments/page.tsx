import { Suspense } from "react";
import PaymentsPage from "@/modules/dashboard/payments/page";
import { Spinner } from "@/modules/shared/component/Spinner";

export default function AccountPayments() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <PaymentsPage />
    </Suspense>
  );
}
