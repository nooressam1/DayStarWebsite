import React from "react";
import { QuantityButtonProps } from "@/utils/types/componentType";

export default function QuantityButton({ value, onDecrement, onIncrement }: QuantityButtonProps) {
  return (
    <div className=" rounded-sm h-full w-full flex  items-center justify-center border border-brand-primary-brown ">
      <button onClick={onDecrement} className="h-full cursor-pointer w-full hover:text-white hover:bg-brand-primary-brown  py-2 px-5">
        -
      </button>
      <div className=" border flex justify-center items-center border-t-0 border-b-0 h-full  px-5 w-full border-brand-primary-brown text-center ">
        <h1 className=" text-black text-sm p-2">{value}</h1>
      </div>
      <button onClick={onIncrement} className="  h-full w-full cursor-pointer hover:text-white hover:bg-brand-primary-brown px-5 py-2">
        +
      </button>
    </div>
  );
}
