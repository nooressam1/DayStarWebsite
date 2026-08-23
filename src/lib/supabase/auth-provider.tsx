'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { clearAuthData } from "@/app/api/utils/client";
import { useCartStore } from "@/app/api/hooks/useCartStore";
import { fetchServerCart } from "@/app/api/endpoints/cart.endpoint";
import { useFavoritesStore } from "@/app/api/hooks/useFavoritesStore";
import { fetchServerFavorites, syncGuestFavoritesToDb } from "@/app/api/endpoints/favorites.endpoint";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Sync cart and favorites with backend database on user change
  useEffect(() => {
    if (user) {
      useCartStore.getState().setUserId(user.id);
      useFavoritesStore.getState().setUserId(user.id);

      const syncServerCart = async () => {
        try {
          const serverCart = await fetchServerCart(user.id);
          useCartStore.getState().setCart(serverCart);
        } catch (err) {
          console.error("Failed to fetch database cart:", err);
        }
      };

      const syncServerFavorites = async () => {
        try {
          const serverFavorites = await fetchServerFavorites();
          if (serverFavorites) {
            const products = serverFavorites.map((sf) => sf.product).filter(Boolean);
            const hasNotify = serverFavorites.some((sf) => sf.notify_on_sale);
            useFavoritesStore.getState().setFavorites(products);
            useFavoritesStore.getState().setEmailAlertsEnabled(hasNotify);
          }
        } catch (err) {
          console.error("Failed to fetch database favorites:", err);
        }
      };

      syncServerCart();
      syncServerFavorites();
    } else {
      useCartStore.getState().setUserId(null);
      useFavoritesStore.getState().resetFavorites();
    }
  }, [user?.id]);

  useEffect(() => {
    const supabase = createClient();

    // If we didn't get an initial user server-side, fetch it client-side
    if (!initialUser) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        setLoading(false);
      });
    }

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialUser]);

  const signOut = async () => {
    await clearAuthData();
    useCartStore.getState().resetLocalCart();
    useFavoritesStore.getState().resetFavorites();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
