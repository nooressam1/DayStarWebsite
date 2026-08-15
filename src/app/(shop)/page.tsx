import { Suspense } from "react";
import { HomePage, HomePageSkeleton } from "@/modules/home";
import { getCategories } from "@/app/api/endpoints/category.endpoint";
import { getBestSellers, getProducts } from "@/app/api/endpoints/product.endpoint";

// ISR: Cache the home page and automatically refresh the cache in the background every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const [categories, bestSellers, saleData] = await Promise.all([
    getCategories().catch(() => []),
    getBestSellers().catch(() => []),
    getProducts({ collection: "sale", discount: 50 }).catch(() => ({ items: [], total: 0 })),
  ]);

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePage
        initialCategories={categories}
        initialBestSellers={bestSellers}
        initialSaleProducts={saleData?.items || []}
      />
    </Suspense>
  );
}
