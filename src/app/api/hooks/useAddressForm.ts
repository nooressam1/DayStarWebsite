import { useState, useEffect } from "react";
import { Address } from "@/app/api/types";
import { addUserAddress, updateUserAddress } from "@/app/api/endpoints/address.endpoint";
import { useAddresses } from "./useAddresses";

interface UseAddressFormProps {
  isOpen: boolean;
  editingAddress: Address | null;
  isFirstAddress: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export function useAddressForm({
  isOpen,
  editingAddress,
  isFirstAddress,
  onClose,
  onSaveSuccess,
}: UseAddressFormProps) {
  const addressState = useAddresses();
  const {
    addressForm,
    updateField,
    populateFromAddress,
    resetAddress,
  } = addressState;

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingAddress) {
        populateFromAddress(editingAddress);
      } else {
        resetAddress();
        updateField("isDefault", isFirstAddress);
      }
      setFormError("");
      setSubmitting(false);
    }
  }, [isOpen, editingAddress, isFirstAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { street, area, governorate, buildingNo, city, postalCode, floorNumber, apartmentNumber, label, customLabel, country, isDefault } = addressForm;

    if (!street.trim() || !area.trim() || !governorate.trim() || !buildingNo.trim() || !city.trim()) {
      setFormError("Please fill out all required fields (Street, Area, Governorate, Building info, and City).");
      return;
    }

    setFormError("");
    setSubmitting(true);

    const finalLabel = label === "Other" ? (customLabel.trim() || "Other") : label;
    const payload = {
      street: street.trim(),
      area: area.trim(),
      governorate: governorate.trim(),
      postal_code: postalCode.trim(),
      building_no: buildingNo.trim(),
      floor_number: floorNumber.trim(),
      apartment_number: apartmentNumber.trim(),
      city: city.trim(),
      country: country.trim() || "Egypt",
      label: finalLabel,
      is_default: isDefault,
    };

    let result;
    if (editingAddress) {
      result = await updateUserAddress(editingAddress.id, payload);
    } else {
      result = await addUserAddress(payload);
    }

    setSubmitting(false);
    if (result) {
      onSaveSuccess();
      onClose();
    } else {
      setFormError("Failed to save address. Please try again.");
    }
  };

  return {
    ...addressState,
    formError,
    setFormError,
    submitting,
    handleSubmit,
  };
}
