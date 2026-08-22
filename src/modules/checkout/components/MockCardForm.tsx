"use client";

import React from "react";
import { CreditCard, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { TextInput } from "@/modules/shared";

export interface MockCardState {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface MockCardFormProps {
  cardState: MockCardState;
  onChange: (field: keyof MockCardState, value: string) => void;
  errors?: Record<string, string>;
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function formatCVV(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

export default function MockCardForm({ cardState, onChange, errors = {} }: MockCardFormProps) {
  const handleQuickFill = () => {
    onChange("cardNumber", "4242 4242 4242 4242");
    onChange("expiryDate", "12/28");
    onChange("cvv", "123");
  };

  const isVisa = cardState.cardNumber.startsWith("4");
  const isMastercard = cardState.cardNumber.startsWith("5");

  return (
    <div className="mt-4 p-5 bg-[#fdfbf9] border border-[#ebdcd7] rounded-xl flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Header & Quick Fill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ebdcd7] pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#78534a]" />
          <span className="font-serif text-sm font-semibold text-[#78534a]">
            Credit / Debit Card Details
          </span>
          <span className="bg-[#557b55]/10 text-[#557b55] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Sandbox Mock
          </span>
        </div>

        <button
          type="button"
          onClick={handleQuickFill}
          className="inline-flex items-center gap-1.5 text-xs text-[#004956] hover:text-[#003842] font-medium underline underline-offset-2 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Fill Test Card
        </button>
      </div>

      {/* Card Inputs Grid */}
      <div className="flex flex-col gap-3">
        {/* Card Number */}
        <div className="relative">
          <TextInput
            label="Card Number *"
            placeholder="4242 4242 4242 4242"
            value={cardState.cardNumber}
            onChange={(e) => onChange("cardNumber", formatCardNumber(e.target.value))}
            error={errors.cardNumber}
            maxLength={19}
          />
          <div className="absolute right-3 top-9 flex items-center gap-1.5 text-xs text-stone-400 font-semibold select-none pointer-events-none">
            {isVisa && <span className="text-[#1a1f71] font-bold">VISA</span>}
            {isMastercard && <span className="text-[#eb001b] font-bold">Mastercard</span>}
            {!isVisa && !isMastercard && <Lock className="w-3.5 h-3.5 text-stone-400" />}
          </div>
        </div>

        {/* Cardholder Name */}
        <TextInput
          label="Cardholder Name *"
          placeholder="Name on card"
          value={cardState.cardHolder}
          onChange={(e) => onChange("cardHolder", e.target.value)}
          error={errors.cardHolder}
        />

        {/* Expiry & CVV Row */}
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Expiry Date *"
            placeholder="MM/YY"
            value={cardState.expiryDate}
            onChange={(e) => onChange("expiryDate", formatExpiryDate(e.target.value))}
            error={errors.expiryDate}
            maxLength={5}
          />
          <TextInput
            label="Security Code (CVV) *"
            placeholder="123"
            value={cardState.cvv}
            onChange={(e) => onChange("cvv", formatCVV(e.target.value))}
            error={errors.cvv}
            maxLength={4}
            type="password"
          />
        </div>
      </div>

      {/* Security Footer */}
      <div className="flex items-center gap-2 text-[11px] text-[#78716c] pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#557b55] shrink-0" />
        <span>Simulated payment — no real banking charge will occur.</span>
      </div>
    </div>
  );
}
