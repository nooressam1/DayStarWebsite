import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Home, Briefcase, Map } from "lucide-react";
import { Address } from "@/app/api/types";
import { TextInput, CustomButton } from "@/modules/shared";
import { useAddressForm } from "@/app/api/hooks";

import { EGYPT_GOVERNORATES } from "@/modules/checkout";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAddress: Address | null;
  onSaveSuccess: () => void;
  isFirstAddress?: boolean;
}

export default function AddressModal({
  isOpen,
  onClose,
  editingAddress,
  onSaveSuccess,
  isFirstAddress = false,
}: AddressModalProps) {
  const {
    addressForm,
    updateField,
    formError,
    submitting,
    handleSubmit,
  } = useAddressForm({
    isOpen,
    editingAddress,
    isFirstAddress,
    onClose,
    onSaveSuccess,
  });

  const {
    label,
    customLabel,
    street,
    area,
    governorate,
    postalCode,
    buildingNo,
    floorNumber,
    apartmentNumber,
    city,
    country,
    isDefault,
  } = addressForm;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen) return null;
  if (!mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans px-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl border border-[#78534a]/15 shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-scale-in"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#78534a]/10 bg-[#FAF5F3]">
          <h2 className="font-serif text-lg font-bold text-brand-primary-brown">
            {editingAddress ? "Edit Address" : "Add Shipping Address"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-gray hover:text-brand-primary-brown hover:bg-[#78534a]/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-3">
          {formError && (
            <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {formError}
            </div>
          )}

          {/* Label Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-brand-primary-brown">Address Label / Name</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "Home", icon: Home },
                { val: "Work", icon: Briefcase },
                { val: "Other", icon: Map },
              ].map((opt) => {
                const IconComp = opt.icon;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => updateField("label", opt.val)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 border rounded-xl text-sm font-semibold transition-all cursor-pointer ${label === opt.val
                      ? "border-brand-primary-brown bg-[#FAF5F3] text-brand-primary-brown"
                      : "border-[#78534a]/20 text-brand-gray hover:border-[#78534a]/40"
                      }`}
                  >
                    <IconComp className="h-4 w-4" />
                    <span>{opt.val}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Label Input */}
          {label === "Other" && (
            <TextInput
              label="Custom Label Name"
              required
              placeholder="e.g. Office, Parents, Gym"
              value={customLabel}
              onChange={(e) => updateField("customLabel", e.target.value)}
              maxLength={30}
            />
          )}

          {/* City & Country */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="City"
              required
              placeholder="e.g. Cairo"
              value={city}
              onChange={(e) => updateField("city", e.target.value)}
              maxLength={50}
            />
            <TextInput
              label="Country"
              required
              placeholder="Egypt"
              value={country}
              onChange={(e) => updateField("country", e.target.value)}
              maxLength={50}
            />
          </div>

          {/* Governorate & Postal Code */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-brand-primary-brown font-sans text-sm font-medium">
                Governorate <span className="text-red-500">*</span>
              </label>
              <select
                value={governorate}
                onChange={(e) => updateField("governorate", e.target.value)}
                className="rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors font-sans w-full bg-white border-brand-primary-brown/20 focus:border-brand-primary-brown cursor-pointer"
              >
                <option value="" disabled>Select Governorate</option>
                {EGYPT_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
            <TextInput
              label="Postal Code"
              placeholder="e.g. 11728 (Optional)"
              value={postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
              maxLength={20}
            />
          </div>

          {/* Area / District */}
          <TextInput
            label="Area / District"
            required
            placeholder="e.g. Maadi"
            value={area}
            onChange={(e) => updateField("area", e.target.value)}
            maxLength={100}
          />

          {/* Street Address */}
          <TextInput
            label="Street Address"
            required
            placeholder="e.g. 15 Tahrir Street"
            value={street}
            onChange={(e) => updateField("street", e.target.value)}
            maxLength={200}
          />

          {/* Building No, Floor, Apt */}
          <div className="grid grid-cols-3 gap-3">
            <TextInput
              label="Building No."
              required
              placeholder="e.g. Bldg 12"
              value={buildingNo}
              onChange={(e) => updateField("buildingNo", e.target.value)}
              maxLength={50}
            />
            <TextInput
              label="Floor No."
              placeholder="e.g. 4th Floor"
              value={floorNumber}
              onChange={(e) => updateField("floorNumber", e.target.value)}
              maxLength={30}
            />
            <TextInput
              label="Apartment No."
              placeholder="e.g. Apt 4B"
              value={apartmentNumber}
              onChange={(e) => updateField("apartmentNumber", e.target.value)}
              maxLength={30}
            />
          </div>

          {/* Set as Default Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input
              id="set-default-checkbox"
              type="checkbox"
              checked={isDefault}
              disabled={editingAddress?.is_default}
              onChange={(e) => updateField("isDefault", e.target.checked)}
              className="rounded border-brand-primary-brown/30 text-brand-primary-brown focus:ring-brand-primary-brown h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="set-default-checkbox"
              className="text-sm font-medium text-brand-primary-brown cursor-pointer select-none"
            >
              Set as my default shipping address
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-[#78534a]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-brand-primary-brown/20 text-brand-primary-brown hover:bg-[#78534a]/5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <CustomButton
              type="submit"
              variant="solid"
              colorScheme="primary"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg"
            >
              {submitting ? "Saving..." : "Save Address"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
