import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/supabase/auth-provider";
import { Address } from "@/app/api/types";
import {
  getUserAddresses,
  deleteUserAddress,
  setDefaultUserAddress,
} from "@/app/api/endpoints/address.endpoint";

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

export function useAddresses() {
  const { user, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Single consolidated address form state
  const [addressForm, setAddressForm] = useState<AddressFormState>(initialAddressForm);

  const updateField = useCallback(<K extends keyof AddressFormState>(field: K, value: AddressFormState[K]) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setAddressValues = useCallback((fields: AddressDetails) => {
    const { address, ...rest } = fields;
    setAddressForm((prev) => ({
      ...prev,
      ...rest,
      ...(address !== undefined ? { street: address } : {}),
    }));
  }, []);

  const resetAddress = useCallback(() => {
    setAddressForm(initialAddressForm);
  }, []);

  const populateFromAddress = useCallback((addr: Address) => {
    setAddressForm({
      city: addr.city || "",
      country: addr.country || "Egypt",
      isDefault: addr.is_default || false,
      label: (addr.label === "Home" || addr.label === "Work") ? addr.label : "Other",
      customLabel: (addr.label === "Home" || addr.label === "Work") ? "" : (addr.label || ""),
      street: addr.street || "",
      area: addr.area || "",
      governorate: addr.governorate || "",
      postalCode: addr.postal_code || "",
      buildingNo: addr.building_no || "",
      floorNumber: addr.floor_number || "",
      apartmentNumber: addr.apartment_number || "",
      selectedAddressId: addr.id,
    });
  }, []);

  // Fetch user addresses (memoized with useCallback)
  const loadAddresses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await getUserAddresses();
    setAddresses(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadAddresses();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, loadAddresses]);

  // Open modal for adding a new address
  const handleOpenAddModal = () => {
    setEditingAddress(null);
    resetAddress();
    setIsModalOpen(true);
  };

  // Open modal for editing an address
  const handleOpenEditModal = (address: Address) => {
    setEditingAddress(address);
    populateFromAddress(address);
    setIsModalOpen(true);
  };

  // Set default address
  const handleSetDefault = async (id: string) => {
    const result = await setDefaultUserAddress(id);
    if (result) {
      loadAddresses();
    }
  };

  // Delete address
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      const errorMsg = await deleteUserAddress(id);
      if (!errorMsg) {
        loadAddresses();
      }
    }
  };

  return {
    user,
    authLoading,
    addresses,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingAddress,
    handleOpenAddModal,
    handleOpenEditModal,
    handleSetDefault,
    handleDelete,
    loadAddresses,
    // Single Address Form State & Updater
    addressForm,
    setAddressForm,
    updateField,
    setAddressValues,
    resetAddress,
    populateFromAddress,
  };
}
