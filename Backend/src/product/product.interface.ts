export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  images: string[];
  slug: string;
  price: number;
  created_at: string;
  is_active: boolean;
  on_sale?: boolean;         // <-- Add this
  sale_price?: number | null; // <-- Add this
}

export interface Variant {
  id: string;
  product_id: string;
  size: string;
  price: number;
  sku: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  body: string;
  comment?: string | null;
  title: string;
  created_at?: string;
  date: string;
  timestamp: number;
  profile?: {
    username: string;
  };
}


