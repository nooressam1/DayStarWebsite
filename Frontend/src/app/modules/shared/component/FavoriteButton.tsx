// src/app/modules/product/_components/FavoriteButton.tsx
"use client";

import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  productId: string;
}

export default function FavoriteButton({ productId }: { productId: string }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleToggle = async () => {
    setIsLiked(!isLiked);
    // Optional: await axios.post(`/api/wishlist`, { productId });
  };

  return (
    <CustomButton
      variant={isLiked ? "solid" : "outline"}
      colorScheme={isLiked ? "primary" : "primary"}
      icon={Heart}
      onClick={handleToggle}
      className="px-8 "
      aria-label="Toggle Wishlist"
    />
  );
}
