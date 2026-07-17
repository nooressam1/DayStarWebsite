'use client';

import React, { Suspense } from "react";
import Link from "next/link";
import { Check, AlertCircle } from "lucide-react";
import ProductCartCard from "../../shoppingcart/_components/ProductCartCard";
import { useSkincareResults } from "../hooks/useSkincareResults";

function SkincareResultsContent() {
  const {
    skinType,
    concerns,
    sensitivity,
    sunExposure,
    recommendedProducts,
    isAddedToCart,
    loading,
    handleAddAllToCart
  } = useSkincareResults();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#004956]/20 border-t-[#004956] animate-spin" />
        <p className="text-base text-[#78534a] font-serif font-medium">
          Analyzing your answers and assembling your custom routine...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Box 1: Text Results Summary */}
      <div className="bg-[#FDF9F8] rounded-xl shadow-md shadow-[#78534a]/5 border border-[#78534a]/10 p-8 md:p-10">
        <h2 className="text-xl md:text-xl font-serif text-[#78534a] font-bold mb-4">
          Your Skin Analysis
        </h2>
        <p className="text-[#374151] leading-relaxed font-light text-sm md:text-base">
          Based on your results, it appears you have <strong className="font-semibold text-brand-primary-brown capitalize">{skinType}</strong> skin that is <strong className="font-semibold text-brand-primary-brown">{sensitivity === 'highly_sensitive' ? 'highly sensitive' : sensitivity === 'moderately_sensitive' ? 'moderately sensitive' : 'resilient'}</strong>.
        </p>
        <p className="text-[#686361] mt-4 leading-relaxed font-light text-sm md:text-base">
          Your primary skin concerns are <strong className="font-semibold text-brand-primary-brown">{concerns.length > 0 ? concerns.map(c => c.replace('_', ' ')).join(', ') : "general balance"}</strong>. With <strong className="font-semibold text-brand-primary-brown capitalize">{sunExposure}</strong> daily sun exposure, it is vital to keep your barrier protected and hydrated.
        </p>
        <p className="text-[#686361] mt-4 leading-relaxed font-light text-sm md:text-base">
          We suggest a simple daily routine using pH-balanced cleansers, soothing humectants, and a reliable broad-spectrum SPF to lock in hydration and combat environmental stressors.
        </p>
      </div>

      {/* Box 2: Product Recommendations List */}
      <div className="bg-[#FDF9F8] rounded-xl shadow-md shadow-[#78534a]/5 border border-[#78534a]/10 overflow-hidden">
        {/* Box 2 Header Bar */}
        <div className="bg-[#FAF5F3] border-b border-[#78534a]/10 py-8 px-6 text-center">
          <span className="text-[#78534a]  font-serif text-base md:text-md font-medium tracking-wide">
            Your new product list for your skincare routine
          </span>
        </div>

        {/* Box 2 Body */}
        <div className="p-8 md:p-10 space-y-8">
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map((product, idx) => (
              <div key={product.variant_id || idx} className="flex flex-col border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                {/* Category Label */}
                <span className="text-[#8b7e7a] text-xs font-semibold uppercase tracking-wider mb-4 block">
                  {product.category}
                </span>

                {/* Reusable Checkout Component */}
                <div className="w-full">
                  <ProductCartCard
                    name={product.name}
                    price={product.price}
                    photo={product.photo}
                    size={product.size}
                    quantity={product.quantity}
                    isEditable={false}
                    variant_id={product.variant_id}
                    product_id={`prod-${product.variant_id}`}
                    onIncrement={() => { }}
                    onDecrement={() => { }}
                    onRemove={() => { }}
                  />
                </div>

                {/* Why chosen */}
                <div className="mt-4 bg-[#faf5f3]/60 rounded-xl p-4 border border-[#78534a]/5">
                  <p className="text-xs md:text-sm text-[#686361] leading-relaxed">
                    <strong className="text-[#004956] font-medium">Why it was chosen: </strong>
                    {product.whyChosen}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-[#686361] font-light text-sm md:text-base">
                No matching products found in the catalog. Our experts are currently replenishing our stock for your specific skin type profile.
              </p>
            </div>
          )}

          {recommendedProducts.length > 0 && (
            /* Add All to Cart Button */
            <div className="pt-6 border-t border-gray-100 flex justify-center">
              <button
                onClick={handleAddAllToCart}
                className="w-full md:w-auto px-10 py-4 bg-[#004956] hover:bg-[#004956]/90 text-white font-medium rounded-xl transition-all duration-300 shadow-md shadow-[#004956]/10 flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                Add All to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Retake Button Centered */}
      <div className="flex justify-center pt-2">
        <Link href="/skincare-test">
          <button className="px-8 py-3.5 bg-[#004956] text-white rounded-xl font-medium cursor-pointer hover:bg-[#004956]/90 transition-colors shadow-sm text-sm">
            Retake the Test
          </button>
        </Link>
      </div>

      {/* Floating Add To Cart Toast Banner */}
      {isAddedToCart && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#004956] text-white px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300 font-medium">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          All products added to cart successfully!
        </div>
      )}
    </div>
  );
}

export default function SkincareResultsPage() {
  return (
    <div className="min-h-screen bg-[#faf5f3] flex flex-col items-center px-4 py-12 md:py-20 font-sans">
      <div className="w-full max-w-4xl flex flex-col">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-3xl font-serif text-[#78534a] font-bold tracking-wide">
            Skin Care Test Results
          </h1>
          <p className="text-sm md:text-base text-[#686361]/80 mt-2 font-light">
            Your customized skincare sequence recommended by professionals
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center py-20 text-[#78534a] font-serif text-lg animate-pulse">
            Loading skin profile details...
          </div>
        }>
          <SkincareResultsContent />
        </Suspense>
      </div>
    </div>
  );
}
