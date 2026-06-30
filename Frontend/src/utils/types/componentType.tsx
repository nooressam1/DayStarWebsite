import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Discount, OrderItem, Product } from "./type";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  variant?: "solid" | "outline" | "opacity";
  colorScheme?: "primary" | "secondary" | "dark";
}

export interface ProductCarouselProps {
  images: string[];
  productName: string;
}


export interface CartItem extends Pick<OrderItem, "variant_id" | "quantity"> {
  product_id: string;
  name: string;
  price: number;
  size: string; // e.g., "50ml" (from variants.size)
  photo: string;

}

export interface CartState {
  cart: CartItem[];
  discount: Discount | null; // 🟢 Add this
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  incrementItem: (variant_id: string) => void;
  decrementItem: (variant_id: string) => void;
  removeFromCart: (variant_id: string) => void;
  clearCart: () => void;
  setDiscount: (discount: Discount | null) => void; // 🟢 Add this

}

export interface CartItemCardProps extends CartItem {
  isEditable?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}


export interface QuantityButtonProps {
  value: number;
  onDecrement?: () => void;
  onIncrement?: () => void;
}

export interface categoryProps {
  photo: string;
  categoryName: string;
}


export interface OrderConfirmedPageProps {
  params: Promise<{ id: string }>;
}
export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
export interface SelectionCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  title: string;
  description: string;
}
export interface DropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  className?: string;
  dropdownClassName?: string;
  children: React.ReactNode;
}
