import React from "react";
import ProductDetails from "../../product/_components/ProductDetails";
import { Product } from "../../../../utils/types/type"; // 1. Import your existing type!
import axios from "axios";
import ImageCarousel from "../_components/ImageCarousel";
import ProductCartCard from "../../shoppingcart/_components/ProductCartCard";
import { getProduct, getProductVariants } from "@/utils/services";
import ProductReviews from "../_components/ProductReviews";

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

  return (
    <div className="py-10 px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-14 items-center">
        {" "}
        <div className="md:max-w-1/2">
          <ImageCarousel images={product.images} productName={product.name} />
        </div>
        <div className="md:max-w-1/2">
          <ProductDetails product={product} variants={variants} ></ProductDetails>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <ProductReviews />
      </div>
    </div>
  );
}
