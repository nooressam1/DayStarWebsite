import { useState, useEffect } from "react";
import { useAuth } from "@/lib/supabase/auth-provider";
import { Address } from "@/app/api/types";
import {
  getUserAddresses,
  deleteUserAddress,
  setDefaultUserAddress,
} from "@/app/api/endpoints/address.endpoint";

export function useAddresses() {
  const { user, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Fetch user addresses
  const loadAddresses = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getUserAddresses();
    setAddresses(data);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadAddresses();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Open modal for adding a new address
  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an address
  const handleOpenEditModal = (address: Address) => {
    setEditingAddress(address);
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
  };
}
