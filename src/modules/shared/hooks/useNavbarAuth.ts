"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-provider";

import { useAuthModalStore } from "@/modules/auth/hooks/useAuthModalStore";

export function useNavbarAuth() {
  const router = useRouter();
  const { isOpen: authOpen, openModal, closeModal } = useAuthModalStore();
  const setAuthOpen = (open: boolean) => open ? openModal("login") : closeModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    router.refresh();
  };

  return {
    user,
    authOpen,
    setAuthOpen,
    dropdownOpen,
    setDropdownOpen,
    handleMouseEnter,
    handleMouseLeave,
    handleSignOut,
  };
}
