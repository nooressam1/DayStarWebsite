"use client";

import { useEffect } from "react";
import { useAddresses } from "./useAddresses";
import { Address } from "@/app/api/types";

export function useCheckoutAddress() {
    const addressState = useAddresses();
    const {
        addresses,
        updateField,
        populateFromAddress,
        resetAddress,
    } = addressState;

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
    }, [addresses]);

    return {
        ...addressState,
        savedAddresses: addresses,
        selectAddress,
        autoPopulateAddress: populateFromAddress,
    };
}
