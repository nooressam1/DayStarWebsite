"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import { Address } from "@/app/api/types";

export type AddressMode = "saved" | "new";

export interface CheckoutFormValues {
  fullName: string;
  phoneNumber: string;
  email: string;
  deliveryType: string;
  paymentMethod: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  city: string;
  area: string;
  street: string;
  buildingNo: string;
  floorNumber: string;
  apartmentNumber: string;
  governorate: string;
  postalCode: string;
  selectedAddressId: string;
  addressMode: AddressMode;
  saveNewAddress: boolean;
}

export interface CheckoutFormState extends CheckoutFormValues {
  errors: Record<string, string>;
}

export type CheckoutAction =
  | { type: "UPDATE_FIELD"; field: keyof CheckoutFormValues; value: any }
  | { type: "SELECT_SAVED_ADDRESS"; address: Address }
  | { type: "SET_ADDRESS_MODE"; mode: AddressMode }
  | { type: "AUTO_FILL_USER"; fullName: string; email: string }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "CLEAR_ERROR"; field: string };

const initialCheckoutState: CheckoutFormState = {
  fullName: "",
  phoneNumber: "",
  email: "",
  deliveryType: "home",
  paymentMethod: "cash",
  cardNumber: "",
  cardHolder: "",
  expiryDate: "",
  cvv: "",
  city: "",
  area: "",
  street: "",
  buildingNo: "",
  floorNumber: "",
  apartmentNumber: "",
  governorate: "",
  postalCode: "",
  selectedAddressId: "",
  addressMode: "new",
  saveNewAddress: true,
  errors: {},
};

function checkoutReducer(state: CheckoutFormState, action: CheckoutAction): CheckoutFormState {
  switch (action.type) {
    case "UPDATE_FIELD": {
      const newErrors = { ...state.errors };
      delete newErrors[action.field];
      return {
        ...state,
        [action.field]: action.value,
        errors: newErrors,
      };
    }
    case "SELECT_SAVED_ADDRESS": {
      const addr = action.address;
      return {
        ...state,
        city: addr.city || "",
        area: addr.area || "",
        street: addr.street || "",
        buildingNo: addr.building_no || "",
        floorNumber: addr.floor_number || "",
        apartmentNumber: addr.apartment_number || "",
        governorate: addr.governorate || "",
        postalCode: addr.postal_code || "",
        selectedAddressId: addr.id,
        addressMode: "saved",
        errors: {},
      };
    }
    case "SET_ADDRESS_MODE": {
      if (action.mode === "new") {
        return {
          ...state,
          addressMode: "new",
          selectedAddressId: "new",
          city: "",
          area: "",
          street: "",
          buildingNo: "",
          floorNumber: "",
          apartmentNumber: "",
          governorate: "",
          postalCode: "",
          errors: {},
        };
      }
      return {
        ...state,
        addressMode: "saved",
      };
    }
    case "AUTO_FILL_USER": {
      return {
        ...state,
        fullName: state.fullName || action.fullName,
        email: state.email || action.email,
        cardHolder: state.cardHolder || action.fullName,
      };
    }
    case "SET_ERRORS": {
      return { ...state, errors: action.errors };
    }
    case "CLEAR_ERROR": {
      const newErrors = { ...state.errors };
      delete newErrors[action.field];
      return { ...state, errors: newErrors };
    }
    default:
      return state;
  }
}

interface UseCheckoutFormProps {
  user?: any;
  savedAddresses?: Address[];
  onChange?: (values: CheckoutFormValues, errors: Record<string, string>) => void;
}

