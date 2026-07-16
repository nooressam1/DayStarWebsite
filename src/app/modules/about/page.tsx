import React from "react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | DayStar",
  description: "Learn more about DayStar, your trusted Saudi destination for natural, safe, and premium beauty and wellness products.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-[#faf5f3] overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="w-full bg-[#78534a] text-white flex flex-col-reverse md:flex-row items-center relative overflow-hidden md:h-[450px] lg:h-[520px]">
        {/* Left Column: Content */}
        <div className="w-full md:w-[45%] px-6 sm:px-12 md:pl-20 py-12 md:py-0 flex flex-col justify-center gap-4 text-left z-10">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#faf5f3]">
            About Us
          </h1>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-[#faf5f3]/90 max-w-xl">
            DayStore is your trusted Saudi destination for personal care, beauty, and wellness. We specialize in high-quality, natural, and safe products that support your skin, hair, nails, and overall health—inside and out.
          </p>
        </div>

        {/* Right Column: Semicircular Curved Image */}
        <div className="w-full md:w-[55%] h-[280px] sm:h-[350px] md:h-full relative overflow-hidden rounded-bl-[180px] md:rounded-bl-none md:rounded-l-full self-stretch">
          <Image
            src="/assets/images/AboutHeader.jpg"
            alt="Natural beauty products in a basket"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </section>

      {/* 2. Our Philosophy & Our Products Section */}
      <section className="mx-auto max-w-7xl px-6 sm:px-12 md:px-20 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Left Column: Image with rounded corners */}
        <div className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-[2rem] shadow-sm">
          <Image
            src="/assets/images/AboutImage.jpg"
            alt="Skincare cream application"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Column: Texts */}
        <div className="flex flex-col gap-10 justify-center">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#78534a] mb-3">
              Our Philosophy
            </h2>
            <p className="font-sans text-sm md:text-base text-[#686361] leading-relaxed">
              We believe beauty starts from within. That's why we bring you innovative products that follow the latest global trends—whether it's a daily skincare routine, hair and nail vitamins, or natural supplements for a radiant glow.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#78534a] mb-3">
              Our Products
            </h2>
            <p className="font-sans text-sm md:text-base text-[#686361] leading-relaxed">
              From nourishing creams, oils, and moisturizers to specialized supplements, collagen, and beauty vitamins—we offer everything you need for complete care. With DayStore, you don't just shop, you invest in your confidence.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Our Promise Banner Section */}
      <section className="w-full h-[280px] sm:h-[350px] md:h-[420px] relative flex items-center justify-start overflow-hidden">
        <Image
          src="/assets/images/aboutimage2.jpg"
          alt="Natural organic components background"
          fill
          sizes="100vw"
          className="object-cover w-full h-full"
        />
        {/* Soft overlay for text contrast and readability */}
        <div className="absolute inset-0 bg-[#78534a]/35 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Content Overlay */}
        <div className="relative w-full z-10 px-6 sm:px-12 md:pl-20 max-w-xl sm:max-w-2xl md:max-w-3xl flex flex-col gap-3 text-left">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#faf5f3] tracking-wide">
            Our Promise
          </h2>
          <p className="font-sans text-sm sm:text-base md:text-lg text-white/95 leading-relaxed font-light">
            We're committed to making your shopping experience fast, simple, and enjoyable—with excellent customer service at every step.
          </p>
        </div>
      </section>

      {/* 4. Why choose us? Section */}
      <section className="mx-auto max-w-7xl px-6 sm:px-12 md:px-20 py-16 md:py-24 flex flex-col gap-8 md:gap-12">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#78534a]">
          Why choose us?
        </h2>

        {/* Grid of 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1 */}
          <div className="bg-[#fcf8f6] border border-[#78534a]/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-serif text-lg font-bold text-[#78534a]">
              Natural & Safe ingredients
            </h3>
            <p className="font-sans text-sm text-[#686361] leading-relaxed">
              We believe beauty starts from within. That's why we bring you innovative products that follow the latest global trends—
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#fcf8f6] border border-[#78534a]/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-serif text-lg font-bold text-[#78534a]">
              Premium quality standards
            </h3>
            <p className="font-sans text-sm text-[#686361] leading-relaxed">
              We believe beauty starts from within. That's why we bring you innovative products that follow the latest global trends...
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#fcf8f6] border border-[#78534a]/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-serif text-lg font-bold text-[#78534a]">
              Wide Range of beauty products
            </h3>
            <p className="font-sans text-sm text-[#686361] leading-relaxed">
              We believe beauty starts from within. That's why we bring you innovative products that follow the latest global trends—
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
