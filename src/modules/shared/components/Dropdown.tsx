import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  className?: string;
  dropdownClassName?: string;
  children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  isOpen,
  onToggle,
  className = "",
  dropdownClassName = "",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => onToggle(!isOpen)}
        className={`px-5 py-2.5 border rounded-md text-xs font-sans font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${isOpen
          ? "border-[#78534a] bg-[#78534a]/5"
          : "border-[#78534a]/20  hover:border-[#78534a]"
          } ${className}`}
      >
        <span>{label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 mt-2 bg-white border border-[#78534a]/10 rounded-md shadow-xl z-30 animate-in fade-in-50 duration-150 ${dropdownClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
