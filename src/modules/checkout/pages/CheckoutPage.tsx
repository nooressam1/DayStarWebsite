"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
                toast.error(result?.error || "Checkout failed. Please try again.");
            }
        } catch (err: any) {
            console.error("Checkout error:", err);
            const errorMessage =
                err?.message ||
                err?.details?.message ||
                err?.details?.error ||
                "An unexpected error occurred during checkout.";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleProceedCheckout = async () => {
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
                toast.error("Please enter a valid 16-digit card number.");
                return;
            }
            if (!values.cardHolder?.trim()) {
                toast.error("Please enter the cardholder name.");
                return;
            }
            if (!values.expiryDate?.trim() || !/^\d{2}\/\d{2}$/.test(values.expiryDate)) {
                toast.error("Please enter a valid expiry date (MM/YY).");
                return;
            }
            if (!values.cvv?.trim() || values.cvv.length < 3) {
                toast.error("Please enter a valid 3-digit CVV code.");
                return;
            }

            // Open 3D-Secure Payment Simulation modal!
            setIsPaymentModalOpen(true);
            return;
        }

        // Cash on delivery: submit directly
        await executeCheckoutSubmission();
    };

    // Render Loading Skeleton while loading addresses
    if (user && addressesLoading) {
        return <CheckoutPageSkeleton />;
    }

    return (
        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 h-full font-sans text-brand-primary-brown max-w-7xl mx-auto">
            {/* Dedicated Checkout Form Component */}
            <CheckoutForm
                ref={checkoutFormRef}
                user={user}
                savedAddresses={savedAddresses}
                onChange={handleFormChange}
                onSubmit={handleProceedCheckout}
            />

            {/* Order Summary Column using ProductCartCard in View-Only Mode */}
            <div className="w-full md:w-[420px] shrink-0 flex flex-col gap-6 bg-[#F9F4F1] border border-[#78534a]/10 rounded-2xl p-7 shadow-xs h-fit sticky top-24">
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
