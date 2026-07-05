'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu } from "lucide-react"; // Example icon library
import { useCartStore } from "../hooks/useCartStore";
import AuthModal from "../../auth/AuthModal";

export default function Navbar() {
  const { cart } = useCartStore();
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-500 flex justify-between items-center px-10 py-5 ${scrolled || menuOpen ? "bg-[#FAF5F3] shadow-md" : "bg-transparent"}`}>
        <div className="block md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative flex p-2 text-brand-primary-brown hover:text-gray-900 focus:outline-none"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <div>
          <Link
            href="/modules/home"
            className="cursor-pointer font-serif text-brand-primary-brown font-bold text-base md:text-2xl transition-colors"
          >
            DAYSTORE
          </Link>
        </div>
        <div className=" gap-8 hidden md:flex">
          <Link
            href="/modules/home"
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-80 transition-opacity"
          >
            Home
          </Link>
          <Link
            href="/product"
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-80 transition-opacity"
          >
            Shop By
          </Link>
          <Link
            href="/product?collection=sale"
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-80 transition-opacity"
          >
            On Sale
          </Link>
          <Link
            href="/about"
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-80 transition-opacity"
          >
            About Us
          </Link>
        </div>
        <div className="flex gap-2">
          <Link
            href="/product"
            className="relative flex p-2 text-brand-primary-brown hover:text-gray-900"
            aria-label="Search"
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
          <button
            onClick={() => setAuthOpen(true)}
            className="relative flex p-2 text-brand-primary-brown hover:text-gray-900 transition-colors"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed top-[64px] left-0 right-0 bg-[#FAF5F3] shadow-md border-t border-[#78534a]/10 px-10 py-6 flex flex-col gap-4 z-40 animate-in slide-in-from-top duration-300">
          <Link
            href="/modules/home"
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-85 py-1 border-b border-[#78534a]/5"
          >
            Home
          </Link>
          <Link
            href="/product"
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-85 py-1 border-b border-[#78534a]/5"
          >
            Shop By
          </Link>
          <Link
            href="/product?collection=sale"
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-85 py-1 border-b border-[#78534a]/5"
          >
            On Sale
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-85 py-1"
          >
            About Us
          </Link>
        </div>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

