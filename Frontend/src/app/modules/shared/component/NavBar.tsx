'use client';
import React from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu } from "lucide-react"; // Example icon library
import { useCartStore } from "../hooks/useCartStore";

export default function Navbar() {
  const { cart } = useCartStore();

  return (
    <nav className="sticky top-0 z-50 w-full flex justify-between items-center px-10 py-5">
      <div className="block md:hidden">
        <Link
          href="/cart"
          className="relative flex p-2 text-brand-primary-brown hover:text-gray-900"
          aria-label="Cart"
        >
          <Menu className="h-5 w-5" />
        </Link>
      </div>
      <div>
        <Link
          href="/home"
          className="cursor-pointer font-serif text-brand-primary-brown font-bold text-base md:text-2xl transition-colors"
        >
          DAYSTORE
        </Link>
      </div>
      <div className=" gap-8 hidden md:flex">
        <Link
          href="/home"
          className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base "
        >
          Home
        </Link>
        <Link
          href="/home"
          className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base "
        >
          Shop By
        </Link>
        <Link
          href="/home"
          className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base "
        >
          On Sale
        </Link>
        <Link
          href="/home"
          className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base "
        >
          Contact
        </Link>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/modules/product/ceramide-repair-moisturizer`}
          className="relative flex p-2 text-brand-primary-brown hover:text-gray-900"
          aria-label="Cart"
        >
          <Search className="h-5 w-5" />
        </Link>{" "}
        <Link
          href="/modules/shoppingcart"
          className="relative flex p-2 text-brand-primary-brown hover:text-gray-900"
          aria-label="Cart"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute top-0 right-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-secondary-blue text-[10px] font-bold text-white">
            {cart.length}
          </span>
        </Link>
        <Link
          href="/cart"
          className="relative flex p-2 text-brand-primary-brown hover:text-gray-900"
          aria-label="Cart"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </nav>
  );
}
