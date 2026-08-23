import { Suspense } from "react";
import { FavoritesPage, AccountPageSkeleton } from "@/modules/dashboard";

export default function AccountFavorites() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <FavoritesPage />
    </Suspense>
  );
}
