import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-10 h-10 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-[#78534a] border-t-transparent rounded-full animate-spin`}
    />
  );
}
