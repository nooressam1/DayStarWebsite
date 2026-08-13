import { useCallback } from "react";
import { useAuth } from "@/lib/supabase/auth-provider";
import {
  useAddressesQuery,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "./useAddressQueries";
import { useQueryClient } from "@tanstack/react-query";

export interface AddressFormState {
  city: string;
  area: string;
  street: string;
  floorNumber: string;
  apartmentNumber: string;
  governorate: string;
  postalCode: string;
  buildingNo: string;
  label: string;
  customLabel: string;
  country: string;
  isDefault: boolean;
  selectedAddressId: string;
}

export const initialAddressForm: AddressFormState = {
  city: "",
  area: "",
  street: "",
  floorNumber: "",
  apartmentNumber: "",
  governorate: "",
  postalCode: "",
  buildingNo: "",
  label: "Home",
  customLabel: "",
  country: "Egypt",
  isDefault: false,
  selectedAddressId: "",
};

export type AddressDetails = Partial<AddressFormState> & { address?: string };

/**
 * Pure data management hook for user addresses.
 * Provides query data and mutation handlers (set default, delete).
 */
export function useAddresses() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  // React Query for Addresses
  const { data: addresses = [], isLoading: addressesLoading } = useAddressesQuery();
  const setDefaultMutation = useSetDefaultAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();

  const loadAddresses = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
  }, [queryClient, user?.id]);

  // Set default address handler
  const handleSetDefault = async (id: string) => {
    return setDefaultMutation.mutateAsync(id);
  };

  // Delete address handler
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      return deleteAddressMutation.mutateAsync(id);
    }
  };

  return {
    user,
    authLoading,
    addresses,
    loading: addressesLoading,
    handleSetDefault,
    handleDelete,
    loadAddresses,
    isSetDefaultLoading: setDefaultMutation.isPending,
    isDeleteLoading: deleteAddressMutation.isPending,
  };
}

