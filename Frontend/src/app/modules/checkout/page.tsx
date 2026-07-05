"use client";

import { useState, useEffect } from "react";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import CustomButton from "../shared/component/CustomButton";
import TextInput from "../shared/component/TextInput";
import SelectionCard from "../shared/component/SelectionCard";
import { useCartStore } from "../shared/hooks/useCartStore";
import { usePricing } from "@/app/modules/shared/hooks/usePricing";
import ProductCartCard from "../shoppingcart/_components/ProductCartCard";
import { processCheckout } from "@/utils/services";
import { createClient } from "@/utils/supabase/client";
import AuthModal from "../auth/AuthModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-provider";

const checkout = () => {
    const { cart, incrementItem, clearCart, decrementItem, removeFromCart, discount, setDiscount } = useCartStore();
    const router = useRouter();
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [address, setAddress] = useState("");
    const [floorNumber, setFloorNumber] = useState("");
    const [apartmentNumber, setApartmentNumber] = useState("");

    const [deliveryType, setDeliveryType] = useState("home"); // "home" | "pickup"
    const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "cash"

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Listen to current authentication status
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
        if (!city) newErrors.city = "City is required";
        if (!area) newErrors.area = "Area is required";
        if (!address) newErrors.address = "Street address is required";

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

            const response = await processCheckout(
                city,
                area,
                address,
                floorNumber,
                apartmentNumber,
                items,
                token,
                discount?.code || undefined

            );

            if (response && response.success) {
                clearCart();
                router.push(`/modules/order-confirmed/${response.orderId}`);
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Error during order submission:", error);
            alert("An error occurred while placing your order.");
        }
    };

    return (
        <div className="p-10 flex flex-col md:flex-row gap-5 h-full">
            <div className="w-full flex flex-col gap-4  pr-4">
                <h1 className="text-brand-primary-brown font-bold font-serif text-xl">
                    Checkout
                </h1>

                {/* Contact Information */}
                <div>
                    <h2 className="text-black font-regular font-sans text-md mb-3">
                        Contact information
                    </h2>
                    <div className="flex flex-col gap-3">
                        <TextInput
                            label="Full Name"
                            required
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: "" }));
                            }}
                            error={errors.fullName}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                type="email"
                                label="Email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                                }}
                                error={errors.email}
                            />
                            <TextInput
                                type="tel"
                                label="Phone Number"
                                required
                                placeholder="+1 (555) 000-0000"
                                value={phoneNumber}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                    if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: "" }));
                                }}
                                error={errors.phoneNumber}
                            />
                        </div>
                    </div>
                </div>

                {/* Address Details */}
                <div>
                    <h2 className="text-black font-regular font-sans text-md mb-3 mt-2">
                        Address Details
                    </h2>
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                label="City"
                                required
                                placeholder="e.g. Cairo"
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                    if (errors.city) setErrors(prev => ({ ...prev, city: "" }));
                                }}
                                error={errors.city}
                            />
                            <TextInput
                                label="Area"
                                required
                                placeholder="e.g. Maadi"
                                value={area}
                                onChange={(e) => {
                                    setArea(e.target.value);
                                    if (errors.area) setErrors(prev => ({ ...prev, area: "" }));
                                }}
                                error={errors.area}
                            />
                        </div>
                        <TextInput
                            label="Street Address"
                            required
                            placeholder="Street Name, Building Number / Name"
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                                if (errors.address) setErrors(prev => ({ ...prev, address: "" }));
                            }}
                            error={errors.address}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                label="Floor Number (Optional)"
                                placeholder="e.g. 4th Floor"
                                value={floorNumber}
                                onChange={(e) => setFloorNumber(e.target.value)}
                            />
                            <TextInput
                                label="Apartment Number (Optional)"
                                placeholder="e.g. Apt 4B"
                                value={apartmentNumber}
                                onChange={(e) => setApartmentNumber(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery Type */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-black font-regular font-sans text-md mt-2">Delivery Type</h1>
                    <div className="flex flex-col gap-3">
                        <SelectionCard
                            title="Standard Delivery"
                            description="Your package will be delivered directly to your address within 3-5 business days."
                            name="deliveryType"
                            checked={deliveryType === "home"}
                            onChange={() => setDeliveryType("home")}
                        />
                        <SelectionCard
                            title="Fast Delivery"
                            description="Pay 7 L.E. and get your package delivered as fast as possible."
                            name="deliveryType"
                            checked={deliveryType === "pickup"}
                            onChange={() => setDeliveryType("pickup")}
                        />
                    </div>
                </div>

                {/* Select Payment Method */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-black font-regular font-sans text-md mt-2">Select Payment Method</h1>
                    <div className="flex flex-col gap-3">
                        <SelectionCard
                            title="Card Payment"
                            description="Pay securely using your credit or debit card via our secure payment gateway."
                            name="paymentMethod"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                        />
                        <SelectionCard
                            title="Cash on Delivery"
                            description="Pay with cash upon physical delivery of your package to your doorstep."
                            name="paymentMethod"
                            checked={paymentMethod === "cash"}
                            onChange={() => setPaymentMethod("cash")}
                        />
                    </div>
                </div>
                <CustomButton
                    className="w-full py-4 mt-4"
                    variant="solid"
                    colorScheme="secondary"
                    onClick={handleProceedCheckout}
                >
                    Confirm Order
                </CustomButton>
            </div>

            <div className=" w-screen h-0.5 md:w-0.5 md:h-screen  bg-[#78534A]/10"></div> {/*line*/}

            <div className="w-full md:w-1/2">
                <h1 className="text-brand-primary-brown font-bold font-serif text-xl">
                    Order Summary
                </h1>
                <div className="px-2 py-5 flex flex-col gap-5">

                    <div>
                        <h1 className="text-black font-regular font-sans text-md ">Order Pricing</h1>

                        <h1 className="font-work text-gray-500 text-md py-2">
                            Coupouns          </h1>
                        <div className="w-full flex py-4 flex-row justify-between"> <h1 className="font-work text-gray-500 text-md">
                            Sub Total          </h1><h1 className="w-1/4 flex justify-center text-black">{formatMoney(subtotal)}</h1></div>
                        <div className="w-full flex py-2 flex-row justify-between"> <h1 className="font-work text-gray-500 text-md">
                            Discount          </h1><h1 className="w-1/4 flex justify-center text-black">{formatMoney(discountAmount)}</h1></div>
                        <div className="w-full flex py-2 flex-row justify-between"> <h1 className="font-work text-gray-500 text-md">
                            Delivery Fee          </h1><h1 className="w-1/4 flex justify-center text-black">{formatMoney(deliveryFee)}</h1></div>
                    </div>
                    <div>
                        <div className="h-0.5 w-full bg-[#78534A]/10"></div> {/*line*/}

                        <div className="w-full flex py-4 flex-row justify-between">
                            <h1 className="font-work text-gray-500 text-md">
                                Total        </h1>
                            <h1 className="w-1/4 flex justify-center text-black">{formatMoney(total)}</h1>
                        </div></div>

                    <h1 className="text-black font-regular font-sans text-md ">Order Products</h1>
                    {cart.length === 0 ? (
                        <p className="text-brand-primary-brown p-5 text-center text-base"> your cart is empty</p>
                    ) :
                        (<div>

                            <div>{cart.map((item) => (<ProductCartCard key={item.variant_id} {...item} isEditable={false} onIncrement={() => incrementItem(item.variant_id)} onDecrement={() => decrementItem(item.variant_id)} onRemove={() => removeFromCart(item.variant_id)}></ProductCartCard>

                            ))}</div>
                        </div>
                        )
                    }
                </div>


            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div >
    );
}
export default checkout;
