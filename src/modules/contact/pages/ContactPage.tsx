import React from "react";
import ContactClient from "../components/ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | DayStar",
  description: "Get in touch with the DayStar support team. We are here to help with any questions regarding skincare ranges, orders, delivery, or general inquiries.",
};

export default function ContactPage() {
  return <ContactClient />;
}
