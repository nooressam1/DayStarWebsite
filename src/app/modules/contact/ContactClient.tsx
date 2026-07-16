'use client';

import React from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "./ContactForm";
import ContactInfoCard from "./ContactInfoCard";

export default function ContactClient() {
  return (
    <div className="flex flex-col  w-full bg-[#faf5f3] overflow-x-hidden min-h-[80vh]">
      {/* 1. Hero Section */}
      <section className="w-full h-[320px] sm:h-[360px] md:h-[400px] relative flex flex-col justify-center items-center px-6 text-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/assets/images/headerimage.jpg"
          alt="Natural organic components background"
          fill
          sizes="100vw"
          className="object-cover w-full h-full"
          priority
        />
        {/* Soft elegant brand color overlay to ensure readability */}
        <div className="absolute inset-0 bg-[#78534a]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#004956]/20" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 max-w-3xl flex flex-col gap-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#faf5f3] ">
            Contact Us
          </h1>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-[#faf5f3]/95 max-w-xl mx-auto ">
            Have questions about our skincare ranges, orders, or delivery? Reach out to our dedicated support team, we're here to help you shine.
          </p>
        </div>
      </section>

      {/* 2. Main content split section */}
      <section className="mx-auto max-w-8xl w-full px-6 sm:px-12 md:px-20 py-16 md:py-24 flex justify-center">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 w-full justify-center items-center lg:items-center max-w-6xl">

          {/* Left Column: Contact Information */}
          <div className="w-full flex  lg:w-1/2 flex flex-col gap-8 max-w-md">
            <div className="flex flex-col gap-3">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#78534a]">
                Get in Touch
              </h2>
              <p className="font-sans text-sm md:text-base text-[#686361] leading-relaxed">
                We values our customers' voices. Feel free to contact us via WhatsApp, phone, email, or by filling out the form.
              </p>
            </div>

            {/* Contact details list */}
            <div className="flex flex-col gap-2">

              {/* WhatsApp & Call */}
              <ContactInfoCard icon={Phone}>
                <div className="flex flex-col gap-1 text-sm">
                  <a
                    href="tel:+966551998064"
                    className="hover:text-[#78534a] transition-colors font-medium text-[#686361]"
                  >
                    +966 55 199 8064
                  </a>
                  <a
                    href="https://wa.me/966551998064"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#78534a] transition-colors text-xs text-[#686361]/80 inline-flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Chat on WhatsApp
                  </a>
                </div>
              </ContactInfoCard>

              {/* Email Support */}
              <ContactInfoCard icon={Mail}>
                <a
                  href="mailto:support@daystar.sa"
                  className="hover:text-[#78534a] transition-colors font-medium text-sm text-[#686361]"
                >
                  support@daystar.sa
                </a>
              </ContactInfoCard>

              {/* Location */}
              <ContactInfoCard icon={MapPin}>
                <span className="text-sm font-medium text-[#686361] leading-relaxed">
                  King Fahd Branch Rd, Al Rahmaniyah, Riyadh 12343, Saudi Arabia
                </span>
              </ContactInfoCard>

              {/* Working Hours */}
              <ContactInfoCard icon={Clock}>
                <span className="text-sm font-medium text-[#686361]">
                  Sun – Thu: 9:00 AM – 6:00 PM (Fri: Closed)
                </span>
              </ContactInfoCard>

            </div>
          </div>

          {/* Right Column: Contact Form Component */}
          <div className="w-full lg:w-1/2 max-w-xl">
            <ContactForm />
          </div>

        </div>
      </section>
    </div>
  );
}
