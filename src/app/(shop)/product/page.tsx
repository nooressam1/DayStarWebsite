import { Suspense } from "react";
import { ProductCatalogPage, ProductCatalogSkeleton } from "@/modules/product";
import { getProducts } from "@/app/api/endpoints/product.endpoint";
import { getCategories } from "@/app/api/endpoints/category.endpoint";

// Enable ISR: Cache the product catalog page and refresh in background every 60 seconds
export const revalidate = 60;

export default async function ProductCatalog() {
  const [productsData, categories] = await Promise.all([
    getProducts({ page: 1, limit: 9 }).catch(() => ({ items: [], total: 0 })),
    getCategories().catch(() => []),
  ]);

  return (
    <Suspense fallback={<ProductCatalogSkeleton />}>
      <ProductCatalogPage
        initialProductsData={productsData}
        initialCategories={categories}
      />
    </Suspense>
  );
}
