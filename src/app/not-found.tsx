import React from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/modules/shared";
import { AuthModal } from "@/modules/auth";
import { ArrowLeft, ShoppingBag, Sparkles, Home, Mail, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[75vh] bg-[#FAF5F3] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 font-sans relative overflow-hidden">
        {/* Soft background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary-brown/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-2xl text-center relative z-10 flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary-brown/10 text-brand-primary-brown text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lost in Radiance</span>
          </div>

          {/* 404 Heading */}
          <h1 className="font-serif text-7xl sm:text-9xl font-bold text-brand-primary-brown tracking-tight leading-none drop-shadow-xs">
            404
          </h1>

          {/* Subheading */}
          <h2 className="mt-4 font-serif text-2xl sm:text-3xl text-[#5c3d35] font-normal">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="mt-3 font-sans text-sm sm:text-base text-stone-600 max-w-md leading-relaxed">
            The page you are looking for might have been moved, removed, or is temporarily unavailable. Let&apos;s get your routine back on track.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary-brown hover:bg-[#5c3d35] text-white font-medium text-sm rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/product"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-brand-primary-brown border border-stone-200 font-medium text-sm rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>

          {/* Quick Helpful Navigation Links */}
          <div className="mt-12 pt-8 border-t border-brand-primary-brown/10 w-full flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
            <Link href="/about" className="hover:text-brand-primary-brown transition-colors">
              About DayStar
            </Link>
            <span>•</span>
            <Link href="/skincare-test" className="hover:text-brand-primary-brown transition-colors">
              Take Skin Test
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-brand-primary-brown transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <AuthModal />
    </>
  );
}
