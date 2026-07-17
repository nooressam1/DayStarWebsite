import { Suspense } from "react";
import AccountPage from "@/modules/dashboard/page";
import { Spinner } from "@/modules/shared/component/Spinner";

export default function Account() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <AccountPage />
    </Suspense>
  );
}
