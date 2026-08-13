import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useCartStore, calculatePricing } from "@/modules/shared";
import { CheckoutAddressPayload } from "@/app/api/endpoints/order.endpoint";
import { createClient } from "@/utils/supabase/client";
import { useAuthModalStore } from "./useAuthModalStore";
import { useCheckoutAddress } from "./useCheckoutAddress";
import { useProcessCheckoutMutation } from "./useOrderQueries";

export interface CheckoutFormState {
    fullName: string;
    phoneNumber: string;
    email: string;
    deliveryType: string;
    paymentMethod: string;
}

export const initialCheckoutForm: CheckoutFormState = {
    fullName: "",
    phoneNumber: "",
    email: "",
    deliveryType: "home",
    paymentMethod: "cash",
};

export interface ValidateCheckoutParams {
    fullName: string;
    phoneNumber: string;
    email: string;
    userEmail?: string;
    isCustomMode: boolean;
    hasSavedAddresses: boolean;
    city: string;
    area: string;
    governorate: string;
    street: string;
}

export function validateCheckout(params: ValidateCheckoutParams): {
    isValid: boolean;
    errors: Record<string, string>;
    cleanPhone: string;
} {
    const {
        fullName,
        phoneNumber,
        email,
        userEmail,
        isCustomMode,
        hasSavedAddresses,
        city,
        area,
        governorate,
        street,
    } = params;

    const finalEmail = userEmail || email;
    const errors: Record<string, string> = {};

    // Full name validation
    if (!fullName.trim()) {
        errors.fullName = "Full name is required";
    }

    // Email validation
    if (!finalEmail.trim()) {
        errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEmail.trim())) {
        errors.email = "Please enter a valid email address";
    }

    // Phone number validation
    const cleanPhone = phoneNumber.trim().replace(/[\s\-\(\)]/g, "");
    if (!cleanPhone) {
        errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
        errors.phoneNumber = "Please enter a valid phone number (e.g. 01012345678)";
    }

    // Address validation when typing a custom address
    if (isCustomMode || !hasSavedAddresses) {
        if (!city) errors.city = "City is required";
        if (!area) errors.area = "Area is required";
        if (!governorate) errors.governorate = "Governorate is required";
        if (!street) errors.address = "Street address is required";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        cleanPhone,
    };
}

