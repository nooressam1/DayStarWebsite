import { useReducer, useEffect, useCallback } from "react";
import { Address } from "@/app/api/types";
import { useAddAddressMutation, useUpdateAddressMutation } from "./useAddressQueries";
import { AddressFormState, initialAddressForm } from "./useAddresses";

export interface AddressFormFullState {
  values: AddressFormState;
  formError: string;
  submitting: boolean;
}

export type AddressFormAction =
  | { type: "UPDATE_FIELD"; field: keyof AddressFormState; value: AddressFormState[keyof AddressFormState] }
  | { type: "RESET_FORM"; isDefault?: boolean }
  | { type: "POPULATE_FROM_ADDRESS"; address: Address }
  | { type: "SET_ERROR"; error: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_END"; error?: string };

function addressFormReducer(state: AddressFormFullState, action: AddressFormAction): AddressFormFullState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
      };
    case "RESET_FORM":
      return {
        values: { ...initialAddressForm, isDefault: !!action.isDefault },
        formError: "",
        submitting: false,
      };
    case "POPULATE_FROM_ADDRESS":
      return {
        values: {
          city: action.address.city || "",
          country: action.address.country || "Egypt",
          isDefault: action.address.is_default || false,
          label: (action.address.label === "Home" || action.address.label === "Work") ? action.address.label : "Other",
          customLabel: (action.address.label === "Home" || action.address.label === "Work") ? "" : (action.address.label || ""),
          street: action.address.street || "",
          area: action.address.area || "",
          governorate: action.address.governorate || "",
          postalCode: action.address.postal_code || "",
          buildingNo: action.address.building_no || "",
          floorNumber: action.address.floor_number || "",
          apartmentNumber: action.address.apartment_number || "",
          selectedAddressId: action.address.id,
        },
        formError: "",
        submitting: false,
      };
    case "SET_ERROR":
      return { ...state, formError: action.error };
    case "SUBMIT_START":
      return { ...state, submitting: true, formError: "" };
    case "SUBMIT_END":
      return { ...state, submitting: false, formError: action.error || "" };
    default:
      return state;
  }
}

interface UseAddressFormProps {
  isOpen: boolean;
  editingAddress: Address | null;
  isFirstAddress?: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export function useAddressForm({
  isOpen,
  editingAddress,
  isFirstAddress = false,
  onClose,
  onSaveSuccess,
}: UseAddressFormProps) {
  const [state, dispatch] = useReducer(addressFormReducer, {
    values: initialAddressForm,
    formError: "",
    submitting: false,
  });

  const addAddressMutation = useAddAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();

  const updateField = useCallback(<K extends keyof AddressFormState>(field: K, value: AddressFormState[K]) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }, []);

  const resetAddress = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, []);

  const populateFromAddress = useCallback((addr: Address) => {
    dispatch({ type: "POPULATE_FROM_ADDRESS", address: addr });
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (editingAddress) {
        dispatch({ type: "POPULATE_FROM_ADDRESS", address: editingAddress });
      } else {
        dispatch({ type: "RESET_FORM", isDefault: isFirstAddress });
      }
    }
  }, [isOpen, editingAddress, isFirstAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { street, area, governorate, buildingNo, city, postalCode, floorNumber, apartmentNumber, label, customLabel, country, isDefault } = state.values;

    if (!street.trim() || !area.trim() || !governorate.trim() || !buildingNo.trim() || !city.trim()) {
      dispatch({ type: "SET_ERROR", error: "Please fill out all required fields (Street, Area, Governorate, Building info, and City)." });
      return;
    }

    dispatch({ type: "SUBMIT_START" });

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
      result = await updateAddressMutation.mutateAsync({ id: editingAddress.id, payload });
    } else {
      result = await addAddressMutation.mutateAsync(payload);
    }

    if (result) {
      dispatch({ type: "SUBMIT_END" });
      onSaveSuccess?.();
      onClose();
    } else {
      dispatch({ type: "SUBMIT_END", error: "Failed to save address. Please try again." });
    }
  };

  return {
    addressForm: state.values,
    updateField,
    populateFromAddress,
    resetAddress,
    formError: state.formError,
    setFormError: (error: string) => dispatch({ type: "SET_ERROR", error }),
    submitting: state.submitting,
    handleSubmit,
    dispatch,
  };
}


