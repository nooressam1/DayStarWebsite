'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "../../shared/hooks/useFavoritesStore";
import { ProductCard } from "../../home/_components/ProductCard";

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render the layout wrapper without the dynamic store-dependent elements during hydration
    return (
      <div className="flex flex-col gap-6 font-sans">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-primary-brown">
            My Favorites
          </h1>
          <p className="text-sm text-brand-gray">
            Browse and manage your saved skincare products
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif font-bold text-brand-primary-brown">
          My Favorites
        </h1>
        <p className="text-sm text-brand-gray">
          Browse and manage your saved skincare products
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-[#FAF5F3]/50 rounded-xl border border-[#78534a]/10 p-8 shadow-sm mt-4 gap-4">
          <Heart className="h-12 w-12 text-[#78534a]/30 stroke-[1.5]" />
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-primary-brown">No favorites yet</h3>
            <p className="text-sm text-brand-gray mt-1 max-w-sm">
              Tap the heart icon on any skincare product card to save it here for easy access.
            </p>
          </div>
          <Link
            href="/product"
            className="rounded bg-brand-primary-brown px-6 py-2.5 text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
