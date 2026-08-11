import { Suspense } from "react";
import { ProductCatalogPage, ProductCatalogSkeleton } from "@/modules/product";

export default function ProductCatalog() {
  return (
    <Suspense fallback={<ProductCatalogSkeleton />}>
      <ProductCatalogPage />
    </Suspense>
  );
}
