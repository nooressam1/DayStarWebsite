import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetailPage, ProductDetailPageSkeleton } from "@/modules/product";
import { getProduct, getProducts, getProductVariants } from "@/app/api/endpoints/product.endpoint";

// 1. Tell Next.js which product slugs to pre-render at build time
export async function generateStaticParams() {
  try {
    const data = await getProducts({ limit: 100 });
    return (data?.items || []).map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for products:", error);
    return [];
  }
}

// 2. Enable ISR: Cache product pages and revalidate in background every 60 seconds
export const revalidate = 60;

// 3. Allow dynamic slugs added after build time to be generated and cached on first visit
export const dynamicParams = true;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetail({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const variants = product.id ? await getProductVariants(product.id).catch(() => []) : [];

  return (
    <Suspense fallback={<ProductDetailPageSkeleton />}>
      <ProductDetailPage
        slug={slug}
        initialProduct={product}
        initialVariants={variants}
      />
    </Suspense>
  );
}
