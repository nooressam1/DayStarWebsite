import { Suspense } from "react";
import { AddressesPage, AccountPageSkeleton } from "@/modules/dashboard";

export default function AccountAddresses() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AddressesPage />
    </Suspense>
  );
}
