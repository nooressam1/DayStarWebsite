"use client";

import { formatMoney } from "@/utils/format/format.moneyFormat";
import { CustomButton, TextInput, SelectionCard } from "@/modules/shared";
import ProductCartCard from "@/modules/shoppingcart/components/ProductCartCard";
import { EGYPT_GOVERNORATES } from "@/utils/constants";
import { useCheckout } from "../hooks/useCheckout";

const checkout = () => {
    const {
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
        city,
        setCity,
        area,
        setArea,
        address,
        setAddress,
        floorNumber,
        setFloorNumber,
        apartmentNumber,
        setApartmentNumber,
        governorate,
        setGovernorate,
        postalCode,
        setPostalCode,
        savedAddresses,
        selectedAddressId,
        setSelectedAddressId,
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
        autoPopulateAddress,
    } = useCheckout();

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

                {/* Saved Address Selection */}
                {user && savedAddresses.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-brand-primary-brown text-sm font-semibold mb-2">
                            Select Shipping Address
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {savedAddresses.map((addr) => (
                                <button
                                    key={addr.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedAddressId(addr.id);
                                        autoPopulateAddress(addr);
                                    }}
                                    className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${selectedAddressId === addr.id
                                        ? "bg-[#FAF5F3] border-brand-primary-brown"
                                        : "bg-white border-[#78534a]/15 hover:border-[#78534a]/30"
                                        }`}
                                >
                                    <span className="font-bold text-sm text-brand-primary-brown">
                                        {addr.label || "Address"} {addr.is_default && "(Default)"}
                                    </span>
                                    <span className="text-xs text-brand-gray line-clamp-1">
                                        {addr.street}
                                    </span>
                                    <span className="text-xs text-brand-gray">
                                        {addr.building_no}, {addr.city}
                                    </span>
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedAddressId("custom");
                                    setCity("");
                                    setArea("");
                                    setGovernorate("");
                                    setPostalCode("");
                                    setAddress("");
                                    setFloorNumber("");
                                    setApartmentNumber("");
                                }}
                                className={`p-4 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${selectedAddressId === "custom"
                                    ? "bg-[#FAF5F3] border-brand-primary-brown"
                                    : "bg-white border-dashed border-[#78534a]/20 hover:border-[#78534a]/40"
                                    }`}
                            >
                                <span className="font-bold text-sm text-brand-primary-brown">
                                    + Add New Address
                                </span>
                                <span className="text-xs text-brand-gray">
                                    Type a custom address below
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Address Details */}
                {(selectedAddressId === "custom" || savedAddresses.length === 0) && (
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1 w-full">
                                    <label className="text-brand-primary-brown font-sans text-sm font-medium">
                                        Governorate <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={governorate}
                                        onChange={(e) => {
                                            setGovernorate(e.target.value);
                                            if (errors.governorate) setErrors(prev => ({ ...prev, governorate: "" }));
                                        }}
                                        className={`rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors font-sans w-full bg-white cursor-pointer ${errors.governorate
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-brand-primary-brown/20 focus:border-brand-primary-brown"
                                            }`}
                                    >
                                        <option value="" disabled>Select Governorate</option>
                                        {EGYPT_GOVERNORATES.map((gov) => (
                                            <option key={gov} value={gov}>{gov}</option>
                                        ))}
                                    </select>
                                    {errors.governorate && (
                                        <span className="text-xs text-red-500 font-sans mt-0.5">{errors.governorate}</span>
                                    )}
                                </div>
                                <TextInput
                                    label="Postal Code"
                                    placeholder="e.g. 11728 (Optional)"
                                    value={postalCode}
                                    onChange={(e) => {
                                        setPostalCode(e.target.value);
                                    }}
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
                )}

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

                            <div className="flex flex-col gap-4">{cart.map((item) => (<ProductCartCard key={item.variant_id} {...item} isEditable={false} onIncrement={() => incrementItem(item.variant_id)} onDecrement={() => decrementItem(item.variant_id)} onRemove={() => removeFromCart(item.variant_id)}></ProductCartCard>

                            ))}</div>
                        </div>
                        )
                    }
                </div>


            </div>
        </div >
    );
}
export default checkout;