export function useCheckoutForm({ user, savedAddresses = [], onChange }: UseCheckoutFormProps = {}) {
  const [state, dispatch] = useReducer(checkoutReducer, {
    ...initialCheckoutState,
    addressMode: savedAddresses.length > 0 ? "saved" : "new",
  });

  const formRef = useRef<CheckoutFormValues>(state);
  const isUserFilledRef = useRef(false);
  const isAddressFilledRef = useRef(false);

  // Keep formRef updated and trigger onChange
  useEffect(() => {
    formRef.current = state;
    if (onChange) {
      onChange(state, state.errors);
    }
  }, [state, onChange]);

  // Auto-fill user details once
  useEffect(() => {
    if (user && !isUserFilledRef.current) {
      isUserFilledRef.current = true;
      dispatch({
        type: "AUTO_FILL_USER",
        fullName: user.user_metadata?.full_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Auto-select default saved address once
  useEffect(() => {
    if (savedAddresses.length > 0 && !isAddressFilledRef.current) {
      isAddressFilledRef.current = true;
      const defaultAddr = savedAddresses.find((a) => a.is_default) || savedAddresses[0];
      if (defaultAddr) {
        dispatch({ type: "SELECT_SAVED_ADDRESS", address: defaultAddr });
      }
    }
  }, [savedAddresses]);

  const updateField = useCallback((field: keyof CheckoutFormValues, value: any) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }, []);

  const selectSavedAddress = useCallback((address: Address) => {
    dispatch({ type: "SELECT_SAVED_ADDRESS", address });
  }, []);

  const setAddressMode = useCallback((mode: AddressMode) => {
    dispatch({ type: "SET_ADDRESS_MODE", mode });
  }, []);

  const validateForm = useCallback((): { isValid: boolean; errors: Record<string, string> } => {
    const values = formRef.current;
    const newErrors: Record<string, string> = {};

    if (!values.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!values.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^01[0125]\d{8}$/.test(values.phoneNumber.trim())) {
      newErrors.phoneNumber = "Enter a valid 11-digit Egyptian phone number (e.g. 01012345678)";
    }

    if (values.addressMode === "new" || savedAddresses.length === 0) {
      if (!values.governorate) newErrors.governorate = "Governorate is required";
      if (!values.city.trim()) newErrors.city = "City is required";
      if (!values.area.trim()) newErrors.area = "Area is required";
      if (!values.street.trim()) newErrors.street = "Street address is required";
    } else if (!values.selectedAddressId) {
      newErrors.address = "Please select a delivery address";
    }

    if (values.paymentMethod === "card") {
      const cleanCard = values.cardNumber.replace(/\s/g, "");
      if (!cleanCard) {
        newErrors.cardNumber = "Card number is required";
      } else if (cleanCard.length < 15) {
        newErrors.cardNumber = "Enter a valid 16-digit card number";
      }

      if (!values.cardHolder.trim()) {
        newErrors.cardHolder = "Cardholder name is required";
      }

      if (!values.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date required";
      } else if (!/^\d{2}\/\d{2}$/.test(values.expiryDate.trim())) {
        newErrors.expiryDate = "Format MM/YY";
      }

      if (!values.cvv.trim()) {
        newErrors.cvv = "CVV required";
      } else if (values.cvv.trim().length < 3) {
        newErrors.cvv = "Min 3 digits";
      }
    }

    const isValid = Object.keys(newErrors).length === 0;
    dispatch({ type: "SET_ERRORS", errors: newErrors });

    return { isValid, errors: newErrors };
  }, [savedAddresses.length]);

  const getAddressPayload = useCallback(() => {
    const values = formRef.current;
    return {
      address: values.street.trim(),
      street: values.street.trim(),
      area: values.area.trim(),
      building_no: values.buildingNo.trim(),
      floor_number: values.floorNumber.trim(),
      apartment_number: values.apartmentNumber.trim(),
      governorate: values.governorate.trim(),
      city: values.city.trim(),
      country: "Egypt",
      postal_code: values.postalCode.trim(),
      phone_number: values.phoneNumber.trim(),
      fullName: values.fullName.trim(),
    };
  }, []);

  return {
    state,
    formValues: state as CheckoutFormValues,
    errors: state.errors,
    formRef,
    updateField,
    selectSavedAddress,
    setAddressMode,
    validateForm,
    getAddressPayload,
  };
}
