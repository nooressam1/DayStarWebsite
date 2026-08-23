import { Suspense } from "react";
import { AccountPage, AccountPageSkeleton } from "@/modules/dashboard";

export default function Account() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AccountPage />
    </Suspense>
  );
}
