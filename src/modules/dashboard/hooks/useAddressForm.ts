import { useState, useEffect } from "react";
import { Address } from "@/app/api/types";
import { addUserAddress, updateUserAddress } from "@/app/api/endpoints/address.endpoint";

interface UseAddressFormProps {
  isOpen: boolean;
  editingAddress: Address | null;
  isFirstAddress: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export function useAddressForm({
  isOpen,
  editingAddress,
  isFirstAddress,
  onClose,
  onSaveSuccess,
}: UseAddressFormProps) {
  const [label, setLabel] = useState("Home"); // Home, Work, Other
  const [customLabel, setCustomLabel] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [buildingNo, setBuildingNo] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Egypt");
  const [isDefault, setIsDefault] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Helper to parse composite street format
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

  // Reset form / load editing address details on open or when editingAddress changes
  useEffect(() => {
    if (isOpen) {
      if (editingAddress) {
        if (editingAddress.label === "Home" || editingAddress.label === "Work") {
          setLabel(editingAddress.label);
          setCustomLabel("");
        } else {
          setLabel("Other");
          setCustomLabel(editingAddress.label || "");
        }
        const parsed = parseStreet(editingAddress.street);
        setStreet(parsed.street);
        setArea(parsed.area);
        setGovernorate(parsed.governorate);
        setPostalCode(parsed.postalCode === "-" ? "" : parsed.postalCode);
        setBuildingNo(editingAddress.building_no);
        setCity(editingAddress.city);
        setCountry(editingAddress.country);
        setIsDefault(editingAddress.is_default);
      } else {
        setLabel("Home");
        setCustomLabel("");
        setStreet("");
        setArea("");
        setGovernorate("");
        setPostalCode("");
        setBuildingNo("");
        setCity("");
        setCountry("Egypt");
        setIsDefault(isFirstAddress);
      }
      setFormError("");
      setSubmitting(false);
    }
  }, [isOpen, editingAddress, isFirstAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !area.trim() || !governorate.trim() || !buildingNo.trim() || !city.trim()) {
      setFormError("Please fill out all required fields (Street, Area, Governorate, Building info, and City).");
      return;
    }

    setFormError("");
    setSubmitting(true);

    const finalLabel = label === "Other" ? (customLabel.trim() || "Other") : label;
    const payload = {
      street: street.trim(),
      area: area.trim(),
      governorate: governorate.trim(),
      postalCode: postalCode.trim(),
      building_no: buildingNo.trim(),
      city: city.trim(),
      country: country.trim() || "Egypt",
      label: finalLabel,
      is_default: isDefault,
    };

    let result;
    if (editingAddress) {
      result = await updateUserAddress(editingAddress.id, payload);
    } else {
      result = await addUserAddress(payload);
    }

    setSubmitting(false);
    if (result) {
      onSaveSuccess();
      onClose();
    } else {
      setFormError("Failed to save address. Please try again.");
    }
  };

  return {
    label,
    setLabel,
    customLabel,
    setCustomLabel,
    street,
    setStreet,
    area,
    setArea,
    governorate,
    setGovernorate,
    postalCode,
    setPostalCode,
    buildingNo,
    setBuildingNo,
    city,
    setCity,
    country,
    setCountry,
    isDefault,
    setIsDefault,
    formError,
    setFormError,
    submitting,
    handleSubmit,
  };
}
