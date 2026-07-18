import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useCartStore, usePricing } from "@/modules/shared";
import { processCheckout } from "@/app/api/endpoints/order.endpoint";
import { createClient } from "@/utils/supabase/client";
import { useAuthModalStore } from "@/modules/auth/hooks/useAuthModalStore";
import { useCheckoutAddress } from "./useCheckoutAddress";

export function useCheckout() {
    const { cart, incrementItem, clearCart, decrementItem, removeFromCart, discount, setDiscount } = useCartStore();
    const router = useRouter();
    const { user } = useAuth();
    const { isOpen: isAuthModalOpen, openModal, closeModal } = useAuthModalStore();
    const setIsAuthModalOpen = (open: boolean) => open ? openModal("login") : closeModal();

    const addressData = useCheckoutAddress();
    const {
        city, setCity,
        area, setArea,
        address, setAddress,
        floorNumber, setFloorNumber,
        apartmentNumber, setApartmentNumber,
        governorate, setGovernorate,
        postalCode, setPostalCode,
        savedAddresses,
        selectedAddressId, setSelectedAddressId,
        autoPopulateAddress,
        parseStreet,
    } = addressData;

    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [deliveryType, setDeliveryType] = useState("home"); // "home" | "pickup"
    const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "cash"

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Listen to current authentication status and set email
    useEffect(() => {
        if (user) {
            if (user.email) setEmail(user.email);
            setIsAuthModalOpen(false);
        }
    }, [user]);

    // Calculate dynamic pricing
    const { subTotal: subtotal, deliveryFee, discount: discountAmount, total } = usePricing(cart, {
        deliveryType,
        deliveryFee: 1000,
        discount,
    });

    const handleProceedCheckout = async () => {
        // Enforce option 1: Must be logged in to checkout
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        // Validate fields
        const newErrors: Record<string, string> = {};
        if (!fullName) newErrors.fullName = "Full name is required";
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address";
        if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";

        const isCustomMode = selectedAddressId === "custom" || savedAddresses.length === 0;
        if (isCustomMode) {
            if (!city) newErrors.city = "City is required";
            if (!area) newErrors.area = "Area is required";
            if (!governorate) newErrors.governorate = "Governorate is required";
            if (!address) newErrors.address = "Street address is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        if (cart.length === 0) {
            return;
        }

        const items = cart.map((item) => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
        }));

        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || "";

            let checkoutCity = city;
            let checkoutArea = area;
            let checkoutAddress = address;
            let checkoutFloor = floorNumber;
            let checkoutApt = apartmentNumber;
            let checkoutGov = governorate;
            let checkoutPostal = postalCode;

            if (!isCustomMode) {
                const selectedAddr = savedAddresses.find(a => a.id === selectedAddressId);
                if (selectedAddr) {
                    checkoutCity = selectedAddr.city;
                    
                    const parsed = parseStreet(selectedAddr.street);
                    checkoutAddress = parsed.street;
                    checkoutArea = parsed.area;
                    checkoutGov = parsed.governorate;
                    checkoutPostal = parsed.postalCode;

                    // Extract Floor and Apartment from building_no field
                    const floorMatch = selectedAddr.building_no.match(/Floor:\s*([^,]+),\s*Apt:\s*(.+)/);
                    if (floorMatch) {
                        checkoutFloor = floorMatch[1].trim();
                        checkoutApt = floorMatch[2].trim();
                    } else {
                        const floorOnly = selectedAddr.building_no.match(/Floor:\s*([^,]+)/);
                        const aptOnly = selectedAddr.building_no.match(/Apt:\s*(.+)/);
                        checkoutFloor = floorOnly ? floorOnly[1].trim() : "";
                        checkoutApt = aptOnly ? aptOnly[1].trim() : "";
                        if (!floorOnly && !aptOnly) {
                            checkoutFloor = selectedAddr.building_no;
                            checkoutApt = "";
                        }
                    }
                }
            }

            const response = await processCheckout(
                checkoutCity,
                checkoutArea,
                checkoutAddress,
                checkoutFloor,
                checkoutApt,
                items,
                token,
                discount?.code || undefined,
                checkoutGov,
                checkoutPostal,
                fullName,
                phoneNumber,
                isCustomMode ? undefined : selectedAddressId
            );

            if (response && response.success) {
                clearCart();
                router.push(`/order-confirmed/${response.orderId}`);
            } else {
                alert("An error occurred while placing your order.");
            }
        } catch (error) {
            console.error("Checkout process error:", error);
            alert("An error occurred while placing your order.");
        }
    };

    return {
        addressData,
        cart,
        user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        email,
        setEmail,
        fullName,
        setFullName,
        phoneNumber,
        setPhoneNumber,
        deliveryType,
        setDeliveryType,
        paymentMethod,
        setPaymentMethod,
        errors,
        setErrors,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
        discount,
        setDiscount,
        incrementItem,
        decrementItem,
        removeFromCart,
        handleProceedCheckout,
    };
}
