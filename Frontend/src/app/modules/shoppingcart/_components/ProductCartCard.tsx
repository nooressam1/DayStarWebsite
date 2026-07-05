import React from "react";
import QuantityButton from "../../product/_components/QuantityButton";
import { CartItemCardProps } from "@/utils/types/componentType";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import { Trash } from "lucide-react";

const ProductCartCard = ({ name, price, photo, size, quantity, isEditable = true, variant_id, onIncrement, onDecrement, onRemove }: CartItemCardProps) => {
  const displayImage =
    photo && photo.length > 0
      ? photo
      : "https://via.placeholder.com/150x150?text=No+Image";


  return (
    <div className="flex flex-row w-full items-center justify-between">
      <div className={isEditable ? "flex flex-row gap-5 w-1/2 items-center" : "flex flex-row gap-5 w-full items-center"}>
        <div className="w-20 h-20 sm:w-24 sm:h-24 aspect-square bg-brand-light-brown/5 rounded-xl overflow-hidden shrink-0 border border-brand-light-brown/5">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 ">
          <h1 className="text-black font-medium font-serif text-base">
            {name}
          </h1>
          <h1 className="font-work text-gray-500 text-sm">
            {size} / x{quantity}
          </h1>
        </div>
      </div>

      {isEditable ? (<div className="flex flex-row gap-2 items-center justify-center w-1/4">
        <div className="pl-4">
          <QuantityButton value={quantity} onDecrement={onDecrement} onIncrement={onIncrement}></QuantityButton>
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
