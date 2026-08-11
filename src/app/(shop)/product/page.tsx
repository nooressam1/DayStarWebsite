import { Suspense } from "react";
import { ProductCatalogPage } from "@/modules/product";
import { ProductCardSkeletonGrid } from "@/modules/shared";

export default function ProductCatalog() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ProductCardSkeletonGrid count={6} className="grid grid-cols-1 md:grid-cols-3 gap-8" />
        </div>
      }
    >
      <ProductCatalogPage />
    </Suspense>
  );
}
