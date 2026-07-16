'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, User, Menu } from "lucide-react"; // Example icon library
import { useCartStore } from "../hooks/useCartStore";
import AuthModal from "../../auth/AuthModal";
import { useNavbarAuth } from "../hooks/useNavbarAuth";

export default function Navbar() {
  const { cart } = useCartStore();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])
  const {
    user,
    authOpen,
    setAuthOpen,
    dropdownOpen,
    setDropdownOpen,
    handleMouseEnter,
    handleMouseLeave,
    handleSignOut,
  } = useNavbarAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      // 1. Redirect to the catalog page with the URL-encoded query
      router.push(`/product?search=${encodeURIComponent(searchQuery.trim())}`);

      // 2. Collapse the search bar
      setSearchOpen(false);

      setSearchQuery("");
    }
  };


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
        <div className={searchOpen ? "hidden md:block" : "block"}>
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
            href="/modules/about"
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-80 transition-opacity"
          >
            About Us
          </Link>
          <Link
            href="/modules/contact"
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-80 transition-opacity"
          >
            Contact Us
          </Link>
        </div>
        <div className="flex gap-2">
          {/* Search Icon with Slide-out Input */}
          <div className="relative flex items-center gap-1.5">
            {searchOpen && (
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                onBlur={() => {
                  // Collapse if input is blurred and empty
                  setTimeout(() => {
                    if (!searchQuery.trim()) setSearchOpen(false);
                  }, 150);
                }}
                className="bg-[#FAF5F3] border border-brand-primary-brown/20 rounded-full px-4 py-1 text-sm text-brand-primary-brown outline-none focus:border-brand-primary-brown w-[48vw] sm:w-56 md:w-56 transition-all duration-300 animate-in slide-in-from-right-2"
                autoFocus
              />
            )}
            <button
              onClick={() => {
                if (searchOpen) {
                  if (searchQuery.trim()) {
                    handleSearchSubmit();
                  } else {
                    setSearchOpen(false);
                  }
                } else {
                  setSearchOpen(true);
                }
              }}
              className="relative flex p-2 text-brand-primary-brown hover:text-gray-900 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>{" "}
          <Link
            href="/modules/shoppingcart"
            className="relative flex p-2 text-brand-primary-brown hover:text-gray-900"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && cart.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-secondary-blue text-[10px] font-bold text-white">
                {cart.length}
              </span>
            )}
          </Link>
          {/* Account Icon with Hover Dropdown */}
          <div
            className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => {
                if (user) {
                  router.push("/modules/dashboard");
                } else {
                  setAuthOpen(true);
                }
              }}
              className="relative flex p-2 text-brand-primary-brown hover:text-gray-900 transition-colors cursor-pointer"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-64 bg-white border border-[#78534a]/15 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {user ? (
                  <div className="p-4 flex flex-col gap-3 font-sans">
                    <div className="border-b border-[#78534a]/10 pb-3">
                      <p className="text-xs text-brand-gray">Logged in as</p>
                      <p className="text-sm font-semibold text-brand-primary-brown truncate max-w-full">
                        {user.email}
                      </p>
                    </div>
                    <ul className="flex flex-col gap-1">
                      <li>
                        <Link
                          href="/modules/dashboard/orders"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-brand-primary-brown hover:bg-brand-primary-brown/5 rounded-lg transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/modules/dashboard/addresses"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-brand-primary-brown hover:bg-brand-primary-brown/5 rounded-lg transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Addresses
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/modules/dashboard/payments"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-brand-primary-brown hover:bg-brand-primary-brown/5 rounded-lg transition-colors font-medium"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Payments
                        </Link>
                      </li>
                    </ul>
                    <div className="border-t border-[#78534a]/10 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex flex-col gap-3 font-sans text-center">
                    <p className="text-sm text-brand-primary-brown">
                      Access your orders, addresses, and more
                    </p>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setAuthOpen(true);
                      }}
                      className="w-full py-2.5 bg-brand-primary-brown hover:bg-brand-primary-brown/90 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm"
                    >
                      Sign In / Sign Up
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
            href="/modules/about"
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-85 py-1 border-b border-[#78534a]/5"
          >
            About Us
          </Link>
          <Link
            href="/modules/contact"
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-85 py-1"
          >
            Contact Us
          </Link>
        </div>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

