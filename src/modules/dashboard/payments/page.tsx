'use client';

import React from "react";
import { CreditCard, Plus } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-primary-brown">
            Payment Options
          </h1>
          <p className="text-sm text-brand-gray">
            Manage your credit cards and billing methods
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-brand-primary-brown/20 text-brand-primary-brown hover:bg-brand-primary-brown/5 rounded-lg text-sm font-semibold transition-all cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>Add Card</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#78534a]/20 rounded-xl bg-[#FAF5F3]/30">
        <div className="p-4 bg-brand-primary-brown/5 rounded-full text-brand-primary-brown mb-4">
          <CreditCard className="h-8 w-8" />
        </div>
        <h3 className="font-serif text-lg font-bold text-brand-primary-brown">
          No Saved Cards
        </h3>
        <p className="text-sm text-brand-gray text-center max-w-sm mt-1">
          Save your credit or debit cards here to experience seamless one-click checkouts.
        </p>
      </div>
    </div>
  );
}
