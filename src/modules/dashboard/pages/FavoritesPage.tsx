'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Mail, Check } from "lucide-react";
import { useFavoritesStore } from "@/modules/shared";
import { ProductCard } from "@/modules/home/components/ProductCard";
import { useAuth } from "@/lib/supabase/auth-provider";

export default function FavoritesPage() {
  const { favorites, refreshFavorites, emailAlertsEnabled, toggleEmailAlerts } = useFavoritesStore();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadData = async () => {
      setLoading(true);
      await refreshFavorites();
      setLoading(false);
    };

    loadData();
  }, [mounted, refreshFavorites]);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-primary-brown/10 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-primary-brown">
            My Favorites
          </h1>
          <p className="text-sm text-brand-gray">
            Browse and manage your saved skincare products
          </p>
        </div>

        {favorites.length > 0 && !loading && (
          <button
            onClick={() => toggleEmailAlerts(user?.email)}
            className={`px-5 py-3 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm flex items-center gap-2 w-fit border border-transparent active:scale-95 ${
              emailAlertsEnabled
                ? "bg-[#557b55] hover:bg-[#466946] shadow-green-900/10"
                : "bg-brand-primary-brown hover:bg-brand-primary-brown/90"
            }`}
          >
            {emailAlertsEnabled ? (
              <>
                <Check className="h-4 w-4 stroke-[2.5]" />
                <span>Email Alerts Active</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>Email Me On-Sale Favorites</span>
              </>
            )}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-primary-brown border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-sm font-work text-brand-light-brown">Updating your favorites list...</span>
        </div>
      ) : favorites.length === 0 ? (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
