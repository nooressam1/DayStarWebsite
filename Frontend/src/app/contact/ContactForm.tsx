'use client';

import React from "react";
import { CheckCircle, Loader2, Send } from "lucide-react";
import TextInput from "@/app/modules/shared/component/TextInput";
import { useContactForm } from "./useContactForm";

export default function ContactForm() {
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useContactForm();

  return (
    <div className="bg-[#fcf8f6] border border-[#78534a]/10 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#78534a]/5 rounded-bl-full pointer-events-none" />

      {/* Form header */}
      <div className="mb-8 relative z-10">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#78534a] mb-2">
          Send us a Message
        </h2>
        <p className="text-[#686361] font-sans text-xs sm:text-sm">
          Fill out the form below and our team will get back to you as soon as possible.
        </p>
      </div>

      {isSuccess ? (
        /* Success Message State */
        <div className="py-12 flex flex-col items-center justify-center text-center gap-6 animate-fade-in relative z-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle size={36} className="animate-scale-in" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-serif text-2xl font-bold text-[#78534a]">Message Sent!</h3>
            <p className="text-[#686361] font-sans text-sm max-w-md">
              Thank you for contacting DayStar. Your message has been successfully received, and our support team will reach back to you via email within 24 hours.
            </p>
          </div>
          <button
            onClick={resetForm}
            className="mt-4 px-6 py-2.5 bg-[#78534a] hover:bg-[#78534a]/90 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg cursor-pointer font-sans"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        /* Interactive Form State */
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          
          {/* Name Input */}
          <TextInput
            id="name"
            name="name"
            label="Full Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />

          {/* Email Input */}
          <TextInput
            id="email"
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />

          {/* Subject Input */}
          <TextInput
            id="subject"
            name="subject"
            label="Subject"
            placeholder="What is this regarding?"
            value={formData.subject}
            onChange={handleInputChange}
            error={errors.subject}
            required
          />

          {/* Message Input (TextArea) */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="message" className="text-[#78534a] font-sans text-sm font-medium">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell us what you need help with..."
              value={formData.message}
              onChange={handleInputChange}
              required
              className={`rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors font-sans w-full min-h-[120px] resize-y ${
                errors.message
                  ? "border-red-500 focus:border-red-500"
                  : "border-brand-primary-brown/20 focus:border-brand-primary-brown"
              }`}
            />
            {errors.message && (
              <span className="text-xs text-red-500 font-sans mt-0.5">{errors.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-[#78534a] hover:bg-[#78534a]/90 text-white rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer font-sans"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
