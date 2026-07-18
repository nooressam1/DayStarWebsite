import React from "react";
import { LucideIcon } from "lucide-react";

export interface ContactInfoCardProps {
  icon: LucideIcon;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function ContactInfoCard({
  icon: Icon,
  children,
}: ContactInfoCardProps) {
  return (
    <div className="flex items-start gap-4 py-2">
      <Icon size={20} className="text-[#78534a] mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0 text-[#686361] font-sans text-sm">
        {children}
      </div>
    </div>
  );
}
