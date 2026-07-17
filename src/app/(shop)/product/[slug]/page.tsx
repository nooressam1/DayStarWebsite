import { Suspense } from "react";
import { ProductDetailPage } from "@/modules/product";
import { Spinner } from "@/modules/shared";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetail({ params }: ProductDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <ProductDetailPage params={params} />
    </Suspense>
  );
}
