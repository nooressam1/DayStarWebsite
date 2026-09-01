import React from "react";

export interface QuantityButtonProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onDecrement?: () => void;
  onIncrement?: () => void;
}

export default function QuantityButton({
  value,
  min = 1,
  max = 5,
  disabled = false,
  onDecrement,
  onIncrement,
}: QuantityButtonProps) {
  const isMin = disabled || value <= min;
  const isMax = disabled || value >= max;

  return (
    <div className="rounded-sm h-full w-full flex items-center justify-center border border-brand-primary-brown">
      <button
        type="button"
        onClick={onDecrement}
        disabled={isMin}
        className={`h-full w-full py-2 px-5 transition-colors ${
          isMin
            ? "opacity-40 cursor-not-allowed text-gray-400"
            : "cursor-pointer hover:text-white hover:bg-brand-primary-brown"
        }`}
      >
        -
      </button>
      <div className="border flex justify-center items-center border-t-0 border-b-0 h-full px-5 w-full border-brand-primary-brown text-center">
        <h1 className="text-black text-sm p-2">{value}</h1>
      </div>
      <button
        type="button"
        onClick={onIncrement}
        disabled={isMax}
        className={`h-full w-full py-2 px-5 transition-colors ${
          isMax
            ? "opacity-40 cursor-not-allowed text-gray-400"
            : "cursor-pointer hover:text-white hover:bg-brand-primary-brown"
        }`}
      >
        +
      </button>
    </div>
  );
}
