export interface Product {
  id: string;
  slug: string;
  name: string;
  images: string[];
  description?: string;
  price: number; // stored in cents (e.g., 1999 for $19.99)
  created_at: string;
  is_active: boolean;
}

export interface Variant {
  id: string;
  product_id: string;
  size: string;
  price: number;
  sku: string;
}