import React from "react";
import Link from "next/link";
import QuantityButton from "../../product/components/QuantityButton";
import { CartItem } from "@/modules/shared";

export interface CartItemCardProps extends CartItem {
  isEditable?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
}
import { formatMoney } from "@/utils/format/format.moneyFormat";
import { Trash } from "lucide-react";
import { sanitizeImageUrl } from "@/utils/image/image.utils";
import { useState, useEffect } from "react";

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

  return (
    <div className="flex flex-row w-full items-center justify-between">
      <Link
        href={`/product/${itemSlug}`}
        className={`flex flex-row gap-5 items-center hover:opacity-80 transition-opacity cursor-pointer ${isEditable ? "w-1/2" : "w-full"
          }`}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 aspect-square bg-brand-light-brown/5 rounded-xl overflow-hidden shrink-0 border border-brand-light-brown/5">
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgSrc("/no-image.png")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-black font-medium font-serif text-base hover:text-brand-primary-brown transition-colors">
            {name}
          </h1>
          <h1 className="font-work text-gray-500 text-sm">
            {size ? `${size} / ` : ""}x{quantity}
          </h1>
        </div>
      </Link>

      {isEditable ? (<div className="flex flex-row gap-2 items-center justify-center w-1/4">
        <div className="pl-4">
          <QuantityButton value={quantity} min={1} max={5} onDecrement={onDecrement} onIncrement={onIncrement} />
        </div>
        <button onClick={onRemove}><Trash color="#78534A"></Trash></button>
      </div>) : null}
      <div className="w-1/6 flex justify-end">
        <h1 className="font-work text-black text-base">
          {" "}
          {formatMoney(price)}
        </h1>

      </div>
    </div>
  );
};

export default ProductCartCard;
