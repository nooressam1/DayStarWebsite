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
    <div className="rounded-md h-full w-full flex items-stretch justify-between border border-brand-primary-brown overflow-hidden">
      <button
        type="button"
        onClick={onDecrement}
        disabled={isMin}
        className={`px-2.5 sm:px-3 py-1 flex items-center justify-center transition-colors select-none ${isMin
          ? "opacity-35 cursor-not-allowed text-gray-400"
          : "cursor-pointer hover:text-white hover:bg-brand-primary-brown text-brand-primary-brown font-medium"
          }`}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <div className="border-x flex items-center justify-center px-2 sm:px-3 flex-1 border-brand-primary-brown text-center bg-transparent">
        <span className="text-stone-900 text-xs sm:text-sm font-medium select-none">{value}</span>
      </div>
      <button
        type="button"
        onClick={onIncrement}
        disabled={isMax}
        className={`px-2.5 sm:px-3 py-1 flex items-center justify-center transition-colors select-none ${isMax
          ? "opacity-35 cursor-not-allowed text-gray-400"
          : "cursor-pointer hover:text-white hover:bg-brand-primary-brown text-brand-primary-brown font-medium"
          }`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

