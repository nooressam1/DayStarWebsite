'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/app/api/hooks";
import { AiSkincareChat } from "@/modules/skincare-test/components/AiSkincareChat";
import NavAccountDropdown from "./NavAccountDropdown";

interface NavLinkItem {
  label: string;
  href: string;

}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop By", href: "/product" },
  { label: "On Sale", href: "/product?collection=sale" },
  { label: "AI Skin Test", href: "/skincare-test", },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const { cart } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close AI Chat modal and menus when route changes
  useEffect(() => {
    setAiChatOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-500 flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 md:py-5 ${scrolled || menuOpen ? "bg-[#FAF5F3] shadow-md" : "bg-transparent"}`}>
        {/* Mobile Menu Hamburger */}
        <div className="block md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative flex p-2 text-brand-primary-brown hover:text-gray-900 focus:outline-none cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Brand Logo */}
        <div className={searchOpen ? "hidden md:block" : "block"}>
          <Link
            href="/"
            className="cursor-pointer font-serif text-brand-primary-brown font-bold text-base md:text-2xl transition-colors"
          >
            DAYSTORE
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="gap-6 lg:gap-8 hidden md:flex items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer  text-brand-primary-brown font-mediumfont-serif text-base transition-opacity hover:opacity-80"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
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
          </div>

          {/* Cart Icon */}
          <Link
            href="/cart"
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

          {/* Account Dropdown Component */}
          <NavAccountDropdown />
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed top-[64px] left-0 right-0 bg-[#FAF5F3] shadow-md border-t border-[#78534a]/10 px-6 sm:px-10 py-6 flex flex-col gap-4 z-40 animate-in slide-in-from-top duration-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer  text-brand-primary-brown font-mediumfont-serif text-base transition-opacity hover:opacity-80"

            >
              {link.label}
            </Link>
          ))}

        </div>
      )}

      {/* Interactive AI Chat Box Modal */}
      {aiChatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setAiChatOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setAiChatOpen(false)}
              className="absolute top-3.5 right-4 z-50 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              aria-label="Close AI Chat"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Embedded AI Chat Box */}
            <AiSkincareChat />
          </div>
        </div>
      )}
    </>
  );
}
