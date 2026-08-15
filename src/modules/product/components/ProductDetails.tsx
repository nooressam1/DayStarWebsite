"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check } from "lucide-react";
import { Product, Variant } from "@/app/api/types";
import { CustomButton, FavoriteButton, useCartStore } from "@/modules/shared";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import QuantityButton from "./QuantityButton";
import { getProductSalePrice } from "@/modules/product";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useAuthModalStore } from "@/app/api/hooks/useAuthModalStore";

export default function ProductDetails({ product, variants }: { product: Product, variants: Variant[] }) {
  const router = useRouter();
  const { user } = useAuth();
  const { openModal } = useAuthModalStore();
  const defaultVariant: Variant = {
    id: product.id,
    product_id: product.id,
    size: "Standard",
    sku: "",
    stock: 99,
  };
  const [selectedSize, setSelectedSize] = useState<Variant>(variants[0] || defaultVariant);
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const { cart, addToCart } = useCartStore();

  const displayPrice = getProductSalePrice(product);

  const existingItem = cart.find((item) => item.variant_id === selectedSize?.id);
  const existingQuantity = existingItem ? existingItem.quantity : 0;

  const handleAddToCart = () => {
    if (!selectedSize) return;

    if (existingQuantity >= 5) {
      setErrorMessage("You already have the maximum limit of 5 units in your cart.");
      return;
    }

    if (existingQuantity + quantity > 5) {
      setErrorMessage(`Cannot add ${quantity} more. You already have ${existingQuantity} in your cart (maximum limit is 5).`);
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
    if (!selectedSize) return;

    if (existingQuantity >= 5) {
      setErrorMessage("You already have the maximum limit of 5 units in your cart.");
      return;
    }

    if (existingQuantity + quantity > 5) {
      setErrorMessage(`Cannot add ${quantity} more. You already have ${existingQuantity} in your cart (maximum limit is 5).`);
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
          <span className="font-serif font-semibold text-brand-primary-brown text-lg">
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
        <p className=" text-brand-gray font-sans text-md">
          {" "}
          {product.description}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-brand-light-brown font-sans text-md">Size</h1>
        <div className="flex gap-3">
          {variants.map((size) => {
            const isSelected = selectedSize?.id === size.id;

            return (
              <CustomButton
                key={size.id}
                // 4. If it's selected, turn it SOLID. If not, keep it OUTLINE!
                variant={isSelected ? "solid" : "outline"}
                colorScheme={isSelected ? "secondary" : "secondary"}
                // 5. Update state when the user presses the option
                onClick={() => {
                  setSelectedSize(size);
                  setErrorMessage(null);
                }}
                className="py-2.5 px-5 text-sm rounded-lg w-fit" // Make size buttons slightly smaller
              >
                {size.size}
              </CustomButton>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <QuantityButton
          value={quantity}
          min={1}
          max={5}
          onDecrement={() => {
            setQuantity(Math.max(1, quantity - 1));
            setErrorMessage(null);
          }}
          onIncrement={() => {
            setQuantity(Math.min(5, quantity + 1));
            setErrorMessage(null);
          }}
        />
        <CustomButton
          key={"buy_now"}
          variant={"solid"}
          colorScheme={"primary"}
          onClick={handleBuyNow}
          className="py-4 px-2 text-sm font-normal rounded-lg min-w-[80px]" // Make size buttons slightly smaller
        >
          Buy Now
        </CustomButton>
        <div className="flex flex-row gap-2">
          <CustomButton
            key={"add_to_cart"}
            variant={isAdded ? "solid" : "outline"}
            colorScheme={"primary"}
            onClick={handleAddToCart}
            icon={isAdded ? Check : undefined}
            className={`py-4 px-2 w-full flex-1 text-sm font-normal rounded-lg transition-all duration-300 ${
              isAdded ? "bg-[#557b55] text-white border-[#557b55] hover:bg-[#466946]" : ""
            }`}
          >
            {isAdded ? "Added to Cart" : "Add to Cart"}
          </CustomButton>
          <FavoriteButton product={product}></FavoriteButton>
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
