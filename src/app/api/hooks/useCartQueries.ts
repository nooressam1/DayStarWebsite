"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchServerCart,
  upsertCartItemInDb,
  removeCartItemFromDb,
  clearServerCartInDb,
  mergeGuestCartToDb,
  ServerCartItem,
} from "@/app/api/endpoints/cart.endpoint";
import { useAuth } from "@/lib/supabase/auth-provider";

// 1. Fetch Database Cart for User
export function useUserCartQuery() {
  const { user } = useAuth();

  return useQuery<ServerCartItem[]>({
    queryKey: ["user-cart", user?.id],
    queryFn: () => fetchServerCart(user!.id),
    enabled: !!user,
  });
}

// 2. Upsert Item Mutation
export function useUpsertCartItemMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variant_id, quantity }: { variant_id: string; quantity: number }) => {
      if (!user) return Promise.resolve(false);
      return upsertCartItemInDb(user.id, variant_id, quantity);
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["user-cart", user.id] });
      }
    },
  });
}

// 3. Remove Item Mutation
export function useRemoveCartItemMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variant_id: string) => {
      if (!user) return Promise.resolve(false);
      return removeCartItemFromDb(user.id, variant_id);
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["user-cart", user.id] });
      }
    },
  });
}

// 4. Clear Cart Mutation
export function useClearCartMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!user) return Promise.resolve(false);
      return clearServerCartInDb(user.id);
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["user-cart", user.id] });
      }
    },
  });
}
