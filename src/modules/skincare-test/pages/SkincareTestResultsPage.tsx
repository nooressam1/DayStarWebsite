'use client';

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import ProductCartCard from "../../shoppingcart/components/ProductCartCard";
import { useCartStore } from "@/modules/shared";
import { getProductSalePrice } from "@/modules/product";
import { getProductVariants } from "@/app/api/endpoints/product.endpoint";
import { SkinType, SkinSensitivity, SunExposure } from "@/enums";
import { Product } from "@/app/api/types";

export interface RecommendedProduct {
  product_id: string;
  variant_id: string;
  category: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  photo: string;
  whyChosen: string;
}

interface RawRoutineItem {
  id?: string;
  product?: Product;
  variant_id?: string;
  variantId?: string;
  size?: string;
  name?: string;
  step?: string;
  photo?: string;
  price?: number;
  category?: string;
}

function SkincareResultsContent() {
  const { addToCart } = useCartStore();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [skinType, setSkinType] = useState<string>(SkinType.NORMAL);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [sensitivity, setSensitivity] = useState<string>(SkinSensitivity.RESILIENT);
  const [sunExposure, setSunExposure] = useState<string>(SunExposure.MODERATE);

  useEffect(() => {
    const answersRaw = sessionStorage.getItem("skincare_results_answers");
    const routineRaw = sessionStorage.getItem("skincare_results_routine");

    if (answersRaw && routineRaw) {
      try {
        const answers = JSON.parse(answersRaw);
        const routineData = JSON.parse(routineRaw);

        setSkinType(answers.skinType || "normal");
        setConcerns(answers.concerns || []);
        setSensitivity(answers.sensitivity || "resilient");
        setSunExposure(answers.sunExposure || "moderate");

        const getWhyChosenText = (step: string) => {
          if (step === "cleanser") {
            return `pH-balanced cleanser selected to align with your ${answers.skinType || "normal"} skin. It cleanses deeply without depleting natural skin hydration.`;
          }
          if (step === "spf") {
            return `Broad-spectrum UV protection to prevent sun damage. Formulated with soothing ingredients suitable for your ${(answers.sensitivity || "resilient").replace("_", " ")} skin.`;
          }
          if (step === "toner") {
            return `Balancing toner that preps your skin, restores optimal pH, and boosts absorption of subsequent active serums.`;
          }
          if (step === "serum" || step === "treatment") {
            return `High-potency treatment chosen to directly address your concerns: ${(answers.concerns || []).join(", ") || "overall skin health"}.`;
          }
          return `Moisturizing formula selected to reinforce your skin barrier and lock in hydration all day long.`;
        };

        let rawProducts: RawRoutineItem[] = [];
        if (Array.isArray(routineData)) {
          rawProducts = routineData;
        } else if (Array.isArray(routineData?.recommendedProducts)) {
          rawProducts = routineData.recommendedProducts;
        } else if (routineData && typeof routineData === "object") {
          Object.entries(routineData).forEach(([key, val]) => {
            if (val && typeof val === "object" && key !== "recommendedProducts") {
              rawProducts.push({
                step: key,
                product: val as Product,
                name: (val as Product).name,
                price: (val as Product).price,
              });
            }
          });
        }

        Promise.all(
          rawProducts.map(async (item) => {
            const product = item.product || (item as unknown as Product);
            const finalPrice = product ? getProductSalePrice(product) : item.price || 0;

            let chosenVariantId = item.variant_id || item.variantId;
            let variantSize = item.size || "Standard";

            if (!chosenVariantId && product?.id) {
              const fetchedVariants = await getProductVariants(product.id);
              if (fetchedVariants && fetchedVariants.length > 0) {
                chosenVariantId = fetchedVariants[0].id;
                variantSize = fetchedVariants[0].size || "Standard";
              }
            }

            return {
              product_id: product?.id || item.id || "",
              variant_id: chosenVariantId || product?.id || item.id || "",
              category: item.step || product?.category_id || item.category || "Routine Care",
              name: product?.name || item.name || "Skincare Essential",
              size: variantSize,
              quantity: 1,
              price: finalPrice,
              photo: product?.images?.[0] || item.photo || "",
              whyChosen: getWhyChosenText(item.step || "routine"),
            };
          })
        ).then((resolved) => {
          setRecommendedProducts(resolved);
          setLoading(false);
        });
      } catch (err) {
        console.error("Failed to parse stored routine or fetch variants:", err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleAddAllToCart = () => {
    if (recommendedProducts.length === 0) return;
    setAddingToCart(true);

    recommendedProducts.forEach((item) => {
      addToCart({
        variant_id: item.variant_id,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        size: item.size,
        photo: item.photo,
      }, 1);
    });

    setAddingToCart(false);
    setIsAddedToCart(true);
  };

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
          Based on your results, it appears you have <strong className="font-semibold text-brand-primary-brown capitalize">{skinType}</strong> skin that is <strong className="font-semibold text-brand-primary-brown">{sensitivity === SkinSensitivity.HIGHLY_SENSITIVE ? 'highly sensitive' : sensitivity === SkinSensitivity.MODERATELY_SENSITIVE ? 'moderately sensitive' : 'resilient'}</strong>.
        </p>
        <p className="text-[#686361] mt-4 leading-relaxed font-light text-sm md:text-base">
          Your primary skin concerns are <strong className="font-semibold text-brand-primary-brown">{concerns.length > 0 ? concerns.map((c: string) => c.replace('_', ' ')).join(', ') : "general balance"}</strong>. With <strong className="font-semibold text-brand-primary-brown capitalize">{sunExposure}</strong> daily sun exposure, it is vital to keep your barrier protected and hydrated.
        </p>
        <p className="text-[#686361] mt-4 leading-relaxed font-light text-sm md:text-base">
          We suggest a simple daily routine using pH-balanced cleansers, soothing humectants, and a reliable broad-spectrum SPF to lock in hydration and combat environmental stressors.
        </p>
      </div>

      {/* Box 2: Product Recommendations List */}
      <div className="bg-[#FDF9F8] rounded-xl shadow-md shadow-[#78534a]/5 border border-[#78534a]/10 overflow-hidden">
        <div className="bg-[#FAF5F3] border-b border-[#78534a]/10 py-8 px-6 text-center">
          <span className="text-[#78534a] font-serif text-base md:text-md font-medium tracking-wide">
            Your new product list for your skincare routine
          </span>
        </div>

        {/* List of recommended items */}
        <div className="p-6 md:p-8 space-y-6">
          {recommendedProducts.length === 0 ? (
            <div className="text-center py-10 text-[#686361] font-sans text-sm">
              No specific recommendations generated. Please retake the test to select your preferences.
            </div>
          ) : (
            recommendedProducts.map((product, idx) => (
              <div key={`${product.variant_id}-${idx}`} className="flex flex-col gap-3">
                <ProductCartCard {...product} isEditable={false} />

                {/* Professional Justification Note */}
                <div className="ml-2 pl-4 border-l-2 border-[#004956]/40 bg-[#004956]/5 py-2.5 px-3 rounded-r-lg">
                  <p className="text-xs text-[#004956] font-sans leading-relaxed">
                    <strong className="font-semibold">Why this works for you:</strong> {product.whyChosen}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          href="/skincare-test"
          className="text-xs font-sans text-[#78534a] hover:underline cursor-pointer"
        >
          ← Retake Skin Care Test
        </Link>

        {recommendedProducts.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            disabled={addingToCart || isAddedToCart}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isAddedToCart
                ? "bg-emerald-700 text-white cursor-default"
                : "bg-[#78534a] hover:bg-[#78534a]/90 text-white"
            }`}
          >
            {isAddedToCart ? (
              <>
                <Check size={18} />
                <span>All Items Added to Cart!</span>
              </>
            ) : (
              <span>Add Complete Routine to Cart</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function SkincareTestResultsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans">
      <Suspense fallback={<div className="text-center py-10 font-serif text-[#78534a]">Loading results...</div>}>
        <SkincareResultsContent />
      </Suspense>
    </div>
  );
}
