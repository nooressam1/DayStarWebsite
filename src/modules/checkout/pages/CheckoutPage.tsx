"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import { CustomButton, useCartStore, calculatePricing } from "@/modules/shared";
import ProductCartCard from "@/modules/shoppingcart/components/ProductCartCard";
import { CheckoutPageSkeleton, CheckoutForm, CheckoutFormValues, CheckoutFormHandle } from "@/modules/checkout";
import PaymentProcessingModal from "../components/PaymentProcessingModal";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useAuthModalStore } from "@/app/api/hooks/useAuthModalStore";
import { useProcessCheckoutMutation } from "@/app/api/hooks/useOrderQueries";
import { useAddressesQuery, useAddAddressMutation } from "@/app/api/hooks/useAddressQueries";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { openModal } = useAuthModalStore();
    const { cart, discount, clearCart } = useCartStore();

    // React Query Address Fetching
    const { data: savedAddresses = [], isLoading: addressesLoading } = useAddressesQuery();
    const addAddressMutation = useAddAddressMutation();

    const [submitting, setSubmitting] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    // Stable form handle and values reference
    const checkoutFormRef = useRef<CheckoutFormHandle | null>(null);
    const formValuesRef = useRef<CheckoutFormValues | null>(null);

    const handleFormChange = (values: CheckoutFormValues) => {
        formValuesRef.current = values;
    };

    const { subTotal: subtotal, deliveryFee, discount: discountAmount, total } = calculatePricing(cart, {
        discountAmount: discount?.value,
    });

    const processCheckoutMutation = useProcessCheckoutMutation();

    const executeCheckoutSubmission = async () => {
        const values = formValuesRef.current || checkoutFormRef.current?.getValues();
        if (!values) return;

        setSubmitting(true);
        try {
            const isSavedAddress =
                values.addressMode === "saved" &&
                values.selectedAddressId &&
                values.selectedAddressId !== "new";

            const addressPayload = {
                addressId: isSavedAddress ? values.selectedAddressId : undefined,
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

            if (user && values.addressMode === "new" && values.saveNewAddress) {
                try {
                    await addAddressMutation.mutateAsync({
                        street: values.street.trim(),
                        area: values.area.trim(),
                        governorate: values.governorate.trim(),
                        city: values.city.trim(),
                        country: "Egypt",
                        postal_code: values.postalCode.trim(),
                        building_no: values.buildingNo.trim(),
                        floor_number: values.floorNumber.trim(),
                        apartment_number: values.apartmentNumber.trim(),
                        label: "Home",
                        is_default: savedAddresses.length === 0,
                    });
                } catch (e) {
                    console.warn("Failed to save new address to profile:", e);
                }
            }

            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            const isCard = values.paymentMethod === "card";
            const paymentMethod = isCard ? "card" : "cash";
            const paymentStatus = isCard ? "paid" : "pending";

            const result = await processCheckoutMutation.mutateAsync({
                items: cart.map((item) => ({ variant_id: item.variant_id, quantity: item.quantity })),
                address: addressPayload,
                token: session?.access_token || "",
                couponCode: discount?.code,
                fullName: values.fullName.trim(),
                phoneNumber: values.phoneNumber.trim(),
                paymentMethod,
                paymentStatus,
            });

            if (result && result.success && result.orderId) {
                clearCart();
                router.push(`/order-confirmed/${result.orderId}`);
            } else {
                const failMsg = result?.error || "Checkout failed. Please try again.";
                setCheckoutError(failMsg);
                toast.error(failMsg);
            }
        } catch (err: any) {
            console.error("Checkout error:", err);
            const errorMessage =
                err?.response?.data?.message ||
                err?.details?.message ||
                err?.details?.error ||
                err?.message ||
                "An unexpected error occurred during checkout.";
            const cleanMsg = Array.isArray(errorMessage) ? errorMessage.join(", ") : String(errorMessage);
            setCheckoutError(cleanMsg);
            toast.error(cleanMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleProceedCheckout = async () => {
        setCheckoutError(null);
        if (cart.length === 0) {
            toast.warning("Your cart is empty.");
            return;
        }

        if (!user) {
            openModal("login");
            return;
        }

        // Trigger comprehensive validation in CheckoutForm child component
        if (checkoutFormRef.current) {
            const { isValid, errors } = checkoutFormRef.current.validate();
            if (!isValid) {
                const errorMessages = Object.values(errors).filter(Boolean);
                const firstError = errorMessages[0] || "Please fill in all required fields.";
                setCheckoutError(firstError);
                toast.error(firstError);
                return;
            }
        }

        const values = formValuesRef.current || checkoutFormRef.current?.getValues();
        if (!values) return;

        // Perform Card validation if Card is selected
        if (values.paymentMethod === "card") {
            const cleanCard = (values.cardNumber || "").replace(/\s/g, "");
            if (!cleanCard || cleanCard.length < 15) {
                const cardErr = "Please enter a valid 16-digit card number.";
                setCheckoutError(cardErr);
                toast.error(cardErr);
                return;
            }
            if (!values.cardHolder?.trim()) {
                const cardErr = "Please enter the cardholder name.";
                setCheckoutError(cardErr);
                toast.error(cardErr);
                return;
            }
            if (!values.expiryDate?.trim() || !/^\d{2}\/\d{2}$/.test(values.expiryDate)) {
                const cardErr = "Please enter a valid expiry date (MM/YY).";
                setCheckoutError(cardErr);
                toast.error(cardErr);
                return;
            }
            if (!values.cvv?.trim() || values.cvv.length < 3) {
                const cardErr = "Please enter a valid 3-digit CVV code.";
                setCheckoutError(cardErr);
                toast.error(cardErr);
                return;
            }

            // Open Simulated 3D-Secure modal for card payments
            setIsPaymentModalOpen(true);
            return;
        }

        // For Cash On Delivery, execute immediately
        await executeCheckoutSubmission();
    };

    if (addressesLoading) {
        return <CheckoutPageSkeleton />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-screen">
            {/* Left Column: Form Sections */}
            <div className="flex-1 w-full flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-serif text-[#78534a] font-normal tracking-tight">
                        Check Out
                    </h1>
                    <p className="text-sm text-stone-500 mt-1 font-sans">
                        Complete your order details below
                    </p>
                </div>

                <CheckoutForm
                    ref={checkoutFormRef}
                    user={user}
                    savedAddresses={savedAddresses}
                    onChange={handleFormChange}
                    onSubmit={handleProceedCheckout}
                />
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="w-full lg:w-[420px] bg-stone-50/70 border border-stone-200/80 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 h-fit sticky top-24 shadow-xs">
                <h2 className="text-[#78534a] font-serif text-3xl font-normal leading-none">
                    Order Summary
                </h2>

                {/* Order pricing Section */}
                <div className="flex flex-col gap-3">
                    <h3 className="font-sans text-base font-medium text-stone-900">
                        Order pricing
                    </h3>
                    <div className="flex flex-col gap-2.5 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500 font-normal">Sub Total</span>
                            <span className="text-stone-900 font-medium">{formatMoney(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500 font-normal">Discount</span>
                            <span className="text-stone-900 font-medium">
                                {discountAmount > 0 ? `-${formatMoney(discountAmount)}` : formatMoney(0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-stone-300/40 pb-3">
                            <span className="text-stone-500 font-normal">Delivery fee</span>
                            <span className="text-stone-900 font-medium">{formatMoney(deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-stone-500 font-normal text-base">Total</span>
                            <span className="text-stone-900 font-medium text-base">{formatMoney(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Items in Order */}
                <div className="flex flex-col gap-3 border-t border-stone-300/40 pt-5">
                    <h3 className="font-sans text-base font-medium text-stone-900">
                        Items ({cart.length})
                    </h3>
                    <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1">
                        {cart.map((item) => (
                            <ProductCartCard
                                key={item.variant_id}
                                {...item}
                                isEditable={false}
                            />
                        ))}
                    </div>
                </div>

                {/* In-page Checkout / Stock Error Notice */}
                {checkoutError && (
                    <div className="p-3.5 bg-red-50 border border-red-200/90 text-red-700 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                            <span className="font-semibold">Unable to place order</span>
                            <span className="text-xs text-red-600 leading-relaxed break-words">{checkoutError}</span>
                        </div>
                    </div>
                )}

                {/* Place Order CTA Button */}
                <div className="pt-2">
                    <CustomButton
                        variant="solid"
                        colorScheme="secondary"
                        disabled={submitting || isPaymentModalOpen}
                        onClick={handleProceedCheckout}
                        className="w-full py-4 text-base tracking-wide"
                    >
                        {submitting || isPaymentModalOpen ? "Processing Order..." : "Place Order"}
                    </CustomButton>
                </div>
            </div>

            {/* Simulated 3D-Secure Payment Authorization Modal */}
            <PaymentProcessingModal
                isOpen={isPaymentModalOpen}
                amount={total}
                onComplete={async () => {
                    setIsPaymentModalOpen(false);
                    await executeCheckoutSubmission();
                }}
            />
        </div>
    );
}
