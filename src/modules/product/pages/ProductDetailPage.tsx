import React from "react";
import ProductDetails from "../components/ProductDetails";
import { Product } from "@/app/api/types";
import ImageCarousel from "../components/ImageCarousel";
import { getProduct, getProductVariants, getProducts, getBestSellers } from "@/app/api/endpoints/product.endpoint";
import ProductReviews from "../components/ProductReviews";
import { ProductCard } from "@/modules/home/components/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
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
  const variants = await getProductVariants(product.id);

  // Fetch similar products (same category)
  const categoryId = product.category_id || undefined;
  const { items: rawSimilar } = await getProducts({ categoryId, limit: 6 });

  let similarProducts = (rawSimilar || []).filter((p) => p.id !== product.id);

  // Fallback to best sellers if we don't have enough similar products
  if (similarProducts.length < 4) {
    const bestSellers = await getBestSellers();
    const remainingCount = 4 - similarProducts.length;
    const fallbacks = bestSellers.filter(
      (p) => p.id !== product.id && !similarProducts.some((s) => s.id === p.id)
    );
    similarProducts = [...similarProducts, ...fallbacks.slice(0, remainingCount)];
  }

  // Ensure we show exactly 4
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
