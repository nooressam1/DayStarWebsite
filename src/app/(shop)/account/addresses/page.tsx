import { Suspense } from "react";
import { AddressesPage } from "@/modules/dashboard";
import { Spinner } from "@/modules/shared";

export default function AccountAddresses() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <AddressesPage />
    </Suspense>
  );
}
