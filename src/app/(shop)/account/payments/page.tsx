import { Suspense } from "react";
import { PaymentsPage, AccountPageSkeleton } from "@/modules/dashboard";

export default function AccountPayments() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <PaymentsPage />
    </Suspense>
  );
}
