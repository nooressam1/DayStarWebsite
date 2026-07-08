import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useCartStore } from "@/app/modules/shared/hooks/useCartStore";
import { usePricing } from "@/app/modules/shared/hooks/usePricing";
import { processCheckout, getUserAddresses } from "@/utils/services";
import { Address } from "@/utils/types/type";
import { createClient } from "@/utils/supabase/client";

export function useCheckout() {
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
    const [governorate, setGovernorate] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");

    const [deliveryType, setDeliveryType] = useState("home"); // "home" | "pickup"
    const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "cash"

    const [errors, setErrors] = useState<Record<string, string>>({});

    const parseStreet = (streetStr: string) => {
        let street = streetStr;
        let area = "";
        let governorate = "";
        let postalCode = "";

        const newFormatMatch = streetStr.match(/^(.*?)\s*\(Area:\s*([^\)]*)\)\s*\(Gov:\s*([^\)]*)\)\s*\(Postal:\s*([^\)]*)\)$/);
        const oldFormatMatch = streetStr.match(/^(.*?)\s*\(Area:\s*([^\)]*)\)$/);

        if (newFormatMatch) {
            street = newFormatMatch[1].trim();
            area = newFormatMatch[2].trim();
            governorate = newFormatMatch[3].trim();
            postalCode = newFormatMatch[4].trim();
        } else if (oldFormatMatch) {
            street = oldFormatMatch[1].trim();
            area = oldFormatMatch[2].trim();
        }
        
        return { street, area, governorate, postalCode };
    };

    const autoPopulateAddress = (addr: Address) => {
        setCity(addr.city);
        
        const parsed = parseStreet(addr.street);
        setAddress(parsed.street);
        setArea(parsed.area);
        setGovernorate(parsed.governorate);
        setPostalCode(parsed.postalCode === "-" ? "" : parsed.postalCode);

        // Extract Floor and Apartment from building_no field if it follows the pattern "Floor: X, Apt: Y"
        const floorMatch = addr.building_no.match(/Floor:\s*([^,]+),\s*Apt:\s*(.+)/);
        if (floorMatch) {
            setFloorNumber(floorMatch[1].trim());
            setApartmentNumber(floorMatch[2].trim());
        } else {
            const floorOnly = addr.building_no.match(/Floor:\s*([^,]+)/);
            const aptOnly = addr.building_no.match(/Apt:\s*(.+)/);
            setFloorNumber(floorOnly ? floorOnly[1].trim() : "");
            setApartmentNumber(aptOnly ? aptOnly[1].trim() : "");
            if (!floorOnly && !aptOnly) {
                setFloorNumber(addr.building_no);
                setApartmentNumber("");
            }
        }
    };

    // Listen to current authentication status and load saved addresses
    useEffect(() => {
        if (user) {
            if (user.email) setEmail(user.email);
            setIsAuthModalOpen(false);
            
            getUserAddresses().then((data) => {
                setSavedAddresses(data);
                const defaultAddr = data.find((a) => a.is_default);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                    autoPopulateAddress(defaultAddr);
                } else if (data.length > 0) {
                    setSelectedAddressId(data[0].id);
                    autoPopulateAddress(data[0]);
                }
            });
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
                checkoutPostal
            );

            if (response && response.success) {
                clearCart();
                router.push(`/modules/order-confirmed/${response.orderId}`);
            } else {
                alert("An error occurred while placing your order.");
            }
        } catch (error) {
            console.error("Checkout process error:", error);
            alert("An error occurred while placing your order.");
        }
    };

    return {
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
    };
}
