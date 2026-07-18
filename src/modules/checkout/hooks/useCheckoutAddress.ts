"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/supabase/auth-provider";
import { getUserAddresses } from "@/app/api/endpoints/address.endpoint";
import { Address } from "@/app/api/types";

export function useCheckoutAddress() {
    const { user } = useAuth();
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [address, setAddress] = useState("");
    const [floorNumber, setFloorNumber] = useState("");
    const [apartmentNumber, setApartmentNumber] = useState("");
    const [governorate, setGovernorate] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");

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

        // Extract Floor and Apartment from building_no field
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

    // Load saved addresses and set default
    useEffect(() => {
        if (user) {
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

    return {
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
        setSavedAddresses,
        selectedAddressId,
        setSelectedAddressId,
        autoPopulateAddress,
        parseStreet,
    };
}
