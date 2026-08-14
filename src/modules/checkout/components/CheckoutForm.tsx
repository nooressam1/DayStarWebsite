"use client";

import React from "react";
import { TextInput, SelectionCard } from "@/modules/shared";
import { EGYPT_GOVERNORATES } from "@/modules/checkout";
import { useCheckoutForm, CheckoutFormValues } from "../hooks/useCheckoutForm";
import { Address } from "@/app/api/types";
import { Plus, MapPin, CheckCircle2 } from "lucide-react";

interface CheckoutFormProps {
  user: any;
  savedAddresses: Address[];
  onChange: (values: CheckoutFormValues, errors: Record<string, string>) => void;
  onSubmit?: (values: CheckoutFormValues) => void;
}

export function CheckoutForm({ user, savedAddresses, onChange }: CheckoutFormProps) {
  const {
    formValues,
    errors,
    updateField,
    selectSavedAddress,
    setAddressMode,
  } = useCheckoutForm({
    user,
    savedAddresses,
    onChange,
  });

  const {
    fullName,
    phoneNumber,
    email,
    paymentMethod,
    city,
    area,
    street,
    buildingNo,
    floorNumber,
    apartmentNumber,
    governorate,
    selectedAddressId,
    addressMode,
    saveNewAddress,
  } = formValues;

  const isAddingNewAddress = addressMode === "new" || savedAddresses.length === 0;

  return (
    <div className="w-full flex flex-col gap-4 pr-4 font-sans text-brand-primary-brown">
      <h1 className="text-brand-primary-brown font-semibold font-serif text-3xl">Checkout</h1>

      {/* Personal Information */}
      <div>
        <h2 className="text-black font-regular font-sans text-md mb-3">Personal Information</h2>
        <div className="flex flex-col gap-3">
          <TextInput
            label="Full Name *"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            error={errors.fullName}
          />
          <TextInput
            label="Phone Number *"
            placeholder="01234567890"
            value={phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            error={errors.phoneNumber}
          />
          <TextInput
            label="Email Address"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
          />
        </div>
      </div>

      {/* Saved Address Selection vs Add New Address Option */}
      {savedAddresses.length > 0 && (
        <div>
          <h2 className="text-black font-regular font-sans text-md mb-3">Select Delivery Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {savedAddresses.map((addr) => {
              const isSelected = addressMode === "saved" && selectedAddressId === addr.id;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => selectSavedAddress(addr)}
                  className={`p-4.5 sm:p-5 rounded-2xl border text-left text-sm transition-all cursor-pointer flex justify-between items-start ${isSelected
                    ? "border-brand-primary-brown bg-brand-primary-brown/10 font-bold shadow-xs"
                    : "border-stone-200 hover:bg-stone-50"
                    }`}
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-sm flex items-center gap-1.5 text-stone-900">
                      <MapPin className="w-4 h-4 shrink-0 text-brand-primary-brown" />
                      <span>{addr.label || "Saved Address"}</span>
                      {addr.is_default && (
                        <span className="text-[11px] font-bold bg-brand-primary-brown/15 text-brand-primary-brown px-2 py-0.5 rounded-full ml-1">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                      {addr.street}, {addr.city}
                    </p>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-primary-brown shrink-0 mt-0.5 ml-2" />}
                </button>
              );
            })}

            {/* Option to Add a New Address */}
            <button
              type="button"
              onClick={() => setAddressMode("new")}
              className={`p-4.5 sm:p-5 rounded-2xl border border-dashed text-left text-sm transition-all cursor-pointer flex items-center gap-3 ${addressMode === "new"
                ? "border-brand-primary-brown bg-brand-primary-brown/10 font-bold text-brand-primary-brown shadow-xs"
                : "border-stone-300 hover:bg-stone-50 text-stone-700"
                }`}
            >
              <div className="w-9 h-9 rounded-full bg-brand-primary-brown/10 flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5 text-brand-primary-brown" />
              </div>
              <div>
                <p className="font-semibold text-sm">+ Add New Address</p>
                <p className="text-stone-500 text-xs mt-0.5">Enter a new delivery location</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Delivery Address Form (shown when adding a new address or editing) */}
      {(isAddingNewAddress || savedAddresses.length === 0) && (
        <div className="border-t border-stone-200 pt-4 mt-2">
          <h2 className="text-black font-regular font-sans text-md mb-3">
            {savedAddresses.length > 0 ? "New Address Details" : "Delivery Address"}
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-brand-primary-brown">Governorate *</label>
              <select
                value={governorate}
                onChange={(e) => updateField("governorate", e.target.value)}
                className="w-full px-3 py-4 border border-stone-300 rounded-lg text-sm  text-brand-primary-brown focus:outline-hidden focus:border-brand-primary-brown"
              >
                <option value="">Select Governorate</option>
                {EGYPT_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
              {errors.governorate && <span className="text-xs text-red-500">{errors.governorate}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextInput
                label="City *"
                placeholder="Cairo"
                value={city}
                onChange={(e) => updateField("city", e.target.value)}
                error={errors.city}
              />
              <TextInput
                label="Area *"
                placeholder="Maadi"
                value={area}
                onChange={(e) => updateField("area", e.target.value)}
                error={errors.area}
              />
            </div>

            <TextInput
              label="Street Address *"
              placeholder="15 El Tahrir Street"
              value={street}
              onChange={(e) => updateField("street", e.target.value)}
              error={errors.street}
            />

            <div className="grid grid-cols-3 gap-3">
              <TextInput
                label="Building No."
                placeholder="12"
                value={buildingNo}
                onChange={(e) => updateField("buildingNo", e.target.value)}
              />
              <TextInput
                label="Floor"
                placeholder="4"
                value={floorNumber}
                onChange={(e) => updateField("floorNumber", e.target.value)}
              />
              <TextInput
                label="Apt No."
                placeholder="14"
                value={apartmentNumber}
                onChange={(e) => updateField("apartmentNumber", e.target.value)}
              />
            </div>

            {user && (
              <label className="flex items-center gap-2 mt-1 text-xs cursor-pointer select-none text-brand-primary-brown">
                <input
                  type="checkbox"
                  checked={saveNewAddress}
                  onChange={(e) => updateField("saveNewAddress", e.target.checked)}
                  className="rounded border-stone-300 text-brand-primary-brown focus:ring-brand-primary-brown"
                />
                <span>Save this address to my account for future orders</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div>
        <h2 className="text-black font-regular font-sans text-md mb-3">Payment Method</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectionCard
            title="Cash on Delivery"
            description="Pay in cash when your order arrives"
            checked={paymentMethod === "cash"}
            onChange={() => updateField("paymentMethod", "cash")}
          />
          <SelectionCard
            title="Credit / Debit Card"
            description="Pay securely online with card"
            checked={paymentMethod === "card"}
            onChange={() => updateField("paymentMethod", "card")}
          />
        </div>
      </div>
    </div>
  );
}
