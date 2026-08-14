"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import { CustomButton, useCartStore, calculatePricing } from "@/modules/shared";
import ProductCartCard from "@/modules/shoppingcart/components/ProductCartCard";
import { CheckoutPageSkeleton, CheckoutForm, CheckoutFormValues } from "@/modules/checkout";
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

    // Stable form values reference updated by CheckoutForm child component
    const formValuesRef = useRef<CheckoutFormValues | null>(null);

    const handleFormChange = (values: CheckoutFormValues) => {
        formValuesRef.current = values;
    };

    const { subTotal: subtotal, deliveryFee, discount: discountAmount, total } = calculatePricing(cart, {
        discountAmount: discount?.value,
    });

    const processCheckoutMutation = useProcessCheckoutMutation();

    const handleProceedCheckout = async () => {
        if (cart.length === 0) {
            toast.warning("Your cart is empty.");
            return;
        }

        if (!user) {
            openModal("login");
            return;
        }

        const values = formValuesRef.current;
        if (!values) return;

        // Perform validation
        if (!values.fullName.trim()) {
            toast.error("Please enter your full name.");
            return;
        }
        if (!values.phoneNumber.trim()) {
            toast.error("Please enter your phone number.");
            return;
        }
        if (!values.governorate) {
            toast.error("Please select your governorate.");
            return;
        }
        if (!values.city.trim() || !values.area.trim() || !values.street.trim()) {
            toast.error("Please fill out all required address fields (City, Area, Street).");
            return;
        }

        setSubmitting(true);
        try {
            const addressPayload = {
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

            const result = await processCheckoutMutation.mutateAsync({
                items: cart.map((item) => ({ variant_id: item.variant_id, quantity: item.quantity })),
                address: addressPayload,
                token: session?.access_token || "",
                couponCode: discount?.code,
                fullName: values.fullName.trim(),
                phoneNumber: values.phoneNumber.trim(),
            });

            if (result && result.success && result.orderId) {
                clearCart();
                router.push(`/order-confirmed/${result.orderId}`);
            } else {
                toast.error(result?.error || "Checkout failed. Please try again.");
            }
        } catch (err) {
            console.error("Checkout error:", err);
            toast.error("An unexpected error occurred during checkout.");
        } finally {
            setSubmitting(false);
        }
    };

    // Render Loading Skeleton while loading addresses
    if (user && addressesLoading) {
        return <CheckoutPageSkeleton />;
    }

    return (
        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 h-full font-sans text-brand-primary-brown max-w-7xl mx-auto">
            {/* Dedicated Checkout Form Component */}
            <CheckoutForm
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

                {/* Order products Section using ProductCartCard in view-only mode */}
                <div className="flex flex-col gap-3 border-t border-stone-300/40 pt-4">
                    <h3 className="font-sans text-base font-medium text-stone-900">
                        Order products
                    </h3>
                    <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                        {cart.map((item) => (
                            <ProductCartCard key={item.variant_id} {...item} isEditable={false} />
                        ))}
                    </div>
                </div>

                <CustomButton
                    onClick={handleProceedCheckout}
                    disabled={submitting}
                    variant="solid"
                    colorScheme="secondary"
                    className="w-full py-4 text-sm font-semibold rounded-xl cursor-pointer shadow-md mt-2"
                >
                    {submitting ? "Processing Order..." : "Place Order"}
                </CustomButton>
            </div>
        </div>
    );
}
