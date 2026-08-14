'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { clearAuthData } from "@/app/api/utils/client";
import { useCartStore } from "@/app/api/hooks/useCartStore";
import { fetchServerCart } from "@/app/api/endpoints/cart.endpoint";

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

  // Sync cart with backend database on user change without duplicate guest merging
  useEffect(() => {
    if (user) {
      useCartStore.getState().setUserId(user.id);

      const syncServerCart = async () => {
        try {
          const serverCart = await fetchServerCart(user.id);
          useCartStore.getState().setCart(serverCart);
        } catch (err) {
          console.error("Failed to fetch database cart:", err);
        }
      };

      syncServerCart();
    } else {
      useCartStore.getState().setUserId(null);
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
