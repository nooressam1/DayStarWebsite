import { BUTTON_VARIANTS } from "@/utils/theme/theme";
import { ButtonProps } from "@/utils/types/componentType";
import React from "react";

export default function CustomButton({
  children,
  icon: Icon,
  iconPosition = "left",
  variant = "solid",
  colorScheme = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center   tracking-wider text-sm transition-all duration-300 rounded-md px-4 py-2 cursor-pointer focus:outline-none";
  const selectedVariantStyles = BUTTON_VARIANTS[colorScheme][variant];
  return (
    <button
      className={`${baseStyles} ${selectedVariantStyles} ${className}`}
      {...props}
    >
      {/* Render Left Icon if chosen */}
      {Icon && iconPosition === "left" && (
        <Icon className={`h-5 w-5 ${children ? "mr-2.5" : ""}`} />
      )}

      {/* Render Text Content */}
      {children && <span>{children}</span>}

      {/* Render Right Icon if chosen */}
      {Icon && iconPosition === "right" && (
        <Icon className={`h-5 w-5 ${children ? "ml-2.5" : ""}`} />
      )}
    </button>
  );
}
