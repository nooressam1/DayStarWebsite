"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Lock, ShieldCheck, Loader2 } from "lucide-react";

interface PaymentProcessingModalProps {
  isOpen: boolean;
  amount: number;
  onComplete: () => void;
}

export default function PaymentProcessingModal({
  isOpen,
  amount,
  onComplete,
}: PaymentProcessingModalProps) {
  const [step, setStep] = useState<"connecting" | "authorizing" | "success">("connecting");

  const formatMoney = (val: number) => `EGP ${(val / 100).toFixed(2)}`;

  useEffect(() => {
    if (!isOpen) {
      setStep("connecting");
      return;
    }

    // Step 1: Connecting (0ms - 600ms)
    setStep("connecting");

    // Step 2: Authorizing with Bank (600ms - 1500ms)
    const t1 = setTimeout(() => {
      setStep("authorizing");
    }, 600);

    // Step 3: Approved (1500ms - 2200ms)
    const t2 = setTimeout(() => {
      setStep("success");
    }, 1500);

    // Step 4: Callback / Redirect (2200ms)
    const t3 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#ebdcd7] flex flex-col items-center text-center">
        {/* Top Security Banner */}
        <div className="w-full flex items-center justify-between border-b border-[#ebdcd7] pb-3 mb-5 text-xs text-[#78534a]">
          <span className="font-serif font-bold text-sm tracking-wide">DayStar Pay</span>
          <div className="flex items-center gap-1 text-[#557b55] font-semibold text-[11px]">
            <Lock className="w-3 h-3" />
            <span>256-bit Encrypted</span>
          </div>
        </div>

        {/* Amount Badge */}
        <div className="mb-6">
          <span className="text-xs text-[#78716c] uppercase tracking-wider block mb-1">
            Total Charge
          </span>
          <span className="text-2xl font-bold font-sans text-[#004956]">
            {formatMoney(amount)}
          </span>
        </div>

        {/* Animated Visual Status */}
        <div className="my-3 flex flex-col items-center justify-center">
          {step !== "success" ? (
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#fdf2e9] text-[#78534a] mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#78534a]" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#557b55]/15 text-[#557b55] mb-4 animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-10 h-10 text-[#557b55]" />
            </div>
          )}

          {/* Status Message */}
          <h3 className="font-serif font-bold text-lg text-[#292524] mb-1">
            {step === "connecting" && "Contacting Gateway..."}
            {step === "authorizing" && "Authorizing Payment..."}
            {step === "success" && "Payment Approved!"}
          </h3>

          <p className="text-xs text-[#78716c] max-w-xs leading-relaxed">
            {step === "connecting" && "Initiating secure simulated payment session."}
            {step === "authorizing" && "Verifying card details with issuing bank sandbox."}
            {step === "success" && "Transaction verified. Generating your order confirmation..."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#f5ebe6] h-1.5 rounded-full overflow-hidden mt-6">
          <div
            className="bg-[#78534a] h-full transition-all duration-700 ease-out"
            style={{
              width:
                step === "connecting"
                  ? "30%"
                  : step === "authorizing"
                  ? "75%"
                  : "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
