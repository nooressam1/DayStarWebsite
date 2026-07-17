import { Suspense } from "react";
import FavoritesPage from "@/modules/dashboard/favorites/page";
import { Spinner } from "@/modules/shared/component/Spinner";

export default function AccountFavorites() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <FavoritesPage />
    </Suspense>
  );
}
