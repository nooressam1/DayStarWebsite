import { create } from "zustand";

export type AuthModalView = "login" | "register";

interface AuthModalState {
  isOpen: boolean;
  view: AuthModalView;
  openModal: (view?: AuthModalView) => void;
  closeModal: () => void;
  setView: (view: AuthModalView) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  view: "login",
  openModal: (view = "login") => set({ isOpen: true, view }),
  closeModal: () => set({ isOpen: false }),
  setView: (view) => set({ view }),
}));
