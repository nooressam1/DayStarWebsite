'use client';

import React from "react";
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Home, Briefcase, Map } from "lucide-react";
import { useAddresses } from "@/app/api/hooks";
import AddressModal from "../components/AddressModal";
import { CustomButton } from "@/modules/shared";

export default function AddressesPage() {
  const {
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
  } = useAddresses();


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
    <div className="p-1 sm:p-4 md:p-6 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-brand-primary-brown">
            My Shipping Addresses
          </h1>
          <p className="text-xs md:text-sm text-brand-gray mt-1">
            Manage your saved shipping locations for faster checkout.
          </p>
        </div>
        <CustomButton
          onClick={handleOpenAddModal}
          variant="outline"
          colorScheme="primary"
          icon={Plus}
          disabled={addresses.length >= 6}
          className="flex flex-row items-center py-2 px-3 text-xs md:text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Add Address</span>
        </CustomButton>
      </div>

      {addresses.length >= 6 && (
        <div className="mb-4 text-xs font-semibold text-brand-primary-brown bg-[#FAF5F3] border border-brand-primary-brown/20 rounded-xl p-3 flex items-center gap-2">
          <span>⚠️</span>
          <span>You have reached the maximum limit of 6 saved addresses. Please delete an address to add a new one.</span>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#78534a]/20 rounded-xl bg-[#FAF5F3]/30">
          <div className="p-4 bg-brand-primary-brown/5 rounded-full text-brand-primary-brown mb-4">
            <MapPin className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-brand-primary-brown">
            No Addresses Added Yet
          </h3>
          <p className="text-sm text-brand-gray text-center max-w-sm mt-1">
            Add your addresses here for a quicker and easier checkout experience.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between gap-4 ${address.is_default
                ? "bg-[#FAF5F3] border-brand-primary-brown shadow-sm"
                : "bg-white border-[#78534a]/15 hover:border-[#78534a]/30"
                }`}
            >
              {/* Address Header */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-primary-brown/5 text-brand-primary-brown rounded-xl">
                    {renderAddressIcon(address.label)}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-primary-brown text-base">
                      {address.label || "Address"}
                    </h4>
                    {address.is_default && (
                      <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-[#78534a] font-semibold bg-[#78534a]/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(address)}
                    className="p-2 text-brand-gray hover:text-brand-primary-brown hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-brand-gray hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Address Body */}
              <div className="text-sm text-brand-primary-brown/85 font-sans leading-relaxed pl-1">
                <p className="font-medium text-brand-primary-brown">
                  {address.street} {address.area && `, ${address.area}`}
                </p>
                {address.governorate && (
                  <p className="text-[#78534a]/70 text-xs font-semibold mt-0.5">Gov: {address.governorate}</p>
                )}
                {(address.building_no || address.floor_number || address.apartment_number) && (
                  <p className="text-brand-gray text-xs mt-0.5">
                    {address.building_no ? `Bldg: ${address.building_no}` : ""}
                    {address.floor_number ? ` Floor: ${address.floor_number}` : ""}
                    {address.apartment_number ? ` Apt: ${address.apartment_number}` : ""}
                  </p>
                )}
                <p className="text-brand-gray text-xs mt-0.5">
                  {address.city}, {address.country}
                  {address.postal_code ? ` (Postal: ${address.postal_code})` : ""}
                </p>
              </div>

              {/* Action Footer */}
              {!address.is_default && (
                <div className="border-t border-[#78534a]/10 pt-3 mt-1 flex justify-end">
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-xs text-brand-primary-brown/80 font-bold hover:text-brand-primary-brown hover:underline transition-colors cursor-pointer"
                  >
                    Set as Default
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingAddress={editingAddress}
        onSaveSuccess={loadAddresses}
        isFirstAddress={addresses.length === 0}
      />
    </div>
  );
}
