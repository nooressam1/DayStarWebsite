import { Address } from "./address.type";
import { OrderItem } from "./order-item.type";

export interface OrderItemVariant {
  id: string;
  product_id?: string;
  size?: string;
  stock?: number;
  sku?: string;
  product?: {
    id: string;
    name: string;
    images?: string[];
    full_name?: string;
  };
}

export interface DetailedOrderItem extends OrderItem {
  variants?: OrderItemVariant;
}

export interface Order {
  id: string;
  created_at: string;
  user_id: string;
  address_id: string;
  order_status: string;
  total: number;
  order_number: number;
  discount_amount?: number | null;
  discount_id?: number | null;
  phone_number?: number | string | null;
  full_name?: string | null;
  payment_status?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | string | null;
  payment_method?: string | null;
  email?: string | null;
  addresses?: Address | Address[];
  items?: DetailedOrderItem[];
}

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  error?: string;
  message?: string;
}

export interface CancelOrderResponse {
  success?: boolean;
  message?: string;
  order?: Order;
}

export interface RefundOrderResponse {
  success?: boolean;
  message?: string;
  order?: Order;
}

