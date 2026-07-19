'use client';

import { useState, useEffect } from "react";
import { useCartStore } from "@/modules/shared";

export interface RecommendedProduct {
  variant_id: string;
  category: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  photo: string;
  whyChosen: string;
}
import { getProductSalePrice } from "@/modules/product";

export function useSkincareResults() {
  const { addToCart } = useCartStore();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
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

        const productsList: RecommendedProduct[] = [];

        // Define whyChosen messages based on skin profile
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
          Object.entries(routineData).forEach(([stepName, product]) => {
            if (product) {
              productsList.push({
                variant_id: (product as any).id,
                category: `${stepName.charAt(0).toUpperCase() + stepName.slice(1)} Product`,
                name: (product as any).name,
                size: (product as any).step_type === 'serum' || (product as any).step_type === 'treatment' ? "30 ML" : "150 ML",
                quantity: 1,
                price: getProductSalePrice(product as any),
                photo: (product as any).images?.[0] || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&auto=format&fit=crop&q=60",
                whyChosen: getWhyChosenText(stepName)
              });
            }
          });
        }

        setRecommendedProducts(productsList);
      } catch (e) {
        console.error("Error parsing skincare results from storage:", e);
      }
    }
    setLoading(false);
  }, []);

  const handleAddAllToCart = () => {
    recommendedProducts.forEach(product => {
      addToCart({
        product_id: `prod-${product.variant_id}`,
        name: product.name,
        price: product.price,
        size: product.size,
        photo: product.photo,
        variant_id: product.variant_id
      }, 1);
    });

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
    loading,
    handleAddAllToCart
  };
}