export function useCheckout() {
    const { cart, incrementItem, clearCart, decrementItem, removeFromCart, discount, setDiscount } = useCartStore();
    const router = useRouter();
    const { user } = useAuth();
    const { isOpen: isAuthModalOpen, openModal, closeModal } = useAuthModalStore();
    const setIsAuthModalOpen = useCallback((open: boolean) => open ? openModal("login") : closeModal(), [openModal, closeModal]);

    const checkoutAddressState = useCheckoutAddress();
    const { addressForm, savedAddresses } = checkoutAddressState;

    const pricing = calculatePricing(cart, discount ? { discount: { type: discount.type || "percent", value: discount.value } } : undefined);


    // Single Consolidated Checkout Form State
    const [checkoutForm, setCheckoutForm] = useState<CheckoutFormState>(initialCheckoutForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // React Query process checkout mutation
    const processCheckoutMutation = useProcessCheckoutMutation();
    const submitting = processCheckoutMutation.isPending;

    // Ref for tracking latest mutable state values to stabilize callbacks across keystrokes
    const latestRef = useRef({
        checkoutForm,
        addressForm,
        savedAddresses,
        cart,
        discount,
        user,
        isPending: processCheckoutMutation.isPending,      // NEW
        mutateAsync: processCheckoutMutation.mutateAsync,
    });

    latestRef.current = {
        checkoutForm,
        addressForm,
        savedAddresses,
        cart,
        discount,
        user,
        isPending: processCheckoutMutation.isPending,      // NEW
        mutateAsync: processCheckoutMutation.mutateAsync,
    };

    const updateCheckoutField = useCallback(<K extends keyof CheckoutFormState>(field: K, value: CheckoutFormState[K]) => {
        setCheckoutForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    // Pre-fill user profile info if logged in
    useEffect(() => {
        if (user) {
            setCheckoutForm((prev) => ({
                ...prev,
                fullName: prev.fullName || user.user_metadata?.full_name || user.user_metadata?.name || "",
                phoneNumber: prev.phoneNumber || user.user_metadata?.phone || user.phone || "",
                email: user.email || "",
            }));
        }
    }, [user]);

    // Stable validation helper reading from latestRef
    const validateForm = useCallback(() => {
        const { checkoutForm: form, addressForm: addrForm, savedAddresses: addrs, user: currentUser } = latestRef.current;
        const { fullName, phoneNumber, email } = form;
        const { selectedAddressId, city, area, governorate, street } = addrForm;
        const isCustom = selectedAddressId === "custom";

        return validateCheckout({
            fullName,
            phoneNumber,
            email,
            userEmail: currentUser?.email,
            isCustomMode: isCustom,
            hasSavedAddresses: addrs.length > 0,
            city,
            area,
            governorate,
            street,
        });
    }, []);

    // Completely stable handleProceedCheckout function reference
    const handleProceedCheckout = useCallback(async () => {
        if (latestRef.current.isPending) return; // was: processCheckoutMutation.isPending

        const { isValid, errors: validationErrors, cleanPhone } = validateForm();

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        const { checkoutForm: form, addressForm: addrForm, savedAddresses: addrs, cart: currentCart, discount: currentDiscount, mutateAsync } = latestRef.current; // added mutateAsync here

        if (currentCart.length === 0) {
            return;
        }

        const items = currentCart.map((item) => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
        }));

        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || "";

            const { selectedAddressId, city, area, street, floorNumber, apartmentNumber, governorate, postalCode } = addrForm;
            const isCustom = selectedAddressId === "custom";
            const selectedAddr = !isCustom ? addrs.find(a => a.id === selectedAddressId) : undefined;

            // Map checkout shipping address into a single structured payload object
            const mappedAddress: CheckoutAddressPayload = selectedAddr ? {
                city: selectedAddr.city || city,
                area: selectedAddr.area || area,
                address: selectedAddr.street || street,
                floorNumber: selectedAddr.floor_number || floorNumber,
                apartmentNumber: selectedAddr.apartment_number || apartmentNumber,
                governorate: selectedAddr.governorate || governorate,
                postalCode: selectedAddr.postal_code || postalCode,
                addressId: selectedAddr.id,
            } : {
                city,
                area,
                address: street,
                floorNumber,
                apartmentNumber,
                governorate,
                postalCode,
            };

            const response = await mutateAsync({
                address: mappedAddress,
                items,
                token,
                couponCode: currentDiscount?.code || undefined,
                fullName: form.fullName,
                phoneNumber: cleanPhone,
            });

            if (response && response.success) {
                clearCart();
                router.push(`/order-confirmed/${response.orderId}`);
            } else {
                const errorMsg = response?.error || "An error occurred while placing your order.";
                setErrors((prev) => ({ ...prev, submit: errorMsg }));
            }
        } catch (error: any) {
            console.error("Error submitting order:", error);
            setErrors((prev) => ({ ...prev, submit: error?.message || "An error occurred while placing your order." }));
        }
    }, [validateForm, clearCart, router]);

    return {
        user,
        cart,
        pricing,
        discount,
        setDiscount,
        incrementItem,
        decrementItem,
        removeFromCart,
        // Single Form State & Updater for Checkout info
        checkoutForm,
        setCheckoutForm,
        updateCheckoutField,
        validateForm,
        // Pricing & Errors
        subtotal: pricing.subTotal,
        deliveryFee: pricing.deliveryFee,
        discountAmount: pricing.discount,
        total: pricing.total,
        submitting,
        processCheckoutMutation,
        errors,
        setErrors,
        isAuthModalOpen,
        setIsAuthModalOpen,
        handleProceedCheckout,
        // Single Shipping Address API surface
        addressData: checkoutAddressState,
    };
}


