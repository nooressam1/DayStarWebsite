"use client";

import { useEffect, useState, useCallback } from "react";
import { useAddressesQuery } from "./useAddressQueries";
import { Address } from "@/app/api/types";
import { AddressFormState, initialAddressForm } from "./useAddresses";

export function useCheckoutAddress() {
    const { data: addresses = [], isLoading: loading } = useAddressesQuery();

    const [addressForm, setAddressForm] = useState<AddressFormState>(initialAddressForm);

    const updateField = useCallback(<K extends keyof AddressFormState>(field: K, value: AddressFormState[K]) => {
        setAddressForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const populateFromAddress = useCallback((addr: Address) => {
        setAddressForm({
            city: addr.city || "",
            country: addr.country || "Egypt",
            isDefault: addr.is_default || false,
            label: (addr.label === "Home" || addr.label === "Work") ? addr.label : "Other",
            customLabel: (addr.label === "Home" || addr.label === "Work") ? "" : (addr.label || ""),
            street: addr.street || "",
            area: addr.area || "",
            governorate: addr.governorate || "",
            postalCode: addr.postal_code || "",
            buildingNo: addr.building_no || "",
            floorNumber: addr.floor_number || "",
            apartmentNumber: addr.apartment_number || "",
            selectedAddressId: addr.id,
        });
    }, []);

    const resetAddress = useCallback(() => {
        setAddressForm(initialAddressForm);
    }, []);

    const selectAddress = (addr: Address | "custom") => {
        if (addr === "custom") {
            updateField("selectedAddressId", "custom");
            resetAddress();
        } else {
            updateField("selectedAddressId", addr.id);
            populateFromAddress(addr);
        }
    };

    // Auto-select default address on load
    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddr = addresses.find((a) => a.is_default);
            const target = defaultAddr || addresses[0];
            updateField("selectedAddressId", target.id);
            populateFromAddress(target);
        }
    }, [addresses, populateFromAddress, updateField]);

    return {
        addresses,
        savedAddresses: addresses,
        loading,
        addressForm,
        setAddressForm,
        updateField,
        selectAddress,
        autoPopulateAddress: populateFromAddress,
        populateFromAddress,
        resetAddress,
    };
}

