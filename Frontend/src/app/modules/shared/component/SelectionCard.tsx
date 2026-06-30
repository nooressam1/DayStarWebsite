import React from "react";
import { SelectionCardProps } from "@/utils/types/componentType";

/**
 * Reusable selection card component that displays a title, description,
 * and a custom styled radio input.
 */
export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  checked,
  onChange,
  className = "",
  id,
  ...props
}) => {
  return (
    <label
      className={`flex gap-3 justify-between items-center p-4 rounded-lg border cursor-pointer transition-all select-none w-full ${
        checked
          ? "border-brand-primary-brown bg-brand-primary-brown/5 shadow-sm"
          : "border-brand-primary-brown/20 hover:border-brand-primary-brown/50"
      } ${className}`}
    >
      <div className="flex flex-col">
        <span className="font-sans text-sm font-semibold text-brand-primary-brown">
          {title}
        </span>
        <span className="font-sans text-xs text-gray-500 mt-1">
          {description}
        </span>
      </div>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border-brand-primary-brown/30 text-brand-primary-brown focus:ring-brand-primary-brown accent-brand-primary-brown"
        {...props}
      />
    </label>
  );
};

export default SelectionCard;
