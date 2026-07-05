"use client";
import React, { useState } from "react";
import { Product } from "../../../../utils/types/type";
import CustomButton from "../../shared/component/CustomButton";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import QuantityButton from "./QuantityButton";
import FavoriteButton from "../../shared/component/FavoriteButton";
import { useCartStore } from "../../shared/hooks/useCartStore";
import { Variant } from "@/utils/types/type";
export default function ProductDetails({ product, variants }: { product: Product, variants: Variant[] }) {

  const [selectedSize, setSelectedSize] = useState<Variant | null>(variants[0] || null); // Default to 50ml
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCartStore();

  const displayPrice = product.on_sale && product.sale_price
    ? product.sale_price
    : product.price;
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-brand-primary-brown font-medium font-serif text-xl">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-serif font-bold text-brand-primary-brown text-xl">
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
                onClick={() => setSelectedSize(size)}
                className="py-2.5 px-5 text-sm rounded-lg w-fit" // Make size buttons slightly smaller
              >
                {size.size}
              </CustomButton>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <QuantityButton value={quantity} onDecrement={() => setQuantity(Math.max(1, quantity - 1))} onIncrement={() => setQuantity(quantity + 1)}></QuantityButton>
        <CustomButton
          key={"buy_now"}
          variant={"solid"}
          colorScheme={"primary"}
          onClick={() => { }}
          className="py-4 px-2 text-sm font-normal rounded-lg min-w-[80px]" // Make size buttons slightly smaller
        >
          Buy Now
        </CustomButton>
        <div className="flex flex-row gap-2">
          {" "}

          <CustomButton
            key={"add_to_cart"}
            variant={"outline"}
            colorScheme={"primary"}
            onClick={() => {
              console.log("pressed button")
              if (!selectedSize) return;
              addToCart({
                variant_id: selectedSize.id,
                product_id: product.id,
                name: product.name,
                price: product.price,
                size: selectedSize.size,
                photo: product.images[0],
              }, quantity)
            }}
            className="py-4 px-2 w-full  flex-1 text-sm font-normal rounded-lg "
          >
            Add to Cart
          </CustomButton>
          <FavoriteButton product={product}></FavoriteButton>
        </div>
      </div>
    </div>
  );
}
