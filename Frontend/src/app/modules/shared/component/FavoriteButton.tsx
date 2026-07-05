"use client";
 
import React from "react";
import CustomButton from "./CustomButton";
import { Heart } from "lucide-react";
import { Product } from "@/utils/types/type";
import { useFavoritesStore } from "../hooks/useFavoritesStore";

export default function FavoriteButton({ product }: { product: Product }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isLiked = isFavorite(product.id);

  const handleToggle = () => {
    if (isLiked) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <CustomButton
      variant={isLiked ? "solid" : "outline"}
      colorScheme="primary"
      icon={Heart}
      onClick={handleToggle}
      className="px-8"
      aria-label="Toggle Wishlist"
    />
  );
}
