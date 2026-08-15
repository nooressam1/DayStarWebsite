'use client';

import React, { useState } from "react";
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Home, Briefcase, Map } from "lucide-react";
import { useAddresses } from "@/app/api/hooks/useAddresses";
import AddressModal from "../components/AddressModal";
import { CustomButton } from "@/modules/shared";
import { Address } from "@/app/api/types";

export default function AddressesPage() {
  const {
    user,
    authLoading,
    addresses,
    loading,
    handleSetDefault,
    handleDelete,
  } = useAddresses();

  // Local Modal UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  // Helper to render address icons based on label
  const renderAddressIcon = (addressLabel: string | null) => {
    switch (addressLabel) {
      case "Home":
        return <Home className="h-5 w-5" />;
      case "Work":
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Map className="h-5 w-5" />;
    }
  };

  if (authLoading || (loading && addresses.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary-brown"></div>
        <p className="text-sm text-brand-gray mt-4">Loading addresses...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 font-sans text-center">
        <MapPin className="h-10 w-10 text-brand-gray/60 mb-3" />
        <h3 className="font-serif text-lg font-bold text-brand-primary-brown">
          Please Login
        </h3>
        <p className="text-sm text-brand-gray max-w-sm mt-1">
          You must be logged in to view and manage your addresses.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-primary-brown/10 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-primary-brown">
            My Addresses
          </h1>
          <p className="text-sm text-brand-gray">
            Manage your shipping and delivery locations
          </p>
        </div>

        <CustomButton
          onClick={handleOpenAddModal}
          variant="solid"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary-brown text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-brand-primary-brown/90 shadow-sm transition-all cursor-pointer w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Address</span>
        </CustomButton>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#78534a]/20 rounded-xl bg-[#FAF5F3]/30 text-center">
          <div className="p-4 bg-brand-primary-brown/5 rounded-full text-brand-primary-brown mb-4">
            <MapPin className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-brand-primary-brown">
            No Addresses Saved
          </h3>
          <p className="text-sm text-brand-gray max-w-sm mt-1 mb-6">
            Save your shipping addresses for a faster and smoother checkout experience.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-2.5 bg-brand-primary-brown text-white text-sm font-medium rounded-lg hover:bg-brand-primary-brown/90 shadow-sm transition-all cursor-pointer"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          {addresses.map((address) => {
            const isDefault = address.is_default;
            return (
              <div
                key={address.id}
                className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-300 ${isDefault
                    ? "bg-white border-brand-primary-brown shadow-sm ring-1 ring-brand-primary-brown/20"
                    : "bg-[#FAF5F3]/40 border-[#78534a]/10 hover:border-[#78534a]/30 hover:bg-white"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 text-brand-primary-brown">
                      <div className="p-2 rounded-lg bg-brand-primary-brown/10">
                        {renderAddressIcon(address.label)}
                      </div>
                      <span className="font-serif font-bold text-base">
                        {address.label || "Address"}
                      </span>
                    </div>

                    {isDefault ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-brand-primary-brown text-white px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-xs text-brand-primary-brown/70 hover:text-brand-primary-brown underline font-medium cursor-pointer"
                      >
                        Set as default
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-brand-gray flex flex-col gap-1 mt-3 pl-1">
                    <p className="font-semibold text-black/80">
                      {address.street}
                    </p>
                    <p>
                      {address.building_no ? `Building ${address.building_no}, ` : ""}
                      {address.floor_number ? `Floor ${address.floor_number}, ` : ""}
                      {address.apartment_number ? `Apt ${address.apartment_number}` : ""}
                    </p>
                    <p>
                      {address.area ? `${address.area}, ` : ""}
                      {address.city ? `${address.city}, ` : ""}
                      {address.governorate || ""}
                    </p>
                    <p className="text-brand-gray/60 mt-1">{address.country || "Egypt"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#78534a]/10 pt-3 mt-4">
                  <button
                    onClick={() => handleOpenEditModal(address)}
                    className="p-2 text-brand-gray hover:text-brand-primary-brown hover:bg-brand-primary-brown/5 rounded-lg transition-all cursor-pointer"
                    title="Edit address"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-brand-gray hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    title="Delete address"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Address Modal for Add/Edit */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingAddress={editingAddress}
      />
    </div>
  );
}
