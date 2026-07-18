import { Suspense } from "react";
import { AccountPage } from "@/modules/dashboard";
import { Spinner } from "@/modules/shared";

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
