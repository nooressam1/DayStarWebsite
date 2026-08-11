import { Suspense } from "react";
import { ProductDetailPage, ProductDetailPageSkeleton } from "@/modules/product";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetail({ params }: ProductDetailPageProps) {
  return (
    <Suspense fallback={<ProductDetailPageSkeleton />}>
      <ProductDetailPage params={params} />
    </Suspense>
  );
}
