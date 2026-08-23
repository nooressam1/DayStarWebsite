"use client";

import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { Heart } from "lucide-react";
import { Product } from "@/app/api/types";
import { useFavoritesStore } from "@/modules/shared";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useAuthModalStore } from "@/app/api/hooks/useAuthModalStore";

export default function FavoriteButton({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const { openModal } = useAuthModalStore();

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isLiked = isFavorite(product.id);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    if (!mounted) return;

    if (!user) {
      openModal("login");
      return;
    }

    if (isLiked) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <CustomButton
      variant={mounted && isLiked ? "solid" : "outline"}
      colorScheme="primary"
      icon={Heart}
      onClick={handleToggle}
      className="px-8"
      aria-label="Toggle Wishlist"
    />
  );
}
