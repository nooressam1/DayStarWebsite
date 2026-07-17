import { Suspense } from "react";
import ProductCatalogPage from "@/modules/product/page";
import { Spinner } from "@/modules/shared/component/Spinner";

export default function ProductCatalog() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <ProductCatalogPage />
    </Suspense>
  );
}
