'use client';
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useNavbarAuth } from "@/app/api/hooks";

interface AccountLinkItem {
  label: string;
  href: string;
}

const ACCOUNT_NAV_LINKS: AccountLinkItem[] = [
  { label: "Profile Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Favorites", href: "/account/favorites" },
  { label: "Addresses", href: "/account/addresses" },
];

export default function NavAccountDropdown() {
  const router = useRouter();
  const {
    user,
    setAuthOpen,
    dropdownOpen,
    setDropdownOpen,
    handleMouseEnter,
    handleMouseLeave,
    handleSignOut,
  } = useNavbarAuth();

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => {
          if (user) {
            router.push("/account");
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
                {ACCOUNT_NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-brand-primary-brown hover:bg-brand-primary-brown/5 rounded-lg transition-colors font-medium"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
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
  );
}
