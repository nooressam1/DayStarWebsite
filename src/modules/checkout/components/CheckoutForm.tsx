"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { TextInput, SelectionCard } from "@/modules/shared";
import { EGYPT_GOVERNORATES } from "@/modules/checkout";
import { useCheckoutForm, CheckoutFormValues } from "../hooks/useCheckoutForm";
import { Address } from "@/app/api/types";
import { Plus, MapPin, CheckCircle2 } from "lucide-react";
import MockCardForm from "./MockCardForm";

export interface CheckoutFormHandle {
  validate: () => { isValid: boolean; errors: Record<string, string> };
  getValues: () => CheckoutFormValues;
}

export interface CheckoutFormProps {
  user: any;
  savedAddresses: Address[];
  onChange: (values: CheckoutFormValues, errors: Record<string, string>) => void;
  onSubmit?: (values: CheckoutFormValues) => void;
}

export const CheckoutForm = forwardRef<CheckoutFormHandle, CheckoutFormProps>(function CheckoutForm(
  { user, savedAddresses, onChange }: CheckoutFormProps,
  ref
) {
  const {
    formValues,
    errors,
    updateField,
    selectSavedAddress,
    setAddressMode,
    validateForm,
  } = useCheckoutForm({
    user,
    savedAddresses,
    onChange,
  });

  useImperativeHandle(ref, () => ({
    validate: validateForm,
    getValues: () => formValues,
  }));

  const {
    fullName,
    phoneNumber,
    email,
    paymentMethod,
    cardNumber,
    cardHolder,
    expiryDate,
    cvv,
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
            placeholder="01012345678"
            value={phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            error={errors.phoneNumber}
          />
          <TextInput
            label="Email Address *"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
            disabled={!!user?.email}
          />
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-black font-regular font-sans text-md">Shipping Address</h2>
          {user && savedAddresses.length > 0 && (
            <button
              type="button"
              onClick={() => setAddressMode(addressMode === "saved" ? "new" : "saved")}
              className="text-xs text-brand-primary-brown underline hover:text-black cursor-pointer"
            >
              {addressMode === "saved" ? "+ Add New Address" : "← Use Saved Address"}
            </button>
          )}
        </div>

        {/* Saved Addresses Selector (if logged in & has saved addresses) */}
        {user && savedAddresses.length > 0 && addressMode === "saved" && (
          <div className="flex flex-col gap-2.5 mb-3">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => selectSavedAddress(addr)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? "border-brand-primary-brown bg-brand-bg/40 shadow-xs"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className={`w-4 h-4 mt-0.5 ${isSelected ? "text-brand-primary-brown" : "text-stone-400"}`} />
                    <div className="text-xs">
                      <p className="font-semibold text-black">{addr.street}</p>
                      <p className="text-stone-500">
                        {[
                          addr.building_no ? `Bldg ${addr.building_no}` : "",
                          addr.floor_number ? `Floor ${addr.floor_number}` : "",
                          addr.apartment_number ? `Apt ${addr.apartment_number}` : "",
                          addr.area,
                          addr.city,
                          addr.governorate,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-primary-brown shrink-0" />}
                </div>
              );
            })}
          </div>
        )}

        {/* New / Custom Address Form */}
        {isAddingNewAddress && (
          <div className="flex flex-col gap-3">
            {/* Governorate Dropdown */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Governorate *
              </label>
              <select
                value={governorate}
                onChange={(e) => updateField("governorate", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-primary-brown focus:border-brand-primary-brown"
              >
                <option value="">Select Governorate</option>
                {EGYPT_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
              {errors.governorate && (
                <p className="text-red-500 text-[11px] mt-1">{errors.governorate}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextInput
                label="City *"
                placeholder="Nasr City"
                value={city}
                onChange={(e) => updateField("city", e.target.value)}
                error={errors.city}
              />
              <TextInput
                label="Area / District *"
                placeholder="Zone 1"
                value={area}
                onChange={(e) => updateField("area", e.target.value)}
                error={errors.area}
              />
            </div>

            <TextInput
              label="Street Name / Details *"
              placeholder="123 Abbas El Akkad St."
              value={street}
              onChange={(e) => updateField("street", e.target.value)}
              error={errors.street}
            />

            <div className="grid grid-cols-3 gap-3">
              <TextInput
                label="Building"
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
        )}
      </div>

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

        {/* Mock Card Form Embedded */}
        {paymentMethod === "card" && (
          <MockCardForm
            cardState={{
              cardNumber,
              cardHolder,
              expiryDate,
              cvv,
            }}
            onChange={(field, value) => updateField(field, value)}
            errors={errors}
          />
        )}
      </div>
    </div>
  );
});
