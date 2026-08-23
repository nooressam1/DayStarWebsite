import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useCartStore, calculatePricing } from "@/modules/shared";
import { CheckoutAddressPayload } from "@/app/api/endpoints/order.endpoint";
import { createClient } from "@/utils/supabase/client";
import { useAuthModalStore } from "./useAuthModalStore";
import { useCheckoutAddress } from "./useCheckoutAddress";
import { useProcessCheckoutMutation } from "./useOrderQueries";
import { MockCardState } from "@/modules/checkout/components/MockCardForm";
import { toast } from "sonner";

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

export const initialCardState: MockCardState = {
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
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
    paymentMethod?: string;
    cardState?: MockCardState;
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
        paymentMethod = "cash",
        cardState,
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

    // Card validation when Credit / Debit Card is selected
    if (paymentMethod === "card") {
        const cleanCard = (cardState?.cardNumber || "").replace(/\s/g, "");
        if (!cleanCard) {
            errors.cardNumber = "Card number is required";
        } else if (cleanCard.length < 15) {
            errors.cardNumber = "Please enter a valid card number";
        }

        if (!cardState?.cardHolder?.trim()) {
            errors.cardHolder = "Cardholder name is required";
        }

        if (!cardState?.expiryDate?.trim()) {
            errors.expiryDate = "Expiry date required";
        } else if (!/^\d{2}\/\d{2}$/.test(cardState.expiryDate.trim())) {
            errors.expiryDate = "Format MM/YY";
        }

        if (!cardState?.cvv?.trim()) {
            errors.cvv = "CVV required";
        } else if (cardState.cvv.trim().length < 3) {
            errors.cvv = "Min 3 digits";
        }
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

    // Form states
    const [checkoutForm, setCheckoutForm] = useState<CheckoutFormState>(initialCheckoutForm);
    const [cardState, setCardState] = useState<MockCardState>(initialCardState);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // React Query process checkout mutation
    const processCheckoutMutation = useProcessCheckoutMutation();
    const submitting = processCheckoutMutation.isPending;

    // Ref for tracking latest mutable state values
    const latestRef = useRef({
        checkoutForm,
        cardState,
        addressForm,
        savedAddresses,
        cart,
        discount,
        user,
        isPending: processCheckoutMutation.isPending,
        mutateAsync: processCheckoutMutation.mutateAsync,
    });

    latestRef.current = {
        checkoutForm,
        cardState,
        addressForm,
        savedAddresses,
        cart,
        discount,
        user,
        isPending: processCheckoutMutation.isPending,
        mutateAsync: processCheckoutMutation.mutateAsync,
    };

    const updateCheckoutField = useCallback(<K extends keyof CheckoutFormState>(field: K, value: CheckoutFormState[K]) => {
        setCheckoutForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const updateCardField = useCallback((field: keyof MockCardState, value: string) => {
        setCardState((prev) => ({ ...prev, [field]: value }));
        // Clear specific error on change
        setErrors((prev) => {
            if (prev[field]) {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            }
            return prev;
        });
    }, []);

    // Pre-fill user profile info if logged in
    useEffect(() => {
        if (user) {
            const userName = user.user_metadata?.full_name || user.user_metadata?.name || "";
            setCheckoutForm((prev) => ({
                ...prev,
                fullName: prev.fullName || userName,
                phoneNumber: prev.phoneNumber || user.user_metadata?.phone || user.phone || "",
                email: user.email || "",
            }));

            setCardState((prev) => ({
                ...prev,
                cardHolder: prev.cardHolder || userName,
            }));
        }
    }, [user]);

    // Stable validation helper reading from latestRef
    const validateForm = useCallback(() => {
        const {
            checkoutForm: form,
            cardState: card,
            addressForm: addrForm,
            savedAddresses: addrs,
            user: currentUser,
        } = latestRef.current;
        const { fullName, phoneNumber, email, paymentMethod } = form;
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
            paymentMethod,
            cardState: card,
        });
    }, []);

    // Core Order Submission Execution
    const executeOrderSubmission = useCallback(async (paymentMethod = "cash", paymentStatus = "pending") => {
        const {
            checkoutForm: form,
            addressForm: addrForm,
            savedAddresses: addrs,
            cart: currentCart,
            discount: currentDiscount,
            mutateAsync,
        } = latestRef.current;

        if (currentCart.length === 0) return;

        const { cleanPhone } = validateForm();

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
            const selectedAddr = !isCustom ? addrs.find((a) => a.id === selectedAddressId) : undefined;

            const mappedAddress: CheckoutAddressPayload = selectedAddr
                ? {
                      city: selectedAddr.city || city,
                      area: selectedAddr.area || area,
                      address: selectedAddr.street || street,
                      floorNumber: selectedAddr.floor_number || floorNumber,
                      apartmentNumber: selectedAddr.apartment_number || apartmentNumber,
                      governorate: selectedAddr.governorate || governorate,
                      postalCode: selectedAddr.postal_code || postalCode,
                      addressId: selectedAddr.id,
                  }
                : {
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
                paymentMethod,
                paymentStatus,
            });

            if (response && response.success) {
                clearCart();
                router.push(`/order-confirmed/${response.orderId}`);
            } else {
                const errorMsg = response?.error || "An error occurred while placing your order.";
                setErrors((prev) => ({ ...prev, submit: errorMsg }));
                toast.error(errorMsg);
            }
        } catch (error: any) {
            console.error("Error submitting order:", error);
            const errorMsg =
                error?.message ||
                error?.details?.message ||
                error?.details?.error ||
                "An error occurred while placing your order.";
            setErrors((prev) => ({
                ...prev,
                submit: errorMsg,
            }));
            toast.error(errorMsg);
        }
    }, [validateForm, clearCart, router]);

    // Handle Click on Proceed / Place Order
    const handleProceedCheckout = useCallback(async () => {
        if (latestRef.current.isPending) return;

        const { isValid, errors: validationErrors } = validateForm();

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        const { checkoutForm: form } = latestRef.current;

        // If Credit Card is selected: trigger the simulated 3D-Secure modal first!
        if (form.paymentMethod === "card") {
            setIsPaymentModalOpen(true);
            return;
        }

        // Otherwise (Cash on Delivery): direct submission
        await executeOrderSubmission("cash", "pending");
    }, [validateForm, executeOrderSubmission]);

    // Callback when simulated payment authorization completes
    const handlePaymentModalComplete = useCallback(async () => {
        setIsPaymentModalOpen(false);
        await executeOrderSubmission("card", "paid");
    }, [executeOrderSubmission]);

    return {
        user,
        cart,
        pricing,
        discount,
        setDiscount,
        incrementItem,
        decrementItem,
        removeFromCart,
        // Checkout Form State & Card State
        checkoutForm,
        setCheckoutForm,
        updateCheckoutField,
        cardState,
        setCardState,
        updateCardField,
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
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        handleProceedCheckout,
        handlePaymentModalComplete,
        // Shipping Address API
        addressData: checkoutAddressState,
    };
}
