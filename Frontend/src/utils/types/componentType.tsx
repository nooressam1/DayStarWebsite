import { ButtonHTMLAttributes, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { OrderItem, Product } from "./type";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  variant?: "solid" | "outline";
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
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  incrementItem: (variant_id: string) => void;
  decrementItem: (variant_id: string) => void;
  removeFromCart: (variant_id: string) => void;
}

export interface CartItemCardProps extends CartItem {
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}


export interface QuantityButtonProps {
  value: number;
  onDecrement?: () => void;
  onIncrement?: () => void;
}
