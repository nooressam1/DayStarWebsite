export type Category = {
  id: string;
  name: string;
  photo: string;
  slug: string;
}
export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  images: string[];
  slug: string;
  price: number;
  created_at: string;
  is_active: boolean;
  on_sale?: boolean;          // <-- Add this
  sale_price?: number | null;  // <-- Add this
}


export type Variant = {
  id: string;
  product_id: string;
  size: string;
  stock: number;
  sku: string;
}

export type Address = {
  id: string;
  user_id: string;
  line1: string;
  city: string;
  country: string;
}

export type Profile = {
  id: string;
  username: string;
  role: string;
}

export type orders = {
  id: string;
  order_number: number;
  user_id: string;
  address_id: string;
  status: string;
  total: number;
  created_at: string;
}

export type OrderItem = {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  unit_price_snapshot: number;
}

export type Review = {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}
export type Discount = {
  id: string;
  code: string;
  value: number;
  type: string;
  created_at: string;
  is_active: boolean
}

export type Paginated<T> = {
  items: T[];
  total: number;
}