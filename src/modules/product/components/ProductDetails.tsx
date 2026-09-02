"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Star } from "lucide-react";
import { Product, Variant } from "@/app/api/types";
import { CustomButton, FavoriteButton, useCartStore } from "@/modules/shared";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import QuantityButton from "./QuantityButton";
import { getProductSalePrice } from "@/modules/product";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useAuthModalStore } from "@/app/api/hooks/useAuthModalStore";

export default function ProductDetails({ product, variants = [] }: { product: Product, variants: Variant[] }) {
  const router = useRouter();
  const { user } = useAuth();
  const { openModal } = useAuthModalStore();
  const hasVariants = Boolean(variants && variants.length > 0);
  const [selectedSize, setSelectedSize] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const { cart, addToCart } = useCartStore();

  useEffect(() => {
    if (variants && variants.length > 0) {
      setSelectedSize((prev) => {
        if (prev && variants.some((v) => v.id === prev.id)) {
          return prev;
        }
        // Prefer first in-stock variant by default
        const inStockVariant = variants.find((v) => (v.stock ?? 0) > 0);
        return inStockVariant || variants[0];
      });
    } else {
      setSelectedSize(null);
    }
  }, [variants]);

  const displayPrice = getProductSalePrice(product);
  const currentStock = selectedSize?.stock ?? 0;
  const isOutOfStock = !hasVariants || currentStock <= 0;
  const maxAvailable = Math.min(5, Math.max(0, currentStock));

  const existingItem = cart.find((item) => item.variant_id === selectedSize?.id);
  const existingQuantity = existingItem ? existingItem.quantity : 0;

  const handleAddToCart = () => {
    if (!hasVariants || !selectedSize || !selectedSize.id) {
      setErrorMessage("This product is currently unavailable for purchase.");
      return;
    }

    if (selectedSize.stock <= 0) {
      setErrorMessage("This item is currently out of stock.");
      return;
    }

    if (existingQuantity >= maxAvailable) {
      if (existingQuantity >= 5) {
        setErrorMessage("You already have the maximum limit of 5 units in your cart.");
      } else {
        setErrorMessage(`Only ${selectedSize.stock} unit(s) available in stock.`);
      }
      return;
    }

    if (existingQuantity + quantity > selectedSize.stock) {
      setErrorMessage(`Cannot add ${quantity} more. Only ${selectedSize.stock - existingQuantity} more available in stock.`);
      return;
    }

    setErrorMessage(null);
    addToCart({
      variant_id: selectedSize.id,
      product_id: product.id,
      name: product.name,
      price: displayPrice,
      size: selectedSize.size,
      photo: product.images[0],
    }, quantity);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !hasVariants) {
      setErrorMessage("This product is currently unavailable for purchase.");
      return;
    }

    if (selectedSize.stock <= 0) {
      setErrorMessage("This item is currently out of stock.");
      return;
    }

    if (existingQuantity >= maxAvailable) {
      if (existingQuantity >= 5) {
        setErrorMessage("You already have the maximum limit of 5 units in your cart.");
      } else {
        setErrorMessage(`Only ${selectedSize.stock} unit(s) available in stock.`);
      }
      return;
    }

    if (existingQuantity + quantity > selectedSize.stock) {
      setErrorMessage(`Cannot add ${quantity} more. Only ${selectedSize.stock - existingQuantity} more available in stock.`);
      return;
    }

    setErrorMessage(null);
    addToCart({
      variant_id: selectedSize.id,
      product_id: product.id,
      name: product.name,
      price: displayPrice,
      size: selectedSize.size,
      photo: product.images[0],
    }, quantity);

    if (!user) {
      openModal("login");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-brand-primary-brown font-bold font-serif text-2xl md:text-3xl">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-sans text-[#686361] text-lg">
            {formatMoney(displayPrice)}
          </span>
          {product.on_sale && (
            <span className="line-through text-xs text-gray-400 font-sans">
              {formatMoney(product.price)}
            </span>
          )}
          {product.on_sale && (
            <span className="bg-[#c94a29] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm ml-1">
              Sale
            </span>
          )}
        </div>
        <p className="text-[#757575] font-sans text-md">
          {product.description}
        </p>
      </div>

      {/* Size Selection Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-brand-light-brown font-sans text-sm font-medium">Size</h2>
          {isOutOfStock ? (
            <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full">
              Out of Stock
            </span>
          ) : currentStock <= 3 ? (
            <span className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
              Only {currentStock} left
            </span>
          ) : (
            <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200/80 px-2.5 py-0.5 rounded-full">
              In Stock
            </span>
          )}
        </div>

        {hasVariants ? (
          <div className="flex flex-wrap gap-2.5">
            {variants.map((size) => {
              const isSelected = selectedSize?.id === size.id;
              const sizeOutOfStock = (size.stock ?? 0) <= 0;

              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setQuantity(1);
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-4 text-sm rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#78534a] text-white border-[#78534a] shadow-sm font-medium"
                      : "bg-white text-stone-700 border-stone-300 hover:border-[#78534a]/60 hover:bg-stone-50"
                  } ${sizeOutOfStock ? "opacity-60" : ""}`}
                >
                  <span>{size.size}</span>
                  {sizeOutOfStock && (
                    <span className="text-[10px] text-red-500 font-sans ml-1">(Out)</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-2 rounded-lg w-fit font-sans">
            Currently Unavailable (No sizes available)
          </p>
        )}
      </div>

      {/* Quantity & CTA Buttons Section */}
      <div className="flex flex-col gap-3">
        <div className="w-full">
          <QuantityButton
            value={quantity}
            min={1}
            max={maxAvailable || 1}
            disabled={isOutOfStock}
            onDecrement={() => {
              setQuantity((q) => Math.max(1, q - 1));
              setErrorMessage(null);
            }}
            onIncrement={() => {
              setQuantity((q) => Math.min(maxAvailable, q + 1));
              setErrorMessage(null);
            }}
          />
        </div>

        <CustomButton
          key={"buy_now"}
          variant={"solid"}
          colorScheme={"primary"}
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="py-4 px-2 text-sm font-normal rounded-lg min-w-[80px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? "Out of Stock" : "Buy Now"}
        </CustomButton>

        <div className="flex flex-row gap-2">
          <CustomButton
            key={"add_to_cart"}
            variant={isAdded ? "solid" : "outline"}
            colorScheme={"primary"}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            icon={isAdded ? Check : undefined}
            className={`py-4 px-2 w-full flex-1 text-sm font-normal rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              isAdded ? "bg-[#557b55] text-white border-[#557b55] hover:bg-[#466946]" : ""
            }`}
          >
            {isOutOfStock ? "Out of Stock" : isAdded ? "Added to Cart" : "Add to Cart"}
          </CustomButton>
          <FavoriteButton product={product} />
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200/80 px-3.5 py-2.5 rounded-lg text-xs font-sans mt-1 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

