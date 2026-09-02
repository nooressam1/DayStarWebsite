import React, { useState, useEffect } from "react";
import Link from "next/link";
import QuantityButton from "../../product/components/QuantityButton";
import { CartItem } from "@/modules/shared";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import { Trash2 } from "lucide-react";
import { sanitizeImageUrl } from "@/utils/image/image.utils";

export interface CartItemCardProps extends CartItem {
  isEditable?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
}

const ProductCartCard = ({
  name,
  price,
  photo,
  size,
  quantity,
  isEditable = true,
  variant_id,
  onIncrement = () => { },
  onDecrement = () => { },
  onRemove = () => { },
}: CartItemCardProps) => {
  const [imgSrc, setImgSrc] = useState(() => sanitizeImageUrl(photo));

  useEffect(() => {
    setImgSrc(sanitizeImageUrl(photo));
  }, [photo]);

  // Derive kebab-case slug from product name
  const itemSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // Non-editable view (e.g., checkout review, order confirmation, skincare quiz results)
  if (!isEditable) {
    return (
      <div className="flex flex-row w-full items-center justify-between gap-3 py-2.5">
        <Link
          href={`/product/${itemSlug}`}
          className="flex flex-row gap-3 sm:gap-4 items-center hover:opacity-80 transition-opacity cursor-pointer min-w-0 flex-1"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square bg-brand-light-brown/5 rounded-xl overflow-hidden shrink-0 border border-brand-light-brown/10">
            <img
              src={imgSrc}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImgSrc("/no-image.png")}
            />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <h4 className="text-stone-900 font-medium font-serif text-sm sm:text-base hover:text-brand-primary-brown transition-colors truncate">
              {name}
            </h4>
            <p className="font-work text-stone-500 text-xs sm:text-sm">
              {size ? `${size} · ` : ""}Qty: {quantity}
            </p>
          </div>
        </Link>

        <div className="shrink-0 text-right pl-2">
          <span className="font-work text-stone-900 text-sm sm:text-base font-semibold">
            {formatMoney(price * (quantity || 1))}
          </span>
        </div>
      </div>
    );
  }

  // Editable shopping cart item view
  return (
    <div className="flex flex-col sm:flex-row w-full sm:items-center justify-between gap-4 py-4 sm:py-3.5 border-b border-[#78534A]/10 last:border-b-0">
      {/* Product Image & Details */}
      <Link
        href={`/product/${itemSlug}`}
        className="flex flex-row gap-3 sm:gap-4 items-center hover:opacity-85 transition-opacity cursor-pointer flex-1 sm:w-1/2 min-w-0"
      >
        <div className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 aspect-square bg-brand-light-brown/5 rounded-xl overflow-hidden shrink-0 border border-brand-light-brown/10">
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgSrc("/no-image.png")}
          />
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h3 className="text-stone-900 font-medium font-serif text-base hover:text-brand-primary-brown transition-colors line-clamp-2">
            {name}
          </h3>
          {size && (
            <span className="font-work text-stone-500 text-xs sm:text-sm">
              Size: {size}
            </span>
          )}
          {/* Unit price indicator */}
          <span className="font-work text-stone-400 text-xs">
            {formatMoney(price)} {quantity > 1 ? "each" : ""}
          </span>
        </div>
      </Link>

      {/* Mobile Row for Quantity + Price / Desktop Centered Controls */}
      <div className="flex items-center justify-between sm:justify-center sm:w-1/4 gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2">
          <div className="w-28 sm:w-32 h-9 sm:h-10 shrink-0">
            <QuantityButton
              value={quantity}
              min={1}
              max={5}
              onDecrement={onDecrement}
              onIncrement={onIncrement}
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 rounded-lg text-[#78534A] hover:bg-[#78534A]/10 transition-colors cursor-pointer shrink-0"
            title="Remove item"
            aria-label={`Remove ${name} from cart`}
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary-brown" />
          </button>
        </div>

        {/* Mobile-only Line Total Price */}
        <div className="sm:hidden text-right">
          <span className="font-work text-black  text-base">
            {formatMoney(price * quantity)}
          </span>
        </div>
      </div>

      {/* Desktop/Tablet Line Total Price */}
      <div className="hidden sm:flex sm:w-1/6 justify-end items-center">
        <span className="font-work text-black text-base ">
          {formatMoney(price * quantity)}
        </span>
      </div>
    </div>
  );
};

export default ProductCartCard;

