"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
} from "@/app/api/endpoints/address.endpoint";
import { useAuth } from "@/lib/supabase/auth-provider";

export function useAddressesQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: getUserAddresses,
    enabled: !!user,
  });
}

// Address Mutations with automatic cache invalidation
export function useAddAddressMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof addUserAddress>[0]) => addUserAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
    },
  });
}

export function useUpdateAddressMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateUserAddress>[1] }) =>
      updateUserAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
    },
  });
}

export function useDeleteAddressMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUserAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
    },
  });
}

export function useSetDefaultAddressMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setDefaultUserAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
    },
  });
}
