import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Home, Briefcase, Map } from "lucide-react";
import { Address } from "@/app/api/types";
import { TextInput, CustomButton } from "@/modules/shared";
import { useAddressForm } from "@/app/api/hooks/useAddressForm";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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


  if (!isOpen) return null;

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

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#78534a]/10 p-6 sm:p-8 relative text-[#78534a]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-serif text-xl sm:text-2xl font-bold mb-1">
          {editingAddress ? "Edit Address" : "Add New Address"}
        </h2>
        <p className="text-xs text-brand-gray mb-6">
          Provide your shipping details for delivery.
        </p>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans">
          {/* Address Label Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-brand-primary-brown">Address Label</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Home", icon: Home },
                { name: "Work", icon: Briefcase },
                { name: "Other", icon: Map },
              ].map((item) => {
                const Icon = item.icon;
                const active = label === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => updateField("label", item.name)}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? "border-brand-primary-brown bg-brand-primary-brown/10 text-brand-primary-brown font-bold"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {label === "Other" && (
            <TextInput
              label="Custom Label Name"
              placeholder="e.g. Summer House, Mom's Place"
              value={customLabel}
              onChange={(e) => updateField("customLabel", e.target.value)}
            />
          )}

          {/* Street & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Street Name / Number *"
              placeholder="e.g. 15 El Tahrir Street"
              value={street}
              onChange={(e) => updateField("street", e.target.value)}
              required
            />
            <TextInput
              label="District / Area *"
              placeholder="e.g. Maadi, Zamalek, New Cairo"
              value={area}
              onChange={(e) => updateField("area", e.target.value)}
              required
            />
          </div>

          {/* Building, Floor, Apartment */}
          <div className="grid grid-cols-3 gap-3">
            <TextInput
              label="Building No. *"
              placeholder="e.g. 12"
              value={buildingNo}
              onChange={(e) => updateField("buildingNo", e.target.value)}
              required
            />
            <TextInput
              label="Floor"
              placeholder="e.g. 4"
              value={floorNumber}
              onChange={(e) => updateField("floorNumber", e.target.value)}
            />
            <TextInput
              label="Apt No."
              placeholder="e.g. 14"
              value={apartmentNumber}
              onChange={(e) => updateField("apartmentNumber", e.target.value)}
            />
          </div>

          {/* Governorate & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-brand-primary-brown">
                Governorate *
              </label>
              <select
                value={governorate}
                onChange={(e) => {
                  updateField("governorate", e.target.value);
                  if (!city) updateField("city", e.target.value);
                }}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-sans focus:outline-hidden focus:border-brand-primary-brown bg-white text-brand-primary-brown"
              >
                <option value="">Select Governorate</option>
                {EGYPT_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            <TextInput
              label="City *"
              placeholder="e.g. Cairo, Giza, Alexandria"
              value={city}
              onChange={(e) => updateField("city", e.target.value)}
              required
            />
          </div>

          {/* Postal Code & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Postal Code (Optional)"
              placeholder="e.g. 11511"
              value={postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
            />
            <TextInput
              label="Country"
              value={country}
              disabled
              readOnly
            />
          </div>

          {/* Set as Default Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => updateField("isDefault", e.target.checked)}
              className="w-4 h-4 text-brand-primary-brown rounded-xs border-stone-300 focus:ring-brand-primary-brown cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-xs font-medium text-brand-gray cursor-pointer">
              Set as my default shipping address
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800 cursor-pointer"
            >
              Cancel
            </button>
            <CustomButton
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-brand-primary-brown text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-brown/90 shadow-sm cursor-pointer"
            >
              {submitting ? "Saving..." : editingAddress ? "Save Changes" : "Add Address"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
