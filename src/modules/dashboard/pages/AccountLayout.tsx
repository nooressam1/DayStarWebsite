'use client';

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-provider";
import { User, ShoppingBag, MapPin, LogOut, Heart } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = [
    {
      name: "Profile Overview",
      href: "/account",
      icon: User,
    },
    {
      name: "Orders",
      href: "/account/orders",
      icon: ShoppingBag,
    },
    {
      name: "Favorites",
      href: "/account/favorites",
      icon: Heart,
    },
    {
      name: "Addresses",
      href: "/account/addresses",
      icon: MapPin,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#FAF5F3] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary-brown border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect if not logged in (to prevent flashes of layout)
  if (!user) {
    return null;
  }

  return (
    <div className=" p-10 flex gap-5 flex-col md:flex-row min-h-[calc(100vh-80px)] bg-[#FAF5F3]">
      {/* Sidebar navigation */}
      <aside className="w-full rounded-lg md:w-64 bg-white/60 backdrop-blur-md border-r border-[#78534a]/10 p-6 flex flex-col justify-between shadow-sm">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-gray/60 px-3 mb-4 font-sans">
            Account Management
          </h2>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${isActive
                    ? "bg-brand-primary-brown text-white shadow-md transform scale-[1.02]"
                    : "text-brand-primary-brown hover:bg-brand-primary-brown/5"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign Out Button at the bottom */}
        <div className="mt-8 pt-4 border-t border-[#78534a]/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col justify-stretch">
        <div className="bg-white/80 backdrop-blur-md rounded-lg border border-[#78534a]/10 p-8 shadow-sm flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
