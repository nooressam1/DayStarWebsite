'use client';

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { Check, Sun, Moon, Sparkles } from "lucide-react";
import ProductCartCard from "../../shoppingcart/components/ProductCartCard";
import { useCartStore, useSkincareRoutineStore, addRoutineToCart, CustomButton, SkincareRoutineAnswers } from "@/modules/shared";
import { getProductSalePrice } from "@/modules/product";
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
  step?: string;
  routineTime?: 'morning' | 'evening' | 'both';
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
  time?: 'morning' | 'evening' | 'both';
}

function SkincareResultsContent() {
  const { addToCart } = useCartStore();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'all'>('morning');
  const [morningProducts, setMorningProducts] = useState<RecommendedProduct[]>([]);
  const [eveningProducts, setEveningProducts] = useState<RecommendedProduct[]>([]);
  const [allUniqueProducts, setAllUniqueProducts] = useState<RecommendedProduct[]>([]);

  const [answers, setAnswers] = useState<SkincareRoutineAnswers>({
    skinType: SkinType.NORMAL,
    concerns: [],
    sensitivity: SkinSensitivity.RESILIENT,
    sunExposure: SunExposure.MODERATE,
  });

  useEffect(() => {
    const answersRaw = typeof window !== "undefined" ? sessionStorage.getItem("skincare_results_answers") : null;
    const routineRaw = typeof window !== "undefined" ? sessionStorage.getItem("skincare_results_routine") : null;
    const storeState = useSkincareRoutineStore.getState();

    let answersData = answersRaw ? null : storeState.answers;
    let routineData = routineRaw ? null : (storeState.rawRoutine as any);

    if (answersRaw && routineRaw) {
      try {
        answersData = JSON.parse(answersRaw);
        routineData = JSON.parse(routineRaw);
      } catch (e) {
        console.error("Failed to parse sessionStorage routine data:", e);
      }
    }

    if (answersData && routineData) {
      try {
        setAnswers({
          skinType: answersData.skinType || SkinType.NORMAL,
          concerns: answersData.concerns || [],
          sensitivity: answersData.sensitivity || SkinSensitivity.RESILIENT,
          sunExposure: answersData.sunExposure || SunExposure.MODERATE,
        });

        const stepRationales = [
          {
            steps: ["cleanser"],
            text: `pH-balanced cleanser selected to align with your ${answersData.skinType || "normal"} skin. It cleanses deeply without stripping natural skin hydration.`,
          },
          {
            steps: ["spf", "sunscreen"],
            text: `Broad-spectrum UV protection to prevent sun damage. Formulated with soothing ingredients suitable for your ${(answersData.sensitivity || "resilient").replace("_", " ")} skin.`,
          },
          {
            steps: ["toner"],
            text: `Balancing toner that preps your skin, restores optimal pH, and boosts absorption of subsequent active treatments.`,
          },
          {
            steps: ["treatment"],
            text: `Targeted nighttime treatment chosen to accelerate cellular renewal and directly address: ${(answersData.concerns || []).join(", ") || "targeted concerns"}.`,
          },
          {
            steps: ["serum"],
            text: `High-potency active serum formulated to directly target your concerns: ${(answersData.concerns || []).join(", ") || "overall skin radiance"}.`,
          },
          {
            steps: ["moisturizer"],
            times: ["evening"],
            text: `Rich nighttime barrier repair moisturizer that locks in moisture and supports skin regeneration while you sleep.`,
          },
        ];

        const getWhyChosenText = (step: string, time: 'morning' | 'evening' | 'all') => {
          const s = (step || '').toLowerCase();
          const match = stepRationales.find(
            (r) => r.steps.includes(s) && (!r.times || r.times.includes(time))
          );
          if (match) return match.text;

          return time === "evening"
            ? `Rich nighttime barrier repair moisturizer that locks in moisture and supports skin regeneration while you sleep.`
            : `Lightweight daily moisturizer selected to reinforce your skin barrier and maintain hydration throughout the day.`;
        };

        const processRawItems = (
          items: RawRoutineItem[],
          timeTag: 'morning' | 'evening' | 'all'
        ): RecommendedProduct[] => {
          return items.map((item) => {
            const product = item.product || (item as unknown as Product);
            const finalPrice = product ? getProductSalePrice(product) : item.price || 0;
            const inlineVariant = product?.variants?.[0];

            const chosenVariantId =
              item.variant_id || item.variantId || inlineVariant?.id || "";
            const variantSize = inlineVariant?.size || item.size || "";

            return {
              product_id: product?.id || item.id || "",
              variant_id: chosenVariantId,
              category: item.step || product?.category_id || item.category || "Routine Care",
              name: product?.name || item.name || "Skincare Essential",
              size: variantSize,
              quantity: 1,
              price: finalPrice,
              photo: product?.images?.[0] || item.photo || "",
              whyChosen: getWhyChosenText(item.step || "routine", timeTag),
              step: item.step,
              routineTime: item.time || (timeTag === 'all' ? 'both' : timeTag),
            };
          });
        };

        const extractItemsFromRoutineObj = (obj: any): RawRoutineItem[] => {
          if (!obj) return [];
          if (Array.isArray(obj)) return obj;
          if (Array.isArray(obj.recommendedProducts)) return obj.recommendedProducts;

          const items: RawRoutineItem[] = [];
          Object.entries(obj).forEach(([key, val]) => {
            if (val && typeof val === "object" && key !== "recommendedProducts") {
              items.push({
                step: key,
                product: val as Product,
                name: (val as Product).name,
                price: (val as Product).price,
              });
            }
          });
          return items;
        };

        // Dual routine support: routineData.morning & routineData.evening
        if (routineData.morning || routineData.evening) {
          const rawMorning = extractItemsFromRoutineObj(routineData.morning);
          const rawEvening = extractItemsFromRoutineObj(routineData.evening);

          const resolvedMorning = processRawItems(rawMorning, 'morning');
          const resolvedEvening = processRawItems(rawEvening, 'evening');

          setMorningProducts(resolvedMorning);
          setEveningProducts(resolvedEvening);

          // Deduplicate all unique products across morning + evening
          const uniqueMap = new Map<string, RecommendedProduct>();
          [...resolvedMorning, ...resolvedEvening].forEach((prod) => {
            if (prod.product_id && !uniqueMap.has(prod.product_id)) {
              uniqueMap.set(prod.product_id, prod);
            }
          });
          const uniqueList = Array.from(uniqueMap.values());
          setAllUniqueProducts(uniqueList);
          setLoading(false);

          // Save resolved products to persistent cache store
          useSkincareRoutineStore.getState().setResolvedProducts(resolvedMorning, resolvedEvening, uniqueList);
          if (!storeState.rawRoutine) {
            useSkincareRoutineStore.getState().setRoutineData(routineData, answers);
          }
        } else {
          // Legacy single routine fallback
          const rawProducts = extractItemsFromRoutineObj(routineData);
          const resolved = processRawItems(rawProducts, 'all');
          const morning = resolved.filter((p) => p.step !== "treatment");
          const evening = resolved.filter((p) => p.step !== "spf" && p.step !== "sunscreen");
          setMorningProducts(morning);
          setEveningProducts(evening);
          setAllUniqueProducts(resolved);
          setLoading(false);

          // Save resolved products to persistent cache store
          useSkincareRoutineStore.getState().setResolvedProducts(morning, evening, resolved);
          if (!storeState.rawRoutine) {
            useSkincareRoutineStore.getState().setRoutineData(routineData, answers);
          }
        }
      } catch (err) {
        console.error("Failed to parse stored routine or fetch variants:", err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const purchasableProducts = allUniqueProducts.filter(
    (p) => p.variant_id && p.variant_id !== p.product_id
  );
  const hasPurchasableItems = purchasableProducts.length > 0;

  const handleAddAllToCart = () => {
    if (purchasableProducts.length === 0) return;
    setAddingToCart(true);

    addRoutineToCart(purchasableProducts);

    setAddingToCart(false);
    setIsAddedToCart(true);
  };

  const getActiveProducts = () => {
    if (activeTab === 'morning') return morningProducts;
    if (activeTab === 'evening') return eveningProducts;
    return allUniqueProducts;
  };

  const activeProducts = getActiveProducts();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#004956]/20 border-t-[#004956] animate-spin" />
        <p className="text-base text-[#78534a] font-serif font-medium">
          Analyzing your skin profile and curating your custom dual routine...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Box 1: Text Results Summary */}
      <div className="bg-[#FDF9F8] rounded-2xl shadow-md shadow-[#78534a]/5 border border-[#78534a]/10 p-8 md:p-10">
        <h2 className="text-xl md:text-2xl font-serif text-[#78534a] font-bold mb-4">
          Your Skin Analysis
        </h2>
        <p className="text-[#374151] leading-relaxed font-light text-sm md:text-base">
          Based on your consultation, your skin type is <strong className="font-semibold text-brand-primary-brown capitalize">{answers.skinType}</strong> with a <strong className="font-semibold text-brand-primary-brown">{answers.sensitivity === SkinSensitivity.HIGHLY_SENSITIVE ? 'highly sensitive' : answers.sensitivity === SkinSensitivity.MODERATELY_SENSITIVE ? 'moderately sensitive' : 'resilient'}</strong> barrier.
        </p>
        <p className="text-[#686361] mt-4 leading-relaxed font-light text-sm md:text-base">
          Primary focus areas: <strong className="font-semibold text-brand-primary-brown">{(answers.concerns || []).length > 0 ? (answers.concerns || []).map((c: string) => c.replace('_', ' ')).join(', ') : "general balance & hydration"}</strong>. With <strong className="font-semibold text-brand-primary-brown capitalize">{answers.sunExposure}</strong> daily sun exposure, we have prepared targeted <strong>Day </strong> and <strong>Night </strong> routines.
        </p>
      </div>

      {/* Routine Navigation Tabs */}
      <div className="flex items-center justify-center">
        <div className="bg-[#FAF5F3] p-1.5 rounded-2xl border border-[#78534a]/15 shadow-sm inline-flex gap-2">
          <button
            onClick={() => setActiveTab('morning')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'morning'
              ? 'bg-[#004956] text-white shadow-sm'
              : 'text-[#78534a] hover:bg-white/60'
              }`}
          >
            <span>Morning Routine (AM)</span>
          </button>

          <button
            onClick={() => setActiveTab('evening')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'evening'
              ? 'bg-[#78534a] text-white shadow-sm'
              : 'text-[#78534a] hover:bg-white/60'
              }`}
          >
            <span>Night Routine (PM)</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'all'
              ? 'bg-[#4a342f] text-white shadow-sm'
              : 'text-[#78534a] hover:bg-white/60'
              }`}
          >
            <span>Complete Set ({allUniqueProducts.length})</span>
          </button>
        </div>
      </div>

      {/* Box 2: Product Recommendations List */}
      <div className="bg-[#FDF9F8] rounded-2xl shadow-md shadow-[#78534a]/5 border border-[#78534a]/10 overflow-hidden">
        <div className="bg-[#FAF5F3] border-b border-[#78534a]/10 py-6 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">

            <span className="text-[#78534a] font-serif text-base md:text-lg font-bold tracking-wide capitalize">
              {activeTab === 'morning'
                ? "Morning Routine Steps (Protect & Hydrate)"
                : activeTab === 'evening'
                  ? "Evening Routine Steps (Renew & Repair)"
                  : "All Recommended Products"}
            </span>
          </div>

          <span className="text-xs text-[#686361] font-sans font-medium">
            {activeProducts.length} {activeProducts.length === 1 ? 'Step' : 'Steps'}
          </span>
        </div>

        {/* List of recommended items */}
        <div className="p-6 md:p-8 space-y-6">
          {activeProducts.length === 0 ? (
            <div className="text-center py-10 text-[#686361] font-sans text-sm">
              No products found for this routine. Please retake the test.
            </div>
          ) : (
            activeProducts.map((product, idx) => (
              <div key={`${product.variant_id}-${idx}`} className="flex flex-col gap-3">
                {/* Step demarcation */}
                {product.step && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#78534a]/10 text-[#78534a]">
                      Step {idx + 1} • {product.step}
                    </span>
                  </div>
                )}

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

        {allUniqueProducts.length > 0 && (
          <CustomButton
            onClick={handleAddAllToCart}
            disabled={addingToCart || isAddedToCart || !hasPurchasableItems}
            icon={isAddedToCart ? Check : undefined}
            variant="solid"
            colorScheme="primary"
            className={`w-full sm:w-auto !px-8 !py-3.5 !rounded-xl font-semibold text-sm transition-all duration-300 shadow-md ${
              isAddedToCart
                ? "!bg-emerald-700 hover:!bg-emerald-700 text-white cursor-default"
                : !hasPurchasableItems
                ? "!bg-gray-400 opacity-60 cursor-not-allowed text-white"
                : "!bg-[#78534a] hover:!bg-[#78534a]/90 text-white"
            }`}
          >
            {isAddedToCart
              ? `All ${purchasableProducts.length} Items Added to Cart!`
              : !hasPurchasableItems
              ? "Routine Unavailable for Purchase"
              : `Add Complete Routine (${purchasableProducts.length} Items) to Cart`}
          </CustomButton>
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

