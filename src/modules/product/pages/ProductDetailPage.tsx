"use client";

import React, { use } from "react";
import ProductDetails from "../components/ProductDetails";
import ImageCarousel from "../components/ImageCarousel";
import ProductReviews from "../components/ProductReviews";
import { ProductCard } from "@/modules/home/components/ProductCard";
import {
  useProductBySlugQuery,
  useProductVariantsQuery,
  useProductsQuery,
  useBestSellersQuery,
} from "@/app/api/hooks/useProductQueries";
import ProductDetailPageSkeleton from "../components/ProductDetailPageSkeleton";

import { Product, Variant } from "@/app/api/types";

interface ProductPageProps {
  params?: Promise<{ slug: string }>;
  slug?: string;
  initialProduct?: Product | null;
  initialVariants?: Variant[];
}

export default function ProductDetailPage({
  params,
  slug: propSlug,
  initialProduct,
  initialVariants = [],
}: ProductPageProps) {
  const resolvedSlug = params ? use(params).slug : propSlug || "";

  // React Query Hooks (Hydrated with initial pre-fetched data)
  const { data: product = initialProduct, isLoading: productLoading } = useProductBySlugQuery(
    resolvedSlug,
    initialProduct
  );
  const { data: variants = initialVariants, isLoading: variantsLoading } = useProductVariantsQuery(
    product?.id || "",
    initialVariants.length > 0 ? initialVariants : undefined
  );
  const { data: similarData } = useProductsQuery({
    categoryId: product?.category_id || undefined,
    limit: 6,
  });
  const { data: bestSellers = [] } = useBestSellersQuery();

  const hasInitialData = !!initialProduct;
  const isLoading = !hasInitialData && (productLoading || variantsLoading);

  if (isLoading) {
    return <ProductDetailPageSkeleton />;
  }

  if (!product) {
    return (
      <div className="text-center py-20 font-serif text-brand-primary-brown">
        <h2>Product Not Found</h2>
        <p className="font-sans text-sm text-brand-light-brown">
          We couldn&apos;t retrieve this item from the backend.
        </p>
      </div>
    );
  }

  const rawSimilar = similarData?.items || [];
  let similarProducts = rawSimilar.filter((p) => p.id !== product.id);

  if (similarProducts.length < 4) {
    const remainingCount = 4 - similarProducts.length;
    const fallbacks = bestSellers.filter(
      (p) => p.id !== product.id && !similarProducts.some((s) => s.id === p.id)
    );
    similarProducts = [...similarProducts, ...fallbacks.slice(0, remainingCount)];
  }

  similarProducts = similarProducts.slice(0, 4);

  return (
    <div className="py-10 px-10 flex flex-col gap-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-14 items-start w-full">
        <div className="w-full md:w-1/2 shrink-0">
          <ImageCarousel images={product.images} productName={product.name} />
        </div>
        <div className="w-full md:w-1/2">
          <ProductDetails product={product} variants={variants} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <ProductReviews productId={product.id} />
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 mt-8">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="text-brand-primary-brown font-bold font-serif text-2xl md:text-3xl">
              Similar Products
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
