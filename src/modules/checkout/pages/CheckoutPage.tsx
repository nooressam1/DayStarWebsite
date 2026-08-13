"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import { CustomButton, TextInput, SelectionCard, useCartStore, calculatePricing } from "@/modules/shared";
import ProductCartCard from "@/modules/shoppingcart/components/ProductCartCard";
import { EGYPT_GOVERNORATES } from "@/modules/checkout";
import { useAuth } from "@/lib/supabase/auth-provider";
import { processCheckout } from "@/app/api/endpoints/order.endpoint";
import { getUserAddresses } from "@/app/api/endpoints/address.endpoint";
import { useAuthModalStore } from "@/app/api/hooks/useAuthModalStore";
import { useProcessCheckoutMutation } from "@/app/api/hooks/useOrderQueries";
import { Address } from "@/app/api/types";

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { openModal } = useAuthModalStore();
    const { cart, discount, incrementItem, decrementItem, removeFromCart, clearCart } = useCartStore();

    // Checkout Form State
    const [checkoutForm, setCheckoutForm] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        deliveryType: "home",
        paymentMethod: "cash",
    });

    const [addressForm, setAddressForm] = useState({
        city: "",
        area: "",
        street: "",
        buildingNo: "",
        floorNumber: "",
        apartmentNumber: "",
        governorate: "",
        postalCode: "",
        selectedAddressId: "",
    });

    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    // Auto-fill user details on mount
    useEffect(() => {
        if (user) {
            setCheckoutForm((prev) => ({
                ...prev,
                fullName: user.user_metadata?.full_name || prev.fullName,
                email: user.email || prev.email,
            }));

            getUserAddresses().then((addrs) => {
                setSavedAddresses(addrs);
                const defaultAddr = addrs.find((a) => a.is_default) || addrs[0];
                if (defaultAddr) {
                    setAddressForm({
                        city: defaultAddr.city || "",
                        area: defaultAddr.area || "",
                        street: defaultAddr.street || "",
                        buildingNo: defaultAddr.building_no || "",
                        floorNumber: defaultAddr.floor_number || "",
                        apartmentNumber: defaultAddr.apartment_number || "",
                        governorate: defaultAddr.governorate || "",
                        postalCode: defaultAddr.postal_code || "",
                        selectedAddressId: defaultAddr.id,
                    });
                }
            });
        }
    }, [user]);

    const { subTotal: subtotal, deliveryFee, discount: discountAmount, total } = calculatePricing(cart, {
        discountAmount: (discount as any)?.discount_amount || discount?.value,
    });

    const updateCheckoutField = (field: string, value: string) => {
        setCheckoutForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const updateAddressField = (field: string, value: string) => {
        setAddressForm((prev) => ({ ...prev, [field]: value, selectedAddressId: "custom" }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const selectAddress = (addr: Address) => {
        setAddressForm({
            city: addr.city || "",
            area: addr.area || "",
            street: addr.street || "",
            buildingNo: addr.building_no || "",
            floorNumber: addr.floor_number || "",
            apartmentNumber: addr.apartment_number || "",
            governorate: addr.governorate || "",
            postalCode: addr.postal_code || "",
            selectedAddressId: addr.id,
        });
        setErrors({});
    };

    const processCheckoutMutation = useProcessCheckoutMutation();

    const handleProceedCheckout = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        if (!user) {
            openModal("login");
            return;
        }

        const newErrors: Record<string, string> = {};
        if (!checkoutForm.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!checkoutForm.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        if (!addressForm.governorate) newErrors.governorate = "Governorate is required";
        if (!addressForm.city.trim()) newErrors.city = "City is required";
        if (!addressForm.area.trim()) newErrors.area = "Area is required";
        if (!addressForm.street.trim()) newErrors.street = "Street address is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitting(true);
        try {
            const addressPayload = {
                address: addressForm.street.trim(),
                street: addressForm.street.trim(),
                area: addressForm.area.trim(),
                building_no: addressForm.buildingNo.trim(),
                floor_number: addressForm.floorNumber.trim(),
                apartment_number: addressForm.apartmentNumber.trim(),
                governorate: addressForm.governorate.trim(),
                city: addressForm.city.trim(),
                country: "Egypt",
                postal_code: addressForm.postalCode.trim(),
                phone_number: checkoutForm.phoneNumber.trim(),
                fullName: checkoutForm.fullName.trim(),
            };

            const result = await processCheckoutMutation.mutateAsync({
                items: cart.map((item) => ({ variant_id: item.variant_id, quantity: item.quantity })),
                address: addressPayload,
                token: (user as any)?.access_token || "",
                couponCode: discount?.code,
                fullName: checkoutForm.fullName.trim(),
                phoneNumber: checkoutForm.phoneNumber.trim(),
            });

            if (result.success && result.orderId) {
                clearCart();
                router.push(`/order-confirmed/${result.orderId}`);
            } else {
                alert(result.error || "Checkout failed. Please try again.");
            }
        } catch (err) {
            console.error("Checkout error:", err);
            alert("An unexpected error occurred during checkout.");
        } finally {
            setSubmitting(false);
        }
    };

    const { fullName, phoneNumber, email, deliveryType, paymentMethod } = checkoutForm;
    const { city, area, street: address, buildingNo, floorNumber, apartmentNumber, governorate, postalCode, selectedAddressId } = addressForm;

    return (
        <div className="p-10 flex flex-col md:flex-row gap-5 h-full font-sans text-brand-primary-brown">
            <div className="w-full flex flex-col gap-4 pr-4">
                <h1 className="text-black font-semibold font-serif text-3xl">Checkout</h1>

                {/* Personal Information */}
                <div>
                    <h2 className="text-black font-regular font-sans text-md mb-3">
                        Personal Information
                    </h2>
                    <div className="flex flex-col gap-3">
                        <TextInput
                            label="Full Name *"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => updateCheckoutField("fullName", e.target.value)}
                            error={errors.fullName}
                        />
                        <TextInput
                            label="Phone Number *"
                            placeholder="01234567890"
                            value={phoneNumber}
                            onChange={(e) => updateCheckoutField("phoneNumber", e.target.value)}
                            error={errors.phoneNumber}
                        />
                        <TextInput
                            label="Email Address"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => updateCheckoutField("email", e.target.value)}
                            error={errors.email}
                        />
                    </div>
                </div>

                {/* Saved Address Selector */}
                {savedAddresses.length > 0 && (
                    <div>
                        <h2 className="text-black font-regular font-sans text-md mb-3">
                            Select Saved Address
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {savedAddresses.map((addr) => (
                                <button
                                    key={addr.id}
                                    type="button"
                                    onClick={() => selectAddress(addr)}
                                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                        selectedAddressId === addr.id
                                            ? "border-brand-primary-brown bg-brand-primary-brown/10 font-bold"
                                            : "border-stone-200 hover:bg-stone-50"
                                    }`}
                                >
                                    <p className="font-semibold">{addr.label || "Address"}</p>
                                    <p className="text-stone-500 mt-1">{addr.street}, {addr.city}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Delivery Address Form */}
                <div>
                    <h2 className="text-black font-regular font-sans text-md mb-3">
                        Delivery Address
                    </h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-brand-primary-brown">
                                Governorate *
                            </label>
                            <select
                                value={governorate}
                                onChange={(e) => updateAddressField("governorate", e.target.value)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white text-brand-primary-brown focus:outline-hidden focus:border-brand-primary-brown"
                            >
                                <option value="">Select Governorate</option>
                                {EGYPT_GOVERNORATES.map((gov) => (
                                    <option key={gov} value={gov}>
                                        {gov}
                                    </option>
                                ))}
                            </select>
                            {errors.governorate && <span className="text-xs text-red-500">{errors.governorate}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <TextInput
                                label="City *"
                                placeholder="Cairo"
                                value={city}
                                onChange={(e) => updateAddressField("city", e.target.value)}
                                error={errors.city}
                            />
                            <TextInput
                                label="Area *"
                                placeholder="Maadi"
                                value={area}
                                onChange={(e) => updateAddressField("area", e.target.value)}
                                error={errors.area}
                            />
                        </div>

                        <TextInput
                            label="Street Address *"
                            placeholder="15 El Tahrir Street"
                            value={address}
                            onChange={(e) => updateAddressField("street", e.target.value)}
                            error={errors.street}
                        />

                        <div className="grid grid-cols-3 gap-3">
                            <TextInput
                                label="Building No."
                                placeholder="12"
                                value={buildingNo}
                                onChange={(e) => updateAddressField("buildingNo", e.target.value)}
                            />
                            <TextInput
                                label="Floor"
                                placeholder="4"
                                value={floorNumber}
                                onChange={(e) => updateAddressField("floorNumber", e.target.value)}
                            />
                            <TextInput
                                label="Apt No."
                                placeholder="14"
                                value={apartmentNumber}
                                onChange={(e) => updateAddressField("apartmentNumber", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div>
                    <h2 className="text-black font-regular font-sans text-md mb-3">
                        Payment Method
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <SelectionCard
                            title="Cash on Delivery"
                            description="Pay in cash when your order arrives"
                            checked={paymentMethod === "cash"}
                            onChange={() => updateCheckoutField("paymentMethod", "cash")}
                        />
                        <SelectionCard
                            title="Credit / Debit Card"
                            description="Pay securely online with card"
                            checked={paymentMethod === "card"}
                            onChange={() => updateCheckoutField("paymentMethod", "card")}
                        />
                    </div>
                </div>
            </div>

            {/* Order Summary Column */}
            <div className="w-full md:w-[450px] shrink-0 flex flex-col gap-4 bg-white border border-[#78534a]/10 rounded-2xl p-6 shadow-xs h-fit">
                <h2 className="text-black font-semibold font-serif text-xl">Order Summary</h2>

                <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                        <ProductCartCard key={item.variant_id} {...item} />
                    ))}
                </div>

                <div className="border-t border-stone-200 pt-4 flex flex-col gap-2 text-xs">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatMoney(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>{formatMoney(deliveryFee)}</span>
                    </div>
                    {discountAmount > 0 && (
                        <div className="flex justify-between text-green-700">
                            <span>Discount</span>
                            <span>-{formatMoney(discountAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-base font-bold border-t border-stone-200 pt-2 text-brand-primary-brown">
                        <span>Total</span>
                        <span>{formatMoney(total)}</span>
                    </div>
                </div>

                <CustomButton
                    onClick={handleProceedCheckout}
                    disabled={submitting}
                    className="w-full py-3 bg-brand-primary-brown text-white font-semibold rounded-xl hover:bg-brand-primary-brown/90 shadow-md cursor-pointer mt-2"
                >
                  {submitting ? "Processing Order..." : "Place Order"}
                </CustomButton>
            </div>
        </div>
    );
}
