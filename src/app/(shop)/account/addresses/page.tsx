import { Suspense } from "react";
import AddressesPage from "@/modules/dashboard/addresses/page";
import { Spinner } from "@/modules/shared/component/Spinner";

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
