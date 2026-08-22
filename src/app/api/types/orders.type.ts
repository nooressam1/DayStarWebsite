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
  order_number: number;
  user_id: string;
  address_id: string;
  status: string;
  total: number;
  created_at: string;
  discount_amount?: number;
  full_name?: string;
  phone_number?: string;
  email?: string;
  payment_method?: string;
  payment_status?: string;
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
