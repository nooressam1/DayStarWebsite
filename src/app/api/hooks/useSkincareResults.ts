'use client';

import { useState, useEffect } from "react";
import { useCartStore } from "@/modules/shared";
import { getProductSalePrice } from "@/modules/product";
import { getProductVariants } from "@/app/api/endpoints/product.endpoint";

export interface RecommendedProduct {
  productId: string;
  variant_id: string;
  category: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  photo: string;
  whyChosen: string;
}

export function useSkincareResults() {
  const { addToCart } = useCartStore();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [skinType, setSkinType] = useState("normal");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [sensitivity, setSensitivity] = useState("resilient");
  const [sunExposure, setSunExposure] = useState("moderate");

  useEffect(() => {
    // Read cached answers and backend routine response from sessionStorage on component mount
    const answersRaw = sessionStorage.getItem('skincare_results_answers');
    const routineRaw = sessionStorage.getItem('skincare_results_routine');

    if (answersRaw && routineRaw) {
      try {
        const answers = JSON.parse(answersRaw);
        const routineData = JSON.parse(routineRaw);

        setSkinType(answers.skinType || "normal");
        setConcerns(answers.concerns || []);
        setSensitivity(answers.sensitivity || "resilient");
        setSunExposure(answers.sunExposure || "moderate");

        const getWhyChosenText = (step: string) => {
          if (step === 'cleanser') {
            return `pH-balanced cleanser selected to align with your ${answers.skinType || "normal"} skin. It cleanses deeply without depleting natural skin hydration.`;
          }
          if (step === 'spf') {
            return `Broad-spectrum UV protection to prevent sun damage. Formulated with soothing ingredients suitable for your ${(answers.sensitivity || "resilient").replace('_', ' ')} skin.`;
          }
          if (step === 'toner') {
            return `Balancing toner that preps your skin, restores optimal pH, and boosts absorption of subsequent active serums.`;
          }
          if (step === 'serum' || step === 'treatment') {
            return `High-potency treatment chosen to directly address your concerns: ${(answers.concerns || []).join(', ') || 'overall skin health'}.`;
          }
          if (step === 'moisturizer') {
            return `Locks in moisture, reinforces the lipid barrier, and keeps skin smooth and plump throughout the day.`;
          }
          return `Recommended as part of your customized skincare sequence.`;
        };

        if (routineData) {
          const productsList: RecommendedProduct[] = [];
          Object.entries(routineData).forEach(([stepName, product]) => {
            if (product) {
              const prod = product as any;
              const inlineVariant = prod.variants && prod.variants.length > 0 ? prod.variants[0] : null;

              productsList.push({
                productId: prod.id,
                variant_id: inlineVariant ? inlineVariant.id : "",
                category: `${stepName.charAt(0).toUpperCase() + stepName.slice(1)} Product`,
                name: prod.name,
                size: inlineVariant?.size || (prod.step_type === 'serum' || prod.step_type === 'treatment' ? "30 ML" : "150 ML"),
                quantity: 1,
                price: getProductSalePrice(prod),
                photo: prod.images?.[0] || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&auto=format&fit=crop&q=60",
                whyChosen: getWhyChosenText(stepName)
              });
            }
          });
          setRecommendedProducts(productsList);
        }
      } catch (e) {
        console.error("Error parsing skincare results from storage:", e);
      }
    }
    setLoading(false);
  }, []);

  const handleAddAllToCart = async () => {
    if (addingToCart) return;
    setAddingToCart(true);

    for (const product of recommendedProducts) {
      try {
        let realVariantId = product.variant_id;
        let realSize = product.size;

        // Fetch variants from backend using product ID to guarantee accurate variant_id & stock
        const variants = await getProductVariants(product.productId);
        if (variants && variants.length > 0) {
          const validVariant = variants.find(v => v.stock > 0) || variants[0];
          realVariantId = validVariant.id;
          if (validVariant.size) {
            realSize = validVariant.size;
          }
        }

        if (realVariantId) {
          addToCart({
            product_id: product.productId,
            name: product.name,
            price: product.price,
            size: realSize,
            photo: product.photo,
            variant_id: realVariantId,
          }, 1);
        } else {
          console.warn(`No valid variant found for product ${product.name} (${product.productId})`);
        }
      } catch (error) {
        console.error(`Error resolving variant for product ${product.productId}:`, error);
      }
    }

    setAddingToCart(false);
    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);
  };

  return {
    skinType,
    concerns,
    sensitivity,
    sunExposure,
    recommendedProducts,
    isAddedToCart,
    addingToCart,
    loading,
    handleAddAllToCart
  };
}
