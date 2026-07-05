'use client';

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif font-bold text-brand-primary-brown">
          My Orders
        </h1>
        <p className="text-sm text-brand-gray">
          Track and view your order history
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#78534a]/20 rounded-xl bg-[#FAF5F3]/30">
        <div className="p-4 bg-brand-primary-brown/5 rounded-full text-brand-primary-brown mb-4">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="font-serif text-lg font-bold text-brand-primary-brown">
          No Orders Placed Yet
        </h3>
        <p className="text-sm text-brand-gray text-center max-w-sm mt-1 mb-6">
          You haven't ordered anything from DayStar yet. Browse our collections to find something you like!
        </p>
        <Link
          href="/product"
          className="px-6 py-2.5 bg-brand-primary-brown text-white text-sm font-medium rounded-lg hover:bg-brand-primary-brown/90 shadow-sm transition-all cursor-pointer"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
