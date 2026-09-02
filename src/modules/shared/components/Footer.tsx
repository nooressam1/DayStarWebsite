'use client';

import React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useAuthModalStore } from "@/app/api/hooks/useAuthModalStore";

export function Footer() {
  const { user } = useAuth();
  const { openModal } = useAuthModalStore();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    requireAuth?: boolean
  ) => {
    if (requireAuth && !user) {
      e.preventDefault();
      openModal("login");
    }
  };

  return (
    <footer id="contact" className="w-full mt-16 md:mt-24 lg:mt-28 bg-[#E7DCDA] border-t border-brand-primary-brown/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 sm:pt-14 pb-8 flex flex-col gap-10 sm:gap-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8">
          {/* Column 1: Brand & Description (4 cols on lg, full on sm) */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-3.5 text-center sm:text-left items-center sm:items-start">
            <Link href="/" className="inline-block">
              <span className="font-serif font-bold text-2xl sm:text-3xl tracking-widest text-brand-primary-brown uppercase">
                DAYSTAR
              </span>
            </Link>
            <p className="text-sm text-[#8A756C] font-sans leading-relaxed max-w-sm">
              Curated Korean & global skincare formulated to nourish, protect, and illuminate your skin every day.
            </p>
          </div>

          {/* Links Wrapper for Mobile (takes 2 columns side-by-side on mobile/tablet) */}
          <div className="sm:col-span-2 lg:col-span-5 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Column 2: Quick Links */}
            <div className="flex flex-col gap-3 text-left">
              <h3 className="font-serif font-bold text-base text-brand-primary-brown">
                Explore
              </h3>
              <nav className="flex flex-col gap-2.5">
                {[
                  { label: "All Products", href: "/product" },
                  { label: "Skin Routine Quiz", href: "/skincare-test" },
                  { label: "My Cart", href: "/cart" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-[#8A756C] hover:text-brand-primary-brown transition-all hover:translate-x-0.5 inline-block font-sans"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 3: Customer Care */}
            <div className="flex flex-col gap-3 text-left">
              <h3 className="font-serif font-bold text-base text-brand-primary-brown">
                Customer Care
              </h3>
              <nav className="flex flex-col gap-2.5">
                {[
                  { label: "My Account", href: "/account", requireAuth: true },
                  { label: "Saved Addresses", href: "/account/addresses", requireAuth: true },
                  { label: "Order History", href: "/account/orders", requireAuth: true },
                  { label: "Contact & Support", href: "/contact", requireAuth: false },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.requireAuth)}
                    className="text-sm text-[#8A756C] hover:text-brand-primary-brown transition-all hover:translate-x-0.5 inline-block font-sans cursor-pointer"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Column 4: Contact Us (3 cols on lg, full on sm) */}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-3 text-center sm:text-left items-center sm:items-start">
            <h3 className="font-serif font-bold text-base text-brand-primary-brown">
              Contact Us
            </h3>
            {/* Direct Contact Links */}
            <div className="flex flex-col gap-2.5 pt-0.5 items-center sm:items-start">
              <a
                href="https://wa.me/966551998064"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs sm:text-sm text-[#8A756C] hover:text-brand-primary-brown transition-colors font-medium"
              >
                <svg className="w-4 h-4 fill-current text-emerald-700 shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp: +966 55 199 8064
              </a>
              <a
                href="tel:+966551998064"
                className="flex items-center gap-2 text-xs sm:text-sm text-[#8A756C] hover:text-brand-primary-brown transition-colors font-medium"
              >
                <Phone size={14} className="text-brand-primary-brown shrink-0" />
                +966 55 199 8064
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-brand-primary-brown/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A756C] text-center sm:text-left">
          <p className="font-sans">
            © {new Date().getFullYear()} DayStar Skincare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
